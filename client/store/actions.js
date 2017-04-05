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

export function joinRoom(context, room) {
  context.commit('joinRoom', room);
}

export function changeTopic(context, newTopic) {
  return Vue.http.put(`/rooms/${context.state.currentRoom._id}`, {
    _id: context.state.currentRoom._id,
    name: context.state.currentRoom.name,
    topic: newTopic,
  }, {
    headers: {
      'authorization': context.state.token
    }
  }).then(response => {
    context.commit('changeTopic', newTopic);
  });
}

export function renameRoom(context, newName) {
  return Vue.http.put(`/rooms/${context.state.currentRoom._id}`, {
    _id: context.state.currentRoom._id,
    name: newName,
    topic: context.state.currentRoom.topic
  }, {
    headers: {
      'authorization': context.state.token
    }
  }).then(response => {
    context.commit('renameRoom', newName);
  });
}

export function getUser(context, token) {
  return authService.getUser(token).then(user => {
    context.commit('setToken', token);
    context.commit('setUser', user);
    context.commit('setCurrentRoom', user.rooms[0]);

    return user;
  });
}

export function logout(context) {
  context.commit('clearUser');
}
