from sklearn import cross_validation

class SymbolResults(object):
    """ Complex route planner that is meant for a perpendicular grid network. """

    def __init__(self, symbol, stock_data):
        self.symbol = symbol
        self.stock_data = stock_data
        self.prediction_results = {}
        self.cross_validation(stock_data)

    def cross_validation(self, stock_data):
        self.X_train, self.X_test, self.y_train, self.y_test = cross_validation.train_test_split(stock_data['X'], stock_data['Y'], test_size=0.2, train_size=0.8, random_state=3)

    def register_regressor(self, regressor):
        self.prediction_results[regressor] = {
            'score': 0,
            'forecast': []
        }

    def register_results(self, regressor, results):
        self.prediction_results[regressor] = results
