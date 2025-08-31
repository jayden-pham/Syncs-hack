from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from server.models.user import User

auth_bp = Blueprint("auth", __name__)

@auth_bp.post("/login")
def login():
    data = request.get_json(force=True) or {}
    username = (data.get("username") or "").strip()
    password = (data.get("password") or "").strip()

    if not username or not password:
        return _err("username and password are required", 400)

    u = User.query.filter_by(username=username).first()
    if not u or not u.check_password(password):
        return _err("invalid credentials", 401)

    access  = create_access_token(identity=str(u.id))
    refresh = create_refresh_token(identity=str(u.id))
    return jsonify({"access_token": access, "refresh_token": refresh})

@auth_bp.post("/refresh")
@jwt_required(refresh=True)
def refresh():
    uid = get_jwt_identity()
    new_access = create_access_token(identity=uid)
    return jsonify({"access_token": new_access})

def _err(msg, code=400):
    resp = jsonify({"error": msg})
    resp.status_code = code
    return resp
