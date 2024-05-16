import Vue from 'vue'
import axios from 'axios'

const api_axios = axios.create()

api_axios.defaults.baseURL = process.env.VUE_APP_API_ACCESS

import UpdateToken from '@/plugins/keycloakUpdateToken'

if(process.env.VUE_APP_KEYCLOAK_ACCESS === 'TRUE'){
  // Request interceptor
  api_axios.interceptors.request.use(async request => {
    let token = await UpdateToken()
    request.headers.common['Authorization'] = `Bearer ${token}`;
    return request;
  });
}





api_axios.interceptors.response.use(
  response => ("data" in response)? response.data: response,
  error => {
    console.log(error)
    return Promise.reject(error);
  });


Vue.prototype.$AngelusApi = api_axios;

