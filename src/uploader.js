import React from 'react';
import axios from './axios';

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null,
            error: null
        };
        this.fileChange = this.fileChange.bind(this);
        this.fileUpload = this.fileUpload.bind(this);
        this.showfileData = this.showfileData.bind(this);
    }
    // when the user selects an image
    // store that image in state
    // store the file in FormData
    // once the file is in FormData, then we can send the file to the server
    fileChange(e) {
        this.setState({
            file: e.target.files[0]
        })
    }


    async fileUpload(e) {
        e.preventDefault();
        //we are using FormData because we're working with a file.
        if (!this.state.file) {
            this.setState({
                error: 'you must choose a file.'
            })
            return;
        }
        let formData = new FormData();
        formData.append('file', this.state.file);
        try {
            let JSON = await axios.post('/uploadPic', formData);
            if (JSON) {
                this.props.setProfilePic(JSON.data.url);
            } else {
                console.log('something went wrong uploading image');
            }
        } catch (e) {
            console.log('error in Uploader.js - UploadImage:', e);
        }
    }

    showfileData() {
        if (this.state.file) {
            return (
                <div>
                    <h2>File Details:</h2>
                    <p>File Name: {this.state.file.name}</p>
                    <p>File Type: {this.state.file.type}</p>
                    <p>File Size: {this.state.file.size / 1000}kb</p>
                    <p>
                        Last Modified:{" "}
                        {this.state.file.lastModifiedDate.toDateString()}
                    </p>
                </div>
            );
        } else {
            return;
        }
    };

    render() {
        return (
            <div>
                <p onClick={this.props.closeModal}>X</p>
                <p>Upload a new Image</p>
                <div>
                    <input
                        type="file"
                        onChange={this.fileChange}
                    />
                    <button onClick={this.fileUpload}>Upload</button>
                    <span>{this.state.error}</span>
                </div>
                {this.showfileData()}
            </div>
        )
    }
}