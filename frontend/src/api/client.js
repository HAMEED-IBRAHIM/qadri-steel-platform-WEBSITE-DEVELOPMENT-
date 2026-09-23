// src/api/client.js
// Axios instance configured for Qadri Steel & Tubes backend API

import axios from "axios";

const client = axios.create({
  baseURL: "http://127.0.0.1:8001",
  timeout: 10000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default client;
