<template>
  <div id="chat-input">
    <input ref="inputField" autofocus type="text" />
    <button>Send</button>
  </div>
</template>

<script>
  export default {
    mounted() {
      this.$refs.inputField.focus();
    }
  };
</script>

<style lang="sass">
  @import './scss/variables';

  #chat-input {
    border-top: 1px solid $panel-border-color;
    background-color: $panel-color;
    padding: 10px;
    display: flex;

    input {
      flex-grow: 1;
      margin-right: 10px;
      height: 2em;
      align-self: center;
      outline: none;
    }
  }
</style>
