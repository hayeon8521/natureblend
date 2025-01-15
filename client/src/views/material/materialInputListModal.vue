<!-- 
    메뉴 : 자재>자재입고>자재 입고 조회 메뉴   [조회]모달
-->
<template>
   <div class="modal fade" @click.self="closeModal" :class="{ show: isShowModal }" id="exampleModal" tabindex="-1">
     <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
       <div class="modal-content">
         <div class="modal-header" style="background-color: #e9ecef;">
           <h1 class="modal-title fs-5" id="exampleModalLabel" style="font-family: Arial, Helvetica, sans-serif;">입고LOT별 현재고 조회</h1>
           <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
         </div>
         <div class="modal-body m-3" v-if="isShowModal">
          
            <table class="table table-bordered">
              <tbody>
                  <tr>
                    <td class="table-title">자재명</td>
                    <td style="color: black; text-align: center;"><h3>{{ newObject.material_name }}</h3></td>
                  </tr>
                  <tr>
                    <td class="table-title">로트번호</td>
                    <td style="color: black; text-align: center;">{{ newObject.lot_code }}</td>
                  </tr>
                  <tr>
                    <td class="table-title">정상수량</td>
                    <td class="highlight-green">{{ newObject.pass_stok_qty }}</td>
                  </tr>
                  <tr>
                    <td class="table-title">불량수량</td>
                    <td class="highlight-red">{{ newObject.reject_stok_qty }}</td>
                  </tr>
              </tbody>
            </table>

               <!-- <ul>
                    <li v-for="(row, index) in newObject" :key="index">
                    {{ row }}
                    </li>
                </ul> -->
         </div>
         <div class="modal-footer">
           <button type="button" class="btn btn-secondary" @click="confirm">닫기</button>
         </div>
       </div>
     </div>
   </div>
 </template>


<script setup>
 import { defineProps, defineEmits } from 'vue';     //watch

 const { isShowModal , newObject} = defineProps({
       isShowModal: Boolean,
       newObject: Array,
   });

   const emit = defineEmits(['closeModal', 'confirm']);

    const closeModal = () => {
        emit('closeModal'); // 부모 컴포넌트로 이벤트 전송
    }; 

   const confirm = () => {
     //console.log('최종 nuwList 데이터:', nuwList); 
     emit('confirm'); // 부모로 원본 데이터를 전달
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
   max-width: 360px;
   margin: auto;
   }


   .table-title {
   font-weight: bold;
   background-color: #e9ecef;
   text-align: center;
   color: black;
   vertical-align: middle;
}
.highlight-green {
   color: #4caf50;
   font-weight: bold;
   font-size: 32px;
   text-align: right;
}
.highlight-red {
   color: #f44335;
   font-weight: bold;
   font-size: 32px;
   text-align: right;
}
.table-bordered td, .table-bordered th {
   border: 1px solid #dee2e6 !important;
}
 </style>