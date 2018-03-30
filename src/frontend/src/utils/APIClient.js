import axios from 'axios'

const api = "http://localhost:3001"
const token = 'ea8cniliakt7csva7349pj60i4'

// Generate a unique token for storing your bookshelf data on the backend server.
const headers = {
    'Accept': 'application/json',
    'Authorization': token,
    'method' : 'GET'
}

export const getStocks = () =>
    axios.get(`${api}/history/GOOG`, {'headers' : headers})
        .then(function (response) {
            return response.data.data;
        })
        .catch(function (error) {
            console.error(error);
        });

export const getForecast = () =>
    axios.get(`${api}/forecast/GOOG`, {'headers' : headers})
        .then(function (response) {
            return response.data.data;
        })
        .catch(function (error) {
            console.error(error);
        });
