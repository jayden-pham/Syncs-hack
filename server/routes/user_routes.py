from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
from sqlalchemy.exc import IntegrityError
from server.db import db
from server.models.user import User
from server.models.group import Group

user_bp = Blueprint("users", __name__)

@user_bp.post("/register")
def register():
    """
    Body:
    {
      "username": "alice",
      "password": "secret",
      "name": "...", "age": 23, "location": "...",
      "min_budget": 300, "max_budget": 500, "bio": "...",
      "group_id": 1   // optional
    }
    """
    data = request.get_json(force=True) or {}

    un = (data.get("username") or "").strip()
    password = (data.get("password") or "").strip()
    if not un or not password:
        return _err("username and password are required", 400)

    u = User(username=un)
    g = Group(name=f"User {un}'s group", description="Auto-created")
    u.set_password(password)

    try:
        db.session.add(u)
        db.session.add(g)
        db.session.flush()
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return _err("username already taken", 409)

    token = create_access_token(identity=str(u.id), additional_claims={"name": u.name})
    return jsonify({"access_token": token})

@user_bp.get("/me")
@jwt_required()
def me():
    uid = int(get_jwt_identity())
    u = User.query.get(uid)
    if not u:
        return _err("user not found", 404)
    return jsonify({"user": u.public_profile()})

@user_bp.patch("/me")
@jwt_required()
def update_me():
    """
    Body (any subset):
    { "name": "...", "age": 24, "location": "...", "min_budget": 400, "max_budget": 600,
      "bio": "...", "group_id": 2, "password": "newpass" }
    """
    uid = int(get_jwt_identity())
    u = User.query.get(uid)
    if not u:
        return _err("user not found", 404)

    data = request.get_json(force=True) or {}
    g1 = Group(name="Group 1", description="The first group")
    g2 = Group(name="Group 2", description="The second group")
    g3 = Group(name="Group 3", description="The third group")
    g4 = Group(name="Group 4", description="The fourth group")
    g5 = Group(name="Group 5", description="The fifth group")
    u1 = User(username = "1", password_hash = "1", name = "u1", min_budget = 100, max_budget = 400, group_id=1)
    u2 = User(username = "2", password_hash = "2", name = "u2", min_budget = 200, max_budget = 300,group_id=2)
    u3 = User(username = "3", password_hash = "3", name = "u3", min_budget = 100, max_budget = 900,group_id=3)
    u4 = User(username = "4", password_hash = "4", name = "u4", min_budget = 800, max_budget = 1200,group_id=3)
    u5 = User(username = "5", password_hash = "5", name = "u5", min_budget = 500, max_budget = 700,group_id=4)
    u6 = User(username = "6", password_hash = "6", name = "u6", min_budget = 600, max_budget = 800,group_id=5)
    for x in [g1, g2, g3, g4, g5, u1, u2, u3, u4, u5, u6]:
        db.session.add(x)
    db.session.flush()
    db.session.commit()

    for field in ["name", "age"]:
        if field in data:
            setattr(u, field, data[field])

    if "password" in data:
        new_pw = (data["password"] or "").strip()
        if not new_pw:
            return _err("password cannot be empty", 400)
        u.set_password(new_pw)

    db.session.commit()
    return jsonify({"user": u.public_profile()})

def _err(msg, code=400):
    resp = jsonify({"error": msg})
    resp.status_code = code
    return resp
