import * as actionTypes from './actionTypes';

export function fetchStocks(stocks) {
    return {type: actionTypes.FETCH_STOCKS, stocks};
}