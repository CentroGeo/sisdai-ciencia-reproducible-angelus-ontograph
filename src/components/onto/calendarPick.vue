<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        v-model="date"
        :label="hint"
        outlined dense
        class="mt-2"
        append-icon="mdi-calendar"
        readonly
        v-bind="attrs"
        v-on="on"
        hide-details
        background-color="#FFFB"
      ></v-text-field>
    </template>

    <v-date-picker
      ref="picker"
      v-model="date"
      no-title
      :max="new Date().toISOString().substr(0, 10)"
      min="1810-01-01"
      @change="save"
      locale="es-MX"
    ></v-date-picker>
  </v-menu>
</template>

<script>
  export default {
    props: {
        hint: {
          type: String,
          default: "Fecha"
        },
        value: {
          type: String,
          default: "01-01-1975"
        }
    },
    data: () => ({
      date: null,
      menu: false,
    }),
    watch: {
      menu (val) {
        val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
      },
    },
    methods: {
      save (date) {
        this.$refs.menu.save(date)

        this.$emit('input', date)
      },
    },
  }
</script>
