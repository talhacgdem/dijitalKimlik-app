import axios from 'axios';

const authApi = axios.create({
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Request Interceptor
authApi.interceptors.request.use(
    (config) => {
        console.log('[Request]', {
            url: config.url,
            method: config.method,
            headers: config.headers,
            data: config.data,
        });
        return config;
    },
    (error) => {
        console.log('[Request Error]', error);
        return Promise.reject(error);
    }
);

// Response Interceptor
authApi.interceptors.response.use(
    (response) => {
        console.log('[Response]', {
            url: response.config.url,
            status: response.status,
            data: response.data,
        });
        return response;
    },
    (error) => {
        if (error.response) {
            console.log('[Response Error]', {
                url: error.config?.url,
                status: error.response.status,
                data: error.response.data,
            });
        } else {
            console.log('[Network Error]', error.message);
        }
        return Promise.reject(error);
    }
);

export default authApi;