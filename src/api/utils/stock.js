const dateTimeHelper = require('./dateTimeHelper')
const dateformat = require('dateformat')
const symbol = require('./symbol');
const yahooFinance = require('yahoo-finance')

const HISTORY_COLLECTION = 'stock_log';
const FORECAST_COLLECTION = 'stock_forecast';
const DATE_FORMAT = 'yyyy-mm-dd'


const getHistoryData = (db, symbol) => {
    const [dateFrom, dateTo] = dateTimeHelper.getHistoryDataWindow()
    return db.collection(HISTORY_COLLECTION).find({'$and': [
                {"symbol": symbol},
                {"date":{"$gte":dateFrom}},
                {"date":{"$lte":dateTo}}
            ]},
        {fields: {_id: 0, open: 0, close: 0, high: 0, low: 0, volume: 0, symbol: 0}})
        .sort({date: 1})
}

const getForecastedData = (db, symbol) => {
    const [dateFrom, dateTo] = dateTimeHelper.getForecastWindow()
    return db.collection(FORECAST_COLLECTION).find({'$and': [
                {"model":"KNeighborsRegressor"},
                {"symbol":symbol},
                {"date":{"$gte":dateFrom}},
                {"date":{"$lte":dateTo}}
            ]},
        {fields: {_id: 0, open: 0, close: 0, high: 0, low: 0, volume: 0, symbol: 0, adjClose: 0, model: 0, score: 0}})
        .sort({date: 1})
}

const remapStockData = (groupedBySymbolStocks) => {
    const symbols = symbol.list
    let stocks = []
    for(let symbol in groupedBySymbolStocks) {
        stocks = stocks.concat(groupedBySymbolStocks[symbol])
    }
    return stocks;
}

const loadStockData = (symbol) => {
    const symbols = symbol.list
    const [dateFrom, dateTo] = dateTimeHelper.getLoadDataWindow()
    return yahooFinance.historical({
        symbols: symbols,
        from: dateformat(dateFrom, DATE_FORMAT),
        to: dateformat(dateTo, DATE_FORMAT),
    })
}

const loadStockHistoryData = (symbol) => {
    const symbols = symbol.list
    const [dateFrom, dateTo] = dateTimeHelper.getFullDataLoadWindow()
    return yahooFinance.historical({
        symbols: symbols,
        from: dateformat(dateFrom, DATE_FORMAT),
        to: dateformat(dateTo, DATE_FORMAT),
    })
}

const saveStockDataToDatabase = (db, stocks) => {
    return db.collection(HISTORY_COLLECTION).insertMany(stocks, function (queryerr, result) {
        if (queryerr) throw queryerr;
    })
}

module.exports = {
    getHistoryData,
    getForecastedData,
    loadStockData,
    loadStockHistoryData,
    remapStockData,
    saveStockDataToDatabase
}
