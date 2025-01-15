<template>
  <div class="modal fade" :class="{ show: isShowModal }" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-md">
      <div class="modal-content">
        <div class="modal-header" style="background-color: #e9ecef;">
          <!-- <h1 class="modal-title fs-5" id="exampleModalLabel">확인</h1> -->
          <slot name="title">title</slot>
        </div>
        <div class="modal-body">
          <slot name="list">slot</slot>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="closeModal">닫기</button>
          <button type="button" class="btn btn-success" @click="confirm">저장</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Modal",
  props: {
    isShowModal: Boolean
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
.show {
  display: block;
}
button {
  font-size: 16px;
}

.modal-header {
  padding: 15px; /* 헤더 여백 조정 */
}

.modal-footer {
  padding: 10px; /* 푸터 여백 조정 */
}

.modal-body {
  padding: 30px; /* 본문 여백 조정 */
}
</style>