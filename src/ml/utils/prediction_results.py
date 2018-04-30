from sklearn import cross_validation

class PredictionResults(object):
    """ Complex route planner that is meant for a perpendicular grid network. """

    def __init__(self):
        self.prediction_results = {}

    def save_symbol_prediction_data(self, symbol_result_helper):
        self.prediction_results[symbol_result_helper.symbol] = symbol_result_helper.prediction_results
