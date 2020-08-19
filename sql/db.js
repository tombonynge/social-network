/////////////////////////////
///////// MODULES ///////////
/////////////////////////////
const spicedPg = require("spiced-pg");
//username and password are saved as JSON in secrets.json, which is not pushed to github

//HEROKU
let db;
if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    const { dbUser, dbPass } = require("../secrets.json");
    db = spicedPg(`postgres:${dbUser}:${dbPass}@localhost:5432/socialnetwork`);
}

/////////////////////////////
///////// EXPORTS ///////////
/////////////////////////////
module.exports.insertNewUser = function (first, last, email, hashPass) {
    return db.query(
        `INSERT INTO tblusers (firstname, lastname, email, password)
        VALUES ($1, $2, $3, $4) RETURNING id`,
        [first, last, email, hashPass]
    );
};

module.exports.getUsersInfo = function (email) {
    return db.query(
        `
        SELECT * FROM tblusers WHERE email = $1
        `,
        [email]
    );
};

module.exports.getUserFromId = function (id) {
    return db
        .query(
            `
        SELECT
            u.id,
            u.firstname, 
            u.lastname, 
            u.bio,
            (SELECT url FROM tblprofilepics
            WHERE user_id = $1
            ORDER BY created_at DESC
            LIMIT 1) as url
        FROM 
            tblusers u 
        WHERE 
            id = $1
        `,
            [id]
        )
        .then((result) => {
            return result.rows[0];
        });
};

module.exports.insertSecretCode = function (email, code) {
    return db.query(
        `
        INSERT INTO tblresetcodes (email, code)
        VALUES ($1, $2) RETURNING id
        `,
        [email, code]
    );
};

module.exports.checkForValidCode = function (email, code) {
    return db.query(
        `
        SELECT 
            * 
        FROM tblresetcodes
        WHERE 
            email = $1
            AND code = $2
            AND created_at >= CURRENT_TIMESTAMP - INTERVAL '10 minutes'
        `,
        [email, code]
    );
};

module.exports.updateUserPassword = function (email, password) {
    return db.query(
        `
        UPDATE tblusers
        SET password = $2
        WHERE email = $1
        RETURNING *
        `,
        [email, password]
    );
};

module.exports.insertUserProfilePic = function (id, url) {
    return db.query(
        `
        INSERT INTO tblprofilepics (user_id, url)
        VALUES ($1, $2)
        RETURNING id
        `,
        [id, url]
    );
};

module.exports.getUserProfilePic = function (id) {
    return db.query(
        `
        SELECT TOP 1 url
        FROM tblprofilepics
        WHERE user_id = $1
        ORDER BY created_at DESC
        `,
        [id]
    );
};

module.exports.updateBio = function (id, bio) {
    return db.query(
        `
        UPDATE tblusers
        SET bio = $2
        WHERE id = $1
        RETURNING id
        `,
        [id, bio]
    );
};

module.exports.getNewestUsers = function (id) {
    return db.query(
        `
        SELECT 
            u.id,
            u.firstname, 
            u.lastname, 
            u.bio,
            (SELECT url FROM tblprofilepics
            WHERE user_id = u.id
            ORDER BY created_at DESC
            LIMIT 1) as url
        FROM tblusers u
        WHERE u.id != $1
        ORDER BY id DESC
        LIMIT 3
        `,
        [id]
    );
};

module.exports.getMatchingUsers = function (name, id) {
    return db.query(
        `
        SELECT 
            u.id,
            u.firstname, 
            u.lastname, 
            u.bio,
            (SELECT url FROM tblprofilepics
            WHERE user_id = u.id
            ORDER BY created_at DESC
            LIMIT 1) as url
        FROM tblusers u
        WHERE CONCAT(u.firstname,' ',u.lastname) ILIKE $1
        AND u.id != $2
        ORDER BY u.firstname
        `,
        [name + "%", id]
    );
};

module.exports.getFriendshipStatus = function (myId, otherId) {
    return db.query(
        `
           SELECT * FROM tblfriendship
           WHERE (receiver_id = $1 AND sender_id = $2)
           OR (receiver_id = $2 AND sender_id = $1);
           `,
        [myId, otherId]
    );
};

//INSERT that runs when "send friend request" is clicked.
//It will INSERT the two users' ids (sender_id and receiver_id)

module.exports.insertFriendRequest = function (sender, receiver) {
    return db.query(
        `
            INSERT INTO tblfriendship (sender_id, receiver_id)
            VALUES ($1, $2)
        `,
        [sender, receiver]
    );
};

//UPDATE that runs when "accept friend request" is clicked.
//It's going to update the accepted column from false to true
module.exports.updateFriendRequest = function (sender, receiver) {
    return db.query(
        `
            UPDATE tblfriendship
            SET accepted = TRUE
            WHERE sender_id = $1
            AND receiver_id = $2
        `,
        [sender, receiver]
    );
};

//DELETE that runs when "cancel friend request" or "end friendship" is clicked.
//It will DELETE the two users' row from friendships
module.exports.deleteFriendRequest = function (sender, receiver) {
    return db.query(
        `
        DELETE FROM tblfriendship
        WHERE (receiver_id = $1 AND sender_id = $2)
        OR (receiver_id = $2 AND sender_id = $1);
        `,
        [sender, receiver]
    );
};

module.exports.getFriendsAndRequests = function (id) {
    return db.query(
        `
        SELECT
            u.id, u.firstname, u.lastname, f.accepted,
            (SELECT url FROM tblprofilepics
            WHERE user_id = u.id
            ORDER BY created_at DESC
            LIMIT 1) as url
        FROM tblfriendship f
        INNER JOIN tblusers u
            ON (f.accepted = false AND f.receiver_id = $1 AND f.sender_id = u.id)
            OR (f.accepted = true AND f.receiver_id = $1 AND f.sender_id = u.id)
            OR (f.accepted = true AND f.sender_id = $1 AND f.receiver_id = u.id)
        `,
        [id]
    );
};

module.exports.getLatestMessages = function (userId) {
    return db.query(
        `
        SELECT a.* 
        FROM (
            SELECT  
                c.id,
                c.message,
                c.sender_id,
                u.firstname,
                u.lastname,
                (SELECT url FROM tblprofilepics
                WHERE user_id = u.id
                ORDER BY created_at DESC
                LIMIT 1) as url,
                CASE 
                    WHEN c.sender_id = $1 THEN true
                    ELSE false
                END AS isuser,
                to_char(c.created_at, 'YYYY-MM-DD - hh:mi') as timestamp
            FROM tblchat c
            JOIN tblusers u ON u.id = c.sender_id
            ORDER BY c.id DESC
            LIMIT 10
        ) a
        ORDER BY a.id
        `,
        [userId]
    );
};

module.exports.insertMessage = function (message, sender) {
    return db.query(
        `
        INSERT INTO tblchat (message, sender_id)
        VALUES ($1, $2)
        RETURNING 
            id,
            to_char(created_at, 'YYYY-MM-DD - HH:MM') as timestamp
        `,
        [message, sender]
    );
};

module.exports.getManyUsersInfo = function (ids) {
    return db.query(
        `
        SELECT 
            u.id,
            u.firstname, 
            u.lastname, 
            (SELECT url FROM tblprofilepics
            WHERE user_id = u.id
            ORDER BY created_at DESC
            LIMIT 1) as url
        FROM tblusers u
        WHERE u.id = ANY($1::int[])
        ORDER BY u.firstname
        `,
        [ids]
    );
};
