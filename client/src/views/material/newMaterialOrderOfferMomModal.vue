<!-- 
    메뉴 : 자재>자재발주>자재 발주 관리 [개별주문 모달 > 자재리스팅 그리드[부모] ]
-->
<template>
  <div class="modal fade" @click.self="closeModal" :class="{ show: isShowModal }" id="exampleModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" :style="{ maxWidth: width + 'px' }">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">{{ modalTitle }}</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <slot name="list">slot</slot>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="closeModal">{{ noBtn }}</button>
          <button type="button" class="btn btn-success" @click="confirm">{{ yesBtn }}</button>
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
  .modal-body {
    max-height: 500px;
  }
}
.modal-header {
  background-color: #e9ecef;
}
.show {
  display: block;
}
button {
  font-size: 16px;
}
</style>