<template>
  <modal @close="$emit('close')">
    <div slot="title">Create New Room</div>
    <div id="create-room" slot="body">
      <div v-if="error" class="error-message">{{ error }}</div>
      <form @submit.prevent="createRoom()">
        <label for="room-name">Room name</label>
        <input type="text" id="room-name" v-model="roomName" />

        <label for="room-topic">Room topic</label>
        <input type="text" id="room-topic" v-model="roomTopic" />
      </form>
    </div>
    <div slot="footer">
      <button
        type="button"
        @click="$emit('close')">
          Cancel
      </button>
      <button :disabled="roomName.length === 0" @click="createRoom()">Create</button>
    </div>
  </modal>
</template>

<script>
  import socketClient from '../socketClient';
  import Modal from './Modal.vue';

  export default {
    created() {
      setTimeout(() => document.getElementById('room-name').focus(), 0);
    },
    components: {
      Modal
    },
    methods: {
      createRoom() {
        this.$store.dispatch('createRoom', {
          name: this.roomName,
          topic: this.roomTopic
        }).then(result => {
          this.$store.dispatch('joinRoom', result.body.room);
          this.$store.dispatch('setCurrentRoom', result.body.room);
          socketClient.joinRoom(result.body.room._id);
          this.$emit('close');
        }).catch(error => {
          if (error.body.code === 'ROOM_EXISTS') {
            this.error = 'A room already exists with that name.';
          } else {
            this.error = 'An unexpected error has occurred. Please try again.';
          }
          document.getElementById('room-name').focus();
        });
      }
    },
    data() {
      return {
        roomName: '',
        roomTopic: '',
        error: ''
      };
    }
  };
</script>

<style lang="sass">
  #create-room {
    label {
      display: block;
      font-size: 0.8em;
    }

    .error-message {
      font-size: 0.8em;
    }

    input {
      width: 100%;
      font-size: 1em;
    }
  }
</style>
