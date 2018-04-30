from models.regressor import Regressor
from sklearn.ensemble import RandomForestRegressor

class RandomForestRegression(Regressor):
    """ Provides data and regressor model for Random Forest Regression algorithm. """

    def get_regressor(self):
        """ Returns regression model. """

        return RandomForestRegressor(random_state=0)

    def get_regressor_name(self):
        """ Returns regression model name. """

        return 'RandomForestRegressor'
