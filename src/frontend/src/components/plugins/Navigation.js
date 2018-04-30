import React, { Component } from 'react';
import { Link } from 'react-router-dom'

export default class Navigation extends Component {

    render() {
        return (
            <section className="header  navigation">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <nav className="navbar navbar-expand-md">
                                <a className="navbar-brand" href="index.html">
                                    <img src="images/logo.png" alt="" width="60px" />
                                </a>
                                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                    <span className="tf-ion-android-menu"></span>
                                </button>
                                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                    <ul className="navbar-nav ml-auto">
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/">Week prediction</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/performance">Performance history</Link>
                                        </li>
                                    </ul>
                                </div>
                            </nav>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
