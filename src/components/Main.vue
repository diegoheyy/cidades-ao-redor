<template>
  <v-container>
    <row cols="12">
      <v-col class="mx-auto" mx="auto" md="4" sm="6">
        <v-autocomplete
          v-model="cidadeEscolhida"
          item-value="codigo_ibge"
          :items="cidades"
          item-text="nome"
          clearable
          label="Cidade centro"
        >
          <template v-slot:item="{ item }"> {{ item.nome }} - {{ findUF(item.codigo_uf).uf }} </template>
          <template v-slot:selection="{ item }"> {{ item.nome }} - {{ findUF(item.codigo_uf).uf }} </template>
        </v-autocomplete>
      </v-col>
      <v-col class="mx-auto" mx="auto" md="4" sm="6">
        <v-text-field class="centered-input" v-model="raio" type="number" suffix="Km" label="Raio" required></v-text-field>
      </v-col>
      <v-col class="text-center">
        <v-btn color="success" @click="calcularDistancia(parseInt(raio))">Gerar</v-btn>
      </v-col>
    </row>
    <row>
      <v-col>
        <v-data-table
          :items="mov"
          :headers="header"
          sort-by="distancia"
          :sort-desc="false"
          :search="search"
          :loading="loading"
          loading-text="Carregando... Um momento por favor."
        >
          <template v-slot:top>
            <v-text-field v-model="search" label="Procurar" class="mx-4"></v-text-field>
          </template>
        </v-data-table>
      </v-col>
    </row>
  </v-container>
</template>

<script>
import Cidades from "../data/cidades.json";
import UF from "../data/uf.json";
// import axios from "axios";

export default {
  name: "Main",
  data: () => ({
    search: "",
    loading: false,
    header: [
      { text: "Cidade", value: "cidade" },
      { text: "Distancia", value: "distancia" },
      { text: "UF", value: "uf" },
    ],
    mov: [],
    raio: 0,
    cidadeEscolhida: "",
    cidades: Cidades,
  }),
  methods: {
    // getTurma() {
    //       let id = this.$route.params.id;
    //       const url = `http://localhost:4000/turma/${id}`;
    //       axios.get(url).then((res) => {
    //         this.turma = res.data;
    //         console.log(this.turma);
    //         this.alunosTurma = this.turma.alunos;
    //         this.disciplinasTurma = this.turma.disciplinas;
    //       });
    //     },

    calcularDistancia(raio) {
      this.eventTracking();
      this.loading = true;
      this.mov = [];

      if (this.cidadeEscolhida === "") {
        this.loading = false;

        return;
      }

      for (var key in Cidades) {
        var obj = Cidades[key];

        var resultado = (this.getDistanceFromLatLonInKm(this.findCIDADE(this.cidadeEscolhida), obj) / 1000).toFixed(3);

        if (resultado < raio) {
          var rUF = this.findUF(obj.codigo_uf);

          this.mov.push({ cidade: obj.nome, distancia: resultado, uf: rUF.nome });
        }
      }
      this.loading = false;
    },

    getDistanceFromLatLonInKm(position1, position2) {
      var deg2rad = function(deg) {
          return deg * (Math.PI / 180);
        },
        R = 6371,
        dLat = deg2rad(position2.latitude - position1.latitude),
        dLng = deg2rad(position2.longitude - position1.longitude),
        a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(deg2rad(position1.latitude)) * Math.cos(deg2rad(position1.latitude)) * Math.sin(dLng / 2) * Math.sin(dLng / 2),
        c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return (R * c * 1000).toFixed();
    },

    findUF(id) {
      var teste = UF.findIndex((x) => x.codigo_uf === id);
      return UF[teste];
    },
    findCIDADE(ibge) {
      var teste = Cidades.findIndex((x) => x.codigo_ibge === ibge);
      return Cidades[teste];
    },
    eventTracking() {
     this.$gtag.event('Botão - Listar Cidades', {
        'event_category': 'cidades',
        'event_label': "Ver cidades ao redor",
        'value': 1
      })
    },
  },
};
</script>

<style></style>
