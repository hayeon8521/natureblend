<!-- 조회페이지 검색기능들 샘플 -->
<template>
   <div>
      <h3>&nbsp;&nbsp;자재 입고 조회</h3>
   </div>
<!-- 검색 메뉴 레이아웃 -->
<div class="main-container">
   <div class="content" style="height: 250px;">
      <form class="row gx-3 gy-2 align-items-center">
         <!-- 자재명 -->
         <div class="col-sm-2">
            <label class="col-form-label fw-bold" for="materialCode">자재명</label>
            <input type="text" class="form-control" style="background-color: white; padding-left: 20px;" id="materialCode" v-model="materialCode">
         </div>

         <!-- 주문서명 -->
         <div class="col-sm-2">
            <label class="col-form-label fw-bold" for="clientName">업체명</label>
            <input type="text" class="form-control" style="background-color: white; padding-left: 20px;" id="clientName" v-model="clientName">
         </div>

         <!-- 자재발주코드 -->
         <div class="col-sm-2">
            <label class="col-form-label fw-bold" for="POListCode">자재발주코드</label>
            <input type="text" class="form-control" style="background-color: white; padding-left: 20px;" id="POListCode" v-model="POListCode">
         </div>
      </form>

      <div class="row gx-3 gy-2 mt-2">
         <!-- 납기일자 -->
         <div class="col-sm-2">
            <label class="col-form-label fw-bold" for="startDate">입고 시작 범위</label>
            <div class="input-group">
               <input type="date" class="form-control" style="background-color: white; padding-left: 20px;" id="startDate" v-model="startDate">
            </div>
         </div>
         <div class="col-sm-2">
            <label class="col-form-label fw-bold" for="endDate">입고 끝 범위</label>
            <div class="input-group">
               <input type="date" class="form-control" style="background-color: white; padding-left: 20px;" id="endDate" v-model="endDate">
            </div>
         </div>
      </div>

      <!-- 저장 버튼 -->
      <div class="col-auto mt-1 text-center">
         <button type="button" class="btn btn-warning me-5" @click="seachPoList">조회</button>
         <button type="button" class="btn btn-warning" @click="reSet">초기화</button>
      </div>
   </div>
</div>
<!-- 검색 메뉴 레이아웃 끝 -->
<div class="grid-container" style="padding-top: 10px;">
   <ag-grid-vue
      :rowData="rowData"
      :columnDefs="columnDefs"
      :theme="theme"
      :pagination="true"
      :paginationPageSize="10"
      @grid-ready="onReady"
      style="height: 513px;"
      rowSelection="multiple"
   >
   </ag-grid-vue>
</div>
</template>
<script setup>
//import axios from 'axios';
// import { ajaxUrl } from '@/utils/commons.js';
// import userDateUtils from '@/utils/useDates.js';

//import Modal from "@/views/material/materialInputModal.vue";

import theme from "@/utils/agGridTheme";
import { ref } from 'vue'; //onBeforeMount

const materialCode = ref();   //자재명
const clientName = ref();  //업체명
const POListCode = ref();  //자재발주코드
const startDate = ref();   //시작일
const endDate = ref();  //종료일

// 리셋
const reSet = () => {
   materialCode.value = '';
   clientName.value = '';
   POListCode.value = '';
   startDate.value = '';
   endDate.value = '';
   //전체 조회 sql 메소드 호출
};

// 조회
const seachPoList = () => {
   console.log(materialCode.value);
   console.log(clientName.value);
   console.log(POListCode.value);
   console.log(startDate.value);
   console.log(endDate.value);
   //해당값을 객체만들어서 노드에 던져서 원하는 조건으로 검색하게 만들기
};

  //그리드 api 컬럼명 들어가는 거
const columnDefs = ref([
   { headerName: "No.", field: "body_num", width:100 },
   { headerName: "자재발주코드", field: "order_code" },
   { headerName: "자재명", field: "material_name" },
   { headerName: "업체명", field: "com_name" },
   { headerName: "요청수량", field: "ord_qty" },
   { headerName: "입고수량", field: "total_qnt" },
   { headerName: "정상수량", field: "pass_qnt" },
   { headerName: "창고", field: "chang1" },
   { headerName: "불량수량", field: "rjc_qnt" },
   { headerName: "창고", field: "chang2" },
   { headerName: "입고일자", field: "input_date" },
   {  
      headerName: "입고검사", 
      field: "비고", 
      editable: false,
      cellRenderer: params => {
      const button = document.createElement('button');
      button.innerText = '검사표';
      button.addEventListener('click', () => {
         console.log("레코드 확인 : ", JSON.stringify(params.data));
      });
      return button;
      }
   },
   {  
      headerName: "LOT조회", 
      field: "LOT조회", 
      editable: false,
      cellRenderer: params => {
      const button2 = document.createElement('button');
      button2.innerText = '조회';
      button2.addEventListener('click', () => {
         console.log("레코드 확인 : ", JSON.stringify(params.data));
         //여기서도 모달열고 1건 던져주게 만들어야함 (배열에 담아서)
      });
      return button2;
      }
   },
]);

const rowData = ref([
    { body_num: 1, order_code: "PO20241218001", material_name: "철근", com_name: "ABC 철강", ord_qty: 1000, total_qnt: 1000, pass_qnt: 980, chang1: "제1창고", rjc_qnt: 20, chang2: "불량창고", input_date: "2024-12-18" },
    { body_num: 2, order_code: "PO20241218002", material_name: "콘크리트", com_name: "XYZ 건설", ord_qty: 500, total_qnt: 490, pass_qnt: 480, chang1: "제2창고", rjc_qnt: 10, chang2: "불량창고", input_date: "2024-12-18" },
    { body_num: 3, order_code: "PO20241218003", material_name: "목재", com_name: "WOOD 공업", ord_qty: 200, total_qnt: 200, pass_qnt: 200, chang1: "제3창고", rjc_qnt: 0, chang2: "불량창고", input_date: "2024-12-17" },
    { body_num: 4, order_code: "PO20241218004", material_name: "페인트", com_name: "COLOR 코팅", ord_qty: 300, total_qnt: 290, pass_qnt: 280, chang1: "제1창고", rjc_qnt: 10, chang2: "불량창고", input_date: "2024-12-16" },
    { body_num: 5, order_code: "PO20241218005", material_name: "유리", com_name: "CLEAR 산업", ord_qty: 150, total_qnt: 150, pass_qnt: 145, chang1: "제4창고", rjc_qnt: 5, chang2: "불량창고", input_date: "2024-12-15" },
    { body_num: 6, order_code: "PO20241218006", material_name: "케이블", com_name: "CABLE 주식회사", ord_qty: 400, total_qnt: 390, pass_qnt: 380, chang1: "제5창고", rjc_qnt: 10, chang2: "불량창고", input_date: "2024-12-14" },
    { body_num: 7, order_code: "PO20241218007", material_name: "스틸 파이프", com_name: "STEEL 공업", ord_qty: 600, total_qnt: 600, pass_qnt: 590, chang1: "제6창고", rjc_qnt: 10, chang2: "불량창고", input_date: "2024-12-13" },
    { body_num: 8, order_code: "PO20241218008", material_name: "볼트", com_name: "BOLT 제조사", ord_qty: 800, total_qnt: 800, pass_qnt: 790, chang1: "제1창고", rjc_qnt: 10, chang2: "불량창고", input_date: "2024-12-12" },
    { body_num: 9, order_code: "PO20241218009", material_name: "아스팔트", com_name: "ROAD 건설", ord_qty: 300, total_qnt: 300, pass_qnt: 290, chang1: "제2창고", rjc_qnt: 10, chang2: "불량창고", input_date: "2024-12-11" },
    { body_num: 10, order_code: "PO20241218010", material_name: "조명기구", com_name: "LIGHTING 디자인", ord_qty: 120, total_qnt: 120, pass_qnt: 115, chang1: "제3창고", rjc_qnt: 5, chang2: "불량창고", input_date: "2024-12-10" },
    { body_num: 11, order_code: "PO20241218011", material_name: "벽돌", com_name: "BRICK 제조", ord_qty: 700, total_qnt: 690, pass_qnt: 680, chang1: "제4창고", rjc_qnt: 10, chang2: "불량창고", input_date: "2024-12-09" },
    { body_num: 12, order_code: "PO20241218012", material_name: "타일", com_name: "TILE 공업", ord_qty: 400, total_qnt: 400, pass_qnt: 395, chang1: "제5창고", rjc_qnt: 5, chang2: "불량창고", input_date: "2024-12-08" },
    { body_num: 13, order_code: "PO20241218013", material_name: "플라스틱", com_name: "PLASTIC 주식회사", ord_qty: 500, total_qnt: 490, pass_qnt: 480, chang1: "제6창고", rjc_qnt: 10, chang2: "불량창고", input_date: "2024-12-07" },
    { body_num: 14, order_code: "PO20241218014", material_name: "고무", com_name: "RUBBER 산업", ord_qty: 350, total_qnt: 350, pass_qnt: 345, chang1: "제1창고", rjc_qnt: 5, chang2: "불량창고", input_date: "2024-12-06" },
    { body_num: 15, order_code: "PO20241218015", material_name: "단열재", com_name: "INSULATION 전문", ord_qty: 250, total_qnt: 250, pass_qnt: 245, chang1: "제2창고", rjc_qnt: 5, chang2: "불량창고", input_date: "2024-12-05" },
]);

const onReady = (param) => {
   param.api.sizeColumnsToFit(); //그리드 api 넓이 슬라이드 안생기게하는거
}

</script>
<style lang="scss" scoped>
.main-container{
    background-color:  #e9ecef;
    margin-left: 20px;
    margin-right: 20px;
    margin-top: 0px;
    margin-bottom: 0px;
    border-radius: 10px;
}
.content{
   margin-left: 20px;
   margin-right: 20px;
   margin-top: 0px;
   margin-bottom: 0px;
   padding: 0px;
}
input {
      background-color: $white;
      border: solid 1px  ;
}
</style>
