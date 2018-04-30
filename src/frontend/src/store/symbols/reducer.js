import * as actionTypes from './actionTypes';

const initialState = {
    list: [],
    current: 'GOOG'
};

export default (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_SYMBOLS:
            return {
                ...state,
                ['list'] : action.payload,
            }
        case actionTypes.SET_SYMBOL:
            return {
                ...state,
                ['current'] : action.payload,
            }
        default:
            return state;
    }
};

