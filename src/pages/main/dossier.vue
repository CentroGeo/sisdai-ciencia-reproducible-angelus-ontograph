<template>
    <v-container fluid>
        <v-card height="calc(100vh - 24px)" class="pa-5">
            <v-row>   
                <template v-if="readyState">
                    <v-col cols="12" style="border: solid 1px #CCC; border-radius: 5px;">
                     
                        <div class="text-h4">Dossier de</div>
                        <div class="text-h4 font-weight-bold">{{entityData.label[0].label_value}}</div>
                        <v-btn class="pb-2 grey--text" style="text-transform: unset !important;" text @click="$CCopy(entityData.uri)">{{getShortUrl(entityData.uri)}}</v-btn>
                    
                    </v-col>

                    <v-col cols="12" v-if="dossierStatus == 'CREATED'" class="text-center">
                        <v-row>
                            <v-col cols="12" class="text-center mt-10">
                                <v-icon size="150" color="warning">mdi-file-clock</v-icon>
                            </v-col>
                            <v-col cols="12" class="text-center text-h4 mt-10">
                                Estamos trabajando...
                            </v-col>
                            <v-col cols="12" class="text-center text-h5">
                                Intenta nuevamente en unos minutos
                            </v-col>
                        </v-row>
                    </v-col>

                    <v-col cols="12" v-if="dossierStatus == 'COMPLETED'" class="text-center">
                        <v-row>
                            <v-col cols="12" class="text-center mt-10">
                                <v-icon size="150" color="success">mdi-file-check</v-icon>
                            </v-col>
                            <v-col cols="12" class="text-center text-h5">
                                <v-btn color="success" :href="dossierUrl" target="_blank" class="font-weight-black" x-large text style="text-decoration: underline;">
                                    Descargar archivo
                                </v-btn>
                            </v-col>
                            <v-col cols="12" class="text-center text-h4 mt-5">
                                El documento está listo
                            </v-col>
                        </v-row>
                    </v-col>
                </template>
                


            <template v-else>
                <v-row no-gutters>
                    <template v-if="errorState">
                        <v-row>
                            <v-col cols="12" class="text-center mt-10">
                                <v-icon size="150" color="secondary">mdi-file-remove</v-icon>
                            </v-col>
                            <v-col cols="12" class="text-center text-h4 my-10">
                                Ningún resultado para esta entidad
                            </v-col>
                        </v-row>
                    </template>
                    <template v-else style="align-self: center">
                        <v-progress-circular indeterminate size="200" width="10"/>
                    </template>
                </v-row>
            </template>



        <v-col cols="12">
            <v-sheet height="40"></v-sheet>
        </v-col>

        </v-row>
        </v-card>
    </v-container>
</template>

<script>

import { getShortUrl } from '~/plugins/ontographFunctions'


export default {

    data: () => ({
        readyState: false,
        errorState: false,

        entityData: undefined,
        dossierStatus: undefined,
        dossierUrl: undefined,

        entityUri: undefined,
    }),

    created () {
        this.entityUri = this.$route.query.uri
    },

    mounted () {
        this.loadNodeInfo()
    },

    methods: {

        getShortUrl: getShortUrl,

        async loadNodeInfo() {
            //Hide all info while loading
            this.readyState = this.errorState = false;

            //Getting all main info of the node
            this.entityData = await this.$AngelusApi
                .get('/entities/by_id?entity_id=' + this.entityUri)
                .catch(e => {
                        this.$toast(e.status)
                        this.errorState = true;
                        return null;
                })
            if (this.entityData) {
                await this.searchDossier()
            }

            this.readyState = true;

        },

        async searchDossier() {
            //Getting all main info of the node
            this.dossierResult = await this.$AngelusApi
                .get('/dossier/by_entity?entity_id=' + this.entityUri)
                .catch(e => {
                        this.$toast(e.status)
                        this.errorState = true;
                        return null;
                })
            console.log('Dossier result', this.dossierResult)
            this.setDossierStatus()
        },

        setDossierStatus() {
            switch(this.dossierResult.message) {
                case 'Se mando a crear el documento':
                    this.dossierStatus = 'CREATED'
                    break;
                case 'El documento esta completo':
                    this.dossierStatus = 'COMPLETED'
                    this.dossierUrl = this.dossierResult.url || null
                    break;
                default:
                    this.dossierStatus = 'ERROR'
                    break;
            }
        }
    }
};

</script>
