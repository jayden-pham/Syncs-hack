# server/group_routes.py
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity
from sqlalchemy.exc import IntegrityError
from .app import db
from .group import Group, GroupMember
from .extensions import db


group_bp = Blueprint("groups", __name__)

@group_bp.post("/dev/login")
def dev_login():
    data = request.get_json(force=True)
    uid = int(data.get("user_id", 1))
    name = data.get("name", f"user-{uid}")
    token = create_access_token(identity=str(uid), additional_claims={"name": name})
    ensure_user_has_group(uid)
    return jsonify({"access_token": token})

@group_bp.get("/me")
@jwt_required()
def my_group():
    uid = get_current_user_id()
    gid = ensure_user_has_group(uid)
    g = Group.query.get(gid)
    members = GroupMember.query.filter_by(group_id=gid).all()
    return jsonify({
        "group": g.to_card(),
        "members": [{"user_id": m.user_id, "role": m.role, "joined_at": m.joined_at.isoformat()} for m in members],
    })

@group_bp.patch("/me")
@jwt_required()
def update_my_group():
    uid = get_current_user_id()
    gid = ensure_user_has_group(uid)
    g = Group.query.get(gid)
    if not g: return api_error("Group not found", 404)
    data = request.get_json(force=True)
    for f in ["name","description","desired_size","budget_min","budget_max","suburb"]:
        if f in data: setattr(g, f, data[f])
    db.session.commit()
    return jsonify({"group": g.to_card()})

@group_bp.post("/me/leave")
@jwt_required()
def leave_group():
    uid = get_current_user_id()
    gid = get_current_group_id(uid)
    if not gid:
        new_gid = ensure_user_has_group(uid)
        return jsonify({"new_group_id": new_gid, "note": "Created solo group"})
    try:
        with db.session.begin():
            GroupMember.query.filter_by(group_id=gid, user_id=uid).delete()
            g = Group(name=f"User {uid}'s group", description="Solo after leave", created_by_user_id=uid)
            db.session.add(g); db.session.flush()
            db.session.add(GroupMember(group_id=g.id, user_id=uid, role="owner"))
            if GroupMember.query.filter_by(group_id=gid).count() == 0:
                old = Group.query.get(gid)
                if old: old.status = "archived"
        return jsonify({"new_group_id": g.id})
    except IntegrityError:
        db.session.rollback()
        return api_error("Constraint error while leaving group", 409)

@group_bp.get("/<int:group_id>")
def get_group_card(group_id: int):
    g = Group.query.get(group_id)
    if not g or g.status != "active": return api_error("Group not found", 404)
    return jsonify({"group": g.to_card()})

def api_error(msg, code=400):
    resp = jsonify({"error": msg}); resp.status_code = code; return resp

def get_current_user_id() -> int:
    from flask_jwt_extended import get_jwt_identity
    uid = get_jwt_identity()
    if not uid: raise RuntimeError("No user in JWT")
    return int(uid)

def get_current_group_id(uid: int):
    gm = GroupMember.query.filter_by(user_id=uid).first()
    return gm.group_id if gm else None

def ensure_user_has_group(uid: int) -> int:
    gm = GroupMember.query.filter_by(user_id=uid).first()
    if gm: return gm.group_id
    g = Group(name=f"User {uid}'s group", description="Auto-created", created_by_user_id=uid)
    db.session.add(g); db.session.flush()
    db.session.add(GroupMember(group_id=g.id, user_id=uid, role="owner"))
    db.session.commit()
    return g.id
