#!/bin/bash

docker run -d -p 5432:5432 --name postgresDB -e POSTGRES_USER=mr_gaur -e POSTGRES_PASSWORD=passowrd postgres:latest && \
docker cp ../index.sql postgresDB:/docker-entrypoint-initdb.d/index.sql && \
docker exec -it postgresDB apt-get update && apt-get install -y postgis && \
docker exec -it postgresDB psql -U mr_gaur -a -f /docker-entrypoint-initdb.d/index.sql

# If the command doest not work try running them individually from 3rd command using the command docker exec -it postgresDB /bin/bash