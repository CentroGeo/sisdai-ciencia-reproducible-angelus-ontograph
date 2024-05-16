<template>
    <v-sheet outlined height="100%" class="pa-4">
        <v-row no-gutters>
            <v-col cols="6">
                <v-row no-gutters class="font-weight-bold">
                    <span>
                        <v-icon size="20" v-if="!relationObjectRole_isSubject">mdi-account-arrow-right</v-icon>
                        <v-icon size="20" v-else>mdi-account-arrow-left</v-icon>

                        {{entityRelation.labels[0].label_value}}
                    </span>


                </v-row>
                <v-row no-gutters class="text-caption" >
                    <v-btn text x-small style="text-transform: unset !important; font-weight: bold; max-width: 100%;"
                            class="px-1 grey--text"
                    @click="entityNavigate(entityRelation.entity)">
                        {{getShortUrl ( entityRelation.entity) }}
                    </v-btn>
                    
                </v-row>
            </v-col>
            <v-col cols="6">
                <v-expansion-panels v-model="panel" multiple>
                    <v-expansion-panel v-for="prov of provenances" :key="prov">
                        <v-expansion-panel-header class="pa-2">
                            <v-row align="center" no-gutters>
                                <v-btn target="_blank" :href="uriToLink( entityRelations[prov].provenance.soporte_documental)" class="mr-1" fab text small>
                                    <v-icon>mdi-file-document-outline</v-icon>
                                </v-btn>
                                {{getShortUrl(entityRelations[prov].provenance.soporte_documental)}}
                            </v-row>
                            
                        </v-expansion-panel-header>

                        <v-expansion-panel-content>
                            <v-list dense class="py-0">

                                <v-list-item @click="$CCopy(prov)">
                                    <v-list-item-icon>
                                        <v-icon>mdi-identifier</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-title>
                                        {{getShortUrl(prov)}}
                                    </v-list-item-title>
                                </v-list-item>

                                <v-list-item v-if="entityRelations[prov].relation_properties.observaciones">
                                    <v-list-item-icon>
                                        <v-icon>mdi-comment-alert-outline</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-title>
                                        {{entityRelations[prov].relation_properties.observaciones}}
                                    </v-list-item-title>
                                </v-list-item>

                                <v-list-item>
                                    <v-list-item-icon>
                                        <v-icon>mdi-timeline-clock-outline</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-title v-if="entityRelations[prov].provenance.annotation_date">
                                        {{entityRelations[prov].provenance.annotation_date}}
                                    </v-list-item-title>
                                    <v-list-item-title v-else>
                                        No disponible
                                    </v-list-item-title>
                                </v-list-item>

                                

                                <v-list-item>
                                    <v-list-item-icon>
                                        <onto-rate-of-trust-svg :size="24" :confianza=" getShortUrl(entityRelations[prov].relation_properties.confianza)"></onto-rate-of-trust-svg>
                                    </v-list-item-icon>
                                    <v-list-item-title>
                                        {{getShortUrl( entityRelations[prov].relation_properties.confianza )}}
                                    </v-list-item-title>
                                </v-list-item>

                                <v-list-item v-if="entityRelations[prov].relation_properties.metodo_inferencia">
                                    <v-list-item-icon>
                                        <v-icon>mdi-file-eye</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-title>
                                        {{'Inferencia: ' + getShortUrl( entityRelations[prov].relation_properties.metodo_inferencia) }}
                                    </v-list-item-title>
                                </v-list-item>

                                <v-list-item v-if="entityRelations[prov].relation_properties.validity_period">
                                    <v-list-item-icon>
                                        <v-icon>mdi-timer-sand</v-icon>
                                    </v-list-item-icon>
                                    
                                    <v-list-item-title>
                                        {{'Periodo: ' +  JSON.stringify(entityRelations[prov].relation_properties.validity_period)}}
                                    </v-list-item-title>
                                </v-list-item>
                            </v-list>

                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-col>
        </v-row>
    </v-sheet>
</template>

<script>

import { getShortUrl, processUriAsID, getPropertyPredicateLabel, langLiteralParse, uriToLink } from '~/plugins/ontographFunctions'


export default {

    props: {
        provenances: {
            type: Array,
            default: _=> []
        },
        entityRelations: {
            type: Object,
            default: _ => {}
        },

    },

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

        entityRelation (){
            if(this.provenances.length && this.provenances[0] in this.entityRelations)
                return this.entityRelations[this.provenances[0]]
            else    
                return {}
        },

        relationObjectRole_isSubject(){
            return this.entityRelation.central_entity_role.includes('subject')
        }

    },

    data: () => ({
        panel: [],
    }),

    methods:{
        getShortUrl: getShortUrl,
        uriToLink: uriToLink,

        entityNavigate(uri){
            this.$emit("entity-navigate", uri)
        },
    }
}

</script>

<style scoped>

    .v-list-item{
        padding-left: 0;
    }

</style>