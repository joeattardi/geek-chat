import Vuex from 'vuex';
import Vue from 'vue';

import * as actions from './actions';

Vue.use(Vuex);

export default new Vuex.Store({
  actions,
  state: {
    user: {
      fullName: ''
    },
    rooms: [],
    currentRoom: '',
    roomListWidth: 200
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },

    resizeRoomList(state, width) {
      state.roomListWidth = width;
    },

    setCurrentRoom(state, room) {
      state.currentRoom = room;
    },

    leaveRoom(state, room) {
      state.user.rooms = state.user.rooms.filter(r => r._id !== room._id);
    },

    setRooms(state, rooms) {
      state.rooms = rooms;
    },

    clearUser(state) {
      state.user = {
        fullName: ''
      };
    }
  }
});
