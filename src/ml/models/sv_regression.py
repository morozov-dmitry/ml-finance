from models.regressor import Regressor
from sklearn.svm import SVR

class SVRegressor(Regressor):
    """ Complex route planner that is meant for a perpendicular grid network. """

    def get_regressor(self):
        return SVR()

    def get_regressor_name(self):
        return 'SVRegression'

