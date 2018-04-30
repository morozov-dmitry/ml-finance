from sklearn import cross_validation

class SymbolResults(object):
    """ Helper stores all prediction data for the particular stock symbol. """

    def __init__(self, symbol, stock_data):
        self.symbol = symbol
        self.stock_data = stock_data
        self.prediction_results = {}
        self.cross_validation(stock_data)

    def cross_validation(self, stock_data):
        """ Performs cross validation split of historical symbol data """

        self.X_train, self.X_test, self.y_train, self.y_test = cross_validation.train_test_split(stock_data['X'], stock_data['Y'], test_size=0.2, train_size=0.8, random_state=3)

    def register_regressor(self, regressor):
        """ Registers regression model in object to collect predicted data """

        self.prediction_results[regressor] = {
            'score': 0,
            'forecast': []
        }

    def register_results(self, regressor, results):
        """ Saves predicted data from the particular regression model """

        self.prediction_results[regressor] = results
