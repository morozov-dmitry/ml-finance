from utils.datetime_helper import DateTimeHelper
from utils.mongo_helper import MongoHelper
from utils.prediction_results import PredictionResults
from utils.symbol_results import SymbolResults

from models.linear_regression import LinearRegressor
from models.random_forest_regression import RandomForestRegression
from models.sv_regression import SVRegressor
from models.k_neighbors_regression import KNNRegressor
# from models.neural_network import NeuralNetwork

import logging

class PredictionHelper(object):
    """ Complex route planner that is meant for a perpendicular grid network. """

    def __init__(self):
        self.mongo_helper = MongoHelper()
        self.date_helper = DateTimeHelper()
        self.result_helper = PredictionResults()

    def make_prediction(self, start_date, numdays = 7):

        # logging.basicConfig(filename='myapp.log', level=logging.INFO)
        #
        # logging.info('Started')

        # Timeseries for predict
        prediction_dates = self.date_helper.get_prediciton_dates_series()

        # Load historical data from database
        historical_data = self.mongo_helper.get_historical_data(start_date)

        # Train models
        for symbol in historical_data:

            # logging.info(historical_data[symbol])

            # symbol_stock_data
            self.run_prediction_models_fro_symbol_data(symbol, historical_data[symbol], prediction_dates)

        # Saves forecasted data to database
        self.mongo_helper.save_forecast_data(self.result_helper.prediction_results, prediction_dates, numdays)


    def make_prediciton_for_historical_data(self, start_date, numdays = 1):

        logging.basicConfig(filename='myapp.log', level=logging.INFO)

        logging.info('Started')
        #
        # logging.info(start_date)

        # Load historical data from database
        historical_data = self.mongo_helper.get_historical_data(start_date)

        prediction_window = 30

        # Train models
        for symbol in historical_data:

            logging.info(symbol)

            ds_length = len(historical_data[symbol]['X'])

            # logging.info(ds_length)
            # logging.info('historical_data')
            # logging.info(historical_data[symbol]['X'])

            for i in range(1, ds_length - prediction_window - 1):

                # logging.info('get_shifted_date')
                # logging.info(start_date)
                # logging.info(i)

                slice_start_date = self.date_helper.get_shifted_date(start_date, (prediction_window + i))

                # logging.info('slice_start_date')
                # logging.info(slice_start_date)

                prediction_dates = []
                prediction_dates.append(historical_data[symbol]['X'][(prediction_window + i)])

                historical_data_slice = {
                    'X': historical_data[symbol]['X'][i:(prediction_window + i)],
                    'Y': historical_data[symbol]['Y'][i:(prediction_window + i)]
                }

                # logging.info('historical_data_slice')
                # logging.info(i)
                # logging.info((prediction_window + i))
                # logging.info(historical_data_slice['X'])
                # logging.info('prediction_dates')
                # logging.info(prediction_dates)

                self.run_prediction_models_fro_symbol_data(symbol, historical_data_slice, prediction_dates)

                logging.info(self.result_helper.prediction_results)

                # Saves forecasted data to database
                self.mongo_helper.save_forecast_data(self.result_helper.prediction_results, prediction_dates, numdays = 1)

                self.result_helper.prediction_results = {}


    def run_prediction_models_fro_symbol_data(self, symbol, historical_data, prediction_dates):

        # symbol_stock_data
        symbol_prediction_results = SymbolResults(symbol, historical_data)

        linear_regressor = LinearRegressor(symbol_prediction_results)
        linear_regressor.predict(prediction_dates)

        random_forest_regressor = RandomForestRegression(symbol_prediction_results)
        random_forest_regressor.predict(prediction_dates)

        sv_regressor = SVRegressor(symbol_prediction_results)
        sv_regressor.predict(prediction_dates)

        knn_regressor = KNNRegressor(symbol_prediction_results)
        knn_regressor.predict(prediction_dates)

        # nn_regressor = NeuralNetwork(symbol_prediction_results)
        # nn_regressor.predict(prediction_dates)

        # logging.info(symbol_prediction_results.prediction_results)

        self.result_helper.save_symbol_prediction_data(symbol_prediction_results)
