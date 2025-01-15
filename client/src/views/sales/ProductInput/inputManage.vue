<template>
    <div class="container-fluid py-4">
    <!--검색 폼 -->
        <h3>제품입고등록</h3>
        <h4 class="pt-2">완제품 품질 검사 조회</h4>
        <div class= "main-container ps-4">
            <div class= "pt-5 pb-5">
                    <!--제품명 검색-->
                    <div class="row align-items-center mb-3">
                        <label class="col-sm-2 col-form-label fw-bold" >제품명</label>
                        <div class="col-sm-4">
                            <input type="text" class="form-control" id="productName" 
                                v-model="productName" @click="openModal('product')"  autocomplete="off" placeholder=" 제품명" >
                                <Modal
                                        :isShowModal="isShowModal.product"
                                        :modalTitle="'제품선택'"
                                        :noBtn="'닫기'"
                                        :yesBtn="'선택'"
                                        @closeModal="closeModal('product')"
                                        @confirm="confirm('product')"
                                    >
                                    <template v-slot:list>
                                        <proList v-show="isShowModal.product" @selectproduct="selectproduct" :indexNum="indexNum"/>
                                    </template>
                                </Modal>
                        </div>    
                    </div>
                    <!--통과일자 검색 -->
                    <div class="row align-items-center mb-5">
                        <label class="col-sm-2 col-form-label fw-bold">통과 일자</label>
                        <div class="col-sm-4">
                            <input 
                            type="date" 
                            id="startDate" class="form-control border p-2"
                            v-model="startDate"  autocomplete="off"  />
                        </div>
                        <div class="col-sm-1 text-center">~</div>
                        <div class="col-sm-4">
                            <input 
                            type="date" 
                            id="endDate" class="form-control border p-2"
                            v-model="endDate"  autocomplete="off"  />
                        </div>
                    </div>
                </div>
                        <!--검색 및 초기화-->
                <div class="pb-3 text-center">
                    <material-button  color="success" class="button" @click="searchQtResult">검색</material-button>
                    <material-button  color="warning" class="button" @click="resetSearch">초기화</material-button>
                </div>
            </div>
        </div>



        <div class="container-fluid py-4">
            <div class="d-flex">
         
                <!-- 품질검사 조회(입고 안된 것들 )-->
                <div class="grid-container">
                    <ag-grid-vue
                    style ="width: 850px; height: 500px;"
                    :rowData="QtData"
                    :columnDefs="columnQtlist"
                    :theme="theme"
                    @grid-ready="onReady"
                    :quickFilterText="inputListsearch"
                    rowSelection="multiple"
                    :noRowsOverlayComponent="noRowsOverlayComponent"
                    @rowClicked="onQtRowClicked"
                    :pagination="true"
                    :paginationPageSize="10"
                    :paginationPageSizeSelector="[10, 20, 50, 100]"
                />
                </div>
                <div style="display: none">
                    <CustomNoRowsOverlay/>
                </div>
                <div class= "select-container" >
                    <div class="d-flex flex-column justify-content-center ps-5 pt-5" style="height: 200px;">
                            <!--담당자 선택 -->
                        <div class="row align-items-center mb-3">
                            <label class="col-sm-3 col-form-label fw-bold" >담당자<span>*</span></label>
                            <div class="col-sm-9 d-flex">
                                <input id="EmpName"  class="form-control border p-2" v-model="searchEmpName" @click="openModal('emp')"  autocomplete="off"  />
                                    <Modal
                                        :isShowModal="isShowModal.emp"
                                        :modalTitle="'담당자선택'"
                                        :noBtn="'닫기'"
                                        :yesBtn="'선택'"
                                        @closeModal="closeModal('emp')"
                                        @confirm="confirm('emp')"
                                    >
                                    <template v-slot:list>
                                        <EmpList v-show="isShowModal.emp" @selectemp="selectemp"/>
                                    </template>
                                    </Modal>
                            </div>    
                        </div>
                        <div class="row align-items-center mb-3">
                            <label class="col-sm-3 col-form-label fw-bold" >창고<span>*</span></label>
                            <div class="col-sm-9 d-flex">
                                <input 
                                    id="EmpName"  class="form-control border p-2" 
                                    v-model="warehouseName" @click="openModal('warehouse')" autocomplete="off" placeholder=" 창고명" />
                                    <Modal
                                        :isShowModal="isShowModal.warehouse"
                                        :modalTitle="'창고선택'"
                                        :noBtn="'닫기'"
                                        :yesBtn="'선택'"
                                        @closeModal="closeModal('warehouse')"
                                        @confirm="confirm('warehouse')"
                                    >
                                    <template v-slot:list>
                                        <WarList v-show="isShowModal.warehouse" @selectwarehouse="selectwarehouse"/>
                                    </template>
                                    </Modal>
                            </div> 
                        </div>
                    
                    </div> 
                    <!--검색 및 초기화-->
                    <div class=" pt-5 text-center ">
                        <material-button  color="success" class="button" @click="tempInputInfo">추가</material-button>
                        <material-button color="warning" class="button" @click="resetEmpWar">초기화</material-button>
                    </div>
                </div>
        </div>
        <!-- 입고 임시 저장 -->
        <div>
                <div class="grid-container"  v-show="tempInput.length != 0">
                <ag-grid-vue
                :rowData="tempInput"
                :columnDefs="columntempInput"
                :theme="theme"
                @grid-ready="onReady1"
                :quickFilterText="inputListsearch1"
                :noRowsOverlayComponent="noRowsOverlayComponent"
                :editType="'fullRow'"
                :rowSelection="'multiple'"  
                :pagination="true"
                :paginationPageSize="10"
                :paginationPageSizeSelector="[10, 20, 50, 100]"
                />
                </div>
                <div style="display: none">
                    <CustomNoRowsOverlay/>
                </div>
            </div>
            <!--검색 및 초기화-->
            <div class=" pt-5 text-center " v-show="tempInput.length != 0">
                <material-button  color="success" class="button" @click="inputInsert">입고</material-button>
                <material-button color="warning" class="button" @click="resetTempInput">초기화</material-button>
            </div>
        
        
    </div>
        
    
</template>

<script>
import MaterialButton from "@/components/MaterialButton.vue";
import Modal from "@/views/natureBlendComponents/modal/Modal.vue";
import proList from "@/views/sales/Order/ProductModal.vue"
import EmpList from "@/views/sales/Order/EmpModal.vue";
import WarList from "@/views/sales/ProductInput/warehouseModal.vue";
import theme from "@/utils/agGridTheme";
import userDateUtils from '@/utils/useDates.js';
import CustomNoRowsOverlay from "@/views/natureBlendComponents/grid/noDataMsg.vue";
import axios from "axios";
import { ajaxUrl } from '@/utils/commons.js';
import { mapMutations } from "vuex";

export default{
    name :"inputManage",
    components:{
            MaterialButton,
            Modal,
            proList,
            EmpList,
            WarList,
            CustomNoRowsOverlay,
            
    },
    data(){
        return{
            testing: {},

            //검색 필터 데이터
            startDate:"", //통과날짜 시작 날짜
            endDate:"", //통과날짜 끝 날짜
            //제품 모달
            selectedProName:"",//선택될 제품 이름
            productName:'', //저장될 제품 이름 
            selectedProCode:"", //선택될 제품 코드 
            productCode:'', //저장될 제품 코드 

            //검색어 검색 (그리드 안)
            inputListsearch: "", //검색어 1 
            inputListsearch1 : "",//검색어2
          

            // 품질검사 조회 결과 
            noRowsOverlayComponent: 'CustomNoRowsOverlay',
            filteredQtResult : [],
            theme : theme,
            QtData : [],
            columnQtlist : [
            { headerName : "포장검사코드", field:'qc_packing_id',flex: 2,cellStyle: { textAlign: "center" }},
            { headerName : "제품코드", field:'product_code',flex: 2, cellStyle: { textAlign: "center" }},
            { headerName : "제품명",field:'product_name',flex: 2, cellStyle: { textAlign: "left" }},
            { headerName : "작업번호",field:'process_num',flex: 2, cellStyle: { textAlign: "right" }},
            { headerName : "입고수량"
            ,field:'pass_qnt'
            ,flex: 2
            , cellStyle: { textAlign: "right" }
            ,cellRenderer: params =>{
                    if(params.value){
                        const formattedValue = params.value.toLocaleString(); // 숫자에 쉼표 추가
                        return `<span>${formattedValue}</span>`;
                    }
            }},
            { headerName : "통과날짜",field:'inspec_end',flex: 2, cellStyle: { textAlign: "center" }},
             ],

           
            //출고 시킬 제품 선택 

             //직원  모달
            searchEmpName:"", // 저장될 직원 명 
            selectedEmpName:"", //선택될 직원 명 
            selectedEmpNum :"", //선택될 직원번호
            searchEmpNum:"", // 저장될 직원번호

            //창고모달   
            warehouseCode : "", // 저장될 창고번호
            selectedWarehouseCode:"", // 선택될 창고 번호
            warehouseName:"", // 저장될 창고이름
            selectedWarehouseName : "", // 선택될 창고 이름 


            //임시입고정보 보관 
            tempProductCode: '',
            tempProductName: '',
            tempProcessNum : '',
            inputAmount: 0,
            qtId: '',
            inputDate: '',
            

            tempInput :[],
            columntempInput :[
                { headerName: "",
                headerCheckboxSelection: true,
                field: "check",
                resizable: false,
                editable: true,
                sortable: false,
                checkboxSelection: true,
                flex: 1, cellStyle: { textAlign: "center" }
                },
                { headerName: "포장검사코드 ", field: "qtId", resizable: true, sortable: true ,flex: 2,cellStyle: { textAlign: "center" }},
                { headerName: "제품 코드", field: "tempProductCode", resizable: true, sortable: true ,flex: 2,cellStyle: { textAlign: "center" }},
                { headerName: "제품 명", field: "tempProductName", resizable: true, sortable: true ,flex: 2,cellStyle: { textAlign: "left" }},
                { headerName: "입고수량"
                , field: "inputAmount"
                , resizable: true
                , sortable: true 
                ,flex: 2
                ,cellStyle: { textAlign: "right" }
                ,cellRenderer: params =>{
                    if(params.value){
                        const formattedValue = params.value.toLocaleString(); // 숫자에 쉼표 추가
                        return `<span>${formattedValue}</span>`;
                    }
                }},
                { headerName: "창고 위치", field: "warehouseName", resizable: true, sortable: true ,flex: 2,cellStyle: { textAlign: "left" }},
                { headerName: "담당자", field: "employeeName", resizable: true, sortable: true,flex: 2,cellStyle: { textAlign: "left" } },
                { headerName: "통과 날짜", field: "inspectDate", resizable: true, sortable: true,flex: 2,cellStyle: { textAlign: "center" } },
            ],


            isShowModal: {
            client: false, // 거래처 모달
            emp: false, // 직원 모달
            warehouse:false, //창고모달 
            },

        }
    },
    mounted() {
      this.test();
    },
   
 

    methods:{
        ...mapMutations(["addLoginInfo"]),
        test(){
        this.testing = this.$store.state.loginInfo;
        //console.log('ddd', this.$store.state.loginInfo);
        this.searchEmpName = this.$store.state.loginInfo.name;
        this.searchEmpNum = this.$store.state.loginInfo.emp_num;
        },
        selectproduct(product){
            //console.log(product); 
            this.selectedProCode = product.product_code;
            this.selectedProName = product.product_name;
        },
        selectemp(emp){
            this.selectedEmpName = emp.name;
            this.selectedEmpNum = emp.emp_num;
        },
        selectwarehouse(warehouse){
            this.selectedWarehouseCode = warehouse.warehouse_code;
            this.selectedWarehouseName = warehouse.warehouse_name;
        },
        openModal(modalType){
            this.isShowModal[modalType] = true; 
            //console.log(`${modalType} modal open`);
        },
        
        confirm(modalType){
            if (modalType === 'product') {
                this.productName = this.selectedProName;
                this.productCode = this.selectedProCode;
            } else if (modalType === 'emp') {
                this.searchEmpName = this.selectedEmpName;
                this.searchEmpNum = this.selectedEmpNum;
            } else if (modalType === 'warehouse'){
                this.warehouseCode = this.selectedWarehouseCode;
                this.warehouseName = this.selectedWarehouseName;
            }
            this.closeModal(modalType); // 모달 닫기
        },
        closeModal(modalType) {
            this.isShowModal[modalType] = false;
        },
        //주문서검색 초기화
        resetSearch(){
            this.productName = ""; // 공백 문자 대신 빈 문자열로 초기화
            this.productCode = "";
            this.startDate = "";  // 빈 문자열로 초기화
            this.endDate = "";    // 빈 문자열로 초기화
            this.QtData = [];
            this.tempInput =[];
        },
        //통과 검사 결과 조회 (필터)
        async searchQtResult(){
            this.filters  = {
                productCode : this.productCode,
                startDate : this.startDate,
                endDate : this.endDate,
            }
            if( new Date(this.filters.startDate) > new Date(this.filters.endDate)){
                this.$notify({
                        text: `시작 날짜는 종료 날짜보다 이전이어야 합니다. `,
                        type: 'error',
                    });
                return;
            }

            //console.log(this.filters);

            let result = await axios.put(`${ajaxUrl}/input/qtsearch`,this.filters )
                                    .catch(err => console.log(err));
            //console.log(result.data);
            this.QtData = result.data;
            this.QtData = result.data.map((col) => ({
                ...col,
                inspec_end: this.dateFormat(col.inspec_end, "yyyy-MM-dd"),
                })
            );  
        },
        dateFormat(value, format) {
          return userDateUtils.dateFormat(value, format);
        },
            


        onReady(event){
            this.gridApi = event.api;
            this.gridColumnApi = event.columnApi;
            //event.api.sizeColumnsToFit(); //그리드 api 넓이 슬라이드 안생기게하는거
            //페이징 영역에 버튼 만들기 
            const allPanels = document.querySelectorAll('.ag-paging-panel');
            const paginationPanel = allPanels[1];
            if (paginationPanel) {
               // 컨테이너 생성
               const container = document.createElement('div');
               container.style.display = 'flex';
               container.style.alignItems = 'center';
               container.style.gap = '5px'; // 버튼과 입력 필드 간격

               
                //입력필드생성 
                const inputText = document.createElement('input');
                inputText.type = 'text';
                inputText.placeholder = '검색';
                inputText.style.padding = '5px';
                inputText.style.width = '250px';
                inputText.style.border = '1px solid #ccc';
                inputText.style.borderRadius = '4px';

                //텍스트 계속 바꿔서 치면 ag그리드가 바꿔줌
                inputText.addEventListener('input',(event)=>{
                    const value = event.target.value;
                    //console.log("입력된 값:", value);

                    //검색로직추가기능
                    this.inputListsearch = value;
                });

                //컨테이너에 버튼, 입력 필드 추가
                
                container.appendChild(inputText);

                //페이징 영역에 컨테이너삽입
                paginationPanel.insertBefore(container,paginationPanel.firstChild);
            }
        },
        onReady1(event){
            this.gridApi = event.api;
            this.gridColumnApi = event.columnApi;
            //event.api.sizeColumnsToFit(); //그리드 api 넓이 슬라이드 안생기게하는거
            //페이징 영역에 버튼 만들기 
            const allPanels = document.querySelectorAll('.ag-paging-panel');
            const paginationPanel1 = allPanels[4];
            if (paginationPanel1) {
               // 컨테이너 생성
               const container = document.createElement('div');
               container.style.display = 'flex';
               container.style.alignItems = 'center';
               container.style.gap = '5px'; // 버튼과 입력 필드 간격
                // 버튼 생성
                const button = document.createElement('button');
               button.textContent = '입고삭제';
               button.style.cursor = 'pointer';
               button.style.backgroundColor = '#f44335';
               button.style.color = 'white';
               button.style.border = 'none';
               button.style.padding = '5px 10px';
               button.style.borderRadius = '4px';
                //버튼클릭이벤트
                button.addEventListener('click',()=>{
                //입고삭제
                this.deleteInputs();
                 });

               
                //입력필드생성 
                const inputText1 = document.createElement('input');
                inputText1.type = 'text';
                inputText1.placeholder = '검색';
                inputText1.style.padding = '5px';
                inputText1.style.width = '250px';
                inputText1.style.border = '1px solid #ccc';
                inputText1.style.borderRadius = '4px';

                //텍스트 계속 바꿔서 치면 ag그리드가 바꿔줌
                inputText1.addEventListener('input',(event)=>{
                    const value = event.target.value;
                    //console.log("입력된 값:", value);

                    //검색로직추가기능
                    this.inputListsearch1 = value;
                });

                //컨테이너에 버튼, 입력 필드 추가
                container.appendChild(button);
                container.appendChild(inputText1);

                //페이징 영역에 컨테이너삽입
                paginationPanel1.insertBefore(container,paginationPanel1.firstChild);
            }
        },
        resetEmpWar(){
            this.warehouseName = "",
            this.warehouseCode = "",
            this.searchEmpName = ""
        },
       

        // 검사 결과 클릭 
        onQtRowClicked(row) {
            let order = row.data;
            this.tempProductCode = order.product_code;
            this.tempProductName = order.product_name;
            this.inputAmount = order.pass_qnt;
            this.qtId = order.qc_packing_id;
            this.inspectDate= order.inspec_end;
            this.tempProcessNum = order.process_num;

            //console.log("클릭된데이터:",this.tempProductCode,this.tempProductName,this.inputAmount,this.qtId,this.inspectDate,this.searchEmpName,this.warehouseCode,this.tempProcessNum);
            //console.log(this.warehouseName , this.searchEmpName);
            // 입고를 원하는 검사 결과 클릭한 정보 +  담당자,창고 선택 폼 등장 
            // => 여기서 입고 정보 다 가지고 있어야 함   
        },

        // 밑에 위에서 작성한 입고 정보 출력 해서 체크박스 선택 받아서 입고 등록 
        tempInputInfo(){
            if(!this.tempProductCode || !this.tempProductName || !this.inputAmount || !this.qtId || !this.inspectDate || !this.searchEmpName || !this.warehouseName || !this.warehouseCode || !this.tempProcessNum ){
                this.$notify({ text: '품질결과,담당자,창고는 필수사항입니다.', type: 'error' });
                return;  
            }
            //선택된 데이터 들 묶음
            let selectedData = {
                tempProductCode : this.tempProductCode,
                tempProductName : this.tempProductName,
                inputAmount : this.inputAmount,
                qtId : this.qtId,
                inspectDate : this.inspectDate,
                employeeName : this.searchEmpName,
                employeeNum : this.searchEmpNum,
                warehouseName : this.warehouseName,
                warehouseCode : this.warehouseCode,
                processNum: this.tempProcessNum,
            }
            //중복체크 
            let isDuplicate = this.tempInput.some(
                (item) => item.qtId === selectedData.qtId && item.tempProductCode === selectedData.tempProductCode
            );
            if(!isDuplicate){
                //tempInput 데이터 추가 (배열 객체를 풀어서 다시 객체 추가 후 배열 지정 )
                this.tempInput = [...this.tempInput,selectedData];
                //this.tempInput.push(selectedData);
                //console.log("데이터추가:",selectedData);
            }else{
                this.$notify({
                    text: ' 중복된 품질검사 입니다.',
                    type: 'error',
                });
                return;
            } 
            //console.log("현재 tempInput 상태:",this.tempInput);  
        },
        resetTempInput(){
            this.tempInput = []
        },
        //tempInput의 입고 저장 삭제 
        deleteInputs(){
            const selectedRows = this.gridApi.getSelectedRows();
            //console.log(selectedRows);
            // 선택된 항목들의 qtId와 tempProductCode를 기준으로 tempInput에서 삭제
            this.tempInput = this.tempInput.filter(item => {
                // 선택된 항목 중에서 qtId와 tempProductCode가 일치하지 않으면 유지
                return !selectedRows.some(row => 
                    row.qtId === item.qtId && row.tempProductCode === item.tempProductCode
                );
            });

            //console.log("입고 데이터 삭제 후 tempInput 상태:", this.tempInput);
        },
        //입고추가 
        async inputInsert(){
            
            const selectedRows = this.gridApi.getSelectedRows();
            //console.log("선택된값==",selectedRows ,"임시보관값==",this.tempInput);
             // 선택된 행들의 담당자 번호 추출
            let employeeNums = selectedRows.map(row => row.employeeNum);
            let uniqueEmployeeNums = new Set(employeeNums); // 고유한 값만 남김 

             // 담당자가 여러 명인지 확인
            if (uniqueEmployeeNums.size > 1) {
                this.$notify({
                    text: "선택된 입고에 담당자가 여러 명 있습니다. 한 명만 선택하세요.",
                    type: 'error',
                });
                return; // 함수 종료
            }

            let empNum = selectedRows[0].employeeNum;
            //console.log(empName,warehouseCode);
            

            
            let productCodes = [];
            let processNums = [];
            let inputAmounts = [];
            let qtIds = [];
            let inspectDates = [];
            let warehouseCodes = [];

            selectedRows.forEach(row => {
                //console.log("row:",row.tempProductCode , row.processNum , row.inputAmount , row.qtId);
                productCodes.push(row.tempProductCode);
                processNums.push(row.processNum);
                inputAmounts.push(row.inputAmount);
                qtIds.push(row.qtId);
                inspectDates.push(row.inspectDate);
                warehouseCodes.push(row.warehouseCode);
            });

            let inputInfo = {
                product_code : JSON.stringify(productCodes),
                process_num : JSON.stringify(processNums),
                input_amount : JSON.stringify(inputAmounts),
                qc_packing_id : JSON.stringify(qtIds),
                inspec_end : JSON.stringify(inspectDates),
                warehouse_code : JSON.stringify(warehouseCodes),
                name : empNum,
            }
            //console.log("보내는데이터:",inputInfo);
            let result =
                await axios.post(`${ajaxUrl}/input/insert`,inputInfo)
                            .catch(err => console.log(err));
                //console.log(result.data);
                if(result.statusText === 'OK'){
                    this.$notify({
                        text: `입고가 완료되었습니다.`,
                        type: 'success',
                    });
                    window.location.reload();  
                    // this.resetSearch();
                    // this.resetEmpWar();
                    // this.resetTempInput();

                
                }

        },
        
        
        

        
    },//method
    
};
</script>
<style lang="scss" scoped>
.main-container{
    background-color:  #e9ecef;
    border-radius: 10px;
    
}
.select-container{
    background-color:  #e9ecef;
    border-radius: 10px;
    width: 650px;
    height: 300px;
    margin-top: 70px;
}

.d-flex {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}


.text-center {
  text-align: center;
}

.button {
  margin: 0 10px; /* 버튼 사이 간격 추가 */
}

/* 일반 input 태그 스타일 */
input {
  background-color: #ffffff; /* 배경색 흰색 */
  border: solid 1px #ced4da; /* 테두리 색상 */
  color: #495057; /* 텍스트 색상 */
}
/* readonly 상태의 input 태그 스타일 */
input:read-only {
  background-color: #ffffff; /* 배경색 흰색 고정 */
  color: #495057; /* 텍스트 색상 유지 */
  cursor: not-allowed; /* 읽기 전용 표시를 위한 커서 */
}

/* input 포커스 상태에서도 배경색 유지 */
input:focus {
  background-color: #ffffff; /* 포커스 시 배경색 흰색 유지 */
  border-color: #86b7fe; /* 선택 시 테두리 색상 약간 강조 */
  outline: none; /* 기본 브라우저 포커스 아웃라인 제거 */
}

/* readonly input 요소가 포커스되어도 스타일 유지 */
input:read-only:focus {
  background-color: #ffffff; /* 배경색 흰색 고정 */
  border-color: #ced4da; /* readonly 상태에서는 테두리 기본값 */
  outline: none; /* 포커스 아웃라인 제거 */
}
</style>
