<template>
  <div id="content">
    <chat-header />
    <div id="chat-container">
      <div id="chat-room-header">
        <h2>Main Room</h2>
      </div>
      <div id="chat-content">
        <chat-message-list />
        <room-user-list />
      </div>
      <chat-input />
    </div>
  </div>
</template>

<script>
  import ChatHeader from './ChatHeader.vue';
  import ChatInput from './ChatInput.vue';
  import ChatMessageList from './ChatMessageList.vue';
  import RoomUserList from './RoomUserList.vue';
  import socketClient from '../socketClient';

  export default {
    beforeRouteEnter(to, from, next) {
      if (!localStorage.getItem('token')) {
        next('/login');
      } else {
        next();
      }
    },
    created() {
      const token = localStorage.getItem('token');
      socketClient.init();
      socketClient.authenticate(token);

      this.$store.dispatch('getUser', token).catch(error => {
        localStorage.removeItem('token');
        this.$router.push('/login');
      });
    },
    components: {
      'chat-header': ChatHeader,
      'chat-input': ChatInput,
      'chat-message-list': ChatMessageList,
      'room-user-list': RoomUserList
    }
  };
</script>

<style lang="sass">
  @import '../scss/variables';

  #content {
    display: flex;
    flex-direction: column;
    height: 100vh;

    #chat-container {
      display: flex;
      flex-direction: column;
      flex-grow: 1;

      #chat-room-header {
        background: $panel-color;
        border-bottom: 1px solid $panel-border-color;
        padding: 0.5em;

        h2 {
          font-size: 1.2em;
          font-weight: bold;
          margin: 0;
        }
      }

      #chat-content {
        display: flex;
        flex-grow: 1;
      }
    }
  }
</style>
