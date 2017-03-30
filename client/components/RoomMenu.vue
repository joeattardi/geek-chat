<template>
  <div>
    <div v-if="showMenu" id="room-menu" @click.stop>
      <div class="menu-item">Change topic</div>
      <div class="menu-item" @click="openRenameModal()">Rename room</div>
      <hr />
      <div class="menu-item delete">Delete room</div>
    </div>
    <rename-modal v-if="showRenameModal" @close="closeRenameModal()"/>
  </div>
</template>

<script>
  import RenameModal from './RenameModal.vue';

  export default {
    components: {
      RenameModal
    },
    methods: {
      openRenameModal() {
        this.roomName = this.$store.state.currentRoom.name
        this.showRenameModal = true;
        this.showMenu = false;

        setTimeout(() => {
          document.getElementById('rename-room-name').focus();
        }, 0);
      },
      closeRenameModal() {
        this.showRenameModal = false;
      }
    },
    data() {
      return {
        showMenu: true,
        showRenameModal: false,
        roomName: ''
      };
    }
  };
</script>

<style lang="sass">
  @import '../scss/variables';

  #room-menu {
    position: absolute;
    right: 0;
    padding: 0.5em;
    background: #FFFFFF;
    border-radius: 3px;
    border: 1px solid #AAAAAA;
    box-shadow: 1px 1px 1px #000000;
    width: 200px;

    .menu-item {
      cursor: pointer;
      color: #000000;
      font-size: 0.9em;
      padding: 0.25em;

      &:hover {
        background-color: $brand-color;
        color: #FFFFFF;
      }

      &.delete:hover {
        background-color: $error-color;
      }
    }
  }
</style>
