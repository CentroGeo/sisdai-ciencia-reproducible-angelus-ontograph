<template>
  
  <v-container class="pa-0" fluid id="ontograph">
      <v-row no-gutters style="flex-wrap: nowrap">
        <v-sheet style="height: 100vh; width: 100vw">
          <onto-workspace 
            class="onto-workspace"
            ref="workplace_component"
            :canvas_height="canvasHeight" 
            :canvas_width="canvasWidth"
            v-on:select-node="select_node"
            :title="canvasTitle"
            :description="canvasDescription"
            />
        </v-sheet>
      </v-row>

      <!-- <v-row no-gutters class="floating_ontograph_menu ontograph_menu" justify="center"> 
        <v-sheet class="pa-1" color="pink" >
          <v-btn>Hello world</v-btn>
        </v-sheet>
      </v-row> -->

      <v-row no-gutters class="floating_ontograph_menu ontograph_left_pane">
        <v-slide-x-transition>
          <onto-left-panel
              class="onto-panel-left"
              v-if="showLeftPanel"
              />
        </v-slide-x-transition>

        <v-col style="pointer-events: none; max-width:60px;">
          <v-row no-gutters justify="center" style="pointer-events: none;">

            <v-btn fab class="ma-2" small @click="showLeftPanel = !showLeftPanel"> 
              <v-icon v-if="showLeftPanel">mdi-chevron-left</v-icon>
              <v-icon v-else>mdi-chevron-right</v-icon>
            </v-btn>

            <v-menu offset-x open-on-hover>
              <template v-slot:activator="{ on }">
                <v-btn fab class="ma-2" x-small v-on="on"> 
                  <v-icon>mdi-menu</v-icon>
                </v-btn>
              </template>
              <v-list dense>
                <v-list-item @click="emptyCanvas">
                  <v-list-item-title>Borrar todo</v-list-item-title>
                </v-list-item>

                <v-list-item @click="downloadGraph">
                  <v-list-item-title>Exportar como PNG</v-list-item-title>
                </v-list-item>

                <v-list-item @click="downloadJSON">
                  <v-list-item-title>Guardar</v-list-item-title>
                </v-list-item>

                <v-list-item @click="loadJSON">
                  <v-list-item-title>Cargar</v-list-item-title>
                </v-list-item>

                <v-list-item @click="changeCanvasSize">
                  <v-list-item-title>Tamaño del lienzo</v-list-item-title>
                </v-list-item>

                <v-list-item @click="agregarTitulo">
                  <v-list-item-title>Agregar titulo</v-list-item-title>
                </v-list-item>

                <v-divider></v-divider>

                <v-list-item @click="logout">
                  <v-list-item-title>Logout</v-list-item-title>
                </v-list-item>

              </v-list>
            </v-menu>

            <v-menu
                v-model="addUriDirectlyMenu"
                :close-on-content-click="false"
                :nudge-width="200"
                offset-x
                >
                <template v-slot:activator="{ on, attrs }">
                    <v-btn fab x-small class="ma-2"
                        v-bind="attrs" v-on="on"
                        v-tooltip="'+ por ID'"
                        >
                        <v-icon>mdi-file-find-outline</v-icon>
                    </v-btn>   
                </template>

                <v-card class="mx-2">
                        <v-row no-gutters class="px-2" align="center">
                            <v-text-field v-model="direct_add_uri" style="min-width: 400px"></v-text-field>
                            <v-btn fab x-small elevation="2" class="ml-2" @click="addUriDirectly"><v-icon>mdi-plus</v-icon></v-btn>
                        </v-row>
                </v-card>
            </v-menu>

            <v-btn fab x-small class="ma-2" @click="canvas_toggle_panzoom" :color="panzoom_state? 'white' : 'orange'"> 
              <v-icon>mdi-lock-outline</v-icon>
            </v-btn>

            <v-btn fab x-small class="ma-2" @click="canvas_center"> 
              <v-icon>mdi-arrow-collapse-all</v-icon>
            </v-btn>



          </v-row>
        </v-col>

      </v-row>

      <v-row no-gutters class="floating_ontograph_menu ontograph_right_pane" align="center" justify="center">
        <v-slide-x-transition>
          <onto-right-panel
              class="onto-panel-right"
              v-if="selectedNode"
              :node="selectedNode"
              :nodeData="selectedNodeData"
              v-on:node-remove="deleteNodeRightPanel"
              v-on:add-node-from-source="addLinksIntoWorkspace"
              v-on:deselect-node="deselectNode"
              v-on:unpin-node="unpinNode"
              />
        </v-slide-x-transition>
      </v-row>

  </v-container>
</template>

<script>

import canvasSizeModal  from '~/components/onto/CanvasSizeModal'
import canvasTitleModal from '~/components/onto/CanvasTitleModal'

export default {
  
  props: {
    url :{
      type: String,
      default: null
    }
  },

  data: () => ({
    showLeftPanel: true,

    selectedNode: null,
    selectedNodeData: null,

    canvasWidth: 1280,
    canvasHeight: 720,

    direct_add_uri: '',
    addUriDirectlyMenu: false,

    canvasTitle: null,
    canvasDescription: null,

    panzoom_state: true,
  }),

  computed:{
    canvas(){
      return this.$refs.workplace_component
    },

    canvas_entities(){
      return Object.keys(this.canvas.data_nodes_referenced)
    }
  },

  methods: {
    emptyCanvas(){
      this.selectedNode = null
      this.selectedNodeData = null
      this.$refs.workplace_component.emptyCanvas()
    },

    addUriDirectly(){
      this.$AngelusApi.get('/entities/by_id?entity_id=' + this.direct_add_uri)
                      .then(r => {
                        this.canvas.addNode(r.uri, r.class_id, r.label)
                      })
                      .catch(e => {
                        console.log(e.response)
                        this.$toast.error("Entidad no encotrada")
                      })

    },

    addLinksIntoWorkspace({relations_array: relations_array, relation_target: relation_target, type: type}){
      for(let relation of Object.values(relations_array))
        this.canvas.addLinkNode({relation: relation, relation_target: relation_target, type: type})
    },

    select_node({node: node, nodeData: nodeData, type: type = "prop"}){
      this.selectedNodeData = nodeData;
      this.selectedNode = node;
    },

    deselectNode(node){
      this.canvas.deselectNode(node)
      this.selectedNode = null
      // console.log(node)
    },

    unpinNode(node){
      this.canvas.pin_toggle_node(node);
    },

    deleteNodeRightPanel(nodeData){
      this.selectedNode = null
      this.canvas.remove_node(nodeData)
    },

    changeCanvasSize(){
      this.$modal.show(
      canvasSizeModal,
      {
        canvas_height: this.canvasHeight, 
        canvas_width: this.canvasWidth, 
        saveCanvasSize: e => { 
            if ('width' in e && e.width) this.canvasWidth = parseFloat(e.width); 
            if ('height' in e && e.height) this.canvasHeight = parseFloat(e.height);
            this.canvas.reSimulate()  
          }
      },
      {height: 'auto', width: 300}
    )
    },

    agregarTitulo(){

      this.$modal.show(
      canvasTitleModal,
      {
        title: this.canvasTitle,
        description: this.canvasDescription,
        applyCanvasText: e => { 
            this.canvasTitle = ('title' in e && e.title)? e.title : null; 
            this.canvasDescription = ('description' in e && e.description)? e.description : null;
            // this.canvas.reSimulate()  
          }
      },
      {height: 'auto', width: 300}
    )
    },

    downloadGraph(){
      this.$refs.workplace_component.saveImg();
    },

    downloadJSON(){
      this.$refs.workplace_component.getJSON()
    },

    loadJSON(){
      let input = document.createElement('input');
      input.type = 'file';
      input.click();
      input.onchange = this.onJSONFileUpload
    },

    onJSONFileUpload(event){
      let reader = new FileReader();
      reader.onload = this.onJSONFileRead;
      reader.readAsText(event.target.files[0]);
    },

    async onJSONFileRead(event){
      //Object containing data_nodes, data_links, and canvas properties
      let obj = JSON.parse(event.target.result)

      //Checking that the json loaded has at least one node
      if(!(Object.keys(obj).includes('data_nodes'))){
        this.$toast.error("No se encontro el arreglo de nodos en el objecto referenciado")
        return;
      }
        
      //Check each node structure and reference it by key in new handy object
      let errors = [];
      let data_nodes_referenced = []

      for(let node of obj.data_nodes){
        let node_keys = Object.keys(node)

        if(!('id' in node)) 
          errors.push("Uno o mas nodos no tienen ID")
        
        if(errors.length) break //Break on errors, no need to continue

        //Checking general strucutre(For all nodes)
        for(let key of ['index', 'x', 'y', 'fx', 'fy', 'dependencies_nodes', 'dependencies_links', 'literals'])
          if(!(key in node)) errors[node.id] = ("La estructura del nodo" + node.id + " le hace falta " + key) 

        if(!(
          ['number', 'null'].includes(typeof(node.fx)) &&
          ['number', 'null'].includes(typeof(node.fy)) &&
          ['main', 'inter'].includes(typeof(node.type)) &&
          ['string', 'null'].includes(typeof(node.alt_label) &&
          typeof(node.dependencies_nodes) === 'object' &&
          typeof(node.dependencies_links) === 'object' &&
          typeof(node.literals) === 'object'
          )
        ))
          errors[node.id + '_struct'] = ('Nodo no tiene la estructura adecuada', node.id)
        

        if(node.type === 'main') data_nodes_referenced.push(node.id)

        
        //Ends general node structure check
      }//Ends of node iteration check

      // Print any errors encountered during the data check
      if (errors.length){
        this.$toast.error("Errores generales en la estructura de los nodos")
        console.log(errors)
        return
      }

      //No errors, make the component know the nodes for the graph
      let data_nodes = obj.data_nodes
      let data_links = obj.data_links

      //Load the new data of the loaded nodes
      let result = await  this.$AngelusApi
            .post('/entities/by_ids', data_nodes_referenced)
            .catch(e => {this.$toast(e.status)})


      let referenced_entities = {}

      for(let item of result)
        referenced_entities[item.uri] = item

      this.$refs.workplace_component.loadJSON({nodes: data_nodes, links: data_links, references: referenced_entities})

      // Canvas info was suported after, so we need to check if it exists in saved files
      if('canvas_data' in obj){
          this.canvasHeight = ('canvas_height' in obj.canvas_data)? obj.canvas_data.canvas_height : 720;
          this.canvasWidth = ('canvas_width' in obj.canvas_data)? obj.canvas_data.canvas_width : 1280;
          this.title = ('title' in obj.canvas_data)? obj.canvas_data.title : null;
          this.description = ('description' in obj.canvas_data)? obj.canvas_data.description : null;
      }else{
          
          // Finding the nodes most right and most bottom, 
          // if they are outside the default 1280,720 we change the size of the canvas

          let max_width = 1280;
          let max_height = 720;

          for (let node of obj.data_nodes){
            max_width = Math.max(max_width, node.fx, node.x);
            max_height = Math.max(max_height, node.fy, node.y);
          }

          this.canvasHeight = max_height + 120;
          this.canvasWidth = max_width + 240;


          this.title =  null;
          this.description =  null;

          

      }

      this.canvas_center()
 
    },

    

    canvas_center(){
      this.canvas.panzoom_center()
    },

   canvas_toggle_panzoom(){
        this.panzoom_state = this.canvas.toggle_panzoom()
    },

    logout(){
      this.$keycloak.logout()
    },


  }
}
</script>

<style scoped lang="scss">
  .onto-panel-left, .onto-panel-right {
    max-height: 100vh;
  }

  .floating_ontograph_menu{
    * {
      pointer-events: auto;
    }

    pointer-events: none;
  }

  .ontograph_menu{
    // border: solid black 1px;

    position: absolute;
    bottom: 0;
    width: 100%;


  }

  .ontograph_left_pane{
    // border: solid black 1px;

    position: absolute; 
    left:0; 
    top:0;

    height: 100%;
    max-height: 100%;
  }

  .ontograph_right_pane{
    // border: solid black 1px;

    position: absolute; 
    right:0; 
    top:0;
    height: 100%;
    max-height: 100%;

  }



</style>
