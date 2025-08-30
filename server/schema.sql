CREATE TABLE users (
    id INT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    profile_id INT REFERENCES profiles(id)
);
CREATE TABLE profiles (
    id INT PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    name TEXT,
    age INT,
    location TEXT,
    min_budget INT,
    max_budget INT,
    bio TEXT,
    avatar_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE groups (
    id INT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE swipes (
    sender_id INT REFERENCES groups(id) ON DELETE CASCADE,
    receiver_id INT REFERENCES groups(id) ON DELETE CASCADE,
    PRIMARY KEY (sender_id, receiver_id)
);

CREATE TABLE matches (
    group1_id INT REFERENCES groups(id) ON DELETE CASCADE,
    group2_id INT REFERENCES groups(id) ON DELETE CASCADE,
    PRIMARY KEY (group1_id, group2_id)
);

CREATE TABLE messages (
    id INT PRIMARY KEY,
    match_id INT REFERENCES matches(id) ON DELETE CASCADE,
    sender_id INT REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);