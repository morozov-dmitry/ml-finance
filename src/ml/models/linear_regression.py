from models.regressor import Regressor
from sklearn.linear_model import LinearRegression

class LinearRegressor(Regressor):
    """ Provides data and regressor model for Linear Regressor algorithm. """

    def get_regressor(self):
        """ Returns regression model. """

        return LinearRegression()

    def get_regressor_name(self):
        """ Returns regression model name. """

        return 'LinearRegression'

