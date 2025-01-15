<!-- 
    메뉴 : 자재>자재재고>자재 LOT 조회 메뉴 [페기처리]모달
-->
<template>
    <div class="modal fade" @click.self="closeModal" :class="{ show: isShowModal }" id="exampleModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header" style="background-color: #e9ecef;">
            <h1 class="modal-title fs-5" id="exampleModalLabel">폐기 처리</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
           <div class="modal-body" v-if="isShowModal">
               <div class="container my-4">
                 <div class="table-responsive">
                    <table class="table table-bordered text-center">
                        <tbody>
                            <tr>
                                <th>로트번호</th>
                                <td class="fw-bold text-dark">{{ deleteList.lot_code }}</td>
                            </tr>
                            <tr>
                                <th>자재명</th>
                                <td class="fw-bold text-danger fs-4">{{ deleteList.material_name }}</td>
                            </tr>
                            <tr>
                                <th>업체명</th>
                                <td class="fw-bold">{{ deleteList.com_name }}</td>
                            </tr>
                            <tr>
                                <th>현재고</th>
                                <td class="fw-bold">{{ deleteList.stok_qty }}</td>
                            </tr>
                            <tr>
                                <th>상태</th>
                                <td class="fw-bold text-danger fs-4">{{ deleteList.material_nomal }}상품</td>
                            </tr>
                            <tr>
                                <th>유통기한</th>
                                <td class="fw-bold text-danger fs-4">{{ deleteList.limit_date }}</td>
                            </tr>
                            <tr>
                                <th>폐기 사유 선택</th>
                                <td>
                                  <select v-model="trush_reason_temp" @change="change" class="form-select text-center">
                                    <option value="">직접입력</option>
                                    <option v-for="tra in trush_reason_arr" :key="tra.code" :value="tra.code">
                                      {{ tra.result }}
                                    </option>
                                  </select>
                                </td>
                            </tr>
                            <tr v-show="blainding">
                                <th>폐기 사유 입력</th>
                                <td><input type="text" v-model="trush_reason" class="form-control" style="background-color: white; padding-left: 20px; border:1px solid;" 
                                  :readonly="!!trush_reason_temp" ></td>
                            </tr>
                        </tbody>
                    </table>
                 </div>
               </div>
           </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="closeModal">닫기</button>
            <button type="button" class="btn" style="background-color: #f44335; color: white;" @click="confirm">폐기하기</button>
          </div>
        </div>
      </div>
    </div>
  </template>
 
 
 <script setup>
   import { defineProps, defineEmits, ref } from 'vue';     //watch
 
 const { isShowModal, deleteList } = defineProps({
       isShowModal: Boolean,
       deleteList: Object,
   });
 
   const trush_reason_arr = ref([
    {
      code:'A1',
      result:'유통기한 임박 및 초과',
    },
    {
      code:'A2',
      result:'불량 자재 검수 후 폐기',
    },
    {
      code:'A3',
      result:'이슈발생으로 인한 리콜',
    },
   ]);
  
  const blainding = ref(true);
  const trush_reason_temp = ref('');

   const change = () => {
    //console.log('aa', trush_reason.value);
    const matchedReason = trush_reason_arr.value.find((ele) => ele.code === trush_reason_temp.value);
    //console.log('bbb', matchedReason);
    if(matchedReason){
      blainding.value = false;
      trush_reason.value = matchedReason.result;
    }else{
      blainding.value = true;
      trush_reason.value = null;
    }
   }

   const emit = defineEmits(['closeModal', 'confirm']);
 
    const closeModal = () => {
        emit('closeModal'); // 부모 컴포넌트로 이벤트 전송
        trush_reason.value = '';
        blainding.value = true;
        trush_reason_temp.value = '';
    }; 
 
    const trush_reason = ref('');

    const confirm = () => {
      //console.log(trush_reason.value);
      emit('confirm', trush_reason.value); // 부모로 원본 데이터를 전달
      trush_reason.value = '';
      blainding.value = true;
      trush_reason_temp.value = '';
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
    .table tbody th, .table tbody td {
      vertical-align: middle;
    }
  </style>