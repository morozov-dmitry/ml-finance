#!flask/bin/python
import click
from flask import Flask
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
from utils.prediction_helper import PredictionHelper


app = Flask(__name__)

@app.cli.command()
def hello():
    """Initialize the database."""
    click.echo('Hello CLI')

@app.cli.command()
def predict():

    # Define time frame for historical data to train the model
    today = datetime.today()
    start_date = today - timedelta(days = 30)

    prediction_helper = PredictionHelper()
    prediction_helper.make_prediction(start_date)

    # print results
    click.echo('Machine learning algorithms has been run. Predicted data saved to database')


@app.cli.command()
def predict_historical():

    # Define time frame for historical data to train the model
    today = datetime.today()
    start_date = today - relativedelta(years=3)

    prediction_helper = PredictionHelper()
    prediction_helper.make_prediciton_for_historical_data(start_date)

    # print results
    click.echo('Machine learning algorithms has been run. Predicted data saved to database')




