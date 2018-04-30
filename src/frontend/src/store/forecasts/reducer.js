import * as actionTypes from './actionTypes';

const initialState = {
    list: [],
    all: []
};

export default (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_FORECASTS:
            return {
                ...state,
                ['list'] : action.payload,
            }
        case actionTypes.FETCH_ALL_FORECASTS:
            return {
                ...state,
                ['all'] : action.payload,
            }
        default:
            return state;
    }
};

