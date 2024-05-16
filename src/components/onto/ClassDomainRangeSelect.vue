<template>

    <v-container class="pa-0">
        <v-row no-gutters class="my-2">
            <v-menu offset-y >
                <template v-slot:activator="{ on, attrs }">
                    <v-sheet
                        hide-details
                        v-bind="attrs"
                        v-on="on"
                        style="width: 100%; height: 40px; border: solid #00000055 1px !important; border-radius: 4px;"
                        :color="selected_class_iri? '#FFF9C4': 'white' "
                        >
                        <v-row no-gutters class="pl-3 pr-2" align="center" style="height: 100%;">

                            <template v-if="selected_class_iri">
                                {{langLiteralParse(OClasses[selected_class_iri].label[0])}}
                            </template>
                            <v-row no-gutters v-else>
                                <span style="color: #000000AA">Clase</span>
                            </v-row>
                            <v-spacer/>

                            <v-btn v-if="selected_class_iri" @click.stop="selected_class_iri = null" text fab height="24" width="24">
                                <v-icon size="20">mdi-close</v-icon>
                            </v-btn>

                            <v-icon>mdi-chevron-down</v-icon>

                        </v-row>
                        
                    </v-sheet>
                </template>

                <v-list dense>
                    <template v-for="key of OParentClassesKeys">

                        <v-list-item :key="'item_' + key" @click="selected_class_iri = key" style="min-height: 24px;">
                            <v-list-item-title>{{langLiteralParse(OClasses[key].label[0])}}</v-list-item-title>
                        </v-list-item>

                        <template v-for="subitem of OClasses[key].subclasses">
                                    <v-list-item :key="'item_' + subitem"
                                        @click="selected_class_iri = subitem"
                                        style="min-height: 24px; border-left: solid grey 1px;"
                                        class="ml-4"
                                        >
                                        <v-list-item-title>{{langLiteralParse(OClasses[subitem].label[0])}}</v-list-item-title>
                                    </v-list-item>
                        </template>

                    </template>
                </v-list>
            </v-menu>
        </v-row>
        <v-row no-gutters class="my-2">

            <v-select
                v-model="selected_rays"
                :disabled="!selected_class_iri"
                :items="Object.keys(selectedClassPredicates)"
                item-color="primary"
                return-object
                outlined
                dense
                chips
                label="Predicados"
                multiple
                hide-details
                
            >
                <template #selection="{item}">
                    <v-chip text-color="white" color="primary" small>
                        {{getPropertyPredicateLabel(item, ORelations)}}
                    </v-chip>
                </template>

                <template  #item="{item}">
                    <v-col class="grow py-1 pr-2"> {{ getPropertyPredicateLabel(item, ORelations) }} </v-col>
                    <v-col class="shrink py-1 pl-2">
                        <v-avatar color="primary" class="white--text text-caption" small size="22">{{selectedClassPredicates[item]}}</v-avatar>
                    </v-col>
                </template>

            </v-select>

        </v-row>

    </v-container>



</template>

<script>

import { getShortUrl, processUriAsID, getPropertyPredicateLabel, langLiteralParse, uriToLink } from '~/plugins/ontographFunctions'


export default {

    props: {
        link_count: {
            type: Object,
            default: _ => {}
        },
    },

    data: () => ({
        selected_class_iri: null,
        selected_rays: [],
    }),

    computed: {
        ORelations () {
            return this.$store.state.ontograph.ORelations
        },
        OClasses () {
            return this.$store.state.ontograph.OClasses
        },
        OParentClassesKeys (){
            return this.$store.state.ontograph.OParentClassesKeys
        },

        selectedClassPredicates(){

            let active_existing_predicates = {}

            //Getting the correct count for the class type
            if(this.selected_class_iri in this.link_count)
                for(let [key, predicate] of Object.entries(this.link_count[this.selected_class_iri]))
                    active_existing_predicates[key] = predicate

            //IF THE CLASS IS A PARENT CLASS, WE NEED TO GO THROUGH ALL ITS SUBCLASSES
            if(this.OParentClassesKeys.includes(this.selected_class_iri))
                for(let child_class of this.OClasses[this.selected_class_iri].subclasses)
                    //Check for each subclass if it exists in the counts
                    if(child_class in this.link_count)
                        for(let [key, predicate] of Object.entries(this.link_count[child_class])){

                            //If the predicate already exists, we need only to sum to the total
                            if(key in active_existing_predicates)
                                active_existing_predicates[key] += predicate
                            
                            //If it didn't exists before, we add it to the predicates to show
                            else
                                active_existing_predicates[key] = predicate

                        }
                        

            return active_existing_predicates


        },

        selected_rays_verbose(){
            return this.selected_rays.map(d => getPropertyPredicateLabel( d, this.ORelations)).join(', ')
        }
    },

    watch: {
        selected_rays (val) {
            this.$emit('ray-array-selected', this.selected_rays)
        },
    },

    methods: {

        getShortUrl: getShortUrl,
        processUriAsID: processUriAsID,
        getPropertyPredicateLabel: getPropertyPredicateLabel,
        langLiteralParse: langLiteralParse,
        uriToLink: uriToLink,


    }
}
</script>
