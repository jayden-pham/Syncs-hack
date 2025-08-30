# recommender_lightfm.py
from fastapi import FastAPI
from typing import List, Dict, Any
import numpy as np
from lightfm import LightFM
from lightfm.data import Dataset
from scipy.sparse import csr_matrix

from app.database import SessionLocal
from app.models import User, Group, Swipe

app = FastAPI(title="LightFM Recommender", version="0.1.0")


model: LightFM = None
user_map: Dict[int, int] = {}   
group_map: Dict[int, int] = {}  
rev_group_map: Dict[int, int] = {}  


def build_dataset(db):
    """Build LightFM Dataset from users, groups, swipes"""
    users = db.query(User).all()
    groups = db.query(Group).all()
    swipes = db.query(Swipe).all()

    dataset = Dataset()

    dataset.fit(
        (str(u.id) for u in users),
        (str(g.id) for g in groups)
    )

    (interactions, _) = dataset.build_interactions(
        ((str(s.sender_id), str(s.receiver_id)) for s in swipes)
    )

    user_map = {u.id: dataset.mapping()[0][str(u.id)] for u in users}
    group_map = {g.id: dataset.mapping()[2][str(g.id)] for g in groups}
    rev_group_map = {v: k for k, v in group_map.items()}

    return dataset, interactions, user_map, group_map, rev_group_map

def train_model(interactions):
    """Train LightFM WARP model"""
    model = LightFM(loss="warp", no_components=64, learning_rate=0.05)
    model.fit(interactions, epochs=20, num_threads=4)
    return model

def recommend_for_user(user_id: int, k: int = 5):
    """Get top-k group recommendations for this user"""
    if model is None:
        return []

    if user_id not in user_map:
        return []

    user_idx = user_map[user_id]
    scores = model.predict(user_idx, np.arange(len(group_map)))
    topk = np.argsort(-scores)[:k]
    return [{"group_id": rev_group_map[i], "score": float(scores[i])} for i in topk]


@app.post("/train")
def train():
    """Rebuild dataset + train LightFM model"""
    global model, user_map, group_map, rev_group_map
    db = SessionLocal()
    try:
        dataset, interactions, user_map, group_map, rev_group_map = build_dataset(db)
        model = train_model(interactions)
        return {"status": "ok", "users": len(user_map), "groups": len(group_map)}
    finally:
        db.close()

@app.get("/recommend")
def recommend(user_id: int, k: int = 5):
    """Return top-k recommended groups for a user"""
    recs = recommend_for_user(user_id, k)
    return {"user_id": user_id, "recommendations": recs}
