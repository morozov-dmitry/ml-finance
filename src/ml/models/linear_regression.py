from models.regressor import Regressor
from sklearn.linear_model import LinearRegression

class LinearRegressor(Regressor):
    """ Complex route planner that is meant for a perpendicular grid network. """

    def get_regressor(self):
        return LinearRegression()

    def get_regressor_name(self):
        return 'LinearRegression'

