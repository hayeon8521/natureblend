<template>
    <div class="container-fluid py-4">
    <!--검색 폼 -->
    <h3>제품출고 등록</h3>
    <h4 class="pt-2">주문서 조회</h4>
    <div class= "main-container ps-4">
        <div class= "pt-5 pb-5">
                <!--거래처명 검색-->
                <div class="row align-items-center mb-3">
                    <label class="col-sm-2 col-form-label fw-bold" >거래처명</label>
                    <div class="col-sm-4">
                        <input 
                            id="clientSearch"  class="form-control border p-2"
                            v-model="searchCom.com_name" @click="openModal('client')"  autocomplete="off" placeholder="거래처명" />
                            <Modal
                                :isShowModal="isShowModal.client"
                                :modalTitle="'거래처선택'"
                                :noBtn="'닫기'"
                                :yesBtn="'선택'"
                                @closeModal="closeModal('client')"
                                @confirm="confirm('client')"
                            >
                            <template v-slot:list>
                                <ComList v-show="isShowModal.client" @selectclient="selectclient"/>
                            </template>
                            </Modal>
                    </div>    
                </div>
                <!--주문서명 검색 -->
                <div  class="row align-items-center mb-3">
                    <label class="col-sm-2 col-form-label fw-bold">주문서명</label>
                    <div class="col-sm-6">
                        <input 
                        id="orderSearch" class="form-control border p-2"
                        v-model="orderName"  autocomplete="off" placeholder="주문서명" />
                    </div>
                </div>
                <!--주문일자 검색 -->
                <div class="row align-items-center mb-5">
                    <label class="col-sm-2 col-form-label fw-bold">주문일자</label>
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
                        v-model="endDate"  autocomplete="off"   />
                    </div>
                </div>
            </div>
                    <!--검색 및 초기화-->
            <div class="pb-3 text-center">
                <material-button  color="success" class="button" @click="searchOrderlists">검색</material-button>
                <material-button  color="warning" class="button" @click="resetSearch">초기화</material-button>
            </div>
        </div>
    </div>
    <!-- <div class="grid-container" v-show="rowData.length != 0"> -->
    <div class="grid-container">
        <ag-grid-vue
        :rowData="rowData"
        :columnDefs="columnOrderlist"
        :theme="theme"
        @grid-ready="onGridReady"
        :noRowsOverlayComponent="noRowsOverlayComponent"
        @rowClicked="onOrderRowClicked"
        rowSelection="multiple"
        :pagination="true"
        :paginationPageSize="5"
        :paginationPageSizeSelector="[5, 10, 20, 50, 100]"
    />
    </div>
    <div style="display: none">
        <CustomNoRowsOverlay/>
    </div>
    <div class="container-fluid py-4">
        <h4 v-show="rowDataOrder.length != 0">미출고조회</h4>
        <div class="d-flex">
            <div class="p-2" style="flex: 6;">
                <div class="grid-container" v-show="rowDataOrder.length != 0">
                <ag-grid-vue
                :rowData="rowDataOrder"
                :columnDefs="columnOrder"
                :theme="theme"
                @grid-ready="onGridReady"
                :noRowsOverlayComponent="noRowsOverlayComponent"
                @rowClicked="onDisoutputRowClicked"
                rowSelection="single"
                :pagination="true"
                :paginationPageSize="5"
                :paginationPageSizeSelector="[5, 10, 20, 50, 100]"
                />
                </div>
                <div style="display: none">
                    <CustomNoRowsOverlay/>
                </div>
            </div>
            <div class="p-2" style="flex: 4;">
                <div class="grid-container" v-show="rowDataOrder.length != 0">
                <ag-grid-vue
                :rowData="rowDataLot"
                :columnDefs="columnLot"
                :theme="theme"
                @grid-ready="onGridReady"
                :noRowsOverlayComponent="noRowsOverlayComponent"
                :editType="'fullRow'"
                rowSelection="multiple"
                :pagination="true"
                :paginationPageSize="5"
                :gridOptions="gridOptions"
                :paginationPageSizeSelector="[5, 10, 20, 50, 100]"
                />
                </div>
                <div style="display: none">
                    <CustomNoRowsOverlay/>
                </div>
                <!--담당자 선택 -->
                <div class="row align-items-center mb-3" v-show="rowDataOrder.length != 0">
                    <label class="col-sm-2 col-form-label fw-bold" >담당자<span> *</span></label>
                    <div class="col-sm-4">
                        <input id="EmpName"  class="form-control border p-2" v-if="searchEmpName.name" v-model="searchEmpName.name" @click="openModal('emp')"  autocomplete="off"  />
                        <input type="text" v-else class="form-control" id="EmpName" @click="openModal('emp')" v-model="searchEmpName"  autocomplete="off"  >
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
                
                <!--검색 및 초기화-->
                <div class="mb-3 pt-2 text-center" v-show="rowDataOrder.length != 0">
                    <material-button  color="success" class="button" @click="processData">출고</material-button>
                    <material-button color="warning" class="button" @click="resetLot">초기화</material-button>
                </div>
            </div>
       </div>
    </div>
        
    
</template>

<script>
import MaterialButton from "@/components/MaterialButton.vue";
import Modal from "@/views/natureBlendComponents/modal/Modal.vue";
import ComList from "@/views/sales/Order/clientModal.vue";
import EmpList from "@/views/sales/Order/EmpModal.vue";
import theme from "@/utils/agGridTheme";
import userDateUtils from '@/utils/useDates.js';
import CustomNoRowsOverlay from "@/views/natureBlendComponents/grid/noDataMsg.vue";
import axios from "axios";
import { ajaxUrl } from '@/utils/commons.js';
import { mapMutations } from "vuex";

export default{
    name :"orderlistSearch",
    components:{
            MaterialButton,
            Modal,
            ComList,
            EmpList,
            CustomNoRowsOverlay,
            
    },
    data(){
        return{
            
            testing: {},

            //검색 필터 데이터
            orderName:"", // 주문서명
            startDate:"", //주문날짜 시작 날짜
            endDate:"", //주문날짜 끝 날짜
            //거래처 모달 
            searchCom:"", // 저장 될 거래처 명 
            selectedCom: "", //선택된 거래처 명

          

            //주문서 조회 결과 
            noRowsOverlayComponent: 'CustomNoRowsOverlay',
            filteredOrderlist : [],
            theme : theme,
            rowData : [],
            columnOrderlist : [
            { headerName : "주문서번호", field:'orderlist_num' ,flex: 2,cellStyle: { textAlign: "right" }},
            { headerName : "주문서명", field:'orderlist_title' ,flex: 4,cellStyle: { textAlign: "left" }},
            { headerName : "거래처명",field:'com_name' ,flex: 2,cellStyle: { textAlign: "left" }},
            { headerName : "담당자",field:'name' ,flex: 2,cellStyle: { textAlign: "left" }},
            { headerName : "주문일자",field:'order_date' ,flex: 2,cellStyle: { textAlign: "center" }},
            { headerName : "납기일자",field:'due_date' ,flex: 2,cellStyle: { textAlign: "center" }},
            ],
           
            //주문조회
           statusOrderMap: {         // DB 상태값과 화면 상태명 매핑
                "preparing": "미출고",
                "semiShipped": "부분출고",
            },
            rowDataOrder : [],
            columnOrder : [
                {headerName :"주문번호",field: 'order_num',flex: 2,cellStyle: { textAlign: "right" } },
                {headerName :"제품코드",field: 'product_code',flex: 2,cellStyle: { textAlign: "center" }},
                {headerName :"제품명",field: 'product_name',flex: 3,cellStyle: { textAlign: "left" }},
                {headerName :"주문수량"
                ,field: 'order_amount'
                ,flex: 2
                ,cellStyle: { textAlign: "right" }
                ,cellRenderer: params =>{
                    if(params.value){
                        const formattedValue = params.value.toLocaleString(); // 숫자에 쉼표 추가
                        return `<span>${formattedValue}</span>`;
                    }
                }},
                {headerName :"미출고량"
                ,field: 'disorder_amount'
                ,flex: 2
                ,cellStyle: { textAlign: "right" }
                ,cellRenderer: params =>{
                    if(params.value){
                        const formattedValue = params.value.toLocaleString(); // 숫자에 쉼표 추가
                        return `<span>${formattedValue}</span>`;
                    }
                }}, // 커리 보낼때 as (alias)로 보내면 해당 이름이 된다.
                {headerName :"출고량"
                ,field: 'output_amount'
                ,flex: 2
                ,cellStyle: { textAlign: "right" }
                ,cellRenderer: params =>{
                    if(params.value){
                        const formattedValue = params.value.toLocaleString(); // 숫자에 쉼표 추가
                        return `<span>${formattedValue}</span>`;
                    }
                }},
                {headerName :"상태여부",field: 'order_status',flex: 2,cellStyle: { textAlign: "left" }}
            ],

            //출고 시킬 제품 선택 
             //직원  모달
            searchEmpName:"", // 저장될 직원 명 
            selectedEmpName:"", //선택될 직원 명 

            gridOptions: {
                rowSelection: {
                    checkboxes: true,  // 이 옵션으로 체크박스를 활성화
                }
            },
           
            rowDataLot :[],
            columnLot :[
            {headerName: "",
            headerCheckboxSelection: true,
            field: "check",
            resizable: false,
            editable: true,
            sortable: false,
            checkboxSelection: true,
            flex: 1
            ,cellStyle: { textAlign: "center" }
            },
            {headerName :"제품LOT번호",field: 'product_lot' ,flex: 5,cellStyle: { textAlign: "center" }},
            { headerName: "출고수",
            field: "output_num",
            resizable: false,
            editable: true,
            sortable: false,
            // 셀 값이 변경될 때마다 실행되는 함수
            onCellValueChanged: this.onCellValueChanged
            ,flex: 3
            ,cellStyle: { 
                textAlign: "right",
                //backgroundColor: "#fff", // 연한 배경색
                //border: "0.5px dashed #fb8c00", // 점선 테두리
                cursor: "text", // 텍스트 커서
            }
            ,cellRenderer: params => {
                if (params.value) {
                    const formattedValue = params.value.toLocaleString(); // 숫자에 쉼표 추가
                    return `<span  style="flex-grow: 1; text-align: right;">${formattedValue}</span>`;
                } else {
                    // 값이 없을 경우 수정 가능 아이콘 추가
                    return `
                                <span style="display: flex; align-items: center; justify-content: flex-start;">
                                    <i class="fas fa-edit pt-2" style="color:#6c757d88;" title="더블클릭하여 수정 가능합니다"></i>
                                </span>
                            `;
                }
            }
            },
            {headerName :"재고수 "
            ,field: 'total_amount'
            ,flex: 4
            ,cellStyle: { textAlign: "right" }
            ,cellRenderer: params =>{
                    if(params.value){
                        const formattedValue = params.value.toLocaleString(); // 숫자에 쉼표 추가
                        return `<span>${formattedValue}</span>`;
                    }
             }},
            {headerName :"제조일자 ",field: 'inspec_end',flex: 4,cellStyle: { textAlign: "center" }},

           
            ],

            


            isShowModal: {
            client: false, // 거래처 모달
            emp: false, // 직원 모달
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
        },
        
        selectclient(client){
            this.selectedCom = client; 
        },
        selectemp(emp){
        this.selectedEmpName = emp;
        },
        openModal(modalType){
            this.isShowModal[modalType] = true; 
            //console.log(`${modalType} modal open`);
        },
        
        confirm(modalType){
            if (modalType === 'client') {
                this.searchCom = this.selectedCom;
            } else if (modalType === 'emp') {
                this.searchEmpName = this.selectedEmpName;
            }
            this.closeModal(modalType); // 모달 닫기
        },
        closeModal(modalType) {
            this.isShowModal[modalType] = false;
        },
        //주문서검색 초기화
        resetSearch(){
            this.searchCom = ""; // 공백 문자 대신 빈 문자열로 초기화
            this.orderName = "";  // 공백 문자 대신 빈 문자열로 초기화
            this.startDate = "";  // 빈 문자열로 초기화
            this.endDate = "";    // 빈 문자열로 초기화
            this.orderData = {};  // 객체 초기화
            this.rowData =[];
            this.rowDataOrder = [];
            this.rowDataLot =[];
            //console.log(this.orderData);

            this.searchEmpName="";
        },
        
        async searchOrderlists(){
        this.filters  = {
            clientName : this.searchCom,
            orderName : this.orderName,
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

        let result = await axios.put(`${ajaxUrl}/output/search`,this.filters )
                                .catch(err => console.log(err));
        
        this.rowData = result.data;
        this.rowData = result.data.map((col) => ({
            ...col,
            order_date: this.dateFormat(col.order_date, "yyyy-MM-dd"),
            due_date: this.dateFormat(col.due_date, "yyyy-MM-dd"),
            })
        );  
    },
    dateFormat(value, format) {
        return userDateUtils.dateFormat(value, format);
    },
            


        onGridReady(params){
            this.gridApi = params.api;
            //this.gridApi.sizeColumnsToFit();
        },
        //주문서 클릭 시 해당 주문서의 미출고 주문 출력 
        async onOrderRowClicked(row) {
            
            let order = row.data;
           
            let result = await axios.get(`${ajaxUrl}/output/disoutput/${order.orderlist_num}`)
                                    .catch(err => console.log(err));
            // this.rowDataOrder = result.data;
            this.rowDataOrder = result.data.map((col)=> {
                return {
                    ...col,
                    order_status : this.statusOrderMap[col.order_status],
                    com_name: row.data.com_name,
                };
            });

            //console.log("rowDataOrder:",this.rowDataOrder);
        },
        // 미출고주문에 해당하는 제품의 lot 들
        async onDisoutputRowClicked(row){
            //console.log("rows:",row)
            //console.log("클릭된 미출고주문 데이터",row.data.order_num);
            let disorder = row.data;
            let result = await axios.get(`${ajaxUrl}/output/product/${disorder.product_code}`)
                                    .catch(err => console.log(err))

                                    this.rowDataLot = result.data;
            this.rowDataLot = result.data.map((col) => ({
                ...col,
                inspec_end: this.dateFormat(col.inspec_end, "yyyy-MM-dd"),
                com_name: row.data.com_name,
                order_num : row.data.order_num,
                order_amount : row.data.order_amount,
                disorder_amount : row.data.disorder_amount,
                }));
            this.currentDisorder = disorder;

            //console.log("rowDataLot:",this.rowDataLot)
            
           
        },
        // 출고처리
        async processData(){
            //체크된 행만 처리 
            const selectedRows = this.gridApi.getSelectedRows();
            if (selectedRows.length === 0) {
                this.$notify({ text: '선택된 행이 없습니다.', type: 'error' });
                return;
            }  
            let clientName = selectedRows[0].com_name;
            let orderNum = selectedRows[0].order_num;
            //console.log(selectedRows[0].com_name, selectedRows[0].order_num)
            //console.log("disorder:",selectedRows[0].disorder_amount);
            

            let outputNums = []
            let productLots = []
          

         // 유효하지 않은 행 확인 (재고 갯수가 출고 갯수보다 작은 경우)
        let invalidRows = [];
        selectedRows.forEach(row =>{
            //console.log("체크==",row );
            if (Number(row.total_amount) < row.output_num) {
                //재고 갯수가 출고 갯수보다 작은 경우 유효하지 않는 행에 추가 
                invalidRows.push(row);
            }else{
                //아닌 경우 보낼 데이터로 푸쉬
                outputNums.push(Number(row.output_num));
                productLots.push(row.product_lot);
            }
                    
        });
         // 유효하지 않은 행이 있으면 알림 띄우고 중단
        if (invalidRows.length > 0) {
            this.$notify({
                text: '출고수는 보유 재고량보다 많을 수 없습니다.',
                type: 'error',
            });
            return;
        }

        // 출고수량 합계 계산
        const totalOutput = outputNums.reduce((sum,value)=> sum + Number(value),0);
        //미출고량 합계 계산
        if(selectedRows.length > 0 && Number(selectedRows[0].disorder_amount) < totalOutput){
            this.$notify({
                text: '출고수는 미출고량보다 많을 수 없습니다.',
                type: 'error',
            });
            return; 
        }

        //담당자, 출고 수량 확인
        if(!this.searchEmpName || totalOutput == 0){
            this.$notify({ text: '출고수량 과 담당자를 입력 해 주세요.', type: 'error' });
            return;
        }
        //서버 보낼 데이터 생성
        let outputInfo = {
            product_lot : JSON.stringify(productLots),
            output_amount : JSON.stringify(outputNums),
            order_num : orderNum,
            com_name : clientName,
        }
        // 조건에 따라 `name` 속성을 동적으로 추가
        if (!this.searchEmpName.name) {
            outputInfo.name = this.searchEmpName;
        } else {
            outputInfo.name = this.searchEmpName.name;
        }

        //console.log(outputInfo);
        let result =
            await axios.post(`${ajaxUrl}/output/insert`, outputInfo)
                        .catch(err => console.log(err));
            //console.log(result.data);
        if(result.statusText === 'OK'){
            this.$notify({
                text: `출고가 완료되었습니다.`,
                type: 'success',
            }); 
            window.location.reload();
            
        }

            
        },
        //LOT제품 초기화 
        resetLot(){
            // 체크박스 해제
            this.gridApi.deselectAll();
             // 입력 필드 초기화
            this.searchEmpName = ""; // 담당자 초기화
            this.clientName = "";    // 고객명 초기화

            // 출력 수량 초기화
            const rows = this.gridApi.getRenderedNodes();
            rows.forEach(rowNode => {
                if (rowNode.data.output_num !== undefined) {
                    rowNode.data.output_num = ""; // 출력 수량 초기화
                    this.gridApi.refreshCells({ rowNodes: [rowNode], columns: ['output_num'] });
                }
            });
            
        },

        // output_num 셀 값이 변경될 때마다 실행되는 함수
        onCellValueChanged(event){
            if(event.colDef.field === 'output_num'){
                const updateOutput = event.newValue;
                const stock = event.data.input_amount;

                //출고수가 재고수 보다 많으면 
                if(updateOutput > stock){
                    this.$notify({
                        text: `'출고수는 재고수보다 많을 수 없습니다.'`,
                        type: 'error',
                    });

                     // 셀 값을 원래대로 되돌리기
                    event.node.setDataValue('output_num', event.oldValue);
                }
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
.d-flex {
  display: flex;
  justify-content: space-between;
  //gap: 5px;
  text-align: center;
}

.custom-cell {
  padding: 2px !important;
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
