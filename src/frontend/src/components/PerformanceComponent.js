import React, { Component } from 'react';
import { connect } from 'react-redux';
import StockChart from './plugins/StockChart'
import { parseTimeSeriesData, groupTimeSeriesByField } from '../helpers/data-helpers'


class PerformanceComponent extends Component {

    state = {
        stocks: [],
        forecasts: []
    }

    render() {
        const stocks = this.props.stocks.all;
        let forecasts = this.props.forecasts.all;
        const symbol = this.props.symbols.current;

        // Checking does data ready for display
        const stocksLoaded = typeof(stocks)!=='undefined' && stocks.length>0
        const forecastLoaded = typeof(forecasts)!=='undefined'

        // Formatting data from API response
        let historyData, forecastedData, series = []
        if(stocksLoaded){
            historyData = parseTimeSeriesData(stocks, 'adjClose')
            series.push({
                'name' : 'Real stock price',
                'id' : 'historyData',
                'data' : historyData
            })
        }
        if(forecastLoaded){
            forecastedData = groupTimeSeriesByField(forecasts, 'model')
            for(let i in forecastedData){
                const modelForecastedData = parseTimeSeriesData(forecastedData[i], 'forecast')
                series.push({
                    'name' : `${i} model forecast`,
                    'id' : i,
                    'data' : modelForecastedData
                })
            }
        }

        // Highchart title
        const title = `Machine Learning methods performance: ${symbol}`

        return (
            <section>
                {stocksLoaded && forecastLoaded && (<StockChart series={series} title={title} showNavigator={'true'}/>)}
            </section>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        symbols: state.symbols,
        stocks: state.stocks,
        forecasts: state.forecasts,
    }
}

export default connect(mapStateToProps)(PerformanceComponent);
