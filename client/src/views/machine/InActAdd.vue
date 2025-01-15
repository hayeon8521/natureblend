
<template>
  <ModalMachine @click.self="closeModal">
    <template v-slot:header>
      <h1 class="modal-title fs-5">비가동 설비 등록</h1>
    </template>
    <template v-slot:body>
      
      <div class="container-fluid py-4">
        <div class="inactBody row gy-3" v-bind="inActData">
          <div class="row gx-3 gy-2 align-items-center">
            <div class="col-3">
              <label for="machineNum">설비 번호</label>
            </div>
            <div class="col">
              <input class="form-control" type="number" id="machineNum" name="machineNum"
                     v-model.number="inActData.machine_num" :readonly="machineCheck"/>
            </div>
          </div>

          <div class="row gx-3 gy-2 align-items-center">
            <div class="col-3">
              <label for="machineName">설비 이름</label>
            </div>
            <div class="col">
              <input class="form-control" type="text" id="machineName" name="machineName"
                     v-model="inActData.machine_name" :readonly="machineCheck"/>
            </div>
          </div>

          <div class="row gx-3 gy-2 align-items-center">
            <div class="col-3">
              <label for="machineLocation">설비 위치</label>
            </div>
            <div class="col">
              <input class="form-control" type="text" id="machineLocation" name="machineLocation"
                     v-model="inActData.machine_location" :readonly="machineCheck"/>
            </div>
          </div>

          <div class="row gx-3 gy-2 align-items-center">
            <div class="col-3">
              <label for="StartDate">비가동 일시</label>
            </div>
            <div class="col">
              <div class="row">
                <div class="col-sm-5">
                  <input class="form-control" type="datetime-local" id="StartDate" name="StartDate" v-model="inActData.inact_start_time"/>
                </div>
                <div class="col-sm-2 align-self-center text-center"><a> ~ </a></div>
                <div class="col-sm-5">
                  <input class="form-control" type="datetime-local" id="EndDate" name="EndDate" v-model="inActData.inact_end_time"/>
                </div>
              </div>
            </div>
          </div>

          <div class="row gx-3 gy-2 align-items-center">
            <div class="col-3">
              <a>비가동 사유</a>
            </div>
            <div class="col">
              <select class="form-select" aria-label="Default select example"
                      v-model="inActData.inact_type">
                <option value="점검">점검</option>
                <option value="고장">고장</option>
                <option value="휴식">휴식</option>
                <option value="기타">기타</option>
              </select>
            </div>
          </div>

          <div class="row gx-3 gy-2 align-items-center">
            <div class="col-3">
              <label for="inActInfo">비고</label>
            </div>
            <div class="col">
              <input class="form-control" type="text" id="inActInfo" name="inActInfo" v-model="inActData.inact_info" />
            </div>
          </div>

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
        등록
      </button>
    </template>
  </ModalMachine>

</template>


<script>
import ModalMachine from "@/views/natureBlendComponents/modal/ModalMachine.vue";
import userDateUtils from "@/utils/useDates.js";
import { ajaxUrl } from '@/utils/commons.js';
import axios from 'axios';
import { mapMutations } from "vuex";

export default {
  name: "inActAdd",
  props: {
    machineNo: Number,
  },
  components: {
    ModalMachine,
  },
  data() {
    return {
      inActData: {
        machine_num: '',
        machine_name: '',
        machine_location: '',
        inact_start_time: '',
        inact_end_time: '', // null 허용
        inact_type: '',
        inact_info: '', // type이 기타인 경우만 체크
        inact_start_emp: this.$store.state.loginInfo.emp_num, // 현재 작업자
        inact_end_emp: '',
      },

      // 설비 정보 확인
      machineCheck: false,
      machineData: {},

      fullInput: false,
      isInsert: false,
    }
  },
  updated() {
    this.inActData.inact_start_time = this.getToday();
    
    // 설비 번호 있는 경우
    if(this.machineNo > 0) {

      this.machineCheck = true;
      this.getMachinData();
    }
  },
  methods: {
    // 로그인 정보
    ...mapMutations(["addLoginInfo"]),

    async getMachinData() {
      let result = await axios.get(`${ajaxUrl}/machine/machineInfo/${this.machineNo}`)
                              .catch(err => console.log(err));
      this.machineData = result.data;

      this.inActData.machine_num = this.machineNo;
      this.inActData.machine_name = this.machineData.machine_name;
      this.inActData.machine_location = this.machineData.machine_location;

    },

    // 버튼
    closeModal() {
      this.$emit('closeModal');
      this.deleteVal();
    },
    confirm() {
      this.inActData.inact_start_time = this.dateFormat(this.inActData.inact_start_time, 'yyyy-MM-dd hh:mm:ss');
      if(this.inActData.inact_end_time != ''){
        this.inActData.inact_end_time = this.dateFormat(this.inActData.inact_end_time, 'yyyy-MM-dd hh:mm:ss');
      }
      this.inActInsert();
      this.deleteVal();
    },

    // 모달 데이터 삭제
    deleteVal() {
      let startNo = this.inActData.inact_start_emp;
      let endNo = this.inActData.inact_end_emp;
      for(let key in this.inActData){
        this.inActData[key] = '';
      }
      this.inActData.inact_start_emp = startNo;
      this.inActData.inact_end_emp = endNo;
    },

    // insert 동작
    async inActInsert() {
      let obj = {
        machine_num: this.inActData.machine_num,
        inact_start_time: this.inActData.inact_start_time,
        inact_type: this.inActData.inact_type,
        inact_info: this.inActData.inact_info,
        inact_start_emp: this.inActData.inact_start_emp,
      }
      if(this.inActData.inact_end_time != ''){
        obj.inact_end_time = this.inActData.inact_end_time;
        obj.inact_end_emp = this.inActData.inact_start_emp;
      }

      let result = await axios.post(`${ajaxUrl}/inActs/inActInsert`, obj)
                              .catch(err => console.log(err));
      let addRes = result.data;
      if(addRes.inact_num > 0){
        this.$notify({
          text: "비가동 내용 등록이 성공했습니다.",
          type: 'success',
        });
        this.inActUpdate();
      } else {
        this.$notify({
          text: "비가동 내용 등록이 실패했습니다.",
          type: 'error',
        });
        this.$emit('confirm', this.isInsert);
      }
    },

    // 비가동으로 변경
    async inActUpdate() {
      let obj = {
        machine_state: 'stop',
      }
      
      let result = await axios.put(`${ajaxUrl}/machine/machineUpdate/${this.machineNo}`, obj)
                              .catch(err => console.log(err));
      let updateRes = result.data;

      if(updateRes.result) {
        console.log('설비 정지');
        this.isInsert = true;
        this.$emit('confirm', this.isInsert);
      } else {
        console.log('정지 실패');
      }
    },

    
    // 날짜 관련
    getToday() {
      return this.dateFormat(null, 'yyyy-MM-dd hh:mm:ss');
    },
    dateFormat(value, format) {
      return userDateUtils.dateFormat(value, format);
    }
  },
  watch: {
    // 유효성 체크
    inActData: {
      handler(newVal) {
        let btnActive = true;
        console.log(newVal);
        for(let key in newVal) {
          switch(key) {
            case 'inact_end_time':
              break;
            case 'inact_end_emp':
              break;
            case 'inact_info':
              if(newVal['inact_type'] == '기타' && newVal[key] == '') btnActive = false;
              break;
            default:
              // console.log('공백 체크 : ', key);
              
              if(newVal[key] == '') btnActive = false;
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

button {
  width: 100px !important;
  color: white !important;
}

.machineBody {
  padding-left: 29px;
}
</style>