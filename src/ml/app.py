#!flask/bin/python
import click
from flask import Flask, Response, json
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
from utils.prediction_helper import PredictionHelper


app = Flask(__name__)

cc
# @app.cli.command()
def hello():
    """Initialize the database."""
    click.echo('Hello CLI')

c
@app.cli.command()
def predict():

    # Define time frame for historical data to train the model
    today = datetime.today()
    start_date = today - timedelta(days = 60)

    prediction_helper = PredictionHelper()
    prediction_helper.make_prediction(start_date)

    # print results
    click.echo('Machine learning algorithms has been run. Predicted data saved to database')

    #return prepare_response()c


c
@app.cli.command()
def predict_historical():

    # Define time frame for historical data to train the model
    today = datetime.today()
    start_date = today - relativedelta(years=3)

    prediction_helper = PredictionHelper()
    prediction_helper.make_prediciton_for_historical_data(start_date)

    # print results
    click.echo('Machine learning algorithms has been run. Predicted data saved to database')

    # Response
    # return prepare_response()


def prepare_response():
    data = {'status': 0, 'data': "Machine learning algorithms has been run. Predicted data saved to database"}
    response = Response(
        response=json.dumps(data),
        status=200,
        mimetype='application/json'
    )
    return response




