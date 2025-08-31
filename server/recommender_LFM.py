import os
import numpy as np
from flask import Flask, jsonify, request
from lightfm import LightFM
from scipy.sparse import coo_matrix


from server.db import db
from server.models import User, Group, Swipe  


app = Flask(__name__)


app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL", "sqlite:///./app.db")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)

# Hyperarameters
EPOCHS = int(os.getenv("LFM_EPOCHS", "20"))
NO_COMPONENTS = int(os.getenv("LFM_NO_COMPONENTS", "64"))
LEARNING_RATE = float(os.getenv("LFM_LEARNING_RATE", "0.05"))
NUM_THREADS = int(os.getenv("LFM_NUM_THREADS", "8"))

# In memory model state
model = None
user_to_idx = {}
item_to_idx = {}
idx_to_item = []

# Helpers
def fetch_ids():
    users = db.session.query(User.id).all()
    groups = db.session.query(Group.id).all()
    return [u[0] for u in users], [g[0] for g in groups]

def fetch_swipes():
    rows = db.session.query(Swipe.sender_id, Swipe.receiver_id).all()
    return [(r[0], r[1]) for r in rows]

def fetch_user_group(user_id):
    u = db.session.get(User, user_id)
    return u.group_id if u else None

def fetch_user_swiped_groups(user_id):
    rows = db.session.query(Swipe.receiver_id).filter(Swipe.sender_id == user_id).all()
    return {r[0] for r in rows}

# Train 
def train_lightfm():
    global model, user_to_idx, item_to_idx, idx_to_item

    user_ids, group_ids = fetch_ids()
    user_to_idx = {uid: i for i, uid in enumerate(user_ids)}
    item_to_idx = {gid: j for j, gid in enumerate(group_ids)}
    idx_to_item = group_ids[:]

    m, n = len(user_ids), len(group_ids)
    if m == 0 or n == 0:
        model = LightFM(loss="warp", no_components=NO_COMPONENTS, learning_rate=LEARNING_RATE)
        return

    swipes = fetch_swipes()
    if swipes:
        rows, cols = [], []
        for u, g in swipes:
            if u in user_to_idx and g in item_to_idx:
                rows.append(user_to_idx[u])
                cols.append(item_to_idx[g])
        data = np.ones(len(rows), dtype=np.float32)
        interactions = coo_matrix((data, (rows, cols)), shape=(m, n)).tocsr()
    else:
        interactions = coo_matrix((m, n), dtype=np.int32).tocsr()

    model = LightFM(loss="warp", no_components=NO_COMPONENTS, learning_rate=LEARNING_RATE)
    model.fit(interactions, epochs=EPOCHS, num_threads=NUM_THREADS)

def recommend_one(user_id):
    if model is None:
        return None

    if user_id not in user_to_idx:
        return None

    uidx = user_to_idx[user_id]
    n_items = len(idx_to_item)
    if n_items == 0:
        return None

    scores = model.predict(uidx, np.arange(n_items, dtype=np.int32), num_threads=NUM_THREADS)

    my_gid = fetch_user_group(user_id)
    swiped = fetch_user_swiped_groups(user_id)

    best_gid, best_score = None, -1e9
    for j, s in enumerate(scores):
        gid = idx_to_item[j]
        if my_gid is not None and gid == my_gid:
            continue
        if gid in swiped:
            continue
        if s > best_score:
            best_gid, best_score = gid, float(s)

    if best_gid is None:
        return None
    return best_gid, best_score

@app.route("/health", methods=["GET"])
def health():
    try:
        users = db.session.query(User.id).count()
        groups = db.session.query(Group.id).count()
        return jsonify({"ok": True, "users": users, "groups": groups, "trained": model is not None})
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500

@app.route("/train", methods=["POST"])
def train_endpoint():
    try:
        with app.app_context():
            train_lightfm()
        return jsonify({"status": "ok", "users_indexed": len(user_to_idx), "groups_indexed": len(item_to_idx)})
    except Exception as e:
        db.session.rollback()
        return jsonify({"status": "error", "error": str(e)}), 500

@app.route("/recommend", methods=["GET"])
def recommend_endpoint():
    user_id = request.args.get("user_id", type=int)
    if not user_id:
        return jsonify({"error": "user_id is required"}), 400

    with app.app_context():
        rec = recommend_one(user_id)

    if rec is None:
        return jsonify({"user_id": user_id, "recommendation": None})
    gid, score = rec
    return jsonify({"user_id": user_id, "group_id": gid, "score": round(score, 5)})

if __name__ == "__main__":
    with app.app_context():
        pass
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", "8001")), debug=True)
