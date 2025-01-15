<template>
  <!-- 검사조건 부분 시작 -->
  <div class="px-4 py-4">
    <h1>입고검사-검사신청</h1>
    <hr>
    <div class="row align-items-center mb-3">
      <div class="col-2">
        <h3 class="mr-3">검색조건</h3>
      </div>
      <div class="col">
        <material-button class="btn-search" size="sm" v-on:click="searchOrderAll">전체 조회</material-button>
      </div>
    </div>

    <div class="row">
      <label for="startDate" class="mr-2">날짜범위</label>
      <div class="input-group w-auto h-25">
        <input type="date" class="form-control border p-2 cursor-pointer" placeholder="Date" v-model="searchInfo.startDate" />
      </div>
      <div class="input-group w-auto h-25">
        <input type="date" class="form-control border p-2 cursor-pointer" placeholder="Date" v-model="searchInfo.endDate" />
      </div>
      <div class="input-group w-auto h-25">
        <input label="자재명" class="form-control border p-2 cursor-pointer" placeholder="자재명" type="search" v-model="searchInfo.mName" />
      </div>
      <div class="input-group w-auto h-25">
        <material-button size="md" v-on:click="searchOrder">검색</material-button>
      </div>
    </div>
  </div>
  <!-- 검사조건 부분 끝 -->

  <hr>
  <!-- 검사결과 시작 -->
  <div class="container-fluid py-4">
    <h4>검색 결과</h4>
    <p>생산 내역에 추가할 건을 선택해주세요.</p>
    <div class="col-2">
      <material-button size="md" color="primary" @click="addCheckedRows">선택 항목 추가</material-button>
    </div>

    <div class="grid-container">
      <ag-grid-vue :rowData="rowData1" :columnDefs="columnDefs" :theme="theme" :defaultColDef="defaultColDef"
        @grid-ready="onGridReady" :pagination="true" :paginationPageSize="20">
      </ag-grid-vue>

    </div>
  </div>
  <!-- 검사결과 끝 -->

  <hr>
  <!-- 신청내역 시작 -->
  <div class="container-fluid py-4">
    <h4>신청내역</h4>
    <div class="grid-container">
      <ag-grid-vue :rowData="rowData2" :columnDefs="columnDefs2" :theme="theme" :defaultColDef="defaultColDef"
        @grid-ready="onGridReady" :pagination="true" @cell-clicked="onCellClicked" :paginationPageSize="20">
      </ag-grid-vue>

    </div>
    <!-- 신청내역 끝 -->
    <hr>
    <!-- 버튼 구역 -->
    <div class="row">
      <div class="col">
        <material-button color="warning" size="lg" @click="openModal">저장</material-button>
      </div>
      <div class="col">
        <material-button color="dark" size="lg" @click="resetAll">초기화</material-button>
      </div>
    </div>
    <!-- 버튼 구역 끝-->
  </div>
  <Modal :isShowModal="isShowModalUpdate" @closeModal="closeModal" @confirm="updateQnt(selectedRow.orderCode, editedQuantity)">
      <template v-slot:list>
        <p>발주수량을 확인하시고 다르다면 수정해주세요.</p>
        <div>
          <label for="quantityInput">실제 수량:</label>
          <input v-model="editedQuantity" type="number" id="quantityInput"/>
        </div>
      </template>
  </Modal>

  <Modal :isShowModal="isShowModal" @closeModal="closeModal" @confirm="confirm">
    <template v-slot:list>
      <p>신청내역대로 저장하시겠습니까?</p>
    </template>
  </Modal>
</template>

<script>
import { toRaw } from 'vue';

import axios from 'axios';
import { ajaxUrl } from '@/utils/commons.js';
import userDateUtils from '@/utils/useDates.js';

import MaterialButton from "@/components/MaterialButton.vue";

import theme from "@/utils/agGridTheme";
import Modal from "@/views/natureBlendComponents/modal/ModalQc.vue";

import { AgGridVue } from "ag-grid-vue3";

import { useNotification } from "@kyvg/vue3-notification";  //노티 드리겠습니다
const { notify } = useNotification();  // 노티 내용변수입니다


export default {
  name: "입고검사신청",
  components: { MaterialButton, Modal, AgGridVue},

  data() {
    return {
      //검색창 및 결과 관련
      searchInfo: {
        mName: '',
        //범위 : 일주일전부터 오늘
        startDate: this.dateFormat(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
        endDate: this.dateFormat(new Date(), 'yyyy-MM-dd')
      },
      //db를 통해 얻은 결과
      orderList: [],

      //모달 관련
      isShowModal: false,
      isShowModalUpdate: false,

      editedQuantity: 0, // 모달에서 수정한 실제 수량
      selectedRow: {}, // 수정할 행 정보

      //ag grid 관련
      theme: theme,
      rowData1: [], //검색 결과(db를 통해 얻은 결과에서 골라서 부분 선택적으로 추가)
      columnDefs: [ //검색 결과 열
        { headerName: "체크",
          field: "check",
          resizable: false,
          editable: true,
          sortable: false,
        },
        { headerName: "자재발주코드", field: "orderCode", resizable: false },
        { headerName: "자재명", field: "mName", resizable: false },
        { headerName: "발주수량", field: "ordQty", resizable: false },
        { headerName: "발주신청일", field: "orderDate", resizable: false },
      ],
      rowData2: [],   //신청 내역
      columnDefs2: [
        { headerName: "자재발주코드", field: "orderCode", resizable: false },
        { headerName: "자재명", field: "mName", resizable: false },
        { headerName: "실제수량", field: "ordQty", resizable: false, editable: true,},
        { headerName: "발주신청일", field: "orderDate", resizable: false },
        {
          cellRenderer: (params) => {
            return `
              <button class="btn btn-danger btn-sm delete-btn" data-id="${params.node.id}">
                삭제
              </button>
            `;
          },
          editable: false,
          resizable: false,
          sortable: false,
          filter: false,
          cellStyle: { textAlign: "center" }
        }
      ],
      defaultColDef: {
        headerClass: "header-center"
      },
    };
  },



  methods: {
    //검색창 관련    
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
      let searchResult = await axios.post(`${ajaxUrl}/meterialOrderQC`, result)
        .catch(err => console.log(err));
      this.orderList = searchResult.data;

      // ag grid에 결과값 넣기
      this.rowData1 = []
      for (let i = 0; i < this.orderList.length; i++) {
        let col = {
          "check": false, "orderCode": this.orderList[i].order_code, "mName": this.orderList[i].material_name,
          "ordQty": this.orderList[i].ord_qty, "orderDate": this.dateFormat(this.orderList[i].order_date, 'yyyy-MM-dd')
        };
        this.rowData1[i] = col;
      }
    },
    //전체 조회
    async searchOrderAll() {
      let searchResult = await axios.get(`${ajaxUrl}/meterialOrderQCAll`)
        .catch(err => console.log(err));
      this.orderList = searchResult.data;

      // ag grid에 결과값 넣기
      this.rowData1 = []
      for (let i = 0; i < this.orderList.length; i++) {
        let col = {
          "check": false, "orderCode": this.orderList[i].order_code, "mName": this.orderList[i].material_name,
          "ordQty": this.orderList[i].ord_qty, "orderDate": this.dateFormat(this.orderList[i].order_date, 'yyyy-MM-dd')
        }
        this.rowData1[i] = col;
      }
    },

    onGridReady(params) {
      this.gridApi = params.api;
      this.gridApi.sizeColumnsToFit();

      // 기존 이벤트 리스너 제거
        document.removeEventListener("click", this.handleDeleteButtonClick);

      // 새 삭제 버튼 이벤트 리스너 등록
      this.handleDeleteButtonClick = (event) => {
        if (event.target && event.target.classList.contains("delete-btn")) {
          const rowIndex = event.target.getAttribute("data-id");
          this.deleteRow(rowIndex);
        }
      };
      document.addEventListener("click", this.handleDeleteButtonClick);
    },

    //검색 결과 관련
    // 체크한 항목을 rowData2(신청내역)에 추가
    addCheckedRows() {
      // 체크박스가 true인 항목만 필터링
      const checkedRows = this.rowData1.filter(row => row["check"] === true);
      if(checkedRows.length==0){
        notify({
            title: "등록오류",
            text: "추가할 상품을 선택하고 눌러주세요.",
            type: "error", // success, warn, error 가능
        });
        return;
      }

      // 중복되지 않게 추가하기 위해 기존 rowData2와 병합
      const newRows = checkedRows.filter(row =>
        !this.rowData2.some(existingRow => existingRow["orderCode"] === row["orderCode"])
      );

      this.rowData2 = [...this.rowData2, ...newRows]; // rowData2에 추가
    },

    //생산내역 관련
    //삭제버튼 누를시 해당 행 삭제처리
    deleteRow(rowIndex) {
      const nodeToDelete = this.gridApi.getDisplayedRowAtIndex(rowIndex);
      // 데이터 삭제
      this.rowData2 = this.rowData2.filter((row) => row !== nodeToDelete.data);
      
      console.log('삭제됨');
      console.log(this.rowData2);

    },
    //초기화
    resetAll() {
      const rawData = toRaw(this.rowData2);
      console.log('Raw rowData2:', rawData);
      this.rowData2.forEach((item, index) => {
        console.log(`Index ${index}:`, item);
        console.log(`  자재발주코드: ${item.orderCode}`);
        console.log(`  자재명: ${item.mName}`);
        console.log(`  발주수량: ${item.ordQty}`);
        console.log(`  발주신청일: ${item.orderDate}`);
      });
      this.searchOrderAll()
      this.rowData2 = []; // 저장된 항목 초기화
    },


    //기타 관련
    // 날짜를 YYYY-MM-DD 형식으로 변환
    dateFormat(value, format) {
      return userDateUtils.dateFormat(value, format);
    },
    //모달 열기
    openModal() {
      if (this.rowData2.length == 0){
        notify({
            title: "등록실패",
            text: "신청내역이 비었습니다.",
            type: "error", // success, warn, error 가능
        });
        return;
      }
      this.isShowModal = !this.isShowModal
    },
    //저장하면 입고검사테이블에 추가처리
    async confirm() {
      console.log('rowData2');
      console.log(this.rowData2);
      
      //let objs = []
      const rawData = toRaw(this.rowData2);   //[{mName:"당근", ordQty:"100000", ...}, {...}, ...]
      // console.log(rawData);
      // console.log(`${rawData[0].mName}`);

      let insertResult = await axios.post(`${ajaxUrl}/insertQCM`, rawData)
        .catch(err => console.log(err));
      console.log(`${insertResult.data.successNum}개 입력됨`);
      notify({
            title: "신청완료",
            text: `${insertResult.data.successNum}건이 신청되었습니다`,
            type: "success", // success, warn, error 가능
      });
      this.searchOrderAll() // 저장된 항목 초기화
      this.rowData2 = []; // 저장된 항목 초기화



      this.closeModal();
      
    },
    //수량 수정 관련
    //신청 건의 합격량, 불합격량(불량항목, 각각의 수량) 처리
    onCellClicked(event) {
      //삭제버튼을 누룰 때 출력X
      if (event.event.target && event.event.target.classList.contains("delete-btn")) {
        return;
      }
      // 선택된 행 데이터 저장 및 모달 표시
      this.selectedRow = JSON.parse(JSON.stringify(event.data));
      this.editedQuantity = this.selectedRow.ordQty;
      this.isShowModalUpdate = true;
    },

    updateQnt(orderCD, qty){
      console.log('값수정');
      console.log(orderCD);
      console.log(qty);
      console.log(this.selectedRow);
      if(qty <=0){
        notify({
            title: "입력 오류",
            text: "유효하지 않은 값입니다.",
            type: "warn", // success, warn, error 가능
        });
        return;
      }
      const targetIndex = this.rowData2.findIndex(row => row.orderCode === orderCD);
      if (targetIndex !== -1) {
        // this.rowData2 = this.rowData2.map((row, index) => {
        //   if (index === targetIndex) {
        //     return { ...row, ordQty:qty, };
        //   }
        //   return row;
        // });
        this.rowData2[targetIndex] = { 
          ...this.rowData2[targetIndex], 
          ordQty: qty, // 수량만 업데이트
        };
        
      }
      this.rowData2 = [...this.rowData2, ];
      this.closeModal();
      console.log(this.rowData2);
    },
    //모달 닫기
    closeModal() {
      this.isShowModal = false;
      this.isShowModalUpdate = false;
    }
  },
  //기본테이블출력
  created(){
    this.searchOrderAll();
  },
};
</script>


<style scoped lang="scss">
.container-fluid {
  min-height: 500px;

  .search {
    margin-top: 24px;
  }
}
</style>