import React from 'react';
import { Image } from 'react-bootstrap';
import IconButton from '@mui/material/IconButton';

import Icon from '@mdi/react';
// import { Icon } from 'semantic-ui-react';
// const styleLink = document.createElement("link");
// styleLink.rel = "stylesheet";
// styleLink.href = 
// "https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css";
// document.head.appendChild(styleLink);

// const click = async (e) => {
//     // Prevents page reload on wrongs creds
//     console.log("clicked")
// };

const RectangleButton = (props) => {
    const imageUrl = "../../assets/images/" + props.image + ".png";
    return (
        <button className="btn btn-light btn-sm w-50" onClick={props.click}>
            <Icon size={0.8}
                horizontal
                vertical
                rotate={180}
                color="#212529"
                path={props.icon}>
            </Icon>2D
        </button>
    );
}

export default RectangleButton; // connect wrapper function in use 