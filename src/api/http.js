import axios from "axios";
const BASE_URL= import.meta.env.VITE_BASE_URL;
import { ApiError } from "./error";
import { clearToken } from "./token";
const http = axios.create({
    baseURL:BASE_URL,
    timeout:30000,
    headers:{
        'Content-Type':'application/json',
        Accept:'application/json'
    },
});

http.interceptors.request.use((config)=>{
    const token = localStorage.getItem('token');
    if(token){
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
},
(error)=>Promise.reject(error)
);


http.interceptors.response.use((response)=>{
    const responseType = response.config?.responseType;
    if(responseType === 'blob' || responseType === 'arraybuffer'){
        return response.data;
    }
    const body = response.data;
    if(body && typeof body === 'object' && 'success' in body){
        const {success,message,...rest}= body;
        return rest;
    }
    return body;
},
(error)=>{
    if(axios.isCancel(error)){
        return Promise.reject(
            new ApiError({message:'Request cancelled',isCancel:true})
        )
    }
    if(!error.response){
        const isTimeout = error.code === 'ECONNABORTED';
        return Promise.reject(
            new ApiError({
                message:isTimeout?'The request timed out. Please try again.'
                :'Network error.Check your connection and try again.',
                code:error.code,
                isNetwork:true,
            })
        )
    }
    const { status, data} = error.response;
    const isLoginCall = error.config?.url?.includes('/auth/login');
    if(status ===401 && !isLoginCall){
        clearToken();
        if(typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')){
            const next = encodeURIComponent(window.location.pathname + window.location.search);
            window.location.assign(`/login?session=expired&next=${next}`);
        }
    }
    return Promise.reject(new ApiError({
        message:data?.message || `Request failed (${status})`,
        status,
        errors:data?.errors || null
    }))
});

export default http;