import React from 'react';
import {connect} from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './App.scss';
import Auth from './components/auth/auth';
import MainFrame from './components/MainFrame';
const mapStateToProps = state => ({
  isShowAuthPage: state.auth.authPage == null,
  // isShowAuthPage: false,
  isLoggedIn: !state.auth.isLoggedIn
})
const  App = (props) => {
  return (
    // Router Code
      // <BrowserRouter>
      //   <div  className="App container-fluid noPadding">
      //     <ProtectedRoute 
      //         path='/'
      //         exact 
      //         strict
      //         component = {MainFrame}
      //       />
      //   </div>      
      // </BrowserRouter>
      <>
      {props.isShowAuthPage ? <Auth />: <MainFrame />}
      </>
  )
}

export default connect(mapStateToProps)(App);
