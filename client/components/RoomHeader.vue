<template>
  <div id="chat-room-header">
    <div id="chat-room-icon">
      <i class="fa fa-2x fa-users" aria-hidden="true"></i>
    </div>
    <div id="chat-room-header-text">
      <div id="chat-room-name" v-if="currentRoom">{{ currentRoom.name }}</div>
      <div id="chat-room-topic" v-if="currentRoom">{{ currentRoom.topic }}</div>
    </div>
    <div id="chat-room-header-tools">
      <span id="chat-room-menu-trigger" @click="toggleRoomMenu">
        <i class="fa fa-lg fa-ellipsis-h" aria-hidden="true"></i>
      </span>
      <room-menu @showRenameModal="openRenameModal()"
                 @showChangeTopicModal="openChangeTopicModal()"
                 v-if="showRoomMenu" />
      <rename-modal v-if="showRenameModal" @close="closeRenameModal()" />
      <change-topic-modal v-if="showChangeTopicModal" @close="closeChangeTopicModal()" />
    </div>
  </div>
</template>

<script>
  import RoomMenu from './RoomMenu.vue';
  import RenameModal from './RenameModal.vue';
  import ChangeTopicModal from './ChangeTopicModal.vue';

  export default {
    components: {
      RoomMenu,
      RenameModal,
      ChangeTopicModal
    },
    methods: {
      openChangeTopicModal() {
        this.showChangeTopicModal = true;
        this.hideRoomMenu();
      },
      closeChangeTopicModal() {
        this.showChangeTopicModal = false;
      },
      openRenameModal() {
        this.showRenameModal = true;
        this.hideRoomMenu();
      },
      closeRenameModal() {
        this.showRenameModal = false;
      },
      hideRoomMenu() {
        this.showRoomMenu = false;
        document.removeEventListener('click', this.hideRoomMenu);
      },
      toggleRoomMenu() {
        this.showRoomMenu = !this.showRoomMenu;

        setTimeout(() => {
          if (this.showRoomMenu) {
            document.addEventListener('click', this.hideRoomMenu);
          } else {
            document.removeEventListener('click', this.hideRoomMenu);
          }
        }, 0);
      }
    },
    data() {
      return {
        showRoomMenu: false,
        showRenameModal: false,
        showChangeTopicModal: false
      };
    },
    computed: {
      currentRoom() {
        return this.$store.state.currentRoom;
      }
    }
  };
</script>

<style lang="sass">
  @import '../scss/variables';

  #chat-room-header {
    background: $panel-color;
    border-bottom: 1px solid $panel-border-color;
    padding: 0.5em;
    display: flex;
    align-items: center;

    #chat-room-icon {
      margin-right: 0.5em;
      color: #999999;
    }

    #chat-room-header-text {
      flex-grow: 1;

      #chat-room-name {
        font-size: 1em;
        font-weight: bold;
      }

      #chat-room-topic {
        font-size: 0.75em;
      }
    }

    #chat-room-header-tools {
      color: #999999;

      #chat-room-menu-trigger {
        cursor: pointer;

        &:hover {
          color: #000000;
        }
      }
    }
  }
</style>
