# server/chat.py
from datetime import datetime, timezone
from sqlalchemy import UniqueConstraint, Index
from server.db import db

class Chat(db.Model):
    __tablename__ = "chats"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.Text)
    group1_id = db.Column(db.Integer, db.ForeignKey('groups.id', ondelete='CASCADE'), nullable=False)
    group2_id = db.Column(db.Integer, db.ForeignKey('groups.id', ondelete='CASCADE'), nullable=False)
    created_at = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )

    # convenience helper
    def to_dict(self):
        return {"id": self.id, "title": self.title, "created_at": self.created_at.isoformat()}
