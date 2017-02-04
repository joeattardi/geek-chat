<template>
  <div id="chat-messages">
    <ul>
      <li v-for="message in messages">
        {{ message }}
      </li>
    </ul>
  </div>
</template>

<script>
  import socketClient, { events } from '../socketClient';

  export default {
    created() {
      events.$on('newMessage', message => {
        this.messages.push(message);
      });
    },
    data() {
      return {
        messages: []
      };
    }
  };
</script>

<style lang="sass">
  @import '../scss/variables';

  #chat-messages {
    flex-grow: 1;
    border-right: 1px solid $panel-border-color;
    overflow-y: scroll;
  }
</style>
