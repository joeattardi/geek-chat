<template>
  <modal @close="$emit('close')">
    <div slot="title">Change Topic</div>
    <div id="change-topic" slot="body">
      <form @submit.prevent="save()">
        <input id="change-topic-value" type="text" v-model="topic" />
      </form>
    </div>
    <div slot="footer">
      <button type="button" @click="$emit('close')">Cancel</button>
      <button @click="save()">Save</button>
    </div>
  </modal>
</template>

<script>
  import Modal from './Modal.vue';

  export default {
    components: {
      Modal
    },
    created() {
      this.topic = this.$store.state.currentRoom.topic;
      setTimeout(() => document.getElementById('change-topic-value').focus(), 0);
    },
    methods: {
      save() {
        this.$store.dispatch('changeTopic', this.topic);
        this.$emit('close');
      }
    },
    data() {
      return {
        topic: ''
      };
    }
  };
</script>

<style lang="sass">
  #change-topic {
    input {
      width: 100%;
      font-size: 1em;
    }
  }
</style>
