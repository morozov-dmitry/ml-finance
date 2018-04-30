const express = require('express')
const cors = require('cors')
const mongoClient = require('mongodb').MongoClient
const symbol = require('./utils/symbol');
const stockModel = require('./utils/stock')

let app = express();
app.use(cors())

const dsn = "mongodb://mongo:27017/udacity-finance";

// Stock prices symbols to download
const symbols = symbol.list

app.get('/', function (req, res) {
    res.send('Welcome to udacity-finance API');
})

mongoClient.connect(dsn, (err, mongoClient) => {

    const db = mongoClient.db("udacity-finance")

    const symbolValidation = (req, res) => {
        const symbol = req.param('symbol')
        if (typeof(symbol) === 'undefined' || !symbols.includes(symbol)) {
            res.status(400).send({
                status: 1,
                message: "Correct symbol must be provides (one of " + symbols.concat(', ') + ")"
            })
            return false
        }
        return true
    }

    /**
     * Returns historical data (21 days) about stock prices
     */
    app.get('/history/:symbol', (req, res) => {
        if(symbolValidation(req, res)){
            const symbol = req.param('symbol')
            stockModel.getHistoryData(db, symbol)
                .toArray((err, stocks) => {
                    (!err) ? res.send({"status": 0, "data": stocks}) : res.send({"status": 1, "error": err})
                })
        }
    })

    /**
     * Returns forecasted data (7 days) about stock prices
     */
    app.get('/forecast/:symbol', (req, res) => {
        if(symbolValidation(req, res)){
            const symbol = req.param('symbol')
            stockModel.getForecastedData(db, symbol)
                .toArray((err, stocks) => {
                    (!err) ? res.send({"status": 0, "data": stocks}) : res.send({"status": 1, "error": err})
                })
        }
    })

    /**
     * Returns forecasted price data for whole historic period
     */
    app.get('/history-performance/:symbol', (req, res) => {
        if(symbolValidation(req, res)){
            const symbol = req.param('symbol')
            stockModel.getAllHistoryData(db, symbol)
                .toArray((err, stocks) => {
                    (!err) ? res.send({"status": 0, "data": stocks}) : res.send({"status": 1, "error": err})
                })
        }
    })

    /**
     * Returns forecasted data (7 days) about stock prices
     */
    app.get('/forecast-performance/:symbol', (req, res) => {
        if(symbolValidation(req, res)){
            const symbol = req.param('symbol')
            stockModel.getAllForecastedData(db, symbol)
                .toArray((err, stocks) => {
                    (!err) ? res.send({"status": 0, "data": stocks}) : res.send({"status": 1, "error": err})
                })
        }
    })

    /**
     * Loads data about strike prices for previous 3 months
     */
    app.get('/load', (req, res) => {
        stockModel.loadStockData(symbol)
            .then((result) => { return stockModel.remapStockData(result) })
            .then((stocks) => { return stockModel.saveStockDataToDatabase(db, stocks) })
            .then(() => { res.send({status: 0, data: 'Stock prices were downloaded'}) })
            .catch((e) => { res.status(500).send({status: 1, message: e.message}) })
    })

    /**
     * Loads data about strike prices for previous 3 months
     */
    app.get('/full-load', (req, res) => {
        stockModel.loadStockHistoryData(symbol)
            .then((result) => { return stockModel.remapStockData(result) })
            .then((stocks) => { return stockModel.saveStockDataToDatabase(db, stocks) })
            .then(() => { res.send({status: 0, data: 'Stock prices were downloaded'}) })
            .catch((e) => { res.status(500).send({status: 1, message: e.message}) })
    })

});

app.listen(3001, function () {
    console.log('Stock price prediction app listening on port 3001!');
});