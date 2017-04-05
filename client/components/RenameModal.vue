<template>
  <modal @close="$emit('close')">
    <div slot="title">Rename Room</div>
      <div id="rename-room" slot="body">
        <form @submit.prevent="save()">
          <input id="rename-room-name" type="text" v-model="roomName" />
        </form>
      </div>
      <div slot="footer">
        <button type="button" @click="$emit('close')">Cancel</button>
        <button :disabled="roomName.length === 0" @click="save()">Save</button>
      </div>
  </modal>
</template>

<script>
  import Modal from './Modal.vue';

  export default {
    created() {
      this.roomName = this.$store.state.currentRoom.name;
      setTimeout(() => document.getElementById('rename-room-name').focus(), 0);
    },
    methods: {
      save() {
        this.$store.dispatch('renameRoom', this.roomName);
        this.$emit('close');
      }
    },
    components: {
      Modal
    },
    data() {
      return {
        roomName: ''
      };
    }
  };
</script>

<style lang="sass">
  #rename-room {
    input {
      width: 100%;
      font-size: 1em;
    }
  }
</style>
