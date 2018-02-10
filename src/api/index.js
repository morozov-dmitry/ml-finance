const cors = require('cors')
const express = require('express');
const dateformat = require('dateformat');
const yahooFinance = require('yahoo-finance');
const MongoClient = require('mongodb').MongoClient;

let app = express();
app.use(cors())

const dsn = "mongodb://mongo:27017/udacity-finance";

// Stock prices symbols to download
// let symbols = ['GOOG', 'IBM', 'AAPL', 'NVDA', 'SPY']

const symbols = ['GOOG']

const createSymbolsLoadHash = () => {
    let loadHash = {}
    symbols.forEach((symbol) => {
        loadHash[symbol] = false
    })
    return loadHash;
}

app.get('/', function (req, res) {
    res.send('Hello World!');
})

app.get('/real-time', function(req, res){
    const SYMBOLS = ['GOOG', 'IBM', 'AAPL', 'NVDA', 'SPY'];
    const FIELDS = ['a', 'b', 'b2', 'b3', 'p', 'o', 'c1', 'c', 'c6', 'k2', 'p2'];
    yahooFinance.snapshot({
        fields: FIELDS,
        symbols: SYMBOLS
    }).then(function (result) {
        res.send({"status": 0, "data": result});
    });
})

MongoClient.connect(dsn, (err, mongoclient) => {

    if (err) {
        res.status(500).send(JSON.stringify({status: 1, message: "Can't connect to database"}))
    }

    const db = mongoclient.db("udacity-finance");

    app.get('/history/:symbol', function (req, res) {
        const symbol = req.param('symbol')
        if (typeof(symbol) === 'undefined' || !symbols.includes(symbol)) {
            res.status(400).send({
                status: 1,
                message: "Correct symbol must be provides (one of " + symbols.concat(', ') + ")"
            })
        }
        else {
            const currentDate = new Date;
            const dateFrom = new Date(currentDate.getTime() - 31 * 24 * 60 * 60 * 1000);
            db.collection("stock_log").find({'$and': [
                    {"symbol": symbol},
                    {"date":{"$gte":dateFrom}},
                    {"date":{"$lte":currentDate}}
                ]},
                {fields: {_id: 0, open: 0, close: 0, high: 0, low: 0, volume: 0, symbol: 0}})
                .sort({date: 1})
                .toArray(function (err, stocks) {
                    if (!err) {
                        res.send({"status": 0, "data": stocks});
                    }
                    else {
                        res.send({"status": 1, "error": err});
                    }
                });
        }
    });

    app.get('/forecast/:symbol', function (req, res) {
        const symbol = req.param('symbol')
        if (typeof(symbol) === 'undefined' || !symbols.includes(symbol)) {
            res.status(400).send({
                status: 1,
                message: "Correct symbol must be provides (one of " + symbols.concat(', ') + ")"
            })
        }
        else {
            const currentDate = new Date;
            const dateTo = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
            db.collection("stock_forecast").find({'$and': [
                        {"symbol": symbol},
                        {"date":{"$gte":currentDate}},
                        {"date":{"$lte":dateTo}}
                    ]},
                {fields: {_id: 0, open: 0, close: 0, high: 0, low: 0, volume: 0, symbol: 0, adjClose: 0}})
                .sort({date: 1})
                .toArray(function (err, stocks) {
                    if (!err) {
                        res.send({"status": 0, "data": stocks});
                    }
                    else {
                        res.send({"status": 1, "error": err});
                    }
                });
        }
    });

    // @todo remove after python implementation
    app.get('/fake-forecast', function (req, res) {
        const currentDate = new Date;
        const dateFrom = new Date(currentDate.getTime() - 8 * 24 * 60 * 60 * 1000);
        db.collection("stock_log").find({'$and': [
                    {"symbol": 'GOOG'},
                    {"date":{"$gte":dateFrom}}
                ]},
            {fields: {_id: 0}})
            .sort({date: 1})
            .toArray(function (err, stocks) {
                if (!err) {
                    const data = [];
                    let i = 1;
                    stocks.map((stock) => {
                        stock.date = new Date(currentDate.getTime() + i * 24 * 60 * 60 * 1000);
                        stock.forecast = stock.adjClose + (Math.random() * (10 - (-10)) + (-10))
                        data.push(stock)
                        i++;
                    })
                    db.collection("stock_forecast").insertMany(data, function (err, res) {
                        if (err) throw err;
                        console.log(data.length + " documents were inserted", res);
                    });
                    res.send({"status": 0, "data": "ok"});
                }
                else {
                    res.send({"status": 1, "error": err});
                }
            });
    })

    app.get('/load', function (req, res) {

        const currentDate = new Date;
        const dateTo = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
        const dateFrom = dateTo;

        const processSymbolData = (err, quotes, symbol, db, res) => {

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

        let loadHash = createSymbolsLoadHash()

        for (let symbol in loadHash) {
            console.log(dateFrom, dateformat(dateFrom, "yyyy-mm-dd"), dateTo, dateformat(dateTo, "yyyy-mm-dd"));
            yahooFinance.historical({
                symbol: symbol,
                from: dateformat(dateFrom, "yyyy-mm-dd"),
                to: dateformat(dateTo, "yyyy-mm-dd"),
            }, (err, quotes) => processSymbolData(err, quotes, symbol, db));
        }

    });

    app.get('/full-load', function (req, res) {

        const processSymbolData = (err, quotes, symbol, db, res) => {

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

        // Current day
        const currentDate = new Date;
        const dateTo = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);

        // Previous 7 days
        const dateFrom = new Date(dateTo.getTime() - 3 * 31 * 24 * 60 * 60 * 1000);

        let loadHash = createSymbolsLoadHash()

        for (let symbol in loadHash) {
            yahooFinance.historical({
                symbol: symbol,
                from: dateformat(dateFrom, "yyyy-mm-dd"),
                to: dateformat(dateTo, "yyyy-mm-dd"),
            }, (err, quotes) => processSymbolData(err, quotes, symbol, db));
        }

    });

});

app.listen(3001, function () {
    console.log('Example app listening on port 3001!');
});