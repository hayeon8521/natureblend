<template>
  <div class="px-4 py-4">
    <h3 class="mb-3">공정 검사-음료 검사 관리</h3>
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
    <h4>검사 상세 정보</h4>
    <div class="ps-4">
      <p>각 검사 수치를 입력한 뒤, 저장을 눌러주세요.</p>
    </div>

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
    <h4>검사 처리 내역</h4>
    <div class="grid-container">
      <ag-grid-vue :rowData="rowData2" :columnDefs="columnDefs" :theme="theme" :defaultColDef="defaultColDef"
        @grid-ready="onGridReady" @cell-clicked="onCellClicked" :pagination="true"
        :paginationPageSizeSelector="[10, 20, 50, 100]" :paginationPageSize="10" style="height: 400px;"
        :noRowsOverlayComponent="noRowsOverlayComponent">
      </ag-grid-vue>
    </div>
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
    @confirm="saveDefectDetailsForRow(selectedRow.qcProcessId)">
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
          </tbody>
        </table>

        <hr />

        <!-- 검사 항목 리스트 -->
        <div v-for="(item, index) in defectDetailsMap[selectedRow.qcProcessId]" :key="index" class="inspection-item">
          <label>
            {{ processedItemNames[index] }}
          </label>
          <input type="number" v-model.number="item.input_value" class="form-control mt-2 w-100"
            :placeholder="`허용치 ${item.etc_min} ~ ${item.etc_max} ${item.item_unit}`" autocomplete="off" />
        </div>
      </div>
    </template>
  </Modal>

  <Modal :isShowModal="showModalDone" @closeModal="closeModal" @confirm="confirm">
    <template v-slot:title>
      <h1 class="modal-title fs-5" id="exampleModalLabel">검사 완료 확인</h1>
    </template>
    <template v-slot:list>
      <p>해당 검사 내역대로 저장하시겠습니까?</p>
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
  name: "음료검사기록",
  components: { MaterialButton, Modal, CustomNoRowsOverlay },
  data() {
    return {
      //검색 관련
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
        { headerName: "공정검사번호", field: "qcProcessId", resizable: false, cellStyle: { textAlign: "center" }, flex: 1 },
        { headerName: "공정작업번호", field: "processNum", resizable: false, cellStyle: { textAlign: "right" }, flex: 1 },
        { headerName: "생산지시번호", field: "productionOrderNum", resizable: false, cellStyle: { textAlign: "center" }, flex: 1 },
        { headerName: "제품명", field: "pName", resizable: false, cellStyle: { textAlign: "left" }, flex: 1 },
        { headerName: "검사담당자", field: "eName", resizable: false, cellStyle: { textAlign: "left" }, flex: 1 },
        {
          headerName: "합격 여부", field: "inspecResult", resizable: false,
          cellStyle: {
            // border: "0.5px solid #e0ecf3", // 점선 테두리
            cursor: "text", // 텍스트 커서
            textAlign: "left",
          },
          cellRenderer: params => {
            if (params.value != null) {
              return `
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <i class="fas fa-edit" style=" color: gray; margin-right: 5px;"></i>
                  <span style="flex-grow: 1; text-align: right;">${params.value}</span>
                </div>
              `;
            } else {
              return `<span style="text-align: right;"></span>`;
            }
          },
          flex: 1,
        },
        { headerName: "검사시작시각", field: "inspecStart", resizable: false, cellStyle: { textAlign: "center" }, flex: 1 },
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
      tempDefectDetailsMap: {},

      rowData2: [], //rowData1 중 검사상태(inspecStatus)가 '검사내역작성완료'인 것을 담음
      completedDefectDetailsMap: {},
      showModalDone: false,


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
            return `총세균수(${item.item_name})`;
          case "Brix":
            return `당도(${item.item_name})`;
          case "PesticideResidues":
            return `잔류농약(${item.item_name})`;
          case "YeastAndMold":
            return `효모/곰팡이(${item.item_name})`;
          default:
            return item.item_name; // 기본적으로 원본 이름 유지
        }
      });
    },
  },

  methods: {
    // 날짜를 YYYY-MM-DD 형식으로 변환
    dateFormat(value, format) {
      return userDateUtils.dateFormat(value, format);
    },

    onGridReady(params) {
      this.gridApi = params.api;
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
          "inspecResult": '미정',
          "inspecStart": this.dateFormat(item.inspec_start, 'yyyy-MM-dd hh:mm:ss'),
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

      const name = this.searchInfo.pName.replace(/\s+/g, "");
      const result = {
        pName: name.length != 0 ? name : "",
        startDate: this.searchInfo.startDate,
        endDate: this.searchInfo.endDate
      };
      let searchResult = await axios.post(`${ajaxUrl}/requestQCPB`, result)
        .catch(err => console.log(err));
      this.searchList = searchResult.data;

      // ag grid에 결과값 넣기
      this.rowData1 = [];
      this.defectDetailsMap = {};
      this.tempDefectDetailsMap = {};

      this.rowData1 = this.processSearchResults(this.searchList);
      this.rowData2 = [];
      this.completedDefectDetailsMap = {};
    },
    //조건 검색 끝


    //전체 조회 시작
    async searchRequestAll() {
      let searchResult = await axios.post(`${ajaxUrl}/requestQCPB`)
        .catch(err => console.log(err));
      this.searchList = searchResult.data;

      // ag grid에 결과값 넣기
      this.rowData1 = [];
      this.defectDetailsMap = {};
      this.tempDefectDetailsMap = {};

      this.rowData1 = this.processSearchResults(this.searchList);
      this.rowData2 = [];
      this.completedDefectDetailsMap = {};
    },
    //전체 조회 끝

    //신청 건의 합격량, 불합격량(불량항목, 각각의 수량) 처리
    onCellClicked(event) {
      // 선택된 행 데이터 저장 및 모달 표시
      this.selectedRow = event.data;

      // 임시 저장소에 선택된 항목의 데이터를 복사
      if (this.defectDetailsMap[this.selectedRow.qcProcessId]) {
        this.tempDefectDetailsMap = {
          ...this.tempDefectDetailsMap,
          [this.selectedRow.qcProcessId]: JSON.parse(
            JSON.stringify(this.defectDetailsMap[this.selectedRow.qcProcessId])
          ),
        };
      } else {
        this.tempDefectDetailsMap = {
          ...this.tempDefectDetailsMap,
          [this.selectedRow.qcProcessId]: [],
        };
      }

      this.showModalRJC = true;
    },
    closeModal() {
      this.showModalRJC = false;
      this.selectedRow = {};

      this.showModalDone = false;
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
        this.defectDetailsMap[qcProcessId].push({
          item_id: item.item_id,
          details_id: item.details_id,
          item_name: item.item_name,
          item_unit: item.item_unit,
          etc_min: item.etc_min,
          etc_max: item.etc_max,
          input_value: '', // 초기 입력값은 비워두기
        });
      });
    },

    saveDefectDetailsForRow(qcProcessId) {
      const defectDetails = this.defectDetailsMap[qcProcessId] || [];
      if (defectDetails.some(detail => detail.input_value == null || detail.input_value === "" || detail.input_value < 0)) {
        notify({
          text: "검사 항목의 입력 값은 음수나 공백이 허용되지 않습니다.",
          type: "warn", // success, warn, error 가능
        });
        return;
      }
      else if (defectDetails.some(detail => detail.item_name === "pH" && detail.input_value > 14)) {
        notify({
          text: "산도 검사 범위의 최대치는 14pH 입니다.",
          type: "warn", // success, warn, error 가능
        });
        return;
      }



      // 각 defectDetail에 대해 is_passed 값 설정
      defectDetails.forEach(detail => {
        if (detail.input_value < detail.etc_min || detail.input_value > detail.etc_max) {
          detail.is_passed = 'no';
        } else {
          detail.is_passed = 'yes';
        }
      });

      // 검사 완료된 항목만 qcProcessId를 키로 하는 맵에 덮어쓰기
      if (!this.completedDefectDetailsMap) {
        this.completedDefectDetailsMap = {}; // 초기화
      }

      // 해당 qcProcessId에 대해서 검사 완료된 defectDetails만 저장 (덮어쓰기)
      this.completedDefectDetailsMap[qcProcessId] = defectDetails.filter(detail => detail.is_passed !== undefined);


      // 업데이트 로직
      // 해당 qcProcessId에 대한 rowIndex 찾기
      const rowIndex = this.rowData1.findIndex(row => row.qcProcessId === this.selectedRow.qcProcessId);
      if (rowIndex !== -1) {
        // is_passed 값이 모두 'yes'인지 확인 후, inspecResult 값 설정
        const allPassed = defectDetails.every(detail => detail.is_passed === 'yes');
        const inspecResult = allPassed ? '합격' : '불합격';

        // 새 데이터 배열 생성 (Vue의 반응형 감지를 위해)
        this.rowData1 = this.rowData1.map((row, index) => {
          if (index === rowIndex) {
            return { ...row, inspecStatus: '검사내역입력완료', inspecResult };
          }
          return row;
        });
        notify({
          text: `검사 결과, ${inspecResult}입니다. `,
          type: "success", // success, warn, error 가능
        });
      }

      this.closeModal();

      //검사 완료된 것만 밑에 출력
      this.rowData2 = this.rowData1.filter(row => row['inspecStatus'] === '검사내역입력완료');
    },

    doNotSaveDefectDetailsForRow(){
      const qcProcessId = this.selectedRow.qcProcessId;
      if (this.tempDefectDetailsMap[qcProcessId]) {
        this.defectDetailsMap[qcProcessId] = this.tempDefectDetailsMap[qcProcessId];
      }
      this.closeModal();
    },

    //최종 처리 버튼
    openModal() {
      if (this.rowData2.length == 0) {
        notify({
          text: "검사처리내역이 비었습니다.",
          type: "error", // success, warn, error 가능
        });
        return;
      }
      this.showModalDone = !this.showModalDone
    },
    async confirm() {
      // 객체를 배열로 변환
      let completedDefectDetailsArray = [];
      for (let qcId in this.completedDefectDetailsMap) {
        if (Object.prototype.hasOwnProperty.call(this.completedDefectDetailsMap, qcId)) {
          this.completedDefectDetailsMap[qcId].forEach(detail => {
            completedDefectDetailsArray.push({
              qcProcessId: qcId,
              itemId: detail.item_id,
              detailsId: detail.details_id,
              actualValue: detail.input_value,
              isPassed: detail.is_passed
            });
          });
        }
      }
      //배열 정렬
      completedDefectDetailsArray.sort((a, b) => {
        return a.qcProcessId.localeCompare(b.qcProcessId); // 검사번호 우선 비교
      });

      let qcData = {
        qcpb: this.rowData2,
        qcpbr: completedDefectDetailsArray,
      };


      let result = await axios.post(`${ajaxUrl}/completeQCPB`, qcData)
        .catch(err => console.log(err));

      notify({
        text: `완료된 검사: ${result.data.updatedRows}건, 기록된 검사 내역: ${result.data.defectNum}건`,
        type: "success", // success, warn, error 가능
      });



      this.closeModal();
      this.searchRequestAll();
    },






    //음료검사항목및수치 불러오기
    async callTestDetail() {
      let testList = await axios.get(`${ajaxUrl}/testDetailsForB`)
        .catch(err => console.log(err));
      this.testDetails = testList.data;
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
  async created() {
    await this.callTestDetail();
    this.searchRequestAll();
    // this.callFaultyCode();
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

  /* 제목 스타일 */
  h4 {
    font-size: 1.5rem;
    margin-bottom: 15px;
    color: #333;
  }

  /* 일반 텍스트 스타일 */
  p {
    margin: 5px 0;
    font-size: 1.25rem;
    color: #555;
  }

  /* 강조 텍스트 */
  b {
    display: block;
    margin-bottom: 10px;
    color: #000;
    font-size: 1rem;
  }

  /* 검사 항목 스타일 */
  .inspection-item {
    margin-bottom: 15px;

    label {
      font-weight: bold;
      font-size: 1.4rem;
      margin-bottom: 5px;
      display: block;
      color: #333;
    }

    .labelSm {
      font-weight: normal;
      font-size: 0.75rem;
      margin-bottom: 5px;
    }

    input {
      width: 100%;
      padding: 8px 12px;
      font-size: 1rem;
      border: 1px solid #ccc;
      border-radius: 5px;
      transition: border-color 0.3s;
    }

    input:focus {
      border-color: #007bff;
      outline: none;
      box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
    }
  }

  hr {
    margin: 15px 0;
    border: none;
    border-top: 1px solid #ccc;
  }
}
</style>