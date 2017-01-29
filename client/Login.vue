<template>
  <div id="login-box">
    <h1>GeekChat</h1>
    <div id="login-form">
      <form @submit="login">
        <div>
          <label for="username"><i class="fa fa-lg fa-user-circle-o" aria-hidden="true"></i></label>
          <input ref="usernameField" autofocus type="text" id="username" v-model="username" placeholder="Username" />
        </div>
        <div>
          <label for="password"><i class="fa fa-lg fa-lock" aria-hidden="true"></i></label>
          <input type="password" id="password" v-model="password" placeholder="Password" />
        </div>
        <div><button :disabled="!isValid()">Log In</button></div>
        Don't have an account? <a href="#">Sign up</a>
      </form>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        username: '',
        password: ''
      };
    },
    mounted() {
      this.$refs.usernameField.focus();      
    },
    methods: {
      login(event) {
        event.preventDefault();
        this.$router.push('/chat');
      },
      isValid() {
        return this.username && this.password;
      }
    }
  };
</script>

<style lang="sass">
  @import './scss/variables';

  #login-box {
    background-color: $panel-color;
    border: 1px solid $panel-border-color;
    width: 30rem;
    padding: 1rem;
    border-radius: 5px;

    h1 {
      font-family: 'Montserrat', sans-serif;
      font-size: 3em;
      margin: 0;
    }

    #login-form {
      width: 20em;
      margin: auto;

      div {
        margin: 0.5em;

        i {
          position: relative;
          right: -1.5em;
          width: 1em;
          color: #AAAAAA;
        }
      }

      input {
        font-size: 1em;
        height: 2em;
        width: 15rem;
        outline: none;
        padding-left: 2em;
      }

      button {
        width: 15rem;
        position: relative;
        left: 1em;
      }
    }

    margin: 10em auto;
    text-align: center;
  }
</style>
