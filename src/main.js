import Vue from 'vue';

import '~/plugins'
import '~/components'

import App from './App.vue'
import store from '~/store'
import router from '~/router'
import i18n from '~/plugins/i18n'

import '@mdi/font/css/materialdesignicons.css'

import vuetify from '~/plugins/vuetify'
import '~/plugins/vuejs-modal'

Vue.config.productionTip = false

import '~/directives/LanguageDirective'
import '~/plugins/system_functions'
import '~/plugins/axios'
import '~/plugins/keycloak';
import UpdateToken from '~/plugins/keycloakUpdateToken'

const needs_authentication = (process.env.VUE_APP_KEYCLOAK_ACCESS === 'TRUE')

let boot = function (){
  new Vue({
    i18n,
    store,
    router,
    vuetify,
    ...App
  })

  if(needs_authentication){
    window.onfocus = () => {
      UpdateToken();
    };
  }

}

// Initializing the app depending if it needs authentication (Env variable)
if(needs_authentication)
  Vue.$keycloak
    .init({ onLoad: 'login-required', })
    .then((authenticated) => boot);
else
  boot()



