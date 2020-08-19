import React, { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";
import ChatName from "./chatname";
import OnlineUsers from "./onlineusers";

export default function Chat() {
    const elemRef = useRef();
    const chatMessages = useSelector((state) => {
        return state.chatMessages;
    });

    //this should run everytime we get a new chat message
    useEffect(() => {
        const clientHeight = elemRef.current.clientHeight;
        const scrollHeight = elemRef.current.scrollHeight;
        elemRef.current.scrollTop = scrollHeight - clientHeight;
        // console.log(chatMessages);
    }, [chatMessages]);

    const keyCheck = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (e.target.value != "") {
                socket.emit("newMessage", e.target.value);
                e.target.value = "";
            }
        }
    };

    return (
        <div className="two-column-wrapper">
            <div className="chat-container">
                <p className="online-header">Public Chat</p>
                <div className="chat-message-container" ref={elemRef}>
                    {chatMessages &&
                        chatMessages.map((msg, index) => (
                            <div key={index} className="chat-message">
                                <div className="chat-message-header">
                                    <img
                                        className="chat-message-img"
                                        src={msg.url}
                                    />
                                    <div className="chat-message-header-text">
                                        <ChatName msg={msg} />
                                        <p className="chat-message-timestamp">
                                            {msg.timestamp}
                                        </p>
                                    </div>
                                </div>
                                <p className="chat-message-text">
                                    {msg.message}
                                </p>
                            </div>
                        ))}
                </div>
                <textarea
                    className="chat-textarea"
                    placeholder="type a message, press Enter to send."
                    onKeyDown={keyCheck}
                ></textarea>
            </div>
            <div className="online-users">
                <OnlineUsers />
            </div>
        </div>
    );
}
