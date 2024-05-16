<template>
    <v-sheet class="pa-2" width="350" color="#00000099" elevation="8" style="display: flex; flex-direction: column; height: 100vh;">

        <v-row class="flex-shrink-1 flex-grow-0 align-center text-h5 ma-1 white--text mr-0">
            <v-img
                alt="Conacyt Logo"
                class="shrink mr-2"
                contain
                src="conacyt.png"
                transition="scale-transition"
                width="40"
            />

            <v-img
                alt="CNB Logo"
                class="shrink mr-2"
                contain
                src="logo-bn.png"
                transition="scale-transition"
                width="100"
            />
        
            <div>
                <div class="d-none d-md-flex text-body-2">Angelus</div>
                <div class="d-none d-md-flex text-body-2">Visualizador</div>
            </div>
    

            <v-spacer/>
            
            <v-btn class="flex-shrink-1" fab x-small elevation="2" @click="searchfilter_widget = !searchfilter_widget">
                <v-icon>mdi-filter</v-icon>
            </v-btn>
        </v-row>

        <v-divider class="flex-shrink-1 flex-grow-0 mb-1"></v-divider>

        <v-sheet color="white" elevation="2" class="px-1 py-2 flex-shrink-1">

            <onto-class-select 
                class="flex-shrink-1 flex-grow-0 my-1"
                :selectedClassIri="nodeFilterType" 
                v-on:selectClass="d => nodeFilterType = d"
                />

            <v-slide-y-transition>
            <v-sheet color="#DDDDDD" class="py-1 px-1" v-if="searchfilter_widget">

                <onto-calendar-pick 
                    hint="Cota superior"
                    v-model="nodeFilterdate_upper_high"
                    />

                <!-- <onto-calendar-pick 
                    hint="Cota superior"
                    v-model="nodeFilterdate_upper_low"
                    /> -->

                <!-- <onto-calendar-pick 
                    hint="Cota inferior"
                    v-model="nodeFilterdate_lower_high"
                    /> -->

                <onto-calendar-pick 
                    hint="Cota inferior"
                    v-model="nodeFilterdate_lower_low"
                    />

                <v-text-field
                    class="my-2"
                    outlined dense
                    hide-details
                    background-color="white"
                    label="Buscar"
                    append-icon="mdi-magnify"
                    v-model="nodeFilterString"
                ></v-text-field>

                <v-btn block @click="triggerSearch">
                    Buscar
                </v-btn>

            </v-sheet>
            </v-slide-y-transition>

        </v-sheet>

        <v-sheet v-if="allEntities !== null" no-gutters color="transparent" class="px-0 my-2 flex-grow-1 overflow-y-auto">

            <v-row class="flex-shrink-1 flex-grow-0" no-gutters>
                <v-text-field
                    class="mt-2 mx-1 mb-2"
                    solo dense
                    color="white"
                    hide-details
                    label="Filtro"
                    append-icon="mdi-magnify"
                    v-model="nodeQuickFilterString"
                ></v-text-field>
            </v-row>

            <template v-for="(entity, key) of filteredEntities">
                <drag  :key="key" style="width:100%; overflow-y: auto;" :data="{ node: entity }">
                    <v-card tile class="entity_drag_item ma-1">
                        <v-card-subtitle class="pa-2 noselect" style="font-size: 10px; font-weight: 600;">{{ getShortUrl(entity.entity) }}</v-card-subtitle>
                        <v-divider></v-divider>
                        <v-card-text class="pa-2 pt-2 noselect" style="font-size: 16px; word-wrap: initial;">{{entity.labels[0].label_value}}</v-card-text>
                    </v-card>
                </drag>
            </template>

        </v-sheet>

    </v-sheet>
</template>

<script>

import { Drag } from "vue-easy-dnd";
import { getShortUrl } from '~/plugins/ontographFunctions'

export default {
    components: { Drag },


    data: () => ({
        allEntities: null,

        nodeQuickFilterString: '',

        // Node - type:main tab-properties
        nodeFilterString: '',
        nodeFilterdate_upper_high: undefined,
        nodeFilterdate_upper_low: undefined,
        nodeFilterdate_lower_high: undefined,
        nodeFilterdate_lower_low: undefined,
        nodeFilterType: undefined,

        searchfilter_widget: false,
    }),

    computed: {
        nodeQuickFilterString_clean: function (){
            return this.GetNormalizedCleanString(this.nodeQuickFilterString);
        },

        filteredEntities: function () {
            // On empty entities, empty set
            if (!this.allEntities.length)
                return {};

            // On empty search term, return all
            if (this.nodeQuickFilterString === '')
                return this.allEntities;

            // Else, return filtered entities
            return this.allEntities.filter( d => ( d.entity.includes(this.nodeQuickFilterString_clean) || this.GetNormalizedCleanString(d.labels[0]['label_value']).includes( this.nodeQuickFilterString_clean) ));

        }
    },

    watch: {
        nodeFilterType: function (val) {
            if(this.nodeFilterType)
                this.triggerSearch()
        },
    },



    methods: {
        getShortUrl: getShortUrl,

        async triggerSearch(){
            this.$AngelusApi
                .get('/entities/by_class_with_labels', 
                    { 
                        params: 
                        {
                            class_id : this.nodeFilterType, 
                            searchfilter_string: this.nodeFilterString, 
                            searchfilter_date_high: this.nodeFilterdate_upper_high,
                            searchfilter_date_low: this.nodeFilterdate_lower_low
                        }  
                    }
                )
                .then(r => {
                    this.allEntities = r.entities_with_labels
                })
                .catch(e => {
                    this.allEntities = {}
                    this.$toast.error("Error en la busqueda")
                })

        },

        GetNormalizedCleanString(input_string){
            return input_string.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
        }
    }
};

</script>

<style scoped>
    .entity_drag_item > .v-list-item{
        padding-left: 2px;
    }

    .v-list-item__subtitle{
        font-size: 10px !important;
    }

    .v-list-group--active .v-list-group__header{
         background-color:#6666FF33; 
    }

    .drag_icon div .v-avatar.v-list-item__avatar{
        margin-right: 2px !important;
    }
</style>