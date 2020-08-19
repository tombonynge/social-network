// this is 1 big function with a bunch of conditionals...
// if action = x, change the state to blah...

import { chatMessage } from "./actions";

// import { chatMessage } from "./actions";

export default function reducer(state = {}, action) {
    if (action.type === "GET_FRIENDS_AND_REQUESTS") {
        return {
            ...state,
            friends: action.friends,
        };
    }

    if (action.type === "ACCEPT_FRIEND_REQUEST") {
        return {
            ...state,
            friends: state.friends.map((user) => {
                if (user.id === action.id) {
                    user.accepted = true;
                }
                return user;
            }),
        };
    }

    if (action.type === "UNFRIEND") {
        return {
            ...state,
            friends: state.friends.filter((user) => {
                return user.id != action.id;
            }),
        };
    }

    if (action.type === "SET_CHAT_MESSAGES") {
        return {
            ...state,
            chatMessages: action.msgs,
        };
    }

    if (action.type === "ADD_CHAT_MESSAGE") {
        console.log("add_chat_message:", action.msg);
        return {
            ...state,
            chatMessages: [...state.chatMessages, action.msg],
        };
    }

    if (action.type === "ONLINE_USERS") {
        console.log("list of online users", action.users);
        return {
            ...state,
            users: action.users,
        };
    }

    return state;
}
