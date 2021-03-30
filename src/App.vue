<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-title>Cidades ao redor</v-app-bar-title>
      <v-spacer></v-spacer>

      <v-btn @click="visitaPerfil()" href="https://github.com/diegoheyy/cidades-ao-redor" target="_blank" text>
        <span class="mr-2">Github</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <Main />
    </v-main>
  </v-app>
</template>

<script>
import Main from "./components/Main";

export default {
  name: "App",

  components: {
    Main,
  },

  data: () => ({
    //
  }),
  methods: {
    visitaPerfil() {
      this.$gtag.event("Botão - Ver Perfil", {
        event_category: "Perfil",
        event_label: "Ver perfil do Github",
        value: 1,
      });
    },
  },
};
</script>
