<template>
  <div class="px-4 py-4">
    <h3 class="mb-3">공정 검사-음료 검사 기록 조회</h3>
    <hr>
    <!-- 검사조건 부분 시작 -->
    <div class="mb-4">
      <div class="d-flex align-items-center mb-3">
        <h4 class="me-3">검색 조건</h4>
      </div>

      <div class="row gx-3 p-4 rounded border shadow search-background">
        <!-- 검사 상태 -->
        <div class="col-md-1">
          <label for="qcStat" class="form-label">검사 상태</label>
          <select class="form-select text-center border cursor-pointer" v-model="searchInfo.qcState"
            aria-label="검사 상태 선택">
            <option value="qcs1">전체</option>
            <option value="qcs2">검사 완료</option>
            <option value="qcs3">검사 미완료</option>
          </select>
        </div>
        <div v-if="searchInfo.qcState === 'qcs2'" class="col-md-1">
          <label for="isPass" class="form-label">합격 여부</label>
          <select class="form-select text-center border cursor-pointer" v-model="searchInfo.isPassed"
            aria-label="검사 상태 선택">
            <option value="all">전체</option>
            <option value="passed">합격</option>
            <option value="failed">불합격</option>
          </select>
        </div>

        <!-- 날짜 범위 -->
        <div class="col-md-2">
          <label for="startDate" class="form-label">검사일(부터)</label>
          <div class="d-flex gap-2">
            <input type="date" id="startDate" class="form-control border p-2 cursor-pointer"
              v-model="searchInfo.startDate" autocomplete="off" />
          </div>
        </div>
        <div class="col-md-2">
          <label for="endDate" class="form-label">검사일(까지)</label>
          <div class="d-flex gap-2">
            <input type="date" id="endDate" class="form-control border p-2 cursor-pointer" v-model="searchInfo.endDate"
              autocomplete="off" />
          </div>
        </div>

        <!-- 제품명 -->
        <div class="col-md-2">
          <label for="pName" class="form-label">제품명</label>
          <input type="search" id="pName" class="form-control border p-2 cursor-pointer" placeholder="제품명"
            v-model="searchInfo.pName" autocomplete="off" />
        </div>

        <!-- 검색 버튼 -->
        <div class="col-md-2 d-flex align-items-end">
          <material-button size="md" v-on:click="searchOrder">검색</material-button>
          <material-button size="md" class="m-4" color="info" v-on:click="searchRequestAll">전체 조회</material-button>
        </div>
      </div>
    </div>
  </div>
  <!-- 검사조건 부분 끝 -->
  <hr>
  <!-- 검사결과 시작 -->
  <div class="container-fluid py-4">
    <h4>검사 상세 정보</h4>
    <div class="ps-4">
      <p>조회할 검사 건을 선택하시면 자세한 검사 내용을 확인할 수 있습니다.</p>
    </div>

    <div class="grid-container">
      <ag-grid-vue :rowData="rowData1" :columnDefs="columnDefs" :theme="theme" :defaultColDef="defaultColDef"
        @grid-ready="onGridReady" @cell-clicked="onCellClicked" :pagination="true"
        :paginationPageSizeSelector="[10, 20, 50, 100]" :paginationPageSize="10" style="height: 513px;"
        :noRowsOverlayComponent="noRowsOverlayComponent">
      </ag-grid-vue>
    </div>

  </div>
  <!-- 검사결과 끝 -->

  <hr>





  <!-- 불량 상세 모달 -->

  <Modal :isShowModal="showModalRJC" @closeModal="closeModal">
    <template v-slot:title>
      <h1 class="modal-title fs-5" id="exampleModalLabel">검사 상세 정보</h1>
    </template>
    <template v-slot:list>
      <div class="modal-css">
        <table class="table table-sm w-100" style="border: 3px solid #dee2e6;">
          <tbody>
            <tr>
              <th scope="row" style="width: 30%; text-align: left; border: 1px solid #dee2e6;">공정검사번호</th>
              <td style="text-align: right; border: 1px solid #dee2e6;">{{ selectedRow.qcProcessId }}</td>
            </tr>
            <tr>
              <th scope="row" style="text-align: left; border: 1px solid #dee2e6;">음료 제품명</th>
              <td style="text-align: right; border: 1px solid #dee2e6;">{{ selectedRow.pName }}</td>
            </tr>
            <tr v-if="selectedRow.inspecResult === '합격'">
              <th scope="row" style="text-align: left; border: 1px solid #dee2e6;">검사 결과</th>
              <td style="font-weight: bold; text-align: right; border: 1px solid #dee2e6; color: #007bff">{{
                selectedRow.inspecResult }}</td>
            </tr>
            <tr v-if="selectedRow.inspecResult === '불합격'">
              <th scope="row" style="text-align: left; border: 1px solid #dee2e6;">검사 결과</th>
              <td style="font-weight: bold; text-align: right; border: 1px solid #dee2e6; color: #f44335">{{
                selectedRow.inspecResult }}</td>
            </tr>
          </tbody>
        </table>
        <!-- <b>검사 항목 : 산도, 총세균수, 당도, 잔류 농약, 효모/곰팡이</b> -->
        <hr />

        <!-- 검사 항목 리스트 -->
        <div v-for="(item, index) in defectDetailsMap[selectedRow.qcProcessId]" :key="index" class="inspection-item">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <div>
              <span class="item-name">
                {{ processedItemNames[index] }}
              </span>
              <span class="item-range">
                [ 허용치 {{ item.etc_min }} ~ {{ item.etc_max }} {{ item.item_unit }} ]
              </span>
            </div>
            <div v-if="item.is_passed === 'yes'">
              <div class="item-value-passed">
                {{ item.input_value }} {{ item.item_unit }}
              </div>
            </div>
            <div v-else-if="item.is_passed === 'no'">
              <div class="item-value-failed">
                {{ item.input_value }} {{ item.item_unit }}
              </div>
            </div>


          </div>
        </div>
      </div>
    </template>
  </Modal>



  <div style="display: none">
    <CustomNoRowsOverlay />
  </div>

</template>

<script>
// import { toRaw } from 'vue';

import MaterialButton from "@/components/MaterialButton.vue";

import axios from 'axios';
import { ajaxUrl } from '@/utils/commons.js';
import userDateUtils from '@/utils/useDates.js';

import theme from "@/utils/agGridTheme";

import Modal from "@/views/natureBlendComponents/modal/ModalQcInfo.vue";

import { useNotification } from "@kyvg/vue3-notification";  //노티 드리겠습니다
const { notify } = useNotification();  // 노티 내용변수입니다

import CustomNoRowsOverlay from "@/views/natureBlendComponents/grid/noDataMsg.vue";


export default {
  name: "음료검사관리",
  components: { MaterialButton, Modal, CustomNoRowsOverlay },
  data() {
    return {
      //검색 관련
      searchInfo: {
        pName: '',
        //범위 : 일주일전부터 오늘
        startDate: this.dateFormat(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
        endDate: this.dateFormat(new Date(), 'yyyy-MM-dd'),
        qcState: 'qcs1',
        isPassed: 'all',
      },
      searchList: [],

      //ag grid 관련
      noRowsOverlayComponent: 'CustomNoRowsOverlay',
      theme: theme,
      rowData1: [], //검색 결과(db를 통해 얻은 결과에서 골라서 부분 선택적으로 추가)
      columnDefs: [ //검색 결과 열
        { headerName: "공정검사번호", field: "qcProcessId", resizable: false, cellStyle: { textAlign: "center" }, flex: 1 },
        { headerName: "공정작업번호", field: "processNum", resizable: false, cellStyle: { textAlign: "right" }, flex: 1 },
        { headerName: "생산지시번호", field: "productionOrderNum", resizable: false, cellStyle: { textAlign: "center" }, flex: 1 },
        { headerName: "제품명", field: "pName", resizable: false, cellStyle: { textAlign: "left" }, flex: 1 },
        { headerName: "검사담당자", field: "eName", resizable: false, cellStyle: { textAlign: "left" }, flex: 1 },
        { headerName: "합격 여부", field: "inspecResult", resizable: false, cellStyle: { textAlign: "left" }, flex: 1 },
        { headerName: "검사시작시각", field: "inspecStart", resizable: false, cellStyle: { textAlign: "center" }, flex: 1 },
        { headerName: "검사완료시각", field: "inspecEnd", resizable: false, cellStyle: { textAlign: "center" }, flex: 1 },
        { headerName: "검사상태", field: "inspecStatus", resizable: false, cellStyle: { textAlign: "left" }, flex: 1 },

      ],

      defaultColDef: {
        headerClass: "header-center"
      },


      showModalRJC: false, // (불량항목)모달 표시 여부
      selectedRow: {}, // 선택된 행 데이터

      //db에서 가져온 제품별 검사 항목과 허용 범위
      testDetails: {},


      defectDetailsMap: {}, //검사번호별로 저장된 검사내용 { qcProcessId: [ { ... }, ... ] }




      completedDefectDetailsMap: {},
      completedTestDetails: [],


    }

  },
  //검사항목 한글로 출력
  computed: {
    processedItemNames() {
      return this.defectDetailsMap[this.selectedRow.qcProcessId].map(item => {
        switch (item.item_name) {
          case "pH":
            return `산도(${item.item_name})`;
          case "CFU":
            return `총 세균수(${item.item_name})`;
          case "Brix":
            return `당도(${item.item_name})`;
          case "PesticideResidues":
            return `잔류 농약(${item.item_name})`;
          case "YeastAndMold":
            return `효모/곰팡이(${item.item_name})`;
          default:
            return item.item_name; // 기본적으로 원본 이름 유지
        }
      });
    },
  },

  watch: {
    // qcState가 변경될 때 isPassed를 'all'로 설정
    'searchInfo.qcState': function () {
      this.searchInfo.isPassed = 'all';
    },
  },

  methods: {
    // 날짜를 YYYY-MM-DD 형식으로 변환
    dateFormat(value, format) {
      return userDateUtils.dateFormat(value, format);
    },

    onGridReady(params) {
      this.gridApi = params.api;
      //this.gridApi.sizeColumnsToFit();
    },


    //검색창 관련
    //검색결과 정리
    processSearchResults(searchList) {
      const processedData = [];
      for (let item of searchList) {
        processedData.push({
          "qcProcessId": item.qc_berverage_id,
          "processNum": item.process_num,
          "productionOrderNum": item.production_order_num,
          "productCode": item.product_code,
          "pName": item.product_name,
          "eName": item.emp_name,
          "inspecResult": item.inspec_result === null
            ? '미정' : item.inspec_result,
          "inspecStart": this.dateFormat(item.inspec_start, 'yyyy-MM-dd hh:mm:ss'),
          "inspecEnd": item.inspec_end === null
            ? "" : this.dateFormat(item.inspec_end, 'yyyy-MM-dd hh:mm:ss'),
          "inspecStatus": item.inspec_status,
        });

        // 검사 항목을 defectDetailsMap에 추가
        this.addDefectDetailForRow(item.qc_berverage_id, item.product_code);
      }
      return processedData;
    },


    //조건 검색 시작  
    async searchOrder() {
      if (new Date(this.searchInfo.startDate) > new Date(this.searchInfo.endDate)) {
        `${notify({
          text: "시작 날짜는 종료 날짜보다 이전이어야 합니다.",
          type: "error", // success, warn, error 가능
        })}`;
        return;
      }

      let searchSelect = ''
      switch (this.searchInfo.qcState) {
        case 'qcs1':
          searchSelect = 'recordQCPBAll'
          break;
        case 'qcs2':
          searchSelect = 'recordQCPB'
          break;
        case 'qcs3':
          searchSelect = 'requestQCPB'
          break;
      }

      const name = this.searchInfo.pName.replace(/\s+/g, "");
      const result = {
        pName: name.length != 0 ? name : "",
        startDate: this.searchInfo.startDate,
        endDate: this.searchInfo.endDate,
        isPassed: this.searchInfo.isPassed,

      };
      let searchResult = await axios.post(`${ajaxUrl}/${searchSelect}`, result)
        .catch(err => console.log(err));
      this.searchList = searchResult.data;

      // ag grid에 결과값 넣기
      this.rowData1 = [];
      this.defectDetailsMap = {};

      this.rowData1 = this.processSearchResults(this.searchList);
      this.completedDefectDetailsMap = {};
    },
    //조건 검색 끝


    //전체 조회 시작
    async searchRequestAll() {
      let searchResult = await axios.post(`${ajaxUrl}/recordQCPBAll`)
        .catch(err => console.log(err));
      this.searchList = searchResult.data;
      console.log(searchResult.data);

      // ag grid에 결과값 넣기
      this.rowData1 = [];
      this.defectDetailsMap = {};

      this.rowData1 = this.processSearchResults(this.searchList);
      this.completedDefectDetailsMap = {};
    },
    //전체 조회 끝

    //신청 건의 합격량, 불합격량(불량항목, 각각의 수량) 처리
    onCellClicked(event) {
      // 선택된 행 데이터 저장 및 모달 표시
      this.selectedRow = event.data;
      this.showModalRJC = true;
    },
    closeModal() {
      this.showModalRJC = false;
      this.selectedRow = {};

    },




    ///신청 건의 불량항목 내역 관련
    //행별로 검사항목 저장
    addDefectDetailForRow(qcProcessId, productCode) {
      if (!this.defectDetailsMap[qcProcessId]) {
        this.defectDetailsMap[qcProcessId] = [];
      }

      // productCode에 해당하는 검사 항목을 testDetails에서 가져오기
      const testItems = this.testDetails[productCode] || [];

      // 검사 항목들에 대해 defectDetailsMap에 항목 추가
      testItems.forEach(item => {
        let matchingTestDetail = this.completedTestDetails.find(detail =>
          detail.qc_berverage_id === qcProcessId &&
          detail.bev_test_item_id === item.item_id &&
          detail.bev_test_details_id === item.details_id
        );


        this.defectDetailsMap[qcProcessId].push({
          qcProcessId: qcProcessId,
          item_id: item.item_id,
          details_id: item.details_id,
          item_name: item.item_name,
          item_unit: item.item_unit,
          etc_min: item.etc_min,
          etc_max: item.etc_max,
          input_value: matchingTestDetail ? matchingTestDetail.actual_value : 0,
          is_passed: matchingTestDetail ? matchingTestDetail.is_passed : ''

          // input_value: 0, 
        });
      });
    },



    //음료검사항목및수치 불러오기
    async callTestDetail() {
      let testList = await axios.get(`${ajaxUrl}/testDetailsForB`)
        .catch(err => console.log(err));
      this.testDetails = testList.data;
    },

    //행별 검사 수치 불러오기
    async callCompletedTestDetail() {
      let list = await axios.get(`${ajaxUrl}/recordQCPBDetails`)
        .catch(err => console.log(err));
      this.completedTestDetails = list.data;
    }


  },
  async created() {
    await this.callCompletedTestDetail();
    await this.callTestDetail();
    this.searchRequestAll();
  }


};

</script>




<style scoped lang="scss">
.pagination {
  display: flex;
  justify-content: center;
}

.container-fluid {
  min-height: 500px;

  .search {
    margin-top: 24px;
  }
}

//검색창 라벨
.mb-4 {
  label {
    font-weight: bold;
    margin-bottom: 5px;
    color: #333;
  }
}

//검색창 배경색
.search-background {
  background-color: #e9ecef;
  /* 원하는 배경색 */


  input,
  .form-select {
    background-color: #ffffff;
    border-radius: 5px;
    padding: 8px 12px;
    font-size: 16px;
    transition: border-color 0.3s;
  }

  input:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }
}


//모달
.modal-css {

  .table th,
  .table td {
    font-size: 1.1rem;
    padding: 10px;
    // color: #495057; /* 텍스트 색상 */

  }

  .table th {
    font-size: 1.2rem;
    font-weight: bold;
    color: #343a40;
    background-color: #e8ebee;
    /* 헤더 텍스트 색상 */
  }

  .table td {
    color: #333333;
    // font-weight: bold;
  }

  .inspection-item {

    .item-name {
      font-weight: bold;
      font-size: 1.3rem;
      color: #333;
      margin-right: 10px;
    }

    .item-range {
      font-size: 0.9rem;
      color: #777;
      margin-right: 10px;
    }

    .item-value-passed {
      font-size: 1.5rem;
      font-weight: bold;
      color: #007bff;
    }

    .item-value-failed {
      font-size: 1.5rem;
      font-weight: bold;
      color: #f44335;
    }

    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #eaeaea;

    &:last-child {
      border-bottom: none;
    }
  }
}
</style>
