<template>
  <div id="room-list">
    <h3>Rooms</h3>
    <div :class="['room', { 'current-room': isCurrentRoom(room) }]" v-for="room in rooms" @click="showRoom(room)">
      <i class="fa fa-users" aria-hidden="true"></i>
      {{ room.name }}
    </div>
    <h3>Private Messages</h3>
  </div>
</template>

<script>
  export default {
    computed: {
      rooms() {
        return this.$store.state.user.rooms;
      }
    },
    methods: {
      isCurrentRoom(room) {
        return this.$store.state.currentRoom === room;
      },

      showRoom(room) {
        this.$store.dispatch('setCurrentRoom', room);
      }
    }
  };
</script>

<style lang="sass">
  @import '../scss/variables';

  #room-list {
    background-color: $panel-color;
    border-right: 1px solid $panel-border-color;
    width: 10em;
    padding: 0.5em;

    h3 {
      margin: 0;
      font-size: 0.9em;
      color: #666666;
    }

    .room {
      font-size: 0.8em;
      cursor: pointer;
      padding: 0.5em;
      border-radius: 5px;

      &.current-room {
        background-color: $brand-color;
        color: #FFFFFF;
      }
    }
  }
</style>
