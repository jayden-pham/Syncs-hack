from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity
from sqlalchemy.exc import IntegrityError
from sqlalchemy import delete
from random import shuffle
from server.app import db
from server.models.group import Group
from server.models.user import User
from server.models.swipe import Swipe, Candidate
from server.models.chat import Chat

swipe_bp = Blueprint("swipes", __name__)

CANDIDATES = []

@swipe_bp.post("/dev/login")
def dev_login():
    data = request.get_json(force=True)
    uid = int(data.get("user_id", 1))
    name = data.get("name", f"user-{uid}")
    token = create_access_token(identity=str(uid), additional_claims={"name": name})
    g1 = Group(id=1, name="Group 1", description="The first group")
    g2 = Group(id=2, name="Group 2", description="The second group")
    g3 = Group(id=3, name="Group 3", description="The third group")
    g4 = Group(id=4, name="Group 4", description="The fourth group")
    g5 = Group(id=5, name="Group 5", description="The fifth group")
    u1 = User(id=1, username = "1", password_hash = "1", name = "u1", min_budget = 100, max_budget = 400, group_id=1)
    u2 = User(id=2, username = "2", password_hash = "2", name = "u2", min_budget = 200, max_budget = 300,group_id=2)
    u3 = User(id=3, username = "3", password_hash = "3", name = "u3", min_budget = 100, max_budget = 900,group_id=3)
    u4 = User(id=4, username = "4", password_hash = "4", name = "u4", min_budget = 800, max_budget = 1200,group_id=3)
    u5 = User(id=5, username = "5", password_hash = "5", name = "u5", min_budget = 500, max_budget = 700,group_id=4)
    u6 = User(id=6, username = "6", password_hash = "6", name = "u6", min_budget = 600, max_budget = 800,group_id=5)
    for x in [g1, g2, g3, g4, g5, u1, u2, u3, u4, u5, u6]:
        db.session.add(x)
    db.session.flush()
    db.session.commit()
    build_candidate_list()
    return jsonify({"access_token": token})


@swipe_bp.post("/")
@jwt_required()
def swipe_group():
    sid = get_jwt_identity()
    if CANDIDATES == []:
        build_candidate_list()
    rid = CANDIDATES.pop(0)[0]
    s = Swipe(sender_id=sid, receiver_id=rid)
    db.session.add(s); db.session.flush()
    db.session.commit()
    if check_mutual_swipe(sid, rid):
        chat = Chat(group1_id=min(sid, rid), group2_id=max(sid, rid))
        db.session.add(chat)
        db.session.flush()
        db.session.commit()
        return jsonify({"sender_id": sid, "receiver_id": rid, "match": True, "chat_id": chat.id})
    return jsonify({"sender_id": sid, "receiver_id": rid, "match": False})

@swipe_bp.get("/")
def view_candidate():
    rid = CANDIDATES[0][0]
    g = Group.query.get(rid)
    members = User.query.filter_by(group_id=rid).all()
    return jsonify({
        "group": g.to_card(),
        "members": [m.to_card() for m in members]
    })

def check_mutual_swipe(sid, rid):
    sender = User.query.get(sid)
    for member in User.query.filter_by(group_id=sender.group_id).all():
        if member.id == sid:
            continue
        if not Swipe.query.filter_by(sender_id=member.id, receiver_id=rid).first():
            return False
    for member in User.query.filter_by(group_id=rid).all():
        if member.id == sid:
            continue
        if not Swipe.query.filter_by(sender_id=member.id, receiver_id=sender.group_id).first():
            return False
    return True

@jwt_required()
def build_candidate_list():
    global CANDIDATES
    uid = get_jwt_identity()
    if not uid: raise RuntimeError("No user in JWT")
    u = User.query.get(int(uid))
    u_score = (u.min_budget or 0 + u.max_budget or 0) / 2
    groups = Group.query.all()
    shuffle(groups)
    for x in range(min(len(groups), 5)):
        g = groups[x]
        if g.id == u.group_id:
            continue
        members = User.query.filter_by(group_id=g.id).all()
        score = 0
        for m in members:
            score = (m.min_budget or 0 + m.max_budget or 0) / 2
        score /= len(members)
        score = abs(u_score - score)
        CANDIDATES.append((g.id, score))
    CANDIDATES.sort(key=lambda x: x[1])

