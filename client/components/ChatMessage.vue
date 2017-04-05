<template>
  <div class="message">
    <span class="message-user">
      {{ message.user.fullName }}
    </span>
    <span class="message-timestamp">
      {{ formatTimestamp(message.timestamp) }}
    </span>
    <div class="message-text">{{ message.text }}</div>
  </div>
</template>

<script>
  import moment from 'moment';

  export default {
    props: {
      message: {
        type: Object,
        required: true
      }
    },
    methods: {
      formatTimestamp(timestamp) {
        return moment(timestamp).format('MMM D h:mm');
      }
    }
  };
</script>

<style lang="sass">
  @import '../scss/variables';

  .message {
    .message-user {
      vertical-align: middle;
      font-weight: bold;
      color: $brand-color;
      font-size: 0.8em;
    }

    .message-timestamp {
      vertical-align: middle;
      color: #AAAAAA;
      font-size: 0.8em;
    }

    .message-text {
      font-size: 0.8em;
    }
  }
</style>
