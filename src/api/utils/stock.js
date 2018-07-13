const dateTimeHelper = require('./dateTimeHelper')
const dateformat = require('dateformat')
const yahooFinance = require('yahoo-finance')

const HISTORY_COLLECTION = 'stock_log';
const FORECAST_COLLECTION = 'stock_forecast';
const DATE_FORMAT = 'yyyy-mm-dd'


/**
 * Returns historical stock data
 * @param db MongoDB database connection
 * @param symbol stock price symbol which data is going to be shown.
 * @returns {Cursor} MongoDB cursor
 */
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

/**
 * Returns historical stock data
 * @param db MongoDB database connection
 * @param symbol stock price symbol which data is going to be shown.
 * @returns {Cursor} MongoDB cursor
 */
const getForecastedData = (db, symbol) => {
    const [dateFrom, dateTo] = dateTimeHelper.getForecastWindow()
    return db.collection(FORECAST_COLLECTION).find({'$and': [
                {"symbol":symbol},
                {"date":{"$gte":dateFrom}},
                {"date":{"$lte":dateTo}}
            ]},
        {fields: {_id: 0, symbol: 0}})
        .sort({date: 1})
}

/**
 * Returns historical stock data
 * @param db MongoDB database connection
 * @param symbol stock price symbol which data is going to be shown.
 * @returns {Cursor} MongoDB cursor
 */
const getAllHistoryData = (db, symbol) => {
    return db.collection(HISTORY_COLLECTION).find({'$and': [
                {"symbol": symbol}
            ]},
        {fields: {_id: 0, open: 0, close: 0, high: 0, low: 0, volume: 0, symbol: 0}})
        .sort({date: 1})
}

/**
 * Returns historical stock data
 * @param db MongoDB database connection
 * @param symbol stock price symbol which data is going to be shown.
 * @returns {Cursor} MongoDB cursor
 */
const getAllForecastedData = (db, symbol) => {
    return db.collection(FORECAST_COLLECTION).find({'$and': [
                {"symbol":symbol}
            ]},
        {fields: {_id: 0, symbol: 0}})
        .sort({date: 1})
}

/**
 * Maps Yahoo Finance result data to array of stocks data.
 * @param groupedBySymbolStocks
 * @returns {Array}
 */
const remapStockData = (groupedBySymbolStocks) => {
    let stocks = []
    for(let symbol in groupedBySymbolStocks) {
        const symbolData = groupedBySymbolStocks[symbol]
        symbolData.map((singleSymbolData) => {
            singleSymbolData['date'].setHours(0,0,0,0)
            if(typeof(singleSymbolData['adjClose']) != 'undefined'){
                stocks.push(singleSymbolData)
            }
        })
    }
    return stocks;
}

/**
 * Loads stock data for previous day from Yahoo Finance service.
 * @param symbol stock prices symbol
 * @returns {*}
 */
const loadStockData = (symbol) => {
    const symbols = symbol.list
    const [dateFrom, dateTo] = dateTimeHelper.getLoadDataWindow()
    return yahooFinance.historical({
        symbols: symbols,
        from: dateformat(dateFrom, DATE_FORMAT),
        to: dateformat(dateTo, DATE_FORMAT),
    })
}

/**
 * Loads stock data for 3 years from Yahoo Finance service.
 * @param symbol stock prices symbol
 * @returns {*}
 */
const loadStockHistoryData = (symbol) => {
    const symbols = symbol.list
    const [dateFrom, dateTo] = dateTimeHelper.getFullDataLoadWindow()
    return yahooFinance.historical({
        symbols: symbols,
        from: dateformat(dateFrom, DATE_FORMAT),
        to: dateformat(dateTo, DATE_FORMAT),
    })
}

/**
 * Saves stock data to database.
 * @param db MongoDB database connection
 * @param stocks array of stock prices data
 */
const saveStockDataToDatabase = (db, stocks) => {
    db.collection(HISTORY_COLLECTION).insertMany(stocks, (queryerr, result) => {
        if (queryerr) throw queryerr;
    })
}

/**
 * Saves stock data to database. For CLI renders result.
 * @param db MongoDB database connection
 * @param stocks array of stock prices data
 */
const saveStockDataToDatabaseFromCLI = (db, stocks) => {
    db.collection(HISTORY_COLLECTION).insertMany(stocks, (queryerr, result) => {
        if (queryerr) throw queryerr;
        console.log('Stock prices were downloaded')
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
