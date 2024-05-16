<template>
  <drop class="any cool-background" @drop="onAnyDrop" mode="copy" style="height: 100%; width: 100%;" id="canvas_svg" ref="drop_canvas">
    <svg id="canvas" ref="canvas_svg" :height="canvas_height" :width="canvas_width" :style="'height:' + canvas_height + '; width:' + canvas_width + '; display: inline; border: solid black 1px; background: #FEFEFE;'">

          <svg id="canvas_rect" :height="canvas_height" :width="canvas_width" :style="'height:' + canvas_height + '; width:' + canvas_width + '; background: #FEFEFE;'">


            <defs>
              <marker id="arrow" markerWidth="40" markerHeight="40" refX="0" refY="3" orient="auto" markerUnits="strokeWidth" viewBox="0 0 20 20">
                <path d="M0,0 L0,6 L9,3 z" fill="#000" />
              </marker>

              <marker id="arrow_small" markerWidth="20" markerHeight="20" refX="10" refY="3" orient="auto" markerUnits="strokeWidth" viewBox="0 0 20 20">
                <path d="M0,0 L0,6 L9,3 z" fill="#000" />
              </marker>

              <marker id="arrow_small_r" markerWidth="20" markerHeight="20" refX="10" refY="3" orient="auto" markerUnits="strokeWidth" viewBox="0 0 20 20">
                <path d="M9,0 L9,6 L0,3 z" fill="#000" />
              </marker>
            </defs>

            <g style="font-family: monospace" v-if="title || description">
              <rect fill="#EEEE" :width="canvas_width" height="40" v-if="title"/>
              <rect fill="#EEEE" :width="canvas_width" height="20" y="40" v-if="description"/>
              <text x="10" y="30" size="18" font-family="monospace" style="font-size: 30px; font-family: monospace;" font-size="30"  v-if="title">{{title}}</text>
              <text x="12" y="50" font-size="10" v-if="description">{{description}}</text>
            </g>


            <g>
              <template v-for="node of data_nodes">
                <onto-inter-node 
                  v-if="node.type === 'inter'" 
                  :key="node.id" 
                  
                  :node="node"
                  :entity_data="entitiesInUse[node.id]"
                  :data_nodes_referenced="data_nodes_referenced"
                  :selected_node="selected_node"
                  />
              </template>
            </g>

            <g>
              <template v-for="node of data_nodes">
                  <onto-graph-card 
                    v-if="node.type === 'main'" 
                    :key="node.id"

                    :node="node" 
                    :entity_data="entitiesInUse[node.id]"
                    :selected_node="selected_node"

                    :classColors="oClassColors"
                  />
              </template>
            </g>

            <g id="node_group"></g>


         </svg>
      


    </svg>
  </drop>
</template>

<script>

import * as d3 from "d3";

import { Drop } from "vue-easy-dnd";

import { saveAs } from "file-saver";
import { saveSvgAsPng } from 'save-svg-as-png'
import { getShortUrl, getPropertyPredicateLabel, processUriAsID } from '~/plugins/ontographFunctions'
import panzoom from 'panzoom'

import oClassColors from '~/assets/data/ClassColors.json'

export default {
  components: { Drop },

  props: {
    canvas_height: {
      type: Number,
      default: 720
    },
    canvas_width: {
      type: Number,
      default: 1280
    },
    title: {
      type: String,
      default: null
    },
    description: {
      type: String,
      default: null
    }
  },

  data: () => ({
    simulation_link_distance: 1000, 
    simulation_node_strength: -1000,
    //Main canvas variables
    svg: null,
    canvas: null,
    nodeGroup: null,
    linkGroup: null,

    //Simulation variables
    simulation: null,
    t: undefined,
    // Objects for the simulation to do its job
    // Contains location variables( both x & y, and fixed fx & fy), force variables(where the node should move), and a reference access to the data to be shown by the node
    data_nodes: [],
    data_links: [],

    data_nodes_referenced: {},


    //Represents the nodes that are shown graphically on the canvas, in this case, the transparent circles where one can drag the nodes with
    item_nodes: null,
    item_links: null,

    

    selected_node: null,

    entitiesInUse: {},

    panzoom_instance: null,

    oClassColors: oClassColors
  }),

  computed: {
    OClasses () {
        return this.$store.state.ontograph.OClasses
    },
    ORelations () {
        return this.$store.state.ontograph.ORelations
    },
    OProperties () {
        return this.$store.state.ontograph.OProperties
    },

    windowCenterX: function () {
      return (this.$vuetify.breakpoint.width - this.canvas_width) / 2
    },

    windowCenterY: function () {
      return (this.$vuetify.breakpoint.height - this.canvas_height) / 2
    }
  },

  mounted() {
    //Setting initial variables
    this.svg = d3.select("#canvas");
    this.nodeGroup = this.svg.select("#node_group")
    this.linkGroup = this.svg.select("#link_group")

    //Initializing simulation
    this.t = this.svg.transition().duration(600);

    this.simulation = d3
      .forceSimulation(this.data_nodes)
      .force( "charge", d3.forceManyBody().strength(-6000))
      .force( "link", d3.forceLink(this.data_links).distance(2).strength(1))
      .on("tick", this.simulation_tick);

    this.panzoom_instance = panzoom(this.$refs.canvas_svg, {
      maxZoom: 2,
      minZoom: 0.3,
      bounds: true,
      boundsPadding: 0.1,
      initialX: 10,
      initialY: 0.5,
      initialZoom: 1
    })

    this.panzoom_center(false)

  },

  methods: {
    //Useful generic methods related to Ontograph
    getShortUrl: getShortUrl,
    getPropertyPredicateLabel: getPropertyPredicateLabel,
    processUriAsID: processUriAsID,

    reSimulate(){
      //Re doing simulation
      this.simulation.force("link", d3.forceLink(this.data_links).distance(20).strength(1))      
      this.simulation.nodes(this.data_nodes);
      this.simulation.alpha(1);
      this.simulation.restart();
    },

    reDraw(){

      let update_nodes = this.nodeGroup
        .selectAll("rect")
        .data(this.data_nodes, d => d.id);

      update_nodes
        .exit()
        .remove();

      this.item_nodes = update_nodes
        .enter()
        .append("rect")
        .attr("class", d => {return d.type + " node_rect"})
        .attr("width", 350 )
        .attr("height", d =>  (d.type === 'main')? 80: 20 )
        .attr('fill', 'transparent')
        .attr('opacity', 1)
        .attr('stroke', '#00000')

        .on("click", this.clickedNode)

        //Adding drag functions
        .call(d3.drag()
          .on("start", this.dragstarted)
          .on("drag", this.dragged)
          .on("end", this.dragended)
        )

        //Merge data into the array #Important
        // .merge(update_nodes)

      let update_links = this.linkGroup
        .selectAll("line")
        .data(this.data_links);

      update_links
        .exit()
        .remove()

    },

    simulation_tick(){
      //Note: Check if making a promise for each betters performance

      //Set custom position for inter nodes (halfway of reference nodes)
      for(let node of this.data_nodes){


        if(node.x > (this.canvas_width - 354)) node.x = this.canvas_width - 354
        if(node.x < 4) node.x = 4
        if(node.y >  (this.canvas_height - 86)) node.y = (this.canvas_height - 86)
        if(node.y < 25) node.y = 25
        
        

        if(node.type === 'inter' && node.fx === null){
          node.x = ( this.data_nodes_referenced[node.object_id].x + this.data_nodes_referenced[node.subject_id].x ) / 2
          node.y = ( this.data_nodes_referenced[node.object_id].y + this.data_nodes_referenced[node.subject_id].y ) / 2
        }
      }
      
      //Where the node reference circle (DRAG) will be positioned
      this.nodeGroup
        .selectAll('rect')
        .attr("x", d => (d.type === 'main')? d.x: d.x - 10)
        .attr("y", d => (d.type === 'main')? d.y: d.y - 10)
        

    },

    addNode(entity, class_id, labels, x = this.canvas_width/2, y = this.canvas_height/2, fx = null, fy = null){

      let key_buffer = entity

      //No duplicates nodes permited
      if(this.data_nodes.find(d => d.id === key_buffer)){
        this.$toast.error("Nodo con este ID ya existe!")
        return 
      }

      let data_buffer = {
          entity: key_buffer,
          class: class_id,
          labels: labels
        }

      this.entitiesInUse[key_buffer] = data_buffer

      //Data node buffer
      let node_buffer = {
            x: x, 
            y:  y,
            fx: fx,
            fy: fy,

            //Extra data to personalize the canvas-node information
            type: "main",

            //Reference to the nodes and links to change in th prospect of any change
            dependencies_nodes: [],
            dependencies_links: [],

            //Personalized literals that will be shown in the node cards
            //NOTE: Do not merge with the node information since that is server dependant completly
            literals: [],
            alt_label: null,

            //Only refrence to the id of the node, the node information is stored in the "entitiesInUse" variable
            id: key_buffer,
            // node: event.data.node,
            // class: event.data.class
          }

      this.data_nodes.push(node_buffer)
      this.data_nodes_referenced[key_buffer] = node_buffer


      this.reSimulate();

      //Calling update
      this.reDraw();

      this.select_node({node: node_buffer, nodeData: data_buffer, type: 'props'})

    },

    onAnyDrop(event) {
      // console.log( event.native)

      this.addNode(
          event.data.node.entity,
          event.data.node.class_id,
          event.data.node.labels,
          event.native.offsetX || event.native.layerX, 
          event.native.offsetY || event.native.layerY, 
          event.native.offsetX || event.native.layerX, 
          event.native.offsetY || event.native.layerY, 
          )      
    },

    addLinkNode({relation: relation, relation_target: relation_target, type: type}){

      let rel_type = (relation.central_entity_role.includes('object'))? 'object': 'subject';
      let object_id = (rel_type === 'object')? relation.entity : relation_target
      let subject_id = (rel_type !== 'object')? relation.entity : relation_target 

      
      //Searching for a relationship of the same type(maybe different document)
      //Same type of object, subject and link type are the same
      let d = this.data_nodes.find(d => 
            d.type === 'inter' &&
            d.object_id === object_id && 
            d.subject_id === subject_id &&
            d.link_type === relation.link_type)


      if(d){
        //If adding a relationship and there is "no_doc" flag, no document is being asked to be shown
        if(type === 'no_doc'){
          this.$toast.error("Error: Esta relacion ya existe")
          return 

        //If the type is not "no_doc" a provenance is ment to be attached, check if it exists
        }else if(relation.reification_uri in Object.keys(d.provenance)){
          this.$toast.error("Error: Este documento ya esta siendo mostrado")
          return 
        }else{
        // If the provenance doesnt exists, add it to the list
          d.provenances.reification_uri = {
              ...relation.provenance, ...relation.relation_properties
          }
        }
      }

      let target_node = this.data_nodes_referenced[relation_target]
      //Getting "node node" that the relationship references if it already existed [I know, ill have to change the name later on]
      let new_node = (relation.entity in this.data_nodes_referenced)? this.data_nodes_referenced[relation.entity] : undefined;

      //Creating the new node if it didnt existed in the canvas yet
      if(new_node === undefined){
        //Creating node reference info
        this.entitiesInUse[relation.entity] = {
          entity: relation.entity,
          class: relation.entity_class,
          labels: relation.labels
        }

        //Adding node to data_nodes
        new_node = {
          x: target_node.x + 500, 
          y: target_node.y,
          fx: null,
          fy: null,

          id: relation.entity,

          type: "main",

          dependencies_nodes: [],
          dependencies_links: [],

          literals: [],
          alt_label: null,
        }

        this.data_nodes.push(new_node)
        this.data_nodes_referenced[new_node.id] = new_node
      }


      let relation_node = {
          x: target_node.x + 250, 
          y:  target_node.y,
          fx: null,
          fy: null,

          id: "rel_" + subject_id + '___' + object_id + '___' + relation.link_type,

          type: "inter",

          subject_id: subject_id,
          object_id: object_id,

          dependencies_nodes: [],
          dependencies_links: [],

          link_type: relation.link_type,

          //TODO: Really in use?
          literals:[],

          provenance: {}
      }

      if(type !== 'no_doc')
        relation_node.provenance[relation.reification_uri] = {...relation.provenance, ...relation.relation_properties}

      this.data_nodes.push(relation_node)
      this.data_nodes_referenced[relation_node.id] = relation_node
        

      // //Creating link between nodes
      let buffer_link_01 = {
          source: relation_node,
          target: new_node,
          id:"r_" + relation_node.id
          }

      let buffer_link_02 = {
          source: relation_node,
          target: target_node,
          id: "l_" + relation_node.id
          }

      this.data_links.push(buffer_link_01)
      this.data_links.push(buffer_link_02)   

      //Adding dependencies for easy removing the nodes(no search)
      target_node.dependencies_nodes.push(relation_node.id)
      target_node.dependencies_links.push(buffer_link_01.id)
      target_node.dependencies_links.push(buffer_link_02.id)

      new_node.dependencies_nodes.push(relation_node.id)
      new_node.dependencies_links.push(buffer_link_01.id)
      new_node.dependencies_links.push(buffer_link_02.id)

      relation_node.dependencies_links.push(buffer_link_01.id)
      relation_node.dependencies_links.push(buffer_link_02.id)


      this.reSimulate();

      //Calling update
      this.reDraw();

    },

    remove_node(given_node){
      given_node = this.data_nodes_referenced[given_node.entity]

      console.log(given_node)

      //Removing dependent links
      this.data_links = this.data_links.filter( d => !given_node.dependencies_links.includes(d.id))
      


      //Removing dependent nodes
      this.data_nodes = this.data_nodes.filter( d => ![...given_node.dependencies_nodes, given_node.id].includes(d.id))
      this.$delete(this.data_nodes_referenced, given_node.id)
      this.$delete(this.entitiesInUse, given_node.id)
      // this.$delete(this.entitiesInUse, 

      this.reSimulate();

      this.selected_node = null;
      this.$emit("select-node", {node: null})

      this.reDraw()
    },

    select_node({node: node, nodeData: nodeData, type: type = "prop"}){
      this.selected_node = node;
      this.$emit("select-node", {node: node, nodeData: nodeData, type: type})

      this.simulation.alpha(.1).restart();
    },

    deselectNode(node){
        this.selected_node = null
    },

    pin_toggle_node(node){
      if(node.fx){
        node.fx = null
        node.fy = null
      }else{
        node.fx = node.x
        node.fy = node.y
      }    

      this.simulation.alpha(1).restart();
    },

    direction(source, target){
      return  (source.x || source.fx) + ',' + (source.y || source.fy) + ' ' + 
              (target.x || target.fx) + ',' + (target.y || target.fy) + ' '
    },

    clickedNode(d, i, e){
      let nodeData = this.entitiesInUse[i.id]

      this.select_node({node: i, nodeData: nodeData})
    },

    dragstarted (d, i, e){
      if (!d.active && this.simulation !== null) 
          this.simulation.alphaTarget(0.4).restart();

      // d.x = d.x;
      // d.y = d.y;

    },

    dragged(d, a, x){
      d.subject.fx = d.x;
      d.subject.fy = d.y;
    },

    dragended(d){
      if (!d.active && this.simulation !== null) 
        this.simulation.alphaTarget(0);
    },

    panzoom_center(smooth = true){
      this.panzoom_instance.pause()
      this.panzoom_instance.moveTo(this.windowCenterX, this.windowCenterY)
      this.panzoom_instance.zoomAbs(0,0,1)
      this.panzoom_instance.resume()
      // console.log(c)
        // if(smooth){
        //   this.panzoom_instance.smoothZoomAbs(0,0,1)
        //   //this.panzoom_instance.smoothMoveTo(this.windowCenterX, this.windowCenterY);
          
        //   // this.panzoom_instance.smoothZoom(zoom_object)
        // }
        // else {
        //   // this.panzoom_instance.moveTo(this.windowCenterX, this.windowCenterY)
          
        //   // this.panzoom_instance.zoomTo(zoom_object)
        // }

    },

    toggle_panzoom(){
      if(this.panzoom_instance.isPaused()){
        this.panzoom_instance.resume()
        return true
      }  
      else
      {
        this.panzoom_instance.pause()
        return false
      }
        
    },

    async saveImg() {

      saveSvgAsPng(
        document.getElementById("canvas_rect"), 
        "diagram.png");

    },

    emptyCanvas(){

      this.data_nodes = []
      this.data_links = []

      this.data_nodes_referenced = new Object()
      
      this.selected_node = null

      this.entitiesInUse = new Object()

      this.simulation.alpha(.1).restart();
    },

    getJSON(){
      //Eliminating references and storing only id's
      let link_buffer = JSON.parse(JSON.stringify(this.data_links))
      for(let link of link_buffer){
        link.source = link.source.id
        link.target = link.target.id
      }

      let canvas_data = {
        canvas_height: this.canvas_height,
        canvas_width: this.canvas_width,
        title: this.title,
        description: this.description
      }
        
      let data = JSON.stringify({data_nodes: this.data_nodes, data_links: link_buffer, canvas_data: canvas_data})
      let blob = new Blob([data], {type: "text/plain;charset=utf-8"});
      let name = new Date(Date.now()).toLocaleString()

      for(let char of [':', ' ', "/", ","])
        name = name.split(char).join('_')

      saveAs(blob, name + ".json");  
    },

    loadJSON({nodes, links, references}){

      this.emptyCanvas()

      this.simulation.stop();

      this.entitiesInUse = references;
      this.data_nodes = Object.values(nodes)
      this.data_nodes_referenced = {}

      for(let node of this.data_nodes)
        this.data_nodes_referenced[node.id] = node

      //Getting reference from the links id's
      for(let link of links){
        link.target = this.data_nodes_referenced[link.target]
        link.source = this.data_nodes_referenced[link.source]
      }

      this.data_links = links

      this.reSimulate();
      this.reDraw();
    },
    
  }
};
</script>