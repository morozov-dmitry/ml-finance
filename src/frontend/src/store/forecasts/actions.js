import * as actionTypes from './actionTypes';

export function fetchForecasts(forecasts) {
    return {type: actionTypes.FETCH_FORECASTS, forecasts};
}

export function fetchAllForecasts(forecasts) {
    return {type: actionTypes.FETCH_ALL_FORECASTS, forecasts};
}