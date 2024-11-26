FROM python:3.8-slim AS base

# Setup env
ENV LANG=C.UTF-8
ENV LC_ALL=C.UTF-8
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONFAULTHANDLER=1

RUN apt-get update && apt-get install -y libmagic1 && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*

FROM base AS python-deps

# Install pipenv and compilation dependencies
RUN pip install pipenv
RUN apt-get update && apt-get install -y --no-install-recommends gcc

# Install python dependencies in /.venv
COPY Pipfile .
COPY Pipfile.lock .
# Install dev, need to remove dev packages in prod
RUN PIPENV_VENV_IN_PROJECT=1 pipenv install --deploy --dev

FROM base AS production

ARG USER_ID=1000
ARG GROUP_ID=1000

# Copy virtual env from python-deps stage
COPY --from=python-deps /.venv /.venv
ENV PATH="/.venv/bin:$PATH"

# Create and switch to a new user
RUN groupadd -g $GROUP_ID app
RUN useradd -m -r -u $USER_ID -g app app
WORKDIR /home/app
USER app

# Install application into container
COPY . .

EXPOSE 8000

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0"]

FROM production AS development

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--reload"]
