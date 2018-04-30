from datetime import datetime, date, timedelta

class DateTimeHelper(object):
    """ Complex route planner that is meant for a perpendicular grid network. """

    def get_prediciton_dates_series(self, start_date = None, numdays = 7):
        if start_date is None:
            start_date = datetime.today()
        prediction_dates = []
        for future_day_number in range(0, numdays):
            future_date = start_date + timedelta(days=future_day_number)
            prediction_dates.append([future_date.toordinal()])
        return prediction_dates

    def get_shifted_date(self, start_date, shift = 1):
        return start_date + timedelta(days = shift)
