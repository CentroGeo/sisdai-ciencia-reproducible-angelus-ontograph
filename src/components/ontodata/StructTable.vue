
<template>
        <div class="d-flex flex-wrap">
            <div class="flex-grow-1">
                <v-card elevation="0">
                        <v-card-title class="d-flex justify-space-between">
                            <div>
                                <span class="text-subtitle-1 font-weight-bold">REGISTRO: </span>
                                <span v-if="tabledata.annotation_date !== null" class="body-2">{{tabledata.annotation_date}}</span>
                                <span v-else>-</span>
                            </div>
                            <p :class="cleanConfianza()">
                                <span class="text-subtitle-2 font-weight-bold">Confianza: &nbsp</span>
                                <span v-if="tabledata.confianza !== null" class="body-2">{{cleanConfianza()}}</span>
                                <span v-else>-</span>
                            </p>
                        </v-card-title> 
                        <section class="tabledata">
                            <h3 class="v-list-item__subtitle font-weight-thin">Método</h3>
                            <p v-if="tabledata.metodo_inferencia !== null" class="v-list-item__title">{{cleanMetodo()}}</p>
                            <p v-else>-</p>
                        </section>
                        <section class="tabledata">
                            <h3 class="v-list-item__subtitle font-weight-thin">Observaciones</h3>
                            <p v-if="tabledata.observaciones !== null" class="v-list-item__title">{{tabledata.observaciones}}</p>
                            <p v-else>-</p>
                        </section>
                        <section class="tabledata">
                            <h3 class="v-list-item__subtitle font-weight-thin">Documento</h3>
                            <div v-if="tabledata.soporte_documental !== null">
                                <p>
                                    <span class="caption font-weight-bold">{{cleanDocumento()}} </span>
                                    <v-btn icon x-small class="icons" @click="$CCopy(cleanDocumento())"><v-icon dense>mdi-content-copy</v-icon></v-btn>
                                    <!-- <a class="icons" target="_blank" :href="cleanDocumento()"><v-icon dense>mdi-open-in-new</v-icon></a> -->
                                </p>
                            </div>
                            <p v-else>-</p>
                        </section>
                        
                </v-card>
                
            </div>

            <div class="timeline py-0 flex-shrink-0 justify-center">
                <v-timeline class="v-timeline" dense>
                    <v-timeline-item fill-dot small color="amber lighten-2">
                        <v-row no-gutters>
                            <v-col><div class="caption font-weight-bold">Fecha de inicio</div></v-col>
                        </v-row>
                        <v-row no-gutters>
                            <v-col><div class="caption font-weight-light">Cota inferior</div></v-col>
                        </v-row>
                        <v-row no-gutters>
                            <v-col>
                                <div class="body-2" v-if="tabledata.validity_period !== null && startDateLowerBound() !== null">{{startDateLowerBound()}}</div>
                                <div class="body-2" v-else>-</div>
                            </v-col>
                        </v-row>
                    </v-timeline-item>
                    <v-timeline-item fill-dot small color="amber lighten-4">
                         <v-row no-gutters>
                            <v-col><div class="caption font-weight-bold">Fecha de inicio</div></v-col>
                        </v-row>
                        <v-row no-gutters>
                            <v-col><div class="caption font-weight-light">Cota superior</div></v-col>
                        </v-row>
                        <v-row no-gutters>
                            <v-col>
                                <div class="body-2" v-if="tabledata.validity_period !== null && startDateUpperBound() !== null">{{startDateUpperBound()}}</div>
                                <div class="body-2" v-else>-</div>
                            </v-col>
                        </v-row>
                    </v-timeline-item>
                    <v-timeline-item fill-dot small color="amber lighten-4">
                         <v-row no-gutters>
                            <v-col><div class="caption font-weight-bold">Fecha de término</div></v-col>
                        </v-row>
                        <v-row no-gutters>
                            <v-col><div class="caption font-weight-light">Cota inferior</div></v-col>
                        </v-row>
                        <v-row no-gutters>
                            <v-col>
                                <div class="body-2" v-if="tabledata.validity_period !== null && endDateLowerBound() !== null">{{endDateLowerBound()}}</div>
                                <div class="body-2" v-else>-</div>
                            </v-col>
                        </v-row>
                    </v-timeline-item>

                    <v-timeline-item class="last-timeline-child" fill-dot small color="amber lighten-2">
                        <v-row no-gutters>
                            <v-col><div class="caption font-weight-bold">Fecha de término</div></v-col>
                        </v-row>
                        <v-row no-gutters>
                            <v-col><div class="caption font-weight-light">Cota superior</div></v-col>
                        </v-row>
                        <v-row no-gutters>
                            <v-col>
                                <div class="body-2" v-if="tabledata.validity_period !== null && endDateUpperBound() !== null">{{endDateUpperBound()}}</div>
                                <div class="body-2" v-else>-</div>
                            </v-col>
                        </v-row>
                    </v-timeline-item>
                </v-timeline>
            </div>
        </div>
</template>

<script>

export default {

    props: {
        tabledata: {
            type: Object,
            default: {}
        }
        
    },

    data: () => ({

        provenance_table_struct: [
            {
                title: 'Observaciones',
                key_name: 'observaciones',
            },
            {
                title: 'Confianza',
                key_name: 'confianza',
            },
            {
                title: 'Metodo',
                key_name: 'metodo_inferencia',
            },
            {
                title: 'Periodo',
                key_name: 'validity_period',
            },
            {
                title: 'Documento',
                key_name: 'soporte_documental',
            },
            // {
            //     title: 'Poligono',
            //     key_name: 'polygon',
            // },
            {
                title: 'Registro',
                key_name: 'annotation_date',
            },
        ],
    }),

    methods: {
        cleanConfianza(){
            if (this.tabledata.confianza !== null){
                let confianza = this.tabledata.confianza.split('/')
                return confianza[confianza.length -1].replace('>', '').toLowerCase()
            } else {
                return 'nocolor'
            }
        },

        cleanMetodo(){
            let metodo = this.tabledata.metodo_inferencia.split('/')
            return metodo[metodo.length -1].replace('>','')
        },

        cleanDocumento(){
            let documento = this.tabledata.soporte_documental.split('')
            documento.pop()
            documento.shift()
            let link = documento.join('')
            return link
        },

        startDateLowerBound(){
            let allDates = Object.values(this.tabledata.validity_period)
            let startDateLB = allDates[0]
            return startDateLB
        },

        startDateUpperBound(){
            let allDates = Object.values(this.tabledata.validity_period)
            let startDateUB = allDates[1]
            return startDateUB
        },

         endDateLowerBound(){
            let allDates = Object.values(this.tabledata.validity_period)
            let endDateLB = allDates[2]
            return endDateLB
        },

         endDateUpperBound(){
            let allDates = Object.values(this.tabledata.validity_period)
            let endDateUB = allDates[3]
            return endDateUB
        },


    }
}

</script>

<style scoped lang="scss">
    .v-btn__content {
        text-transform: unset !important;
    }

    .timeline {
        width: 200px;
    }

    .v-timeline {
        padding-top: 10px;
    }

    .last-timeline-child{
        padding-bottom: 10px;
    }

    .tabledata {
        padding: 5px 16px;
    }

    .icons {
        text-decoration: none;
        padding-left: 3px;
    }

    .positiva {
        background-color: #429488;
        color: white;
        padding: 0 10px 2px 10px;
        border-radius: 20px;
        margin-bottom: 0;
    }

    .negativa {
        background-color: #29246B;
        color: white;
        padding: 0 10px 2px 10px;
        border-radius: 20px;
        margin-bottom: 0;
    }

    .neutra {
        background-color: #3F7A9D;
        color: white;
        padding: 0 10px 2px 10px;
        border-radius: 20px;
        margin-bottom: 0;
    }

    .nocolor {
        background-color: rgb(229, 228, 228);
        padding: 0 10px 2px 10px;
        border-radius: 20px;
        margin-bottom: 0;
    }

</style>
