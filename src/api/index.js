let express = require('express');
let app = express();
let yahooFinance = require('yahoo-finance');

app.get('/', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ 'message' : 'Welcome to udacity-capstone-finance', 'version' : '0.0.1' }));
});

app.get('/get-data', function (req, res) {

    yahooFinance.historical({
        symbol: 'AAPL',
        from: '2012-01-01',
        to: '2012-12-31',
        // period: 'd'  // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only)
    }, function (err, quotes) {
        console.log(quotes);
        res.send(quotes);
    });

    res.send('Welcome to udacity-capstone-finance v.0.0.1');
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});