<!-- 
    메뉴 : 자재>자재재고>자재 LOT 조회 메뉴
-->
<template>
   <div class="p-3">
      <h3 style="font-family: Arial, Helvetica, sans-serif;">&nbsp;&nbsp;자재 LOT 조회</h3>
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
            <label class="col-form-label fw-bold" for="POListCode">자재LOT번호</label>
            <input type="text" class="form-control" style="background-color: white; padding-left: 20px;" id="POListCode" v-model="POListCode" autocomplete="off" @keydown.enter="enterkey">
         </div>
 
          <!-- 입고 상태 -->
          <div class="col-sm-2">
             <label class="col-form-label fw-bold" for="materialNomal">불량여부</label><br>
             <div id="materialNomal" style="padding-left: 20px; display: inline-flex; align-items: center; gap: 15px; white-space: nowrap;">
                <label style="white-space: nowrap;"><input type="checkbox" class="form-check-input" value="b1" v-model="materialNomal" />&nbsp;&nbsp;미불량</label>
                <label style="white-space: nowrap;"><input type="checkbox" class="form-check-input" value="b2" v-model="materialNomal" />&nbsp;&nbsp;불량</label>
             </div>
          </div>

          <!-- 폐기상태 상태 -->
          <div class="col-sm-2">
             <label class="col-form-label fw-bold" for="materialLotState">폐기 상태</label><br>
             <div id="materialLotState" style="padding-left: 20px; display: inline-flex; align-items: center; gap: 15px; white-space: nowrap;">
                <label style="white-space: nowrap;"><input type="checkbox" class="form-check-input" value="c1" v-model="materialLotState" />&nbsp;&nbsp;미폐기</label>
                <label style="white-space: nowrap;"><input type="checkbox" class="form-check-input" value="c2" v-model="materialLotState" />&nbsp;&nbsp;폐기</label>
             </div>
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

         <!-- 유통기한 지난거 -->
         <div class="col-sm-2">
             <label class="col-form-label fw-bold" for="limitOut">유통기한</label><br>
             <div id="limitOut" style="padding-left: 10px; display: inline-flex; align-items: center; gap: 15px; white-space: nowrap;">
                <label style="white-space: nowrap;"><input type="checkbox" class="form-check-input" value="out" v-model="limitOut" />&nbsp;&nbsp;지난 자재 보기</label>
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
      :tooltipShowDelay="500"
      :tooltipHideDelay="3000"
   >
   </ag-grid-vue>
 </div>
 <div>
    <Modal :isShowModal="isShowModal" :deleteList="deleteList" @closeModal="closeModal" @confirm="confirm">
    </Modal>
 </div>
 </template>
 <script setup>
 import axios from 'axios';
 import { ajaxUrl } from '@/utils/commons.js';
 import userDateUtils from '@/utils/useDates.js';
 
 import Modal from "@/views/material/materialLotqtyModal.vue";

 import CustomNoRowsOverlay from "@/views/natureBlendComponents/grid/noDataMsg.vue";
 
 import theme from "@/utils/agGridTheme";
 import { ref, onBeforeMount } from 'vue'; //onBeforeMount
 
 import { useNotification } from "@kyvg/vue3-notification";  //노티 드리겠습니다
 const { notify } = useNotification();  // 노티 내용변수입니다
 

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
 const materialCode = ref('');   //자재명
 const clientName = ref('');  //업체명
 const POListCode = ref('');  //로트번호
 const startDate = ref('');   //입고시작일
 const endDate = ref('');  //입고종료일
 const limitOut = ref(''); //유통기한 지난것만 보기
 const materialNomal = ref([]);   //입고상태를 담는 배열
 const materialLotState = ref([]);   //패기상태를 담는 배열

 const seachcondition = ref({}); //서치조건 담는 배열
 
 const deleteList = ref([]);   //모달에 보내줄 값
 
 // 리셋
 const reSet = () => {
   materialCode.value = '';
   clientName.value = '';
   POListCode.value = '';
   startDate.value = '';
   endDate.value = '';
   qty_state.value = 'a1';
   limitOut.value = '';
   materialNomal.value = [];
   materialLotState.value = [];
 
   seachcondition.value = {
    materialCode: '',
    clientName: '',
    POListCode: '',
    startDate: '',
    endDate: '',
    qty_state: '',
    limitOut: '',
    materialNomal: [],
    materialLotState: [],
   }
   lotqtylist();   //초기화버튼 누르면 이거 실행
 
   // notify({
   //     title: "검색조건",
   //     text: "초기화 완료 했습니다.",
   //     type: "success", // success, warn, error 가능
   //  });
 
 };
 
 // 조회
 const seachPoList = () => {
   console.log(qty_state.value);
   console.log(materialCode.value);
   console.log(clientName.value);
   console.log(POListCode.value);
   console.log(startDate.value);
   console.log(endDate.value);
   console.log(materialNomal.value);
   console.log(materialLotState.value);
   console.log(limitOut.value);
 
   seachcondition.value = {
    materialCode: materialCode.value,
    clientName: clientName.value,
    POListCode: POListCode.value,
    startDate: startDate.value,
    endDate: endDate.value,
    materialNomal: materialNomal.value,
    materialLotState: materialLotState.value,
    qty_state: qty_state.value,
    limitOut: limitOut.value,
   }
 
   lotqtylist();
 };
 
  //그리드 api 컬럼명 들어가는 거
 const columnDefs = ref([
   { headerName: "No.", field: "lot_seq", flex:2, cellStyle: { textAlign: "center" }, tooltipField: "lot_seq", },
   { headerName: "자재 LOT번호", field: "lot_code", flex:4, cellStyle: { textAlign: "center" } },
   { headerName: "자재명", field: "material_name", flex:4, cellStyle: { textAlign: "left" } },
   { headerName: "업체명", field: "com_name", flex:4, cellStyle: { textAlign: "left" } },
   { headerName: "입고량", field: "in_qty", flex:3, cellStyle: { textAlign: "right" } },
   { headerName: "입고담당", field: "name", flex:3, cellStyle: { textAlign: "center" } },
   { headerName: "가용", field: "material_nomal", flex:3, cellStyle: { textAlign: "center" } },
   { headerName: "현재고", field: "stok_qty", flex:3, cellStyle: { textAlign: "right" } },
   { headerName: "불가용", field: "hold_qty", flex:3, cellStyle: { textAlign: "right" } },
   { headerName: "출고재고", field: "out_qty", flex:3, cellStyle: { textAlign: "right" } },
   { headerName: "입고일", field: "inset_lot_date", flex:3, cellStyle: { textAlign: "center" } },
   { headerName: "유통기한", field: "limit_date", flex:3, cellStyle: { textAlign: "center" } },
   { headerName: "창고위치", field: "warehouse_name", flex:3, cellStyle: { textAlign: "left" } },
   { headerName: "폐기", field: "material_lot_state", flex:2, cellStyle: { textAlign: "center" },
      tooltipValueGetter: params => params.data.material_dis_content ? `담당 : ${params.data.dis_name} / 사유 : ${params.data.material_dis_content}`: "",  
   },
   {  
      headerName: "비고", 
      field: "폐기처리", 
      flex:2,
      editable: false,
      cellRenderer: params => {
         if(params.data.material_lot_state === "정상" && (loginfo.value.job === '자재' || loginfo.value.job === '관리자') ){
            const div = document.createElement('div');
            div.style.display = 'flex';
            div.style.justifyContent = 'center';
            div.style.alignItems = 'center';
            div.style.height = '100%';

            const button2 = document.createElement('button');
            button2.innerText = '폐기처리';
            button2.style.cursor = 'pointer';
            button2.style.backgroundColor = '#f44335';
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
               //여기서도 모달열고 1건 던져주게 만들어야함 (배열에 담아서)
               deleteList.value = params.data;
               //console.log('aaaaa', deleteList.value);
               const quantity = Number(deleteList.value.hold_qty.split(' ')[0]);
               if(quantity !== 0){
               notify({
                  //title: "폐기불가",
                  text: "공정 투입중인 자재는 폐기불가 합니다.",
                  type: "error", // success, warn, error 가능
               });
               }else{
                  console.log('모달 오픈');
                  isShowModal.value = true;
               }
            });
            div.appendChild(button2);
            return div;
            //return button2;
            }
         }
   },
 ]);
 
 //모달 여는 변수
 const isShowModal = ref(false);
 // 모달 취소
 const closeModal = () => {
    isShowModal.value = false;
    notify({
       //title: "폐기취소",
       text: "폐기 취소 하였습니다.",
       type: "error", // success, warn, error 가능
    });
 };
 // 모달 확인
 const confirm = (data1) => {
    console.log("모달 확인 버튼 클릭됨");
   //  console.log('data1',data1);
   //  console.log('data2',deleteList.value);
    const newObject = {
      lot_seq: deleteList.value.lot_seq,
      trush_reason: data1,
      emp_num: loginfo.value.emp_num, // 로그인 세션 받아야함
    };
    if( deleteList.value.lot_seq && data1){
       trush_go(newObject);
    }else{
      notify({
         //title: "폐기실패",
         text: "폐기사유가 꼭 필요합니다.",
         type: "error", // success, warn, error 가능
      });
    }
    isShowModal.value = false; // 모달 닫기
 };
 
 const trush_go = async (newObject) => {
   //console.log(newObject);
   let result = await axios.post(`${ajaxUrl}/material/trushGo`, newObject)
                           .catch(err=>console.log(err));
   //console.log('aaaaaa',result.data);
   if(result.data[0][0]['v_result']==='OK'){
      notify({
         //title: "폐기성공",
         text: "폐기 성공 하였습니다.",
         type: "success", // success, warn, error 가능
      });
      lotqtylist();
   }else{
      notify({
         //title: "폐기실패",
         text: "폐기실패 "+result.data[0]['v_result']+" 관리자 문의 해주세요.",
         type: "error", // success, warn, error 가능
      });
   }
 };

// AG Grid Vue 컴포넌트 참조
const gridRef = ref(null);
// CSV 내보내기 메서드
const onExportClick = () => {
  if (gridRef.value) {
    const gridApi = gridRef.value.api; // AG Grid API
    gridApi.exportDataAsCsv({
      fileName: "자재_LOT_재고_리스트.csv",
    });
  }
};

 // 엔터키 누르면 하는거
 const enterkey = (event) => {
    event.preventDefault();
    seachPoList();
 };
 
 const onReady = (param) => {
   //param.api.sizeColumnsToFit(); //그리드 api 넓이 슬라이드 안생기게하는거
   console.log('지금은 안씀', param);
 }
 
 //데이터 잡아넣을 그리드 api 행
 const rowData = ref([]);
 
 // 전체 목록 조회 (검색기능 넣어서)
 const lotqtylist = async function(){
   let result = await axios.put(`${ajaxUrl}/material/lotqtylist`, seachcondition.value)
                       .catch(err=>console.log(err));
    console.log(result.data);
    rowData.value = result.data.map((col) => ({
       ...col,
       in_qty: col.material_name.includes('병') ? (col.in_qty).toLocaleString() + " 개" : (col.in_qty * 0.001).toLocaleString() + " kg",
       stok_qty: col.material_name.includes('병') ? (col.stok_qty).toLocaleString() + " 개" : (col.stok_qty * 0.001).toLocaleString() + " kg",
       hold_qty: col.material_name.includes('병') ?  (col.hold_qty).toLocaleString() + " 개" : (col.hold_qty * 0.001).toLocaleString() + " kg",
       out_qty: col.material_name.includes('병') ? (col.out_qty).toLocaleString() + " 개" : (col.out_qty * 0.001).toLocaleString() + " kg",
       inset_lot_date: userDateUtils.dateFormat(col.inset_lot_date, "yyyy-MM-dd"),
       limit_date: userDateUtils.dateFormat(col.limit_date, "yyyy-MM-dd"),
     })
   );
 }
 
 // 화면 생성되는 시점
 onBeforeMount(()=>{
   lotqtylist();   //전체조회 쿼리 실행
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
      border: solid 1px #ced4da ;
 }
 </style>