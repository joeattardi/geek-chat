<template>
  <div id="content">
    <room-modal v-if="showRoomModal" @close="closeRoomModal()" />
    <chat-header @newChat="openRoomModal()" />
    <div id="main">
      <room-list />
      <div id="chat-container" v-if="userRooms && userRooms.length > 0">
        <room-header />
        <div id="chat-content">
          <chat-message-list />
          <room-user-list />
        </div>
        <chat-input />
      </div>
    </div>
  </div>
</template>

<script>
  import ChatHeader from './ChatHeader.vue';
  import ChatInput from './ChatInput.vue';
  import ChatMessageList from './ChatMessageList.vue';
  import RoomHeader from './RoomHeader.vue';
  import RoomUserList from './RoomUserList.vue';
  import RoomList from './RoomList.vue';
  import RoomModal from './RoomModal.vue';
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
      this.$store.dispatch('getUser', token)
        .then(user => {
          socketClient.init();
          socketClient.authenticate(token);
          user.rooms.forEach(room => {
            socketClient.joinRoom(room._id);
          });
        })
        .catch(error => {
          localStorage.removeItem('token');
          this.$router.push('/login');
        });
    },
    data() {
      return {
        showRoomModal: false
      };
    },
    computed: {
      userRooms() {
        return this.$store.state.user.rooms;
      }
    },
    methods: {
      openRoomModal() {
        this.showRoomModal = true;
      },
      closeRoomModal() {
        this.showRoomModal = false;
      }
    },
    components: {
      ChatHeader,
      ChatInput,
      ChatMessageList,
      RoomList,
      RoomUserList,
      RoomHeader,
      RoomModal
    }
  };
</script>

<style lang="sass">
  @import '../scss/variables';

  #content {
    display: flex;
    flex-direction: column;
    height: 100vh;

    #main {
      display: flex;
      height: 100vh;
    }

    #chat-container {
      display: flex;
      flex-direction: column;
      flex-grow: 1;

      #chat-content {
        display: flex;
        flex-grow: 1;
      }
    }
  }
</style>
