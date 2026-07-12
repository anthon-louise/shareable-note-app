-- first sprint

CREATE TABLE users (
    id SERIAL PRIMARY KEY, --pk
    username VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE, -- unique
    password_hash TEXT NOT NULL,
    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);