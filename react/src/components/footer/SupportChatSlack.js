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
import ReactSlackChat from "../slackChat/ReactSlackChat";

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
                apiToken={"xoxb-2644799806533-4302683320614-a1yu6RWQtv22sAEIME1BiqCU"}
                channels={[
                    {
                        name: 'support-ias-react',
                        id: 'C048A88FX5Z',
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