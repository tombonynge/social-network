\connect socialnetwork

-- DROP TABLE IF EXISTS tblusers CASCADE;

-- CREATE TABLE tblusers (
--     id SERIAL PRIMARY KEY,
--     firstname VARCHAR NOT NULL,
--     lastname VARCHAR NOT NULL,
--     email VARCHAR UNIQUE NOT NULL,
--     password VARCHAR NOT NULL,
--     bio TEXT,
-- );




-- DROP TABLE IF exists tblresetcodes;

-- CREATE TABLE tblresetcodes(
--   id SERIAL PRIMARY KEY,
--   email VARCHAR NOT NULL,
--   code VARCHAR NOT NULL,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );


-- DROP TABLE IF EXISTS tblprofilepics;

-- CREATE TABLE tblprofilepics(
--   id SERIAL PRIMARY KEY,
--   user_id INT NOT NULL REFERENCES tblusers(id),
--   url TEXT NOT NULL,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- DROP TABLE IF EXISTS tblfriendship;

-- CREATE TABLE tblfriendship(
--   id SERIAL PRIMARY KEY,
--   sender_id INT NOT NULL REFERENCES tblusers(id),
--   receiver_id INT NOT NULL REFERENCES tblusers(id),
--   accepted BOOLEAN DEFAULT false,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );


DROP TABLE IF EXISTS tblchat;

CREATE TABLE tblchat (
  id SERIAL PRIMARY KEY,
  message TEXT NOT NULL,
  sender_id INT NOT NULL REFERENCES tblusers(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

insert into tblchat (message, sender_id)
VALUES 
('Hello everyone!', 1),
('What''s up!', 2),
('jkhsdlsdlfadlkfla', 2);
