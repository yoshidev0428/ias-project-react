
import React from "react";
import {Container, Col } from "react-bootstrap";
import {connect} from "react-redux";
import {Button} from "@mui/material";
import store from "../reducers";
const mapStateToPros = state => ({
    otpSecrets: state.auth.otpSecrets
  })
const RegisterOtpQr = (props) => {
    const handleContinue = async() => {
        store.dispatch({type:"auth_setAuthPage", page:null});
        store.dispatch({type:"auth_setAuthSecrets", payload:null});
      }
    return (
        <>
        <div className="otp-qr-container">
            <Container className="inner-container" label-position="left">
            <div className="title-container">
                <h3 className="title">{ "2 Factor Authorization QR Code" }</h3>
                <p>
                Please use an Authorization application to save this QR code, you will
                use the authorization code given by your app to log in
                </p>
            </div>
        
            <Col>
                <div id="qrsvg" className="d-flex justify-center" dangerouslySetInnerHTML={{ __html: props.otpSecrets?.qrSVG }}>
                    {/* {props.otpSecrets?.qrSVG} */}
                </div>
            </Col>
        
            <Col>
                <p>Secret:</p>
                <p>{ props.otpSecrets?.secret }</p>
            </Col>
        
            <Col>
                <label></label>
                <Button
                type="primary"
                size="large"
                onClick={handleContinue}
                style={{width: "100%", height: "50px", marginBottom: "30px", background: "lightblue", borderRadius: "2px"}}
                >
                Continue
                </Button>
            </Col>
            </Container>
        </div>
      </>
    )
}


export default connect(mapStateToPros)(RegisterOtpQr);