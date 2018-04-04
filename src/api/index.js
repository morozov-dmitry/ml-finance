const express = require('express');
const cors = require('cors')
const dateformat = require('dateformat');
const yahooFinance = require('yahoo-finance');
const MongoClient = require('mongodb').MongoClient;

let app = express();
app.use(cors())

const dsn = "mongodb://mongo:27017/udacity-finance";

// Stock prices symbols to download
const symbols = ['GOOG', 'IBM', 'AAPL', 'NVDA', 'SPY']

app.get('/', function (req, res) {
    res.send('Welcome to udacity-finance API');
})

MongoClient.connect(dsn, (err, mongoclient) => {

    const db = mongoclient.db("udacity-finance");

    /**
     * Returns historical data (14 days) about stock prices
     */
    app.get('/history/:symbol', function (req, res) {
        const symbol = req.param('symbol')
        const currentDate = new Date;
        const dateFrom = new Date(currentDate.getTime() - 21 * 24 * 60 * 60 * 1000);
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
            const dateFrom = new Date(currentDate.getTime() - 1 * 24 * 60 * 60 * 1000);
            const dateTo = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
            db.collection("stock_forecast").find({'$and': [
                    {"model":"KNeighborsRegressor"},
                    {"symbol":symbol},
                    {"date":{"$gte":dateFrom}},
                    {"date":{"$lte":dateTo}}
                ]},
                {fields: {_id: 0, open: 0, close: 0, high: 0, low: 0, volume: 0, symbol: 0, adjClose: 0, model: 0, score: 0}})
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
     * Loads data about strike prices for previous 3 months
     */
    app.get('/load', function (req, resp) {

        const dateTo = new Date;
        const dateFrom = new Date(dateTo.getTime() - 24 * 60 * 60 * 1000);

        yahooFinance.historical({
            symbols: symbols,
            from: dateformat(dateFrom, "yyyy-mm-dd"),
            to: dateformat(dateTo, "yyyy-mm-dd"),
        }, (err, quotes) => {
            if (err) throw err;
            let stocks = []
            for(let symbol in quotes) {
                stocks = stocks.concat(quotes[symbol])
            }
            db.collection("stock_log").insertMany(stocks, function (queryerr, result) {
                if (queryerr) throw queryerr;
                resp.send({status: 0, data: 'Stock prices were downloaded'});
            })
        })
    })

    /**
     * Loads data about strike prices for previous 3 months
     */
    app.get('/full-load', function (req, resp) {

        // Current day
        const currentDate = new Date;
        const dateTo = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);

        // Previous 3 months
        const dateFrom = new Date(dateTo.getTime() - 3 * 31 * 24 * 60 * 60 * 1000);

        yahooFinance.historical({
            symbols: symbols,
            from: dateformat(dateFrom, "yyyy-mm-dd"),
            to: dateformat(dateTo, "yyyy-mm-dd"),
        }, (err, quotes) => {
            if (err) throw err;
            let stocks = []
            for(let symbol in quotes) {
                stocks = stocks.concat(quotes[symbol])
            }
            db.collection("stock_log").insertMany(stocks, function (queryerr, result) {
                if (queryerr) throw queryerr;
                resp.send({status: 0, data: 'Stock prices were downloaded'});
            })
        })
    })

});

app.listen(3001, function () {
    console.log('Example app listening on port 3001!');
});