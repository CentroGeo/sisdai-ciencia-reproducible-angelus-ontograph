

cd ~/apps/builds/angelus_ontograph
git pull
docker build -t angelus-visualizador .
cd ~/apps/deployments/visualizador
docker-compose up -d --no-deps  visualizador
