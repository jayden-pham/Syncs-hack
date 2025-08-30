from server.db import db

class Swipe(db.Model):
    __tablename__ = 'swipes'
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey('groups.id', ondelete='CASCADE'), nullable=False)