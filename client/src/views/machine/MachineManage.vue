<template>
  <ModalMachine @click.self="closeModal" :modalSize="modalSize">
    <template v-slot:header>
      <h1 class="modal-title fs-5" v-if="isUpdate">설비 수정</h1>
      <h1 class="modal-title fs-5" v-else>설비 등록</h1>
    </template>
    
    <template v-slot:body>
      <div class="container-fluid py-4">
        <div class="machineBody row gy-3" v-bind="machineData">
          <div class="row gx-3 gy-2 align-items-center">
            <div class="col-2">
              <label for="machineName">설비 이름</label>
            </div>
            <div class="col-6">
              <input class="form-control" type="text" id="machineName" name="machineName" v-model="machineData.machine_name"/>
            </div>
          </div>

          <div class="row gx-3 gy-2 align-items-center">
            <div class="col-2">
              <label for="machineImg">설비 이미지</label>
            </div>
            <div class="col-6" style="text-align: left;">
              <input type="file" id="machineImg" name="machineImg" @change="uploadImage"/>
            </div>
          </div>

          <div class="row gx-3 gy-2 align-items-center">
            <label class="col-sm-2 col-form-label">사용 여부</label>
            <div class="col-sm-6" style="text-align: left;">
              <label v-for="status in statusList" :key="status" class="me-3">
                {{ status }}
                <input
                  type="radio"
                  name="status"
                  :value="status"
                  v-model="machineData.machine_state"
                  :disabled="isUpdate"
                  class="form-check-input"
                />
              </label>
            </div>

          </div>

          <div class="row gx-3 gy-2 align-items-center">
            <div class="col-2">
              <label for="modelNum">모델 번호</label>
            </div>
            <div class="col-6">
              <input class="form-control" type="text" id="modelNum" name="modelNum" v-model="machineData.model_num"/>
            </div>
          </div>

          <div class="row gx-3 gy-2 align-items-center">
            <div class="col-2">
              <a>설비 분류</a>
            </div>
            <div class="col-3">
              <select class="form-select" aria-label="Default select example"
                      v-model="machineData.process_code">
                <option
                  v-for="item in typeSelect"
                  :key="item.process_code"
                  :value="item.process_code"
                >
                  {{ item.machine_type }}
                </option>
              </select>
            </div>
          </div>

          <div class="row gx-3 gy-2 align-items-center">
            <div class="col-2">
              <label for="clientNum">거래처</label>
            </div>
            <div class="col-6">
              <input class="form-control" 
                     type="text" id="clientNum" name="clientNum" 
                     @click="openClientModal('client')"
                     v-model="this.selectedCom"
                     readonly
                     placeholder="🔍"
              />
            </div>
            <Modal
                :isShowModal="isShowModal.client"
                :modalTitle="'거래처선택'"
                :noBtn="'닫기'"
                :yesBtn="'선택'"
                @closeModal="closeClientModal('client')"
                @confirm="confirmClientModal('client')"
            >
                <template v-slot:list>
                    <ComList v-show="isShowModal.client" @selectclient="selectclient"/>
                </template>
            </Modal>
          </div>

          <div class="row gx-3 gy-2 align-items-center">
            <div class="col-2">
              <label for="uph">UPH</label>
            </div>
            <div class="col-6">
              <div class="row align-items-center">
                <div class="col-11">
                  <input class="form-control uhpInput" type="number" id="uph" name="uph" v-model="machineData.uph">
                </div>
                <div class="col-1 uphUnit"
                     v-if="this.machineData.process_code == 'p1' ||
                     this.machineData.process_code == 'p3'"
                >개</div>
                <div class="col-1 uphUnit" v-if="this.machineData.process_code == 'p2'">ml</div>
              </div>
            </div>
          </div>

          <div class="row gx-3 gy-2 align-items-center">
            <div class="col-2">
              <label for="machineLocation">설비 위치</label>
            </div>
            <div class="col-6">
              <input class="form-control" type="text" id="machineLocation" name="machineLocation" v-model="machineData.machine_location"/>
            </div>
          </div>

          <div class="row gx-3 gy-2 align-items-center">
            <div class="col-2">
              <label for="empName" v-if="!isUpdate">등록자</label>
              <label for="empName" v-else>수정자</label>
            </div>
            <div class="col-6">
              <input class="form-control" type="text" id="empName" name="empName" v-model="this.machineData.emp_name" readonly/>
            </div>
          </div>

          <div class="row gx-3 gy-2 align-items-center">
            <div class="col-2">
              <label for="buyDate">구매 일자</label>
            </div>
            <div class="col-6">
              <input class="form-control" type="datetime-local" id="buyDate" name="buyDate" v-model="machineData.buy_date" v-bind:readonly="isUpdate"/>
            </div>
          </div>

          <!-- 부품 추가 버튼 -->
          <div>
            <button
              class="btn bg-gradient-warning mb-0 toast-btn"
              type="button"
              data-target="warningToast"
              @click="partCnt++"
              v-if="partCnt == 0 && !isUpdate"
            >
              부품 추가
            </button>
          </div>

        </div>

        <div v-for="i in partCnt" :key="i">
          <MachineParts 
            :partDataList="partDataList" 
            :rowNum="i" 
            :lastNum="partCnt" 
            :isUpdate="isUpdate"
            :oldPartNum="oldPartNum"
            :machineData="machineData"
            @add="addClicked" 
            @del="delClicked" 
            @chInput="partInput">
          </MachineParts>
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
        v-bind:disabled="!fullInput"
      >
        <a v-if="isUpdate" style="color: white;">수정</a>
        <a v-else style="color: white;">등록</a>
      </button>

    </template>
  </ModalMachine>


</template>


<script>
import ModalMachine from "@/views/natureBlendComponents/modal/ModalMachine.vue";
import MachineParts from "@/views/machine/MachineParts.vue";
import userDateUtils from "@/utils/useDates.js";
import { ajaxUrl, localUrl } from '@/utils/commons.js';
import axios from 'axios';
import { mapMutations } from "vuex";

import Modal from "@/views/natureBlendComponents/modal/Modal.vue";
import ComList from "@/views/machine/clientModal.vue";


export default {
  name: "MachineManage",

  props: {
    machineNo: Number,
    isUpdate: Boolean,
  },
  components: {
    ModalMachine,
    MachineParts,
    Modal,
    ComList,
  },
  data() {
    return {
      modalSize: 'modal-lg',
      localUrl: localUrl,
      imgUrlTest: '',
      machineData: {
        // 입력
        machine_name: '',
        machine_img: '',
        model_num: '',
        machine_state: '사용',
        client_num: '',
        machine_location: '',
        uph: '',
        buy_date: '',
        process_code: '',
        
        // 자동
        emp_name: this.$store.state.loginInfo.name,
        emp_num: this.$store.state.loginInfo.emp_num,
      },
      statusList: ["사용", "미사용"], // 작동 상태 옵션
      typeSelect: [], // 설비 분류 객체
      isInsert: false, // 등록 성공 여부,
      fullInput: false,
      imagePreview: null,


      // 부품 데이터
      partCnt: 0,
      partDataList: [],
      emptyData: {
        partNum: 0,
        partName: '',
        yearCycle: 0,
        monthCycle: 0,
        dayCycle: 0,
      },

      oldPartNum: [], // 수정시 기존 부품 정보

      
      //거래처 모달 
      searchCom:"", // 저장 될 거래처 명 
      selectedCom: "", //선택된 거래처 명

      isShowModal: {
      client: false, // 거래처 모달
      },
    }
  },
  beforeMount() {
    // 설비 분류 및 거래처 정보 가져오기
    this.getSelectItem();

    this.createPartsData();
  },
  updated() {
    // update 여부 확인
    if(this.machineNo > 0) {
      // 수정용 설비 정보
      this.getMachineInfo(this.machineNo);
  
      // 부품 정보
      this.getMachinePartInfo(this.machineNo);
    }
    else {
      this.machineData.buy_date = this.getToday();
    }

  },
  methods: {
    // 로그인 정보
    ...mapMutations(["addLoginInfo"]),


    // 선택지 정보 가져오기
    async getSelectItem() {
      let result = await axios.get(`${ajaxUrl}/machine/machineType`)
                              .catch(err => console.log(err));
      this.typeSelect = result.data;
    },

    // 모달 동작
    closeModal() {
      this.$emit('closeModal');
      if(!this.isUpdate) // 등록 페이지인경우 데이터 초기화
        this.deleteVal();
      // else // 수정 페이지인 경우
    },
    confirm() {
      this.machineData.buy_date = this.dateFormat(this.machineData.buy_date, 'yyyy-MM-dd hh:mm:ss');


      if(this.isUpdate) {
        this.machineUpdate();
      }
      else {
        this.machineInsert();
        this.deleteVal();
      }
    },
    deleteVal() {
      for(let key in this.machineData){
        this.machineData[key] = '';
      }
      this.machineData.machine_state = '사용';
      this.machineData.emp_num = this.$store.state.loginInfo.emp_num;
      this.machineData.emp_name = this.$store.state.loginInfo.name;
      this.selectedCom = '';
      this.searchCom = '';
      this.partCnt = 0;
    },

    // insert
    async machineInsert(){
      let insertState = this.machineData.machine_state == '사용' ? 'run' : 'stop';

      let obj = {
        machine_name: this.machineData.machine_name,// 설비 이름
        machine_img: this.machineData.machine_img,  // 설비 이미지
        machine_state: insertState,// 사용 여부
        model_num: this.machineData.model_num,      // 모델 번호
        client_num: Number(this.machineData.client_num),    // 거래처
        uph: this.machineData.uph,                  // 시간당 생산량
        machine_location: this.machineData.machine_location,// 설비 위치
        buy_date: this.machineData.buy_date,
        process_code: this.machineData.process_code,
        emp_num: this.machineData.emp_num     // 등록자
      }

      obj.upd = Number(this.machineData.uph) * 24;     // uph * 24

      if(this.machineData.machine_state == 'run'){
        obj.install_date = this.machineData.buy_date;
      }

      let result = await axios.post(`${ajaxUrl}/machine/machineInsert`, obj)
                              .catch(err => console.log(err));
      let addRes = result.data;

      // 부품 등록
      for(let i in this.partDataList) {
        let cycle = 0;
        if(this.partDataList[i].yearCycle > 0) cycle += this.partDataList[i].yearCycle;
        if(this.partDataList[i].monthCycle > 0) cycle += this.partDataList[i].monthCycle;
        if(this.partDataList[i].dayCycle > 0) cycle += this.partDataList[i].dayCycle;
        if(this.partDataList[i].part_name != '' && cycle > 0) {
          let check = await this.partInsert(this.partDataList[i], obj, addRes.machine_num);
          console.log(check);
        }
      }

      if(insertState == 'stop') {
        console.log('insert machine : ', addRes.machine_num);
        await this.inActInsert(addRes.machine_num, obj);
      }

      // 등록 성공 체크
      if(addRes.machine_num > 0){
        this.$notify({
          text: "설비 등록이 성공했습니다.",
          type: 'success',
        });
        this.isInsert = true;
        this.$emit('confirm', this.isInsert);
      } else {
        this.$notify({
          text: "설비 등록이 실패했습니다.",
          type: 'error',
        });
        this.$emit('confirm', this.isInsert);
      }
    },
    // 비가동 등록 동작
    async inActInsert(machineNo, insertData) {
      let obj = {
        machine_num: machineNo,
        inact_start_time: insertData.buy_date,
        inact_type: '기타',
        inact_info: '비가동 설비를 등록하였습니다.',
        inact_start_emp: insertData.emp_num,
      }

      await axios.post(`${ajaxUrl}/inActs/inActInsert`, obj).catch(err => console.log(err));
    },


    // 설비 데이터 가져오기
    async getMachineInfo(selectNo) {
      let result = await axios.get(`${ajaxUrl}/machine/machineInfo/${selectNo}`)
                              .catch(err => console.log(err));
      this.machineData = result.data;
      this.machineData.buy_date = this.dateFormat(this.machineData.buy_date, 'yyyy-MM-dd hh:mm:ss');
      this.machineData.machine_state = this.machineData.machine_state == 'run' ? '사용' : '미사용';
      this.machineData.emp_name = this.$store.state.loginInfo.name;
      this.selectedCom = this.machineData.com_name;
    },
    // update
    async machineUpdate() {
      let insertState = this.machineData.machine_state == '사용' ? 'run' : 'stop';

      let obj = {
        machine_name: this.machineData.machine_name,// 설비 이름
        machine_img: this.machineData.machine_img,  // 설비 이미지
        machine_state: insertState,// 사용 여부
        model_num: this.machineData.model_num,      // 모델 번호
        client_num: Number(this.machineData.client_num),    // 거래처
        uph: this.machineData.uph,                  // 시간당 생산량
        machine_location: this.machineData.machine_location,// 설비 위치
        buy_date: this.machineData.buy_date,
        process_code: this.machineData.process_code,
        
        // 수정 작업한 사원으로 변경
        emp_num: this.$store.state.loginInfo.emp_num,
      }
      
      obj.upd = Number(this.machineData.uph) * 24;     // uph * 24

      if(this.machineData.machine_state == 'run'){
        obj.install_date = this.machineData.buy_date;
      }
      
      let result = await axios.put(`${ajaxUrl}/machine/machineUpdate/${this.machineNo}`, obj)
                              .catch(err => console.log(err));
      let updateRes = result.data;

      // 부품 교체시 제거된 부품 삭제
      for(let i in this.oldPartNum) {
        await this.partDelete(this.oldPartNum[i]);
      }
      // 부품 교체
      for(let i in this.partDataList) {
        await this.partUpdate(this.partDataList[i].partNum);
      }

      if(updateRes.result) {
        this.$notify({
          text: "설비 수정이 성공했습니다.",
          type: 'success',
        });
        this.$emit('confirm');
      } else {
        this.$notify({
          text: "설비 수정이 실패했습ㅋ니다.",
          type: 'error',
        });
        this.$emit('confirm');
      }
    },

    // 부품 관련
    addClicked() {
      if(this.partCnt < 4) {
          this.partCnt++;
      } else {
        this.$notify({
          text: "최대 부품 수입니다.",
          type: 'error',
        });
      }
      console.log('MM part : ', this.partDataList);

    },
    async delClicked(row) {
      let newArray = [...this.partDataList];

      newArray.splice(row-1, 1);
      newArray.length = 4;
      newArray[3] = {...this.emptyData};

      this.partDataList = newArray;
      this.partCnt--;
    },
    partInput(row, data) { // 부품 정보 입력 감지 => 자식 컴포넌트에서 입력된 값을 객체 배열에 저장
      this.partDataList[row-1] = data;
    },
    createPartsData() { // 빈 객체 배열 생성(beforeMount시 작동)
      this.partDataList.length = 4;
      for(let i = 0; i < 4; i++) {
        this.partDataList[i] = {...this.emptyData};
      }
    },

    // 부품 등록
    async partInsert(partData, machineData, machineNo) {
      let cycle = 0;
      if(partData.yearCycle > 0) cycle += (partData.yearCycle * 365);
      if(partData.monthCycle > 0) cycle += (partData.monthCycle * 30);
      if(partData.dayCycle > 0) cycle += partData.dayCycle;

      let obj = {
        machine_type: machineData.process_code,
        part_name: partData.partName,
        replace_cycle: cycle,
        client_num: machineData.client_num,
        part_location: machineData.machine_location,
        buy_date: machineData.buy_date,
        replace_date: machineData.buy_date,
        machine_num: machineNo
      }

      let result = await axios.post(`${ajaxUrl}/parts/partInsert`, obj)
                              .catch(err => console.log(err));
      let addRes = result.data;

      if(addRes.part_num > 0){
        return true;
      } else {
        return false;
      }
    },

    // 기존 부품 번호
    async getMachinePartInfo(selectNo) {
      let result = await axios.get(`${ajaxUrl}/machine/machinePartList/${selectNo}`)
                              .catch(err => console.log(err));

      let getArray = [];
      for(let i in result.data) {
        let partNo = result.data[i].part_num;
        getArray.push(partNo);
      }
      this.oldPartNum = [...getArray];
      this.partCnt = result.data.length;
    },
    
    // 기존 부품 삭제
    async partDelete(pno) {
      let deleteCheck = true;
      for(let i in this.partDataList) {
        if(this.partDataList[i].partNum == pno) {
          deleteCheck = false;
        }
      }
      if(deleteCheck) {
        await axios.delete(`${ajaxUrl}/parts/partDelete/${pno}`).catch(err => console.log(err));
      } 
    },

    // 부품 교체
    async partUpdate(pno) {
      let updateCheck = true;
      for(let i in this.oldPartNum) {
        if(this.oldPartNum[i] == pno) {
          updateCheck = false;
        }
      }

      if(updateCheck) {
        let obj = {
          replace_date: this.getToday(),
          machine_num: this.machineNo,
        }
        
        await axios.put(`${ajaxUrl}/parts/partUpdate/${pno}`, obj).catch(err => console.log(err));
      }
    },



    // 날짜 관련
    getToday() {
      return this.dateFormat(null, 'yyyy-MM-dd hh:mm:ss');
    },
    dateFormat(value, format) {
      return userDateUtils.dateFormat(value, format);
    },

    // 이미지 관련
    async uploadImage(event) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append('machineImg', file);
      
      formData.append('previousImgPath', this.machineData.machine_img); // 기존 이미지 경로

      try {
        const response = await axios.post(`${ajaxUrl}/machine/uploadImg`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        console.log('가져온 경로 : ', response.data.filePath);
        this.machineData.machine_img = response.data.filePath;
      } catch (error) {
        console.error('이미지 업로드 실패:', error);
      }
    },

    // 거래처 모달
    selectclient(client){
        this.selectedCom = client.com_name; 
        this.machineData.client_num = client.client_num;
    },
    openClientModal(modalType,index) {
        this.isShowModal[modalType] = true; 
        this.indexNum = index; //현재 선택된 index
        console.log(this.indexNum);
        console.log(`${modalType} modal open`);
    },
    confirmClientModal(modalType){
        if (modalType === 'client') {
        this.searchCom = this.selectedCom;
      } 

      this.closeClientModal(modalType); // 모달 닫기
    },
    closeClientModal(modalType) {
        this.isShowModal[modalType] = false;
    },
  },
  // 유효성 체크 : 설비 이름, 모델 번호, 설비 분류, 제작업체, uph, 설비 위치, 등록자
  watch: {
    machineData: {
      handler(newVal) {
        let btnActive = true;
        for(let key in newVal) {
          if(newVal[key] == '' && key != 'machine_img') {
            btnActive = false;
            break;
          }
        }
        this.fullInput = btnActive;
      },
      deep: true
    },

  }
};
</script>

<style scoped lang="scss">
.modalRow > * {
  display: inline-block;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox  */
input[type='number'] {
  -moz-appearance: textfield;
}


/* 일반 input 태그 스타일 */
input {
  background-color: #ffffff; /* 배경색 흰색 */
  border: solid 1px #ced4da; /* 테두리 색상 */
  color: #495057; /* 텍스트 색상 */
}
/* readonly 상태의 input 태그 스타일 */
input:read-only {
  background-color: #ffffff; /* 배경색 흰색 고정 */
  color: #495057; /* 텍스트 색상 유지 */
  // cursor: not-allowed; /* 읽기 전용 표시를 위한 커서 */
}

/* input 포커스 상태에서도 배경색 유지 */
input:focus {
  background-color: #ffffff; /* 포커스 시 배경색 흰색 유지 */
  border-color: #86b7fe; /* 선택 시 테두리 색상 약간 강조 */
  outline: none; /* 기본 브라우저 포커스 아웃라인 제거 */
}

/* readonly input 요소가 포커스되어도 스타일 유지 */
// input:read-only:focus {
//   background-color: #ffffff; /* 배경색 흰색 고정 */
//   border-color: #ced4da; /* readonly 상태에서는 테두리 기본값 */
//   outline: none; /* 포커스 아웃라인 제거 */
// }

select {
  background-color: white;
  padding-left: 20px;
  padding-right: 35px;
  background-color: #ffffff; /* 포커스 시 배경색 흰색 유지 */
  border: 1px solid #ced4da;
}
select:focus {
  background-color: #ffffff; /* 포커스 시 배경색 흰색 유지 */
  border-color: #86b7fe; /* 선택 시 테두리 색상 약간 강조 */
  outline: none; /* 기본 브라우저 포커스 아웃라인 제거 */
}


button {
  width: 100px !important;
}

.machineBody {
  padding-left: 29px;
}

.uphUnit {
  padding: 0;
  font-size: 20px;

}

input::placeholder {
  text-align: right;
}

</style>
