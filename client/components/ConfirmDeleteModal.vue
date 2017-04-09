<template>
  <modal @close="$emit('close')">
    <div slot="title">Delete Room</div>
    <div id="delete-room-body" slot="body">
      Are you sure you want to delete this room?
    </div>
    <div slot="footer">
      <button type="button" @click="$emit('close')">Cancel</button>
      <button type="button" @click="deleteRoom()">Delete</button>
    </div>
  </modal>
</template>

<script>
  import Modal from './Modal.vue';

  export default {
    components: {
      Modal
    },
    computed: {
      rooms() {
        return this.$store.state.user.rooms;
      }
    },
    methods: {
      deleteRoom() {
        const roomIndex = this.rooms.indexOf(this.$store.state.currentRoom);
        this.$store.dispatch('deleteRoom');
        if (roomIndex < this.rooms.length) {
          this.$store.dispatch('setCurrentRoom', this.rooms[roomIndex]);
        } else {
          this.$store.dispatch('setCurrentRoom', this.rooms[this.rooms.length - 1]);
        }

        this.$emit('close');
      }
    }
  };
</script>
