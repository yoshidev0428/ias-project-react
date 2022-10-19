const DEFAULT_PARAMS = {
    isLoggedIn: sessionStorage.getItem("authToken") != null,
    token: sessionStorage.getItem("authToken"),
    tokenType: sessionStorage.getItem("authTokenType"),
    authPage: sessionStorage.getItem("authToken") ? null : process.env.REACT_APP_LOGIN_PAGE,
    user: null,
    otpSecrets: null,
    message: null,
    status: null,
    type: null,
};

const initState = {
    ...DEFAULT_PARAMS
}

const authReducer = (state = initState, action) => {
    switch (action.type) {
        case process.env.REACT_APP_SET_AUTH:
            state.authPage = action.data;
            return state
        default:
            return state
    }
};

export default authReducer;