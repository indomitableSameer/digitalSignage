// useGlobalVar.js
import axios from 'axios';

const baseApi = axios.create({
  baseURL: 'https://device.dss.com:4001/web',
  withCredentials: true,
});

export default baseApi;
