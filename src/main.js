/*
 * @Author: your name
 * @Description: 入口文件
 * @FilePath: \centralized-control-sys-web\src\main.js
 */

import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/styles/index.scss';
import filters from './filters';
// 将自动注册所有组件为全局组件
// import dataV from '@jiaminghi/data-view';
// Vue.use(dataV);
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);// 插入过滤器名和对应方法
});
Vue.use(ElementUI, { size: 'mini' });

import echarts from 'echarts';
Vue.prototype.$echarts = echarts;
import china from 'echarts/map/json/china.json';
echarts.registerMap('china', china);

import axios from './utils/axios.js';
Vue.prototype.$axios = axios;
Vue.config.productionTip = false;
import { baseUrl } from '@/config/env.js';
Vue.prototype.baseUrl = baseUrl;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
