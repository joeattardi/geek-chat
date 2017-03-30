<template>
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title">
            <slot name="title">Modal Header</slot>
          </div>
          <i class="fa fa-times" @click="$emit('close')"></i>
        </div>
        <div class="modal-body">
          <slot name="body"></slot>
        </div>
        <div class="modal-footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    created() {
      document.addEventListener('keyup', this.maybeClose);
    },
    destroyed() {
      document.removeEventListener('keyup', this.maybeClose);
    },
    methods: {
      maybeClose(event) {
        if (event.keyCode === 27) {
          this.$emit('close');
        }
      }
    }
  };
</script>

<style lang="sass">
  @import '../scss/variables';

  .modal-mask {
    position: fixed;
    z-index: 9999;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: table;
  }

  .modal-wrapper {
    display: table-cell;
    vertical-align: middle;

    .modal {
      background-color: $panel-color;
      margin: 0 auto;
      width: 300px;

      .modal-header {
        padding: 0.5em;
        background: $brand-color;
        color: #FFFFFF;
        display: flex;

        .modal-title {
          flex-grow: 1;
        }

        .fa-times {
          cursor: pointer;
          align-self: center;
        }
      }

      .modal-body {
        padding: 20px;
      }

      .modal-footer {
        padding: 20px;
        padding-top: 0;
        text-align: center;
      }
    }
  }
</style>
