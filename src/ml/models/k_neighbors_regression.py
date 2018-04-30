from models.regressor import Regressor
from sklearn.neighbors import KNeighborsRegressor

class KNNRegressor(Regressor):
    """ Provides data and regressor model for KNN algorithm. """

    def get_regressor(self):
        """ Returns regression model. """

        return KNeighborsRegressor(n_neighbors=2)

    def get_regressor_name(self):
        """ Returns regression model name. """

        return 'KNeighborsRegressor'

