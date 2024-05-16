<template>
    <v-container fluid class="py-12 overflow-y-auto" style="max-height: 100%;">
        <v-row no-gutters class="px-6 mb-4" style="z-index: 5;" justify="center">
            <v-text-field
                style="max-width: 900px;"
                v-model="searchText"
                prepend-inner-icon="mdi-magnify"
                clear-icon="mdi-close-circle"
                clearable
                label="Busqueda"
                solo
                type="text"
                hide-details

                class="rounded-pill"
                
                @click:prepend-inner="startSearch($route.query.uri)"
                @click:clear="clearSearch"
            />
        </v-row>

        <v-row no-gutters class="my-4 px-4  fill-height fill-width" v-if="readyState">
            
            <v-sheet elevation="2"  style="width: 100%;" class="mt-4">
            
                <v-container fluid>

                    <v-row class="my-2 px-4">
                        
                        <div>
                            <p class="text-h4 mb-0">{{entityData.label[0].label_value}}</p>
                            <v-row class="pa-4" align="center">
                                <p class="mb-0 overline text-none">{{getShortUrl(entityData.uri)}}</p>
                                <v-btn class="mx-2" icon x-small outlined @click="$CCopy(entityData.uri)">
                                    <v-icon size="12" color="black">mdi-content-copy</v-icon>
                                </v-btn>
                            </v-row>
                            
                        </div>
                            
                        <v-spacer></v-spacer>

                        <v-btn class="text-none" depressed plain :to="'/dossier?uri=' + entityData.uri" target="_blank">
                            Dossier
                            <v-icon class="ml-2">mdi-export</v-icon>
                        </v-btn>
                        
                    </v-row>

                    <v-row class="ma-0">
                        <p class="text-h5 pl-4 mt-4 mb-0">Literales</p>
                    </v-row>

                    <v-divider class="mx-4 mb-2"></v-divider>

                    <template v-if="Object.keys(entityData).includes('data_properties') && entityData.data_properties.length">

                        <v-expansion-panels tile class="mx-1" flat popout>
                            <v-expansion-panel v-for="(value, key) of entityData.data_properties" :key="'data_properties_' + key" style="border: solid 1px #ddd">
                                <v-expansion-panel-header class="pa-2 pl-4">
                                    <v-container class="pa-0">
                                        <v-row no-gutters class="caption">{{ getPropertyPredicateLabel(value['predicate'], OProperties) || getShortUrl(value['predicate'])}}</v-row>
                                        <v-row no-gutters class="text-h6">{{value.literal}}</v-row>
                                    </v-container>
                                </v-expansion-panel-header>

                                <v-expansion-panel-content>
                                    <v-divider></v-divider>
                                    <ontodata-struct-table class="px-2 my-2" :tabledata="{...value.provenance, ...value.specific_provenance}">
                                    </ontodata-struct-table>
                                </v-expansion-panel-content>
                            </v-expansion-panel>
                        </v-expansion-panels>

                        <v-row class="ma-0">
                            <p class="text-h5 pl-4 mt-8 mb-0">Relaciones</p>
                        </v-row>

                        <v-divider class="mx-4 mb-2"></v-divider>

                        <template v-for="(entity_provenance_group, link_type) of entityRelations_grouped">

                            <v-col cols="12"  :key="link_type + '_title'" class="text-h6 mt-2">
                                {{ getPropertyPredicateLabel(link_type, ORelations) || getShortUrl(link_type)}}
                            </v-col>

                            

                            <v-col v-for="(provenances, entity_uri) of entity_provenance_group" :key="link_type + '_' + entity_uri"
                                cols="12" xl="6" class="pa-2">
                                <onto-data-relationship-fragment
                                    :entityRelations="entityRelations"
                                    :provenances="provenances"
                                    v-on:entity-navigate="navigate"
                                    />
                            </v-col>
                        </template>

                    </template>


                </v-container>

            </v-sheet>

        </v-row>

        <v-row v-else no-gutters align="center" justify="center" class="fill-height">

                    <template v-if="errorState">
                        <v-row class="text-h2"> 404: Ningun resultado</v-row>
                    </template>
                    <template v-else>
                        <v-progress-circular indeterminate size="200" width="10"/>
                    </template>
                
    
        </v-row>

    </v-container>
</template>

<script>

import { getShortUrl, processUriAsID, getPropertyPredicateLabel } from '~/plugins/ontographFunctions'

export default {

    data: () => ({
        keysToShow: ['object_properties', 'inverse_properties'],

        readyState: false,
        errorState: false,

        entityData: undefined,
        entityProperties: undefined,

        entityRelations: {},
        entityRelations_grouped: {},

        searchText: undefined,



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
    },

    created (){
        this.searchText = this.$route.query.uri

    },

    mounted (){
        this.loadNodeInfo()
    },

    methods: {

        getShortUrl: getShortUrl,
        getPropertyPredicateLabel: getPropertyPredicateLabel,
        processUriAsID: processUriAsID,


        navigate(uri){
            this.searchText = uri;
            this.startSearch(uri)
        },

        clearSearch(){

        },

        startSearch(text){
            history.pushState(
                {},
                null,
                this.$route.path +
                '?' +
                encodeURIComponent('uri') + '=' + encodeURIComponent(text)
            )

            this.loadNodeInfo(text)
        },

        async loadNodeInfo(uri){
            //Hide all info while loading
            this.readyState = this.errorState = false;

            //Getting all main info of the node
            this.entityData = await this.$AngelusApi
                .get('/entities/by_id?entity_id=' + this.searchText)
                .catch(e => {
                        this.$toast(e.status)
                        this.errorState = true;
                        return null;
                })

            //Getting connected nodes to the original node
            let rel_results = await this.$AngelusApi
                .get('/entitites/connected_to?central_entity=' + this.searchText)
                .then(r => r.linked_entities)
                .catch(e => {
                    this.$toast(e.status)
                    this.errorState = true;
                    return null;
                })

            
            
            let relations_buffer = {}
            let relations_grouped_buffer = {}
            

            for(let relation of Object.values(rel_results)){

                //Make array with the unique id referencing the documental support [reification_uri]
                relations_buffer[relation.reification_uri] = relation

                //Grouping by type of relationship [link_type]
                //Making sure the grouping array contains the key of the type
                if(!(relation.link_type in relations_grouped_buffer))
                    relations_grouped_buffer[relation.link_type] = {}

                //Checking that the array containing all the relations of a specific type of entity exists
                if(!(relation.entity in relations_grouped_buffer[relation.link_type]))
                    relations_grouped_buffer[relation.link_type][relation.entity] = []

                //Adding relation(references by the ID - reification_uri) to the proper array
                relations_grouped_buffer[relation.link_type][relation.entity].push(relation.reification_uri)

                }

            // console.log(relationships_buffer)
            // console.log(relations_grouped_buffer)

            this.entityRelations = relations_buffer
            this.entityRelations_grouped = relations_grouped_buffer

            console.log(this.entityRelations, this.entityRelations_grouped)

            this.readyState = true;

        },
    }
};

</script>

<style scoped lang="scss">

</style>
