import * as CONST from '../../constants/authConstant'
const DEFAULT_PARAMS = {
  isLoggedIn: sessionStorage.getItem("authToken") != null,
  token: sessionStorage.getItem("authToken"),
  tokenType: sessionStorage.getItem("authTokenType"),
  authPage: sessionStorage.getItem("authToken") ? null : CONST.LOGIN_PAGE,
  user: null,
  otpSecrets: 'null',
  message:null,
  status:null,
  type:null,
};


const initState = {
    ...DEFAULT_PARAMS
  }
  
////action 
const auth = (state = initState, action) => {
  switch (action.type) {
    case CONST.SET_AUTH:
      state.authPage = action.data;
      break;
    case "auth_logIn":
      console.log("This is Login Action");      
      break;
    case "auth_loggedIn":
      setLoggedIn(state, action.payload);
      setUser(action.payload.user);
      sessionStorage.setItem("authToken", action.payload.token);
      sessionStorage.setItem("authTokenType", action.payload.tokenType);
      console.log("loggedin");
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
  state.user = user;
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
  state.authPage = CONST.LOGIN_PAGE;
};
const setAuthPage = (state, page) => {
  state.authPage = page;

  if (page !== CONST.OTP_QR_PAGE) {
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