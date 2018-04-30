from sklearn import cross_validation

class PredictionResults(object):
    """ Helper stores all prediction data for next save in the database. """

    def __init__(self):
        self.prediction_results = {}

    def save_symbol_prediction_data(self, symbol_result_helper):
        """ Save predicted symbol data to whole set of predicted data """

        self.prediction_results[symbol_result_helper.symbol] = symbol_result_helper.prediction_results
