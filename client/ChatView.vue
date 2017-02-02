<template>
  <div id="content">
    <header>
      GeekChat
    </header>
    <div id="chat-container">
      <div id="chat-header">
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
  import ChatInput from './ChatInput.vue';
  import ChatMessageList from './ChatMessageList.vue';
  import RoomUserList from './RoomUserList.vue';
  import socketClient from './socketClient';

  export default {
    created() {
      socketClient.init();
      socketClient.authenticate(localStorage.getItem('token'));
    },
    components: {
      'chat-input': ChatInput,
      'chat-message-list': ChatMessageList,
      'room-user-list': RoomUserList
    }
  };
</script>

<style lang="sass">
  @import './scss/variables';

  #content {
    display: flex;
    flex-direction: column;
    height: 100vh;

    header {
      background-color: $brand-color;
      padding: 10px;
      color: #FFFFFF;
      font-family: 'Montserrat', sans-serif;
      font-weight: bold;
      font-size: 1.2em;
    }

    #chat-container {
      display: flex;
      flex-direction: column;
      flex-grow: 1;

      #chat-header {
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
