
import io from 'socket.io-client';
import Vue from 'vue';

import * as chatConstants from '../shared/chatConstants';
import * as events from './events';

export const eventChannel = new Vue();

export default {
  init() {
    this.socket = io();

    this.socket.on(chatConstants.USER_LIST, userList => {
      eventChannel.$emit(events.USER_LIST, userList);
    });

    this.socket.on(chatConstants.CHAT_MESSAGE_TO_CLIENT, (user, text, room, timestamp) => {
      eventChannel.$emit(events.NEW_MESSAGE_FROM_SERVER, {
        user,
        room,
        text,
        timestamp
      });
    });

    eventChannel.$on(events.SEND_MESSAGE, options => {
      this.socket.emit(chatConstants.CHAT_MESSAGE_FROM_CLIENT, options);
    });
  },

  authenticate(jwt) {
    this.socket.emit(chatConstants.AUTHENTICATE, jwt);
  },

  leaveRoom(roomId) {
    this.socket.emit(chatConstants.LEAVE_ROOM, roomId);
  },

  joinRoom(roomId) {
    this.socket.emit(chatConstants.JOIN_ROOM, roomId);
  },

  disconnect() {
    this.socket.disconnect();
    eventChannel.$off(events.SEND_MESSAGE);
  }
};
