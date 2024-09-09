For English, see [below](#english-version)

# Ontograph, el Visualizador Angelus

Este app web permite visualizar grafos de conocimiento con aristas reificadas. Sirve de Front End del Sistema Angelus, por lo que requiere acceso a una instancia del [API de la Ontologia de Angelus](https://codigo.conahcyt.mx/angelus/angelus_api_ontologia) (o de [Grontopi](https://codigo.conahcyt.mx/angelus/angelus_grontopi), su versión solo-lectura). 

Las personas usuarias tiene las siguientes funcionalidades a su disposición.

1. Enlistar los distintos miembros de cada clase de la Ontologia (e.g. Personas, Eventos, Lugares). Esto se hace en el pánel izquierdo.
2. Arrastrar cada una de estas entidades al lienzo.
3. Enlistar las propiedades y las relaciones de cada entidad en el linezo. Esto se hace en el pánel derecho.
4. Visualizar, en el lienzo, otras entidades que estén relacionadas con las que están ya dibujadas.
5. Exportar el estado de lienzo en formato JSON para poder volverlo a cargar, o como imagen PNG.
6. Ver una lista, en forma de ficha, de todas las propiedas y relaciones de una enitdad, así como del origen documental de cada una.

Estas funcionalidades permiten explorar poco a poco un grafo de conocimiento que puede ser enorme, poniendo atención a las relaciones y atributos de cada nodo.  Esto contrasta con otras herramientas de visualización que intentan dibujar el grafo completo, pero donde se omiten o se vuelven difíciles de encontrar los detalles de cada nodo.

Para instrucciones de despliegue, vea la[ sección en inglés más abajo](#deployment).

## Este código fue desarrollado por 
* [Sebastian Casillas](https://github.com/sebastian-casillas) como parte del Proyecto Angelus, financiado por CONACYT bajo el convenio 321368.

### English Version

# Ontograph, the Angelus Visualization Tool

This web app allows users to visualize knowledge graphs whose edges are reified. It serves as a Front End of the Angelus System, and therefore requires access to an instance of the systems [Ontology API](https://codigo.conahcyt.mx/angelus/angelus_api_ontologia) (or of [Grontopi](https://codigo.conahcyt.mx/angelus/angelus_grontopi), the read-only version of it). 

Users of Ontograph can do the following:

1. List and filter the entities of the graph, sorted by ontology class (e.g. Peole, Events, etc.). This is done in the left panel.
2. Drag each of this entities into the canvas in the center.
3. List the properties and relationships of the selected entity from the canvas. This is done in the right panel.
4. Visualize, in the canvas, other entities that are related to those which are already being displayed.
5. Export the state of the canvas, either as a JSON for futuro loading, or as a PNG image.
6. See a list of all the properties and relations of an entity, along the provenance of each of them.

Together, these functionalities allow the gradual exploration of large knowledge graphs, paying attention to the properties and attributes of each node. This is in contrast with ogher graph visualization tools, which attempt to display the entire graph at once, making the details around each node hard to find.




## Deployment 

Launching Ontograph requires basic familiarty with Docker.

0. Create a `.env` file based on the example. Fill in the `VUE_APP_API_ACCESS` variable to point to your API. This can be a copy of [Grontopi](https://codigo.conahcyt.mx/angelus/angelus_grontopi)

1. Setup your reverse proxy (traefik 2.1)
  * It should have a network called "proxy_traefik" which includes traefik
  * Make sure you have certificates for the domain you will be using, which is set in the `VUE_APP_KEYCLOAK_REDIRECT_URL` env variable
  * Make sure you have the correct toml files in the revese proxy.

2. Setup your OIDC identity provider, such as Keycloak. 
   * Create a client and set its client id and redirect url in the .env file

3. Clone this repo from into `~/apps/builds`
   This should result in the Dockerfile being in `~/apps/builds/angelus_ontograph/Dockerfile`

4. Build the image `docker built -t angelus-visualizador .`

3. Make a simlink to the `docker-compose.yml` into deployments directory. In case the directory does not exist, create it first.
   `ln -s ~/apps/builds/angelus_ontograph/deployment/docker-compose.yml  ~/apps/deployments/visualizador/docker-compose.yml`

4. You can redeploy when changes using `redeploy_visualizador.sh` 
   Make adjustments if the paths don't match. This script will   i) git pull ii) docker-build iii) docker-compose up


## This code was developed by
* [Sebastian Casillas](https://github.com/sebastian-casillas) as part of Project Angelus. Funded by CONACYT
(Mexican Ministry of Science) under grant 321368.
