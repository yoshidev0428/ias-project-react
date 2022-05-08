import React from 'react';
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
    return (
        <button className='btn btn-light btn-sm' style={{ width: props.width ? props.width + "%" : "50%"}} onClick={props.click}>
            <Icon size={0.6}
                horizontal
                vertical
                rotate={180}
                color="#212529"
                path={props.icon}>
            </Icon>{props.label}
        </button>
    );
}

export default RectangleButton; // connect wrapper function in use 