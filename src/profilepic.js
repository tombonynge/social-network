import React from "react";

//function component
// export default function ProfilePic(props) {
//     const pic = props.pic;
//     if (pic) {
//         return (
//             <div className="profile-pic-wrapper">
//                 <img
//                     className="profile-pic"
//                     src={props.pic}
//                 />
//                 <button onClick={props.toggleModal}>edit profile picture</button>
//             </div>
//         )
//     } else {
//         return (
//             <div className="profile-pic-wrapper">
//                 <img
//                     className="profile-pic"
//                     src='./blank_profile.png'
//                 />
//                 <button onClick={props.toggleModal}>edit profile picture</button>
//             </div>
//         )
//     }

// }

/********Nicer way to do the above**********/
export default function ProfilePic({
    pic = "./blank_profile.png",
    toggleModal,
}) {
    return (
        <div className="profile-pic-wrapper">
            <img className="profile-pic" src={pic} />
            <div className="bio-btn" onClick={toggleModal}>
                edit profile picture
            </div>
        </div>
    );
}
