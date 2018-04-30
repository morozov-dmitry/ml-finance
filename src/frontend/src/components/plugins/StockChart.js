import React, { Component } from 'react';
import {createRandomData} from "../../helpers/data-helpers";
import Highcharts from 'highcharts/highstock'
import {HighchartsStockChart, Tooltip, Chart, withHighcharts, XAxis, YAxis, AreaSplineSeries, Title, Series, FlagSeries, Navigator, PlotBand, Legend} from 'react-jsx-highstock'

class StockChart extends Component {

    render() {
        const { series, title, showNavigator } = this.props;
        console.log('showNavigator', showNavigator)
        /*
        const { historySeriesId, forecastedSeriesId} = ['historyData' + symbol, 'forecastedData' + symbol]
        <Navigator>
            <Navigator.Series seriesId="historyData" />
            <Navigator.Series seriesId="forecastedData" />
        </Navigator>
        */

        return (
            <section>
                <HighchartsStockChart>

                    <Chart zoomType="x" />

                    <Title>{ title }</Title>

                    <Tooltip />

                    <XAxis ordinal={"true"}>
                        <XAxis.Title>Date</XAxis.Title>
                    </XAxis>

                    <YAxis id="sales">
                        <YAxis.Title>Stock price</YAxis.Title>
                        {series.map((singleSeries, i) => (
                            <Series key={i} id={singleSeries.id} name={singleSeries.name} data={singleSeries.data} />
                        ))}
                    </YAxis>

                    { showNavigator && (
                        <Navigator>
                            {series.map((singleSeries, i) => (
                                <Navigator.Series key={i} seriesId={singleSeries.id} />
                            ))}
                        </Navigator>
                    )}

                    <Legend layout="horizontal" align="center" verticalAlign="bottom" />

                </HighchartsStockChart>
            </section>
        );
    }
}

export default withHighcharts(StockChart, Highcharts);
