<template>
  <div id="room-list-container" :style="{ width: roomListWidth + 'px'}">
    <div id="room-list">
      <h3>Rooms</h3>
      <div :class="['room', { 'current-room': isCurrentRoom(room) }]" v-for="room in rooms" @click="showRoom(room)">
        <i class="fa fa-users" aria-hidden="true"></i>
        <span class="room-name">{{ room.name }}</span>
        <i class="fa fa-times leave-room" @click="leaveRoom(room)"></i>
      </div>
      <h3>Private Messages</h3>
    </div>
    <div class="resize-handle"
         @mousedown="startResize"
         @mouseup="endResize"
         >
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        resizing: false
      };
    },
    computed: {
      rooms() {
        return this.$store.state.user.rooms;
      },
      roomListWidth() {
        return this.$store.state.roomListWidth;
      }
    },
    methods: {
      startResize() {
        this.resizing = true;
        document.addEventListener('mousemove', this.doResize);
      },

      endResize() {
        this.resizing = false;
        document.removeEventListener('mousemove', this.doResize);
      },

      doResize(event) {
        if (this.resizing) {
          this.$store.dispatch('resizeRoomList', event.screenX);
        }
      },

      isCurrentRoom(room) {
        return this.$store.state.currentRoom === room;
      },

      showRoom(room) {
        this.$store.dispatch('setCurrentRoom', room);
      },

      leaveRoom(room) {
        this.$store.dispatch('leaveRoom', room);
      }
    }
  };
</script>

<style lang="sass">
  @import '../scss/variables';

  #room-list-container {
    background-color: $panel-color;
    border-right: 1px solid $panel-border-color;
    display: flex;

    .resize-handle {
      width: 10px;
      cursor: col-resize;
      position: relative;
      right: -5px;
    }

    #room-list {
      padding: 0.5em;
      flex-grow: 1;

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
        display: flex;
        align-items: center;

        &.current-room {
          background-color: $brand-color;
          color: #FFFFFF;
        }

        .fa-users {
          margin-right: 0.25em;
        }

        .room-name {
          flex-grow: 1;
        }

        .leave-room {
          display: none;
        }

        &:hover {
          .leave-room {
            display: block;
          }
        }
      }
    }
  }
</style>
