# server/group.py
from datetime import datetime
from sqlalchemy import UniqueConstraint
from server.db import db

class Group(db.Model):
    __tablename__ = 'groups'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=False)
    description = db.Column(db.Text)

    def to_card(self):
        return {
            "id": self.id, "name": self.name, "description": self.description
        }