import io from 'socket.io-client';

export default {
  init() {
    this.socket = io();

    this.socket.on('userList', userList => {
      console.log(userList);
    });
  }
};

