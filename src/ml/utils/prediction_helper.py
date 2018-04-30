from utils.datetime_helper import DateTimeHelper
from utils.mongo_helper import MongoHelper
from utils.prediction_results import PredictionResults
from utils.symbol_results import SymbolResults

from models.linear_regression import LinearRegressor
from models.random_forest_regression import RandomForestRegression
from models.sv_regression import SVRegressor
from models.k_neighbors_regression import KNNRegressor

class PredictionHelper(object):
    """ Helper for running predictions on data with with differnt regression models. """

    def __init__(self):
        self.mongo_helper = MongoHelper()
        self.date_helper = DateTimeHelper()
        self.result_helper = PredictionResults()

    def make_prediction(self, start_date, numdays = 7):
        """ Predicts stock prices for upcoming week. """

        # Timeseries for predict
        prediction_dates = self.date_helper.get_prediciton_dates_series()

        # Load historical data from database
        historical_data = self.mongo_helper.get_historical_data(start_date)

        # Train models
        for symbol in historical_data:

            # symbol_stock_data
            self.run_prediction_models_from_symbol_data(symbol, historical_data[symbol], prediction_dates)

        # Saves forecasted data to database
        self.mongo_helper.save_forecast_data(self.result_helper.prediction_results, prediction_dates, numdays)


    def make_prediciton_for_historical_data(self, start_date, numdays = 1):
        """ Makes prediction of historical data based on historical look back window """

        # Load historical data from database
        historical_data = self.mongo_helper.get_historical_data(start_date)

        prediction_window = 30

        # Train models
        for symbol in historical_data:

            ds_length = len(historical_data[symbol]['X'])

            for i in range(1, ds_length - prediction_window - 1):

                slice_start_date = self.date_helper.get_shifted_date(start_date, (prediction_window + i))

                prediction_dates = []
                prediction_dates.append(historical_data[symbol]['X'][(prediction_window + i)])

                historical_data_slice = {
                    'X': historical_data[symbol]['X'][i:(prediction_window + i)],
                    'Y': historical_data[symbol]['Y'][i:(prediction_window + i)]
                }

                self.run_prediction_models_from_symbol_data(symbol, historical_data_slice, prediction_dates)

                # Saves forecasted data to database
                self.mongo_helper.save_forecast_data(self.result_helper.prediction_results, prediction_dates, numdays = 1)

                self.result_helper.prediction_results = {}


    def run_prediction_models_from_symbol_data(self, symbol, historical_data, prediction_dates):
        """ Runs regressions on historical data to make stocks data prediction """

        # symbol_stock_data
        symbol_prediction_results = SymbolResults(symbol, historical_data)

        # Linear Regression
        linear_regressor = LinearRegressor(symbol_prediction_results)
        linear_regressor.predict(prediction_dates)

        # Random Forest Regression
        random_forest_regressor = RandomForestRegression(symbol_prediction_results)
        random_forest_regressor.predict(prediction_dates)

        # SV Regression
        sv_regressor = SVRegressor(symbol_prediction_results)
        sv_regressor.predict(prediction_dates)

        # KNN Regression
        knn_regressor = KNNRegressor(symbol_prediction_results)
        knn_regressor.predict(prediction_dates)

        # Save data to database
        self.result_helper.save_symbol_prediction_data(symbol_prediction_results)
