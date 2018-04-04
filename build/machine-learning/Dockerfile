FROM python:3.5.3

#COPY . /application/src/ml
WORKDIR /application/src/ml

RUN pip install flask flask-cors pymongo numpy scipy pandas scikit_learn yahoo-finance
RUN ls -alrth
# RUN pip install -r /application/src/ml/pip.txt

# ENTRYPOINT /bin/bash
EXPOSE 5000

ENTRYPOINT python /application/src/ml/app.py
