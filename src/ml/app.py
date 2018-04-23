#!flask/bin/python
import click
from flask import Flask, Response, json
from flask_cors import CORS, cross_origin
from datetime import datetime, date, timedelta
from dateutil.relativedelta import relativedelta
import pandas as pd
import numpy as np
from sklearn.neighbors import KNeighborsRegressor
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.svm import SVR
from sklearn.neural_network import MLPRegressor
from sklearn import cross_validation
from pymongo import MongoClient
from pymongo import InsertOne
from pymongo.errors import BulkWriteError
import logging

# Prepare data for training
client = MongoClient('mongodb://mongo:27017/')
db = client['udacity-finance']
history_data_collection = db['stock_log']
forecasted_data_collection = db['stock_forecast']

app = Flask(__name__)

logging.basicConfig(filename='myapp.log', level=logging.INFO)

symbols = ['GOOG']

@app.route('/')
# @app.cli.command()
def hello():
    """Initialize the database."""
    click.echo('Hello CLI')

@app.route('/predict')
# @app.cli.command()
def predict():

    # Define time frame for historical data to train the model
    today = datetime.today()
    start_date = today - timedelta(days=60)

    prediction_dates = []

    # Timeseries for predict
    numdays = 7
    for future_day_number in range(0, numdays):
        future_date = today + timedelta(days=future_day_number)
        prediction_dates.append([future_date.toordinal()])

    # Load historical data from database
    historical_data = {}
    for stock_data in history_data_collection.find({"date": {"$gt": start_date}}, {"date": 1, "adjClose": 1, "symbol": 1, "_id": 0}):
        if stock_data['symbol'] not in historical_data:
            historical_data[stock_data['symbol']] = {'X': [], 'Y': []}
        historical_data[stock_data['symbol']]['X'].append([stock_data['date'].toordinal()])
        historical_data[stock_data['symbol']]['Y'].append(stock_data['adjClose'])

    # Train models
    predicted_data = {}
    for symbol in historical_data:

        symbol_predicted_data = {
            'KNeighborsRegressor': {
                'score': 0,
                'forecast': []
            },
            'RandomForestRegressor': {
                'score': 0,
                'forecast': []
            },
            'LinearRegression': {
                'score': 0,
                'forecast': []
            },
            'SVRegression': {
                'score': 0,
                'forecast': []
            },
            'MLPRegressor': {
                'score': 0,
                'forecast': []
            }
        }

        symbol_stock_data = historical_data[symbol]

        X_train, X_test, y_train, y_test = cross_validation.train_test_split(symbol_stock_data['X'],
                                                                             symbol_stock_data['Y'], test_size=0.2,
                                                                             train_size=0.8, random_state=3)


        # KNeighborsRegressor model
        reg_model = KNeighborsRegressor(n_neighbors=2)
        reg_model.fit(X_train, y_train)
        predicted_prices = reg_model.predict(prediction_dates)
        symbol_predicted_data['KNeighborsRegressor']['score'] = reg_model.score(X_test, y_test)
        for i in symbol_predicted_data:
            symbol_predicted_data['KNeighborsRegressor']['forecast'] = predicted_prices

        # RandomForestRegressor model
        reg_model = RandomForestRegressor(random_state=0)
        reg_model.fit(X_train, y_train)
        predicted_prices = reg_model.predict(prediction_dates)
        symbol_predicted_data['RandomForestRegressor']['score'] = reg_model.score(X_test, y_test)
        for i in symbol_predicted_data:
            symbol_predicted_data['RandomForestRegressor']['forecast'] = predicted_prices

        # LinearRegression model
        reg_model = LinearRegression()
        reg_model.fit(X_train, y_train)
        predicted_prices = reg_model.predict(prediction_dates)
        symbol_predicted_data['LinearRegression']['score'] = reg_model.score(X_test, y_test)
        for i in symbol_predicted_data:
            symbol_predicted_data['LinearRegression']['forecast'] = predicted_prices

        # SVR model
        reg_model = SVR()
        reg_model.fit(X_train, y_train)
        predicted_prices = reg_model.predict(prediction_dates)
        symbol_predicted_data['SVRegression']['score'] = reg_model.score(X_test, y_test)
        for i in symbol_predicted_data:
            symbol_predicted_data['SVRegression']['forecast'] = predicted_prices

        logging.info(predicted_prices)
        predicted_data[symbol] = symbol_predicted_data

        # Multi-layer Perceptron regressor model
        # reg_model = MLPRegressor()
        # reg_model.fit(X_train, y_train)
        # predicted_prices = reg_model.predict(prediction_dates)
        # symbol_predicted_data['MLPRegressor']['score'] = reg_model.score(X_test, y_test)
        # for i in symbol_predicted_data:
        #     symbol_predicted_data['MLPRegressor']['forecast'] = predicted_prices

        logging.info(predicted_prices)
        predicted_data[symbol] = symbol_predicted_data

    # Saves forecasted data to database
    requests = []
    for symbol in predicted_data:
        symbol_data_prediction = predicted_data[symbol]
        for model in symbol_data_prediction:
            symbol_predicted_data = symbol_data_prediction[model]
            model_score = symbol_predicted_data['score']
            for day_number in range(0, numdays):
                forecast = symbol_predicted_data['forecast'][day_number]
                forecast_date = datetime.fromordinal(prediction_dates[day_number][0])
                record = {'date': forecast_date, 'symbol': symbol, 'forecast': forecast, 'model': model,
                          'score': model_score}
                requests.append(InsertOne(record))

    try:
        forecasted_data_collection.bulk_write(requests)
    except BulkWriteError as bwe:
        pprint(bwe.details)

    # print results
    # click.echo('Machine learning algorithms has been run. Predicted data saved to database')

    # Response
    data = {'status': 0, 'data': "Machine learning algorithms has been run. Predicted data saved to database"}
    response = Response(
        response=json.dumps(data),
        status=200,
        mimetype='application/json'
    )
    return response

@app.route('/predict-historical')
# @app.cli.command()
def predict():

    # Define time frame for historical data to train the model
    today = datetime.today()
    start_date = today - relativedelta(years=3)

    # Response
    data = {'status': 0, 'data': "Machine learning algorithms has been run. Predicted data saved to database"}
    response = Response(
        response=json.dumps(data),
        status=200,
        mimetype='application/json'
    )
    return response


def save_forecasted_data(self, predicted_data, prediction_dates, numdays):
    requests = []
    for symbol in predicted_data:
        symbol_data_prediction = predicted_data[symbol]
        for model in symbol_data_prediction:
            symbol_predicted_data = symbol_data_prediction[model]
            model_score = symbol_predicted_data['score']
            for day_number in range(0, numdays):
                forecast = symbol_predicted_data['forecast'][day_number]
                forecast_date = datetime.fromordinal(prediction_dates[day_number][0])
                record = {'date': forecast_date, 'symbol': symbol, 'forecast': forecast, 'model': model,
                          'score': model_score}
                requests.append(InsertOne(record))

    try:
        forecasted_data_collection.bulk_write(requests)
    except BulkWriteError as bwe:
        pprint(bwe.details)

