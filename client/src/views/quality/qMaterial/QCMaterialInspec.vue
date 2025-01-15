<template>
  <div class="px-4 py-4">
    <h3 class="mb-3">입고 검사-검사 관리</h3>
    <hr>
    <!-- 검사조건 부분 시작 -->
    <div class="mb-4">
      <div class="d-flex align-items-center mb-3">
        <h4 class="me-3">검색 조건</h4>
      </div>

      <div class="row gx-3 p-4 rounded border shadow search-background">
        <!-- 날짜 범위 -->
        <div class="col-md-2 ps-5">
          <label for="startDate" class="form-label">등록일(부터)</label>
          <div class="d-flex gap-2">
            <input type="date" id="startDate" class="form-control border p-2 cursor-pointer"
              v-model="searchInfo.startDate" autocomplete="off" />
          </div>
        </div>
        <div class="col-md-2">
          <label for="endDate" class="form-label">등록일(까지)</label>
          <div class="d-flex gap-2">
            <input type="date" id="endDate" class="form-control border p-2 cursor-pointer" v-model="searchInfo.endDate"
              autocomplete="off" />
          </div>
        </div>

        <!-- 자재명 -->
        <div class="col-md-3">
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
    <h4>입고상세정보</h4>
    <p class="ps-4">검사할 자재를 선택하고 이상이 있을 시 불량 사유와 불량 수량을 입력하세요.</p>

    <div class="grid-container">
      <ag-grid-vue :rowData="rowData1" :columnDefs="columnDefs" :theme="theme" :defaultColDef="defaultColDef"
        @grid-ready="onGridReady" @cell-clicked="onCellClicked" :pagination="true"
        :paginationPageSizeSelector="[10, 20, 50, 100]" :paginationPageSize="10"
        :noRowsOverlayComponent="noRowsOverlayComponent">
      </ag-grid-vue>
    </div>

  </div>
  <!-- 검사결과 끝 -->

  <hr>



  <!-- 검사처리내역 시작 -->
  <div class="container-fluid py-4">
    <h4>검사처리내역</h4>
    <div class="grid-container">
      <ag-grid-vue :rowData="rowData2" :columnDefs="columnDefs" :theme="theme" :defaultColDef="defaultColDef"
        @grid-ready="onGridReady" @cell-clicked="onCellClicked" :pagination="true"
        :paginationPageSizeSelector="[10, 20, 50, 100]" :paginationPageSize="10" style="height: 400px;"
        :noRowsOverlayComponent="noRowsOverlayComponent">
      </ag-grid-vue>
    </div>
    <hr>
    <div class="row justify-content-center">
      <div class="col-auto">
        <material-button class="btn btn-success" size="lg" @click="openModal">저장</material-button>
      </div>
      <div class="col-auto">
        <material-button class="btn btn-warning" size="lg" @click="reset">초기화</material-button>
      </div>
    </div>
  </div>

  <!-- 검사처리내역 끝 -->

  <!-- 불량 상세 모달 -->

  <Modal :isShowModal="showModalRJC" @closeModal="doNotSaveDefectDetailsForRow()"
    @confirm="saveDefectDetailsForRow(selectedRow.qcMaterialId, selectedRow.totalQnt)">
    <template v-slot:title>
      <h1 class="modal-title fs-5" id="exampleModalLabel">검사 상세 정보</h1>
    </template>
    <template v-slot:list>
      <div class="modal-css">
        <table class="table table-sm w-100" style="border: 3px solid #dee2e6;">
          <tbody>
            <tr>
              <th scope="row" style="width: 30%; text-align: left; border: 1px solid #dee2e6;">입고검사번호</th>
              <td style="text-align: right; border: 1px solid #dee2e6; color: #333333; font-weight: bold;">{{
                selectedRow.qcMaterialId }}</td>
            </tr>
            <tr>
              <th scope="row" style="text-align: left; border: 1px solid #dee2e6;">자재명</th>
              <td style="text-align: right; border: 1px solid #dee2e6;">{{ selectedRow.mName }}</td>
            </tr>
            <tr>
              <th scope="row" style="text-align: left; border: 1px solid #dee2e6;">총 수량</th>
              <td v-if="this.materialType === 'kg'" style="text-align: right; border: 1px solid #dee2e6;">
                {{ selectedRow.totalQnt * 0.001 }} {{ this.materialType }}
              </td>
              <td v-else-if="this.materialType === '개'" style="text-align: right; border: 1px solid #dee2e6;">
                {{ selectedRow.totalQnt * 1 }} {{ this.materialType }}
              </td>
            </tr>
          </tbody>
        </table>
        <div class="d-flex justify-content-end mt-3">
          <material-button size="md" class="btn btn-warning" @click="addDefectDetailForRow(selectedRow.qcMaterialId)">
            불량 항목 추가
          </material-button>
        </div>
        <h5 class="pt-5">불량 내역</h5>
        <!-- 불량 사유 입력 및 불량 수량 입력 -->
        <div class="pt-2"
          v-if="defectDetailsMap[selectedRow.qcMaterialId] == null || defectDetailsMap[selectedRow.qcMaterialId].length == 0">
          <b>불량 내역이 없습니다.</b>
        </div>
        <div v-for="(detail, index) in defectDetailsMap[selectedRow.qcMaterialId]" :key="index"
          class="defect-item mt-3">
          <div class="form-group">
            <label :for="'reason' + index">불량 사유 {{ index + 1 }}</label>
            <select v-model="detail.reason" :id="'reason' + index" class="form-control" placeholder="불량 사유">
              <option value="" hidden disabled selected>(선택)</option>
              <option v-for="reason in defectReasons" :key="reason.code" :value="reason.code">
                {{ reason.name }}
              </option>
            </select>
          </div>
          <div class="form-group mt-2">
            <label :for="'defectQty' + index">불량 수량({{ this.materialType }})</label>
            <input type="number" v-model="detail.qty" :id="'defectQty' + index" class="form-control"
              autocomplete="off" />
          </div>
          <div class="d-flex justify-content-end mt-3">
            <button class="btn btn-danger mt-2" @click="removeDefectDetailForRow(selectedRow.qcMaterialId, index)">
              삭제
            </button>
          </div>
        </div>
      </div>
    </template>
  </Modal>


  <Modal :isShowModal="showModalDone" @closeModal="closeModal" @confirm="confirm">
    <template v-slot:title>
      <h1 class="modal-title fs-5" id="exampleModalLabel">검사 완료 확인</h1>
    </template>
    <template v-slot:list>
      <b>해당 검사내역대로 저장하시겠습니까?</b>
    </template>
  </Modal>

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

import Modal from "@/views/natureBlendComponents/modal/ModalQc.vue";

import { useNotification } from "@kyvg/vue3-notification";  //노티 드리겠습니다
const { notify } = useNotification();  // 노티 내용변수입니다

import CustomNoRowsOverlay from "@/views/natureBlendComponents/grid/noDataMsg.vue";

export default {
  name: "입고검사관리",
  components: { MaterialButton, Modal, CustomNoRowsOverlay },
  data() {
    return {
      searchInfo: {
        mName: '',
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
        { headerName: "입고검사번호", field: "qcMaterialId", resizable: false, cellStyle: { textAlign: "center" }, flex: 1.5 },
        { headerName: "자재발주코드", field: "orderCode", resizable: false, cellStyle: { textAlign: "center" }, flex: 1.1 },
        { headerName: "자재명", field: "mName", resizable: false, cellStyle: { textAlign: "left" }, flex: 1.2 },
        { headerName: "검사담당자", field: "eName", resizable: false, cellStyle: { textAlign: "left" }, flex: 1 },
        {
          headerName: "총 수량", field: "totalQnt", resizable: false, cellStyle: { textAlign: "right" }, flex: 1,
          cellRenderer: params => {
            if (params.value != null) {
              const formatted_t_qty = (params.data.mName.includes('병') ?
                (`${Number(params.value).toLocaleString()}개`) : (`${Number(params.value * 0.001).toLocaleString()} kg`));
              return `<span style="text-align: right;">${formatted_t_qty}</span>`;
            } else {
              return `<span style="text-align: right;"></span>`;
            }
          },
        },
        {
          headerName: "합격량", field: "passQnt", resizable: false,
          cellStyle: {
            //border: "0.5px dashed #fb8c00", // 점선 테두리
            cursor: "text", // 텍스트 커서
            textAlign: "right",
          },
          flex: 1,
          cellRenderer: params => {
            if (params.value != null) {
              const formatted_t_qty = (params.data.mName.includes('병') ?
                (`${Number(params.value).toLocaleString()}개`) : (`${Number(params.value * 0.001).toLocaleString()} kg`));
              return `
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <i class="fas fa-edit" style=" color: gray; margin-right: 5px;"></i>
                  <span style="flex-grow: 1; text-align: right;">${formatted_t_qty}</span>
                </div>
              `;
            } else {
              return `<span style="text-align: right;"></span>`;
            }
          },
        },
        {
          headerName: "불합격량", field: "rjcQnt", resizable: false,
          cellStyle: {
            //border: "0.5px dashed #fb8c00", // 점선 테두리
            cursor: "text", // 텍스트 커서
            textAlign: "right",
          },
          flex: 1,
          cellRenderer: params => {
            if (params.value != null) {
              const formatted_t_qty = (params.data.mName.includes('병') ?
                (`${Number(params.value).toLocaleString()}개`) : (`${Number(params.value * 0.001).toLocaleString()} kg`));
              // return `<span style="text-align: right;">${formatted_t_qty}</span>`;
              return `
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <i class="fas fa-edit" style=" color: gray; margin-right: 5px;"></i>
                  <span style="flex-grow: 1; text-align: right;">${formatted_t_qty}</span>
                </div>
              `;
            } else {
              return `<span style="text-align: right;"></span>`;
            }
          },
        },
        { headerName: "검사시작시각", field: "inspecStart", resizable: false, cellStyle: { textAlign: "center" }, flex: 1.8 },
        { headerName: "검사상태", field: "inspecStatus", resizable: false, cellStyle: { textAlign: "left" }, flex: 1 },

      ],

      defaultColDef: {
        headerClass: "header-center"
      },

      //
      inspecData: [],
      showModalRJC: false, // (불량항목)모달 표시 여부
      selectedRow: {}, // 선택된 행 데이터
      defectDetails: [], // 불량 항목(불량코드) 여러 개 관리
      defectReasons: [    // 불량 사유 리스트
        // { code: "D001", name: "파손" },
        // { code: "D002", name: "오염" },
        // { code: "D003", name: "불량품" },
      ],
      selectedReason: "", // 선택된 불량 사유 코드
      defectQty: 0, // 불량 수량
      /// db에 보낼 자재 한건의 불량항목및 수량
      defectDetailsMap: {}, // { qcMaterialId: [ { reason, qty }, ... ] }
      tempDefectDetailsMap: {},

      rowData2: [], //rowData1 중 검사상태(inspecStatus)가 '검사내역작성완료'인 것을 담음
      showModalDone: false,



    }

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
          "qcMaterialId": item.qc_material_id,
          "orderCode": item.order_code,
          "mName": item.material_name,
          "eName": item.name,
          "totalQnt": item.total_qnt,
          "passQnt": item.pass_qnt,
          "rjcQnt": item.rjc_qnt,
          "inspecStart": this.dateFormat(item.inspec_start, 'yyyy-MM-dd hh:mm:ss'),
          "inspecStatus": item.inspec_status
        });
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

      const name = this.searchInfo.mName.replace(/\s+/g, "");
      const result = {
        mName: name.length != 0 ? name : "",
        startDate: this.searchInfo.startDate,
        endDate: this.searchInfo.endDate
      };
      let searchResult = await axios.post(`${ajaxUrl}/requestQCM`, result)
        .catch(err => console.log(err));
      this.searchList = searchResult.data;

      // ag grid에 결과값 넣기
      this.rowData1 = [];
      this.defectDetailsMap = {};
      this.tempDefectDetailsMap = {};
      this.rowData1 = this.processSearchResults(this.searchList);
      this.rowData2 = [];
    },
    //조건 검색 끝


    //전체 조회 시작
    async searchRequestAll() {
      let searchResult = await axios.get(`${ajaxUrl}/requestQCMAll`)
        .catch(err => console.log(err));
      this.searchList = searchResult.data;

      // ag grid에 결과값 넣기
      this.rowData1 = [];
      this.defectDetailsMap = {};
      this.tempDefectDetailsMap = {};
      this.rowData1 = this.processSearchResults(this.searchList);
      this.rowData2 = [];
    },
    //전체 조회 끝

    //신청 건의 합격량, 불합격량(불량항목, 각각의 수량) 처리
    onCellClicked(event) {
      // 선택된 행 데이터 저장 및 모달 표시
      this.selectedRow = event.data;
      if (this.selectedRow.mName.includes('병')) {
        this.materialType = '개';
      } else {
        this.materialType = 'kg';

      }

      // 임시 저장소에 선택된 항목의 데이터를 복사
      if (this.defectDetailsMap[this.selectedRow.qcMaterialId]) {
        this.tempDefectDetailsMap = {
          ...this.tempDefectDetailsMap,
          [this.selectedRow.qcMaterialId]: JSON.parse(
            JSON.stringify(this.defectDetailsMap[this.selectedRow.qcMaterialId])
          ),
        };
      } else {
        this.tempDefectDetailsMap = {
          ...this.tempDefectDetailsMap,
          [this.selectedRow.qcMaterialId]: [],
        };
      }
      this.showModalRJC = true;
    },
    closeModal() {
      this.showModalRJC = false;
      this.selectedRow = {};

      // console.log(this.defectDetailsMap);
      // console.log(this.tempDefectDetailsMap);
      this.showModalDone = false;
    },




    ///신청 건의 불량항목 내역 관련
    addDefectDetailForRow(qcMaterialId) {
      if (!this.defectDetailsMap[qcMaterialId]) {
        this.defectDetailsMap[qcMaterialId] = [];
      }
      this.defectDetailsMap[qcMaterialId].push({ reason: "", qty: 0, unit: this.materialType });
    },
    removeDefectDetailForRow(qcMaterialId, index) {
      if (this.defectDetailsMap[qcMaterialId]) {
        this.defectDetailsMap[qcMaterialId].splice(index, 1);
        if (this.defectDetailsMap[qcMaterialId].length === 0) {
          delete this.defectDetailsMap[qcMaterialId]; // 데이터가 비었으면 삭제
        }
      }
    },
    saveDefectDetailsForRow(qcMaterialId, total) {
      const defectDetails = this.defectDetailsMap[qcMaterialId] || [];

      // 유효성 검사
      if (defectDetails.some(detail => !detail.reason)) {
        notify({
          text: "불량 사유가 입력되지 않은 항목이 있습니다.",
          type: "warn",
        });
        return;
      } else if (defectDetails.some(detail => detail.qty <= 0)) {
        notify({
          text: "수량이 입력되지 않았거나 0 이하를 입력한 항목이 있습니다.",
          type: "warn",
        });
        return;
      } else if (this.materialType === '개' && defectDetails.some(detail => !Number.isInteger(detail.qty))) {
        notify({
          text: "해당 자재의 수량은 소수로 입력할 수 없습니다.",
          type: "warn",
        });
        return;
      }

      const rjcQntSum = defectDetails.reduce((sum, detail) => {
        const convertedQty = this.materialType === 'kg' ? detail.qty * 1000 : detail.qty;
        return sum + convertedQty;
      }, 0);

      if (rjcQntSum > total) {
        notify({
          text: "불량 총합량이 총합량보다 클 수 없습니다.",
          type: "warn",
        });
        return;
      }

      const pass = total - rjcQntSum;
      const rowIndex = this.rowData1.findIndex(row => row.qcMaterialId === this.selectedRow.qcMaterialId);

      if (rowIndex !== -1) {
        this.rowData1 = this.rowData1.map((row, index) => {
          if (index === rowIndex) {
            return { ...row, passQnt: pass, rjcQnt: rjcQntSum, inspecStatus: '검사내역입력완료' };
          }
          return row;
        });
      }

      this.closeModal();
      this.rowData2 = this.rowData1.filter(row => row['inspecStatus'] === '검사내역입력완료');

      notify({
        text: `검사 결과 - 합격량: ${pass / (this.materialType === 'kg' ? 1000 : 1)}${this.materialType}, 불합격량: ${rjcQntSum / (this.materialType === 'kg' ? 1000 : 1)}${this.materialType} 입니다.`,
        type: "success",
      });

      // console.log(defectDetails);
      // console.log(this.defectDetailsMap);
    },

    doNotSaveDefectDetailsForRow() {
      const qcMaterialId = this.selectedRow.qcMaterialId;
      if (this.tempDefectDetailsMap[qcMaterialId]) {
        this.defectDetailsMap[qcMaterialId] = this.tempDefectDetailsMap[qcMaterialId];
      }
      this.closeModal();
    },



    //최종 처리 버튼
    openModal() {
      if (this.rowData2.length == 0) {
        notify({
          text: "저장할 검사처리내역이 없습니다.",
          type: "error", // success, warn, error 가능
        });
        return;
      }
      this.showModalDone = !this.showModalDone
    },
    async confirm() {
      // 객체를 배열로 변환
      let defectDetailsArray = [];
      for (let qcId in this.defectDetailsMap) {
        if (Object.prototype.hasOwnProperty.call(this.defectDetailsMap, qcId)) {

          this.defectDetailsMap[qcId].forEach(detail => {
            defectDetailsArray.push({
              qcMaterialId: qcId,
              faultyCode: detail.reason,
              qty: detail.unit === 'kg' ? detail.qty * 1000 : detail.qty,
            });
          });
        }
      }
      //배열 정렬
      defectDetailsArray.sort((a, b) => {
        if (a.qcMaterialId === b.qcMaterialId) {
          return a.faultyCode.localeCompare(b.faultyCode); // 검사번호 같으면 불량코드 비교
        }
        return a.qcMaterialId.localeCompare(b.qcMaterialId); // 검사번호 우선 비교
      });

      let qcData = {
        qcm: this.rowData2,
        qcmr: defectDetailsArray,
      };
      let result = await axios.post(`${ajaxUrl}/completeQCM`, qcData)
        .catch(err => console.log(err));
      notify({
        text: `완료된 검사: ${result.data.updatedRows} 건, 기록된 불량 내역: ${result.data.defectNum}건`,
        type: "success", // success, warn, error 가능
      });



      this.closeModal();
      this.searchRequestAll();
    },


    //불량코드 불러오기
    async callFaultyCode() {
      let faultyCodeList = await axios.get(`${ajaxUrl}/faultyCode`)
        .catch(err => console.log(err));
      this.faultyCodeList = faultyCodeList.data;
      const arrData = [];
      this.faultyCodeList.forEach((element, index) => {
        arrData[index] = { "code": element.faulty_code, "name": element.faulty_reason };

      });
      this.defectReasons = arrData;
    },

    //리셋
    reset() {
      if (this.rowData2.length != 0) {
        this.searchRequestAll();
        notify({
          text: `검사 처리 내역을 초기화 했습니다.`,
          type: "warn", // success, warn, error 가능
        });
      }
    }


  },
  created() {
    this.searchRequestAll();
    this.callFaultyCode();

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


  input {
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

// 모달
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



  .defect-item {
    padding: 15px;
    border: 3px solid #ddd;
    border-radius: 5px;
    margin-bottom: 15px;
    background-color: #f9f9f9;
  }

  label {
    font-weight: bold;
    margin-bottom: 5px;
    color: #333;
  }

  input,
  select {
    width: 100%;
    padding: 8px 12px;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-bottom: 10px;
    transition: border-color 0.3s;
  }

  input:focus,
  select:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }

  button {
    font-size: 1rem;
    padding: 5px 10px;
    border-radius: 5px;
  }

  .mt-2 {
    margin-top: 10px;
  }

  .mt-3 {
    margin-top: 15px;
  }
}
</style>
