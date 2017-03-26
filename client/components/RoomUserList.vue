<template>
  <div id="chat-users">
    <ul>
      <li v-for="user in roomUserList">
        <i class="fa fa-user" aria-hidden="true"></i>
        {{ user.fullName }}
      </li>
    </ul>
  </div>
</template>

<script>
  import { events } from '../socketClient';

  export default {
    created() {
      events.$on('userList', userList => {
        this.userList = userList;
      });
    },
    data() {
      return {
        userList: []
      };
    },
    computed: {
      roomUserList() {
        return this.userList.filter(user => user.rooms.indexOf(this.$store.state.currentRoom._id) >= 0);
      }
    }
  };
</script>

<style lang="sass">
  #chat-users {
    width: 10em;

    ul {

      padding: 0.5em;
      margin: 0;

      li {
        font-size: 0.8em;
        list-style-type: none;
      }
    }
  }
</style>
