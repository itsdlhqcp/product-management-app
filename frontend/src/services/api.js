import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

export const signup = (data) => API.post('/auth/signup', data);
export const signin = (data) => API.post('/auth/signin', data);
