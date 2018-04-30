from models.regressor import Regressor
from sklearn.ensemble import RandomForestRegressor

class RandomForestRegression(Regressor):
    """ Complex route planner that is meant for a perpendicular grid network. """

    def get_regressor(self):
        return RandomForestRegressor(random_state=0)

    def get_regressor_name(self):
        return 'RandomForestRegressor'
