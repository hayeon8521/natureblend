<template>
  <div class="px-4 py-4">
    <h3 class="mb-3">포장 검사-불량 내역 조회</h3>
    <hr>
    <!-- 검사조건 부분 시작 -->
    <div class="mb-4">
      <div class="d-flex align-items-center mb-3">
        <h4 class="me-3">검색 조건</h4>
      </div>

      <div class="row gx-3 p-4 rounded border shadow search-background">
        <!-- 날짜 범위 -->
        <div class="col-md-2 ps-5">
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
        <div class="col-md-3">
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
    <h4>불량 내역</h4>

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
  name: "입고검사",
  components: { MaterialButton, CustomNoRowsOverlay },
  data() {
    return {
      searchInfo: {
        pName: '',
        //범위 : 일주일전부터 오늘
        startDate: this.dateFormat(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
        endDate: this.dateFormat(new Date(), 'yyyy-MM-dd')
      },

      searchList: [],

      //ag grid 관련
      noRowsOverlayComponent: 'CustomNoRowsOverlay',
      theme: theme,
      rowData1: [], //검색 결과(db를 통해 얻은 결과에서 골라서 부분 선택적으로 추가)
      columnDefs: [ //검색 결과 열
        { headerName: "불량품번호", field: "qcPackingRjcId", resizable: false, cellStyle: { textAlign: "center" }, flex: 1.5 },
        { headerName: "포장검사번호", field: "qcPackingId", resizable: false, cellStyle: { textAlign: "center" }, flex: 1.5 },
        { headerName: "공정작업번호", field: "processNum", resizable: false, cellStyle: { textAlign: "right" }, flex: 1.25 },
        { headerName: "생산지시번호", field: "productionOrderNum", resizable: false, cellStyle: { textAlign: "center" }, flex: 1.25 },
        { headerName: "제품명", field: "pName", resizable: false, cellStyle: { textAlign: "left" }, flex: 1.5 },
        { headerName: "검사담당자", field: "eName", resizable: false, cellStyle: { textAlign: "left" }, flex: 1.25 },
        {
          headerName: "불합격량", field: "rjcQnt", resizable: false, cellStyle: { textAlign: "right" }, flex: 1,
          cellRenderer: params => {
            if (params.value != null) {
              const formatted_t_qty = Number(params.value).toLocaleString() + ' 개';
              return `<span style="text-align: right;">${formatted_t_qty}</span>`;
            } else {
              return `<span style="text-align: right;"></span>`;
            }
          },
        },
        { headerName: "불량코드", field: "faultyCode", resizable: false, cellStyle: { textAlign: "center" }, flex: 1 },
        { headerName: "불량명", field: "faultyReason", resizable: false, cellStyle: { textAlign: "left" }, flex: 1 },
        { headerName: "검사시작시각", field: "inspecStart", resizable: false, cellStyle: { textAlign: "center" }, flex: 1.6 },
        { headerName: "검사완료시각", field: "inspecEnd", resizable: false, cellStyle: { textAlign: "center" }, flex: 1.6 },

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
    //검색결과 정리
    processSearchResults(searchList) {
      const processedData = [];
      for (let item of searchList) {
        processedData.push({
          "qcPackingRjcId": item.packing_rjc_id,
          "qcPackingId": item.qc_packing_id,
          "productionOrderNum": item.production_order_num,
          "processNum": item.process_num,
          "pName": item.product_name,
          "eName": item.name,
          "rjcQnt": item.rjc_quantity,
          "faultyCode": item.faulty_code,
          "faultyReason": item.faulty_reason,
          "inspecStart": this.dateFormat(item.inspec_start, 'yyyy-MM-dd hh:mm:ss'),
          "inspecEnd": this.dateFormat(item.inspec_end, 'yyyy-MM-dd hh:mm:ss'),
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

      const name = this.searchInfo.pName.replace(/\s+/g, "");
      const result = {
        pName: name.length != 0 ? name : "",
        startDate: this.searchInfo.startDate,
        endDate: this.searchInfo.endDate
      };
      let searchResult = await axios.post(`${ajaxUrl}/recordQCPPR`, result)
        .catch(err => console.log(err));
      this.searchList = searchResult.data;

      // ag grid에 결과값 넣기
      this.rowData1 = []
      this.rowData1 = this.processSearchResults(this.searchList);
    },
    //전체 조회
    async searchRequestAll() {
      let searchResult = await axios.post(`${ajaxUrl}/recordQCPPR`)
        .catch(err => console.log(err));
      this.searchList = searchResult.data;

      // ag grid에 결과값 넣기
      this.rowData1 = []
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
</style>