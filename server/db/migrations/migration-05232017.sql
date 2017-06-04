\c translation;

DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(1024),
  password VARCHAR(1024)
);