
import axios from 'axios';
import { store } from '../store';
import { logout, loginSuccess } from '../store/slices/authSlice';

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

const instance = axios.create({
  baseURL:'http://localhost:5000/api',
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers['Authorization'] = 'Bearer ' + token;
              resolve(axios(originalRequest));
            },
            reject: (err: any) => reject(err),
          });
        });
      }

      isRefreshing = true;

      try {

        const res = await instance.post(`/auth/refresh-token`, {}, { withCredentials: true });
        const { token, user } = res.data;


        localStorage.setItem('token', token);
        store.dispatch(loginSuccess({ name: user.name, token, role: user.role }));


        instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        processQueue(null, token);
        originalRequest.headers['Authorization'] = 'Bearer ' + token;
        return instance(originalRequest);
      } catch (err) {
        processQueue(err, null);

        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        store.dispatch(logout()); 


        window.location.href = `/login/student`; 
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);



export default instance;