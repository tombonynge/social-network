import React from "react";
import { useSelector } from "react-redux";

export default function UsersOnline() {
    const users = useSelector((state) => {
        console.log("users:", state.users);
        return state.users;
    });

    return (
        <div className="users-online-container">
            <p className="online-header">Who's online right now?</p>
            <div className="online-container">
                {users &&
                    users.map((user, index) => (
                        <div key={index} className="user-online">
                            <img className="chat-message-img" src={user.url} />
                            <p>
                                {user.firstname} {user.lastname}
                            </p>
                        </div>
                    ))}
            </div>
        </div>
    );
}
