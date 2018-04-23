import React, { Component } from 'react';
import {createRandomData} from "../../helpers/data-helpers";
import Highcharts from 'highcharts/highstock'
import {HighchartsStockChart, Tooltip, Chart, withHighcharts, XAxis, YAxis, AreaSplineSeries, Title, Series, FlagSeries, Navigator, PlotBand} from 'react-jsx-highstock'

class StockChart extends Component {

    constructor (props) {
        super(props)
        const historyData = props.historyData
        const forecastedData = props.forecastedData
        this.state = {
            historyData,
            forecastedData
        }
    }

    render() {
        const { historyData, forecastedData } = this.state;
        return (
            <section>
                <HighchartsStockChart>

                    <Chart zoomType="x" />

                    <Title>Stock prices</Title>

                    <Tooltip />

                    <XAxis ordinal={"true"}>
                        <XAxis.Title>Date</XAxis.Title>
                    </XAxis>

                    <YAxis id="sales">
                        <YAxis.Title>Stock price</YAxis.Title>
                        <Series id="historyData" name="Price" data={historyData} />
                        <Series id="forecastedData" name="Forecasted price" data={forecastedData} />
                    </YAxis>

                    <Navigator>
                        <Navigator.Series seriesId="historyData" />
                        <Navigator.Series seriesId="forecastedData" />
                    </Navigator>

                </HighchartsStockChart>
            </section>
        );
    }
}

export default withHighcharts(StockChart, Highcharts);
