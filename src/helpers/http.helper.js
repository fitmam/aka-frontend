import axios from "axios";

const http = (token) => {
  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return axios.create({
    headers,
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  });
};

export default http;
