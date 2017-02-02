import io from 'socket.io-client';
import Vue from 'vue';

import { CHAT_MESSAGE } from './constants';

export const events = new Vue();

export default {
  init() {
    this.socket = io();

    this.socket.on('userList', userList => {
      console.log(userList);
    });

    this.socket.on('newMessage', message => {
      events.$emit('newMessage', message);
    });

    events.$on('sendMessage', message => {
      this.socket.emit(CHAT_MESSAGE, message, 'foo');
    });
  },

  authenticate(jwt) {
    this.socket.emit('authenticate', jwt);
  }
};

