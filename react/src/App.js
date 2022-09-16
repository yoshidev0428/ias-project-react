import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import './App.scss';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Auth from './pages/auth';
import MainFrame from './pages/MainFrame';
const mapStateToProps = state => ({
    isShowAuthPage: state.auth.authPage !== null,
    isLoggedIn: !state.auth.isLoggedIn
})

const App = (props) => {

    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/npm/plotty";
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        }
    }, []);

    return (
        <>
            {props.isShowAuthPage ? <Auth /> : <MainFrame />}
        </>
    )
}

export default connect(mapStateToProps)(App);
