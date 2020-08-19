import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "./actions";

export default function Friends() {
    const dispatch = useDispatch();
    const arr = useSelector((state) => {
        // console.log(state);
        return state.friends;
    });
    let friends,
        requests = [];
    function filterForFriends(user) {
        return user.accepted === true;
    }
    function filterForRequests(user) {
        return user.accepted === false;
    }
    if (arr) {
        friends = arr.filter(filterForFriends);
        requests = arr.filter(filterForRequests);
        console.log("friends:", friends);
        console.log("requests:", requests);
    }

    useEffect(() => {
        dispatch(actions.getFriendsAndRequests());
    }, []);

    return (
        <div className="friends-main-wrapper">
            <h3>Your friends:</h3>
            <div className="friends-wrapper">
                <ul className="friends-ul">
                    {friends &&
                        friends.map((user, index) => (
                            <li key={index} className="friends-li">
                                <Link to={`/user/${user.id}`}>
                                    <img
                                        className="friends-img"
                                        src={user.url}
                                    />
                                </Link>
                                <span>
                                    {user.firstname} {user.lastname}
                                </span>
                                <button
                                    onClick={(e) =>
                                        dispatch(actions.unFriend(user.id))
                                    }
                                >
                                    Unfriend
                                </button>
                            </li>
                        ))}
                </ul>
            </div>
            <h3>People who want to be friends with you:</h3>
            <div className="friends-wrapper">
                <ul className="friends-ul">
                    {requests &&
                        requests.map((user, index) => (
                            <li key={index} className="friends-li">
                                <Link to={`/user/${user.id}`}>
                                    <img
                                        className="friends-img"
                                        src={user.url}
                                    />
                                </Link>
                                <span>
                                    {user.firstname} {user.lastname}
                                </span>
                                <button
                                    onClick={(e) =>
                                        dispatch(
                                            actions.acceptFriendRequest(user.id)
                                        )
                                    }
                                >
                                    Accept request
                                </button>
                                <button
                                    onClick={(e) =>
                                        dispatch(actions.unFriend(user.id))
                                    }
                                >
                                    Decline request
                                </button>
                            </li>
                        ))}
                </ul>
            </div>
        </div>
    );
}
