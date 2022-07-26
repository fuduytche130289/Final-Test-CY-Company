import axios from "axios";

let axiosInstance = null;
let headers = {
    'Content-Type': 'application/json'
}

function setHeaders(inputHeaders) {
    headers = inputHeaders;
}

function getHeaders() {
    return headers;
}

function getInstance() {
    if (axiosInstance != null) {
        return axiosInstance;
    }
    axiosInstance = axios.create({
        baseURL: process.env.VUE_APP_BASE_API,
        headers: getHeaders()
    })

    //hook interceptor cai o day
    axiosInstance.interceptors.request.use(config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    })

    axiosInstance.interceptors.response.use(response => {
        return response;
    }, error => {
        if (error.response.status === 401) {
            localStorage.removeItem('token');
            this.$toast.error('Bạn phải đăng nhập để truy cập vào đây', {
                timeout: 2000,
            });
            window.location.href = '/login';
        }
        return Promise.reject(error);
    })
    return axiosInstance;
}

function get(endpointApiUrl, payLoad = {}) {
    return getInstance().get(endpointApiUrl, {
        params: payLoad
    })
}

function post(endpointApiUrl, payLoad = {}) {
    return getInstance().post(endpointApiUrl, payLoad)
}

function put(endpointApiUrl, payLoad = {}) {
    return getInstance().put(endpointApiUrl, payLoad);
}

function del(endpointApiUrl, payLoad = {}) {
    return getInstance().delete(endpointApiUrl, payLoad);
}

export const Axios = {
    axiosInstance,
    getHeaders,
    setHeaders,
    get,
    post,
    put,
    del
}