<template>
  <div id="chat-messages">
    <div class="message" v-for="message in roomMessages">
      <span class="message-user">
        {{ message.user.fullName }}
      </span>
      <span class="message-timestamp">
        {{ formatTimestamp(message.timestamp) }}
      </span>
      <div class="message-text">{{ message.text }}</div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment';
  import socketClient, { events } from '../socketClient';

  export default {
    created() {
      events.$on('newMessage', message => {
        this.messages.push(message);
      });
    },
    methods: {
      formatTimestamp(timestamp) {
        return moment(timestamp).format('MMM D h:mm');
      }
    },
    data() {
      return {
        messages: []
      };
    },
    computed: {
      roomMessages() {
        return this.messages.filter(message => message.room === this.$store.state.currentRoom._id);
      }
    }
  };
</script>

<style lang="sass">
  @import '../scss/variables';

  #chat-messages {
    flex-grow: 1;
    border-right: 1px solid $panel-border-color;
    overflow-y: scroll;
    padding: 1em;

    .message {
      .message-user {
        vertical-align: middle;
        font-weight: bold;
        color: $brand-color;
      }

      .message-timestamp {
        vertical-align: middle;
        color: #AAAAAA;
        font-size: 0.8em;
      }

      .message-text {
        font-size: 0.9em;
      }
    }
  }
</style>
