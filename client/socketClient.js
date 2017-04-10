
import io from 'socket.io-client';
import Vue from 'vue';

import store from './store';
import * as chatConstants from '../shared/chatConstants';
import * as events from './events';
import { MESSAGE_TYPE } from './constants';

export const eventChannel = new Vue();

export default {
  init() {
    this.socket = io('/', { reconnection: false });

    this.socket.on(chatConstants.USER_LIST, userList => {
      eventChannel.$emit(events.USER_LIST, userList);
    });

    this.socket.on(chatConstants.UPDATE_ROOM, room => {
      store.commit('updateRoom', room);
    });

    this.socket.on(chatConstants.ROOM_DELETED, room => {
      store.commit('leaveRoom', room);
      store.commit('setCurrentRoom', store.state.user.rooms[0]);
      // TODO show notification that the room was deleted
    });

    this.socket.on(chatConstants.CHAT_MESSAGE_TO_CLIENT, (user, text, room, timestamp) => {
      eventChannel.$emit(events.NEW_MESSAGE_FROM_SERVER, {
        type: MESSAGE_TYPE.CHAT_MESSAGE,
        user,
        room,
        text,
        timestamp
      });
    });

    this.socket.on(chatConstants.SYSTEM_MESSAGE, (text, room, timestamp) => {
      eventChannel.$emit(events.NEW_MESSAGE_FROM_SERVER, {
        type: MESSAGE_TYPE.SYSTEM_MESSAGE,
        text,
        room,
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

  joinRoom(roomId, silent) {
    this.socket.emit(chatConstants.JOIN_ROOM, roomId, silent);
  },

  disconnect() {
    this.socket.disconnect();
    eventChannel.$off(events.SEND_MESSAGE);
  }
};
