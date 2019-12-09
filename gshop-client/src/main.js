/*
*入口JS
*/
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import {Button} from 'mint-ui'
import './mock/mockServer'
import VueLazyload from 'vue-lazyload'
import loading from './common/imgs/loading.gif'
import './filters'
// 将Button注册为全局标签，这样就会多一个<mt-button></mt-button>
Vue.component(Button.name, Button)
Vue.use(VueLazyload, {
  loading
})
// eslint-disable-next-line
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store
})
