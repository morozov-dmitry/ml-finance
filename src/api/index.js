let express = require('express');
let dateformat = require('dateformat');
let yahooFinance = require('yahoo-finance');
let app = express();

let MongoClient = require('mongodb').MongoClient;
let url = "mongodb://ucp-mongodb:27017/";

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

app.get('/load', function (req, res) {

    // Current day
    const dateTo = new Date;
    // Previous day
    const dateFrom = new Date(dateTo.getTime() - 24 * 60 * 60 * 1000);

    let loadHash = createSymbolsLoadHash()

    const processSymbolData = (err, quotes, symbol) => {

        loadHash[symbol] = true
        let showResponse = true
        for(let hashSymbol in loadHash){
            if(!loadHash[hashSymbol]){
                showResponse = false
                break
            }
        }

        if(showResponse){
            res.send('Data downloaded');
        }

        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("udacity-finance");
            db.collection("stock_log").insertMany(quotes, function(err, res) {
                if (err) throw err;
                console.log("1 documents were inserted");
                db.close();
            });
        });

    }

    for(let symbol in loadHash){
        yahooFinance.historical({
            symbol: symbol,
            from: dateformat(dateFrom, "yyyy-mm-dd"),
            to: dateformat(dateTo, "yyyy-mm-dd"),
        }, (err, quotes) => processSymbolData(err, quotes, symbol));
    }


});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});