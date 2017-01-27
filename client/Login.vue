<template>
  <div id="login-box">
    <h1>GeekChat</h1>
    <div id="login-form">
      <form @submit="login">
        <input autofocus type="text" v-model="username" placeholder="Username" />
        <button>Log In</button>
      </form>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        username: ''
      };
    },
    methods: {
      login(event) {
        event.preventDefault();
        this.$router.push('/chat');
      }
    }
  };
</script>

<style lang="sass">
  @import './scss/variables';

  #login-box {
    h1 {
      font-family: 'Montserrat', sans-serif;
      font-size: 3em;
    }

    #login-form {
      width: 20em;
      margin: auto;

      input {
        height: 2em;
        width: 50%;
      }
    }

    margin: 10em auto;
    text-align: center;
  }
</style>
