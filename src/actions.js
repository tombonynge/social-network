// will contain ALL of our action creator functions
// action creator - just a function that returns an object with a property called TYPE
// object that it returns is called an action
import axios from "./axios";

// export function fn(thing) {
//     return {
//         type: "CHANGE_STATE",
//         thing,
//     };
// }

export async function getFriendsAndRequests() {
    console.log("firing!");
    try {
        const { data } = await axios.get("/friendsandrequests");
        // console.log(data);
        return {
            type: "GET_FRIENDS_AND_REQUESTS",
            friends: data.rows,
        };
    } catch (e) {
        console.log(e);
    }
}

//this is probably wrong!
export async function acceptFriendRequest(id) {
    console.log("firing!", id);
    try {
        const { data } = await axios.post("/acceptfriendrequest", { id });
        if (data) {
            return {
                type: "ACCEPT_FRIEND_REQUEST",
                id: id,
            };
        }
    } catch (e) {
        console.log(e);
    }
}

//this is probably wrong!
export async function unFriend(id) {
    try {
        const { data } = await axios.post("/deletefriendrequest", { id });
        if (data) {
            return {
                type: "UNFRIEND",
                id: id,
            };
        }
    } catch (e) {
        console.log(e);
    }
}

export function chatMessages(msgs) {
    return {
        type: "SET_CHAT_MESSAGES",
        msgs: msgs,
    };
}

export function chatMessage(msg) {
    return {
        type: "ADD_CHAT_MESSAGE",
        msg: msg,
    };
}

export function onlineUsers(users) {
    return {
        type: "ONLINE_USERS",
        users: users,
    };
}
