<template>
  <div id="signup-box">
    <h1>Sign Up</h1>
    <form @submit="signup" id="signup-form">
      <div>
        <label for="name"><i class="fa fa-lg fa-user-circle-o" aria-hidden="true"></i></label>
        <input :disabled="submitting" ref="nameField" autofocus type="text" id="name" v-model="name" placeholder="Full Name" />
      </div>
      <div>
        <label for="username"><i class="fa fa-lg fa-user-circle-o" aria-hidden="true"></i></label>
        <input :disabled="submitting" ref="usernameField" type="text" id="username" v-model="username" placeholder="Username" />
      </div>
      <div>
        <label for="email"><i class="fa fa-lg fa-envelope-o" aria-hidden="true"></i></label>
        <input :disabled="submitting" ref="emailField" type="text" id="email" v-model="email" placeholder="Email" />
      </div>
      <div>
        <label for="password"><i class="fa fa-lg fa-lock" aria-hidden="true"></i></label>
        <input :disabled="submitting" ref="passwordField" type="password" id="password" v-model="password" placeholder="Password" />
      </div>
      <div>
        <label for="passwordConfirm"><i class="fa fa-lg fa-lock" aria-hidden="true"></i></label>
        <input :disabled="submitting" ref="passwordConfirmField" type="password" id="passwordConfirm" v-model="passwordConfirm" placeholder="Confirm Password" />
      </div>
      <div>
        <button v-if="!submitting" :disabled="!validate()">Complete Signup</button>
        <button v-else disabled>
          <div class="spinner">
            <div class="bounce1"></div>
            <div class="bounce2"></div>
            <div class="bounce3"></div>
          </div>
        </button>
      </div>
    </form>
  </div>
</template>

<script>
  import validator from 'validator';

  export default {
    data() {
      return {
        username: '',
        password: '',
        passwordConfirm: '',
        email: '',
        name: '',
        submitting: false
      };
    },
    methods: {
      validate() {
        return !validator.isEmpty(this.username) &&
          !validator.isEmpty(this.name) &&
          validator.isEmail(this.email) &&
          !validator.isEmpty(this.password) &&
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
          name: this.name
        }).then(response => {
          if (response.body.result === 'success') {
            localStorage.setItem('token', response.body.token);
            this.$router.push('/chat');
          }
        });
      }
    }
  };
</script>

<style lang="sass">
  @import './scss/variables';
  @import './scss/spinner';

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

        &:disabled {
          background-color: #DDDDDD;
          opacity: 0.5;
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
