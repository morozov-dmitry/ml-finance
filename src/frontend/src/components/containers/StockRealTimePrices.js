import React, { Component } from 'react';
import { connect } from 'react-redux';

class StockRealTimePrices extends Component {

    render() {
        return (
            <section className="top-header">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <ul className="currency-status">
                                <li>
                                    <a href="#">
                                        <i className="tf-ion-arrow-down-b down-status"></i>
                                        <span>BTC/USD</span>
                                        <span>15046.07</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <i className="tf-arrow-dropup up-status"></i>
                                        <span>ETH/USD</span>
                                        <span >843.0005</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <i className="tf-arrow-dropup up-status"></i>
                                        <span>BCH/USD</span>
                                        <span>2648.1377</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <i className="tf-arrow-dropup up-status"></i>
                                        <span>BTG/USD</span>
                                        <span>278.0000</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <i className="tf-arrow-dropup down-status"></i>
                                        <span>DASH/USD</span>
                                        <span>1131.8100</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <i className="tf-arrow-dropup down-status"></i>
                                        <span>XRP/USD</span>
                                        <span>2.1956</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <i className="tf-arrow-dropup up-status"></i>
                                        <span>ZEC/USD</span>
                                        <span>2.1956</span>
                                    </a>
                                </li>
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
        stocks: state.stocks
    }
}

export default connect(mapStateToProps)(StockRealTimePrices);
