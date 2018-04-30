from keras.layers import Dense, LSTM
from keras.models import Sequential
import numpy as np

import logging

class NeuralNetwork(object):
    """ Complex route planner that is meant for a perpendicular grid network. """

    def __init__(self, results):
        self.clf = None
        self.regressor_name = self.get_regressor_name()
        self.results = results
        self.results.register_regressor(self.regressor_name)

    def predict(self, prediction_dates):
        logging.basicConfig(filename='myapp.log', level=logging.INFO)

        logging.info('Started NN')

        self.train()
        prediction_dates = np.array(prediction_dates)

        nn_output = self.clf.predict(prediction_dates)

        result = {
            'score': 1,
            'forecast': nn_output.reshape(1)
        }

        logging.info(result)

        self.results.register_results(self.regressor_name, result)
        self.clf = None

        logging.info(self.results.register_results)

    def train(self):

        # logging.basicConfig(filename='myapp.log', level=logging.INFO)
        #
        # logging.info('Started NN train')

        model = Sequential()
        model.add(Dense(250, input_dim=1, init='normal', activation='relu'))
        model.add(Dense(1, init='normal', activation='linear'))

        # logging.info(self.results.X_test)
        # logging.info(self.results.y_test)

        X_train = np.array(self.results.X_test)
        y_train = np.array(self.results.y_test)

        # logging.info(X_train)
        # logging.info(X_train.shape)
        # logging.info(y_train)
        # logging.info(y_train.shape)

        X_train = X_train.reshape(-1, 1)
        y_train = y_train.reshape(-1, 1)

        # logging.info('after_reshape')
        # logging.info(X_train)
        # logging.info(X_train.shape)

        # logging.info(y_train)
        # logging.info(y_train.shape)

        # Compile model
        model.compile(loss='mean_absolute_error', optimizer='rmsprop')
        model.fit(X_train, y_train, nb_epoch=200, batch_size=25, verbose=0)

        self.clf = model

    def get_regressor_name(self):
        return 'NeuralNetwork'

