import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';

import './scss/index.scss';
import App from './components/App.vue';
import Login from './components/Login.vue';
import Signup from './components/Signup.vue';
import ChatView from './components/ChatView.vue';
import store from './store';

Vue.use(VueRouter);
Vue.use(VueResource);

const routes = [
  {
    path: '/',
    beforeEnter: (to, from, next) => {
      if (localStorage.getItem('token')) {
        next('/chat');
      } else {
        next('/login');
      }
    }
  },
  { path: '/login', component: Login },
  { path: '/signup', component: Signup },
  { path: '/chat', component: ChatView }
];

const router = new VueRouter({ routes });

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});

