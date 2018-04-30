import React, { Component } from 'react';
import { connect } from 'react-redux';
import StockChart from './plugins/StockChart'
import { parseTimeSeriesData, getSeriesWithBestPerformance } from '../helpers/data-helpers'

class HomeComponent extends Component {

    render() {

        // Getting data from store
        const stocks = this.props.stocks.list;
        let forecasts = this.props.forecasts.list;
        const symbol = this.props.symbols.current;

        // Checking does data ready for display
        const stocksLoaded = typeof(stocks)!=='undefined' && stocks.length>0
        const forecastLoaded = typeof(forecasts)!=='undefined'

        // Formatting data from API response
        let historyData, forecastedData = []
        if(stocksLoaded){
            historyData = parseTimeSeriesData(stocks, 'adjClose')
        }
        if(forecastLoaded){
            forecasts = getSeriesWithBestPerformance(forecasts)
            console.log('forecasts optimal', forecasts);
            forecastedData = parseTimeSeriesData(forecasts, 'forecast')
        }

        // Formatting data for HighStock
        const series = [
            {
                'name' : 'Price',
                'id' : 'historyData',
                'data' : historyData
            },
            {
                'name' : 'Forecasted price',
                'id' : 'forecastedData',
                'data' : forecastedData
            }
        ]
        const title = `Stock prices ${symbol}`

        return (
            <section>
                {stocksLoaded && forecastLoaded && (<StockChart series={series} title={title}/>)}
            </section>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        stocks: state.stocks,
        forecasts: state.forecasts,
        symbols: state.symbols
    }
}

export default connect(mapStateToProps)(HomeComponent);
