<template>
  <div class="px-4 py-4">
    <h3 class="mb-3">공정 검사-세척 검사 기록 조회</h3>
    <hr>
    <!-- 검사조건 부분 시작 -->
    <div class="mb-4">
      <div class="d-flex align-items-center mb-3">
        <h4 class="me-3">검색 조건</h4>
      </div>

      <div class="row gx-3 p-4 rounded border shadow search-background">
        <!-- 검사 상태 -->
        <div class="col-md-2 ps-5">
          <label for="qcStat" class="form-label">검사 상태</label>
          <select class="form-select text-center border cursor-pointer" v-model="searchInfo.qcState"
            aria-label="검사 상태 선택">
            <option value="qcs1">전체</option>
            <option value="qcs2">검사 완료</option>
            <option value="qcs3">검사 미완료</option>
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

        <!-- 자재명 -->
        <div class="col-md-2">
          <label for="mName" class="form-label">자재명</label>
          <input type="search" id="mName" class="form-control border p-2 cursor-pointer" placeholder="자재명"
            v-model="searchInfo.mName" autocomplete="off" />
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
    <h4>입고 상세 정보</h4>

    <div class="grid-container">
      <ag-grid-vue :rowData="rowData1" :columnDefs="columnDefs" :theme="theme" :defaultColDef="defaultColDef"
        @grid-ready="onGridReady" :pagination="true" :paginationPageSizeSelector="[10, 20, 50, 100]"
        :paginationPageSize="10" style="height: 513px;" :noRowsOverlayComponent="noRowsOverlayComponent">
      </ag-grid-vue>
    </div>
  </div>
  <!-- 검사결과 끝 -->

  <hr>

  <div style="display: none">
    <CustomNoRowsOverlay />
  </div>

</template>

<script>
import MaterialButton from "@/components/MaterialButton.vue";

import axios from 'axios';
import { ajaxUrl } from '@/utils/commons.js';
import userDateUtils from '@/utils/useDates.js';

import theme from "@/utils/agGridTheme";

import { useNotification } from "@kyvg/vue3-notification";  //노티 드리겠습니다
const { notify } = useNotification();  // 노티 내용변수입니다

import CustomNoRowsOverlay from "@/views/natureBlendComponents/grid/noDataMsg.vue";

export default {
  name: "세척검사기록",
  components: { MaterialButton, CustomNoRowsOverlay },
  data() {
    return {
      searchInfo: {
        mName: '',
        //범위 : 일주일전부터 오늘
        startDate: this.dateFormat(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
        endDate: this.dateFormat(new Date(), 'yyyy-MM-dd'),
        qcState: 'qcs1',
      },

      searchList: [],

      //ag grid 관련
      noRowsOverlayComponent: 'CustomNoRowsOverlay',
      theme: theme,
      rowData1: [], //검색 결과(db를 통해 얻은 결과에서 골라서 부분 선택적으로 추가)
      columnDefs: [ //검색 결과 열
        { headerName: "공정검사번호", field: "qcProcessId", resizable: false, cellStyle: { textAlign: "center" }, flex: 1.5 },
        { headerName: "공정작업번호", field: "processNum", resizable: false, cellStyle: { textAlign: "right" }, flex: 1 },
        { headerName: "생산지시번호", field: "productionOrderNum", resizable: false, cellStyle: { textAlign: "right" }, flex: 1 },
        { headerName: "자재명", field: "mName", resizable: false, cellStyle: { textAlign: "left" }, flex: 1.25 },
        { headerName: "검사담당자", field: "eName", resizable: false, cellStyle: { textAlign: "left" }, flex: 1 },
        {
          headerName: "총 수량", field: "totalQnt", resizable: false, cellStyle: { textAlign: "right" }, flex: 1,
          cellRenderer: params => {
            if (params.value != null) {
              const formatted_t_qty = Number(params.value).toLocaleString() + ' 개';
              return `<span style="text-align: right;">${formatted_t_qty}</span>`;
            } else {
              return `<span style="text-align: right;"></span>`;
            }
          },
        },
        {
          headerName: "합격량", field: "passQnt", resizable: false, editable: true, cellStyle: { textAlign: "right" }, flex: 1,
          cellRenderer: params => {
            if (params.value != null) {
              const formatted_t_qty = Number(params.value).toLocaleString() + ' 개';
              return `<span style="text-align: right;">${formatted_t_qty}</span>`;
            } else {
              return `<span style="text-align: right;"></span>`;
            }
          },
        },
        {
          headerName: "불합격량", field: "rjcQnt", resizable: false, editable: true, cellStyle: { textAlign: "right" }, flex: 1,
          cellRenderer: params => {
            if (params.value != null) {
              const formatted_t_qty = Number(params.value).toLocaleString() + ' 개';
              return `<span style="text-align: right;">${formatted_t_qty}</span>`;
            } else {
              return `<span style="text-align: right;"></span>`;
            }
          },
        },
        { headerName: "검사시작시각", field: "inspecStart", resizable: false, cellStyle: { textAlign: "center" }, flex: 1.5 },
        { headerName: "검사완료시각", field: "inspecEnd", resizable: false, cellStyle: { textAlign: "center" }, flex: 1.5 },
        { headerName: "검사상태", field: "inspecStatus", resizable: false, cellStyle: { textAlign: "left" }, flex: 1 },

      ],

      defaultColDef: {
        headerClass: "header-center"
      },


    }

  },
  methods: {
    onGridReady(params) {
      this.gridApi = params.api;
    },
    // 날짜를 YYYY-MM-DD 형식으로 변환
    dateFormat(value, format) {
      return userDateUtils.dateFormat(value, format);
    },


    //검색창 관련    
    processSearchResults(searchList) {
      const processedData = [];
      for (let item of searchList) {
        processedData.push({
          "qcProcessId": item.qc_cleaning_id,
          "processNum": item.process_num,                   //공정작업번호(바디)
          "productionOrderNum": item.production_order_num, //생산지시코드
          "mName": item.material,
          "eName": item.emp_name,
          "totalQnt": item.total_qnt,
          "passQnt": item.pass_qnt,
          "rjcQnt": item.rjc_qnt,
          "inspecStart": this.dateFormat(item.inspec_start, 'yyyy-MM-dd hh:mm:ss'),
          "inspecEnd": item.inspec_end === null
            ? "" : this.dateFormat(item.inspec_end, 'yyyy-MM-dd hh:mm:ss'),
          "inspecStatus": item.inspec_status
        });
      }
      return processedData;
    },

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
          searchSelect = 'recordQCPCAll'
          break;
        case 'qcs2':
          searchSelect = 'recordQCPC'
          break;
        case 'qcs3':
          searchSelect = 'requestQCPC'
          break;
      }
      const name = this.searchInfo.mName.replace(/\s+/g, "");
      const result = {
        mName: name.length != 0 ? name : "",
        startDate: this.searchInfo.startDate,
        endDate: this.searchInfo.endDate,
      };
      let searchResult = await axios.post(`${ajaxUrl}/${searchSelect}`, result)
        .catch(err => console.log(err));
      this.searchList = searchResult.data;

      // ag grid에 결과값 넣기
      this.rowData1 = [];
      this.rowData1 = this.processSearchResults(this.searchList);
    },
    //전체 조회
    async searchRequestAll() {
      let searchResult = await axios.post(`${ajaxUrl}/recordQCPCAll`)
        .catch(err => console.log(err));
      this.searchList = searchResult.data;

      // ag grid에 결과값 넣기
      this.rowData1 = [];
      this.rowData1 = this.processSearchResults(this.searchList);
    },
  },
  created() {
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
</style>
