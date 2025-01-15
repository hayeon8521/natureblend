<template>
  <div class="modal fade" :class="{ show: isShowModal }" id="exampleModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" :class="[modalSize]">
      <div class="modal-content">
        <div class="modal-header">
          <slot name="header">slot</slot>
        </div>
        <div class="modal-body">
          <slot name="body">slot</slot>
        </div>
        <div class="modal-footer">
          <slot name="footer">slot</slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "modalMachine",
  props: {
    isShowModal: Boolean,
    modalSize: String,
  },

  data() {
    return {
      modalState: this.isShowModal,
    }

  },

}
</script>




<style scoped>
.modal {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  .modal-body {
    max-height: 500px;
  }
}
.show {
  display: block;
}

.modal-header {
  background-color: #e9ecef;
}
</style>