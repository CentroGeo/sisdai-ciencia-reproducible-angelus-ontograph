<template>
    <v-card>
        <v-card-title>Agregar texto al lienzo</v-card-title>
        <v-card-text>
            <v-container>
                    <v-text-field v-model="field_title" label="Title"/>
                    <v-text-field v-model="field_description" label="Description"/>
            </v-container>
            <v-card-actions>
                <v-btn @click="closeModal">Aplicar</v-btn>
            </v-card-actions>
        </v-card-text>

    </v-card>
</template>

<script>
export default {

    data: () => ({
        field_title: null,
        field_description: null,
    }),

    props: {
        title: {
            type: String,
            default: null
        },
        description: {
            type: String,
            default: null
        },
        applyCanvasText: {
            type: Function,
            default: null
        }  
    },

    mounted(){
        this.field_title = this.title
        this.field_description = this.description
    },

    methods:{
        closeModal(){
            this.applyCanvasText({title: this.field_title, description: this.field_description})
            this.$emit('close')
        }
    }

}

</script>