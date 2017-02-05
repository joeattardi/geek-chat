<template>
  <div id="signup-box">
    <h1>Sign Up</h1>
    <form @submit="signup" id="signup-form">
      <div v-if="signupError" class="error">{{ signupError }}</div>
      <div>
        <label for="name"><i class="fa fa-lg fa-user-circle-o" aria-hidden="true"></i></label>
        <input ref="nameField" autofocus type="text" id="name" v-model="name" placeholder="Full Name" />
      </div>
      <div>
        <label for="username"><i class="fa fa-lg fa-user-circle-o" aria-hidden="true"></i></label>
        <input ref="usernameField" type="text" id="username" v-model="username" placeholder="Username" />
      </div>
      <div>
        <label for="email"><i class="fa fa-lg fa-envelope-o" aria-hidden="true"></i></label>
        <input ref="emailField" type="text" id="email" v-model="email" placeholder="Email" />
      </div>
      <div>
        <label for="password"><i class="fa fa-lg fa-lock" aria-hidden="true"></i></label>
        <input ref="passwordField" type="password" id="password" v-model="password" placeholder="Password" />
      </div>
      <div>
        <label for="passwordConfirm"><i class="fa fa-lg fa-lock" aria-hidden="true"></i></label>
        <input ref="passwordConfirmField" type="password" id="passwordConfirm" v-model="passwordConfirm" placeholder="Confirm Password" />
      </div>
      <div>
        <div ref="recaptcha" id="recaptcha-container"></div>
      </div>
      <div>
        <button v-if="!submitting" :disabled="!validate()">Complete Signup</button>
        <button v-else disabled>
          <spinner />
        </button>
      </div>
    </form>
  </div>
</template>

<script>
  import validator from 'validator';
  import Spinner from './Spinner.vue';

  export default {
    components: {
      spinner: Spinner
    },
    mounted() {
      window.grecaptcha.render('recaptcha-container', {
        sitekey: '6LeIVhQUAAAAAE9gxo9OzaY7P2PVPI3Z7NDfrgpo',
        callback: 'recaptchaCallback'
      });
      window.recaptchaCallback = (result) => {
        this.recaptchaResult = result;
      };
    },
    data() {
      return {
        username: '',
        password: '',
        passwordConfirm: '',
        email: '',
        name: '',
        signupError: '',
        submitting: false,
        recaptchaResult: ''
      };
    },
    methods: {
      validate() {
        return !validator.isEmpty(this.username) &&
          !validator.isEmpty(this.name) &&
          validator.isEmail(this.email) &&
          !validator.isEmpty(this.password) &&
          this.recaptchaResult &&
          validator.equals(this.password, this.passwordConfirm);
      },
      signup(event) {
        event.preventDefault();

        if (!this.validate()) {
          return false;
        }

        this.submitting = true;

        this.$http.post('/signup', {
          username: this.username,
          password: this.password,
          passwordConfirm: this.passwordConfirm,
          email: this.email,
          name: this.name,
          recaptchaResult: this.recaptchaResult
        }).then(response => {
          if (response.body.result === 'success') {
            localStorage.setItem('token', response.body.token);
            this.$router.push('/chat');
          }
        }).catch(response => {
          this.submitting = false;
          this.signupError = response.body.message;

          if (response.body.code === 'USERNAME_EXISTS') {
            this.username = '';
            this.$refs.usernameField.focus();
          }
          
          window.grecaptcha.reset();
        });
      }
    }
  };
</script>

<style lang="sass">
  @import '../scss/variables';

  #signup-box {
    background-color: $panel-color;
    border: 1px solid $panel-border-color;
    width: 30rem;
    padding: 1rem;
    border-radius: 5px;

    h1 {
      font-family: 'Montserrat', sans-serif;
      font-size: 2em;
      margin: 0;
    }

    #signup-form {
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
        border: 1px solid #CCCCCC;
        border-radius: 2px;
        padding-left: 2em;

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
