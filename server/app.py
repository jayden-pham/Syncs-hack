# server/app.py
import os
from datetime import timedelta
from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from server.db import db

def create_app():
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL", "sqlite:///dev.db")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "dev-secret-change-me")
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=1)

    db.init_app(app)       # <-- binds THIS db to THIS app
    JWTManager(app)
    CORS(app)

    from .group_routes import group_bp  # <-- relative import AFTER db.init_app
    app.register_blueprint(group_bp, url_prefix="/groups")

    with app.app_context():
        db.create_all()

    @app.get("/health")
    def health():
        return {"ok": True}

    @app.errorhandler(404)
    def nf(_): return jsonify({"error":"Not found"}), 404

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
