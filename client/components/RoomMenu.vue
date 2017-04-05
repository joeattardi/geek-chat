<template>
  <div>
    <div id="room-menu" @click.stop>
      <div class="menu-item">Change topic</div>
      <div class="menu-item" @click="openRenameModal()">Rename room</div>
      <hr />
      <div class="menu-item delete">Delete room</div>
    </div>

  </div>
</template>

<script>
  export default {
    methods: {
      openRenameModal() {
        this.$emit('showRenameModal');
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
