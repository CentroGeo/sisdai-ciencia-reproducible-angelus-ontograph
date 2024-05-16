<template>
    <v-container class="pa-0" >
        <v-list-item class="px-1">


            <v-list-item-avatar class="mx-0">
                <v-icon size="20" v-if="!relationObjectRole_isSubject">mdi-account-arrow-right</v-icon>
                <v-icon size="20" v-else>mdi-account-arrow-left</v-icon>
            </v-list-item-avatar>

            
            <v-list-item-content class="text-caption mr-2">{{relationObjectLabel}}</v-list-item-content>

            <!-- This code below is to show the documents right here as a sub-list -->
            <!-- <v-list-item-avatar class="mr-1" style="width:30px; min-width: 30px;">
                <v-btn height="24" width="24" elevation="2" fab @click="showingDocuments = !showingDocuments">
                    <v-icon size="14" color="#444">mdi-file-document-multiple-outline</v-icon>
                </v-btn>
            </v-list-item-avatar> -->

            <v-list-item-avatar class="mr-1" style="width:30px; min-width: 30px;">
                <v-btn height="24" width="24" elevation="2" fab @click="openRelationLink">
                    <v-icon size="14" color="#444">mdi-share</v-icon>
                </v-btn>
            </v-list-item-avatar>

            <v-list-item-avatar class="mr-1 ml-0" style="width:30px; min-width: 30px;">
                <v-btn height="24" width="24" elevation="2" fab @click="addRelationship">
                    <v-icon size="14" color="#444">mdi-plus</v-icon>
                </v-btn>
            </v-list-item-avatar>

        </v-list-item>


        <v-expand-transition>
            <v-sheet color="#555" v-if="showingDocuments" >
                <v-list class="pa-0 ma-1"
                        dense outlined>
                    <v-list-item 
                        style="max-height: 40px;"
                        class="px-2" 
                        v-for="doc of relationDocuments"
                        :key="doc">

                        <v-list-item-content class="text-caption">
                            {{ getShortUrl( entityRelations[doc].provenance.soporte_documental ) }}
                        </v-list-item-content>



                        <v-menu open-on-hover top offset-y>
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon
                                v-bind="attrs"
                                v-on="on"
                                size="24"
                                >
                                mdi-information-variant
                                </v-icon>
                            </template>

                            <v-list dense>
                                <v-list-item>
                                    <v-list-item-avatar class="mr-1" style="width:30px; min-width: 30px;">
                                        <onto-rate-of-trust-svg 
                                            :size="24" 
                                            :confianza=" getShortUrl(entityRelations[doc].relation_properties.confianza)"/>
                                    </v-list-item-avatar>
                                    <v-list-item-title>{{  getShortUrl(entityRelations[doc].relation_properties.confianza) }}</v-list-item-title>
                                </v-list-item>

                                <!-- <v-list-item>
                                    <v-list-item-avatar class="mx-0" style="width:30px; min-width: 30px;">
                                        <v-icon>mdi-calendar-edit</v-icon>
                                    </v-list-item-avatar>
                                    <v-list-item-title>{{  entityRelations[doc].provenance.annotation_date || 'N/A'  }}</v-list-item-title>
                                </v-list-item> -->

                                <v-list-item>
                                    <v-list-item-avatar class="mr-1 ml-0" style="width:30px; min-width: 30px;">
                                        <v-icon>mdi-calendar-clock</v-icon>
                                    </v-list-item-avatar>
                                    <v-list-item-title>{{  entityRelations[doc].relation_properties.validity_period }}</v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>

                        

                    </v-list-item>
                </v-list>
            </v-sheet>
        </v-expand-transition>



    </v-container>
</template>

<script>

import { getShortUrl, processUriAsID, getPropertyPredicateLabel, langLiteralParse } from '~/plugins/ontographFunctions'

export default {

    props: {
        entityRelations: {
            type: Array,
            default: null
        }
    },

    data: () => ({
        showingDocuments: false
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
        relationObject (){
            return this.entityRelations[0]
        },
        relationObjectLabel(){
            return this.relationObject.labels[0].label_value
        },
        relationObjectRole_isSubject(){
            return this.relationObject.central_entity_role.includes('subject')
        }


    },

    methods: {
        getPropertyPredicateLabel: getPropertyPredicateLabel,
        getShortUrl: getShortUrl,

        openRelationLink(){
            window.open( '/i?uri=' + this.relationObject.entity, '_blank');
        },

        addRelationship(){
            this.$emit("add-relation", this.relationObject)
        }

    }





};

</script>
