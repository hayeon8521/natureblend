<template>
  <div class="container-fluid py-4">
    <h3>설비 조회</h3>
    <!-- 설비 검색 -->
    <div class="main-container">
      <div class="content overflow-hidden">

        <div class="row gx-3 align-items-center" style="margin: 0;">
          <!-- 작동 상태 -->
          <div class="col-sm-auto">
            <label class="col-form-label fw-bold">작동 상태</label>
            <div>
              <label class="me-3" v-for="status in statusList" :key="status">
                {{ status }}
                <input
                  class="form-check-input"
                  :value="status"
                  type="radio"
                  v-model="pickedStatus"
                >
              </label>
            </div>
          </div>
          
          <!-- 설비 분류 -->
          <div class="col-sm-auto">
            <label class="col-form-label fw-bold">설비 분류</label>
            <div>
              <label class="me-3" v-for="type in machineType" :key="type">
                {{ type }}
                <input
                  class="form-check-input"
                  :value="type"
                  type="checkbox"
                  v-model="pickedType"
                >
              </label>
            </div>
          </div>
        </div>
        
        <div class="row gx-3 align-items-center" style="margin: 10px 0;">
          <!-- 검색 옵션 -->
          <div class="col-auto">
            <select v-model="selectSearchType" class="form-select search">
              <option v-for="option in searchType" :key="option" :value="option">
                {{ option }}
              </option>
            </select>
          </div>
    
          <!-- 검색 텍스트 -->
          <div class="col-5">
            <input
              type="text"
              v-model="searchData"
              placeholder="검색 내용을 입력하세요"
              class="form-control search"
              @keydown.enter="enterkey"
            />
          </div>
        </div>

        <div class="row gx-3" style="margin: 20px 0 0; justify-content: center;">
          <!-- 검색 및 초기화 버튼 -->
          <div class="col-sm-auto">
            <button
              class="btn btn-success toast-btn"
              type="button"
              data-target="warningToast"
              @click="updateFilter"
            >
              검색
            </button>
          </div>
          <div class="col-sm-auto">
            <button
              class="btn btn-warning toast-btn"
              type="button"
              data-target="warningToast"
              @click="resetSearch"
            >
              초기화
            </button>
          </div>
        </div>

      </div>

    </div>
    

    <!-- 설비 리스트 -->
    <div class="grid-container work" >
      <ag-grid-vue
        :rowData="rowData"
        :columnDefs="columnDefs"
        :theme="theme"
       	@grid-ready="onReady"
        :rowHeight="50"
        style="height: 493px;"
        :pagination="true"
        :paginationPageSize="8"
        :paginationPageSizeSelector="[8, 16, 40, 80]"
        @cellClicked="cellClickFnc"
        :noRowsOverlayComponent="noRowsOverlayComponent"
      ></ag-grid-vue>
    </div>
    <div style="display: none">
        <CustomNoRowsOverlay/>
    </div>

    <MachineManage
      :isShowModal="isShowMachineAdd"
      :isUpdate="false"
      @closeModal="closeMachineAdd"
      @confirm="confirmMachineAdd"
    />
    <InActAdd :isShowModal="isShowInActAdd" :machineNo="machineNo" @closeModal="closeInActAdd" @confirm="confirmInActAdd"/>
    
  </div>
</template>

<script>
import MachineManage from "./MachineManage.vue";
import InActAdd from "./InActAdd.vue";
import { ajaxUrl } from '@/utils/commons.js';
import axios from 'axios';
import theme from "@/utils/agGridTheme";
import userDateUtils from "@/utils/useDates.js";
import {shallowRef} from 'vue';

import { mapMutations } from "vuex";
import CustomNoRowsOverlay from "@/views/natureBlendComponents/grid/noDataMsg.vue";

export default {
  name: "machineList",
  setup() {
    const machineList = shallowRef([]);
    const rowData = shallowRef([]);
    const columnDefs = shallowRef([
      { headerName: '번호', field: 'machine_num', cellStyle: { textAlign: "center" }, flex: 2 },
      { headerName: '공정이름', field: 'process_name', flex: 4 },
      { headerName: '모델번호', field: 'model_num', flex: 4 },
      { headerName: '설비분류', field: 'machine_type', flex: 4 },
      { headerName: '설비이름', field: 'machine_name', flex: 4 },
      { headerName: '설비위치', field: 'machine_location', flex: 3 },
      { 
        headerName: '작동상태',
        field: 'machine_state',
        cellStyle: { textAlign: "center" },
        flex: 3,
        cellClass: (params) => {
          return params.value === '작동중' ? 'green' : params.value === '작동정지' ? 'red' : ''
        }
      },
    ]);

    const getMachineList = async () => {
      let result = await axios.get(`${ajaxUrl}/machine/machineList`)
                              .catch(err => console.log(err));
      machineList.value = result.data;
      rowData.value = [...result.data];

      for(let i in rowData.value) {
        rowData.value[i].machine_state = rowData.value[i].machine_state == 'run' ? '작동중' : '작동정지';
      }
    }

    return {
      machineList,
      rowData,
      columnDefs,
      getMachineList,
    }
  },
  components: {
    MachineManage,
    InActAdd,
    CustomNoRowsOverlay,
  },
  
  data() {
    return {
      // 로그인 사원 권한 체크
      checkJob: this.$store.state.loginInfo.job == '설비' ? true : this.$store.state.loginInfo.position == '관리자' ? true : false,

      isShowMachineAdd: false,
      isShowInActAdd: false,
      theme: theme,
      inActClick: false,
      machineNo: 0,

      // 검색 데이터
      statusList: ["전체", "작동중", "작동정지"], // 작동 상태 옵션
      pickedStatus: "", // 작동상태 선택
      machineType: ["세척기기", "음료제작기기", "포장기기"], // 설비 분류 옵션
      pickedType: [], // 설비 분류 선택
      searchType: ["전체검색", "공정이름", "모델번호", "설비이름"], // 검색 옵션
      selectSearchType: "전체검색", // 선택된 검색 옵션
      searchData: "", // 검색 내용

      filters: [],
      
      noRowsOverlayComponent: 'CustomNoRowsOverlay',

    };
  },
  beforeMount() {
    this.getMachineList();
  },
  methods: {
    // 로그인 정보
    ...mapMutations(["addLoginInfo"]),

    // ag-grid
    onReady() {
      // param.api.sizeColumnsToFit(); // column 크기 동일하게 자동 맞춤 => flex 직접 지정으로 변경하면서 제거

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
        button.textContent = '설비등록';
        button.style.marginRight = '10px';
        button.style.cursor = 'pointer';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.padding = '5px 10px';
        button.style.borderRadius = '4px';
        button.style.position = 'absolute';
        button.style.left = '10px';
        button.className = 'btn-success';

        if(!this.checkJob) {
          button.setAttribute('disabled', true);
        }

        // 버튼 클릭 이벤트
        button.addEventListener('click', () => {
          this.machineAddOpen();
        });

        // 컨테이너에 버튼과 입력 필드 추가
        container.appendChild(button);
        // 버튼을 페이지네이션 패널의 제일 앞에 추가
        paginationPanel.insertBefore(container, paginationPanel.firstChild);
      }
    },


    // 설비 등록 모달 열기
    machineAddOpen() {
      this.isShowMachineAdd = !this.isShowMachineAdd;
      this.getMachineList();
    },
    // 설비 등록 성공시 설비 리스트 데이터 갱신
    confirmMachineAdd(check) {
      this.closeMachineAdd();
      if(check == true){
        this.getMachineList();
      }
    },
    // 설비 등록 모달 닫기
    closeMachineAdd() {
      this.isShowMachineAdd = false;
    },

    // 비가동 등록 모달 열기
    inActAddOpen() {
      this.isShowInActAdd = !this.isShowInActAdd;
    },
    // 비가동 등록 성공 체크
    confirmInActAdd(check) {
      this.closeInActAdd();
      if(check == true){
        this.searchMachines();
        // this.getMachineList();
      }
    },
    // 비가동 등록 모달 닫기
    closeInActAdd() {
      this.isShowInActAdd = false;
    },

    // 셀 클릭 : 작동상태 클릭시 비가동 모달, 이외의 경우 설비 상세 페이지로 이동
    cellClickFnc(col) {
      switch(col.value) {
        case '작동중': // run -> stop
          if(this.checkJob) {
            this.machineNo = col.data.machine_num;
            this.inActAddOpen();
          }
          break;
        case '작동정지': // stop -> run
          if(this.checkJob) {
            this.reStart(col.data.machine_num);
          }
          break;
        default: // 설비 상세
          this.$router.push({name: 'machineInfo', params : {mno : col.data.machine_num}});
      }
    },

    // 최근 비가동 수정
    async reStart(machineNo) {
      let obj = {
        inact_end_time: this.getToday(),
        inact_end_emp: this.$store.state.loginInfo.emp_num,
      }

      let result = await axios.put(`${ajaxUrl}/inActs/lastInAct/${machineNo}`, obj)
                              .catch(err => console.log(err));
      let updateRes = result.data;

      if(updateRes.result) {
        console.log('비가동 내역 수정');
        this.runMachine(machineNo);
      } else {
        console.log('비가동 내역 수정 실패');
      }
    },
    // 설비 업데이트
    async runMachine(machineNo) {
      let obj = {
        machine_state: 'run',
      }
      
      let result = await axios.put(`${ajaxUrl}/machine/machineUpdate/${machineNo}`, obj)
                              .catch(err => console.log(err));
      let updateRes = result.data;

      if(updateRes.result) {
        this.searchMachines();
        console.log('설비 작동 시작');
      } else {
        console.log('설비 작동 실패');
      }
    },

    // 검색 파트 동작
    resetSearch() {
      this.pickedStatus = "";
      this.pickedType = [];
      this.selectSearchType = "전체검색";
      this.searchData = "";
      this.filters = [];
      this.getMachineList();
    },
    updateFilter() {
      const typeMap = {
        "세척기기" : "p1",
        "음료제작기기" : "p2",
        "포장기기" : "p3",
      }
      const dbType = this.pickedType.map(type => typeMap[type]);
      this.filters = {
        pickedStatus : this.pickedStatus,
        pickedType : dbType,
        selectSearchType : this.selectSearchType,
        searchData : this.searchData,
      }
      switch(this.filters.pickedStatus) {
        case "전체":
          this.filters.pickedStatus = "";
          break;
        case "작동중":
          this.filters.pickedStatus = "run";
          break;
        case "작동정지":
          this.filters.pickedStatus = "stop";
          break;
      }
      switch(this.filters.selectSearchType) {
        case "전체검색":
          this.filters.selectSearchType = "all";
          break;
        case "공정이름":
          this.filters.selectSearchType = "process_name";
          break;
        case "모델번호":
          this.filters.selectSearchType = "model_num";
          break;
        case "설비이름":
          this.filters.selectSearchType = "machine_name";
          break;
      }
      this.searchMachines();
    },

    // 검색 동작
    async searchMachines() {
      let obj = {
        machine_state : this.filters.pickedStatus,
        process_code : this.filters.pickedType,
        selectSearchType : this.filters.selectSearchType,
        searchData : this.filters.searchData
      }

      let result = await axios.put(`${ajaxUrl}/machine/search`, obj)
                              .catch(err => console.log(err));
      this.machineList = result.data;
      this.rowData = result.data;

      for(let i in this.rowData) {
        this.rowData[i].machine_state = this.rowData[i].machine_state == 'run' ? '작동중' : '작동정지';
      }
    },
    
    // 엔터키 누르면 하는거
    enterkey(event) {
      event.preventDefault();
      this.updateFilter();
    },

    // 날짜 관련
    getToday() {
      return this.dateFormat(null, 'yyyy-MM-dd hh:mm:ss');
    },
    dateFormat(value, format) {
      return userDateUtils.dateFormat(value, format);
    }
  },
};
</script>

<style lang="scss" scoped>
.main-container{
   background-color:  #e9ecef;
   margin: 0 20px;
   border-radius: 10px;
}
.content{
  margin: 10px 20px;
  padding: 20px 0;
}

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

</style>
