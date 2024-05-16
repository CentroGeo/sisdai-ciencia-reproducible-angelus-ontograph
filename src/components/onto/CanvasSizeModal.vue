<template>
  <v-container class="pa-0 ma-0">
      <v-row no-gutters class="px-4 mt-4 text-h6">Medidas del lienzo</v-row>
      <v-row no-gutters class="px-4 mt-4">
          <v-text-field dense outlined :label="canvas_height + ''" type="number" suffix="px de alto" v-model="current_height" hide-details/>
      </v-row>
      <v-row no-gutters class="px-4 mt-4">
          <v-text-field dense outlined :label="canvas_width + ''" type="number" suffix="px de ancho" v-model="current_width" hide-details/>
      </v-row>
      <v-row no-gutters class="px-0 mt-4">
        <v-col cols=6>
          <v-btn block text class="flex-grow" @click="$emit('close')">
              <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="6">
          <v-btn block text class="flex-grow" @click="closeModal">
              <v-icon>mdi-check</v-icon>
          </v-btn>
        </v-col>
        
      </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'CanvasSizeModal',

  props: {
    canvas_height: {
      type: Number,
      default: -1
    },
    canvas_width: {
      type: Number,
      default: -1
    },
    saveCanvasSize: {
      type: Function,
      default: null
    }  
  },
  
  data: () => ({
    current_height: null,
    current_width: null
  }),

  created(){

  },


  methods:{
    closeModal(){
      this.saveCanvasSize({height: this.current_height, width: this.current_width})
      this.$emit('close')
    }
  }

}
</script>