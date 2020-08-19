import React from "react";
import ProfilePic from "./profilepic";
import Bioeditor from "./bioeditor";

//styling
import styled from "styled-components";
const Wrapper = styled.div`
    display: flex;
`;
const Section = styled.div`
    flex-basis: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 1rem;
`;

export default function Profile(props) {
    return (
        <>
            <Wrapper>
                <Section>
                    <h2>
                        {props.userInfo.firstname} {props.userInfo.lastname}
                    </h2>
                    <ProfilePic
                        //url for profile pic - coming from > Profile props > App state
                        pic={props.userInfo.url}
                        toggleModal={props.toggleModal}
                    />
                </Section>
                <Section>
                    <Bioeditor bio={props.userInfo.bio} setBio={props.setBio} />
                </Section>
            </Wrapper>
        </>
    );
}
