<template>
    <div class="container-fluid py-4">
    <!--검색 폼 -->
    <h3>제품반품조회</h3>
    <div class= "main-container ps-4">
        <div class= "pt-5 pb-5">
                <!--거래처명 검색-->
                <div class="row align-items-center mb-3">
                    <label class="col-sm-2 col-form-label fw-bold" >거래처명</label>
                    <div class="col-sm-4">
                        <input 
                            id="clientSearch"  class="form-control border p-2"
                            v-model="searchCom.com_name" @click="openModal('client')"  autocomplete="off"   placeholder=" 거래처명"/>
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
                <!--반품품일자 검색 -->
                <div class="row align-items-center mb-5">
                    <label class="col-sm-2 col-form-label fw-bold">반품일자</label>
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
                        v-model="endDate" autocomplete="off"   />
                    </div>
                </div>
            </div>
                    <!--검색 및 초기화-->
            <div class="pb-3 text-center">
                <material-button size="sm" color="success" class="button" @click="searchOrderlists">검색</material-button>
                <material-button size="sm" color="warning" class="button" @click="resetSearch">초기화</material-button>
            </div>
        </div>
    </div>
    <!-- <div class="grid-container" v-show="rowData.length != 0"> -->
    <div class="grid-container">
        <ag-grid-vue
        style ="height: 450px;"
        :rowData="rowData"
        :columnDefs="columnOrderlist"
        :theme="theme"
        @grid-ready="onReady"
        :quickFilterText="inputListsearch"
        :noRowsOverlayComponent="noRowsOverlayComponent"
        @rowClicked="onOrderRowClicked"
        @cellClicked="onCellClicked" 
        rowSelection="multiple"
        :pagination="true"
        :paginationPageSize="10"
        :paginationPageSizeSelector="[10, 20, 50, 100]"
    />
    </div>
    <div style="display: none">
        <CustomNoRowsOverlay/>
    </div>
    <div>
        <Modal
            :isShowModal="isShowModal.returns"
            :modalTitle="'반품사유'"
            :noBtn="'닫기'"
            :yesBtn="'선택'"
            @closeModal="closeModal('returns')"
            @confirm="confirm('returns')"
        >
        <template v-slot:list>
            <ReturnList v-show="isShowModal.returns" @selectreturn="selectreturn"/>
        </template>
        </Modal>
    </div>
         
    
</template>

<script>
import MaterialButton from "@/components/MaterialButton.vue";
import Modal from "@/views/natureBlendComponents/modal/Modal.vue";
import ComList from "@/views/sales/Order/clientModal.vue";
import ReturnList from "@/views/sales/ProductReturn/ReturnModal.vue"
import theme from "@/utils/agGridTheme";
import userDateUtils from '@/utils/useDates.js';
import CustomNoRowsOverlay from "@/views/natureBlendComponents/grid/noDataMsg.vue";
import axios from "axios";
import { ajaxUrl } from '@/utils/commons.js';

export default{
    name :"orderlistSearch",
    components:{
            MaterialButton,
            Modal,
            ComList,
            ReturnList,
            CustomNoRowsOverlay,
            
    },
    data(){
        return{
            
            originalValue: null,  // 셀의 원래 값 저장
            originalReturnReason : null,
            originalReturnCode : null,

            //검색 필터 데이터
            startDate:"", //주문날짜 시작 날짜
            endDate:"", //주문날짜 끝 날짜
            //거래처 모달 
            searchCom:"", // 저장 될 거래처 명 
            selectedCom: "", //선택된 거래처 명

            //반품모달
            selectedReturnCode: "", // 선택한 반품 코드 
            searchReturnCode : "", // 저장될 반품 코드
            selectedReturnReason:"", // 선택될 반품 이유
            searchReturnReason : "", // 저장될 반품 이유 

            //검색어 검색 (그리드 안)
            inputListsearch: "", //검색어

            //주문서 조회 결과 
            noRowsOverlayComponent: 'CustomNoRowsOverlay',
            filteredOrderlist : [],
            theme : theme,
            rowData : [],
            columnOrderlist : [
            {headerName: "",
            headerCheckboxSelection: true,
            field: "check",
            resizable: false,
            editable: true,
            sortable: false,
            checkboxSelection: true,
            flex: 1,
            cellStyle: { textAlign: "center" }
            },
            { headerName : "반품번호", field:'returnlist_num',resizable: true, sortable: true,flex: 2,cellStyle: { textAlign: "right" }},
            { headerName : "출고번호", field:'output_num',resizable: true, sortable: true,flex: 2,cellStyle: { textAlign: "right" }},
            { headerName : "거래처명",field:'com_name',resizable: true, sortable: true,flex: 2,cellStyle: { textAlign: "left" }},
            { headerName : "제품LOT번호",field:'product_lot',resizable: true, sortable: true,flex: 3,cellStyle: { textAlign: "center" }},
            { headerName : "제품코드",field:'product_code',resizable: true, sortable: true,flex: 2,cellStyle: { textAlign: "center" }},
            { headerName : "제품명",field:'product_name',resizable: true, sortable: true,flex: 3,cellStyle: { textAlign: "left" }},
            { headerName : "출고량"
            ,field:'output_amount'
            ,resizable: true
            , sortable: true
            ,flex: 2
            ,cellStyle: { textAlign: "right" }
            ,cellRenderer: params =>{
                    if(params.value){
                        const formattedValue = params.value.toLocaleString(); // 숫자에 쉼표 추가
                        return `<span>${formattedValue}</span>`;
                    }
            }},
            { headerName : "반품량"
            ,field:'return_num'
            ,editable:true
            ,resizable: true
            , sortable: true
            ,flex: 2
            ,cellStyle: { textAlign: "right",
                         //backgroundColor: "#fff", // 연한 배경색
                        //border: "0.5px dashed #fb8c00", // 점선 테두리
                        cursor: "text", // 텍스트 커서
             }
            ,cellRenderer: params =>{
                    if(params.value){
                        const formattedValue = params.value.toLocaleString(); // 숫자에 쉼표 추가
                        return `
                                    <span style="display: flex; align-items: center; justify-content: flex-start;">
                                        <i class="fas fa-edit" style="color:#6c757d88" title="더블클릭하여 수정 가능합니다"></i>
                                        <span style="flex-grow: 1; text-align: right;">${formattedValue}</span>
                                    </span>
                                `;
                    }else{
                         // 값이 없을 경우 수정 가능 아이콘 추가
                        return `<span><i class="fas fa-edit" style="color:#6c757d88" title="더블클릭하여 수정 가능합니다"></i></span>`;
                    }
            }},
            { headerName : "담당자",field:'name',resizable: true, sortable: true,flex: 2,cellStyle: { textAlign: "left" }},
            { headerName : "반품날짜",field:'return_date',resizable: true, sortable: true,flex: 3,cellStyle: { textAlign: "center" }},
            { headerName : "반품사유"
            ,field:'return_reason'
            ,resizable: true
            , sortable: true
            ,flex: 4
            ,cellStyle: {
                         textAlign: "right",
                        //backgroundColor: "#fff", // 연한 배경색
                        //border: "0.5px dashed #fb8c00", // 점선 테두리
                        cursor: "text", // 텍스트 커서
            }
            ,cellRenderer: params =>{
                    if(params.value){
                        const formattedValue = params.value.toLocaleString(); // 숫자에 쉼표 추가
                        return `
                                    <span style="display: flex; align-items: center; justify-content: text-start;">
                                        <span style="flex-grow: 1;  text-align: left;">${formattedValue}</span>
                                        <i class="fas fa-edit" style="color:#6c757d88" title="더블클릭하여 수정 가능합니다"></i>
                                    </span>
                                `;
                    }else{
                         // 값이 없을 경우 수정 가능 아이콘 추가
                        return `<span><i class="fas fa-edit" style="color:#6c757d88" title="더블클릭하여 수정 가능합니다"></i></span>`;
                    }
            }},
            ],
          


            isShowModal: {
            client: false, // 거래처 모달
            },

            
           

            
        }
    },
 

    methods:{
    // 셀 클릭 시 편집 시작 전에 원래 값 저장
    onCellClicked(col) {
        if (col.colDef.editable) {
            if (!this.originalValues) {
                this.originalValues = {};
            }
            this.originalValues[col.node.id] = this.originalValues[col.node.id] || {};
            this.originalValues[col.node.id][col.column.colId] = col.value; // 특정 셀의 원래 값 저장
            //console.log("원래값==",this.originalValues[col.node.id][col.column.colId]);
            //console.log("파람==",col);
        }
        // 'product_name' 필드 클릭 시 모달 열기
        if (col.colDef.field === 'return_reason') {
                this.openModal('returns');
            }
    },
    // 셀 값이 수정된 후 이를 롤백할 수 있게 함
    rollbackCellChange(col) {
        let nodeId = col.node.id;
        let colId = col.column.colId;
        if (this.originalValues && this.originalValues[nodeId] && this.originalValues[nodeId][colId] !== undefined) {
            let originalValue = this.originalValues[nodeId][colId];
            col.node.setDataValue(col.column,originalValue); // 원래 값으로 롤백
        }
    },
    // 초기화버튼
    rollbackEdit() {
        if (this.originalValues) {
            this.gridApi.forEachNode((node) => {
                // 각 셀마다 저장된 원래 값을 롤백
                Object.keys(this.originalValues[node.id] || {}).forEach(colId => {
                const originalValue = this.originalValues[node.id][colId];
                node.setDataValue(colId, originalValue); // 해당 컬럼의 원래 값으로 롤백
                });
            });
        
            
        }
        if (this.selectedCol) {
        // 초기값으로 롤백
        this.selectedCol.data.return_reason = this.originalReturnReason;
        this.selectedCol.data.return_code = this.originalReturnCode;

        // ag-Grid에 적용하기
        this.gridApi.applyTransaction({
            update: [this.selectedCol.data] // 수정된 행만 업데이트
        });

        //console.log("초기값으로 롤백 완료:", this.originalReturnReason, this.originalReturnCode);
        }
        // 체크박스 해제
        this.gridApi.deselectAll();
        this.originalValue = null; // 롤백 후 원래 값 초기화
        this.originalReturnReason = null;
        this.originalReturnCode = null;
      
    },

        selectclient(client){
            this.selectedCom = client; 
        },
        selectreturn(returns){
        this.selectedReturnCode = returns.return_code;
        this.selectedReturnReason = returns.return_reason;
        },
        
        openModal(modalType){
            this.isShowModal[modalType] = true; 
            //console.log(`${modalType} modal open`);

            // return_reason 을 업데이트할 컬럼을 저장
            if (modalType === 'returns') {
                // ag-Grid의 선택된 노드를 가져오는 방법
                const selectedNodes = this.gridApi.getSelectedNodes();
                if (selectedNodes.length > 0) {
                    this.selectedCol = selectedNodes[0];  // 첫 번째 선택된 셀을 가져옵니다.
                    //console.log("선택된 셀:", this.selectedCol);
                    //반품이유, 코드 초기값 저장 
                    this.originalReturnReason = this.selectedCol.data.return_reason;
                    this.originalReturnCode = this.selectedCol.data.return_code;
                    //console.log( this.originalReturnReason,this.originalReturnCode)
                } else {
                    console.log("선택된 셀이 없습니다.");
                }
            }
        },
        
        confirm(modalType){
            if (modalType === 'client') {
                this.searchCom = this.selectedCom;
            }else if (modalType === 'returns') {
                this.searchReturnCode = this.selectedReturnCode;
                this.searchReturnReason = this.selectedReturnReason;
                
                this.selectedCol.data.return_reason = this.searchReturnReason;
                this.selectedCol.data.return_code = this.searchReturnCode;

                // ag-Grid에 적용하기
                this.gridApi.applyTransaction({
                    update: [this.selectedCol.data] // 수정된 행만 업데이트
                });
            
                

            }
            this.closeModal(modalType); // 모달 닫기
        },
        closeModal(modalType) {
            this.isShowModal[modalType] = false;
        },
        //주문서검색 초기화
        resetSearch(){
            this.searchCom = ""; // 공백 문자 대신 빈 문자열로 초기화
            this.startDate = "";  // 빈 문자열로 초기화
            this.endDate = "";    // 빈 문자열로 초기화
            this.rowData =[];
            //console.log(this.orderData);

        },
        //검색
        async searchOrderlists(){
        this.filters  = {
            clientName : this.searchCom,
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

        let result = await axios.put(`${ajaxUrl}/return/search`,this.filters )
                                .catch(err => console.log(err));
        
        this.rowData = result.data;
        this.rowData = result.data.map((col) => ({
            ...col,
            return_date: this.dateFormat(col.return_date, "yyyy-MM-dd"),
            })
        );  
    },
    dateFormat(value, format) {
        return userDateUtils.dateFormat(value, format);
    },
            


    onReady(event){
            this.gridApi = event.api;
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

               // 버튼 생성
               const button1 = document.createElement('button');
               button1.textContent = '반품수정';
               button1.style.cursor = 'pointer';
               button1.style.backgroundColor = '#4caf50';
               button1.style.color = 'white';
               button1.style.border = 'none';
               button1.style.padding = '5px 10px';
               button1.style.borderRadius = '4px';

               const button2 = document.createElement('button');
               button2.textContent = '반품삭제';
               button2.style.cursor = 'pointer';
               button2.style.backgroundColor = '#ff0000';
               button2.style.color = 'white';
               button2.style.border = 'none';
               button2.style.padding = '5px 10px';
               button2.style.borderRadius = '4px';

               const button3 = document.createElement('button');
               button3.textContent = '초기화';
               button3.style.cursor = 'pointer';
               button3.style.backgroundColor = '#f48a06';
               button3.style.color = 'white';
               button3.style.border = 'none';
               button3.style.padding = '5px 10px';
               button3.style.borderRadius = '4px';

               //버튼클릭이벤트
                button1.addEventListener('click',()=>{
                    //수정버튼
                    this.updateReturn();
                });

                button2.addEventListener('click',()=>{
                    //삭제버튼
                    this.deleteReturn();
                });
                button3.addEventListener('click',()=>{
                    //초기화버튼
                    this.rollbackEdit(); 
                })

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
                container.appendChild(button1);
                container.appendChild(button2);
                container.appendChild(button3);
                container.appendChild(inputText);

                //페이징 영역에 컨테이너삽입
                paginationPanel.insertBefore(container,paginationPanel.firstChild);
            }

        },
        // onClickedRr(col){
        //     if (col.colDef.field === 'return_reason') {
        //         this.openModal('returns');
        //     }
        // },
        //반품수정
        async updateReturn(){
            const selectedRows = this.gridApi.getSelectedRows();
            let returnlistNums = []
            let returnNums = []
            let returnCodes = []

            //console.log("선택된값값",selectedRows);

            // 조건 체크 및 데이터 수집
            for (const row of selectedRows) {
                if (row.return_num > row.output_amount) {
                    this.$notify({
                        text: `반품 갯수가 출고 갯수보다 많습니다`,
                        type: 'error',
                    });
                    return; // 전체 함수 종료
                } else {
                    returnlistNums.push(row.returnlist_num);
                    returnNums.push(row.return_num);
                    returnCodes.push(row.return_code);
                }
            }

            //반품사유, 반품 갯수 수정 
            let updateReturnInfo = {
                returnlistNum : JSON.stringify(Number(returnlistNums)),
                returnNum : JSON.stringify(Number(returnNums)),
                returnCode : JSON.stringify(returnCodes)
            }

            let result = await axios.put(`${ajaxUrl}/returnUpdate/update`,updateReturnInfo)
                                    .catch(err => console.log(err));
                                    
                if(result.data.result === true){
                        this.$notify({
                        text: `해당 반품건의 수정이 완료되었습니다. `,
                        type: 'success',
                    });
                    window.location.reload(); 
                }else{
                    this.$notify({
                        text: `해당 반품건의 수정을 실패 했습니다. `,
                        type: 'error',
                    });
                }
        },
        //반품삭제 
        async deleteReturn(){
            const selectedRows = this.gridApi.getSelectedRows();
            let returnlistNums = []
            selectedRows.forEach(row => {
                returnlistNums.push(row.returnlist_num);
            });

            let deleteInfo = {
                returnlistNum : JSON.stringify(returnlistNums)
            }

            //console.log(deleteInfo);

            let result = await axios.put(`${ajaxUrl}/return/delete`,deleteInfo)
                                    .catch(err=> console.log(err));
                if(result.data.result === true){
                        this.$notify({
                        text: `해당 반품품건의 삭제 완료되었습니다. `,
                        type: 'success',
                    });
                    window.location.reload(); 
                }else{
                    this.$notify({
                        text: `해당 반품건의 삭제을 실패 했습니다. `,
                        type: 'error',
                    });
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
