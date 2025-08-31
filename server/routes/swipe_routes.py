from __future__ import annotations
from typing import Dict, List, Tuple
from random import shuffle

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity
from sqlalchemy.exc import IntegrityError

from server.app import db
from server.models.group import Group
from server.models.user import User
from server.models.swipe import Swipe
from server.models.chat import Chat

swipe_bp = Blueprint("swipes", __name__)

CANDIDATES: Dict[int, List[Tuple[int, float]]] = {}

def _avg_budget(u: User) -> float:
    return ((u.min_budget or 0) + (u.max_budget or 0)) / 2.0

def _safe_group_card(g: Group) -> dict:
    if hasattr(g, "to_card") and callable(getattr(g, "to_card")):
        return g.to_card()
    return {"id": g.id, "name": getattr(g, "name", f"Group {g.id}"), "description": getattr(g, "description", "") or ""}

def _safe_user_public(u: User) -> dict:
    if hasattr(u, "public_profile") and callable(getattr(u, "public_profile")):
        return u.public_profile()
    return {"id": u.id, "name": getattr(u, "name", f"user-{u.id}") or "", "age": getattr(u, "age", None)}

def build_candidate_list(for_uid: int) -> None:
    u = User.query.get(int(for_uid))
    if not u:
        CANDIDATES[for_uid] = []
        return

    user_score = _avg_budget(u)
    groups = Group.query.all()
    shuffle(groups)

    pairs: List[Tuple[int, float]] = []
    for g in groups:
        if g.id == u.group_id:
            continue
        members: List[User] = User.query.filter_by(group_id=g.id).all()
        if not members:
            continue
        total = 0.0
        for m in members:
            total += _avg_budget(m)
        avg = total / len(members)
        score = abs(user_score - avg)
        pairs.append((g.id, score))

    pairs.sort(key=lambda x: x[1])
    CANDIDATES[for_uid] = pairs

def _check_mutual_swipe(sender_user_id: int, receiver_group_id: int) -> bool:
    sender = User.query.get(sender_user_id)
    if not sender:
        return False

    # Everyone in sender's group except sender swiped receiver group
    for member in User.query.filter_by(group_id=sender.group_id).all():
        if member.id == sender_user_id:
            continue
        if not Swipe.query.filter_by(sender_id=member.id, receiver_id=receiver_group_id).first():
            return False

    # Everyone in receiver group swiped sender's group id
    for member in User.query.filter_by(group_id=receiver_group_id).all():
        if not Swipe.query.filter_by(sender_id=member.id, receiver_id=sender.group_id).first():
            return False

    return True

# --------- Routes ---------
@swipe_bp.post("/dev/login")
def dev_login():
    data = request.get_json(force=True) or {}
    uid = int(data.get("user_id", 1))
    name = data.get("name", f"user-{uid}")

    token = create_access_token(identity=str(uid), additional_claims={"name": name})

    objs = [
        Group(id=1, name="Group 1", description="The first group"),
        Group(id=2, name="Group 2", description="The second group"),
        Group(id=3, name="Group 3", description="The third group"),
        Group(id=4, name="Group 4", description="The fourth group"),
        Group(id=5, name="Group 5", description="The fifth group"),
        User(id=1, username="1", password_hash="1", name="u1", min_budget=100,  max_budget=400,  group_id=1),
        User(id=2, username="2", password_hash="2", name="u2", min_budget=200,  max_budget=300,  group_id=2),
        User(id=3, username="3", password_hash="3", name="u3", min_budget=100,  max_budget=900,  group_id=3),
        User(id=4, username="4", password_hash="4", name="u4", min_budget=800,  max_budget=1200, group_id=3),
        User(id=5, username="5", password_hash="5", name="u5", min_budget=500,  max_budget=700,  group_id=4),
        User(id=6, username="6", password_hash="6", name="u6", min_budget=600,  max_budget=800,  group_id=5),
    ]
    try:
        for obj in objs:
            db.session.merge(obj)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()

    build_candidate_list(uid)
    return jsonify({"access_token": token})

@swipe_bp.get("/")
@jwt_required()
def view_candidate():
    uid = int(get_jwt_identity())
    queue = CANDIDATES.get(uid)
    if not queue:
        build_candidate_list(uid)
        queue = CANDIDATES.get(uid, [])

    if not queue:
        return jsonify({"group": None, "members": []})

    gid = queue[0][0]  # peek
    g = Group.query.get(gid)
    if not g:
        build_candidate_list(uid)
        queue = CANDIDATES.get(uid, [])
        if not queue:
            return jsonify({"group": None, "members": []})
        gid = queue[0][0]
        g = Group.query.get(gid)

    members = User.query.filter_by(group_id=gid).all()
    return jsonify({"group": _safe_group_card(g), "members": [_safe_user_public(m) for m in members]})

@swipe_bp.post("/")
@jwt_required()
def swipe_group():
    uid = int(get_jwt_identity())

    queue = CANDIDATES.get(uid)
    if not queue:
        build_candidate_list(uid)
        queue = CANDIDATES.get(uid, [])
    if not queue:
        return jsonify({"sender_id": uid, "receiver_id": None, "match": False})

    gid = queue.pop(0)[0]

    s = Swipe(sender_id=uid, receiver_id=gid)
    db.session.add(s)
    db.session.flush()
    db.session.commit()

    if _check_mutual_swipe(uid, gid):
        sender = User.query.get(uid)
        chat = Chat(group1_id=min(sender.group_id, gid), group2_id=max(sender.group_id, gid))
        db.session.add(chat)
        db.session.flush()
        db.session.commit()
        return jsonify({"sender_id": uid, "receiver_id": gid, "match": True, "chat_id": chat.id})

    return jsonify({"sender_id": uid, "receiver_id": gid, "match": False})

