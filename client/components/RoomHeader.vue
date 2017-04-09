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
                 @showConfirmDeleteModal="openConfirmDeleteModal()"
                 v-if="showRoomMenu" />
      <transition name="fade">
        <rename-modal v-if="showRenameModal" @close="closeRenameModal()" />
      </transition>
      <transition name="fade">
        <change-topic-modal v-if="showChangeTopicModal" @close="closeChangeTopicModal()" />
      </transition>
      <transition name="fade">
        <confirm-delete-modal v-if="showConfirmDeleteModal" @close="closeConfirmDeleteModal()" />
      </transition>
    </div>
  </div>
</template>

<script>
  import RoomMenu from './RoomMenu.vue';
  import RenameModal from './RenameModal.vue';
  import ChangeTopicModal from './ChangeTopicModal.vue';
  import ConfirmDeleteModal from './ConfirmDeleteModal.vue';

  export default {
    components: {
      RoomMenu,
      RenameModal,
      ChangeTopicModal,
      ConfirmDeleteModal
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
      openConfirmDeleteModal() {
        this.showConfirmDeleteModal = true;
        this.hideRoomMenu();
      },
      closeConfirmDeleteModal() {
        this.showConfirmDeleteModal = false;
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
        showChangeTopicModal: false,
        showConfirmDeleteModal: false
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
    box-shadow: 1px 1px 1px #999999;

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

      .fade-enter, .fade-leave-to {
        opacity: 0;
      }

      .fade-enter-active, .fade-leave-active {
        transition: opacity 0.25s;
      }

      .fade-enter-to, .fade-leave {
        opacity: 1;
      }
    }
  }
</style>
