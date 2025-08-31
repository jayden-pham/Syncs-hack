from flask import Blueprint, request, jsonify
import requests
from server.db import db

# your models
class Swipe(db.Model):
    __tablename__ = 'swipes'
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey('groups.id', ondelete='CASCADE'), nullable=False)

class Candidate(db.Model):
    __tablename__ = 'candidates'
    id = db.Column(db.Integer, primary_key=True)
    group_id = db.Column(db.Integer, db.ForeignKey('groups.id', ondelete='CASCADE'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)

# import User + Group so we can look up profiles
from server.models import User, Group

# Flask blueprint
swipe_bp = Blueprint("swipe", __name__)

# URL of your FastAPI recommender microservice
RECOMMENDER_URL = "http://127.0.0.1:8001"

# --------------------------
# Endpoint: record a swipe
# --------------------------
@swipe_bp.route("/swipe", methods=["POST"])
def swipe():
    data = request.get_json()
    sender_id = data.get("sender_id")
    receiver_id = data.get("receiver_id")

    if not sender_id or not receiver_id:
        return jsonify({"error": "sender_id and receiver_id required"}), 400

    swipe = Swipe(sender_id=sender_id, receiver_id=receiver_id)
    db.session.add(swipe)
    db.session.commit()

    # tell recommender to retrain (can also make this async / periodic in future)
    try:
        requests.post(f"{RECOMMENDER_URL}/train")
    except Exception as e:
        # don't fail if recommender is offline
        print("Warning: recommender retrain failed:", e)

    return jsonify({"status": "swipe recorded", "sender_id": sender_id, "receiver_id": receiver_id})

# --------------------------
# Endpoint: get next card
# --------------------------
@swipe_bp.route("/next_card", methods=["GET"])
def next_card():
    user_id = request.args.get("user_id", type=int)
    if not user_id:
        return jsonify({"error": "user_id required"}), 400

    # ask recommender for the best group
    try:
        resp = requests.get(f"{RECOMMENDER_URL}/recommend", params={"user_id": user_id})
        data = resp.json()
    except Exception as e:
        return jsonify({"error": f"recommender unavailable: {e}"}), 500

    if not data or data.get("group_id") is None:
        return jsonify({"user_id": user_id, "card": None})

    gid = data["group_id"]
    group = db.session.get(Group, gid)
    if not group:
        return jsonify({"user_id": user_id, "card": None})

    return jsonify({"user_id": user_id, "card": group.to_card()})
