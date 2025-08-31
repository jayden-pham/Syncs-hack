from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func
from server.db import db
from server.models.user import User
from server.models.chat import Chat
from server.models.message import Message

chat_bp = Blueprint("chats", __name__)

def current_uid() -> int:
    return int(get_jwt_identity())

def is_participant(chat_id: int, uid: int) -> bool:
    c = Chat.query.get(chat_id)
    if not c:
        return False
    gid = User.query.get(uid).group_id
    if gid != c.group1_id and gid != c.group2_id:
        return False
    return True

def ensure_membership_or_404(chat_id: int, uid: int):
    if not is_participant(chat_id, uid):
        return jsonify({"error": "Not found"}), 404

@chat_bp.get("/")
@jwt_required()
def list_my_chats():
    """
    List chats the current user is in with last message preview.
    """
    uid = current_uid()
    gid = User.query.get(uid).group_id

    # find chat ids for user
    q1 = db.session.query(Chat.id).filter_by(group1_id=gid)
    q2 = db.session.query(Chat.id).filter_by(group2_id=gid)
    user_chat_ids = q1.union(q2).subquery()

    # last message per chat
    last_msg = (
        db.session.query(
            Message.chat_id,
            func.max(Message.id).label("last_id")
        )
        .filter(Message.chat_id.in_(user_chat_ids))
        .group_by(Message.chat_id)
        .subquery()
    )

    # join chats + last message
    rows = (
        db.session.query(
            Chat.id,
            Chat.title,
            Chat.created_at,
            Message.id.label("message_id"),
            Message.sender_id,
            Message.content,
            Message.timestamp
        )
        .outerjoin(last_msg, last_msg.c.chat_id == Chat.id)
        .outerjoin(Message, Message.id == last_msg.c.last_id)
        .filter(Chat.id.in_(user_chat_ids))
        .order_by(Message.timestamp.desc().nullslast(), Chat.created_at.desc())
        .all()
    )

    out = []
    for r in rows:
        out.append({
            "chat": {"id": r.id, "title": r.title, "created_at": r.created_at.isoformat()},
            "last_message": (
                None if r.message_id is None else
                {"id": r.message_id, "sender_id": r.sender_id, "content": r.content, "timestamp": r.timestamp.isoformat()}
            )
        })
    return jsonify({"chats": out})


@chat_bp.get("/<int:chat_id>/messages")
@jwt_required()
def get_messages(chat_id: int):
    """
    Paginated messages.
    Query params: ?limit=50&before_id=123 (optional)
    """
    uid = current_uid()
    not_found = ensure_membership_or_404(chat_id, uid)
    if not_found:
        return not_found

    limit = min(int(request.args.get("limit", 50)), 200)
    before_id = request.args.get("before_id")

    q = Message.query.filter_by(chat_id=chat_id)
    if before_id:
        q = q.filter(Message.id < int(before_id))
    msgs = q.order_by(Message.id.desc()).limit(limit).all()
    msgs = list(reversed(msgs))

    return jsonify({"messages": [m.to_dict() for m in msgs]})


@chat_bp.post("/<int:chat_id>/messages")
@jwt_required()
def send_message(chat_id: int):
    """
    Body: { "content": "text" }
    """
    uid = current_uid()
    not_found = ensure_membership_or_404(chat_id, uid)
    if not_found:
        return not_found

    data = request.get_json(force=True) or {}
    content = (data.get("content") or "").strip()
    if not content:
        return jsonify({"error": "content required"}), 400

    msg = Message(chat_id=chat_id, sender_id=uid, content=content)
    db.session.add(msg)
    db.session.commit()
    return jsonify({"message": msg.to_dict()}), 201


@chat_bp.delete("/<int:chat_id>")
@jwt_required()
def remove_participant(chat_id: int):
    """
    Remove a participant. Users can remove themselves to leave the chat.
    (Add role checks later if you want owners-only removal.)
    """
    deleted = Chat.query.filter_by(id=chat_id).delete()
    if deleted:
        db.session.commit()
    return jsonify({"removed": bool(deleted)})
