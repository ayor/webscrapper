import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: process.env.BASE_URL,//process.env.BASE_URL_PROD,// "http://localhost:5000/scrapper-api/v1/comments",
    headers: {
        'Content-Type': 'application/json',
    }
})

//"http://localhost:5000/scrapper-api/v1/comments",
