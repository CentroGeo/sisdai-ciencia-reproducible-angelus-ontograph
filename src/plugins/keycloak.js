import Vue from 'vue';
import Keycloak from 'keycloak-js';

const initOptions = {
    url: process.env.VUE_APP_KEYCLOAK_URL,
    realm: process.env.VUE_APP_KEYCLOAK_REALM,
    clientId: process.env.VUE_APP_KEYCLOAK_CLIENT_ID,
    redirect_uri: process.env.VUE_APP_KEYCLOAK_REDIRECT_URL
};

const _keycloak = Keycloak(initOptions);

const Plugin = {
    install: Vue => {
        Vue.$keycloak = _keycloak;
    },
};

Plugin.install = Vue => {
    Vue.$keycloak = _keycloak;
    Object.defineProperties(Vue.prototype, {
        $keycloak: {
            get() {
                return _keycloak;
            },
        },
    });
};

Vue.use(Plugin);

export default Plugin;