<template>
  <!-- 모달로 구성 -->
  <ModalMachine @click.self="closeModal">
    <template v-slot:header>
      <h1 class="modal-title fs-5">정비 요청 등록</h1>
    </template>
    <template v-slot:body>
      <div class="requestBody" v-bind="requestData">
        <div class="modalRow">
          <label for="machineNo">설비 번호</label>
          <input type="number" id="machineNo" name="machineNo" v-model.number="requestData.machine_num"/>
        </div>

        <div class="modalRow">
          <label for="machineType">설비 분류</label>
          <input type="text" id="machineType" name="machineType" v-model="requestData.machine_type"/>
        </div>

        <div class="modalRow">
          <label for="machineName">설비 이름</label>
          <input type="text" id="machineName" name="machineName" v-model="requestData.machine_name"/>
        </div>

        <div class="modalRow">
          <label for="machineLocation">설비 위치</label>
          <input type="text" id="machineLocation" name="machineLocation" v-model="requestData.machine_location"/>
        </div>

        <div class="modalRow">
          <label for="request">요청 사유</label>
          <input type="text" id="request" name="request" v-model="requestData.request"/>
        </div>

      </div>
    </template>
    <template v-slot:footer>
      <button
        class="btn btn-secondary w-100 mb-0 toast-btn"
        type="button"
        data-target="warningToast"
        @click="closeModal"
      >
        닫기
      </button>
      <button
        class="btn btn-success w-100 mb-0 toast-btn"
        type="button"
        data-target="warningToast"
        @click="confirm"
      >
        등록
      </button>
    </template>

  </ModalMachine>

</template>

<script setup>
import ModalMachine from "@/views/natureBlendComponents/modal/ModalMachine.vue";
import userDateUtils from "@/utils/useDates.js";
import { ajaxUrl } from '@/utils/commons.js';
import axios from 'axios';
import { shallowRef } from 'vue';


// 변수
const requestData = shallowRef({
  machine_num: '',
  machine_type: '',
  machine_name: '',
  machine_location: '',
  request: ''
});
let isInsert = shallowRef(false);


// 메소드
// 정비 요청 등록
const requestInsert = async () => {
  let obj = {
    machine_num: requestData.value.machine_num,
    request: requestData.value.request,
    request_emp : 1,
  }
  
  obj.request_date = getToday();

  console.log(obj);

  let result = await axios.post(`${ajaxUrl}/maintenances/request`, obj)
                          .catch(err => console.log(err));
  let addRes = result.data;
  if(addRes.maintenance_num > 0){
    alert('등록 성공');
    isInsert.value = true;
    emit('confirm', isInsert);
  } else {
    alert('등록 실패');
    emit('confirm', isInsert);
  }
}


// 모달 동작
const emit = defineEmits(['closeModal', 'confirm']);
function closeModal() {
  emit('closeModal');
  deleteVal();
}
function confirm() {
  requestInsert();
  deleteVal();
}
function deleteVal() {
  for(let key in requestData.value){
    requestData.value[key] = '';
  }
}

// 날짜
const getToday = () => {
  return userDateUtils.dateFormat(null, 'yyyy-MM-dd hh:mm:ss');
}
</script>





