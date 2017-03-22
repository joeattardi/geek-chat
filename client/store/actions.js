import Vue from 'vue';
import authService from '../authService';

export function getRooms(context, token) {
  return Vue.http.get('/rooms', {
    headers: {
      'authorization': token
    }
  }).then(response => {
    context.commit('setRooms', response.body.rooms);
  });
}

export function resizeRoomList(context, width) {
  context.commit('resizeRoomList', width);
}

export function setCurrentRoom(context, room) {
  context.commit('setCurrentRoom', room);
}

export function leaveRoom(context, room) {
  context.commit('leaveRoom', room);
}

export function getUser(context, token) {
  return authService.getUser(token).then(user => {
    context.commit('setUser', user);
    context.commit('setCurrentRoom', user.rooms[0]);
  });
}

export function logout(context) {
  context.commit('clearUser');
}
