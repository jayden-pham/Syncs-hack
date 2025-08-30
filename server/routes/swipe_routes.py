from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity
from sqlalchemy.exc import IntegrityError
from sqlalchemy import delete
from server.app import db
from server.models.group import Group
from server.models.user import User
from server.models.swipe import Swipe
from server.models.chat import Chat


swipe_bp = Blueprint("swipes", __name__)

@swipe_bp.post("/dev/login")
def dev_login():
    data = request.get_json(force=True)
    uid = int(data.get("user_id", 1))
    name = data.get("name", f"user-{uid}")
    token = create_access_token(identity=str(uid), additional_claims={"name": name})
    g1 = Group(id=1, name="Group 1", description="The first group")
    g2 = Group(id=2, name="Group 2", description="The second group")
    g3 = Group(id=3, name="Group 3", description="The third group")
    u1 = User(id=1, username = "1", password_hash = "1", name = "u1", group_id=1)
    u2 = User(id=2, username = "2", password_hash = "2", name = "u2", group_id=2)
    u3 = User(id=3, username = "3", password_hash = "3", name = "u3", group_id=3)
    u4 = User(id=4, username = "4", password_hash = "4", name = "u4", group_id=3)
    for x in [g1, g2, g3, u1, u2, u3, u4]:
        db.session.add(x)
    db.session.flush()
    db.session.commit()
    return jsonify({"access_token": token})

@swipe_bp.post("/<int:sid>/<int:rid>")
def swipe_group(sid, rid):
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