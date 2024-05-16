<template>
    <div>
        <v-menu offset-y >
            <template v-slot:activator="{ on, attrs }">
                <v-sheet
                    hide-details
                    v-bind="attrs"
                    v-on="on"
                    style="height: 40px; border: solid #00000055 1px !important; border-radius: 4px;"
                    :color="selectedClassIri? '#FFF9C4': 'white' "
                >
                    <v-row no-gutters class="pl-3 pr-2" align="center" style="height: 100%;">

                        <template v-if="selectedClassIri !== null">
                            {{langLiteralParse(OClasses[selectedClassIri].label[0])}}
                        </template>
                        <v-row no-gutters v-else>
                            <span style="color: #000000AA">Clase</span>
                        </v-row>
                        <v-spacer/>

                        <v-btn v-if="selectedClassIri" @click.stop="selectIri(null)" text fab height="24" width="24">
                            <v-icon size="20">mdi-close</v-icon>
                        </v-btn>

                        <v-icon>mdi-chevron-down</v-icon>

                    </v-row>
                    
                </v-sheet>
            </template>

            <v-list dense>
                <template v-for="key of OParentClassesKeys">
                    <v-list-item :key="'item_' + key" @click="selectIri(key)" style="min-height: 24px;">
                        <v-list-item-title>{{langLiteralParse(OClasses[key].label[0])}}</v-list-item-title>
                    </v-list-item>

                    <template v-for="subitem of OClasses[key].subclasses">
                                <v-list-item :key="'item_' + subitem"
                                    @click="selectIri(subitem)"
                                    style="min-height: 24px; border-left: solid grey 1px;"
                                    class="ml-4"
                                    >
                                    <v-list-item-title>{{langLiteralParse(OClasses[subitem].label[0])}}</v-list-item-title>
                                </v-list-item>
                    </template>

                </template>
            </v-list>
        </v-menu>
    </div>
</template>

<script>
import { getShortUrl, processUriAsID, getPropertyPredicateLabel, langLiteralParse } from '~/plugins/ontographFunctions'

export default {
    props: {
        selectedClassIri: {
            type: String,
            default: null
        },
    },

    computed: {
        OClasses () {
            return this.$store.state.ontograph.OClasses
        },
        OParentClassesKeys (){
            return this.$store.state.ontograph.OParentClassesKeys
        },
    },
    methods: {
        langLiteralParse: langLiteralParse,
        selectIri(iri){
            this.$emit('selectClass', iri)
        }
    },
    mounted(){
        console.log(this.OClasses)
    }
}
</script>