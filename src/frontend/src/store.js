import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from './store/reducers';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const logger = store => next => action => {
    // console.log('ACTION', action);
    // console.group(action.type);
    // console.log('prev state', store.getState())
    // console.info('dispatching', action)
    let result = next(action)
    // console.log('next state', store.getState())
    // console.groupEnd(action.type)
    return result
}

export default createStore(
    rootReducer,
    composeEnhancers(
        applyMiddleware(logger)
    )
);