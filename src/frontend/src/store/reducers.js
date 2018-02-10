import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import stocks from './stocks/reducer';
import forecasts from './forecasts/reducer';

export default combineReducers({
    stocks,
    forecasts,
    routing: routerReducer,
});