import React from "react";
import axios from "./axios";
import FriendRequest from "./friendrequest";
//styling
import styled from "styled-components";

const Wrapper = styled.div`
    display: flex;
    border: 1px solid black;
`;
const Bio = styled.div`
    width: 300px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

export default class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo: {
                id: "",
                firstname: "",
                lastname: "",
                url: "",
                bio: "",
            },
        };
        // this.handleClick = this.handleClick.bind(this);
    }

    async componentDidMount() {
        const id = this.props.match.params.id;
        try {
            let userInfo = await axios.get(`/user?userId=${id}`);
            this.setState({
                userInfo: userInfo.data,
            });
        } catch (e) {
            console.log("OtherProfile axios error", e);
        }
    }

    componentDidUpdate() {
        if (this.props.user === this.state.userInfo.id) {
            this.props.history.push("/");
        }
    }

    // handleClick() {
    //     console.log("handling click in otherProfile");
    // }

    render() {
        return (
            <>
                <Wrapper>
                    <div>
                        <h2>
                            {this.state.userInfo.firstname}{" "}
                            {this.state.userInfo.lastname}
                        </h2>
                        <img
                            className="profile-pic"
                            src={this.state.userInfo.url}
                        />
                    </div>
                    <Bio>
                        <h3>Bio</h3>
                        <p>{this.state.userInfo.bio}</p>
                    </Bio>
                </Wrapper>
                <div>
                    <FriendRequest
                        id={this.props.match.params.id}
                        handleClick={this.handleClick}
                    />
                </div>
            </>
        );
    }
}
