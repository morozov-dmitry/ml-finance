#!flask/bin/python
import click
from flask import Flask, Response, json
from flask_cors import CORS, cross_origin
from datetime import datetime, date, timedelta
import pandas as pd
import numpy as np
from yahoo_finance import Share
from sklearn.neighbors import KNeighborsRegressor
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn import cross_validation
import pymongo
from pymongo import MongoClient
from pymongo import InsertOne
from pymongo.errors import BulkWriteError
import logging

# Prepare data for training
client = MongoClient('mongodb://mongo:27017/')
db = client['udacity-finance']

app = Flask(__name__)

logging.basicConfig(filename='myapp.log', level=logging.INFO)

symbols = ['GOOG']

@app.cli.command()
def hello():
    """Initialize the database."""
    click.echo('Hello CLI')

@app.route('/')
def hello_page():
    return 'Home page route'


@app.route('/history/<symbol>', methods=['GET'])
def history(symbol):
    if symbol in symbols:

        # Set base collection to get data
        collection = db['stock_log']

        # Define time frame for historical data to be returned
        end_date = datetime.today()
        start_date = end_date - timedelta(days=31)

        # Get historical prices from database
        result = list(collection.find({"$and": [{"date": {"$gte": start_date}}, {"date": {"$lte": end_date}}]},
                                 {"date": 1, "adjClose": 1, "symbol": 1, "_id": 0}).sort([("date", pymongo.ASCENDING)]))

        # Sending response with message
        data = {'status': 0, 'data': result}
        response = Response(
            response=json.dumps(data),
            status=200,
            mimetype='application/json'
        )
    else:
        # Sending response with error message
        data = {'status': 1, 'data': 'Correct symbol must be provided'}
        response = Response(
            response=json.dumps(data),
            status=400,
            mimetype='application/json'
        )

    return response

@app.route('/forecast/<symbol>', methods=['GET'])
def forecast(symbol):
    if symbol in symbols:
        # Set base collection to get data
        collection = db['stock_forecast']
        # Define time frame for forecast data to be returned
        start_date = datetime.today()
        end_date = start_date + timedelta(days=7)
        # Get forecasted prices from database
        result = list(collection.find({"$and": [{"model":"RandomForestRegressor"}, {"date": {"$gte": start_date}}, {"date": {"$lte": end_date}}]},
                                 {"date": 1, "forecast": 1, "symbol": 1, "_id": 0}).sort([("date", pymongo.ASCENDING)]))
        # Sending response with message
        data = {'status': 0, 'data': result}
        response = Response(
            response=json.dumps(data),
            status=200,
            mimetype='application/json'
        )
    else:
        # Sending response with error message
        data = {'status': 1, 'data': 'Correct symbol must be provided'}
        response = Response(
            response=json.dumps(data),
            status=400,
            mimetype='application/json'
        )

    return response

@app.route('/load', methods=['GET'])
def load():
    # Define time frame for historical data to be returned
    end_date = datetime.today()
    start_date = end_date - timedelta(days=1)

    responses = []

    for symbol in symbols:

        responses.append(symbol)

        yahoo = Share('YHOO')

        # Get dat from Yahoo finance API
        # stock_data = yahoo.get_historical(start_date, end_date)

        # Preparing data for saving
        # requests = []
        # for i in stock_data:
        #     requests.append(InsertOne(stock_data[i]))

    # Saving data to database
    # try:
    #     save_collection.bulk_write(requests)
    # except BulkWriteError as bwe:
    #     pprint(bwe.details)


    # Sending response with message
    data = {'status': 0, 'data': "Stock prices were downloaded", 'res': data}
    response = Response(
        response=json.dumps(data),
        status=200,
        mimetype='application/json'
    )
    return response


@app.route('/predict', methods=['GET'])
def predict():
    logging.info('Started')

    collection = db['stock_log']
    save_collection = db['stock_forecast']

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
    for stock_data in collection.find({"date": {"$gt": start_date}}, {"date": 1, "adjClose": 1, "symbol": 1, "_id": 0}):
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
            }}

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

        logging.info(predicted_prices)
        predicted_data[symbol] = symbol_predicted_data;

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
        save_collection.bulk_write(requests)
    except BulkWriteError as bwe:
        pprint(bwe.details)

    # Sending response with message
    data = {'status': 0, 'data': "Machine learning algorithms has been run. Predicted data saved to database"}
    response = Response(
        response=json.dumps(data),
        status=200,
        mimetype='application/json'
    )
    return response

def get_historical_data(name, number_of_days):
	data = []
	url = "https://finance.yahoo.com/quote/" + name + "/history/"
	rows = bs(urllib2.urlopen(url).read()).findAll('table')[0].tbody.findAll('tr')

	for each_row in rows:
		divs = each_row.findAll('td')
		if divs[1].span.text  != 'Dividend': #Ignore this row in the table
			#I'm only interested in 'Open' price; For other values, play with divs[1 - 5]
			data.append({'Date': divs[0].span.text, 'Open': float(divs[1].span.text.replace(',',''))})

	return data[:number_of_days]



if __name__ == '__main__':
    app.run(port=5000, host='0.0.0.0')
    # app.run(debug=True)
