<template>
  <div id="signup-box">
    <h1>Sign Up</h1>
    <form id="signup-form">
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
        <button :disabled="!validate()">Complete Signup</button>
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
        name: ''
      };
    },
    methods: {
      validate() {
        return !validator.isEmpty(this.username) &&
          !validator.isEmpty(this.name) &&
          validator.isEmail(this.email) &&
          !validator.isEmpty(this.password) &&
          validator.equals(this.password, this.passwordConfirm);
      }
    }
  };
</script>

<style lang="sass">
  @import './scss/variables';

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
      }

      input {
        font-size: 1em;
        height: 2em;
        width: 15rem;
        outline: none;
        padding-left: 2em;

        &:focus {
          border: 1px solid #000000;
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
