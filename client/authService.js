import Vue from 'vue';

export default {
  getUser(token) {
    return Vue.http.get('/user', {
      headers: {
        'authorization': token
      } 
    }).then(response => {
      return response.body.user; 
    });
  }
}
