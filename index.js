const express = require("express");
const app = express();
const compression = require("compression");

/******************* */
const cookieSession = require("cookie-session");
const csurf = require("csurf");
const db = require("./sql/db.js");
const ses = require("./ses.js");
/************BCRYPT************/
const { hash, compare } = require("./bc.js");
/***CRYPTO RANDOM STRING********/
const cryptoRandomString = require("crypto-random-string");

/* FILE UPLOAD BOILERPLATE */
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const uuid = require("uuid");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

/* S3 */
const s3 = require("./s3.js");
const { s3Url } = require("./config.json");

//GEN USERS
const fs = require("fs");
const request = require("request");

//SOCKETS
const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080" });

//who's online
let onlineList = [];

/*******SERVER MIDDLEWARE**********/
app.use(compression());

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/",
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

// app.use(express.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
// app.use(
//     cookieSession({
//         name: "session",
//         keys: ["ABCDEFG", "1234567"],
//         // Cookie Options
//         maxAge: 24 * 60 * 60 * 1000, // 24 hours
//     })
// );

const cookieSessionMiddleware = cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 90,
});

app.use(cookieSessionMiddleware);
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

/**********CSRF**************/
app.use(csurf());
app.use(function (req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

/*********GET ROUTES********* */
app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
});

app.get("/user", async (req, res) => {
    let { userId } = req.session;
    if (req.query.userId) {
        userId = req.query.userId;
    }
    try {
        let userInfo = await db.getUserFromId(userId);
        if (userInfo) {
            res.json(userInfo);
        }
    } catch (e) {
        console.log("error getting userInfo", e);
    }
});

app.get("/newestusers", async (req, res) => {
    const { userId } = req.session;
    try {
        let result = await db.getNewestUsers(userId);
        if (result) {
            res.json(result);
        }
    } catch (e) {
        console.log(e);
        res.json(false);
    }
});

app.get("/getMatchingUsers", async (req, res) => {
    const { name } = req.query;
    const { userId } = req.session;
    try {
        let result = await db.getMatchingUsers(name, userId);
        if (result) {
            res.json(result);
        }
    } catch (e) {
        console.log(e);
        res.json(false);
    }
});

app.get("/friendship/:id", async (req, res) => {
    const sender = req.session.userId;
    const receiver = req.params.id;
    // console.log("sender", sender);
    // console.log("receiver", receiver);
    try {
        let result = await db.getFriendshipStatus(sender, receiver);
        if (result) {
            res.json(result);
        }
    } catch (e) {
        console.log(e);
        res.json(false);
    }
});

app.get("/friendsandrequests", async (req, res) => {
    const { userId } = req.session;
    try {
        let result = await db.getFriendsAndRequests(userId);
        if (result) {
            res.json(result);
        }
    } catch (e) {
        console.log(e);
        res.json(false);
    }
});

app.get("*", (req, res) => {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

/*********POST ROUTES************/
app.post("/newUser", (req, res) => {
    hash(req.body.password1)
        .then((hashedPw) => {
            const { firstName, lastName, email } = req.body;
            return db.insertNewUser(firstName, lastName, email, hashedPw);
        })
        .then((results) => {
            //set the users cookie with userId
            const userId = results.rows[0].id;
            req.session.userId = userId;
            res.json(true);
        })
        .catch((err) => {
            console.log(err.detail);
            res.json(false);
        });
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    db.getUsersInfo(email)
        .then((result) => {
            if (result.rows.length == 0) {
                res.json(false);
            }
            const actualHashedPassword = result.rows[0].password;
            const userId = result.rows[0].id;
            return compare(password, actualHashedPassword)
                .then((isMatch) => {
                    if (isMatch) {
                        req.session.userId = userId;
                        res.json(true);
                    } else {
                        res.json(false);
                    }
                })
                .catch((err) => {
                    console.log(err);
                    res.json(false);
                });
        })
        .catch((err) => {
            console.log(err);
            res.json(false);
        });
});

app.post("/resetpassword/email", (req, res) => {
    const { email } = req.body;
    db.getUsersInfo(email)
        .then((result) => {
            if (result.rows.length > 0) {
                const secretCode = cryptoRandomString({ length: 6 });
                db.insertSecretCode(email, secretCode)
                    .then((id) => {
                        if (id) {
                            ses.sendEmail(email, "reset code", secretCode).then(
                                () => {
                                    res.json(true);
                                }
                            );
                        } else {
                            res.json(false);
                        }
                    })
                    .catch((err) => {
                        console.log("insertSecretCode error:", err);
                    });
            } else {
                res.json(false);
            }
        })
        .catch((err) => {
            console.log("getUsersInfo error:", err);
        });
});

app.post("/resetpassword/verify", (req, res) => {
    const { code, email, password1 } = req.body;
    //is the code valid
    db.checkForValidCode(email, code)
        .then((result) => {
            console.log(result.rows);
            if (result.rows[0]) {
                hash(password1)
                    .then((hashedPw) => {
                        return db.updateUserPassword(email, hashedPw);
                    })
                    .then((results) => {
                        res.json(true);
                    })
                    .catch((err) => {
                        res.json(false);
                    });
            } else {
                res.json(false);
            }
        })
        .catch((err) => {
            console.log(err);
            res.json(false);
        });
});

app.post("/uploadPic", uploader.single("file"), s3.upload, async (req, res) => {
    const { filename } = req.file;
    const url = s3Url + filename;
    const { userId } = req.session;
    try {
        let result = await db.insertUserProfilePic(userId, url);
        if (result.rows[0]) {
            res.json({ url: url });
        } else {
            res.json(false);
        }
    } catch (e) {
        console.log(e);
    }
});

app.post("/updatebio", async (req, res) => {
    const { bio } = req.body;
    const { userId } = req.session;
    try {
        let result = await db.updateBio(userId, bio);
        if (result.rows[0]) {
            res.json(true);
        } else {
            res.json(false);
        }
    } catch (e) {
        console.log("error in /updatebio", e);
    }
});

app.post("/makefriendrequest", async (req, res) => {
    const { id } = req.body;
    const { userId } = req.session;
    try {
        await db.insertFriendRequest(userId, id);
        res.json(true);
    } catch (e) {
        console.log(e);
    }
});

app.post("/deletefriendrequest", async (req, res) => {
    console.log("deleting request");
    const sender = req.body.id;
    const receiver = req.session.userId;
    try {
        await db.deleteFriendRequest(sender, receiver);
        res.json(true);
    } catch (e) {
        console.log(e);
    }
});

app.post("/acceptfriendrequest", async (req, res) => {
    const { id } = req.body;
    const { userId } = req.session;
    console.log("the id is:", id);
    try {
        await db.updateFriendRequest(id, userId);
        res.json(true);
    } catch (e) {
        console.log(e);
    }
});

app.post("/adduserbios", async (req, res) => {
    console.log("starting to get user bio");

    //THE BELOW DOES NOT WORK!!!!
    // (async () => {
    //     try {
    //         const browser = await puppeteer.launch({ headless: false });
    //         console.log(await browser.version());
    //         const page = await browser.newPage();
    //         await page.goto("https://www.twitterbiogenerator.com/");
    //         // await page.screenshot({ path: "google.png" });
    //         const bioText = await page.evaluate(() => {
    //             return document.querySelector("textarea#bio").value;
    //         });
    //         console.log(bioText);
    //         await browser.close();
    //     } catch (e) {
    //         console.log(e);
    //     }
    // })();
});

app.post("/genusers", async (req, res) => {
    console.log("generating");
    const { names } = req.body;
    console.log(names);
    let password = await hash("dill");
    console.log("password:", password);

    let i = 0; //  set your counter to 0

    function getFilesizeInBytes(filename) {
        var stats = fs.statSync(filename);
        var fileSizeInBytes = stats["size"];
        return fileSizeInBytes;
    }

    function myLoop() {
        //  create a loop function
        setTimeout(function () {
            let imageUrl = "https://thispersondoesnotexist.com/image";
            let filePath = `./images/image${i}.jpg`;
            request.head(imageUrl, function (err, res, body) {
                request(imageUrl)
                    .pipe(fs.createWriteStream(filePath))
                    .on("close", function () {
                        //upload to amazon....
                        const fileSize = getFilesizeInBytes(filePath);
                        //limit filesize! important!
                        if (fileSize < 2097152) {
                            const fileName = uuid.v4() + ".jpg";
                            /********UNCOMMENT THE NEXT BIT TO UPLOAD***********/
                            s3.uploadForGenUsers(fileName, filePath, fileSize);
                            /************************************************* */
                            let fullPath =
                                "https://s3.amazonaws.com/spicedling/" +
                                fileName;
                            console.log(names[i - 1]);
                            const { firstname, lastname } = names[i - 1];
                            (async () => {
                                try {
                                    let result = await db.insertNewUser(
                                        firstname,
                                        lastname,
                                        `${firstname}.${lastname}@mail.com`,
                                        password
                                    );
                                    let { id } = result.rows[0];
                                    db.insertUserProfilePic(id, fullPath);
                                } catch (e) {
                                    console.log(e);
                                }
                            })();
                        }
                    });
            });
            i++; //  increment the counter
            if (i < names.length) {
                myLoop(i);
            }
        }, 1500); //1.5 seconds should be enough for the site to give me a new image
    }
    myLoop();
});

//this should be server..anything not relevant for server will be deferred to app.
server.listen(8080, function () {
    console.log("I'm listening.");
});

// sockets for chat functionality
io.on("connection", async (socket) => {
    console.log(`socket with id ${socket.id} just CONNECTED!`);

    const { userId } = socket.request.session;
    // a user must be logged in to use sockets
    if (!userId) {
        return socket.disconnect(true);
    }

    onlineList.push({
        id: userId,
        socket: socket.id,
    });
    //sort onlineList, remove duplicate id's, get user info and emit results.
    refreshOnlineUsers(onlineList);

    try {
        const data = await db.getLatestMessages(userId);
        io.sockets.emit("chatMessages", data.rows);
    } catch (e) {
        console.log(e);
    }

    socket.on("newMessage", async (text) => {
        //do a db query to insert the chat message
        try {
            let result = await db.insertMessage(text, userId);
            if (result) {
                const messageId = result.rows[0].id;
                const timestamp = result.rows[0].timestamp;
                let data = await db.getUserFromId(userId);
                // const isUser = data.id === userId ? true : false;
                const msgPacket = {
                    id: messageId,
                    message: text,
                    sender_id: data.id,
                    firstname: data.firstname,
                    lastname: data.lastname,
                    url: data.url,
                    timestamp: timestamp,
                };
                console.log(msgPacket);
                io.sockets.emit("chatMessage", msgPacket);
            }
        } catch (e) {
            console.log(e);
        }
        //do a db query to get the user data
        //THEN emit our message object to everyone so they can see it immediately.
    });

    socket.on("disconnect", async () => {
        onlineList = onlineList.filter((item) => {
            return item.socket != socket.id;
        });
        refreshOnlineUsers(onlineList);
    });
});

function sortOnlineUsers(online) {
    function compare(a, b) {
        const aId = a.id;
        const bId = b.id;

        let result = 0;
        if (aId > bId) {
            result = 1;
        } else if (aId < bId) {
            result = -1;
        }
        return result;
    }

    const sorted = online.sort(compare);

    let users = [];
    let prevId = 0;
    for (let i = 0; i < sorted.length; i++) {
        if (prevId < sorted[i].id) {
            users.push(sorted[i].id);
        }
        prevId = sorted[i].id;
    }

    return users;
}

async function refreshOnlineUsers(online) {
    try {
        const onlineUserInfo = await db.getManyUsersInfo(
            sortOnlineUsers(online)
        );
        io.sockets.emit("onlineUsers", onlineUserInfo.rows);
    } catch (e) {
        console.log(e);
    }
}
