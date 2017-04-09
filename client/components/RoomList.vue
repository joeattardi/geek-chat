<template>
  <div id="room-list-container" :style="{ width: roomListWidth + 'px'}">
    <div id="room-list">
      <h3>Rooms</h3>
      <div :class="['room', { 'current-room': isCurrentRoom(room) }]" v-for="room in rooms" @click="showRoom(room)">
        <i class="fa fa-users" aria-hidden="true"></i>
        <span class="room-name">{{ room.name }}</span>
        <i class="fa fa-times leave-room" @click.stop="leaveRoom(room)"></i>
      </div>
      <div id="create-container">
        <button @click="showCreateModal = true">Create New Room</button>
      </div>
      <create-room-modal v-if="showCreateModal" @close="showCreateModal = false"/>
      <!-- <h3>Private Messages</h3> -->
    </div>
    <div class="resize-handle"
         @mousedown="startResize"
         @mouseup="endResize">
    </div>
  </div>
</template>

<script>
  import socketClient from '../socketClient';
  import CreateRoomModal from './CreateRoomModal.vue';

  export default {
    components: {
      CreateRoomModal
    },
    data() {
      return {
        resizing: false,
        showCreateModal: false
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
        document.addEventListener('mouseup', this.endResize);
      },

      endResize() {
        this.resizing = false;
        document.removeEventListener('mousemove', this.doResize);
        document.removeEventListener('mouseup', this.endResize);
      },

      doResize(event) {
        if (this.resizing) {
          this.$store.dispatch('resizeRoomList', event.screenX);
        }
      },

      isCurrentRoom(room) {
        return this.$store.state.currentRoom._id === room._id;
      },

      showRoom(room) {
        this.$store.dispatch('setCurrentRoom', room);
      },

      leaveRoom(room) {
        const roomIndex = this.rooms.indexOf(room);
        this.$store.dispatch('leaveRoom', room);

        this.$http.post(`/leave/${room._id}`, {}, {
          headers: {
            authorization: this.$store.state.token
          }
        }).then(response => {
          socketClient.leaveRoom(room._id);
        });

        if (this.isCurrentRoom(room)) {
          if (roomIndex < this.rooms.length) {
            this.showRoom(this.rooms[roomIndex]);
          } else {
            this.showRoom(this.rooms[this.rooms.length - 1]);
          }
        }
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
    min-width: 200px;

    .resize-handle {
      width: 10px;
      cursor: col-resize;
      position: relative;
      right: -5px;
    }

    #room-list {
      padding: 0.5em;
      flex-grow: 1;

      #create-container {
        text-align: center;
        margin: 0.25em;
      }

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
