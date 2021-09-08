import 'font-awesome/css/font-awesome.css'
import Vue from 'vue'

import App from './App'

import './config/bootstrap'
import './config/msgs'
import './config/axios'
import './config/mq'

import store from './config/store' //file that share the state from other components
import router from './config/router'

Vue.config.productionTip = false

//temporary trick to access the pages with the token
//require('axios').defaults.headers.common['Authorization'] = 'bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MywibmFtZSI6InBhdWxvIiwiZW1haWwiOiJwYXVsb21hdHRvc0BnbWFpbCIsImFkbWluIjp0cnVlLCJpYXQiOjE2MzEwMDY2NDQsImV4cCI6MTYzMTI2NTg0NH0.PDMW3HTpOPGeMkgCzzxiP8QPQLR_1NGI205eG4vjmkI'

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')