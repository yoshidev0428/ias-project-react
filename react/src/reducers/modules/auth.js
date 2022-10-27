const DEFAULT_PARAMS = {
    isLoggedIn: sessionStorage.getItem("authToken") !== null,
    token: sessionStorage.getItem("authToken"),
    tokenType: sessionStorage.getItem("authTokenType"),
    authPage: sessionStorage.getItem("authToken") ? null : process.env.REACT_APP_LOGIN_PAGE,
    user: sessionStorage.getItem("authUser") !== null ? JSON.parse(sessionStorage.getItem("authUser")) : null,
    otpSecrets: 'null',
    message: null,
    status: null,
    type: null,
};


const initState = {
    ...DEFAULT_PARAMS
}

////action 
const auth = (state = initState, action) => {
    switch (action.type) {
        case process.env.REACT_APP_SET_AUTH:
            state.authPage = action.data;
            break;
        case "auth_logIn":
            console.log("This is Login Action");
            break;
        case "auth_loggedIn":
            setLoggedIn(state, action.payload);
            setUser(state, action.payload.user);
            sessionStorage.setItem("authToken", action.payload.token);
            sessionStorage.setItem("authTokenType", action.payload.tokenType);
            // console.log("loggedin", action.payload.user, typeof action.payload.user);
            break;
        case "auth_setAuthPage":
            setAuthPage(state, action.page);
            break;
        case "auth_setAlert":
            setAlert(state, action.payload);
            break;
        case "auth_logOut":
            sessionStorage.removeItem("authToken");
            sessionStorage.removeItem("authTokenType");
            sessionStorage.removeItem("authUser");
            setLoggedOut(state);
            break;
        case "auth_setAuthSecrets":
            setAuthSecrets(state, action.payload);
            break;
        default:
            break;
    }
    return {...state}
};


///mutiation
const setUser = (state, user) => {
    let jsonUser = {
        email: user.email,
        fullName: user.fullName,
        isActive: user.isActive,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
        _id: user._id,
    }
    state.user = jsonUser;
    sessionStorage.setItem("authUser", JSON.stringify(jsonUser));
};
const setLoggedIn = (state, payload) => {
    state.isLoggedIn = true;
    state.token = payload.token;
    state.tokenType = payload.tokenType;
    state.authPage = null;
};
const setLoggedOut = (state) => {
    state.isLoggedIn = false;
    state.token = null;
    state.tokenType = null;
    state.authPage = process.env.REACT_APP_LOGIN_PAGE;
};
const setAuthPage = (state, page) => {
    state.authPage = page;

    if (page !== process.env.REACT_APP_OTP_QR_PAGE) {
        setAuthSecrets(state, null);
    }
};
const setAuthSecrets = (state, otpSecrets) => {
    state.otpSecrets = otpSecrets;
};
const setAlert = (state, payload) => {
    state.status = payload.status;
    state.type = payload.type;
    state.message = payload.message;
};
export default auth;