# server/user.py
from datetime import datetime, timezone
from server.db import db

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    name = db.Column(db.Text)
    age = db.Column(db.Integer)
    location = db.Column(db.Text)
    min_budget = db.Column(db.Integer)
    max_budget = db.Column(db.Integer)
    bio = db.Column(db.Text)
    group_id = db.Column(db.Integer, db.ForeignKey('groups.id'))
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
