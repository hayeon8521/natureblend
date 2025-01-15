<!-- 
    메뉴 : 자재>자재발주>자재 발주 조회
-->
<template>
  <div class="p-3">
     <h3>&nbsp;&nbsp;자재 발주 조회</h3>
  </div>
<!-- 검색 메뉴 레이아웃 -->
<div class="main-container">
  <div class="content" style="height: 250px;">
     <form class="row gx-3 gy-2 align-items-center">
        <!-- 자재명 -->
        <div class="col-sm-2">
           <label class="col-form-label fw-bold" for="materialCode">자재명</label>
           <input type="text" class="form-control" style="background-color: white; padding-left: 20px;" id="materialCode" v-model="materialCode" @keydown.enter="enterkey" autocomplete="off">
        </div>

        <!-- 주문서명 -->
        <div class="col-sm-2">
           <label class="col-form-label fw-bold" for="clientName">업체명</label>
           <input type="text" class="form-control" style="background-color: white; padding-left: 20px;" id="clientName" v-model="clientName" @keydown.enter="enterkey" autocomplete="off">
        </div>

        <!-- 자재발주코드 -->
        <div class="col-sm-2">
           <label class="col-form-label fw-bold" for="POListCode">자재발주코드</label>
           <input type="text" class="form-control" style="background-color: white; padding-left: 20px;" id="POListCode" v-model="POListCode" @keydown.enter="enterkey" autocomplete="off">
        </div>

         <!-- 발주 상태 -->
         <div class="col-sm-2">
            <label class="col-form-label fw-bold" for="materialState">발주 상태</label>
            <div id="materialState" style="padding-left: 20px; display: inline-flex; align-items: center; gap: 15px; white-space: nowrap;">
               <label style="white-space: nowrap;"><input type="checkbox" class="form-check-input" value="a1" v-model="materialState" />&nbsp;&nbsp;발주등록</label>
               <label style="white-space: nowrap;"><input type="checkbox" class="form-check-input" value="a3" v-model="materialState" />&nbsp;&nbsp;발주취소</label>
               <label style="white-space: nowrap;"><input type="checkbox" class="form-check-input" value="a4" v-model="materialState" />&nbsp;&nbsp;발주완료</label>
            </div>
         </div>
     </form>

     <div class="row gx-3 gy-2 mt-2">
        <!-- 납기일자 -->
        <div class="col-sm-2">
           <label class="col-form-label fw-bold" for="startDate">발주일(부터)</label>
           <div class="input-group">
              <input type="date" class="form-control" style="background-color: white; padding-left: 20px;" id="startDate" v-model="startDate" @keydown.enter="enterkey">
           </div>
        </div>
        <div class="col-sm-2">
           <label class="col-form-label fw-bold" for="endDate">발주일(까지)</label>
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
  ><!--513-->
  </ag-grid-vue>
</div>
<div>
   <Modal :isShowModal="isShowModal" :deleteList="deleteList" :totalcanceNO_display="totalcanceNO_display" @closeModal="closeModal" @confirm="confirm">
   </Modal>
</div>
</template>
<script setup>
import axios from 'axios';
import { ajaxUrl } from '@/utils/commons.js';
import userDateUtils from '@/utils/useDates.js';

import Modal from "@/views/material/materialOrderListModal.vue";
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

const materialCode = ref('');   //자재명
const clientName = ref('');  //업체명
const POListCode = ref('');  //자재발주코드
const startDate = ref('');   //시작일
const endDate = ref('');  //종료일
const materialState = ref([]);   //처리상태를 담는 배열

const seachcondition = ref({}); //서치조건 담는 배열

const deleteList = ref([]);   //모달에 보내줄 값

// 리셋
const reSet = () => {
  materialCode.value = '';
  clientName.value = '';
  POListCode.value = '';
  startDate.value = '';
  endDate.value = '';
  materialState.value = [];

  seachcondition.value = {
   materialCode: '',
   clientName: '',
   POListCode: '',
   startDate: '',
   endDate: '',
   materialState: [],
  }
  matrialOrderList2();   //초기화버튼 누르면 이거 실행

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
      fileName: "자재_발주_리스트.csv",
    });
  }
};

// 조회
const seachPoList = () => {
  console.log(materialCode.value);
  console.log(clientName.value);
  console.log(POListCode.value);
  console.log(startDate.value);
  console.log(endDate.value);
  console.log(materialState.value);

  seachcondition.value = {
   materialCode: materialCode.value,
   clientName: clientName.value,
   POListCode: POListCode.value,
   startDate: startDate.value,
   endDate: endDate.value,
   materialState: materialState.value,
  }

  matrialOrderList2();
};

 //그리드 api 컬럼명 들어가는 거
const columnDefs = ref([
  { headerName: "No.", field: "body_num", width:75, cellStyle: { textAlign: "center" } },
  { headerName: "자재발주코드", field: "order_code", width:130, cellStyle: { textAlign: "center" } },
  { headerName: "자재명", field: "material_name", cellStyle: { textAlign: "left" } },
  { headerName: "업체명", field: "com_name", width:150, cellStyle: { textAlign: "left" } },
  { headerName: "발주수량", field: "ord_qty", width:110, cellStyle: { textAlign: "right" } },
  { headerName: "발주날짜", field: "order_date", width:110, cellStyle: { textAlign: "center" } },
  { headerName: "납기기한", field: "limit_date", width:110, cellStyle: { textAlign: "center" } },
  { headerName: "단가", field: "unit_price", width:110, cellStyle: { textAlign: "right" } },
  { headerName: "금액", field: "total_price", width:110, cellStyle: { textAlign: "right" } },
  { headerName: "발주담당", field: "name", width:100, cellStyle: { textAlign: "center" } },
  { headerName: "상태", field: "material_state", width:100, 
   cellStyle: { textAlign: "center" },
   cellRenderer: params => {
      if (params.value) {
         if(params.data.material_state==='발주등록' && params.data.inspec_status==='검사요청완료'){
            return '입고검사중';
         }else if(params.data.material_state==='발주등록' && params.data.inspec_status==='검사완료'){
            return '입고대기중';
         }else{
            return params.value;
         }
      }else{
         return;
      }
   },
  },
  {
      headerName: "출력",
      field: "비고",
      width: 100,
      editable: false,
      cellRenderer: params => {
         const div = document.createElement('div');
         div.style.display = 'flex';
         div.style.justifyContent = 'center';
         div.style.alignItems = 'center';
         div.style.height = '100%';

         const button = document.createElement('button');
         button.innerText = '발주서';
         button.style.cursor = 'pointer';
         button.style.backgroundColor = '#4caf50';
         button.style.width = '60px';
         button.style.height = '30px';
         button.style.color = 'white';
         button.style.border = 'none';
         button.style.borderRadius = '4px';
         button.style.display = 'flex';
         button.style.justifyContent = 'center';
         button.style.alignItems = 'center';

         button.addEventListener('click', () => {
            console.log("발주서출력 : ", JSON.stringify(params.data));
            // 발주서 출력
            printRowData(params.data);
         });

         div.appendChild(button);
         return div;
      }
   },
   {
      headerName: "취소",
      field: "취소",
      width: 100,
      editable: false,
      cellRenderer: params => {
         if (params.data.material_state === "발주등록" && !params.data.inspec_status) {
            const div = document.createElement('div');
            div.style.display = 'flex';
            div.style.justifyContent = 'center';
            div.style.alignItems = 'center';
            div.style.height = '100%';

            const button2 = document.createElement('button');
            button2.innerText = '취소';
            button2.style.cursor = 'pointer';
            button2.style.backgroundColor = '#f44335';
            button2.style.width = '60px';
            button2.style.height = '30px';
            button2.style.color = 'white';
            button2.style.border = 'none';
            button2.style.borderRadius = '4px';
            // 수직 가운데 정렬을 위한 스타일 추가
            button2.style.display = 'flex';
            button2.style.justifyContent = 'center';
            button2.style.alignItems = 'center';

            button2.addEventListener('click', () => {
               console.log("주문취소 : ", JSON.stringify(params.data));
               // 여기서도 모달열고 1건 던져주게 만들어야함 (배열에 담아서)
               console.log(params.data.order_code);
               const totalcanceNO = rowData.value.find( idx => idx.order_code === params.data.order_code && idx.inspec_status);
               if(totalcanceNO){
                  //console.log(totalcanceNO.body_num);
                  totalcanceNO_display.value = false;
               }
               deleteList.value = params.data;
               console.log('모달 오픈');
               isShowModal.value = true;
            });

            div.appendChild(button2);
            return div;
         }
      }
   },
]);

const totalcanceNO_display = ref(true);


//사업자 정보가져오기
const client_info = async function(com_name){
   console.log(com_name);
   let result = await axios.get(`${ajaxUrl}/material/fullClientKeyWord/${com_name}`)
                              .catch(err=>console.log(err));
   return result.data;
};

//사업자 번호 분할
function formatBusinessNumber(businessNumber) {
    businessNumber = businessNumber.toString();
    const formattedNumber = `${businessNumber.slice(0, 3)}-${businessNumber.slice(3, 5)}-${businessNumber.slice(5)}`;
    return formattedNumber;
}

//같은 발주서 자재 정보 가져오기
const materialBodyList = async function(orderCode){
   let result = await axios.get(`${ajaxUrl}/material/matBodyList/${orderCode}`)
                              .catch(err=>console.log(err));
   return result.data;
};

// 발주서 출력하기
const printRowData = async (rowData) => {
   const client_data = await client_info(rowData.com_name);
   client_data.value = client_data[0];
   client_data.value.com_num = formatBusinessNumber(client_data.value.com_num);
   console.log(client_data.value.emp_name);

   const material_list = await materialBodyList(rowData.order_code);
   console.log(material_list);

   let materialRows = '';
   let tototal_price = 0;
   material_list.forEach((item, index) => {
      tototal_price += item.material_name.includes('병') ? (item.total_price) : (item.total_price*0.001);
      materialRows += `
         <tr>
            <td style="text-align: center;">${index + 1}</td>
            <td style="text-align: center;">${item.material_code}</td>
            <td>${item.material_name}</td>
            <td style="text-align: right;">${ item.material_name.includes('병') ? (item.ord_qty).toLocaleString() : (item.ord_qty*0.001).toLocaleString() }</td>
            <td style="text-align: center;">${ item.material_name.includes('병') ? "개" : "kg"  }</td>
            <td style="text-align: right;">${(item.material_name.includes('병') ? item.unit_price.toLocaleString() : item.unit_price*0.001).toLocaleString() }</td>
            <td style="text-align: center;">원</td>
            <td style="text-align: right;">${(item.material_name.includes('병') ? item.total_price.toLocaleString() : item.total_price*0.001).toLocaleString()}</td>
            <td style="text-align: center;">원</td>
         </tr>
      `;
   });



   const printContent = `
      <html>
      <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>네이처 블렌드 발주서</title>
      <style>
         body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            line-height: 1.5;
         }
         .container {
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid black;
         }
         table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
         }
         th {
            border: 1px solid black;
            padding: 8px;
            text-align: center;
         }
         td {
            border: 1px solid black;
            padding: 8px;
            text-align: left;
         }
         th {
            background-color: #f4f4f4;
         }
         .note {
            margin: 10px 0;
            font-weight: bold;
            text-align: left;
         }
         .compact td {
            padding: 5px;
         }
         @media print {
            .no-print {
               display: none;
            }
         }
      </style>
      </head>
      <body>
      <div class="container">
         <button class="btn no-print" style="background-color: #4caf50; color: white;" onclick="window.print()">출력하기</button>
         <h1 style="text-align: center;">발 주 서</h1>
         <table>
            <tr>
            <th>발주일자</th>
            <td>${rowData.order_date}</td>
            <th>납품일자</th>
            <td>${rowData.limit_date}</td>
            </tr>
            <tr>
            <th>발주번호</th>
            <td>${rowData.order_code}</td>
            <th>납품장소</th>
            <td>대구 중구 중앙대로 403 5층(네이처 블렌드)</td>
            </tr>
            <tr>
            <th>상호</th>
            <td>${rowData.com_name}</td>
            <th>등록번호</th>
            <td>${client_data.value.com_num}</td>
            </tr>
            <tr>
            <th>전화번호</th>
            <td>${client_data.value.emp_tel}</td>
            <th>담당자</th>
            <td>${client_data.value.emp_name}</td>
            </tr>
            <tr>
            <th>총액</th>
            <td style="text-align: right;">${tototal_price.toLocaleString()} 원</td>
            <th>업체주소</th>
            <td>${client_data.value.address}</td>
            </tr>
         </table>

         <table>
            <tr>
            <th>NO</th>
            <th>품목코드</th>
            <th>품목</th>
            <th>수량</th>
            <th>단위</th>
            <th>단가</th>
            <th>단위</th>
            <th>총액</th>
            <th>단위</th>
            </tr>
            ${materialRows}
         </table>

         <div class="note">NOTE : 유선통화 내용 바탕으로 발주 넣었습니다.</div>

         <table>
            <tr>
               <th class="merged-cell" rowspan="3">접수처</th>
               <th>접수일자</th>
               <td>${rowData.order_date}</td>
               <th class="merged-cell" rowspan="3">결재</th>
               <th>발주담당자</th>
               <th>출고거래처</th>
               <th>입고관리자</th>
            </tr>
            <tr>
               <th>접수번호</th>
               <td>${rowData.order_code}</td>
               <td rowspan="2" style="text-align: center;">${rowData.name}</td>
               <td rowspan="2">&nbsp;</td>
               <td rowspan="2">&nbsp;</td>
            </tr>
            <tr>
               <th>접수자</th>
               <td>${rowData.name}</td>
            </tr>
         </table>
      </div>
      </body>
      </html>
   `;
   const printWindow = window.open('', '_blank', 'width=1000,height=1000');
   printWindow.document.open();
   printWindow.document.write(printContent);
   printWindow.document.close();
};







//모달 여는 변수
const isShowModal = ref(false);
// 모달 취소
const closeModal = () => {
   isShowModal.value = false;
   totalcanceNO_display.value = true;
   notify({
      //title: "취소",
      text: "발주를 취소하지 않았습니다.",
      type: "error", // success, warn, error 가능
   });
};
// 모달 확인
//const deleteNum = ref();
const confirm = (deleteNum) => {
   console.log("모달 확인 버튼 클릭됨", deleteList.value);
   console.log("deleteNum : ", deleteNum);
   totalcanceNO_display.value = true;
   isShowModal.value = false; // 모달 닫기
   if(!deleteNum){
      notify({
         //title: "관리자문의요망",
         text: "관리자 문의 부탁드립니다.",
         type: "error", // success, warn, error 가능
      });
   }else{
      // 1=전체취소 // 2=단건취소 ( deleteNum )
      const materialObj = {
         deleteNum: deleteNum,
         body_num: deleteList.value.body_num,
         order_code: deleteList.value.order_code,
      }
      poList_delete(materialObj);
   }
};  

// 주문 취소 처리하기
const poList_delete = async function(materialObj){
  console.log(materialObj);
  let result = await axios.post(`${ajaxUrl}/material/poListDelete`, materialObj)
                             .catch(err=>console.log(err));
  console.log(result.data);
  if(result.data.affectedRows >= 1){
      notify({
         //title: "알림 제목",
         text: "삭제 완료 했습니다.",
         type: "success", // success, warn, error 가능
      });
      matrialOrderList2(); //결과가 있을때만 새로고침
  }
}

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
const matrialOrderList2 = async function(){
  let result = await axios.put(`${ajaxUrl}/material/polistorder2`, seachcondition.value)
                      .catch(err=>console.log(err));
   console.log(result.data);
   rowData.value = result.data.map((col) => ({
      ...col,
      //ord_qty: (col.ord_qty * 0.001) + " kg",
      ord_qty: col.material_name.includes('병') ? Number(col.ord_qty).toLocaleString() + " 개" : (Number(col.ord_qty) * 0.001).toLocaleString() + " kg",
      order_date: userDateUtils.dateFormat(col.order_date, "yyyy-MM-dd"),
      limit_date: userDateUtils.dateFormat(col.limit_date, "yyyy-MM-dd"),
      unit_price: col.material_name.includes('병') ? Number(col.unit_price).toLocaleString() + " 원" : Number(col.unit_price*0.001).toLocaleString() + " 원",
      total_price: col.material_name.includes('병') ? Number(col.total_price).toLocaleString() + " 원" : Number(col.total_price*0.001).toLocaleString() + " 원"
    })
  );
}

// 전체 목록 조회 (신기술 도입으로 사용 중단)
// const matrialOrderList = async function(){
//   let result = await axios.get(`${ajaxUrl}/material/polistorder`)
//                       .catch(err=>console.log(err));
//   //console.log('전체목록 : ',result.data);
//   //rowData.value = result.data;
//   //{  ord_qty, order_date, limit_date, unit_price, total_price, material_state: "", }
//   rowData.value = result.data.map((col) => ({
//       ...col,
//       ord_qty: (col.ord_qty * 0.001) + " kg",
//       order_date: userDateUtils.dateFormat(col.order_date, "yyyy-MM-dd"),
//       limit_date: userDateUtils.dateFormat(col.limit_date, "yyyy-MM-dd"),
//       unit_price: Number(col.unit_price).toLocaleString() + " 원",
//       total_price: Number(col.total_price*0.001).toLocaleString() + " 원"
//     })
//   );
// }


// 화면 생성되는 시점
onBeforeMount(()=>{
  matrialOrderList2();   //전체조회 쿼리 실행
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