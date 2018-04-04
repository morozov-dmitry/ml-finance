import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import symbols from './symbols/reducer';
import stocks from './stocks/reducer'
import forecasts from './forecasts/reducer'

export default combineReducers({
    symbols,
    stocks,
    forecasts,
    routing: routerReducer,
});