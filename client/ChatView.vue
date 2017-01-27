<template>
  <div id="content">
    <header>
      GeekChat
    </header>
    <div id="chat-container">
      <div id="chat-content">
      </div>
      <div id="chat-input">
        <input ref="inputField" autofocus type="text" />
        <button>Send</button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    mounted() {
      this.$refs.inputField.focus();
    }
  }
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

      #chat-content {
        flex-grow: 1;
      }

      #chat-input {
        border-top: 1px solid #AAAAAA;
        background-color: #EEEEEE;
        padding: 10px;
        display: flex;

        input {
          flex-grow: 1;
          margin-right: 10px;
          height: 2em;
          align-self: center;
        }
      }
    }
  }


</style>
