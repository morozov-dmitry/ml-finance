#!flask/bin/python
from flask import Flask, Response, json
from datetime import datetime, date, timedelta
import pandas as pd
import numpy as np
from sklearn.neighbors import KNeighborsRegressor
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn import cross_validation

from pymongo import MongoClient
import pickle
import logging

# creating and saving some model
# reg_model = linear_model.LinearRegression()
# reg_model.fit([[1.,1.,5.], [2.,2.,5.], [3.,3.,1.]], [0.,0.,1.])
# pickle.dump(reg_model, open('some_model.pkl', 'wb'))

# Prepare data for training
client = MongoClient('mongodb://mongo:27017/')
db = client['udacity-finance']

app = Flask(__name__)


@app.route('/')
def hello_page():
    return 'Home page route'


@app.route('/predict', methods=['GET'])
def predict():

    logging.basicConfig(filename='myapp.log', level=logging.INFO)
    logging.info('Started')

    collection = db['stock_log']

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
            historical_data[stock_data['symbol']] = {'X':[], 'Y':[]}
        historical_data[stock_data['symbol']]['X'].append([stock_data['date'].toordinal()])
        historical_data[stock_data['symbol']]['Y'].append(np.log(stock_data['adjClose']))

    # Train models
    predicted_data = {}
    for symbol in historical_data:

        symbol_predicted_data = {'KNeighborsRegressor': {}, 'RandomForestRegressor': {}, 'LinearRegression': {}}
        symbol_stock_data = historical_data[symbol]

        logging.info("symbol_stock_data['X']")
        logging.info(symbol_stock_data['X'])
        logging.info("prediction_dates")
        logging.info(prediction_dates)

        X_train, X_test, y_train, y_test = cross_validation.train_test_split(symbol_stock_data['X'], symbol_stock_data['Y'], test_size=0.2, train_size=0.8, random_state=3)

        # KNeighborsRegressor model
        reg_model = KNeighborsRegressor(n_neighbors=2)
        reg_model.fit(X_train, y_train)
        predicted_prices = reg_model.predict(prediction_dates)
        for i in symbol_predicted_data:
            symbol_predicted_data['KNeighborsRegressor'] = predicted_prices

        # RandomForestRegressor model
        reg_model = RandomForestRegressor(random_state=0)
        reg_model.fit(symbol_stock_data['X'], symbol_stock_data['Y'])
        predicted_prices = reg_model.predict(prediction_dates)
        for i in symbol_predicted_data:
            symbol_predicted_data['RandomForestRegressor'] = predicted_prices

        # LinearRegression model
        reg_model = LinearRegression()
        reg_model.fit(symbol_stock_data['X'], symbol_stock_data['Y'])
        predicted_prices = reg_model.predict(prediction_dates)
        for i in symbol_predicted_data:
            symbol_predicted_data['LinearRegression'] = predicted_prices

        logging.info(predicted_prices)
        predicted_data[symbol] = symbol_predicted_data;
        # logging.info(predicted_prices)

    logging.info(predicted_data)
    logging.info('Finished')

    # Sending response with message
    data = {'status': 0, 'data': "Machine learning algorithms has been run. Predicted data saved to database."}
    response = Response(
        response=json.dumps(data),
        status=200,
        mimetype='application/json'
    )
    return response


# @app.route('/prediction/api/v1.0/some_prediction', methods=['GET'])
# def get_prediction():
#     feature1 = float(request.args.get('f1'))
#     feature2 = float(request.args.get('f2'))
#     feature3 = float(request.args.get('f3'))
#     loaded_model = pickle.load(open('some_model.pkl', 'rb'))
#     prediction = loaded_model.predict([[feature1, feature2, feature3]])
#     return str(prediction)

if __name__ == '__main__':
    app.run(port=5000, host='0.0.0.0')
    # app.run(debug=True)
