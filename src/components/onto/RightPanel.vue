<template>
    <v-sheet class="pa-2" width="300" color="#00000099" elevation="8" style="max-height: 100vh; overflow-y: auto;">
        <v-container class="pa-0">

        <v-row no-gutters>
            <v-spacer/>
            <v-btn fab height="20" width="20" @click="deselectNode">
                <v-icon x-small>mdi-close</v-icon>
            </v-btn>
        </v-row>

        <template v-if="node.type === 'main' && readyState">

            <v-row no-gutters v-if="entityData !== null">
                <v-card style="width:100%">
                    <v-card-text class="pb-0 px-3" style="font-size: 10px;">{{ getShortUrl(entityData.uri) }}</v-card-text>
                    <v-card-subtitle class=" pt-0 pb-2 px-3 black--text">{{entityData.label[0].label_value}}</v-card-subtitle>
                    
            
                    <v-card-actions class="pt-1 px-2">
                        <v-row no-gutters>
                            <v-btn x-small fab text class="mr-1" 
                                  @click.stop="deleteNode()">
                                <v-icon >mdi-delete-outline</v-icon>
                            </v-btn>
                            <v-btn x-small fab text class="mr-1" 
                                  @click.stop="setAlternativeLabel()">
                                <v-icon >mdi-tag-outline</v-icon>
                            </v-btn>

                            <v-btn x-small fab text class="mr-1" 
                                  @click.stop="unpinNode()">
                                  
                                <v-icon v-if="node.fx">mdi-pin-off</v-icon>
                                <v-icon v-else>mdi-pin</v-icon>
                            </v-btn>

                            <v-spacer/>

                            <v-btn x-small fab text class="ml-1" 
                                   @click="$CCopy(entityData.uri)"
                                   >
                                <v-icon >mdi-content-copy</v-icon>
                            </v-btn>
                            <v-btn  x-small fab text class="ml-1" :to="'/i?uri=' + entityData.uri" target="_blank">
                                <v-icon>mdi-share</v-icon>
                            </v-btn>
                        </v-row>
                    </v-card-actions>
                </v-card>        
            </v-row>

            <v-tabs
                v-if="readyState && node !== null"
                v-model="tab"
                background-color="transparent accent-4"
                dark
                centered
                grow
            >

                <v-tabs-slider></v-tabs-slider>

                <v-tab href="#tab-props" v-tooltip="'Literales'">
                    <v-icon>mdi-table-of-contents</v-icon>
                </v-tab>

                <v-tab href="#tab-links" v-tooltip="'Relaciones'">
                    <v-icon>mdi-relation-one-to-one</v-icon>
                </v-tab>


                <v-tab-item :value="'tab-props'">
                    <v-list dense>


                        <v-list-item>
                            <v-list-item-content class="pt-2 pb-1">
                                <v-row no-gutters class="px-2" justify="center">
                                    <v-btn fab x-small elevation="2" class="mx-4" 
                                           v-tooltip="'Filtros'"
                                           @click="nodeliteraldate_widget = !nodeliteraldate_widget" >
                                                <v-icon>mdi-filter</v-icon>
                                    </v-btn>
                                </v-row>
                            </v-list-item-content>
                        </v-list-item>

                        <v-slide-y-transition>

                            <v-sheet color="#0001" v-if="nodeliteraldate_widget" :rounded="true" class="ma-1 px-1 py-2" outlined>
                                
                                <onto-calendar-pick 
                                    hint="Cota superior"
                                    v-model="propertiesFilterdate_upper_high"
                                    />

                                <onto-calendar-pick 
                                    hint="Cota superior"
                                    v-model="propertiesFilterdate_upper_low"
                                    />

                                <onto-calendar-pick 
                                    hint="Cota inferior"
                                    v-model="propertiesFilterdate_lower_high"
                                    />

                                <onto-calendar-pick 
                                    hint="Cota inferior"
                                    v-model="propertiesFilterdate_lower_low"
                                    />

                            </v-sheet>

                        </v-slide-y-transition>

                        <v-text-field
                            class="my-2 mx-2"
                            outlined dense
                            hide-details
                            label="Buscar"
                            append-icon="mdi-magnify"
                            v-model="propertiesFilterString"
                            />
                        <v-divider></v-divider>

                        <v-list-item @click="addNodeInfo">
                            <v-list-item-action class="mr-4">
                                <v-icon>mdi-check-box-multiple-outline</v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title>Mostrar literales</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>

                        <v-list-item-group v-model="propertiesToShow" multiple>
                            <template v-for="(prop, key) of filteredNodeProperties">
                                <v-list-item :key="prop.predicate + '_' + key">
                                    <template v-slot:default="{active}">


                                        <v-list-item-action class="mr-4">
                                            <v-checkbox :input-value="active"></v-checkbox>
                                        </v-list-item-action>

                                        <v-list-item-content>
                                            <v-list-item-subtitle>{{getPropertyPredicateLabel(prop.predicate, OProperties)}} : </v-list-item-subtitle>
                                            <v-list-item-title>{{ prop.literal }}</v-list-item-title>
                                        </v-list-item-content>

                                        <v-list-item-action class="ml-4">
                                            <v-btn fab height="26" width="26" elevation="2" @click.stop="setAlternativeLabel(prop.literal)">
                                                <v-icon size="20">mdi-tag-outline</v-icon>
                                            </v-btn>
                                        </v-list-item-action>

                                    </template>
                                </v-list-item>

                            </template>
                        </v-list-item-group>
                    </v-list>
                    
                </v-tab-item>

                <v-tab-item :value="'tab-links'" color="transparent">

                    <v-row v-if="nodeRelations === null && nodeRelations" align="center">
                        <v-progress-circular indeterminate></v-progress-circular>
                    </v-row>

                    <v-list v-else dense class="pt-1">

                        <v-list-item>
                            <v-list-item-content class="pt-2 pb-1">
                                <v-row no-gutters class="px-2" justify="center">
                                    
                                    <v-btn fab x-small elevation="2" class="mx-4" 
                                            v-tooltip="'Agregar todo'"
                                            @click="addAllLinks(false)">
                                        <v-icon>mdi-playlist-plus</v-icon>
                                    </v-btn>

                                    <v-btn fab x-small elevation="2" class="mx-4" 
                                           v-tooltip="'Buscar relaciones existentes'"
                                           @click="addAllLinks(true)">
                                        <v-icon >mdi-layers-search-outline</v-icon>
                                    </v-btn>

                                    <v-btn fab x-small elevation="2" class="mx-4" 
                                            v-tooltip="'Filtros'"
                                           @click="nodeRelations_widget = !nodeRelations_widget" >
                                        <v-icon>mdi-filter</v-icon>
                                    </v-btn>
                                </v-row>
                            </v-list-item-content>
                        </v-list-item>

                        <v-slide-y-transition>

                            <v-sheet color="#0001" v-if="nodeRelations_widget" :rounded="true" class="ma-1 px-1 pt-2" outlined>
                                
                                <onto-class-domain-range-select
                                    class="mt-1"
                                    :selected_class="classFilterType"
                                    :link_count="nodeRelationsProperties_count"
                                    v-on:ray-array-selected="rays => classFilterRays = rays"
                                    />


                                <onto-calendar-pick 
                                    hint="Cota superior"
                                    v-model="classFilterdate_high"
                                    />

                                <onto-calendar-pick 
                                    hint="Cota inferior"
                                    v-model="classFilterdate_low"
                                    />


                                <v-divider class="mt-4" />

                                <v-row no-gutters>
                                    <v-col cols="6" xs="12">
                                        <v-btn block text @click="cancelSearch">Cancelar</v-btn>
                                    </v-col>

                                    <v-col cols="6" xs="12">
                                        <v-btn block class="grow" text @click="loadData_search_relations">Buscar</v-btn>
                                    </v-col>
                                </v-row>



                            </v-sheet>

                        </v-slide-y-transition>

                        <v-text-field
                            class="ma-2"
                            dense outlined
                            hide-details
                            label="Buscar"
                            append-icon="mdi-magnify"
                            v-model="classFilterString"
                            />

                        <template v-if="Object.values(nodeRelations).length"> 

                            <v-subheader
                                    v-if="user_in_search"
                                    v-text="'Resultados de busqueda...'"
                                    style="height:30px;"
                                    class="font-weight-bold"
                                    />

                            <template v-for="(relation_entity, link_type) of nodeRelations_grouped" >

                                <v-subheader
                                    :key="'group_' + link_type"
                                    v-text="getPropertyPredicateLabel( link_type, ORelations)"
                                    style="height:30px;"
                                    class="font-weight-bold"
                                    />

                                <v-divider :key="'div01_' + link_type"/>

                                <onto-right-panel-rel-item-fragment
                                    v-for="(relation_support_docs, relation_entity) of relation_entity"
                                    :key="'rel_class_' + link_type + '' + relation_entity"
                                    :entityRelations="relation_support_docs"
                                    v-on:add-relation="addNode"
                                    />

                                <v-divider :key="'div02_' + link_type"/>

                            </template>


                        </template>

                        <template v-else>

                            <v-sheet v-if="user_in_search" class="px-2 py-4">
                                <template v-if="nodeRelations_search_ready">
                                    <v-row justify="center">
                                        <v-icon>mdi-alert-box-outline</v-icon>
                                    </v-row>
                                    <v-row justify="center" class="my-2 font-weight-bold" style="color:'#00066'">
                                        Ninguna relacion encontrada
                                    </v-row>
                                </template>
                                <template v-else>
                                    <v-progress-circular indeterminate/>
                                </template>   
                            </v-sheet>

                            <v-sheet v-else class="px-2 py-4">
                                <v-row justify="center">
                                    <v-icon>mdi-alert-box-outline</v-icon>
                                </v-row>
                                <v-row justify="center" class="my-2 font-weight-bold" style="color:'#00066'">
                                    Ninguna relacion que mostrar
                                </v-row>
                            </v-sheet>
                        </template>
                    </v-list>
                </v-tab-item>
            </v-tabs>
        </template>

        <template v-else-if="node.type === 'inter' && readyState">

            <v-container class="pa-0 py-2">
                <v-row no-gutters class="text-caption white--text">
                    Soporte documental
                </v-row>
                <v-row no-gutters class="text-h6 white--text mt-0">
                    {{getPropertyPredicateLabel(node.link_type, OProperties)}}
                </v-row>

                <v-row no-gutters >
                    <v-card class="px-2 py-1" width="100%"> 
                        <v-btn x-small fab elevation="2" class="mr-3" 
                                @click.stop="unpinNode()">
                                
                            <v-icon v-if="node.fx">mdi-pin-off</v-icon>
                            <v-icon v-else>mdi-pin</v-icon>
                        </v-btn>
                    </v-card>
                </v-row>

            </v-container>


            <v-list style="width: 100%;" dense>

                <template v-for="(relation, index) of nodeRelations">

                    <v-list-item 
                        v-if="relation.link_type === node.link_type && relation.entity === node.subject_id"
                        :key="'right_search_' + index" 
                        class="px-1"
                        two-line
                        @click="openMenu($event, relation)"
                        >

                        <v-list-item-avatar class="mr-2" size="30">
                            <onto-rate-of-trust-svg :confianza="getShortUrl(relation.relation_properties.confianza)" :size="12"/>
                        </v-list-item-avatar>

                        <v-list-item-content>
                            <v-list-item-title v-html="getShortUrl(relation.provenance.soporte_documental) || 'Documento sin ID'"/>
                            <v-list-item-subtitle style="font-size: 12px" v-html="getShortUrl(relation.link_type)"/>
                        </v-list-item-content>

                        <v-list-item-action class="mx-1"> 
                            <v-simple-checkbox 
                                @click="toggleLiteral(relation)"
                                :value="Object.keys(node.literals).includes(relation.entity)"
                                    />
                        </v-list-item-action>


                    </v-list-item>
                </template>


            </v-list>

        </template>

        <v-row no-gutters style="height: 150px; width: 100%" justify="center" align="center"  v-else>
            <v-progress-circular indeterminate/>
        </v-row>

        </v-container>

        <v-menu
            v-model="menu"
            :close-on-content-click="false"
            absolute
            offset-y
            :position-x="relationMenuX"
            :position-y="relationMenuY"
            >

            <v-card v-if="selectedRelation">
                <v-list>
                    <v-list-item>
                        <v-list-item-content>
                        <v-list-item-title>{{getShortUrl(selectedRelation.provenance.soporte_documental)}}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-content>                                                        
                            <v-list-item-title>Relation properties</v-list-item-title>
                            <v-list-item> Validez: {{selectedRelation.relation_properties.validity_period}}   </v-list-item>
                            <v-list-item> Observaciones: {{selectedRelation.provenance.observaciones}}  </v-list-item>
                            <v-list-item> Soporte Documental: {{selectedRelation.provenance.soporte_documental}}  </v-list-item>
                        </v-list-item-content>
                    </v-list-item>
                    <v-divider></v-divider>

                    <v-list-item @click="$CCopy(selectedRelation.provenance.soporte_documental)">
                        Copiar uri
                    </v-list-item>

                    <v-list-item target="_blank" :href="uriToLink( selectedRelation.provenance.soporte_documental)">
                        Abrir en nueva pestaña
                    </v-list-item>
                                    
                </v-list>



            </v-card>

        </v-menu>

    </v-sheet>
</template>

<script>

import { getShortUrl, getPropertyPredicateLabel, uriToLink } from '~/plugins/ontographFunctions'

export default {

    props: {
        node: {
            type: Object,
            default: null
        },
        nodeData:{
            type: Object,
            default: null
        }
    },

    data: () => ({
        readyState: false,
        tab: 1,

        entityData: null,

        nodeliteraldate_widget: false,


        showingExistingCanvasRelations: false,
        nodeRelations_all: null,
        nodeRelations_grouped_all: null,
        nodeRelationsProperties_count: {},

        user_in_search: false,

        nodeRelations_widget: false,
        nodeRelations_search: null,
        nodeRelations_grouped_search: null,
        nodeRelations_search_ready: true,

        classFilterString: '',
        classFilterdate_low: null,
        classFilterdate_high: null,
        classFilterRays: [],

        //Array of selected properties to show in the card on the graph
        propertiesToShow: [],

        // Node - type:main tab-properties
        propertiesFilterString: '',
        propertiesFilterdate_upper_high: undefined,
        propertiesFilterdate_upper_low: undefined,
        propertiesFilterdate_lower_high: undefined,
        propertiesFilterdate_lower_low: undefined,
        propertiesFilterType: undefined,


        menu: false,
        selectedRelation: null,
        relationMenuX: null,
        relationMenuY: null,

    }),

    mounted(){
        this.clearSearch()
        this.loadInfo()
    },

    computed: {
        OClasses () {
            return this.$store.state.ontograph.OClasses
        },
        OSubClasses () {
            return this.$store.state.ontograph.OSubClasses
        },
        ORelations () {
            return this.$store.state.ontograph.ORelations
        },
        OProperties () {
            return this.$store.state.ontograph.OProperties
        },

        nodeProperties(){
            return this.entityData.data_properties
        },

        filteredNodeProperties(){
            //See if they actually have a date to filter by
            // this.nodeProperties.filter(d=> {if(d.specific_provenance.validity_period !== null) console.log("Tiene provenance")})
            // console.log(this.nodeProperties)

            return this.nodeProperties.filter(d => 
                (this.propertiesFilterString !== '')? ( d.literal.includes(this.propertiesFilterString) || d.predicate.includes(this.propertiesFilterString)) : true
                )
        },

        nodeRelations () {
            return (this.user_in_search && this.nodeRelations_search_ready) ? this.nodeRelations_search : this.nodeRelations_all
        },

        nodeRelations_grouped (){
            // if(this.showingExistingCanvasRelations)
            //     return this.nodeRelations_all.filter(d=> this.$parent.canvas_entities.includes(d.entity))
            return (this.user_in_search && this.nodeRelations_search_ready) ? this.nodeRelations_grouped_search : this.nodeRelations_grouped_all
        },

        disabledCalendarDates(date) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            return date < new Date('1810-01-01') || date > today;
        },


    },

    watch: {
        node (val) {
            this.loadInfo()
        },
    },

    methods: {

        getShortUrl: getShortUrl,
        getPropertyPredicateLabel: getPropertyPredicateLabel,
        uriToLink: uriToLink,

        async loadInfo(){
            //On node change, load the correspoding data
            //Hide all info while loading
            this.readyState = false;

            if( this.node.type === 'main') 
                await this.loadData_main()
            else if ( this.node.type === 'inter' ) 
                await this.loadData_inter()

            this.readyState = true;
        },

        async loadData_main(){
            //Reset variables
            this.propertiesToShow = []

            //Getting all main info of the node
            this.entityData = await this.$AngelusApi
                .get('/entities/by_id?entity_id=' + this.node.id)
                .catch( e => {
                    this.$toast(e.status)
                    return null;
                })

            //Getting connected nodes to the original node
            let result_buffer = await this.$AngelusApi
                .get('/entitites/connected_to?central_entity=' + this.node.id)
                .catch( e => {
                    this.$toast(e.status)
                    return null;
                })

            this.nodeRelationsProperties_count = result_buffer.link_count
            let relationships_buffer = result_buffer.linked_entities            

            /** Explanation of variables used
            nodeRelations_search: 
                - Each item represents a documents supporting a relationsip and not a relationsip itself
                - It will be an object key'd by retification URI (Unique ID of a document reference)
            
            nodeRelations_grouped_search:
                -The user needs to see relationships and not document references so ->
                -> search_grouped will group by [type of relationship (link_type)][related entity(entityy which is related to)]
            
                result format (user readable):
                {
                    "link_type_x": {
                        "entity_A": ["reification_id_of_reference_confirming_relationship", "reification_alpha", "reification_beta", ...],
                        "entity_B": ["reification_id_confirming_this_other_relationship", ...]
                    },
                    "other_type_of_relationship":{
                        "with_other_entity": ["reification_uri_confirming_this_relationship"]
                    }
                }
                

            **/

            let relations_buffer = {}
            let relations_grouped_buffer = {}
            
            for(let relation of Object.values(relationships_buffer)){
                //Mapping relations with entity uri's as keys
                relations_buffer[relation.reification_uri] = relation

                //Looking for existing relationship type, ensuring object representing this "group"
                if(!(relation.link_type in relations_grouped_buffer))
                    relations_grouped_buffer[relation.link_type] = {}

                //Looking for existing relationship entity, ensuring array represeting this "sub-group"
                if(!(relation.entity in relations_grouped_buffer[relation.link_type]))
                    relations_grouped_buffer[relation.link_type][relation.entity] = []

                //After ensuring the proper objects and arrays, adding the reification uri to the proper group
                relations_grouped_buffer[relation.link_type][relation.entity].push(relation)
            }

            // console.log(relations_buffer)
                    
            this.nodeRelations_all = relations_buffer
            this.nodeRelations_grouped_all = relations_grouped_buffer

        },

        async loadData_inter(){
            
            let relation_buffer = await this.$AngelusApi
                .post('/entitites/connected_to', {central_entity: this.node.object_id, rays: [this.node.link_type]})
                .then(r => r.linked_entities)
                .catch( e => {
                    this.$toast(e.status)
                    return null;
                })

            //Only get the relations that are the type of the node
            this.nodeRelations_all = relation_buffer.filter(rel => rel.link_type === this.node.link_type)
        },

        async loadData_search_relations(search_flag){
            

            this.user_in_search = true

            //Variable to show search in progress
            this.nodeRelations_search_ready = false;

            //At least one search variable to do a search, else en search
            let at_least_one_search_term = (
                this.classFilterdate_low !== null ||
                this.classFilterdate_high !== null||
                this.classFilterRays.length      
            )

            //No search term, lets end this farce*
            if(!at_least_one_search_term){
                this.clearSearch()
                this.nodeRelations_search_ready = true
                return
            }

            // --- Constructing search object ---
            let search = { central_entity: this.node.id }

            //Only include search term if it exists
            if(this.classFilterdate_low) search['date_lower_bound'] = this.classFilterdate_low
            if(this.classFilterdate_high) search['date_upper_bound'] = this.classFilterdate_high
            if(this.classFilterRays.length) search['rays'] = this.classFilterRays

            //Debugging search object
            // console.log("Search: ", search)

            //Getting connected nodes to the original node
            let relationships_buffer = await this.$AngelusApi
                .post('/entitites/connected_to', search)
                .then( r => r.linked_entities)
                .catch( e => {
                    this.$toast(e.status)
                    return null;
                })


            /** Explanation of variables used
            nodeRelations_search: 
                - Each item represents a documents supporting a relationsip and not a relationsip itself
                - It will be an object key'd by retification URI (Unique ID of a document reference)
            
            nodeRelations_grouped_search:
                -The user needs to see relationships and not document references so ->
                -> search_grouped will group by [type of relationship (link_type)][related entity(entityy which is related to)]
            
                result format (user readable):
                {
                    "link_type_x": {
                        "entity_A": ["reification_id_of_reference_confirming_relationship", "reification_alpha", "reification_beta", ...],
                        "entity_B": ["reification_id_confirming_this_other_relationship", ...]
                    },
                    "other_type_of_relationship":{
                        "with_other_entity": ["reification_uri_confirming_this_relationship"]
                    }
                }
                

            **/

            let search_buffer = {}
            let search_grouped_buffer = {}

            for(let relation of Object.values(relationships_buffer)){
                //Mapping relations with entity uri's as keys
                search_buffer[relation.reification_uri] = relation

                //Looking for existing relationship type, ensuring object representing this "group"
                if(!(relation.link_type in search_grouped_buffer))
                    search_grouped_buffer[relation.link_type] = {}

                //Looking for existing relationship entity, ensuring array represeting this "sub-group"
                if(!(relation.entity in search_grouped_buffer[relation.link_type]))
                    search_grouped_buffer[relation.link_type][relation.entity] = []

                //After ensuring the proper objects and arrays, adding the reification uri to the proper group
                search_grouped_buffer[relation.link_type][relation.entity].push(relation)
            }
                    
            this.nodeRelations_search = search_buffer
            this.nodeRelations_grouped_search = search_grouped_buffer

            this.nodeRelations_search_ready = true;

        },

        cancelSearch(){
            this.user_in_search = false
            this.clearSearch()
        },

        clearSearch(){
            this.nodeRelations_search = null

            this.classFilterString = ''
            this.classFilterdate_low = null
            this.classFilterdate_high = null
            this.classFilterType = null       
        },

        deleteNode(){
            this.$emit("node-remove", this.nodeData)
        },

        addNodeInfo(){
            let properties_buffer = []

            for(let position of this.propertiesToShow){
                properties_buffer.push(JSON.parse(JSON.stringify(this.entityData.data_properties[position])))
            }
                
            this.node.literals = properties_buffer
        },

        addNode(target, type = 'no_doc'){
            this.$emit("add-node-from-source", {relations_array: [target], relation_target: this.node.id, type: 'no_doc'})
        },

        addAllLinks(existing = false){
            if(existing){
                this.cancelSearch()
                this.nodeRelations_widget = false;
            } 
            let relations_to_add = []

            for(let link_types of Object.values(this.nodeRelations_grouped))
                for(let relation_doc of Object.values(link_types))
                    relations_to_add.push(relation_doc[0])

            if(existing)
                    relations_to_add = relations_to_add.filter(d=> this.$parent.canvas_entities.includes(d.entity))

            this.$emit("add-node-from-source", {relations_array: relations_to_add, relation_target: this.node.id, type: 'no_doc'})
        },

        setAlternativeLabel(text = null){
            //Setting the variable
            this.$set(this.node, 'alt_label', (text !== null)? text : null )
        },

        toggleLiteral(relation){

            if(!Object.keys(this.node.literals).includes(relation.entity)){
                if(this.node.type === "main")
                    this.$set(
                            this.node.literals, 
                            relation.entity, 
                            {
                                url: relation.entity, 
                                document: relation.provenance.soporte_documental,
                                confianza: relation.relation_properties.confianza,
                                show: true
                            }
                        )

                if(this.node.type === "inter")
                    this.$set(
                            this.node.literals, 
                            relation.entity, 
                            {
                                url: relation.entity, 
                                document: relation.provenance.soporte_documental,
                                confianza: relation.relation_properties.confianza,
                                show: true
                            }
                        )
            }
            else    
                this.$delete(this.node.literals, relation.entity) 
                        
        },

        getDateInt(date){
            return parseInt(date.split('-').join(''))
        },

        deselectNode(){
            this.$emit('deselect-node', this.node)
        },

        unpinNode(){
            this.$emit('unpin-node', this.node)
        },

        openMenu(event, relation){

            console.log(relation)
            event.preventDefault()

            this.relationMenuX = event.clientX + event.srcElement.offsetTop
            this.relationMenuY = event.clientY + event.srcElement.offsetLeft

            this.menu = true
            this.selectedRelation = relation
        }

    }
}
</script>

<style scoped>
.v-tabs-items{
    background-color: transparent !important; 
}

.relation_text{
    font-weight: 800;
    font-size: 12px;
}

#filterPanel.v-expansion-panel-content >>> .v-expansion-panel-content__wrap{
    padding: 12px;
    padding-top: 0px;

}
</style>

