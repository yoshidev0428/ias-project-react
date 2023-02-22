import React from 'react';
import { Image } from 'react-bootstrap';
import Icon from '@mdi/react';
import { COLORS } from '../constant/constants';
// import IconButton from '@mui/material/IconButton';
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

const CustomButton = (props) => {
    // "../../assets/images/" + props.image + ".png";
    return (
      // <IconButton className="mb-1"
      //     // style = {{minWidth:"16px", height:props.label ? '38px' : '28px', color:'#009688'}}
      //     style = {{minWidth:"25px", height:props.label ? '36px' : '22px', color:`${COLORS.LIGHT_CYAN}`}}
      //     onClick={props.click}
      //     size = "large"
      // >
      //     <div>
      //         {props.image &&
      //             <div className="">
      //                 <Image style={{margin: '0 auto', width:'11px', height:'11px'}} src={imageUrl} alt='no image' />
      //             </div>
      //         }
      //         {props.icon &&
      //             // <i className="ma-0"> mdi-{ props.icon }</i>
      //             // <Icon name={props.icon} />
      //             <Icon path={props.icon}
      //                 size={0.8}
      //                 horizontal
      //                 vertical
      //                 rotate={180}
      //                 color={COLORS.LIGHT_CYAN}
      //                 />
      //         }
      //         <div className="label-text">{props.label}</div>
      //     </div>
      // </IconButton>
      <div
        className="custom-button"
        onClick={props.click}
        style={{
          height: props.label ? "36px" : "22px",
          color: `${COLORS.LIGHT_CYAN}`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          minWidth: "25px",
        }}
      >
        {props.image && (
          <div
            className="d-flex m-auto"
            style={{ height: props.label ? "50%" : "100%" }}
          >
            <Image
              style={{ margin: "0 auto", width: "100%", height: "100%" }}
              src={require("../../assets/images/" + props.image + ".png")}
              alt="no image"
            />
          </div>
        )}
        {props.icon && (
          <div className="d-flex m-auto" style={{ justifyContent: "center" }}>
            <Icon path={props.icon} size={0.8} color={COLORS.LIGHT_CYAN} />
          </div>
        )}
        <div
          className="label-text text-center"
          style={{ height: props.label ? "50%" : "0" }}
        >
          {props.label}
        </div>
      </div>
    );
}



export default CustomButton; // connect wrapper function in use 