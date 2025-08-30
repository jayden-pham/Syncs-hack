# server/group_routes.py
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity
from sqlalchemy.exc import IntegrityError
from sqlalchemy import delete, func
from server.db import db
from server.models.group import Group
from server.models.user import User


group_bp = Blueprint("groups", __name__)

@group_bp.post("/dev/login")
def dev_login():
    data = request.get_json(force=True)
    uid = int(data.get("user_id", 1))
    name = data.get("name", f"user-{uid}")

    # Try to reuse the same user; create only if missing
    u = db.session.get(User, uid)  # SQLAlchemy 2.0 style; or User.query.get(uid) in 1.x
    if u is None:
        u = User(
            id=uid,
            username=f"user-{uid}",   # avoid unique collisions on username
            password_hash="xyz",
            name=name,
        )
        db.session.add(u)
    else:
        # optional: keep dev info fresh
        u.name = name

    db.session.commit()  # flush happens here

    ensure_user_has_group(u.id)  # if this writes, consider wrapping in same txn
    token = create_access_token(identity=str(u.id), additional_claims={"name": u.name})
    return jsonify({"access_token": token})

@group_bp.get("/me")
@jwt_required()
def my_group():
    uid = get_current_user_id()
    gid = ensure_user_has_group(uid)
    g = Group.query.get(gid)
    members = User.query.filter_by(group_id=gid).all()
    return jsonify({
        "group": g.to_card(),
        "members": [{"user_id": m.id, "name": m.name} for m in members],
    })

@group_bp.patch("/me")
@jwt_required()
def update_my_group():
    uid = get_current_user_id()
    gid = ensure_user_has_group(uid)
    g = Group.query.get(gid)
    if not g: return api_error("Group not found", 404)
    data = request.get_json(force=True)
    for f in ["name","description"]:
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
            g = Group(name=f"User {uid}'s group", description="Solo after leave")
            User.query.filter_by(id=uid).first().group_id = g.id
            db.session.add(g); db.session.flush()
            if User.query.filter_by(id=gid).count() == 0:
                delete(Group).where(Group.c.id == gid)
        return jsonify({"new_group_id": g.id})
    except IntegrityError:
        db.session.rollback()
        return api_error("Constraint error while leaving group", 409)

@group_bp.get("/<int:group_id>")
def get_group_card(group_id: int):
    g = Group.query.get(group_id)
    if not g: return api_error("Group not found", 404)
    return jsonify({"group": g.to_card()})

def api_error(msg, code=400):
    resp = jsonify({"error": msg}); resp.status_code = code; return resp

def get_current_user_id() -> int:
    from flask_jwt_extended import get_jwt_identity
    uid = get_jwt_identity()
    if not uid: raise RuntimeError("No user in JWT")
    return int(uid)

def get_current_group_id(uid: int):
    gid = User.query.filter_by(id=uid).first().group_id
    return gid

def ensure_user_has_group(user: User, max_size: int | None = None):
    if user.group_id:
        return

    # Find the group with the fewest users (or none exist yet)
    subq = (
        db.session.query(User.group_id, func.count(User.id).label("n"))
        .group_by(User.group_id)
        .subquery()
    )
    g = (
        db.session.query(Group)
        .outerjoin(subq, Group.id == subq.c.group_id)
        .order_by(func.coalesce(subq.c.n, 0).asc(), Group.id.asc())
        .first()
    )

    if g is None:
        g = Group(name="Group 1", description="Auto-created")
        db.session.add(g)
        db.session.flush()

    # If you want a cap per group, create a new one when full
    if max_size is not None:
        current_count = (
            db.session.query(func.count(User.id))
            .filter(User.group_id == g.id)
            .scalar()
        )
        if current_count >= max_size:
            g = Group(name=f"Group {g.id + 1}", description="Auto-created")
            db.session.add(g)
            db.session.flush()

    user.group = g
