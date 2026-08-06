const TOKEN_KEY = 'InvoiceFlow_token';
const USER_KEY = 'InvoiceFlow_user';
export const getToken = () => {
    try {
        return localStorage.getItem(TOKEN_KEY);
    } catch {
        return null;
    }
};
export class ApiError extends Error {
    constructor({ message, status, code, errors, isNetwork, isCancel }) {
        super(message);
        this.name = 'ApiError';
        this.status = status ?? null;
        this.code = code ?? null;
        this.errors = errors ?? null;
        this.isNetwork = Boolean(isNetwork);
        this.isCancel = Boolean(isCancel);
    }
};
export const clearToken = ()=>{
    try{
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    }catch{

    }
}