import * as CONST from '../../constants/authConstant'
const DEFAULT_PARAMS = {
  isLoggedIn: sessionStorage.getItem("authToken") != null,
  token: sessionStorage.getItem("authToken"),
  tokenType: sessionStorage.getItem("authTokenType"),
  authPage: sessionStorage.getItem("authToken") ? null : CONST.LOGIN_PAGE,
  user: null,
  otpSecrets: null,
  message:null,
  status:null,
  type:null,
};


const initState = {
    ...DEFAULT_PARAMS
  }
  
 
const authReducer = (state = initState, action) => {
  switch (action.type) {
    case CONST.SET_AUTH:
      state.authPage = action.data;
      return state
    default:
      return state
  }
};
  
export default authReducer;