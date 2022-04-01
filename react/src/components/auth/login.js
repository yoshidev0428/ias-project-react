import React, { useState } from 'react';
import {connect} from 'react-redux';
import { useHistory } from 'react-router';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import * as authApi from "../../api/auth";
import store from '../../reducers'

const mapStateToProps = state => ({
  status : state.auth.status, 
  type: state.auth.type,
  message: state.auth.message,
  
})
const Login = (props) => {
  // User information hook
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [totp, setTotp] = useState('');
  // Function to call submit
  const handleLogin = async (e) => {
    // Prevents page reload on wrongs creds
    e.preventDefault();
    store.dispatch({type:"auth_setAlert", 
                          payload:{
                            status : false,
                            type:'',
                            message:''
                          }}
                          );
    const loginForm = {
      email:email,
      password:password,
      otp:totp
    }
    authApi
    .login(loginForm)
    .then(response => {
      if (response.status === 200) {
        store.dispatch({type:"auth_loggedIn", payload:{
          token: response.data.accessToken,
          tokenType: response.data.tokenType,
          user: response.data.user
        }});
        store.dispatch({type:"auth_setAuthPage", page:null});
      }
    })
    .catch(error => {

      if (!error.response) {
        // network error
          // this.errorStatus = 'Error: Network Error';
        store.dispatch({type:"auth_setAlert", 
                          payload:{
                            status : true,
                            type:'error',
                            message:'Network Error'
                          }}
                          );

      } else {
        store.dispatch({type:"auth_setAlert", 
                          payload:{
                            status : true,
                            type:'error',
                            message:'Email or password invalid'
                          }}
                          );
      }

      if (error.status === 401) {
        store.dispatch({type:"auth_logOut"});
      }
    });
  };

  const showRegistration = async (e) => {
    store.dispatch({type:"auth_setAuthPage", page:"registrationPage"});
  };
  return (
    <div className='login-container'>   
          <Container className='inner-container model rules auto-complete label-position'>
            <Container className="title-container">
              <h3 className='title'>{ "Login" }</h3>
            </Container>
            <Form onSubmit={handleLogin}>
              <Form.Group controlId="formLoginEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.currentTarget.value)} />
              </Form.Group>
              <Form.Group controlId="formLoginPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Enter password" value={password} onChange={(p) => setPassword(p.currentTarget.value)}/>
              </Form.Group>
              <Form.Group controlId="totp">
                <Form.Label>Totp</Form.Label>
                <Form.Control type="text" placeholder="123456" value={totp} onChange={(p) => setTotp(p.currentTarget.value)}/>
              </Form.Group>
              {props.status && <Alert variant='danger'>
                {props.message}
              </Alert>}
              <Button variant="primary" type="primary" block style={{width:'100%', height: '50px', color: 'black', marginBottom: '3px', background: 'lightblue', borderRadius: '2px'}}>
                Log In
              </Button>
            </Form>
            <Button type="button" className="link-button" onClick={showRegistration}>Switch to register</Button>
            {/* <a href="/register" className="link-button" onClick={showRegistration}>Switch to register</a> */}
          </Container>
    </div>    
  );
};

export default connect(mapStateToProps)(Login); // connect wrapper function in use 