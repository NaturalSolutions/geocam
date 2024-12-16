FROM python:3.8-slim-buster
 
ENV MODE development
 
WORKDIR /app
 
RUN apt update\
  && apt-get install -y --no-install-recommends curl
 
RUN apt install -y wget
RUN python -m pip install --upgrade pip
 
RUN pip3 install pipenv
 
EXPOSE 5777

CMD python3 -m pipenv install --skip-lock; python3 -m pipenv run start