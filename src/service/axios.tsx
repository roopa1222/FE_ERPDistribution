// eslint-disable-next-line import/no-extraneous-dependencies
import axios from 'axios';

const userApi = axios.create();
userApi.defaults.timeout = 10000;

userApi.interceptors.request.use(
  async (config: any) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);

userApi.interceptors.response.use(
  (response: any) => response,
  (error: any) => Promise.reject(error)
);

export default userApi;
