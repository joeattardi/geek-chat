<template>
  <header>
    <h1>
      GeekChat
    </h1>
    <div id="controls">
      <button>New Chat</button>
    </div>
    <div id="user-info">
      <i class="fa fa-user" aria-hidden="true"></i>
      {{ user }}
      <i @click="logout" title="Log out" class="fa fa-sign-out" aria-hidden="true"></i>
    </div>
  </header>
</template>

<script>
  import socketClient from '../socketClient';

  export default {
    methods: {
      logout(event) {
        event.preventDefault();
        socketClient.disconnect();
        localStorage.removeItem('token');
        this.$store.dispatch('logout');
        this.$router.push('/');
      }
    },
    computed: {
      user() {
        return this.$store.state.user.fullName;
      }
    }
  };
</script>

<style lang="sass">
  @import '../scss/variables';

  header {
    display: flex;
    background-color: $brand-color;
    padding: 10px;
    color: #FFFFFF;

    #user-info {
      font-size: 0.8em;
      align-self: center;

      .fa-sign-out {
        margin-left: 1em;
        padding: 0.5em;
        cursor: pointer;

        &:hover {
          background-color: lighten($brand-color, 10%);
        }
      }
    }

    h1 {
      align-self: center;
      font-family: 'Montserrat', sans-serif;
      font-weight: bold;
      font-size: 1.2em;
      margin: 0;
      margin-right: 0.5em;
    }

    #controls {
      flex-grow: 1;

      button {
        background-color: #1792D9;
      }
    }
  }
</style>
