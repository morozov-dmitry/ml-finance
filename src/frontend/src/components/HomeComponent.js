import React, { Component } from 'react';
import { connect } from 'react-redux';
import StockChart from './plugins/StockChart'

class HomeComponent extends Component {

    render() {
        const stocks = this.props.stocks.list;
        const forecasts = this.props.forecasts.list;
        const stocksLoaded = typeof(stocks)!=='undefined' && stocks.length>0
        const forecastLoaded = typeof(forecasts)!=='undefined' && forecasts.length>0
        const historyData = [];
        const forecastedData = [];
        if(stocksLoaded){
            stocks.map((stock) => {
                historyData.push([
                    Date.parse(stock.date),
                    stock.adjClose
                ]);
            })
        }
        console.log('stocks', stocks, 'forecasts', forecasts);
        if(forecastLoaded){
            forecasts.map((forecast) => {
                console.log('forecast', forecast, Date.parse(forecast.date), forecast.forecast);
                forecastedData.push([
                    Date.parse(forecast.date),
                    forecast.forecast
                ]);
            })
        }
        return (
            <section>
                {stocksLoaded && forecastLoaded && (<StockChart historyData={historyData} forecastedData={forecastedData}/>)}
            </section>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        stocks: state.stocks,
        forecasts: state.forecasts
    }
}

export default connect(mapStateToProps)(HomeComponent);
