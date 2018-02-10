import * as actionTypes from './actionTypes';

const initialState = {
    list: []
};

export default (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_STOCKS:
            return {
                ...state,
                ['list'] : action.payload,
            }
        default:
            return state;
    }
};

