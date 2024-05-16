import Vue from 'vue'
import VModal from 'vue-js-modal'

Vue.use(VModal, {
  dynamic: true,
  dynamicDefaults: { clickToClose: true, adaptive: true, height:'auto'}
})
