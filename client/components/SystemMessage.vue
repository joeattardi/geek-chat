<template>
  <div class="system-message">
    {{ message.text }}
  </div>
</template>

<script>
  export default {
    props: {
      message: {
        type: Object,
        required: true
      }
    }
  };
</script>

<style lang="sass">
  .system-message {
    font-weight: bold;
    color: #999999;
    font-size: 0.9em;
  }
</style>
