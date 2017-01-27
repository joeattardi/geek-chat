import Vue from 'vue';
import VueRouter from 'vue-router';

import './scss/index.scss';
import App from './App.vue';

import Login from './Login.vue';
import ChatView from './ChatView.vue';

Vue.use(VueRouter);

const routes = [
  { path: '/', component: Login },
  { path: '/chat', component: ChatView }
];

const router = new VueRouter({ routes });

new Vue({
  el: '#app',
  router,
  render: h => h(App)
});
