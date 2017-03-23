<template>
  <div id="login-box">
    <h1>GeekChat</h1>
    <div id="login-form">
      <form @submit="login">
        <div class="error" v-if="loginIncorrect">Invalid username or password.</div>
        <div>
          <label for="username"><i class="fa fa-lg fa-user-circle-o" aria-hidden="true"></i></label>
          <input ref="usernameField" autofocus type="text" id="username" v-model="username" placeholder="Username" />
        </div>
        <div>
          <label for="password"><i class="fa fa-lg fa-lock" aria-hidden="true"></i></label>
          <input type="password" id="password" v-model="password" placeholder="Password" />
        </div>
        <div>
          <button v-if="!submitting" :disabled="!isValid()">Log In</button>
          <button v-else disabled>
            <spinner />
          </button>
        </div>
        Don't have an account? <router-link to="/signup"><strong>Sign up</strong></router-link>
      </form>
    </div>
  </div>
</template>

<script>
  import Spinner from './Spinner.vue';

  export default {
    components: {
      Spinner
    },
    data() {
      return {
        username: '',
        password: '',
        submitting: false,
        loginIncorrect: false
      };
    },
    mounted() {
      this.$refs.usernameField.focus();
    },
    methods: {
      login(event) {
        event.preventDefault();

        this.submitting = true;
        this.$http.post('/login', {
          username: this.username,
          password: this.password
        }).then(response => {
          if (response.status === 200) {
            localStorage.setItem('token', response.body.token);
            this.$router.push('/chat');
          }
        }).catch(response => {
          this.loginIncorrect = true;
          this.username = '';
          this.password = '';
          this.$refs.usernameField.focus();
        }).finally(() => {
          this.submitting = false;
        });
      },
      isValid() {
        return this.username && this.password;
      }
    }
  };
</script>

<style lang="sass">
  @import '../scss/variables';

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

        &.spinner {
          margin: 0;

          div {
            margin: 0;
          }
        }

      }

      .error {
        color: $error-color;
      }

      input {
        font-size: 1em;
        height: 2em;
        width: 15rem;
        outline: none;
        padding-left: 2em;
        border: 1px solid #CCCCCC;
        border-radius: 2px;

        &:focus {
          border: 1px solid #999999;
        }
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
