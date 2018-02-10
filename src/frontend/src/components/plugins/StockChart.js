import React, { Component } from 'react';
import {createRandomData} from "../../helpers/data-helpers";
import Highcharts from 'highcharts/highstock'
import {HighchartsStockChart, Chart, withHighcharts, XAxis, YAxis, Title, Series, FlagSeries, Navigator, PlotBand} from 'react-jsx-highstock'

class StockChart extends Component {

    constructor (props) {
        super(props)
        const unitSales = props.historyData
        const unitSales2 = props.forecastedData
        this.state = {
            unitSales,
            unitSales2
        }
    }

    render() {
        console.log(this.state);
        const { unitSales, unitSales2 } = this.state;
        return (
            <section>
                <HighchartsStockChart>
                    <Chart zoomType="x" />

                    <Title>Highstocks with Navigator Plot Bands</Title>

                    <XAxis ordinal={"true"}>
                        <XAxis.Title>Date</XAxis.Title>
                    </XAxis>

                    <YAxis id="sales">
                        <YAxis.Title>Stock price</YAxis.Title>
                        <Series id="unitSales" name="History data" data={unitSales} />
                        <Series id="unitSales2" name="Forecasted data" data={unitSales2} />
                    </YAxis>

                    <Navigator>
                        <Navigator.Series seriesId="unitSales" />
                        <Navigator.Series seriesId="unitSales2" />
                    </Navigator>

                </HighchartsStockChart>
            </section>
        );
    }
}

export default withHighcharts(StockChart, Highcharts);
