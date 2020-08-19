import React from "react";
import axios from "./axios"; //copy of axios with xsrf configured
import { Link, BrowserRouter, Route } from "react-router-dom";
import { useRouteMatch } from "react-router";

//components
import Profile from "./profile";
import OtherProfile from "./otherprofile";
import Uploader from "./uploader";
import FindPeople from "./findpeople";
import Friends from "./friends";
import Chat from "./chat";
//test
import GenUsers from "./genusers";

//styling
import styled from "styled-components";

const Banner = styled.div`
    height: 100px;
    background: lightgreen;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
`;

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            userInfo: {},
            uploaderIsVisible: false,
        };
        this.toggleModal = this.toggleModal.bind(this);
        this.getImageFromUploader = this.setProfilePic.bind(this);
        this.setProfilePic = this.setProfilePic.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.setBio = this.setBio.bind(this);
    }

    //lifecycle function
    async componentDidMount() {
        console.log("app mounted");
        //fetch user info from cookie session
        //add a table for profile pictures
        try {
            let userInfo = await axios.get("/user");
            this.setState({
                userInfo: userInfo.data,
            });
        } catch (e) {
            console.log("componentDidMount error", e);
        }
    }

    toggleModal() {
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }

    setProfilePic(image) {
        this.setState({
            userInfo: {
                ...this.state.userInfo,
                url: image,
            },
            uploaderIsVisible: false,
        });
    }

    closeModal() {
        this.setState({
            uploaderIsVisible: false,
        });
    }

    //function to set the bio
    setBio(bio) {
        this.setState({
            userInfo: {
                ...this.state.userInfo,
                bio: bio,
            },
            uploaderIsVisible: false,
        });
    }

    render() {
        return (
            <React.Fragment>
                <BrowserRouter>
                    <Banner>
                        <h1>Social Network</h1>
                        <Link className="header-link" to="/friends">
                            Your friends
                        </Link>
                        <Link className="header-link" to="/users">
                            Find users
                        </Link>
                        <Link className="header-link" to="/chat">
                            Public Chat
                        </Link>
                        <a className="header-link" href="/logout">
                            logout
                        </a>

                        <Route>
                            <Link to="/">
                                {this.state.userInfo.url ? (
                                    <img
                                        className="profile-pic-thumbnail"
                                        src={this.state.userInfo.url}
                                    />
                                ) : (
                                    <img
                                        className="profile-pic-thumbnail"
                                        src="./blank_profile.png"
                                    />
                                )}
                            </Link>
                        </Route>
                    </Banner>

                    <div className="profile-wrapper">
                        <Route path="/genusers" render={() => <GenUsers />} />
                        <Route path="/users" render={() => <FindPeople />} />
                        <Route path="/friends" render={() => <Friends />} />
                        <Route
                            exact
                            path="/"
                            render={() => (
                                <Profile
                                    userInfo={this.state.userInfo}
                                    toggleModal={this.toggleModal}
                                    setBio={this.setBio}
                                />
                            )}
                        />
                        <Route
                            path="/user/:id"
                            render={(props) => (
                                <OtherProfile
                                    key={props.match.url}
                                    match={props.match}
                                    history={props.history}
                                    user={this.state.userInfo.id}
                                />
                            )}
                        />
                        <Route path="/chat" component={Chat} />
                    </div>
                </BrowserRouter>

                {this.state.uploaderIsVisible && (
                    <Uploader
                        setProfilePic={this.setProfilePic}
                        closeModal={this.closeModal}
                    />
                )}
            </React.Fragment>
        );
    }
}
