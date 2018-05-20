# create network if needed
docker network create bb-techlab-experiment-thiefrun-network
docker network connect bb-techlab-experiment-thiefrun-network nginx-proxy

# start the docker container
docker-compose up
