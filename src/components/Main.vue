<template>
  <v-container>
    <v-form @submit.prevent="calcularDistancia(parseInt(raio))">
      <row cols="12">
        <v-col class="mx-auto" mx="auto" md="4" sm="6">
          <v-autocomplete
            v-model="cidadeEscolhida"
            item-value="codigo_ibge"
            :items="cidades"
            item-text="nome"
            clearable
            label="Cidade centro"
            :filter="filterItems"
            required
            no-data-text="Cidade não encontrada"
          >
            <template v-slot:item="{ item }">
              {{ item.nome }} - {{ findUF(item.codigo_uf).uf }}
            </template>
            <template v-slot:selection="{ item }">
              {{ item.nome }} - {{ findUF(item.codigo_uf).uf }}
            </template>
          </v-autocomplete>
        </v-col>
        <v-col class="mx-auto" mx="auto" md="4" sm="6">
          <v-text-field
            class="centered-input"
            v-model="raio"
            type="number"
            suffix="Km"
            label="Raio"
            required
          ></v-text-field>
        </v-col>

        <v-col class="text-center">
          <v-btn type="submit" color="success">Gerar</v-btn>
        </v-col>
      </row>
    </v-form>

    <row>
      <v-col>
        <v-data-table
          :items="mov"
          :headers="header"
          sort-by="distancia"
          :sort-desc="false"
          :search="search"
          :custom-filter="filterItemsTable"
          :loading="loading"
          loading-text="Carregando... Um momento por favor."
          no-data-text="Nenhuma cidade, tente alterar o raio."
          no-results-text="Nenhuma cidade encontrada, tente outro termo."
          :mobile-breakpoint="0"
          :footer-props="{
            itemsPerPageText: 'Cidades por página',
            showFirstLastPage: true,
            itemsPerPageAllText: 'Todas',
          }"
        >
          <template v-slot:top>
            <v-text-field
              outlined
              clearable
              v-model="search"
              label="Procurar"
              class="mx-4"
            ></v-text-field>
            <v-btn
              :disabled="npodeExportar"
              @click="exportar(header, mov)"
              x-small
              color="info"
              >.CSV</v-btn
            >
          </template>
          <template v-slot:item.distancia="{ item }">
            {{ formateDistancia(item.distancia) }}
          </template>
        </v-data-table>
      </v-col>
    </row>
  </v-container>
</template>

<script>
import Cidades from "../data/cidades.json";
import UF from "../data/uf.json";
import DDD from "../data/ddd.json";
const { Parser } = require("json2csv");
// import axios from "axios";

export default {
  name: "Main",
  data: () => ({
    search: "",
    loading: false,
    header: [
      { text: "Cidade", value: "cidade" },
      { text: "Distancia", align: "end", value: "distancia" },
      { text: "UF", value: "uf" },
      { text: "DDD", value: "ddd" },
    ],
    mov: [],
    raio: "",
    cidadeEscolhida: "",
    cidades: Cidades,
  }),
  computed: {
    npodeExportar: function () {
      return this.mov.length ? false : true;
    },
  },
  methods: {
    filterItemsTable(value, search) {
      return (
        value != null &&
        search != null &&
        typeof value === "string" &&
        value
          .toString()
          .toLocaleLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .indexOf(
            search
              .toLocaleLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
          ) !== -1
      );
    },

    filterItems(item, queryText, itemText) {
      return (
        itemText
          .toLocaleLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .indexOf(
            queryText
              .toLocaleLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
          ) > -1
      );
    },
    calcularDistancia(raio) {
      this.eventTracking();
      this.loading = true;
      this.mov = [];
      if (this.cidadeEscolhida === "" || this.cidadeEscolhida === null) {
        this.loading = false;
        return;
      }
      this.getData(raio).then((data) => {
        this.mov = data.items;
        this.loading = false;
      });
    },

    getData(raio) {
      return new Promise((resolve) => {
        let items = [];
        for (var key in Cidades) {
          var obj = Cidades[key];
          var resultado = (
            this.getDistanceFromLatLonInKm(
              this.findCIDADE(this.cidadeEscolhida),
              obj
            ) / 1000
          ).toFixed(3);
          if (resultado <= raio) {
            var rUF = this.findUF(obj.codigo_uf);
            var dddcit = this.findDDD(obj.codigo_ibge);
            items.push({
              codigo_ibge: obj.codigo_ibge,
              cidade: obj.nome,
              distancia: resultado,
              uf: rUF.nome,
              ddd: dddcit.ddd,
            });
          }
        }
        resolve({ items });
      });
    },

    getDistanceFromLatLonInKm(position1, position2) {
      var deg2rad = function (deg) {
          return deg * (Math.PI / 180);
        },
        R = 6371,
        dLat = deg2rad(position2.latitude - position1.latitude),
        dLng = deg2rad(position2.longitude - position1.longitude),
        a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(deg2rad(position1.latitude)) *
            Math.cos(deg2rad(position1.latitude)) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2),
        c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return (R * c * 1000).toFixed();
    },

    findUF(id) {
      var teste = UF.findIndex((x) => x.codigo_uf === id);
      return UF[teste];
    },
    findCIDADE(ibge) {
      var cid = Cidades.findIndex((x) => x.codigo_ibge === ibge);
      // var dddcid = DDD.findIndex((x) => x.ibge === ibge);
      // cid ={
      //   ...cid,
      //   ddd : dddcid.ddd
      // }

      return Cidades[cid];
    },
    findDDD(ibge) {
      var cid = DDD.findIndex((x) => x.ibge === ibge);
      return DDD[cid];
    },

    formateDistancia(str) {
      return str.replace(".", ",") + " km";
    },

    exportar(fields, myData) {
      const opts = { fields, delimiter: ";" };

      try {
        const parser = new Parser(opts);
        const csv = parser.parse(myData);
        console.log(csv);

        var FileSaver = require("file-saver");
        var blob = new Blob(["\uFEFF" + csv], {
          type: "text/csv; charset=UTF-8",
          autoBom: true,
        });
        FileSaver.saveAs(
          blob,
          `${this.cidadeEscolhida} - Cidades ao Redor.csv`
        );
      } catch (err) {
        console.error(err);
      }
    },

    eventTracking() {
      this.$gtag.event("Botão - Listar Cidades", {
        event_category: "cidades",
        event_label: "Ver cidades ao redor",
        value: 1,
      });
    },
  },
};
</script>

<style></style>
