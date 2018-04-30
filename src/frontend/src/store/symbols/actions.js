import * as actionTypes from './actionTypes';

export function fetchSymbols(symbols) {
    return {type: actionTypes.FETCH_SYMBOLS, symbols};
}

export function setSymbol(symbol) {
    return {type: actionTypes.SET_SYMBOL, symbol};
}