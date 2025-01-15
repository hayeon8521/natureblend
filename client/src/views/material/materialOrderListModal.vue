<!--자재 발주 조회메뉴의 취소 모달-->
<template>
   <div class="modal fade" @click.self="closeModal" :class="{ show: isShowModal }" id="exampleModal" tabindex="-1">
     <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
       <div class="modal-content">
         <div class="modal-header" style="background-color: #e9ecef;">
           <h1 class="modal-title fs-5" id="exampleModalLabel">발주서 취소</h1>
           <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
         </div>
          <div class="modal-body" v-if="isShowModal">
              <div class="container my-4">
                <div class="table-responsive">
                  <table class="table table-bordered align-middle">
                    <tbody>
                      <tr>
                        <th>발주번호</th>
                        <td>{{ deleteList.order_code }}</td>
                        <th scope="row">담당</th>
                        <td>{{ deleteList.name }}</td>
                      </tr>
                      <tr>
                        <th>자재명</th>
                        <td class="text-dark" style="font-weight: bold;">{{ deleteList.material_name }}</td>
                        <th>업체</th>
                        <td class="text-dark" style="font-weight: bold;">{{ deleteList.com_name }}</td>
                      </tr>
                      <tr>
                        <th>주문수량</th>
                        <td class="text-dark" style="font-weight: bold;">{{ deleteList.ord_qty }}</td>
                        <th>주문일</th>
                        <td>{{ deleteList.order_date }}</td>
                      </tr>
                      <tr>
                        <th>단가</th>
                        <td>{{ deleteList.unit_price }}</td>
                        <th>총액</th>
                        <td>{{ deleteList.total_price }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
          </div>
         <div class="modal-footer">
           <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="closeModal">닫기</button>
           <button type="button" v-if="totalcanceNO_display" class="btn" style="background-color: #f44335; color: white;" @click="confirm(1)">전체취소</button>
           <button type="button" class="btn" style="background-color: #fb8c00; color: white;" @click="confirm(2)">자재취소</button>
         </div>
       </div>
     </div>
   </div>
 </template>


<script setup>
  import { defineProps, defineEmits } from 'vue';     //watch

const { isShowModal, deleteList, totalcanceNO_display } = defineProps({
      isShowModal: Boolean,
      deleteList: Object,
      totalcanceNO_display: Boolean,
  });

console.log(deleteList);

  const emit = defineEmits(['closeModal', 'confirm']);

   const closeModal = () => {
       emit('closeModal'); // 부모 컴포넌트로 이벤트 전송
   }; 
 
   const confirm = (deleteNum) => {
     emit('confirm', deleteNum); // 부모로 원본 데이터를 전달
   };
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
  .modal-dialog {
    margin: auto;
  }
  table {
    border-collapse: collapse;
    width: 100%;
  }
  th {
    text-align: center;
  }
  td {
    text-align: left;
  }
  .table-bordered td, .table-bordered th {
    border: 1px solid #dee2e6 !important;
  }
</style>