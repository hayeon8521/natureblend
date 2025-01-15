<!-- 
    메뉴 : 자재>자재재조>자재재고 조회 메뉴 부모 페이지
-->
<template>
   <div class="p-3">
      <h3>&nbsp;&nbsp;자재 재고 조회</h3>
   </div>
 <!-- 검색 메뉴 레이아웃 -->
 <div class="main-container">
   <div class="content" style="height: 250px;">
      <form class="row gx-3 gy-2 align-items-center">

         <!-- 현재상태 상태 -->
         <div class="col-sm-2" style="width: 105px;" >
            <label class="col-form-label fw-bold" for="qty_state">재고 상태</label>
            <div id="qty_state" style="padding-left: 0px;">
               <select class="form-select" v-model="qty_state" style="width: 85px; border: solid 1px #ced4da; background-color: white; text-align: center;" aria-label="재고 상태 선택">
                     <option value="a1">전체</option>
                     <option value="a2">재고있음</option>
                     <option value="a3">재고없음</option>
               </select>
            </div>
         </div>

         <!-- 자재코드 -->
         <div class="col-sm-2">
            <label class="col-form-label fw-bold" for="materialCode">자재코드</label>
            <input type="text" class="form-control" style="background-color: white; padding-left: 20px;" id="materialCode" v-model="materialCode" autocomplete="off" @keydown.enter="enterkey">
         </div>
 
         <!-- 자재명 -->
         <div class="col-sm-2">
            <label class="col-form-label fw-bold" for="materialName">자재명</label>
            <input type="text" class="form-control" style="background-color: white; padding-left: 20px;" id="materialName" v-model="materialName" autocomplete="off" @keydown.enter="enterkey">
         </div>
          
      </form>
 
      <div class="row gx-3 gy-2 mt-2">
         <!-- 자재 등록 일자 -->
         <div class="col-sm-2">
            <label class="col-form-label fw-bold" for="startDate">등록일(부터)</label>
            <div class="input-group">
               <input type="date" class="form-control" style="background-color: white; padding-left: 20px;" id="startDate" v-model="startDate" @keydown.enter="enterkey">
            </div>
         </div>
         <div class="col-sm-2">
            <label class="col-form-label fw-bold" for="endDate">등록일(까지)</label>
            <div class="input-group">
               <input type="date" class="form-control" style="background-color: white; padding-left: 20px;" id="endDate" v-model="endDate" @keydown.enter="enterkey">
            </div>
         </div>

         <!-- 유통기한 지난거 -->
         <div class="col-sm-2" style="width:120px;">
            <label class="col-form-label fw-bold" for="limitOut">폐기필요</label><br>
            <div id="limitOut" style="padding-left: 10px; display: inline-flex; align-items: center; gap: 15px; white-space: nowrap;">
               <label style="white-space: nowrap;"><input type="checkbox" class="form-check-input" value="out" v-model="limitOut" />&nbsp;&nbsp;자재 보기</label>
            </div>
         </div>

         <!-- 생산대기 -->
         <div class="col-sm-2" style="width:120px;">
            <label class="col-form-label fw-bold" for="product_qty">생산대기</label><br>
            <div id="product_qty" style="padding-left: 10px; display: inline-flex; align-items: center; gap: 15px; white-space: nowrap;">
               <label style="white-space: nowrap;"><input type="checkbox" class="form-check-input" value="out" v-model="product_qty" />&nbsp;&nbsp;자재 보기</label>
            </div>
         </div>

         <!-- 발주중 -->
         <div class="col-sm-2" style="width:120px;">
            <label class="col-form-label fw-bold" for="order_qty">발주중인</label><br>
            <div id="order_qty" style="padding-left: 10px; display: inline-flex; align-items: center; gap: 15px; white-space: nowrap;">
               <label style="white-space: nowrap;"><input type="checkbox" class="form-check-input" value="out" v-model="order_qty" />&nbsp;&nbsp;자재 보기</label>
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
 </template>
 <script setup>
 import axios from 'axios';
 import { ajaxUrl } from '@/utils/commons.js';
 import userDateUtils from '@/utils/useDates.js';
 
 import theme from "@/utils/agGridTheme";
 import { ref, onBeforeMount } from 'vue'; //onBeforeMount
 
 import { useNotification } from "@kyvg/vue3-notification";  //노티 드리겠습니다
 const { notify } = useNotification();  // 노티 내용변수입니다

 import CustomNoRowsOverlay from "@/views/natureBlendComponents/grid/noDataMsg.vue";
 
  //라우팅 정보 가져오기
  import { useRouter } from 'vue-router';
const router = useRouter();
// 로그인 정보 가져오기
import { useStore } from 'vuex'; // Vuex 스토어 가져오
const store = useStore();
const loginfo = ref({});
const loginInfo = () => {
   loginfo.value = store.state.loginInfo;
   if(loginfo.value.name){
      console.log(loginfo.value.job);
   }else{
      notify({
         //title: "로그인요청",
         text: "로그인 하셔야 접속 가능합니다.",
         type: "error", // success, warn, error 가능
      });
      router.push({ name: 'MainPage' });
   }
};
 
 const qty_state = ref('a1'); //재고상태
 const materialCode = ref('');   //자재코드
 const materialName = ref('');  //자재명
 const startDate = ref('');   //등록 시작일
 const endDate = ref('');  //등록 종료일
 const limitOut = ref(''); //유통기한 지난것만 보기
 const product_qty = ref(''); //불가용
 const order_qty = ref('');   //발주중인 자재

 const seachcondition = ref({}); //서치조건 담는 배열
 
 // 리셋
 const reSet = () => {
   materialCode.value = '';
   materialName.value = '';
   startDate.value = '';
   endDate.value = '';
   qty_state.value = 'a1';
   limitOut.value = '';
   product_qty.value = '';
   order_qty.value = '';
 
   seachcondition.value = {
    materialCode: '',
    materialName: '',
    startDate: '',
    endDate: '',
    qty_state: '',
    limitOut: '',
    product_qty: '',
    order_qty: '',
   }
   qtylist();   //초기화버튼 누르면 이거 실행
 
   // notify({
   //     title: "검색조건",
   //     text: "초기화 완료 했습니다.",
   //     type: "success", // success, warn, error 가능
   //  });
  
 };
 
 // AG Grid Vue 컴포넌트 참조
const gridRef = ref(null);
// CSV 내보내기 메서드
const onExportClick = () => {
  if (gridRef.value) {
    const gridApi = gridRef.value.api; // AG Grid API
    gridApi.exportDataAsCsv({
      fileName: "자재_재고_리스트.csv",
    });
  }
};

 // 조회
 const seachPoList = () => {
   console.log(qty_state.value);
   console.log(materialCode.value);
   console.log(materialName.value);
   console.log(startDate.value);
   console.log(endDate.value);
   console.log(limitOut.value);
   console.log(product_qty.value);
   console.log(order_qty.value);
 
   seachcondition.value = {
    materialCode: materialCode.value,
    materialName: materialName.value,
    startDate: startDate.value,
    endDate: endDate.value,
    qty_state: qty_state.value,
    limitOut: limitOut.value,
    product_qty: product_qty.value,
    order_qty: order_qty.value,
   }
   qtylist();
 };
 
  //그리드 api 컬럼명 들어가는 거
   const columnDefs = ref([
      { headerName: "No.", field: "row_num", width: 100, cellStyle: { textAlign: "center" } },
      { headerName: "자재코드", field: "material_code", width: 250, cellStyle: { textAlign: "center" } },
      { headerName: "자재명", field: "material_name", cellStyle: { textAlign: "left" } },
      { headerName: "현재고량", field: "stok_qty", cellStyle: { textAlign: "right" } },
      { headerName: "불가용", field: "reject_qty", cellStyle: { textAlign: "right" } },
      { headerName: "폐기필요재고", field: "trush_qty", cellStyle: { textAlign: "right" } },
      { headerName: "발주중재고", field: "order_qty", cellStyle: { textAlign: "right" } },
      { headerName: "안전재고", field: "safety_inventory", cellStyle: { textAlign: "right" } },
      { headerName: "자재등록일", field: "regi_date", cellStyle: { textAlign: "center" } },
   ]);

 // 엔터키 누르면 하는거
 const enterkey = (event) => {
    event.preventDefault();
    seachPoList();
 };
 
 const onReady = (param) => {
   param.api.sizeColumnsToFit(); //그리드 api 넓이 슬라이드 안생기게하는거
 }
 
 //데이터 잡아넣을 그리드 api 행
 const rowData = ref([]);
 
 // 전체 목록 조회 (검색기능 넣어서)
 const qtylist = async function(){
   console.log('aaaaa', seachcondition.value);
   let result = await axios.post(`${ajaxUrl}/material/materialqtylist`, seachcondition.value)
                        .catch(err=>console.log(err));
   console.log(result.data);
   
   rowData.value = result.data.map(val => ({
      ...val,
      stok_qty: val.material_name.includes('병') ? Number(val.stok_qty).toLocaleString() + ' 개' : (Number(val.stok_qty)*0.001).toLocaleString() + ' kg',
      reject_qty : val.material_name.includes('병') ? Number(val.reject_qty).toLocaleString() + ' 개' : (Number(val.reject_qty)*0.001).toLocaleString() + ' kg',
      trush_qty : val.material_name.includes('병') ? Number(val.trush_qty).toLocaleString() + ' 개' : (Number(val.trush_qty)*0.001).toLocaleString() + ' kg', 
      order_qty : val.material_name.includes('병') ? Number(val.order_qty).toLocaleString() + ' 개' : (Number(val.order_qty)*0.001).toLocaleString() + ' kg',  
      safety_inventory : val.material_name.includes('병') ? Number(val.safety_inventory).toLocaleString() + ' 개' : (Number(val.safety_inventory)*0.001).toLocaleString() + ' kg',   
      regi_date : userDateUtils.dateFormat(val.regi_date, "yyyy-MM-dd"),
   }));
 }

 // 화면 생성되는 시점
 onBeforeMount(()=>{
   qtylist();   //전체조회 쿼리 실행
   loginInfo();
 });
 
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

<style lang="scss">
   .ag-header {
      .ag-header-cell-label {
         place-content: center;
      }
   }
</style>
 