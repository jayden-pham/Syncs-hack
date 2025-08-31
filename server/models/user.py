# server/models/user.py
from datetime import datetime, timezone
from werkzeug.security import generate_password_hash, check_password_hash
from server.db import db

class User(db.Model):
    __tablename__ = "users"

    id          = db.Column(db.Integer, primary_key=True)
    username    = db.Column(db.String(50), unique=True, index=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    name        = db.Column(db.Text)
    age         = db.Column(db.Integer)
    location    = db.Column(db.Text)
    min_budget  = db.Column(db.Integer)
    max_budget  = db.Column(db.Integer)
    bio         = db.Column(db.Text)

    group_id    = db.Column(db.Integer, db.ForeignKey("groups.id"))

    created_at  = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    def set_password(self, raw_password: str) -> None:
        self.password_hash = generate_password_hash(raw_password)

    def check_password(self, raw_password: str) -> bool:
        return check_password_hash(self.password_hash, raw_password)

    def public_profile(self) -> dict:
        return {
            "user_id": self.id,
            "username": self.username,
            "name": self.name,
            "age": self.age,
            "location": self.location,
            "min_budget": self.min_budget,
            "max_budget": self.max_budget,
            "bio": self.bio,
            "group_id": self.group_id,
            "created_at": (self.created_at.isoformat() if self.created_at else None),
        }
