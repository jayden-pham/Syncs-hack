# server/routes/user_routes.py
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy.exc import IntegrityError
from server.db import db
from server.models.user import User

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

    username = (data.get("username") or "").strip()
    password = (data.get("password") or "").strip()
    if not username or not password:
        return _err("username and password are required", 400)

    u = User(
        username=username,
        name=data.get("name"),
        age=data.get("age"),
        location=data.get("location"),
        min_budget=data.get("min_budget"),
        max_budget=data.get("max_budget"),
        bio=data.get("bio"),
        group_id=data.get("group_id"),
    )
    u.set_password(password)

    try:
        db.session.add(u)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return _err("username already taken", 409)

    return jsonify({"user": u.public_profile()}), 201

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

    for field in ["name", "age", "location", "min_budget", "max_budget", "bio", "group_id"]:
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
