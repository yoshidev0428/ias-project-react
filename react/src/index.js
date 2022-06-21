import React from 'react';
import ReactDOM from 'react-dom';
// import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux'
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import store from './reducers'
// import authReducer from './reducers/modules/authReducer';
// import counterReducer from './reducers/modules/counterReducer';

// const rootStore = combineReducers({
//   authReducer,
//   counterReducer
// })

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);

// const container = document.getElementById('root');
// const root = createRoot(container);
// root.render(
//     <Provider store={store}>
//         <App />
//     </Provider>,
// )
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
