<template>
  <div class="container-fluid py-4">
    <h3>정비 요청 내역</h3>

    <div class="row align-items-center">

      <div class="col-8">
        <!-- 정비 요청 내역 그리드 -->
        <div class="grid-container" >
          <ag-grid-vue
            :rowData="requestRow"
            :columnDefs="requestCol"
            :theme="theme"
            @grid-ready="onReady"
            :rowHeight="50"
            style="height: 493px;"
            :pagination="true"
            :paginationPageSize="8"
            :paginationPageSizeSelector="[8, 16, 40, 80]"
            @rowClicked="rowClick"
            :noRowsOverlayComponent="CustomNoRowsOverlay"
          ></ag-grid-vue>
        </div>
      </div>

      <!-- 입력페이지 -->
      <div class="col-4 requestInfo">
        <!-- 수정 / 완료 탭 버튼 -->
        <div class="row my-3 align-items-center tapDiv">
          <div class="col tap" style="border-right: 2px solid black;"><a class="tapBtn" @click="updateTap">요청 수정</a></div>
          <div class="col tap"><a class="tapBtn" @click="completeTap">작업 완료</a></div>
        </div>

        <div class="inputDiv">
          <div class="row my-3 align-items-center" style="text-align: center;">
            <h4 v-if="inputType == 'add'">정비 요청 등록</h4>
            <h4 v-if="inputType == 'update'">요청 내역 수정</h4>
            <h4 v-if="inputType == 'complete'">정비 완료 내용</h4>
          </div>

          <div class="row my-3 align-items-center">
            <div class="col-4">
              <label>설비 번호 : </label>
            </div>
            <div class="col">
              <input class="form-control" type="text" style="background-color: white;"
                     v-model="maintenanceInfo.machine_num"
                     @click="openModal"
                     readonly
                     placeholder="🔍"
              >
              
              <Modal
                :isShowModal="isShowModal"
                :modalTitle="'설비 선택'"
                :noBtn="'닫기'"
                :yesBtn="'선택'"
                @closeModal="closeModal"
                @confirm="confirm"
              >
                <template v-slot:list>
                  <ComList v-show="isShowModal" @selectData="selectFnc"/>
                </template>
              </Modal>

            </div>
          </div>

          <div class="row my-3 align-items-center">
            <div class="col-4">
              <label>설비 이름 : </label>
            </div>
            <div class="col">
              <input class="form-control" type="text" style="background-color: white;"
                    v-model="maintenanceInfo.machine_name" readonly>
            </div>
          </div>

          <div class="row my-3 align-items-center">
            <div class="col-4">
              <label>설비 분류 : </label>
            </div>
            <div class="col">
              <input class="form-control" type="text" style="background-color: white;"
                    v-model="maintenanceInfo.machine_type" readonly>
            </div>
          </div>

          <div class="row my-3 align-items-center">
            <div class="col-4">
              <label>설비 위치 : </label>
            </div>
            <div class="col">
              <input class="form-control" type="text" style="background-color: white;"
                    v-model="maintenanceInfo.machine_location" readonly>
            </div>
          </div>

          <div class="row my-3 align-items-center">
            <div class="col-4">
              <label>요청 사유 : </label>
            </div>
            <div class="col">
              <input class="form-control" type="text" style="background-color: white;"
                    v-model="maintenanceInfo.request">
            </div>
          </div>

          <div class="row my-3 align-items-center">
            <div class="col-4">
              <label>요청 일자 : </label>
            </div>
            <div class="col-8">
              <input class="form-control" type="datetime-local" style="background-color: white;"
                    v-model="maintenanceInfo.request_date">
            </div>
          </div>

          <div class="row my-3 align-items-center">
            <div class="col-4">
              <label>정비 내역 : </label>
            </div>
            <div class="col">
              <input class="form-control" type="text" readonly style="border: 1px solid;"
                    v-model="maintenanceInfo.maintenance_detail" v-if="inputType != 'complete'">
              <input class="form-control" type="text" style="background-color: white;"
                    v-model="maintenanceInfo.maintenance_detail" v-else>
            </div>
          </div>
        </div>

        <div class="row my-3 align-items-center justify-content-center">
          <div class="col-auto">
            <button
              class="btn btn-success w-100 mb-0 toast-btn"
              type="button"
              data-target="warningToast"
              @click="completeBtn"
            >
              완료
            </button>
          </div>
          <div class="col-auto">
            <button
              class="btn btn-danger w-100 mb-0 toast-btn"
              type="button"
              data-target="warningToast"
              @click="delBtn"
            >
              취소
            </button>
          </div>
        </div>
      </div>
      
    </div>

  </div>

</template>


<script setup>
import { ajaxUrl } from '@/utils/commons.js';
import axios from 'axios';
import theme from "@/utils/agGridTheme";
import userDateUtils from "@/utils/useDates.js";
import {shallowRef, onBeforeMount, ref} from 'vue';

import { useStore } from 'vuex';
import { useNotification } from "@kyvg/vue3-notification";  //노티 드리겠습니다
import CustomNoRowsOverlay from "@/views/natureBlendComponents/grid/noDataMsg.vue";

import Modal from "@/views/natureBlendComponents/modal/Modal.vue";
import ComList from "@/views/machine/MachineSelect.vue";


const store = useStore();
const checkJob = ref(
  store.state.loginInfo.job == '설비' ? true : store.state.loginInfo.position == '관리자' ? true : false
);


const requestRow = shallowRef([]);
const requestCol = shallowRef([
  { headerName: '설비번호', field: 'machine_num', cellStyle: { textAlign: "center" }, flex: 2 },
  { headerName: '설비분류', field: 'machine_type', flex: 2 },
  { headerName: '설비이름', field: 'machine_name', flex: 3 },
  { headerName: '요청사유', field: 'request', flex: 3 },
  { headerName: '요청자', field: 'request_emp_name', flex: 2 },
  { headerName: '요청일자', field: 'request_date', cellStyle: { textAlign: "center" }, flex: 3 },
]);


const maintenanceInfo = shallowRef({
  machine_num: '',
  machine_name: '',
  machine_type: '',
  machine_location: '',
  request: '',
  request_date: '',
  maintenance_detail: ''
});
const selectNo = shallowRef();

// 입력페이지 상태
const inputType = ref('add');

// 교체 모달
const isShowModal = ref(false);
const openModal = () => {
  isShowModal.value = true; 
}
const confirm = () => {
  closeModal();

}
const closeModal = () => {
  isShowModal.value = false;
}

const selectData = ref();
const selectFnc = (data) => {
  selectData.value = data;
  
  maintenanceInfo.value.machine_num = data.machine_num;
  maintenanceInfo.value.machine_name = data.machine_name;
  maintenanceInfo.value.machine_type = data.machine_type;
  maintenanceInfo.value.machine_location = data.machine_location;
  maintenanceInfo.value.machine_num = data.machine_num;
}

// 정비 요청 내역 데이터
const getRequests = async () => {
  let result = await axios.get(`${ajaxUrl}/maintenances/requestList`)
                          .catch(err => console.log(err));

  let newary = [];
  for(let data of result.data) {
    if(data.maintenance_state == 'wait') {
      newary.push(data);
    }
  }
  requestRow.value = newary;

  for(let i in requestRow.value) {
    requestRow.value[i].request_date = userDateUtils.dateFormat(requestRow.value[i].request_date, 'yyyy-MM-dd');
  }
}

const onReady = () => {
  // 페이징 영역 요소 추가
  const paginationPanel = document.querySelector('.ag-paging-panel');
  if (paginationPanel) {

    // 컨테이너 생성
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.gap = '5px'; // 버튼과 입력 필드 간격

    // 버튼 생성
    const button = document.createElement('button');
    button.textContent = '정비요청';
    button.style.marginRight = '10px';
    button.style.cursor = 'pointer';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.padding = '5px 10px';
    button.style.borderRadius = '4px';
    button.style.position = 'absolute';
    button.style.left = '10px';
    button.className = 'btn-success';

    // 버튼 클릭 이벤트
    button.addEventListener('click', () => {
      inputType.value = 'add';
      delInfo();
      selectNo.value = null;
    });

    // 컨테이너에 버튼과 입력 필드 추가
    container.appendChild(button);
    // 버튼을 페이지네이션 패널의 제일 앞에 추가
    paginationPanel.insertBefore(container, paginationPanel.firstChild);
  }

}

// 입력정보 삭제
const delInfo = () => {
  for(let key in maintenanceInfo.value) {
    maintenanceInfo.value[key] = '';
  }
}

// 행 클릭
const rowClick = (row) => {
  selectNo.value = row.data.maintenance_num;
  updateTap();
  getmaintenanceInfo();
}

// 정비 요청 상세 정보
const getmaintenanceInfo = async () => {
  let result = await axios.get(`${ajaxUrl}/maintenances/maintenanceInfo/${selectNo.value}`)
                          .catch(err => console.log(err));
  maintenanceInfo.value = result.data;
}

// 수정 / 완료 탭
const updateTap = () => {
  if(checkJob.value) {
    inputType.value = 'update';
  }
}
const completeTap = () => {
  if(checkJob.value) {
    inputType.value = 'complete';
  }
}

// 작성 완료 버튼
const completeBtn = () => {
  if(inputType.value == 'add') {
    requestInsert();
  } else if(inputType.value == 'update' || inputType.value == 'complete') {
    requestUpdate();
  }

  selectNo.value = null;

  getRequests();
  delInfo();
}

const { notify } = useNotification();  // 노티 내용변수입니다

// 정비 요청 등록
const requestInsert = async () => {
  let obj = {
    machine_num: maintenanceInfo.value.machine_num,
    request: maintenanceInfo.value.request,
    request_emp: store.state.loginInfo.emp_num,
    request_date: maintenanceInfo.value.request_date,
  }

  let result = await axios.post(`${ajaxUrl}/maintenances/request`, obj)
                          .catch(err => console.log(err));
  let addRes = result.data;

  if(addRes.maintenance_num > 0){
    notify({
      text: "정비 요청 등록이 성공했습니다.",
      type: 'success',
    });
  } else {
    notify({
      text: "정비 요청 등록이 실패했습니다.",
      type: 'error',
    });
  }
}

// 수정 / 완료 동작
const requestUpdate = async () => {
  let obj = {};
  if(inputType.value == 'update') { // 수정페이지인 경우
    obj.request = maintenanceInfo.value.request;
    obj.request_date = maintenanceInfo.value.request_date;
  } else if(inputType.value == 'complete') { // 등록 페이지인 경우
    obj.maintenance_detail = maintenanceInfo.value.maintenance_detail;
    obj.maintenance_state = 'done';
    obj.work_emp = store.state.loginInfo.emp_num; // 현재 사용자 정보 가져오는 기능으로 변경 예정
    obj.end_date = getToday();
  }

  let result = await axios.put(`${ajaxUrl}/maintenances/maintenanceUpdate/${selectNo.value}`, obj)
                          .catch(err => console.log(err));
  let updateRes = result.data;

  if(updateRes.result) {
    notify({
      text: "정비 요청 수정이 성공했습니다.",
      type: 'success',
    });
    getRequests();
  } else {
    notify({
      text: "정비 요청 수정이 실패했습니다.",
      type: 'error',
    });
  }
}

const delBtn = () => {
  delInfo();
  if(selectNo.value != null) {
    getmaintenanceInfo();
  }
}


// 날짜
const getToday = () => {
  return userDateUtils.dateFormat(null, 'yyyy-MM-dd hh:mm:ss');
}

// 마운트전
onBeforeMount(()=>{
  getRequests();
});

</script>




<style scoped lang="scss">
.requestInfo {
  background-color:  #e9ecef;
  border-radius: 10px;
  padding: 0;
}

input {
  background-color: #ffffff; /* 배경색 흰색 */
  border: solid 1px; /* 테두리 색상 */
  color: #495057; /* 텍스트 색상 */
}

.inputDiv {
  border-width: 1px 0;
  border-style: solid;
  border-color: black;
}
.inputDiv > .row {
  margin: 0 10px;
}



.tapDiv {
  margin: 0 !important;
  height: 40px;
}
.tap {
  text-align: center;
  padding: 0;
}
.tapBtn {
  display: block;
  width: 100%;
}

input::placeholder {
  text-align: right;
}
</style>

