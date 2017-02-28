import io from 'socket.io-client';
import Vue from 'vue';

import { CHAT_MESSAGE } from './constants';

export const events = new Vue();

export default {
  init() {
    this.socket = io();

    this.socket.on('userList', userList => {
      events.$emit('userList', userList);
    });

    this.socket.on('newMessage', (user, text, timestamp) => {
      events.$emit('newMessage', {
        user,
        text, 
        timestamp
      });
    });

    events.$on('sendMessage', options => {
      this.socket.emit(CHAT_MESSAGE, options);
    });
  },

  authenticate(jwt) {
    this.socket.emit('authenticate', jwt);
  },

  disconnect() {
    this.socket.disconnect();
    events.$off('sendMessage');
  }
};

