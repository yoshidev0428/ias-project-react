import { api } from "./base";

export const login = params => {
    const formData = new FormData();
    formData.append("username", params.email); // email is username
    formData.append("password", params.password);
    formData.append("otp", params.otp);
    return api.post("auth/login", formData);
};

// export const logout = params => {
//   return api.post("logout", params);
// };

export const register_user = params => {
    return api.post("auth/register", params);
};
