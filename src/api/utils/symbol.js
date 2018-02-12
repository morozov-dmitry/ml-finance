const symbols = ['GOOG'/*, 'IBM', 'AAPL', 'NVDA', 'SPY'*/]

const getForecast = () =>
    axios.get(`${api}/forecast/GOOG`, {'headers' : headers})
        .then(function (response) {
            return response.data.data;
        })
        .catch(function (error) {
            console.error(error);
        });
