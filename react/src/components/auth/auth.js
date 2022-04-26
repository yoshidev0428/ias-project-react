
import React from 'react';
import { connect  } from 'react-redux'
import Login from "./login";
import Register from "./register";
import RegisterOtpQr from "./register_otp_qr";

const mapStateToProps = state => ({
  authPage:state.auth.authPage
})

const Auth = (props) => {

    return (
      <div className="auth-container">
        {/* <h1>{ props.authPage }</h1> */}
        {props.authPage === 'loginPage' && 
          <div>
            <Login />
          </div>
        }
        {props.authPage === 'registrationPage' && 
          <div>
            <Register/>
          </div>
        }
        {props.authPage === 'otpQRPage' && 
          <div>
            <RegisterOtpQr />
          </div>
        }
      </div>
    )
}


export default connect (mapStateToProps)(Auth);