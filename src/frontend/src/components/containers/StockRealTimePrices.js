import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as stocksActionTypes from "../../store/stocks/actionTypes";
import * as forecastsActionTypes from "../../store/forecasts/actionTypes";
import * as symbolActionTypes from "../../store/symbols/actionTypes";
import * as ClientAPI from "../../utils/APIClient";

class StockRealTimePrices extends Component {

    handleSymbolClick(symbol, e) {
        e.preventDefault();
        const props = this.props
        props.dispatch({type: symbolActionTypes.SET_SYMBOL, payload: symbol})
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

    render() {
        const symbols = this.props.symbols.list
        return (
            <section className="top-header">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <ul className="currency-status">
                                {symbols.map((symbol, i) => (
                                    <li key={i}>
                                        <a href="" onClick={this.handleSymbolClick.bind(this, symbol)}>
                                            <span>{symbol}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        symbols: state.symbols
    }
}

export default connect(mapStateToProps)(StockRealTimePrices);
