const dateTimeHelper = require('./dateTimeHelper')
const dateformat = require('dateformat')
const yahooFinance = require('yahoo-finance')

const HISTORY_COLLECTION = 'stock_log';
const FORECAST_COLLECTION = 'stock_forecast';
const DATE_FORMAT = 'yyyy-mm-dd'


const PREDICTION_MODEL = 'RandomForestRegressor'


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
                // {"model":PREDICTION_MODEL},
                {"symbol":symbol},
                {"date":{"$gte":dateFrom}},
                {"date":{"$lte":dateTo}}
            ]},
        {fields: {_id: 0, symbol: 0}})
        .sort({date: 1})
}

const getAllHistoryData = (db, symbol) => {
    const [dateFrom, dateTo] = dateTimeHelper.getHistoryDataWindow()
    return db.collection(HISTORY_COLLECTION).find({'$and': [
                {"symbol": symbol}
            ]},
        {fields: {_id: 0, open: 0, close: 0, high: 0, low: 0, volume: 0, symbol: 0}})
        .sort({date: 1})
}

const getAllForecastedData = (db, symbol) => {
    const [dateFrom, dateTo] = dateTimeHelper.getForecastWindow()
    return db.collection(FORECAST_COLLECTION).find({'$and': [
                {"symbol":symbol}
            ]},
        {fields: {_id: 0, symbol: 0}})
        .sort({date: 1})
}

const remapStockData = (groupedBySymbolStocks) => {
    let stocks = []
    for(let symbol in groupedBySymbolStocks) {
        const symbolData = groupedBySymbolStocks[symbol]
        symbolData.map((singleSymbolData) => {
            if(typeof(singleSymbolData['adjClose']) != 'undefined'){
                stocks.push(singleSymbolData)
            }
        })
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
    db.collection(HISTORY_COLLECTION).insertMany(stocks, (queryerr, result) => {
        if (queryerr) throw queryerr;
    })
}

const saveStockDataToDatabaseFromCLI = (db, stocks) => {
    db.collection(HISTORY_COLLECTION).insertMany(stocks, (queryerr, result) => {
        if (queryerr) throw queryerr;
        console.log('Stock prices were downloaded');
        process.exit(0)
    })
}

module.exports = {
    getHistoryData,
    getForecastedData,
    getAllHistoryData,
    getAllForecastedData,
    loadStockData,
    loadStockHistoryData,
    remapStockData,
    saveStockDataToDatabase,
    saveStockDataToDatabaseFromCLI
}
