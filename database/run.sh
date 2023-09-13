#!/bin/bash
docker-compose -f cockroach.yml -p cockroachdb up -d
docker-compose -f minio.yml -p miniodb up -d
sleep 120
docker exec -it roach1 ./cockroach --host=roach1:26357 init --insecure
