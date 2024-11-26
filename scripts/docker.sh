#!/usr/bin/env bash

set -e

# Pre-pre-flight? 🤷
if [[ -n "$MSYSTEM" ]]; then
    echo "Seems like you are using an MSYS2-based system (such as Git Bash) which is not supported. Please use WSL instead.";
    exit 1
fi

PROJECT_NAME="ecosecrets"

DOCKER_VERSION=$(docker version --format '{{.Server.Version}}')
VERSION_PARTS=(${DOCKER_VERSION//./ })

if ((${VERSION_PARTS[0]} < 24 || (${VERSION_PARTS[0]} == 0 && ${VERSION_PARTS[1]} < 0))); then
    COMPOSE_COMMAND='docker-compose'
else
    COMPOSE_COMMAND='docker compose'
fi


if [ "$ENV" == "production" ]; then
    $COMPOSE_COMMAND --project-name=${PROJECT_NAME} -f ./docker/docker-compose.yml -f ./docker/docker-compose.prod.yml "$@"
else
    $COMPOSE_COMMAND --project-name=${PROJECT_NAME} --project-directory=./docker "$@"
fi
