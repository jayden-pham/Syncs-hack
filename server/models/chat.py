# server/chat.py
from datetime import datetime, timezone
from sqlalchemy import UniqueConstraint, Index
from server.db import db

class Chat(db.Model):
    __tablename__ = "chats"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200))
    created_at = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )

    # convenience helper
    def to_dict(self):
        return {"id": self.id, "title": self.title, "created_at": self.created_at.isoformat()}

class ChatParticipant(db.Model):
    __tablename__ = "chat_participants"
    chat_id = db.Column(db.Integer, db.ForeignKey("chats.id", ondelete="CASCADE"), primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    role = db.Column(db.Enum("member", "owner", name="chat_role"), default="member", nullable=False)
    joined_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    __table_args__ = (
        UniqueConstraint("chat_id", "user_id", name="uq_chat_participant"),
        Index("ix_chat_participants_user", "user_id"),
    )
