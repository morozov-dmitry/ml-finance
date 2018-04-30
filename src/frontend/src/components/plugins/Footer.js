import React, { Component } from 'react';

export default class Footer extends Component {

    render() {
        return (
            <footer id="footer" className="bg-one">
                <div className="top-footer">
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-3 col-md-3 col-lg-3">
                                <h3>INFORMATION</h3>
                                <ul>
                                    <li><a href="https://www.udacity.com/course/machine-learning-engineer-nanodegree--nd009t">Machine Learning Engineer</a></li>
                                    <li><a href="https://www.udacity.com/course/deep-learning-nanodegree--nd101">Deep Learning</a></li>
                                    <li><a href="https://www.udacity.com/course/ai-artificial-intelligence-nanodegree--nd898">Artificial Intelligence</a></li>
                                    <li><a href="https://www.udacity.com/course/self-driving-car-engineer-nanodegree--nd013">Self-Driving Car Engineer</a></li>
                                </ul>
                            </div>
                            <div className="col-sm-3 col-md-3 col-lg-3">
                                <h3>Quick Links</h3>
                                <ul>
                                    <li><a href="https://www.udacity.com/us">About</a></li>
                                    <li><a href="https://blog.udacity.com/">Blog</a></li>
                                    <li><a href="https://www.udacity.com/jobs#business-development?location=all">Jobs</a></li>
                                    <li><a href="https://www.udacity.com/intersect">Udacity Intersect</a></li>
                                </ul>
                            </div>
                            <div className="col-sm-3 col-md-3 col-lg-3">
                                <h3>Nano</h3>
                                <ul>
                                    <li><a href="https://www.udacity.com/contact">Contact Us</a></li>
                                    <li><a href="https://udacity.zendesk.com/hc/en-us">Help and FAQ</a></li>
                                    <li><a href="https://www.udacity.com/sitemap/guides">Course Guides</a></li>
                                </ul>
                            </div>
                            <div className="col-sm-3 col-md-3 col-lg-3">
                                <h3>Follow Us</h3>
                                <ul>
                                    <li>
                                        <a href="https://www.facebook.com/Udacity">
                                            Facebook
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://twitter.com/udacity">
                                            Twitter
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://www.linkedin.com/school/udacity/">
                                            Linkedin
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://plus.google.com/+Udacity">
                                            Google PLus
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <h5>Copyright 2017. All rights reserved.</h5>
                    <h6>Design and Developed by <a href="">Themefisher</a></h6>
                </div>
            </footer>
        );
    }
}
