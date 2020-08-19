import React, { useState, useEffect } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default function FindPeople(props) {
    const [newUsers, setNewUsers] = useState([]);
    const [users, setUsers] = useState([]);
    const [name, setName] = useState("");

    useEffect(() => {
        let abort;
        (async () => {
            const { data } = await axios.get("/newestusers");
            if (!abort) {
                setNewUsers(data.rows);
            }
        })();

        if (name !== "") {
            (async () => {
                const { data } = await axios.get(
                    `/getMatchingUsers?name=${name}`
                );
                setUsers(data.rows);
            })();
        } else {
            setUsers([]);
        }

        return () => {
            abort = true;
        };
    }, [name]);

    return (
        <div>
            <h3>FIND PEOPLE</h3>
            {name == "" && (
                <ul className="friends">
                    {newUsers.map((user, index) => (
                        <li key={index}>
                            <Link to={`/user/${user.id}`}>
                                <img className="friend-thumb" src={user.url} />
                                <span>
                                    {user.firstname} {user.lastname}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
            <input
                type="text"
                onChange={(e) => setName(e.target.value)}
                placeholder="enter name"
            />
            <ul className="friends">
                {users.map((user, index) => (
                    <li key={index}>
                        <Link to={`/user/${user.id}`}>
                            <img className="friend-thumb" src={user.url} />
                            <span>
                                {user.firstname} {user.lastname}
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
