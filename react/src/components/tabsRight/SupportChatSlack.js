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

const mapStateToProps = (state) => ({
    user: state.auth.user
});

const SupportChatSlack = (props) => {

    const [message, setMessage] = useState("");
    async function submitForm(e) {
        e.preventDefault();
        let res = await submit_message(message);
        if (res.data === "ok" && res.status === 200) {
            setMessage("");
            alert("Message Sent!");
        } else {
            alert("There was an error.  Please try again later.");
        }
    }

    return (
        <>
            <div className="position-fixed chat-area bg-white rounded p-2 border">
                <div className="align-center" >
                    <h6>Support Chat - Need Help?</h6>
                </div>
                <textarea
                    className="block text-gray-700 border rounded p-1 leading-tight focus:outline-none focus:bg-white w-100"
                    id="message"
                    type="message"
                    placeholder="Write your message here"
                    value={message}
                    onChange={(e) => {setMessage(e.target.value)}}
                />
                <button className="btn-primary focus:shadow text-white font-bold rounded w-100" onClick={(e) => submitForm(e)}>
                    Submit
                </button>
            </div>
        </>
    );
};

export default connect(mapStateToProps)(SupportChatSlack);