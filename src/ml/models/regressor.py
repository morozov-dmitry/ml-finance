class Regressor(object):
    """ Complex route planner that is meant for a perpendicular grid network. """

    def __init__(self, results):
        self.clf = self.get_regressor()
        self.regressor_name = self.get_regressor_name()
        self.results = results
        self.results.register_regressor(self.regressor_name)

    def predict(self, prediction_dates):
        self.train()
        result = {
            'score': self.clf.score(self.results.X_test, self.results.y_test),
            'forecast': self.clf.predict(prediction_dates)
        }
        self.results.register_results(self.regressor_name, result)

    def train(self):
        self.clf.fit(self.results.X_train, self.results.y_train)


