let express = require('express');
let dateformat = require('dateformat');
let yahooFinance = require('yahoo-finance');
let app = express();

let MongoClient = require('mongodb').MongoClient;
let dsn = "mongodb://mongo:27017/udacity-finance";

// Stock prices symbols to download
let symbols = ['GOOG', 'IBM', 'AAPL', 'NVDA', 'SPY']

let createSymbolsLoadHash = () => {
    let loadHash = {}
    symbols.forEach((symbol) => {
        loadHash[symbol] = false
    })
    return loadHash;
}

app.get('/', function (req, res) {
    res.send('Hello World!');
});


MongoClient.connect(dsn, (err, mongoclient) => {

    if (err) {
        res.status(500).send(JSON.stringify({status: 1, message: "Can't connect to database"}))
    }

    const db = mongoclient.db("udacity-finance");

    app.get('/history/:symbol', function (req, res) {
        if (typeof(req.param('symbol')) === 'undefined' || !symbols.includes(req.param('symbol'))) {
            res.status(400).send({
                status: 1,
                message: "Correct symbold must be provides (one of " + symbols.concat(', ') + ")"
            })
        }
        else {
            res.send({status: 0, data: req.param('symbol')});
        }
    });

    app.get('/load', function (req, res) {

        // Current day
        const dateTo = new Date;

        // Previous day
        const dateFrom = new Date(dateTo.getTime() - 24 * 60 * 60 * 1000);

        let loadHash = createSymbolsLoadHash()

        const processSymbolData = (err, quotes, symbol, db) => {

            db.collection("stock_log").insertMany(quotes, function (err, res) {
                if (err) throw err;
                console.log(symbol + " " + quotes.length + " documents were inserted", res);
            });

            loadHash[symbol] = true
            let showResponse = true
            for (let hashSymbol in loadHash) {
                if (!loadHash[hashSymbol]) {
                    showResponse = false
                    break
                }
            }

            if (showResponse) {
                res.send({status: 0, data: 'Stock prices were downloaded'});
            }

        }

        for (let symbol in loadHash) {
            yahooFinance.historical({
                symbol: symbol,
                from: dateformat(dateFrom, "yyyy-mm-dd"),
                to: dateformat(dateTo, "yyyy-mm-dd"),
            }, (err, quotes) => processSymbolData(err, quotes, symbol, db));
        }

    });

});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});