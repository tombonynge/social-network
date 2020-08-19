import React from "react";
import axios from "./axios";

// const http = require('https');
import styled from "styled-components";
const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
`;

export default class GenUsers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            num: null,
            names: [],
        };
        this.genUsers = this.genUsers.bind(this);
        this.setNameList = this.setNameList.bind(this);
        this.genBios = this.genBios.bind(this);
    }
    setNameList(e) {
        //parse list to an array
        const str = e.target.value;
        const arr = str.replace(/\n/g, "").split(" ");
        let nameArray = [];
        arr.forEach((element) => {
            if (element !== "") {
                nameArray.push(element.replace(/[^a-z0-9+]+/gi, ""));
            }
        });
        if (nameArray.length % 2 === 0) {
            const finalNames = [];
            for (let i = 0; i < nameArray.length; i++) {
                //get photos!

                finalNames.push({
                    firstname: nameArray[i],
                    lastname: nameArray[i + 1],
                });
                i++;
            }

            this.setState({
                names: finalNames,
            });
        } else {
            console.log(
                "this list is not an even pairing of first and last names"
            );
            this.setState({
                names: [],
            });
        }
    }

    genUsers() {
        console.log("generating!");
        const { names } = this.state;
        axios.post("/genusers", { names });
    }

    genBios() {
        console.log("generating bios");
        axios.post("/adduserbios");
    }

    render() {
        return (
            <Wrapper>
                <h2>Generate Users</h2>
                <a href="http://listofrandomnames.com/" target="_blank">
                    random names
                </a>
                <textarea onChange={this.setNameList}></textarea>
                <ul>
                    {this.state.names.map((user, index) => (
                        <li key={index}>
                            <span>
                                {user.firstname} {user.lastname}
                            </span>
                        </li>
                    ))}
                </ul>
                <button onClick={this.genUsers}>Generate Users</button>
                <button onClick={this.genBios}>Generate bios</button>
            </Wrapper>
        );
    }
}

/*
const fs = require('fs');
const request = require('request');
var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){    
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

download('https://www.google.com/images/srpr/logo3w.png', './images/google.png', function(){
  console.log('done');
});
*/
