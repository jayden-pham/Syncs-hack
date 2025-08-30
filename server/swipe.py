# swipe.py — FastAPI microservice (mutual-majority chat, minimal changes)

from fastapi import FastAPI, Request
from sqlalchemy.exc import IntegrityError

# your existing session + models
from app.database import SessionLocal
from app.models import Group, User, Swipe, Chat

app = FastAPI(title="Swipe Service", version="0.1.0")

THRESHOLD = 0.5  # >= 50% majority for each group


def has_chat_between(db, gid1: int, gid2: int) -> bool:
    """Chat exists for this unordered pair?"""
    a = db.query(Chat).filter_by(group1_id=gid1, group2_id=gid2).first()
    if a:
        return True
    b = db.query(Chat).filter_by(group1_id=gid2, group2_id=gid1).first()
    return bool(b)

def like_ratio(db, from_group_id: int, to_group_id: int) -> float:
    """Fraction of members in from_group who have Swipe -> to_group."""
    total = db.query(User).filter_by(group_id=from_group_id).count()
    if total == 0:
        return 0.0
    likes = (
        db.query(Swipe)
          .join(User, Swipe.sender_id == User.id)
          .filter(User.group_id == from_group_id, Swipe.receiver_id == to_group_id)
          .count()
    )
    return likes / total

def mutual_majority(db, gid_a: int, gid_b: int) -> bool:
    """Both groups meet majority threshold against each other?"""
    a_to_b = like_ratio(db, gid_a, gid_b)
    b_to_a = like_ratio(db, gid_b, gid_a)
    return (a_to_b >= THRESHOLD) and (b_to_a >= THRESHOLD)

# --------------- Endpoints -----------------

@app.post("/dev/login")
async def dev_login(request: Request):
    """
    Minimal seed endpoint (no JWT lib to keep it tiny).
    Seeds 3 groups + 4 users like your Flask example and returns a dummy token.
    Body: { "user_id": int, "name": str }
    """
    data = await request.json()
    uid = int(data.get("user_id", 1))
    name = data.get("name", f"user-{uid}")
    token = f"dev-{uid}-{name}"  # dummy token to avoid JWT dependency

    db = SessionLocal()
    try:
        # create groups
        g1 = db.query(Group).get(1) or Group(id=1, name="Group 1", description="The first group")
        g2 = db.query(Group).get(2) or Group(id=2, name="Group 2", description="The second group")
        g3 = db.query(Group).get(3) or Group(id=3, name="Group 3", description="The third group")
        for g in (g1, g2, g3):
            db.add(g)

        # create users (ids 1..4) if missing
        def ensure_user(uid_, uname, gid_):
            u = db.query(User).get(uid_)
            if not u:
                u = User(id=uid_, username=str(uid_), password_hash=str(uid_), name=uname, group_id=gid_)
                db.add(u)

        ensure_user(1, "u1", 1)
        ensure_user(2, "u2", 2)
        ensure_user(3, "u3", 3)
        ensure_user(4, "u4", 3)

        db.flush()
        db.commit()
        return {"access_token": token}
    except IntegrityError:
        db.rollback()
        return {"access_token": token}
    finally:
        db.close()

@app.post("/{sid:int}/{rid:int}")
def swipe_group(sid: int, rid: int):
    """
    Record a RIGHT swipe (Swipe(sender_id=sid, receiver_id=rid)).
    If mutual majority (both groups >= THRESHOLD), create Chat once for the pair.
    Response mirrors your Flask shape.
    """
    db = SessionLocal()
    try:
        sender = db.query(User).get(sid)
        if not sender or not sender.group_id:
            return {"sender_id": sid, "receiver_id": rid, "match": False, "error": "invalid sender or group"}

        my_gid = sender.group_id
        if rid == my_gid:
            return {"sender_id": sid, "receiver_id": rid, "match": False, "error": "cannot swipe own group"}

        # Insert swipe if not already present (keep table deduped)
        existing = db.query(Swipe).filter_by(sender_id=sid, receiver_id=rid).first()
        if not existing:
            db.add(Swipe(sender_id=sid, receiver_id=rid))
            db.flush()
            db.commit()  # make this like visible for ratio calc

        # Mutual majority?
        if mutual_majority(db, my_gid, rid):
            g1, g2 = (my_gid, rid) if my_gid <= rid else (rid, my_gid)
            if not has_chat_between(db, g1, g2):
                chat = Chat(group1_id=g1, group2_id=g2)
                db.add(chat)
                db.flush()
                db.commit()
                return {"sender_id": sid, "receiver_id": rid, "match": True, "chat_id": chat.id}
            # Chat already exists → still a match
            return {"sender_id": sid, "receiver_id": rid, "match": True}

        # Not a mutual-majority yet
        return {"sender_id": sid, "receiver_id": rid, "match": False}

    except Exception as e:
        db.rollback()
        return {"sender_id": sid, "receiver_id": rid, "match": False, "error": str(e)}
    finally:
        db.close()
