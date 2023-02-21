import React, {useState} from "react";
import {connect} from 'react-redux';
// import Button from "@mui/material/Button";
// import Slider from "@mui/material/Slider";
// import Grid from "@mui/material/Grid";
// import Icon from "@mdi/react";
// import {Col, Container} from "react-bootstrap";
// import {styled} from "@mui/material/styles";
// import TextField from "@mui/material/TextField";
import {submit_message} from "../../api/auth";
// import {ReactSlackChat} from "react-slack-chat";
import ReactSlackChat from "./ReactSlackChat";

const mapStateToProps = (state) => ({
    user: state.auth.user
});

const SupportChatSlack = (props) => {

    // function handleCloseChatBox() {
    //     props.updateShowFlag();
    // }

    return (
        <>
            {/* <div className="position-fixed chat-area bg-white rounded p-2 border">
                <div className="d-flex" >
                    <h6>Support Chat - Need Help?</h6>
                    <button className="btn-primary rounded button-small m-auto" color="primary" size="small" onClick={handleCloseChatBox}> &times;
                    </button>
                </div>                
            </div> */}
            <ReactSlackChat
                closeChatButton={true}
                botName={"support-ias-react-bot"} // VisitorID, CorpID, Email, IP address etc.
                // botName='pragmatismer666@gmail.com' // VisitorID, CorpID, Email, IP address etc.
                apiToken={"xoxb-4841592794769-4831515153300-QREMtS00lL8v4xjkZf12vuVl"}
                channels={[
                    {
                        name: 'create-chat-bot',
                        id: 'C04QA0Q2P6H',
                    },
                    // {
                    //     name: 'test',
                    //     id: 'C48SAX4',
                    //     icon: ''
                    // },
                    // {
                    //     name: 'test22',
                    //     id: '',
                    //     icon: './logo.svg'
                    // }
                ]}
                helpText='Support Chat - Need Help?'
                themeColor='#856090'
                userImage='http://www.iconshock.com/img_vista/FLAT/mail/jpg/robot_icon.jpg'
                defaultChannel='create-chat-bot'
                debugMode={true}
                hooks={[
                    {
                        /* My Custom Hook */
                        id: 'getSystemInfo',
                        action: () => Promise.resolve('MY SYSTEM INFO!')
                    }
                ]}
            />
        </>
    );
};

export default connect(mapStateToProps)(SupportChatSlack);