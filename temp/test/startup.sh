#!/bin/bash
service docker start;
docker pull hello-world;
docker run hello-world;