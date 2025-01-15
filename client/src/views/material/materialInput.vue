<!-- 
    메뉴 : 자재>자재입고>자재입고 메뉴 부모 페이지
-->
<template>
   <div class="pt-3" style="padding-left: 16px;">
      <h3>&nbsp;&nbsp;자재 입고</h3>
   </div>
    <div class="grid-container pt-0">
      <ag-grid-vue
        :rowData="rowData"
        :columnDefs="columnDefs"
        :theme="theme"
        :pagination="true"
        :paginationPageSize="10"
        :paginationPageSizeSelector="[10, 20, 50, 100]"
        @grid-ready="onReady"
        style="height: 700px;"
        :quickFilterText="clientNamesearch"
        rowSelection="multiple"
        :noRowsOverlayComponent="CustomNoRowsOverlay"
        >
    </ag-grid-vue>
   </div>
   <div>
    <Modal :isShowModal="isShowModal" :testStr="testStr" v-model:nuwList="nuwList" :whList="whList" @closeModal="closeModal" @confirm="confirm">
    </Modal>
  </div>
  <div>
    <InspectionModal :isShowModal2="isShowModal2" :inspection_data="inspection_data" @closeModal2="closeModal2" @confirm2="confirm2">
    </InspectionModal>
  </div>
  <div v-if="showprogress" style="width: 100%; height: 100%; background-color: #0005; position: fixed; top: 0px; left: 0px; z-index: 1000;">
      <div style="position: fixed; top: 50%; left: 30%;  width: 50%;">
          <material-progress color="success" :percentage="number2" />
      </div>
  </div>
 </template>
<script setup>
import axios from 'axios';
import { ajaxUrl } from '@/utils/commons.js';
import userDateUtils from '@/utils/useDates.js';

import Modal from "@/views/material/materialInputModal.vue";
import InspectionModal from "@/views/material/inspection_com.vue";

import CustomNoRowsOverlay from "@/views/natureBlendComponents/grid/noDataMsg.vue";

 import theme from "@/utils/agGridTheme";
 import { ref, onBeforeMount } from 'vue';

import { useNotification } from "@kyvg/vue3-notification";  //노티 드리겠습니다
const { notify } = useNotification();  // 노티 내용변수입니다

 //import { ref, shallowRef, computed, onBeforeMount } from 'vue';
 //import { useRouter } from 'vue-router';

 import MaterialProgress from "@/components/MaterialProgress.vue";

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

 //프로그래스 돌릴 숫자
 const number2 = ref(0);
 const showprogress = ref(false);

 // 행 레코드 삽입하는 변수
 const rowData = ref([]);
 // {all_ckeck: false,body_num: 1,order_code: "A1001", material_name: "철근", com_name: "철강사", ord_qty: 100, total_qnt: 90, pass_qnt: 85, rjc_qnt: 5, unit_price: 1000, total_price: 90000, inspec_end: "2024-06-12", 비고: "" }

 const testStr = ref("test");

 //그리드 api 컬럼명 들어가는 거
 const columnDefs = ref([
        { 
          headerCheckboxSelection: true,
          checkboxSelection: true,
          headerName: "",
          width:45,
        },
        { headerName: "No.", field: "body_num", width:100, cellStyle: { textAlign: "center" } },
        { headerName: "자재발주코드", field: "order_code", cellStyle: { textAlign: "center" } },
        { headerName: "자재명", field: "material_name" },
        { headerName: "업체명", field: "com_name" },
        { headerName: "발주수량", field: "ord_qty", cellStyle: { textAlign: "right" } },
        { headerName: "입고수량", field: "total_qnt", cellStyle: { textAlign: "right" } },
        { headerName: "정상수량", field: "pass_qnt", cellStyle: { textAlign: "right" } },
        { headerName: "불량수량", field: "rjc_qnt", cellStyle: { textAlign: "right" } },
        { headerName: "단가", field: "unit_price", cellStyle: { textAlign: "right" } },
        { headerName: "총액", field: "total_price", cellStyle: { textAlign: "right" } },
        { headerName: "검사완료일", field: "inspec_end", cellStyle: { textAlign: "center" } },
        {  
          headerName: "입고검사", 
          field: "비고", 
          width:150,
          editable: false,
          cellStyle: { textAlign: "center" },
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
          headerName: "입고", 
          field: "입고", 
          width: 145,
          cellStyle: { textAlign: "center" },
          editable: false,
          cellRenderer: params => {
            const div = document.createElement('div');
            div.style.display = 'flex';
            div.style.justifyContent = 'center';
            div.style.alignItems = 'center';
            div.style.height = '100%';

            const button2 = document.createElement('button');
            button2.innerText = '입고';
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
              console.log("레코드 확인 : ", JSON.stringify(params.data));
              //여기서도 모달열고 1건 던져주게 만들어야함 (배열에 담아서)
              allInput(params.data);
            });
            div.appendChild(button2);
            return div;
            //return button2;
          }
        }
      ]);


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
    total_qnt: data.total_qnt,
    pass_qnt: data.pass_qnt,
    rjc_qnt: data.rjc_qnt,
  };
  console.log(inspection_data.value);
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



// 전체 데이터 가져와서 입맛에 맞게 수정해서 사용하기
const matrialQcInput = async function(){
  let result = await axios.get(`${ajaxUrl}/material/miql`)
                      .catch(err=>console.log(err));
  //console.log(result.data);  //여기서 바뀌는값을 집어넣는거임
  rowData.value = result.data;
  //console.log(rowData.value[0]['inspec_end']);
  rowData.value = result.data.map(col => ({
    ...col,
    inspec_end: userDateUtils.dateFormat(col.inspec_endm, "yyyy-MM-dd"),
    //ord_qty: (col.ord_qty * 0.001) + " kg",
    ord_qty: col.material_name.includes('병') ? (Number(col.ord_qty)).toLocaleString() + " 개" : (Number(col.ord_qty) * 0.001).toLocaleString() + " kg",
    //total_qnt: (col.total_qnt * 0.001) + " kg",
    total_qnt: col.material_name.includes('병') ? (Number(col.total_qnt)).toLocaleString() + " 개" : (Number(col.total_qnt) * 0.001).toLocaleString() + " kg",
    //pass_qnt: (col.pass_qnt * 0.001) + " kg",
    pass_qnt: col.material_name.includes('병') ? (Number(col.pass_qnt)).toLocaleString() + " 개" : (Number(col.pass_qnt) * 0.001).toLocaleString() + " kg",
    //rjc_qnt: (col.rjc_qnt * 0.001) + " kg",
    rjc_qnt: col.material_name.includes('병') ? (Number(col.rjc_qnt)).toLocaleString() + " 개" : (Number(col.rjc_qnt) * 0.001).toLocaleString() + " kg",
    //unit_price: Number(col.unit_price*0.001).toLocaleString() + " 원",
    unit_price: col.material_name.includes('병') ? Number(col.unit_price).toLocaleString() + " 원" : Number(col.unit_price*0.001).toLocaleString() + " 원",
    //total_price: Number(col.total_price*0.000001).toLocaleString() + " 원",
    total_price: col.material_name.includes('병') ? Number(col.total_price).toLocaleString() + " 원" : Number(col.total_price*0.000001).toLocaleString() + " 원",
  }));
}

//창고리스트 모달에 던질꺼
const whList = ref([]);

//창고 조회 해오기
const warehouseInfo = async function(){
  let result = await axios.get(`${ajaxUrl}/material/warehouse`)
                      .catch(err=>console.log(err));
  //console.log('창고조회 : ',result.data);
  whList.value = result.data;
}

//검색 기능 변수
const clientNamesearch = ref('');

//ag-grid 메소드 API가 준비된 후 발생하는 이벤트
const onReady = (param) => {
  param.api.sizeColumnsToFit(); //그리드 api 넓이 슬라이드 안생기게하는거
  allInputData.value = param.api;  //전체선택 받아오는거

  // 페이징 영역에 버튼 만들기
  const paginationPanel = document.querySelector('.ag-paging-panel');
  if (paginationPanel) {

    // 컨테이너 생성
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.gap = '5px'; // 버튼과 입력 필드 간격

    // 버튼 생성
    const button = document.createElement('button');
    button.textContent = '선택입고';
    button.style.marginRight = '10px';
    button.style.cursor = 'pointer';
    button.style.backgroundColor = '#4caf50';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.padding = '5px 10px';
    button.style.borderRadius = '4px';
    button.style.position = 'absolute';
    button.style.left = '10px';

    // 버튼 클릭 이벤트
    button.addEventListener('click', () => {
      allInput();
    });

    // 입력 필드 생성
    const inputText = document.createElement('input');
    inputText.type = 'text';
    inputText.placeholder = ' 검색';
    inputText.style.padding = '5px';
    inputText.style.width = '200px';
    inputText.style.border = '1px solid #ccc';
    inputText.style.borderRadius = '4px';
    inputText.style.position = 'absolute';
    inputText.style.left = '110px';

    // 텍스트만 계속 가져다 바치면 ag그리드가 알아서 해줌
    inputText.addEventListener('input', (event) => {
          const value = event.target.value;
          //console.log('입력된 값:', value);
          // 검색 로직 추가 가능
          clientNamesearch.value = value;
    });

    // 컨테이너에 버튼과 입력 필드 추가
    container.appendChild(button);
    container.appendChild(inputText);

    // 버튼을 페이지네이션 패널의 제일 앞에 추가
    paginationPanel.insertBefore(container, paginationPanel.firstChild);
  }

}

 //전체 행 눌렀을때 값 저장할 변수
 const allInputData = ref(null);
 //모달 여는 변수
 const isShowModal = ref(false);

 //모달에 전달할 배열담는 그릇
 const nuwList = ref([]);
 const selectedRows = ref([]);
 
// allInput 클릭 이벤트 함수
const allInput = (data = null) => {
  //const selectedRows = data ? [data] : allInputData.value.getSelectedRows();   // 그리드에 전체선택된 값을 가져옴
  if (data && data.isTrusted) {
    selectedRows.value = allInputData.value.getSelectedRows();
  } else if (data) {
    selectedRows.value = [data];
  } else {
    selectedRows.value = allInputData.value.getSelectedRows();
  }
  console.log('selectedRows ', selectedRows.value);
  //const selectedRows = allInputData.value.getSelectedRows(); 
  console.log('data :', data);

  //모달에 던져줄 녀석
  nuwList.value = selectedRows.value.map((val) => ({
      order_code: val.order_code,
      material_name: val.material_name,
      warehouse1: '',
      pass_qnt: val.pass_qnt,
      rjc_qnt: val.rjc_qnt,
      warehouse2: 'W003',
    })
  );

  //console.log('nuwList.value :', nuwList.value);

  if (selectedRows.value.length > 0) {
    //console.log(JSON.stringify(selectedRows.value, null, 2));   // 해당값을 json형태로 만든다 null=데이터직렬화 , 2=들여쓰기2칸
  } else {
    console.log("선택된 항목이 없습니다.");
  }

  warehouseInfo();  //창고 조회 해오기
  //모달 열꺼임
  isShowModal.value = true;
}

 // 모달 취소
const closeModal = () => {
  isShowModal.value = false;
};


/*
0: {order_code: 'PO241213005', material_name: '당근', warehouse1: 'W001', pass_qnt: '90 kg', rjc_qnt: '8 kg', …}
1: {order_code: 'PO241218003', material_name: '설탕', warehouse1: 'W002', pass_qnt: '100 kg', rjc_qnt: '0 kg', …}
2: {order_code: 'PO241218004', material_name: '식용색소', warehouse1: 'W002', pass_qnt: '999 kg', rjc_qnt: '1 kg', …}
*/

const materialObj = ref([]);
const prefix = ref([]);
const numberPart = ref([]);

const lotMaking = async function(){
  let result = await axios.get(`${ajaxUrl}/material/lotNum`)
                      .catch(err=>console.log(err));
  //console.log('로트뼈대 : ',result.data);
  //console.log('삽입할데이터 : ', nuwList.value);

  const lotNum = result.data[0]['LOTNUM'];
  //console.log(lotNum);
  if(lotNum){
    prefix.value = lotNum.slice(0, 5);
    numberPart.value = parseInt(lotNum.slice(5), 10);
    //console.log( (numberPart.value + 1).toString().padStart(3, '0') );
  }

  
  let percentNum = 100/nuwList.value.length;
  showprogress.value = true;
  for(let i=0; i<nuwList.value.length; i++){
    materialObj.value = {
      lot_code: prefix.value + ( (numberPart.value + i).toString().padStart(3, '0') ),
      order_code: nuwList.value[i].order_code,
      material_name: nuwList.value[i].material_name,
      pass_qnt: nuwList.value[i].material_name.includes('병') ? ( Number( parseFloat(nuwList.value[i].pass_qnt.replace(/,/g, '')) ) ) : ( Number( parseFloat(nuwList.value[i].pass_qnt.replace(/,/g, '')) ) * 1000 ),
      warehouse1: nuwList.value[i].warehouse1,
      rjc_qnt:  nuwList.value[i].material_name.includes('병') ? ( Number( parseFloat(nuwList.value[i].rjc_qnt.replace(/,/g, '')) ) ) : ( Number( parseFloat(nuwList.value[i].rjc_qnt.replace(/,/g, '')) ) * 1000 ),
      warehouse2: nuwList.value[i].warehouse2,
      emp_num: loginfo.value.emp_num,   // 사원번호는 로그인한 세션으로 해야할꺼같음
    };
    
    console.log(materialObj.value);
    //여기서 서버통신 시작함
    number2.value = number2.value + percentNum;
    await inputMaterial(materialObj.value);
    // await delay(3000);   //3초마다 포문 작동되게하기
  }
  matrialQcInput(); //그냥 처리 끝나면 새로 DB받아옴
  notify({
      //title: "입고성공",
      text: "입고 완료 되었습니다.",
      type: "success", // success, warn, error 가능
   });
   showprogress.value = false;
   number2.value = 0;
  //location.reload();  //페이지 새로고침
}

//3초마다 for문 작동되게 하기
//const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

//const materialObjInput = ref([]);
const inputMaterial = async function(materialObj){
  console.log(materialObj);
  let result = await axios.post(`${ajaxUrl}/material/inputMaterial`, materialObj)
                             .catch(err=>console.log(err));
  console.log(result.data);
  //실패시 여기서 브레이크 걸어야함 근데 다 성공한다고 믿고 가는거지뭐...
}


// 모달 확인
const confirm = () => {
  //console.log('엄마컴포넌트 : ', nuwList.value);
  for(let i=0; i<nuwList.value.length; i++){
    // console.log('엄마컴포넌트 : ', nuwList.value[i]['warehouse1']);
    // console.log('엄마컴포넌트 : ', nuwList.value[i]['warehouse2']);
    if(!nuwList.value[i]['warehouse1'] || !nuwList.value[i]['warehouse2']){
      notify({
          title: "창고선택",
          text: "창고선택을 완료한후에 작업을 시작해주세요.",
          type: "error", // success, warn, error 가능
      });
      break;
    }
    if(i == nuwList.value.length-1){
      console.log(i);
      lotMaking();
    }
  }
  console.log("모달 확인 버튼 클릭됨");
  isShowModal.value = false; // 모달 닫기
};


// 화면 생성되는 시점
onBeforeMount(()=>{
  matrialQcInput();   //전체조회 쿼리 실행
  loginInfo();
});

</script>