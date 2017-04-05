<template>
  <div id="chat-messages">
    <div v-for="message in roomMessages">
      <chat-message :message="message" v-if="message.type === 'chatMessage'"></chat-message>
      <system-message :message="message" v-else-if="message.type === 'systemMessage'"></system-message>
    </div>
  </div>
</template>

<script>
  import ChatMessage from './ChatMessage.vue';
  import SystemMessage from './SystemMessage.vue';
  import socketClient, { eventChannel } from '../socketClient';
  import { NEW_MESSAGE_FROM_SERVER } from '../events';

  export default {
    components: {
      ChatMessage,
      SystemMessage
    },
    created() {
      eventChannel.$on(NEW_MESSAGE_FROM_SERVER, message => {
        if (window.GeekChat.debug) {
          console.debug(message);
        }
        this.messages.push(message);
      });
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
  }
</style>
