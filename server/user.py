# server/user.py
from datetime import datetime
from server.db import db

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, index=True, nullable=False)
    display_name = db.Column(db.String(120), nullable=False)
    avatar_url = db.Column(db.String(512))
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def public_profile(self):
        return {"user_id": self.id, "display_name": self.display_name, "avatar_url": self.avatar_url}
