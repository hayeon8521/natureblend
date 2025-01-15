<template>
  <div class="modal fade" @click.self="closeModal" :class="{ show: isShowModal }" id="exampleModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" :style="{ maxWidth: width + 'px' }">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">{{ modalTitle }}</h1>
        </div>
        <div class="modal-body">
          <slot name="list">slot</slot>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="closeModal">{{ noBtn }}</button>
          <button type="button" class="btn btn-warning" @click="confirm">{{ yesBtn }}</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: "Modal",
  props: {
    isShowModal: Boolean,
    modalTitle: String,
    noBtn: String,
    yesBtn: String,
    width: Number
  },

  data() {
    return {
      modalState: this.isShowModal,
    }

  },
  
  methods: {
    closeModal() {
      this.$emit('closeModal')
    },

    confirm() {
      this.$emit('confirm')
    }
  }
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
  .modal-header {
    background-color: #e9ecef;
    > button {
      color: #222;
    }
  }
  .modal-body {
    max-height: 500px;
  }
}
.show {
  display: block;
}
button {
  font-size: 16px;
}
</style>