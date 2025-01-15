<template>
  <div class="px-4 py-4">
    <h1 class="mb-3">입고검사-검사기록조회</h1>
    <hr>
    <!-- 검사조건 부분 시작 -->
    <div class="mb-4">
      <div class="d-flex align-items-center mb-3">
        <h3 class="me-3">검색조건</h3>
        <material-button class="btn-search ms-auto" size="sm" v-on:click="searchRequestAll">전체 조회</material-button>
      </div>

      <div class="row g-3">
        <!-- 날짜 범위 -->
        <div class="col-md-4">
          <label for="startDate" class="form-label">날짜 범위</label>
          <div class="d-flex gap-2">
            <input type="date" id="startDate" class="form-control border p-2 cursor-pointer"
              v-model="searchInfo.startDate" />
            <input type="date" id="endDate" class="form-control border p-2 cursor-pointer"
              v-model="searchInfo.endDate" />
          </div>
        </div>

        <!-- 자재명 -->
        <div class="col-md-3">
          <label for="mName" class="form-label">자재명</label>
          <input type="search" id="mName" class="form-control border p-2 cursor-pointer" placeholder="자재명"
            v-model="searchInfo.mName" />
        </div>

        <!-- 검색 버튼 -->
        <div class="col-md-2 d-flex align-items-end">
          <material-button size="md" class="w-100" v-on:click="searchOrder">검색</material-button>
        </div>
      </div>
    </div>
  </div>
  <!-- 검사조건 부분 끝 -->
  <hr>
  <!-- 검사결과 시작 -->
  <div class="container-fluid py-4">
    <h4>입고상세정보</h4>
    <p>검사항목 클릭 => 불량항목, 수량입력(없으면 그냥 저장)=> 작성완료한 항목 체크후 '검사완료'버튼 클릭</p>

    <div class="grid-container">
      <ag-grid-vue :rowData="rowData1" :columnDefs="columnDefs" :theme="theme" :defaultColDef="defaultColDef"
        @grid-ready="onGridReady" @cell-clicked="onCellClicked" :pagination="true" :paginationPageSize="20">
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
        @grid-ready="onGridReady" @cell-clicked="onCellClicked" :pagination="true" :paginationPageSize="20">
      </ag-grid-vue>
    </div>
    <material-button size="md" class="mt-3" v-on:click="openModal">검사완료</material-button>
  </div>
  <!-- 검사처리내역 끝 -->

  <!-- 불량 상세 모달 -->

  <Modal :isShowModal="showModalRJC" @closeModal="closeModal"
    @confirm="saveDefectDetailsForRow(selectedRow.qcMaterialId, selectedRow.totalQnt)">
    <template v-slot:list>
      <h4>불량 상세 정보</h4>
      <p>입고검사번호: {{ selectedRow.qcMaterialId }}</p>
      <p>자재명: {{ selectedRow.mName }}</p>
      <p>총 수량: {{ selectedRow.totalQnt }}</p>

      <!-- 불량 사유 입력 및 불량 수량 입력 -->

      <div v-for="(detail, index) in defectDetailsMap[selectedRow.qcMaterialId]" :key="index" class="defect-item">
        <label for="reason">불량 사유 {{ index + 1 }}:</label>
        <select v-model="detail.reason" :id="'reason' + index">
          <option v-for="reason in defectReasons" :key="reason.code" :value="reason.code">
            {{ reason.name }}
          </option>
        </select>
        <label for="defectQty">불량 수량 {{ index + 1 }}:</label>
        <input type="number" v-model="detail.qty" :id="'defectQty' + index" />
        <button class="btn btn-danger" @click="removeDefectDetailForRow(selectedRow.qcMaterialId, index)">삭제</button>
      </div>
      <material-button size="md" class="mt-3" @click="addDefectDetailForRow(selectedRow.qcMaterialId)">불량 항목
        추가</material-button>
      <!-- <button @click="saveDefectDetailsForRow(selectedRow.qcMaterialId, selectedRow.totalQnt)">저장</button> -->
    </template>
  </Modal>

  <Modal :isShowModal="showModalDone" @closeModal="closeModal" @confirm="confirm">
    <template v-slot:list>
      <p>신청내역대로 저장하시겠습니까?</p>
    </template>
  </Modal>



</template>

<script>
// import { toRaw } from 'vue';

import MaterialButton from "@/components/MaterialButton.vue";

import axios from 'axios';
import { ajaxUrl } from '@/utils/commons.js';
import userDateUtils from '@/utils/useDates.js';

import theme from "@/utils/agGridTheme";

import Modal from "@/views/natureBlendComponents/modal/ModalQc.vue";

import { useNotification } from "@kyvg/vue3-notification";  //노티 드리겠습니다
const { notify } = useNotification();  // 노티 내용변수입니다

export default {
  name: "입고검사관리",
  components: { MaterialButton, Modal },
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
      theme: theme,
      rowData1: [], //검색 결과(db를 통해 얻은 결과에서 골라서 부분 선택적으로 추가)
      columnDefs: [ //검색 결과 열
        { headerName: "입고검사번호", field: "qcMaterialId", resizable: false },
        { headerName: "자재발주코드", field: "orderCode", resizable: false },
        { headerName: "자재명", field: "mName", resizable: false },
        { headerName: "검사담당자", field: "eName", resizable: false },
        { headerName: "총 수량", field: "totalQnt", resizable: false },
        { headerName: "합격량", field: "passQnt", resizable: false, editable: true, },
        { headerName: "불합격량", field: "rjcQnt", resizable: false, editable: true, },
        { headerName: "검사시작시각", field: "inspecStart", resizable: false },
        { headerName: "검사상태", field: "inspecStatus", resizable: false },

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
      this.gridApi.sizeColumnsToFit();
    },


    //검색창 관련
    //조건 검색 시작  
    async searchOrder() {
      if (new Date(this.searchInfo.startDate) > new Date(this.searchInfo.endDate)) {
        `${notify({
          title: "검색실패",
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
      for (let i = 0; i < this.searchList.length; i++) {
        let col = {
          "qcMaterialId": this.searchList[i].qc_material_id, "orderCode": this.searchList[i].order_code,
          "mName": this.searchList[i].material_name, "eName": this.searchList[i].name, "totalQnt": this.searchList[i].total_qnt,
          "passQnt": this.searchList[i].pass_qnt, "rjcQnt": this.searchList[i].rjc_qnt,
          "inspecStart": this.dateFormat(this.searchList[i].inspec_start, 'yyyy-MM-dd hh:mm:ss'), "inspecStatus": this.searchList[i].inspec_status

        }
        this.rowData1[i] = col;
      }
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
      this.defectDetailsMap = [];
      for (let i = 0; i < this.searchList.length; i++) {
        let col = {
          "qcMaterialId": this.searchList[i].qc_material_id, "orderCode": this.searchList[i].order_code,
          "mName": this.searchList[i].material_name, "eName": this.searchList[i].name, "totalQnt": this.searchList[i].total_qnt,
          "passQnt": this.searchList[i].pass_qnt, "rjcQnt": this.searchList[i].rjc_qnt,
          "inspecStart": this.dateFormat(this.searchList[i].inspec_start, 'yyyy-MM-dd hh:mm:ss'), "inspecStatus": this.searchList[i].inspec_status

        }
        this.rowData1[i] = col;
        this.rowData2 = [];
      }
    },
    //전체 조회 끝

    //신청 건의 합격량, 불합격량(불량항목, 각각의 수량) 처리
    onCellClicked(event) {
      console.log('클릭됨');
      // 선택된 행 데이터 저장 및 모달 표시
      this.selectedRow = event.data;
      this.showModalRJC = true;
    },
    closeModal() {
      this.showModalRJC = false;
      this.selectedRow = {};

      this.showModalDone = false;
    },




    ///신청 건의 불량항목 내역 관련
    addDefectDetailForRow(qcMaterialId) {
      if (!this.defectDetailsMap[qcMaterialId]) {
        this.defectDetailsMap[qcMaterialId] = [];
      }
      this.defectDetailsMap[qcMaterialId].push({ reason: "", qty: 0 });
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
      if (defectDetails.some(detail => !detail.reason || detail.qty <= 0)) {
        notify({
          title: "입력실패",
          text: "모든 불량 항목에 대해 불량 사유와 수량을 입력하세요.",
          type: "warn", // success, warn, error 가능
        });
        return;
      }

      const rjcQntSum = defectDetails.reduce((sum, detail) => sum + detail.qty, 0);
      if (rjcQntSum > total) {
        notify({
          title: "입력실패",
          text: "불량 총합량이 총합량보다 클 수 없습니다.",
          type: "warn", // success, warn, error 가능
        });
        return;
      }

      const pass = total - rjcQntSum;
      console.log(`저장 완료: ${qcMaterialId}, 합격량: ${pass}, 불량 총합: ${rjcQntSum}`);
      // 업데이트 로직
      const rowIndex = this.rowData1.findIndex(row => row.qcMaterialId === this.selectedRow.qcMaterialId);
      if (rowIndex !== -1) {
        // 새 데이터 배열 생성 (Vue의 반응형 감지를 위해)
        this.rowData1 = this.rowData1.map((row, index) => {
          if (index === rowIndex) {
            return { ...row, passQnt: pass, rjcQnt: rjcQntSum, inspecStatus: '검사내역입력완료' };
          }
          return row;
        });
      }

      this.closeModal();
      console.log('현재 검색결과 테이블');
      console.log(this.rowData1);
      console.log('불량상세테이블');
      console.log(this.defectDetailsMap);
      console.log('테스트(검사완료 처리할 검사 건수들)')
      this.rowData2 = this.rowData1.filter(row => row['inspecStatus'] === '검사내역입력완료')
      console.log(this.rowData2);
    },
    // openModalForRow(row) {
    //   this.selectedRow = row;
    //   const qcMaterialId = row.qcMaterialId;
    //   if (!this.defectDetailsMap[qcMaterialId]) {
    //     this.defectDetailsMap[qcMaterialId] = [];
    //   }
    //   this.defectDetails = this.defectDetailsMap[qcMaterialId];
    //   this.showModalRJC = true;
    // },

    //최종 처리 버튼
    openModal() {
      this.showModalDone = !this.showModalDone
      console.log(this.rowData2);
      console.log(this.defectDetailsMap);
    },
    async confirm() {
      console.log('저장처리!')
      console.log(this.rowData2);
      console.log(this.defectDetailsMap);
      // 객체를 배열로 변환
      let defectDetailsArray = [];
      for (let qcId in this.defectDetailsMap) {
        if (Object.prototype.hasOwnProperty.call(this.defectDetailsMap, qcId)) {
          this.defectDetailsMap[qcId].forEach(detail => {
            defectDetailsArray.push({
              qcMaterialId: qcId,
              faultyCode: detail.reason,
              qty: detail.qty,
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
      console.log(result);
      notify({
        title: "검사완료",
        text: `완료된 검사:${result.data.updatedRows}, 기록된 불량 내역:${result.data.defectNum}`,
        // text: `기록된 불량 내역:${result.data.defectNum}`,
        type: "success", // success, warn, error 가능
      });



      this.closeModal();
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
</style>
