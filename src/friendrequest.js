import React, { useState, useEffect } from "react";
import axios from "./axios";

export default function FriendRequest({ id, handleClick }) {
    const btnTxt = [
        "Send friend request",
        "End friendship",
        "Accept friend request",
        "Cancel friend request",
    ];
    const [text, setText] = useState("");

    useEffect(() => {
        (async () => {
            let { data } = await axios.get(`/friendship/${id}`);
            if (data.rows.length === 0) {
                setText(btnTxt[0]);
            } else {
                const accepted = data.rows[0].accepted;
                console.log(accepted);
                if (accepted) {
                    setText(btnTxt[1]);
                } else {
                    if (data.rows[0].sender_id == id) {
                        setText(btnTxt[2]);
                    } else {
                        setText(btnTxt[3]);
                    }
                }
            }
        })();
    }, [text]);

    function handleClick() {
        switch (text) {
            case btnTxt[0]:
                makePostRequest("/makefriendrequest", text);
                break;
            case btnTxt[1]:
            case btnTxt[3]:
                makePostRequest("/deletefriendrequest", text);
                break;
            case btnTxt[2]:
                makePostRequest("/acceptfriendrequest", text);
                break;
            default:
                break;
        }
    }

    async function makePostRequest(route, currentText) {
        try {
            let result = await axios.post(route, { id });
            if (result) {
                switch (currentText) {
                    case btnTxt[0]:
                        setText(btnTxt[3]);
                        break;
                    case btnTxt[1]:
                        setText(btnTxt[0]);
                        break;
                    case btnTxt[2]:
                        setText(btnTxt[1]);
                        break;
                    case btnTxt[3]:
                        setText(btnTxt[0]);
                        break;
                }
            }
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <>
            <button onClick={handleClick}>{text}</button>
        </>
    );
}
