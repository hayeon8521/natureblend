<!-- 
    메뉴 : 자재>자재입고>자재 입고 조회 메뉴
-->
<template>
   <div class="p-3">
      <h3>&nbsp;&nbsp;자재 입고 조회</h3>
   </div>
<!-- 검색 메뉴 레이아웃 -->
<div class="main-container">
   <div class="content" style="height: 250px;">
      <form class="row gx-3 gy-2 align-items-center">
         <!-- 자재명 -->
         <div class="col-sm-2">
            <label class="col-form-label fw-bold" for="materialCode">자재명</label>
            <input type="text" class="form-control" style="background-color: white; padding-left: 20px;" id="materialCode" v-model="materialCode" autocomplete="off" @keydown.enter="enterkey">
         </div>

         <!-- 주문서명 -->
         <div class="col-sm-2">
            <label class="col-form-label fw-bold" for="clientName">업체명</label>
            <input type="text" class="form-control" style="background-color: white; padding-left: 20px;" id="clientName" v-model="clientName" autocomplete="off" @keydown.enter="enterkey">
         </div>

         <!-- 자재발주코드 -->
         <div class="col-sm-2">
            <label class="col-form-label fw-bold" for="POListCode">자재발주코드</label>
            <input type="text" class="form-control" style="background-color: white; padding-left: 20px;" id="POListCode" v-model="POListCode" autocomplete="off" @keydown.enter="enterkey">
         </div>
      </form>

      <div class="row gx-3 gy-2 mt-2">
         <!-- 납기일자 -->
         <div class="col-sm-2">
            <label class="col-form-label fw-bold" for="startDate">입고일(부터)</label>
            <div class="input-group">
               <input type="date" class="form-control" style="background-color: white; padding-left: 20px;" id="startDate" v-model="startDate" @keydown.enter="enterkey">
            </div>
         </div>
         <div class="col-sm-2">
            <label class="col-form-label fw-bold" for="endDate">입고일(까지)</label>
            <div class="input-group">
               <input type="date" class="form-control" style="background-color: white; padding-left: 20px;" id="endDate" v-model="endDate" @keydown.enter="enterkey">
            </div>
         </div>
      </div>

      <!-- 저장 버튼 -->
      <div class="col-auto mt-1 text-center">
         <button type="button" class="btn me-5" style="background-color: #4caf50; color: white;" @click="seachPoList">조회</button>
         <button type="button" class="btn me-5" style="background-color: #fb8c00; color: white;" @click="reSet">초기화</button>
         <button type="button" class="btn" style="background-color: #0077ff; color: white;" @click="onExportClick">엑셀다운</button>
      </div>
   </div>
</div>
<!-- 검색 메뉴 레이아웃 끝 -->
<div class="grid-container" style="padding-top: 10px;">
   <ag-grid-vue
      ref="gridRef"
      :rowData="rowData"
      :columnDefs="columnDefs"
      :theme="theme"
      :pagination="true"
      :paginationPageSize="9"
      :paginationPageSizeSelector="[9, 20, 50, 100]"
      @grid-ready="onReady"
      style="height: 471px;"
      rowSelection="multiple"
      :noRowsOverlayComponent="CustomNoRowsOverlay"
   >
   </ag-grid-vue>
</div>
<div>
   <Modal :isShowModal="isShowModal" :newObject="newObject"  @closeModal="closeModal" @confirm="confirm"></Modal>
</div>
<div>
    <InspectionModal :isShowModal2="isShowModal2" :inspection_data="inspection_data" @closeModal2="closeModal2" @confirm2="confirm2">
    </InspectionModal>
</div>
</template>
<script setup>
import axios from 'axios';
import { ajaxUrl } from '@/utils/commons.js';
import userDateUtils from '@/utils/useDates.js';

import { useNotification } from "@kyvg/vue3-notification";  //노티 드리겠습니다
const { notify } = useNotification();  // 노티 내용변수입니다

import Modal from "@/views/material/materialInputListModal.vue";
import InspectionModal from "@/views/material/inspection_com.vue";

import CustomNoRowsOverlay from "@/views/natureBlendComponents/grid/noDataMsg.vue";

import theme from "@/utils/agGridTheme";
import { ref, onBeforeMount } from 'vue'; //onBeforeMount

 //라우팅 정보 가져오기
 import { useRouter } from 'vue-router';
const router = useRouter();
// 로그인 정보 가져오기
import { useStore } from 'vuex'; // Vuex 스토어 가져오
const store = useStore();
const loginfo = ref({});
const loginInfo = () => {
   loginfo.value = store.state.loginInfo;
   if(loginfo.value.job === '자재' || loginfo.value.position === '관리자'){
      console.log(loginfo.value.job);
   }else{
      notify({
         //title: "로그인요청",
         text: "자재팀 또는 관리자만 접속 가능합니다.",
         type: "error", // success, warn, error 가능
      });
      router.push({ name: 'MainPage' });
   }
};

const materialCode = ref();   //자재명
const clientName = ref();  //업체명
const POListCode = ref();  //자재발주코드
const startDate = ref();   //시작일
const endDate = ref();  //종료일
const seachcondition = ref({}); //서치조건 담는 배열

// 리셋
const reSet = () => {
  materialCode.value = '';
  clientName.value = '';
  POListCode.value = '';
  startDate.value = '';
  endDate.value = '';

  seachcondition.value = {
   materialCode: '',
   clientName: '',
   POListCode: '',
   startDate: '',
   endDate: ''
  }
  matrialInputList();   //초기화버튼 누르면 이거 실행

  //this.$notify({ text: '필수 정보를 모두 입력하세요.', type: 'error' });

//   notify({
//       title: "검색조건",
//       text: "초기화 완료 했습니다.",
//       type: "success", // success, warn, error 가능
//    });
};


// AG Grid Vue 컴포넌트 참조
const gridRef = ref(null);
// CSV 내보내기 메서드
const onExportClick = () => {
  if (gridRef.value) {
    const gridApi = gridRef.value.api; // AG Grid API
    gridApi.exportDataAsCsv({
      fileName: "자재_입고_리스트.csv",
    });
  }
};


// 검수확인증 모달에 사용할 배열 초기화
const inspection_data = ref({});
// 검수확인증 모달 띄우기
const inspection_com = (data) => {
  //모달 형식에 맞게 필요한 값만 가져감
  inspection_data.value = {
    order_code: data.order_code,
    material_name: data.material_name,
    com_name: data.com_name,
    ord_qty: data.ord_qty,
    total_qnt: data.total_qty,
    pass_qnt: data.pass_qty,
    rjc_qnt: data.reject_qty,
  };
  console.log('검사표 모달오픈전 : ',inspection_data.value);
  //모달 오픈
  isShowModal2.value = true;
};
//모달 여는데 사용하는 변수
const isShowModal2 = ref(false);
 // 모달 취소
 const closeModal2 = () => {
  isShowModal2.value = false;
};
 // 모달 확인
 const confirm2 = () => {
  isShowModal2.value = false;
};



// 조회
const seachPoList = () => {
  console.log(materialCode.value);
  console.log(clientName.value);
  console.log(POListCode.value);
  console.log(startDate.value);
  console.log(endDate.value);

  seachcondition.value = {
   materialCode: materialCode.value,
   clientName: clientName.value,
   POListCode: POListCode.value,
   startDate: startDate.value,
   endDate: endDate.value
  }
  matrialInputList();
};

  //그리드 api 컬럼명 들어가는 거
const columnDefs = ref([
   { headerName: "No.", field: "input_num", width:80, cellStyle: { textAlign: "center" } },
   { headerName: "자재발주코드", field: "order_code", width:150, cellStyle: { textAlign: "center" } },
   { headerName: "자재명", field: "material_name", cellStyle: { textAlign: "left" } },
   { headerName: "업체명", field: "com_name", cellStyle: { textAlign: "left" } },
   { headerName: "요청수량", field: "ord_qty", width:120, cellStyle: { textAlign: "right" } },
   { headerName: "입고수량", field: "in_qty", width:120, cellStyle: { textAlign: "right" } },
   { headerName: "정상수량", field: "pass_qty", width:120, cellStyle: { textAlign: "right" } },
   { headerName: "창고", field: "pass_warehouse_name", width:110, cellStyle: { textAlign: "left" } },
   { headerName: "불량수량", field: "reject_qty", width:120, cellStyle: { textAlign: "right" } },
   { headerName: "창고", field: "reject_warehouse_name", width:110, cellStyle: { textAlign: "left" } },
   { headerName: "입고일자", field: "inset_lot_date", width:140, cellStyle: { textAlign: "center" } },
   { headerName: "입고담당", field: "name", width:130, cellStyle: { textAlign: "center" } },
   {  
      headerName: "입고검사", 
      field: "비고", 
      width:130,
      editable: false,
      cellRenderer: params => {
      const div = document.createElement('div');
      div.style.display = 'flex';
      div.style.justifyContent = 'center';
      div.style.alignItems = 'center';
      div.style.height = '100%';
         
      const button = document.createElement('button');
      button.innerText = '검사표';
      button.style.cursor = 'pointer';
      button.style.backgroundColor = '#fb8c00';
      button.style.width = '60px';
      button.style.height = '30px';
      button.style.color = 'white';
      button.style.border = 'none';
      button.style.borderRadius = '4px';
      button.style.display = 'flex';
      button.style.justifyContent = 'center';
      button.style.alignItems = 'center';
      button.addEventListener('click', () => {
         console.log("레코드 확인 : ", JSON.stringify(params.data));
         inspection_com(params.data);
      });
      div.appendChild(button);
      return div;
      //return button;
      }
   },
   {  
      headerName: "LOT조회", 
      field: "LOT조회", 
      width:130,
      editable: false,
      cellRenderer: params => {
      const div = document.createElement('div');
      div.style.display = 'flex';
      div.style.justifyContent = 'center';
      div.style.alignItems = 'center';
      div.style.height = '100%';

      const button2 = document.createElement('button');
      button2.innerText = '조회';
      button2.style.cursor = 'pointer';
      button2.style.backgroundColor = '#4caf50';
      button2.style.width = '60px';
      button2.style.height = '30px';
      button2.style.color = 'white';
      button2.style.border = 'none';
      button2.style.borderRadius = '4px';
      button2.style.display = 'flex';
      button2.style.justifyContent = 'center';
      button2.style.alignItems = 'center';
      button2.addEventListener('click', () => {
         //console.log("레코드 확인 : ", JSON.stringify(params.data));
         //로트번호 조회해서 모달여는거
         lotinfo(params.data);
      });
      div.appendChild(button2);
      return div;
      //return button2;
      }
   },
]);

const lotinfodata = ref([]);

 //모달 여는 변수
 const isShowModal = ref(false);

 // 모달에 전달할 오브젝
 const newObject = ref([]);

//로트번호 조회해서 모달 열꺼임
const lotinfo = async (lotdata) =>{
   console.log(lotdata);
   lotinfodata.value = await lotInfoAxios(lotdata.input_num);

   //console.log(lotinfodata.value);
   newObject.value = {
      material_name: lotdata.material_name,
      lot_code: lotinfodata.value[0]['lot_code'],
      //pass_stok_qty: ( lotinfodata.value[0]['pass_stok_qty'] * 0.001 ) + lotdata.material_name.includes('병') ? ' 개' : ' kg',
      pass_stok_qty: lotdata.material_name.includes('병') ? ( lotinfodata.value[0]['pass_stok_qty'] ).toLocaleString()+' 개' : ( lotinfodata.value[0]['pass_stok_qty'] * 0.001 ).toLocaleString()+' kg',
      //reject_stok_qty: ( lotinfodata.value[0]['reject_stok_qty'] * 0.001 ) + ' kg',
      reject_stok_qty: lotdata.material_name.includes('병') ? ( lotinfodata.value[0]['reject_stok_qty']  ).toLocaleString()+' 개' : ( lotinfodata.value[0]['reject_stok_qty'] * 0.001 ).toLocaleString()+' kg',
   };
   console.log('newObject ',newObject);

   //모달 열기
   isShowModal.value = true;
};

// LOT 현 재고리스트 가져오는거
const lotInfoAxios = async function(input_num){
   let result = await axios.get(`${ajaxUrl}/material/lotinfo/${input_num}`)
                      .catch(err=>console.log(err));
   return result.data;
};

// 모달 확인
const confirm = () => {
  console.log("모달 확인 버튼 클릭됨");
  isShowModal.value = false; // 모달 닫기
};

 // 모달 취소
 const closeModal = () => {
  isShowModal.value = false;
};


// 엔터키 누르면 하는거
const enterkey = (event) => {
   event.preventDefault();
   seachPoList();
};

//데이터 잡아넣을 그리드 api 행
const rowData = ref([]);

const onReady = (param) => {
   param.api.sizeColumnsToFit(); //그리드 api 넓이 슬라이드 안생기게하는거
}

// 화면 생성되는 시점
onBeforeMount(()=>{
  matrialInputList();   //전체조회 쿼리 실행
  loginInfo();
});


// 전체 목록 조회 (검색기능 넣어서)
const matrialInputList = async function(){
  let result = await axios.put(`${ajaxUrl}/material/materialInputList`, seachcondition.value)
                      .catch(err=>console.log(err));
   console.log(result.data);
   rowData.value = result.data.map((col) => ({
      ...col,
      //ord_qty: (col.ord_qty * 0.001) + " kg",
      ord_qty: col.material_name.includes('병') ? (Number(col.ord_qty)).toLocaleString() + " 개" : (Number(col.ord_qty) * 0.001).toLocaleString() + " kg",
      //in_qty: (col.in_qty * 0.001) + " kg",
      in_qty: col.material_name.includes('병') ? (Number(col.in_qty)).toLocaleString() + " 개" : (Number(col.in_qty) * 0.001).toLocaleString() + " kg",
      //pass_qty: (col.pass_qty * 0.001) + " kg",
      pass_qty: col.material_name.includes('병') ? (Number(col.pass_qty)).toLocaleString() + " 개" : (Number(col.pass_qty) * 0.001).toLocaleString() + " kg",
      //reject_qty: (col.reject_qty * 0.001) + " kg",
      reject_qty: col.material_name.includes('병') ? (Number(col.reject_qty)).toLocaleString() + " 개" : (Number(col.reject_qty) * 0.001).toLocaleString() + " kg",
      inset_lot_date: userDateUtils.dateFormat(col.inset_lot_date, "yyyy-MM-dd")
    })
  );
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
      border: solid 1px  #ced4da;
}
</style>
