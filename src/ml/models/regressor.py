class Regressor(object):
    """ Base class for all regression algorithms. """

    def __init__(self, results):
        self.clf = self.get_regressor()
        self.regressor_name = self.get_regressor_name()
        self.results = results
        self.results.register_regressor(self.regressor_name)

    def predict(self, prediction_dates):
        """ Performs all operations for data prediction. """

        # Train regression algorithm
        self.train()
        result = {
            'score': self.clf.score(self.results.X_test, self.results.y_test),
            'forecast': self.clf.predict(prediction_dates)
        }
        # Saves predicted result
        self.results.register_results(self.regressor_name, result)

    def train(self):
        """ Performs model training. """

        self.clf.fit(self.results.X_train, self.results.y_train)


