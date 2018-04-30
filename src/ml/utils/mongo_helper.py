import pprint
from datetime import datetime
import pymongo
from pymongo import MongoClient
from pymongo import InsertOne
from pymongo.errors import BulkWriteError

class MongoHelper(object):
    """ Helper provide high-level interface for getting and saving stock prices and prediction data to database. """

    def __init__(self):
        self.client = MongoClient('mongodb://mongo:27017/')
        self.db = self.client['udacity-finance']
        self.history_collection = self.db['stock_log']
        self.forecast_collection = self.db['stock_forecast']

    def get_historical_data(self, start_date):
        """ Returns historical stock data for all stock symbols from the particular data"""

        historical_data = {}
        for stock_data in self.history_collection.find({"date": {"$gt": start_date}}, {"date": 1, "adjClose": 1, "symbol": 1, "_id": 0}).sort('date', pymongo.ASCENDING):
            if stock_data['symbol'] not in historical_data:
                historical_data[stock_data['symbol']] = {'X': [], 'Y': []}
            historical_data[stock_data['symbol']]['X'].append([stock_data['date'].toordinal()])
            historical_data[stock_data['symbol']]['Y'].append(stock_data['adjClose'])
        return historical_data

    def save_forecast_data(self, predicted_data, prediction_dates, numdays):
        """ Saves forecasted data to database"""

        requests = []
        for symbol in predicted_data:
            symbol_data_prediction = predicted_data[symbol]
            for model in symbol_data_prediction:
                symbol_predicted_data = symbol_data_prediction[model]
                model_score = symbol_predicted_data['score']
                for day_number in range(0, numdays):
                    forecast = symbol_predicted_data['forecast'][day_number]
                    forecast_date = datetime.fromordinal(prediction_dates[day_number][0])
                    record = {'date': forecast_date, 'symbol': symbol, 'forecast': forecast, 'model': model, 'score': model_score}
                    requests.append(InsertOne(record))

        try:
            self.forecast_collection.bulk_write(requests)
        except BulkWriteError as bwe:
            pprint(bwe.details)

