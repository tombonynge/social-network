import React from "react";
import axios from "./axios";

export default class Bioeditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inEditMode: false,
            inputBio: "",
        };
        this.clickToUploadBio = this.clickToUploadBio.bind(this);
        this.clickToEditBio = this.clickToEditBio.bind(this);
        this.renderBio = this.renderBio.bind(this);
        this.updateInputBio = this.updateInputBio.bind(this);
    }

    async clickToUploadBio() {
        const bio = this.state.inputBio;
        if (bio != "") {
            try {
                let response = await axios.post("/updatebio", { bio: bio });
                if (response) {
                    this.props.setBio(bio);
                }
            } catch (e) {
                console.log("error in bioeditor - clickToUploadBio", e);
            }
        }

        this.setState({
            inEditMode: false,
        });
    }

    clickToEditBio() {
        this.setState({
            inEditMode: true,
        });
    }

    updateInputBio(e) {
        this.setState({
            inputBio: e.target.value,
        });
    }

    renderBio() {
        const inEditMode = this.state.inEditMode;
        const bio = this.props.bio;
        if (inEditMode) {
            return (
                <>
                    <textarea onChange={this.updateInputBio}></textarea>
                    <div className="bio-btn" onClick={this.clickToUploadBio}>
                        Save
                    </div>
                </>
            );
        } else {
            if (bio) {
                return (
                    <>
                        <div className="bio">{bio}</div>
                        <div className="bio-btn" onClick={this.clickToEditBio}>
                            Edit
                        </div>
                    </>
                );
            } else {
                return (
                    <>
                        <div className="bio-btn" onClick={this.clickToEditBio}>
                            Add a Bio
                        </div>
                    </>
                );
            }
        }
    }

    render() {
        return <div className="bio-wrapper">{this.renderBio()}</div>;
    }
}
