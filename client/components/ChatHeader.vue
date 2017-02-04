<template>
  <header>
    <h1>
      <i class="fa fa-lg fa-comment-o" aria-hidden="true"></i>
      GeekChat
    </h1>
    <div id="user-info">
      <i class="fa fa-user" aria-hidden="true"></i> 
      {{ user }}
      <i @click="logout" title="Log out" class="fa fa-sign-out" aria-hidden="true"></i> 
    </div>
  </header>
</template>

<script>
  export default {
    methods: {
      logout(event) {
        event.preventDefault();
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
      font-family: 'Montserrat', sans-serif;
      font-weight: bold;
      font-size: 1.2em;
      margin: 0;
      flex-grow: 1;
    }
  }
</style>
