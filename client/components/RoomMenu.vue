<template>
  <div>
    <div id="room-menu" @click.stop>
      <div class="menu-item" @click="openChangeTopicModal()">Change topic</div>
      <div class="menu-item" v-if="isAdmin" @click="openRenameModal()">Rename room</div>
      <hr v-if="isAdmin" />
      <div class="menu-item delete" v-if="isAdmin" @click="openConfirmDeleteModal()">
        Delete room
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    methods: {
      openRenameModal() {
        this.$emit('showRenameModal');
      },
      openChangeTopicModal() {
        this.$emit('showChangeTopicModal');
      },
      openConfirmDeleteModal() {
        this.$emit('showConfirmDeleteModal');
      }
    },
    computed: {
      isAdmin() {
        return this.$store.state.currentRoom.admins.indexOf(this.$store.state.user._id) >= 0;
      }
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
