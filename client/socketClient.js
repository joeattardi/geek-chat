
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

    this.socket.on('newMessage', (user, text, room, timestamp) => {
      events.$emit('newMessage', {
        user,
        room,
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

  joinRoom(roomId) {
    this.socket.emit('joinRoom', roomId);
  },

  disconnect() {
    this.socket.disconnect();
    events.$off('sendMessage');
  }
};
