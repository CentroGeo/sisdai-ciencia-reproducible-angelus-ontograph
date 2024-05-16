import 'vuetify/dist/vuetify.css'
import Vue from 'vue'
import Vuetify from 'vuetify'


Vue.use(Vuetify)

export default new Vuetify({
  icons: {
    iconfont: 'mdi', // default - only for display purposes
  },
  theme: {
    themes: {
      light: {
        primary: '#00506e',
        secondary: '#EB0046'
      }
    }
  }
})
