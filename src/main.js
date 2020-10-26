// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'; 
import App from './App'
import router from './router'
import './assets/css/index.css'

Vue.use(Element, { size: 'small', zIndex: 3000 });
Vue.use(Vuex)
import globalWs from '@/utils/websocket.js'
Vue.prototype.$globalWs = globalWs


//axios全局应用
import htp from '@/utils/axios.js'
Vue.prototype.$htp = htp


Vue.config.productionTip = false

const store = new Vuex.Store({
  state:{
    t:0
  },
  mutations:{
    updatet(state, t) {
      state.t = t
    }
  }
})

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
