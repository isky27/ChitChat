import axios from 'axios';
const CryptoJS = require("crypto-js");
export const baseURL = process.env.REACT_APP_MAIN_URL;

/**
* Define interceptor to handle api resoponse and set header value
*/
const InterceptorApi = () => {

    axios.interceptors.request.use(function (req) {

        let originalRequest = req;

        // return originalRequest;
        return { ...originalRequest, baseURL: baseURL };
    }, (error) => {
        return Promise.reject(error);
    })
    axios.interceptors.response.use((response) => {
        const secretKey = process.env.REACT_APP_EN_KEY
        if (response?.data) {
            const bytes = CryptoJS.AES.decrypt(response?.data,secretKey);
            const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            return { ...response, data:decryptedData };
        }
        else {
            return response
        }
    }, (error) => {
        return Promise.reject(error);
    })
}
export default InterceptorApi