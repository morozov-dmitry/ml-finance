#!flask/bin/python
from flask import Flask, Response, json
from datetime import datetime, date, timedelta
import pandas as pd
import numpy as np
from sklearn import linear_model
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
    start_date = today - timedelta(days=31)

    # Load historical data from database
    historical_data = {}
    for stock_data in collection.find({"date": {"$gt": start_date}}, {"date": 1, "adjClose": 1, "symbol": 1, "_id": 0}):
        if stock_data['symbol'] not in historical_data:
            historical_data[stock_data['symbol']] = {'X':[], 'Y':[]}
        historical_data[stock_data['symbol']]['X'].append(stock_data['date'].strftime("%Y-%m-%d %H:%M:%S"))
        historical_data[stock_data['symbol']]['Y'].append(stock_data['adjClose'])

    financial_data = pd.read_csv("financial_data_small.csv")
    logging.info(financial_data)

    # Train models
    for symbol in historical_data:
        # symbol_stock_data = np.asarray(historical_data[symbol])
        symbol_stock_data = historical_data[symbol]
        logging.info(symbol_stock_data)
        reg_model = linear_model.LinearRegression()
        reg_model.fit(np.asarray(symbol_stock_data['X']), symbol_stock_data['Y'])

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
