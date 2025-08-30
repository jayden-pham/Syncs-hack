# server/group.py
from datetime import datetime
from sqlalchemy import UniqueConstraint
from .app import db
from .extensions import db


class Group(db.Model):
    __tablename__ = "groups"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text)
    status = db.Column(db.Enum("active","archived", name="group_status"), default="active", nullable=False)
    created_by_user_id = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    desired_size = db.Column(db.Integer)
    budget_min = db.Column(db.Integer)
    budget_max = db.Column(db.Integer)
    suburb = db.Column(db.String(120))

    def to_card(self):
        return {
            "id": self.id, "name": self.name, "description": self.description,
            "status": self.status, "suburb": self.suburb,
            "budget_min": self.budget_min, "budget_max": self.budget_max,
        }

class GroupMember(db.Model):
    __tablename__ = "group_members"
    group_id = db.Column(db.Integer, db.ForeignKey("groups.id"), primary_key=True)
    user_id = db.Column(db.Integer, primary_key=True)
    role = db.Column(db.Enum("owner","member", name="group_role"), default="member", nullable=False)
    joined_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    __table_args__ = (
        UniqueConstraint("user_id", name="uq_group_members_user_single_group"),
        UniqueConstraint("group_id", "user_id", name="uq_group_members_pair"),
    )
