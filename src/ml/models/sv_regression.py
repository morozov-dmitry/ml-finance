from models.regressor import Regressor
from sklearn.svm import SVR

class SVRegressor(Regressor):
    """ Provides data and regressor model for SV Regression algorithm. """

    def get_regressor(self):
        """ Returns regression model. """

        return SVR()

    def get_regressor_name(self):
        """ Returns regression model name. """

        return 'SVRegression'

