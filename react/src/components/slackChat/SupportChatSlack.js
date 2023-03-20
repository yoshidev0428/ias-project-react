import React from 'react';
import { connect } from 'react-redux';
// import Button from "@mui/material/Button";
// import Slider from "@mui/material/Slider";
// import Grid from "@mui/material/Grid";
// import Icon from "@mdi/react";
// import {Col, Container} from "react-bootstrap";
// import {styled} from "@mui/material/styles";
// import TextField from "@mui/material/TextField";
// import {ReactSlackChat} from "react-slack-chat";
import ReactSlackChat from './ReactSlackChat';

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

const SupportChatSlack = () => {
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
        botName={'support-ias-react-bot'} // VisitorID, CorpID, Email, IP address etc.
        // botName='pragmatismer666@gmail.com' // VisitorID, CorpID, Email, IP address etc.
        apiToken={'xoxb-2644799806533-4841549102548-fEW0ET4MKoyyOtGyaqidXYlA'}
        channels={[
          {
            name: 'ias-support-chat',
            id: 'C04H9NKCKR6',
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
        helpText="Support Chat - Need Help?"
        themeColor="#856090"
        userImage="../../assets/images/avatar.png"
        // userImage='http://www.iconshock.com/img_vista/FLAT/mail/jpg/robot_icon.jpg'
        defaultChannel="ias-support-chat"
        debugMode={true}
        hooks={[
          {
            /* My Custom Hook */
            id: 'getSystemInfo',
            action: () => Promise.resolve('MY SYSTEM INFO!'),
          },
        ]}
      />
    </>
  );
};

export default connect(mapStateToProps)(SupportChatSlack);
