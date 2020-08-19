import React from "react";
import { Link } from "react-router-dom";

export default function ChatName({ msg }) {
    if (msg) {
        if (msg.isuser) {
            console.log("YOU");
            return <p>You</p>;
        } else {
            return (
                <Link to={`/user/${msg.sender_id}`}>
                    <p>
                        {msg.firstname} {msg.lastname}
                    </p>
                </Link>
            );
        }
    }
}
