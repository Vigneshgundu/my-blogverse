// import axios from "axios";
// const token : string = "";
// const custom_axios = axios.create({
//     baseURL: import.meta.env.VITE_BASE_URL,
//     headers: {
//         Authorization: "Bearer"+localStorage.getItem("token"),
//         Accept: "*/*",
//         "Content-Type": "application/json"
//     },
//     timeout: 5000
// })
// export default custom_axios;



import axios from 'axios';

const custom_axios = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    Accept: "*/*",
    "Content-Type": "application/json"
  },
  timeout: 5000
});

custom_axios.interceptors.request.use(config => {
  if (typeof window !== 'undefined') { // Check if we are in the browser
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return config;
});

export default custom_axios;
