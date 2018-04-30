import axios from 'axios'

const api = "http://api.udfin.site"
const token = 'ea8cniliakt7csva7349pj60i4'

// Generate a unique token for storing your bookshelf data on the backend server.
const headers = {
    'Accept': 'application/json',
    'Authorization': token,
    'method' : 'GET'
}

export const getStocks = (symbol) =>
    axios.get(`${api}/history/${symbol}`, {'headers' : headers})
        .then((response) => {
            return response.data.data;
        })
        .catch((error) => {
            console.error(error);
        });

export const getForecast = (symbol) =>
    axios.get(`${api}/forecast/${symbol}`, {'headers' : headers})
        .then((response) => {
            return response.data.data;
        })
        .catch((error) => {
            console.error(error);
        });

export const getAllStocks = (symbol) =>
    axios.get(`${api}/history-performance/${symbol}`, {'headers' : headers})
        .then((response) => {
            return response.data.data;
        })
        .catch((error) => {
            console.error(error);
        });

export const getAllForecast = (symbol) =>
    axios.get(`${api}/forecast-performance/${symbol}`, {'headers' : headers})
        .then((response) => {
            return response.data.data;
        })
        .catch((error) => {
            console.error(error);
        });
