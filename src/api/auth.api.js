import http from "./http";

export const authApi = {
    login:(email,password)=>
        http.post('/auth/login',{email,password}),
};