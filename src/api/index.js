const express = require('express');
const cors = require('cors')
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

MongoClient.connect(dsn, (err, mongoclient) => {

    const db = mongoclient.db("udacity-finance");

    /**
     * Returns historical data (14 days) about stock prices
     */
    app.get('/history/:symbol', function (req, res) {
        const currentDate = new Date;
        const dateFrom = new Date(currentDate.getTime() - 14 * 24 * 60 * 60 * 1000);
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
    });

    /**
     * Returns forecasted data (7 days) about stock prices
     */
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

    /**
     * Loads data about strike prices for previous day
     */
    app.get('/load', function (req, resp) {

        const currentDate = new Date;
        const dateTo = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
        const dateFrom = dateTo;

        const processSymbolData = (err, quotes, symbol, db) => {

            try
            {
                loadHash[symbol] = true
                db.collection("stock_log").insertMany(quotes, function (err, result) {
                    if (err) throw err;
                    console.log(symbol + " " + quotes.length + " documents were inserted", result);
                });
            }
            catch(e){
                console.log(e);
            }


            let showResponse = true
            for (let hashSymbol in loadHash) {
                if (!loadHash[hashSymbol]) {
                    showResponse = false
                    break
                }
            }

            if (showResponse) {
                resp.send({status: 0, data: 'Stock prices were downloaded'});
            }

        }

        let loadHash = createSymbolsLoadHash()

        for (let symbol in loadHash) {
            console.log(dateFrom, dateformat(dateFrom, "yyyy-mm-dd"), dateTo, dateformat(dateTo, "yyyy-mm-dd"));
            yahooFinance.historical({
                symbols: symbol,
                from: dateformat(dateFrom, "yyyy-mm-dd"),
                to: dateformat(dateTo, "yyyy-mm-dd"),
            }, (err, quotes) => processSymbolData(err, quotes, symbol, db));
        }

    });

    /**
     * Loads data about strike prices for previous 3 months
     */
    app.get('/full-load', function (req, resp) {

        // Current day
        const currentDate = new Date;
        const dateTo = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);

        // Previous 7 days
        const dateFrom = new Date(dateTo.getTime() - 3 * 31 * 24 * 60 * 60 * 1000);

        yahooFinance.historical({
            symbols: symbols,
            from: dateformat(dateFrom, "yyyy-mm-dd"),
            to: dateformat(dateTo, "yyyy-mm-dd"),
        }, (err, quotes) => {

            if (err) throw err;

            db.collection("stock_log").insertMany(quotes, function (queryerr, result) {
                if (queryerr) throw queryerr;
                console.log(symbol + " " + quotes.length + " documents were inserted", result);
                resp.send({status: 0, data: 'Stock prices were downloaded'});
            })

        })



    })

});

app.listen(3001, function () {
    console.log('Example app listening on port 3001!');
});