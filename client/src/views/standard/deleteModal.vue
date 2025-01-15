<template>
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h3>정말 삭제하시겠습니까?</h3>
        <div class="button-container">
          <button @click="onDeleteConfirmed" class="btn btn-success">확인</button>
          <button @click="onDeleteCancelled" class="btn btn-danger">취소</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      showModal: Boolean
    },
    methods: {
      onDeleteConfirmed() {
        this.$emit("deleteConfirmed");
      },
      onDeleteCancelled() {
        this.$emit("deleteCancelled");
      }
    }
  };
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 150px;
    left: 770px;
    right: 0;
    bottom: 0;
    width: 20%;
    height: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }
  
  .modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    max-width: 100%;
    z-index: 10000;
  }
  
  .button-container {
    display: flex;
    justify-content: center; /* 버튼들을 가로로 중앙 정렬 */
    gap: 10px; /* 버튼 간의 간격 */
  }
  
  button {
    font-size: 14px; /* 글씨 크기 조정 */
    padding: 8px 12px; /* 버튼 크기 조정 */
  }
  
  /* btn 클래스의 스타일을 덮어쓰기 위해 ::v-deep 사용 */
  ::v-deep .btn {
    font-size: 14px;
    padding: 8px 12px;
  }
  
  ::v-deep .btn-success {
    background-color: #28a745;
    border-color: #28a745;
  }
  
  ::v-deep .btn-danger {
    background-color: #dc3545;
    border-color: #dc3545;
  }
  </style>
  