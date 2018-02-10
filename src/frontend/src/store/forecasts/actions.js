import * as actionTypes from './actionTypes';

export function fetchForecasts(forecasts) {
    return {type: actionTypes.FETCH_FORECASTS, forecasts};
}