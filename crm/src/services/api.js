import axios from 'axios';
import Cookies from 'js-cookie'; 


const baseUrl = import.meta.env.VITE_BASE_URL;
console.log(`baseurl is ${baseUrl}`);
const api = axios.create({
    baseURL : baseUrl,
    withCredentials: true,
});

// Attach token to every request
api.interceptors.request.use(config => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, error => {
    return Promise.reject(error);
  });
  
  export {api};
