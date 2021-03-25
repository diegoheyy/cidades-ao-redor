<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-title>Cidades ao redor</v-app-bar-title>
      <v-spacer></v-spacer>

      <v-btn @click="visitaPerfil()" href="https://github.com/diegoheyy" target="_blank" text>
        <span class="mr-2">Vem conhecer</span>
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
     visitaPerfil(){
       this.$ga.event({
        eventCategory: "Perfil",
        eventAction: "ação de link",
        eventLabel: "Botao de Gerar",
        eventValue: 1,
      });


     }

   }

};
</script>
