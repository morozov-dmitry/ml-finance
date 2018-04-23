import React, { Component } from 'react';
import { connect } from 'react-redux';

class StockRealTimePrices extends Component {

    render() {
        const symbols = this.props.symbols.list
        return (
            <section className="top-header">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <ul className="currency-status">
                                {symbols.map((symbol) => (
                                    <li>
                                        <a href="">
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
