<template>
  <div id="chat-users">
    <ul>
      <li v-for="user in roomUserList" :class="{ admin: isAdmin(user) }">
        <i class="fa fa-user" aria-hidden="true"></i>
        {{ user.fullName }}
      </li>
    </ul>
  </div>
</template>

<script>
  import { eventChannel } from '../socketClient';
  import { USER_LIST } from '../events';

  export default {
    created() {
      eventChannel.$on(USER_LIST, userList => {
        this.userList = userList;
      });
    },
    data() {
      return {
        userList: []
      };
    },
    methods: {
      isAdmin(user) {
        const admins = this.$store.state.currentRoom.admins;
        return admins.indexOf(user._id) >= 0;
      }
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
        cursor: pointer;

        &.admin {
          font-weight: bold;
        }
      }
    }
  }
</style>
