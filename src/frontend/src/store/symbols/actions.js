import * as actionTypes from './actionTypes';

export function fetchSymbols(symbols) {
    return {type: actionTypes.FETCH_SYMBOLS, symbols};
}