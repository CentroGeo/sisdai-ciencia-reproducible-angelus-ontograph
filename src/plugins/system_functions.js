import Vue from 'vue'

const mixin = {
  data: function () {
    return {
      // message: 'hello',
      // foo: 'abc'
    }
  },
  methods: {
    $UpdateToken: async function () {
      await Vue.$keycloak.updateToken(900);
      return Vue.$keycloak.token;
    },
    $SystemNotify: function (success  = 'Empty notification') {
      this.$toast.success(success)
    },
    $CCopy: async function (text = "", success  = 'Texto copiado exitosamente') {

      let textToCopy = text;

      let myTemporaryInputElement = document.createElement("input");
      myTemporaryInputElement.type = "text";
      myTemporaryInputElement.value = textToCopy;
  
      document.body.appendChild(myTemporaryInputElement);
  
      myTemporaryInputElement.select();
      document.execCommand("Copy");
  
      document.body.removeChild(myTemporaryInputElement);
      this.$SystemNotify(success)
    },
  }
}

Vue.mixin(mixin)

