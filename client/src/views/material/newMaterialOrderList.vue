<!-- 
    메뉴 : 자재>자재발주>자재 발주 관리 [발주업체 선정]
    자재 발주 관리 메뉴 리메이크 의 회사선정 리스트 컴포넌트
-->
<template>
   <div>
     <h4 v-show="isVisible2" style="margin-bottom: 0px;">&nbsp;&nbsp;&nbsp;&nbsp;[{{ material_name }}] 발주업체 선정</h4>
     <h4 v-show="!isVisible2" style="margin-bottom: 0px;">&nbsp;&nbsp;&nbsp;&nbsp;발주업체 선정</h4>
   </div>
  <div class="grid-container" style="width: 700px; padding-top: 0px; padding-bottom: 10px;">
        <ag-grid-vue
            :rowData="clientdate"
            :columnDefs="clientcolumnDefs"
            :theme="theme"
            :pagination="true"
            :noRowsOverlayComponent="noRowsOverlayComponent"
            :quickFilterText="clientNamesearch"
            :paginationPageSize="4"
            :paginationPageSizeSelector="[4, 10, 20, 40]"
            @grid-ready="onReady"
            style="height: 261px;"
            rowSelection="multiple"
        >
        </ag-grid-vue>
    </div>
   <div style="display: none">
       <CustomNoRowsOverlay/>
   </div>
</template>
<script>
import theme from "@/utils/agGridTheme";
import CustomNoRowsOverlay from "@/views/natureBlendComponents/grid/noDataMsg.vue";
import axios from 'axios';
import { ajaxUrl } from '@/utils/commons.js';

export default {
    //컴포넌트 선언했어
    components: {
        CustomNoRowsOverlay,
    },
    //엄마가 주는 데이터 받을꺼
    props: {
      material_code: {
         type: String,  //받는 타입
         required: true, //엄마 값이여야함
      },
      material_name: {
         type: String,
         required: true,
      },
    },
    // 널 계속 감시할꺼야
    watch: {
      material_code: {
         handler: "fullClient",  //이렇게 함수이름만 전달하면됨
         // 넌 최초 1회 어떤일이 있어도 작동해야해
         immediate: true, 
      },
      material_name: {
         immediate: true, 
      },
    },
    //변수 넣는 통은 너야
    data(){
        return{
            noRowsOverlayComponent: 'CustomNoRowsOverlay',
            clientNamesearch: "", //검색어
            isVisible2:false,
            clientcolumnDefs: [
                { 
                    cellStyle: { textAlign: "center" },
                    headerCheckboxSelection: true,
                    checkboxSelection: true,
                    headerName: "",
                    flex:1,
                },
                { headerName: "NO.", field: "client_num", flex:1, cellStyle: { textAlign: "center" } },
                { headerName: "거래처명", field: "com_name", flex:3, cellStyle: { textAlign: "left" } },
                { headerName: "발주담당자", field: "emp_name", flex:2, width:130, cellStyle: { textAlign: "left" } },
                { headerName: "연락처", field: "emp_tel", flex:3, cellStyle: { textAlign: "center" } },
            ],
            clientdate: [],
            theme : theme,
        };
    },
    methods: {
        onReady(event) {
            this.gridApi = event.api;
            //event.api.sizeColumnsToFit(); //그리드 api 넓이 슬라이드 안생기게하는거

            // 페이징 영역에 버튼 만들기
            const allPanels = document.querySelectorAll('.ag-paging-panel');
            const paginationPanel2 = allPanels[1];
            if (paginationPanel2) {
               // 컨테이너 생성
               const container = document.createElement('div');
               container.style.display = 'flex';
               container.style.alignItems = 'center';
               container.style.gap = '5px'; // 버튼과 입력 필드 간격
               container.style.position = 'absolute';
               container.style.left = '10px';

               // 버튼 생성
               const button3 = document.createElement('button');
               button3.textContent = '거래처선택';
               button3.style.cursor = 'pointer';
               button3.style.backgroundColor = '#4caf50';
               button3.style.color = 'white';
               button3.style.border = 'none';
               button3.style.width = '90px';
               button3.style.padding = '5px 10px';
               button3.style.borderRadius = '4px';

               // 버튼 클릭 이벤트
               button3.addEventListener('click', () => {
                  //alert('거래처선택 버튼 클릭');
                  this.allInput();
               });

               // 입력 필드 생성
               const inputText = document.createElement('input');
               inputText.type = 'text';
               inputText.placeholder = '검색';
               inputText.style.padding = '5px';
               inputText.style.width = '60px';
               inputText.style.border = '1px solid #ccc';
               inputText.style.borderRadius = '4px';

               // 텍스트만 계속 가져다 바치면 ag그리드가 알아서 해줌
               inputText.addEventListener('input', (event) => {
                     const value = event.target.value;
                     //console.log('입력된 값:', value);
                     // 검색 로직 추가 가능
                     this.clientNamesearch = value;
               });

               // 컨테이너에 버튼과 입력 필드 추가
               container.appendChild(button3);
               container.appendChild(inputText);

               // 페이징 영역에 컨테이너 삽입
               paginationPanel2.insertBefore(container, paginationPanel2.firstChild);
            }
        },
        async allInput(){
         const selectedRows = this.gridApi.getSelectedRows(); // 선택된 행의 데이터 가져오기
         if (selectedRows.length > 0) {
             this.selectedRows = selectedRows.map((col) => ({
                ...col,
                material: this.material_name,
                material_code: this.material_code,
             }));
             //이거 부모한테 보내는거
             //console.log(this.selectedRows);
             this.$emit('planAndClientList', this.selectedRows);
             this.clientdate = [];
             this.isVisible2 = !this.isVisible2;
             this.clientNamesearch = '';
             this.$notify({ text: '거래처가 정상적으로 선택 됐습니다.', type: 'success' });    // success, warn, error 가능
         }else{
            this.$notify({ text: '선택된 거래처가 없습니다.', type: 'error' }); // title:'주문생성', 
         }
        },
        async fullClient(){
            if(this.material_code){
               this.isVisible2 = !this.isVisible2;
               let result = await axios.get(`${ajaxUrl}/material/fullClient`)
               .catch(err => console.log(err));
               this.clientdate = result.data;
               console.log(result.data);
            }
         },
    },
};
</script>