import React, { Component } from 'react';
import { connect } from 'react-redux';
import StockChart from './plugins/StockChart'
import ReactTable from "react-table"
import "react-table/react-table.css";
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

        let tableData = [];

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

        if(stocksLoaded && forecastedData){
            for(let i in stocks){
                let rowData = stocks[i]
                rowData['forecasted'] = 0
                rowData['score'] = 0
                for(let j in forecastedData['RandomForestRegressor']){
                    if(forecastedData['RandomForestRegressor'][j]['date'] == rowData['date']){
                        rowData['forecasted'] = forecastedData['RandomForestRegressor'][j]['forecast']
                        rowData['score'] = forecastedData['RandomForestRegressor'][j]['score']
                        break;
                    }
                }
                rowData['difference'] = rowData['adjClose'] - rowData['forecasted']
                tableData.push(rowData)
            }
        }

        console.log('tableData', tableData)

        // Highchart title
        const title = `Machine Learning methods performance: ${symbol}`

        return (
            <section>
                {stocksLoaded && forecastLoaded && (
                    <div>
                        <StockChart series={series} title={title} showNavigator={'false'}/>
                        <ReactTable
                            data={tableData}
                            columns={[
                                {
                                    Header: "Date",
                                    accessor: "date"
                                },
                                {
                                    Header: "Real price",
                                    accessor: "adjClose"
                                },
                                {
                                    Header: "Forecasted price",
                                    accessor: "forecasted"
                                }
                            ]}
                            defaultPageSize={10}
                            className="-striped -highlight"
                        />
                    </div>)}
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
