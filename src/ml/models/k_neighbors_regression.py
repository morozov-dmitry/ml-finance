from models.regressor import Regressor
from sklearn.neighbors import KNeighborsRegressor

class KNNRegressor(Regressor):
    """ Complex route planner that is meant for a perpendicular grid network. """

    def get_regressor(self):
        return KNeighborsRegressor(n_neighbors=2)

    def get_regressor_name(self):
        return 'KNeighborsRegressor'

