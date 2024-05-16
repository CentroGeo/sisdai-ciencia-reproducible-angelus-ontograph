import Vue from "vue";

/**    Toastification      **/
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

const options = {
    position: "bottom-right",
    showCloseButtonOnHover: true,
    hideProgressBar: true
};

Vue.use(Toast, options);



/**    Lodash      **/
import VueLodash from 'vue-lodash'
import lodash from 'lodash'

Vue.use(VueLodash, { name: 'custom', lodash: lodash })


/**    Tooltip      **/
import VTooltip from 'v-tooltip'
Vue.use(VTooltip, {defaultDelay: 2800})