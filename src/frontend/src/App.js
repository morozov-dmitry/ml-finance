import React, { Component } from 'react'
import { Route, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import * as ClientAPI from './utils/APIClient'
import * as stocksActionTypes from './store/stocks/actionTypes'
import * as forecastsActionTypes from './store/forecasts/actionTypes'
import * as symbolsActionTypes from './store/symbols/actionTypes'
import StockRealTimePrices from './components/containers/StockRealTimePrices'
import Loaders from './components/plugins/Loaders'
import Navigation from './components/plugins/Navigation'
import Footer from './components/plugins/Footer'
import HomeComponent from './components/HomeComponent'
import PerformanceComponent from './components/PerformanceComponent'
import FAQComponent from './components/FAQComponent'
import ContactComponent from './components/ContactComponent'

class App extends Component {
    componentDidMount() {
        let props = this.props
        const symbols = ['GOOG', 'IBM', 'AAPL', 'NVDA', 'SPY']
        const symbol = 'GOOG'
        props.dispatch({type: symbolsActionTypes.FETCH_SYMBOLS, payload: symbols})
        ClientAPI.getStocks(symbol)
            .then((stocks) => {
                props.dispatch({type: stocksActionTypes.FETCH_STOCKS, payload: stocks})
            })
        ClientAPI.getForecast(symbol)
            .then((forecasts) => {
                props.dispatch({type: forecastsActionTypes.FETCH_FORECASTS, payload: forecasts})
            })
        ClientAPI.getAllStocks(symbol)
            .then((stocks) => {
                props.dispatch({type: stocksActionTypes.FETCH_ALL_STOCKS, payload: stocks})
            })
        ClientAPI.getAllForecast(symbol)
            .then((forecasts) => {
                props.dispatch({type: forecastsActionTypes.FETCH_ALL_FORECASTS, payload: forecasts})
            })
    }
    render () {
        return (
            <div className="app">
                <Loaders />
                <StockRealTimePrices />
                <Navigation />
                <Route path='/' exact component={HomeComponent} />
                <Route path='/performance' exact component={PerformanceComponent} />
                <Route path='/faq' exact component={FAQComponent}/>
                <Route path='/contact' exact component={ContactComponent}/>
                <Footer />
            </div>
        );
    }
}

export default withRouter(connect()(App));