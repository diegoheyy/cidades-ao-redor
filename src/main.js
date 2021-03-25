import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import VueAnalytics from 'vue-analytics';



Vue.use(VueAnalytics, {
  id: 'G-HK1MZ7ZS4M'
})
Vue.config.productionTip = false


new Vue({
  vuetify,
  render: h => h(App),
  
}).$mount('#app')


