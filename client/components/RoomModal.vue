<template>
  <modal @close="$emit('close')">
    <div slot="title">New Chat</div>
    <div slot="body">
      <div id="room-modal-filter-container">
        <i class="fa fa-search" aria-hidden="true"></i>
        <input id="room-modal-filter" placeholder="Filter" v-model="filter" type="text" />
      </div>
      <div v-if="loading" id="room-modal-spinner">
        <spinner color="#CCCCCC" />
      </div>
      <div v-else id="room-modal-rooms">
        <div @click="joinRoom(room)" class="room-modal-room" v-for="room in filteredRooms">
          <i class="fa fa-users" aria-hidden="true"></i>
          {{room.name}}
        </div>
      </div>
    </div>
  </modal>
</template>

<script>
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
        loading: true
      };
    },
    methods: {
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

    .room-modal-room {
      cursor: pointer;
      padding: 0.25em;

      &:hover, &:focus {
        background-color: #CCCCCC;
      }
    }
  }
</style>
