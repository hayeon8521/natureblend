<template>
    <div class="container-fluid py-4">
    <!--검색 폼 -->
        <h3>제품입고조회</h3>
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
                                        <proList v-show="isShowModal.product" @selectproduct="selectproduct"/>
                                    </template>
                                </Modal>
                        </div>    
                    </div>
                    <!--입고일자 검색 -->
                    <div class="row align-items-center mb-5">
                        <label class="col-sm-2 col-form-label fw-bold">입고 일자</label>
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
                    <material-button  color="success" class="button" @click="searchInputlist" >검색</material-button>
                    <material-button color="warning" class="button" @click="resetSearch">초기화</material-button>
                </div>
            </div>
        </div>



        <div class="container-fluid py-4">
            <div class="">
                <!-- 입고된 주문건 조회 -->
                <div class="grid-container">
                    <ag-grid-vue
                    style ="height: 500px;"
                    :rowData="inputData"
                    :columnDefs="columnInputData"
                    :theme="theme"
                    @grid-ready="onReady"
                    :quickFilterText="inputListsearch"
                    :noRowsOverlayComponent="noRowsOverlayComponent"
                    @cellClicked="onCellClicked" 
                    rowSelection="multiple"
                    :pagination="true"
                    :paginationPageSize="10"
                    :paginationPageSizeSelector="[10, 20, 50, 100]"
                />
                <!--@cellClicked="onClickedWh"  특정 셀값에 이벤트 걸때 꼭 cellClicked 
                 :quickFilterText="inputListsearch" 그리드 내부에 검색창 넣기 
                  rowSelection="multiple" 체크박스 다수 선택 가능 -->
                </div>
                <div style="display: none">
                    <CustomNoRowsOverlay/>
                </div>
        </div>
    </div>
    <div>
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
        
    
</template>

<script>
import MaterialButton from "@/components/MaterialButton.vue";
import Modal from "@/views/natureBlendComponents/modal/Modal.vue";
import proList from "@/views/sales/Order/ProductModal.vue"
import WarList from "@/views/sales/ProductInput/warehouseModal.vue";
import theme from "@/utils/agGridTheme";
import userDateUtils from '@/utils/useDates.js';
import CustomNoRowsOverlay from "@/views/natureBlendComponents/grid/noDataMsg.vue";
import axios from "axios";
import { ajaxUrl } from '@/utils/commons.js';

export default{
    name :"inputList",
    components:{
            MaterialButton,
            Modal,
            proList,
            WarList,
            CustomNoRowsOverlay,
            
    },
    data(){
        return{
            //검색 필터 데이터
            startDate:"", //주문날짜 시작 날짜
            endDate:"", //주문날짜 끝 날짜
            //제품 모달
            selectedProName:"",//선택될 제품 이름
            productName:'', //저장될 제품 이름 
            selectedProCode:"", //선택될 제품 코드 
            productCode:'', //저장될 제품 코드 

            //검색어 검색 (그리드 안)
            inputListsearch: "", //검색어

            //초기값
            originWarehouseName : null,

          

            // 품질검사 조회 결과 
            noRowsOverlayComponent: 'CustomNoRowsOverlay',
            theme : theme,
            inputData : [],
            columnInputData : [
            { headerName: "",
              headerCheckboxSelection: true,
              field: "check",
              resizable: false,
              editable: true,
              sortable: false,
              checkboxSelection: true,
              flex: 1,
              cellStyle: { textAlign: "center" },

            },
            { headerName: "완제품코드", field: "product_code", resizable: true, sortable: true ,flex: 2, cellStyle: { textAlign: "center" } },
            { headerName: "제품명 ", field: "product_name", resizable: true, sortable: true ,flex: 2, cellStyle: { textAlign: "left" } },
            { headerName: "제품LOT번호 ", field: "product_lot", resizable: true, sortable: true ,flex: 3, cellStyle: { textAlign: "center" }},
            { headerName: "입고수량 ", 
            field: "input_amount", 
            resizable: true, 
            sortable: true ,
            flex: 2, 
            cellStyle: { textAlign: "right" }
            ,cellRenderer: params =>{
                    if(params.value){
                        const formattedValue = params.value.toLocaleString(); // 숫자에 쉼표 추가
                        return `<span>${formattedValue}</span>`;
                    }
            }},
            { headerName: "창고위치 ", 
            field: "warehouse_name", 
            editable: true, 
            sortable: true ,
            flex: 2, 
            cellStyle: { textAlign: "right",
                        //backgroundColor: "#fff", // 연한 배경색
                        //border: "0.5px dashed #fb8c00", // 점선 테두리
                        cursor: "text", // 텍스트 커서
             }
             ,cellRenderer: params =>{
                    if(params.value){
                        const formattedValue = params.value.toLocaleString(); // 숫자에 쉼표 추가
                        return `
                                    
                                    <span style="display: flex; align-items: center; justify-content: text-start;">
                                        <span style="flex-grow: 1; text-align: left;">${formattedValue}</span>
                                        <i class="fas fa-edit" style="color:#6c757d88" title="더블클릭하여 수정 가능합니다"></i>
                                    </span>
                                `;
                    }else{
                         // 값이 없을 경우 수정 가능 아이콘 추가
                        return `<span><i class="fas fa-edit" style="color:#6c757d88" title="더블클릭하여 수정 가능합니다"></i></span>`;
                    }
             }},
            { headerName: "입고날짜 ", field: "input_date", resizable: true, sortable: true ,flex: 2, cellStyle: { textAlign: "center" } },
            
        ],

           
             

            //창고모달   (수정시) 
            warehouseCode : "", // 저장될 창고번호
            selectedWarehouseCode:"", // 선택될 창고 번호
            warehouseName:"", // 모달에서 저장될 창고이름
            selectedWarehouseName : "", // 선택될 창고 이름 


            isShowModal: {
            client: false, // 거래처 모달
            warehouse:false, //창고모달 
            },

            
           

            
        }
    },
   
 

    methods:{
        selectproduct(product){
            //console.log(product); 
            this.selectedProCode = product.product_code;
            this.selectedProName = product.product_name;
        },
        selectwarehouse(warehouse){
            this.selectedWarehouseCode = warehouse.warehouse_code;
            this.selectedWarehouseName = warehouse.warehouse_name;
        },
        openModal(modalType){
            this.isShowModal[modalType] = true; 
            //console.log(`${modalType} modal open`);

            // warehouse_name을 업데이트할 컬럼을 저장
            if (modalType === 'warehouse') {
                // ag-Grid의 선택된 노드를 가져오는 방법
                const selectedNodes = this.gridApi.getSelectedNodes();
                if (selectedNodes.length > 0) {
                    this.selectedCol = selectedNodes[0];  // 첫 번째 선택된 셀을 가져옵니다.
                    //console.log("선택된 셀:", this.selectedCol);
                    //초기값 저장 
                    this.originWarehouseName  = this.selectedCol.data.warehouse_name;
                    //console.log(this.originWarehouseName)
                } else {
                    //console.log("선택된 셀이 없습니다.");
                }
            }
        },
        
        confirm(modalType){
            if (modalType === 'product') {
                this.productName = this.selectedProName;
                this.productCode = this.selectedProCode;
            } else if (modalType === 'warehouse'){
                this.warehouseCode = this.selectedWarehouseCode;
                this.warehouseName = this.selectedWarehouseName; 
                //console.log("컴펌박스:",this.warehouseName);
                
                this.selectedCol.data.warehouse_name = this.warehouseName;
                //console.log("변경된 warehouse_name:", this.selectedCol.data.warehouse_name);

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
        
        dateFormat(value, format) {
          return userDateUtils.dateFormat(value, format);
        },
            



        onReady(event){
            this.gridApi = event.api;
            // event.api.sizeColumnsToFit(); //그리드 api 넓이 슬라이드 안생기게하는거
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
               button1.textContent = '입고수정';
               button1.style.cursor = 'pointer';
               button1.style.backgroundColor = '#4caf50';
               button1.style.color = 'white';
               button1.style.border = 'none';
               button1.style.padding = '5px 10px';
               button1.style.borderRadius = '4px';

               const button2 = document.createElement('button');
               button2.textContent = '입고삭제';
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
                    this.updateInput();
                });

                button2.addEventListener('click',()=>{
                    //삭제버튼
                    this.deleteInput();
                });
                button3.addEventListener('click',()=>{
                    //초기화버튼
                    this.resetUpdateInfo(); 
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

        async searchInputlist(){
            if( new Date(this.startDate) > new Date(this.endDate)){
                this.$notify({
                        text: `시작 날짜는 종료 날짜보다 이전이어야 합니다. `,
                        type: 'error',
                    });
                return;
            }
            this.filters  = {
                productCode : this.productCode,
                startDate : this.startDate,
                endDate : this.endDate,
            }

            //console.log(this.filters);
            let result = await axios.put(`${ajaxUrl}/input/inputlist`,this.filters )
                                    .catch(err => console.log(err));
            //console.log(result.data);
            this.inputData = result.data;
            this.inputData = result.data.map((col) => ({
                ...col,
                input_date: this.dateFormat(col.input_date, "yyyy-MM-dd"),
                })
            );  

        }, 
        resetSearch(){
            //검색창 초기화
             //검색 필터 데이터
             this.startDate = "", //주문날짜 시작 날짜
            this.endDate = "", //주문날짜 끝 날짜
            //제품 모달
            this.selectedProName = "",//선택될 제품 이름
            this.productName = '', //저장될 제품 이름 
            this.selectedProCode = "", //선택될 제품 코드 
            this.productCode='',//저장될 제품 코드 
            this.inputData = []


        },
        onCellClicked(col) {
            if (col.colDef.field === 'warehouse_name') {
                //console.log("작동");
                // warehouse_name의 셀을 클릭시에만 모달 작동 
                this.openModal('warehouse');
           
            }
        },
        // onClickedWh(col){
        //     if (col.colDef.field === 'warehouse_name') {
        //         console.log("작동");
        //         // warehouse_name의 셀을 클릭시에만 모달 작동 
        //         this.openModal('warehouse');
           
        //     }else{
        //         console.log("나머지");
        //     }

        // },
        // 셀 값이 수정된 후 이를 롤백할 수 있게 함
        rollbackCellChange(col) {
            let nodeId = col.node.id;
            let colId = col.column.colId;
            if (this.originalValues && this.originalValues[nodeId] && this.originalValues[nodeId][colId] !== undefined) {
                let originalValue = this.originalValues[nodeId][colId];
                col.node.setDataValue(col.column,originalValue); // 원래 값으로 롤백
            }
        },
        //초기화
        resetUpdateInfo(){
            if (this.selectedCol) {
            // 초기값으로 롤백
            this.selectedCol.data.warehouse_name = this.originWarehouseName;

        // ag-Grid에 적용하기
            this.gridApi.applyTransaction({
                update: [this.selectedCol.data] // 수정된 행만 업데이트
            });

            //console.log("초기값으로 롤백 완료:", this.originWarehouseName);
            }
            this.gridApi.deselectAll();
            this.originWarehouseName = null;
        },

        async updateInput(){
            const selectedRows = this.gridApi.getSelectedRows(); 
            let productLots = []
            //let inputAmounts = []
            let warehouseNames = []
            selectedRows.forEach(row => {
                //console.log("row:",row.product_lot);
                productLots.push(row.product_lot);
                //inputAmounts.push(row.input_amount);
                warehouseNames.push(row.warehouse_name);
            });

        // 수정을 원하는 입고건이 출고가 되었는지 유무 체크  => 재고수 수정 사라지고 체크 필요 없음 
            // let checkLotOutput = {
            //     productLot : JSON.stringify(productLots)
            // }
            // let result = await axios.put(`${ajaxUrl}/inputUpdate/check`,checkLotOutput)
            //                         .catch(err => console.log(err));

            // console.log(result.data);
            // let lotOutputNum = result.data[0][0]
            // console.log(lotOutputNum.total_output_count);

            // if(lotOutputNum.total_output_count == 0){
                 // 수정을 원하는 input 내역들이 출고 내역이 없는 경우만 수정 진행  
            //     let updateInputInfo = {
            //         productLot : JSON.stringify(productLots),
            //         inputAmount : JSON.stringify(inputAmounts),
            //         warehouse : JSON.stringify(warehouseNames)
            //     }
            //     console.log("수정입고값",updateInputInfo);
            //         let result = await axios.put(`${ajaxUrl}/inputUpdate/update`,updateInputInfo)
            //                                 .catch(err => console.log(err));
            //                     console.log(result.data.result);
                    // ===  은 타입 까지 비교 (true,false는 boolean 타입 그래서 ''빼줘야 한다.)
            //         if(result.data.result === true){
            //                 this.$notify({
            //                 text: `해당 입고건의 수정이 완료되었습니다. `,
            //                 type: 'success',
            //             });
            //         }else{
            //             this.$notify({
            //                 text: `해당 입고건의 수정을 실패 했습니다. `,
            //                 type: 'error',
            //             });
            //         }

            // }else{
            //     this.$notify({
            //             text: `해당 입고 건의 출고 내역이 있습니다.`,
            //             type: 'error',
            //         });
            // }
            // 창고번호만 수정 가능 
                let updateInputInfo = {
                    productLot : JSON.stringify(productLots),
                    warehouse : JSON.stringify(warehouseNames)
                }
                let result = await axios.put(`${ajaxUrl}/inputUpdate/update`,updateInputInfo)
                                        .catch(err => console.log(err));
                //console.log(result.data.result);
                // ===  은 타입 까지 비교 (true,false는 boolean 타입 그래서 ''빼줘야 한다.)
                if(result.data.result === true){
                        this.$notify({
                        text: `해당 입고건의 수정이 완료되었습니다. `,
                        type: 'success',
                    });
                    window.location.reload(); 
                    
                }else{
                    this.$notify({
                        text: `해당 입고건의 수정을 실패 했습니다. `,
                        type: 'error',
                    });
                }

            },
            
       // 입고내역 삭제(input_flag를 1로 변경 )
        async deleteInput(){
            const selectedRows = this.gridApi.getSelectedRows(); 
            let productLots = []
            selectedRows.forEach(row => {
                //console.log("row:",row.product_lot);
                productLots.push(row.product_lot);
            });

            let deleteInfo = {
                productLot : JSON.stringify(productLots)
            }
            //console.log("삭제:",deleteInfo);

            let result = 
                await axios.put(`${ajaxUrl}/input/delete`,deleteInfo)
                            .catch(err => console.log(err)); 

                //console.log(result);
             // ===  은 타입 까지 비교 (true,false는 boolean 타입 그래서 ''빼줘야 한다.)
            if(result.data.result === true){
                        this.$notify({
                        text: `해당 입고건의 삭제가 완료되었습니다. `,
                        type: 'success',
                    });
                    window.location.reload(); 
                }else{
                    this.$notify({
                        text: `해당 입고건의 삭제를 실패 했습니다. `,
                        type: 'error',
                    });
                }                  
        },
     

    },// method  
};
</script>
<style lang="scss" scoped>
.main-container{
    background-color:  #e9ecef;
    border-radius: 10px;
    height: 300px;
    
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
