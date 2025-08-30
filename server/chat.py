# server/chat.py
from datetime import datetime
from sqlalchemy import UniqueConstraint, Index
from server.db import db

class Chat(db.Model):
    __tablename__ = "chats"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    # convenience helper
    def to_dict(self):
        return {"id": self.id, "title": self.title, "created_at": self.created_at.isoformat()}

class ChatParticipant(db.Model):
    __tablename__ = "chat_participants"
    chat_id = db.Column(db.Integer, db.ForeignKey("chats.id", ondelete="CASCADE"), primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    role = db.Column(db.Enum("member", "owner", name="chat_role"), default="member", nullable=False)
    joined_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    __table_args__ = (
        UniqueConstraint("chat_id", "user_id", name="uq_chat_participant"),
        Index("ix_chat_participants_user", "user_id"),
    )

class Message(db.Model):
    __tablename__ = "messages"
    id = db.Column(db.Integer, primary_key=True)
    chat_id = db.Column(db.Integer, db.ForeignKey("chats.id", ondelete="CASCADE"), nullable=False, index=True)
    sender_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    __table_args__ = (
        Index("ix_messages_chat_id_id", "chat_id", "id"),
    )

    def to_dict(self):
        return {
            "id": self.id,
            "chat_id": self.chat_id,
            "sender_id": self.sender_id,
            "content": self.content,
            "timestamp": self.timestamp.isoformat(),
        }
