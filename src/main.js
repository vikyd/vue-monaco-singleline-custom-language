import Vue from 'vue'
import App from './App.vue'
import VueGtag from 'vue-gtag'

if (process.env.NODE_ENV === 'production') {
  Vue.use(VueGtag, { config: { id: 'G-XT0QM7C5VK' } })
}

Vue.config.productionTip = false

const v = new Vue({
  render: h => h(App),
}).$mount('#app')

v.$gtag.pageview({
  page_path: 'home',
})

