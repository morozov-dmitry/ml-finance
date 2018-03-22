FROM python:3.5.3

WORKDIR "/application/src/ml"

RUN pip install flask pymongo numpy scipy pandas scikit_learn

# ENTRYPOINT /bin/bash
EXPOSE 5000

ENTRYPOINT python /application/src/ml/app.py
