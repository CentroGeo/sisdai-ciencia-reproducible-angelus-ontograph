<template>
  <v-app>
    <v-main>
      <transition name="page" mode="out-in">
        <router-view name="main_router"/>
      </transition>
      <loading ref="loading"></loading>
    </v-main>

    <modals-container/>
    
  </v-app>
</template>

<script>
export default {
  el: '#app',
  middleware: ["auth"],
  
  metaInfo () {
    return {
      title: 'Ontograph',
      titleTemplate: `Ontograph`
    }
  },

  created(){
    this.$store.dispatch('ontograph/fetchOntology', this)
  },

  mounted () {
    this.$loading = this.$refs.loading
  },
}
</script>

<style lang="scss">
  @import "~/styles/main.scss";
</style>