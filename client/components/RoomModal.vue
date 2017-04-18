<template>
  <modal @close="$emit('close')">
    <div slot="title">New Chat</div>
    <div slot="body" @keyup="handleKeyup">
      <div id="room-modal-filter-container">
        <i class="fa fa-search" aria-hidden="true"></i>
        <input id="room-modal-filter" placeholder="Filter" v-model="filter" type="text" />
      </div>
      <div v-if="loading" id="room-modal-spinner">
        <spinner color="#CCCCCC" />
      </div>
      <div v-else id="room-modal-rooms" ref="roomContainer">
        <div @click="joinRoom(room)"
             :class="{ 'room-modal-room': true, selected: index === selectedIndex }"
             v-for="(room, index) in filteredRooms"
             :data-room-id="room._id"
        >
          <i class="fa fa-users" aria-hidden="true"></i>
          {{room.name}}
        </div>
      </div>
    </div>
  </modal>
</template>

<script>
  import _ from 'lodash';

  import Modal from './Modal.vue';
  import Spinner from './Spinner.vue';
  import socketClient from '../socketClient';

  export default {
    created() {
      this.$http.get('/rooms', {
        headers: {
          'authorization': this.$store.state.token
        }
      }).then(response => {
        this.loading = false;
        this.rooms = response.body.rooms.sort((a, b) => a.name.localeCompare(b.name));
      });
    },
    mounted() {
      document.getElementById('room-modal-filter').focus();
    },
    data() {
      return {
        rooms: [],
        filter: '',
        selectedIndex: 0,
        loading: true
      };
    },
    methods: {
      handleKeyup(event) {
        switch (event.keyCode) {
          case 40:
            this.selectedIndex = Math.min(this.selectedIndex + 1, this.filteredRooms.length - 1);
            this.scrollSelectedRoomIntoView();
            break;
          case 38:
            this.selectedIndex = Math.max(0, this.selectedIndex - 1);
            this.scrollSelectedRoomIntoView();
            break;
          case 13:
            const selectedRoomId = this.$refs.roomContainer.querySelector('.selected').dataset.roomId;
            const room = this.rooms.find(rm => rm._id === selectedRoomId);
            this.joinRoom(room);
            break;
        }
      },
      scrollSelectedRoomIntoView() {
        _.defer(() => this.$refs.roomContainer.querySelector('.selected').scrollIntoView());
      },
      joinRoom(room) {
        if (!this.$store.state.user.rooms.find(userRoom => userRoom._id === room._id)) {
          this.$http.post(`/join/${room._id}`, {}, {
            headers: {
              'authorization': this.$store.state.token
            }
          }).then(response => {
            this.$store.dispatch('joinRoom', room);
            socketClient.joinRoom(room._id);
          })
        }

        this.$store.dispatch('setCurrentRoom', room);

        this.$emit('close');
      }
    },
    computed: {
      filteredRooms() {
        return this.rooms.filter(room => room.name.toLowerCase().indexOf(this.filter.toLowerCase()) >= 0);
      }
    },
    components: {
      Modal,
      Spinner
    }
  };
</script>

<style lang="sass">
  #room-modal-filter {
    width: 100%;
    font-size: 1em;
  }

  #room-modal-filter-container {
    display: flex;

    .fa-search {
      align-self: center;
      margin-right: 0.25em;
    }
  }

  #room-modal-spinner {
    margin-top: 20px;
  }

  #room-modal-rooms {
    height: 100px;
    overflow-y: scroll;
    margin-top: 0.5em;
    background-color: #FFFFFF;
    border: 1px solid #AAAAAA;

    .room-modal-room {
      cursor: pointer;
      padding: 0.25em;

      &:hover, &:focus, &.selected {
        background-color: #CCCCCC;
      }
    }
  }
</style>
