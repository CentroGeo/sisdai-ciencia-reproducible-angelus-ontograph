import Vue from 'vue';

export default async function () {
    await Vue.$keycloak.updateToken(900);
    return Vue.$keycloak.token;
}