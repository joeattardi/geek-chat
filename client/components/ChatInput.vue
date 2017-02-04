<template>
  <div id="chat-input">
    <form @submit="sendMessage">
      <input ref="inputField" autofocus v-model="message" type="text" />
      <button>Send</button>
    </form>
  </div>
</template>

<script>
  import socketClient, { events } from '../socketClient';

  export default {
    data() {
      return {
        message: ''
      }
    },
    methods: {
      sendMessage(event) {
        event.preventDefault();
        events.$emit('sendMessage', this.message);
        this.message = '';
      }
    },
    mounted() {
      this.$refs.inputField.focus();
    }
  };
</script>

<style lang="sass">
  @import '../scss/variables';

  #chat-input {
    border-top: 1px solid $panel-border-color;
    background-color: $panel-color;
    padding: 10px;
    display: flex;

    form {
      display: flex;
      flex-grow: 1;
    }

    input {
      flex-grow: 1;
      margin-right: 10px;
      height: 2em;
      align-self: center;
      outline: none;
    }
  }
</style>
