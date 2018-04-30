#!/usr/bin/env node
'use strict';

const program = require('commander');
const mongoClient = require('mongodb').MongoClient
const symbol = require('./utils/symbol');
const stockModel = require('./utils/stock')


const dsn = "mongodb://mongo:27017/udacity-finance";
const DATABASE_NAME = "udacity-finance"

// Stock prices symbols to download
const symbols = symbol.list

/**
 * Provides base cli information.
 */
program
    .version('0.0.1')
    .description('Stock prices load command interface');

/**
 * Downloads stock data for previous day.
 */
program
    .command('load')
    .description('Loads stock prices for previous day')
    .action(() => {
        mongoClient.connect(dsn, (err, mongoClient) => {
            const db = mongoClient.db(DATABASE_NAME)
            stockModel.loadStockData(symbol)
                .then((result) => { return stockModel.remapStockData(result) })
                .then((stocks) => { return stockModel.saveStockDataToDatabaseFromCLI(db, stocks) })
                .catch((e) => { console.error(e); process.exit(1) })
        })
    })

/**
 * Downloads stock data for 3 years.
 */
program
    .command('full-load')
    .alias('full')
    .description('Loads stock prices for historical period')
    .action(() => {
        mongoClient.connect(dsn, (err, mongoClient) => {
            const db = mongoClient.db(DATABASE_NAME)
            stockModel.loadStockHistoryData(symbol)
                .then((result) => { return stockModel.remapStockData(result) })
                .then((stocks) => { return stockModel.saveStockDataToDatabaseFromCLI(db, stocks) })
                .catch((e) => { console.error(e); process.exit(1) })
        });
    });


program.parse(process.argv);