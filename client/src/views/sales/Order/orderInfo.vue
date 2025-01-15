<template>
        
    <div class="grid-container" v-show="rowData.length != 0">
    <ag-grid-vue
    
      :rowData="rowData"
      :columnDefs="columnDefs"
      :theme="theme"
      @grid-ready="onReady1"
      :noRowsOverlayComponent="noRowsOverlayComponent"
      rowSelection="multiple"
      @cellClicked="onCellClicked" 
      :quickFilterText="inputListsearch1"
      @rowClicked="onRowClicked"
      :pagination="true"
      :paginationPageSize="10"
      :paginationPageSizeSelector="[10, 20, 50, 100]"
  />
  
  </div>
  <div style="display: none">
      <CustomNoRowsOverlay/>
  </div>

    <Modal
            :isShowModal="isShowModal"
            :modalTitle="'제품선택'"
            :noBtn="'닫기'"
            :yesBtn="'선택'"
            @closeModal="closeModal()"
            @confirm="confirm()"
        >
        <template v-slot:list>
            <proList v-show="isShowModal" @selectproduct="selectproduct"/>
        </template>
    </Modal>

  <!--검색 및 초기화-->
    <div class="mb-3 pt-2 text-center">
        <material-button  color="success" class="button me-5" @click="updateOrder">주문서수정</material-button>
        <material-button  color="danger" class="button" @click="deleteOrder">주문서삭제</material-button>
    </div>
</template>

<script>
import MaterialButton from "@/components/MaterialButton.vue";
import theme from "@/utils/agGridTheme";
import CustomNoRowsOverlay from "@/views/natureBlendComponents/grid/noDataMsg.vue";
import axios from "axios";
import {ajaxUrl} from "@/utils/commons";
import proList from "@/views/sales/Order/ProductModal.vue"
import Modal from "@/views/natureBlendComponents/modal/Modal.vue";
import userDateUtils from '@/utils/useDates.js';

export default{
    name:"orderInfo",
    components:{
        CustomNoRowsOverlay,
        MaterialButton,
        proList,
        Modal,
        
    },
    props: {
        order: {
            type: Object,
            required: true,
        },
    },

    data(){
        return{
            noRowsOverlayComponent:'CustomNoRowsOverlay',
            Scol : 0,
            originalValue: null,  // 셀의 원래 값 저장

            // orderNum : this.order.orderlist_num,
           //주문조회
           statusOrderMap: {         // DB 상태값과 화면 상태명 매핑
                "preparing": "미출고",
                "semiShipped": "부분출고",
                "shipped": "출고완료",
            },

            theme : theme,
            rowData : [],
            columnDefs : [
                { headerName: "",
                headerCheckboxSelection: true,// 헤더에서 전체 선택 가능
                field: "check",
                resizable: false,
                editable: true,
                sortable: false,
                checkboxSelection: true,
                cellStyle: { textAlign: "center" },flex: 1
                },
                { headerName : "주문번호", field:'order_num',resizable: true, sortable: true ,cellStyle: { textAlign: "right" },flex: 2},
                { headerName : "제품코드", field:'product_code',resizable: true, sortable: true ,cellStyle: { textAlign: "center" },flex: 3},
                { headerName : "제품명", field:'product_name',resizable: true, sortable: true ,cellStyle: { textAlign: "left" },flex: 4},
                { headerName : "주문수량"
                , field:'order_amount'
                , editable: true
                , sortable: true 
                ,cellStyle: { 
                    textAlign: "right",
                    //backgroundColor: "#fff", // 연한 배경색
                    //border: "0.5px dashed #fb8c00", // 점선 테두리
                    cursor: "text", // 텍스트 커서
                }
                ,flex: 2 
                ,cellRenderer: params => {
                    const orderStatus = params.data.order_status; // 주문상태 확인
                    if (orderStatus === '미출고') {
                        if (params.value) {
                            const formattedValue = params.value.toLocaleString(); // 숫자에 쉼표 추가
                            return `
                                <span style="display: flex; align-items: center; justify-content: flex-start;">
                                    <i class="fas fa-edit" style="color:#6c757d88" title="더블클릭하여 수정 가능합니다"></i>
                                    <span style="flex-grow: 1; text-align: right;">${formattedValue}</span>
                                </span>
                            `;
                        } else {
                            return `<span><i class="fas fa-edit" style="color:#6c757d88" title="더블클릭하여 수정 가능합니다"></i></span>`;
                        }
                    } else {
                        if (params.value) {
                            const formattedValue = params.value.toLocaleString(); // 숫자에 쉼표 추가
                            return `<span style="text-align: right;">${formattedValue}</span>`;
                        } else {
                            return `<span></span>`;
                        }
                    }
                }},
                { headerName : "개당가격"
                , field:'per_price' 
                ,editable: true
                , sortable: true 
                ,cellStyle: { 
                    textAlign: "right",
                    //backgroundColor: "#fff", // 연한 배경색
                    //border: "0.5px dashed #fb8c00", // 점선 테두리
                    cursor: "text", // 텍스트 커서
                }
                ,flex: 2 
                ,cellRenderer: params => {
                    const orderStatus = params.data.order_status; // 주문상태 확인
                    if (orderStatus === '미출고') {
                        if (params.value) {
                            const formattedValue = params.value.toLocaleString(); // 숫자에 쉼표 추가
                            return `
                                <span style="display: flex; align-items: center; justify-content: flex-start;">
                                    <i class="fas fa-edit" style="color:#6c757d88" title="더블클릭하여 수정 가능합니다"></i>
                                    <span style="flex-grow: 1; text-align: right;">${formattedValue}</span>
                                </span>
                            `;
                        } else {
                            return `<span><i class="fas fa-edit" style="color:#6c757d88" title="더블클릭하여 수정 가능합니다"></i></span>`;
                        }
                    } else {
                        if (params.value) {
                            const formattedValue = params.value.toLocaleString(); // 숫자에 쉼표 추가
                            return `<span style="text-align: right;">${formattedValue}</span>`;
                        } else {
                            return `<span></span>`;
                        }
                    }
                }},
                { headerName : "총가격"
                ,field:'total_price'
                ,resizable: true
                , sortable: true 
                ,cellStyle: { 
                    textAlign: "right",
                    }
                ,flex: 2
                ,cellRenderer: params =>{
                    if(params.value){
                        const formattedValue = params.value.toLocaleString(); // 숫자에 쉼표 추가
                        return `<span>${formattedValue}</span>`;
                    }
                }},
                { headerName : "주문상태", field:'order_status',resizable: true, sortable: true ,cellStyle: { textAlign: "left" },flex: 2},
                {
                    headerName : "삭제",
                    field : "status",
                    editable : false,
                    flex: 1
                    ,cellStyle: { textAlign: "center" },
                    cellRenderer :params =>{
                        let orderNum = params.data.order_num;
                        if(orderNum === "" || orderNum === null){
                            const deleteButton = document.createElement('button');
                            deleteButton.innerText = '삭제';
                            deleteButton.style.marginRight = '10px';
                            deleteButton.style.cursor = 'pointer';
                            deleteButton.style.backgroundColor = '#ff0000';
                            deleteButton.style.width = '60px';
                            deleteButton.style.height = '30px';
                            deleteButton.style.color = 'white';
                            deleteButton.style.border = 'none';
                            deleteButton.style.padding = '0';
                            deleteButton.style.borderRadius = '4px';
                            deleteButton.style.textAlign = 'center';
                            deleteButton.style.lineHeight = '30px';
                            deleteButton.addEventListener('click',()=>{
                                //추가 주문 목록 삭제 
                                this.renderButton(params);
                            })
                            return deleteButton;
                        }
                        // 기본 반환 (삭제 버튼 없음)
                        return null;
                    }
                }
            ],          
            //검색어 검색 (그리드 안)
            inputListsearch1:"", //검색어2

            //모달에서 제품 선택 
            selectedProCode : '',
            selectedProName : '',
            
            isShowModal: false,



        }
    },

  

    created(){
       
        this.getOrderInfo();
    }, 
    watch: {
        order:{
            handler(){
                this.getOrderInfo();
            },
            deep:true
        },
    },
   

    methods:{
        // 셀 클릭 시 편집 시작 전에 원래 값 저장
    onCellClicked(params) {
        if (params.colDef.editable) {
            if (!this.originalValues) {
                this.originalValues = {};
            }
            this.originalValues[params.node.id] = this.originalValues[params.node.id] || {};
            this.originalValues[params.node.id][params.column.colId] = params.value; // 특정 셀의 원래 값 저장
            //console.log("원래값==",params.value)
        }
        // 'product_name' 필드 클릭 시 모달 열기
        if (params.colDef.field === 'product_name') {
            this.Scol = params.node.rowIndex;  // 행 인덱스 저장
            //console.log(this.Scol);
            this.openModal();  // 모달 열기
        }
    },
    // 셀 값이 수정된 후 이를 롤백할 수 있게 함
    rollbackCellChange(params) {
        let nodeId = params.node.id;
        let colId = params.column.colId;
        if (this.originalValues && this.originalValues[nodeId] && this.originalValues[nodeId][colId] !== undefined) {
            let originalValue = this.originalValues[nodeId][colId];
            params.node.setDataValue(params.column,originalValue); // 원래 값으로 롤백
            this.originalValue = null;  // 원래 값 초기화
        }
    },

    rollbackEdit() {
        if (this.originalValues) {
            this.gridApi.forEachNode((node) => {
                // 각 셀마다 저장된 원래 값을 롤백
                Object.keys(this.originalValues[node.id] || {}).forEach(colId => {
                const originalValue = this.originalValues[node.id][colId];
                node.setDataValue(colId, originalValue); // 해당 컬럼의 원래 값으로 롤백
                });
            });
             // 체크박스 해제
            this.gridApi.deselectAll();
            this.originalValue = null; // 롤백 후 원래 값 초기화
        }
      
    },
        onReady1(event){
            this.gridApi = event.api;
            //event.api.sizeColumnsToFit(); //그리드 api 넓이 슬라이드 안생기게하는거
            //페이징 영역에 버튼 만들기 
            const allPanels = document.querySelectorAll('.ag-paging-panel');

             //lot그리드
             const paginationPanel1 = allPanels[2];
            if (paginationPanel1) {
               // 컨테이너 생성
               const container1 = document.createElement('div');
               container1.style.display = 'flex';
               container1.style.alignItems = 'center';
               container1.style.gap = '5px'; // 버튼과 입력 필드 간격

                // 버튼 생성
                const button1 = document.createElement('button');
               button1.textContent = '주문추가';
               button1.style.cursor = 'pointer';
               button1.style.backgroundColor = '#4caf50';
               button1.style.color = 'white';
               button1.style.border = 'none';
               button1.style.padding = '5px 10px';
               button1.style.borderRadius = '4px';
                //버튼클릭이벤트
                button1.addEventListener('click',()=>{
                //주문추가
                this.addMaterial();
                 });
                  // 버튼 생성
               const button2 = document.createElement('button');
               button2.textContent = '주문삭제';
               button2.style.cursor = 'pointer';
               button2.style.backgroundColor = '#f44335';
               button2.style.color = 'white';
               button2.style.border = 'none';
               button2.style.padding = '5px 10px';
               button2.style.borderRadius = '4px';
                //버튼클릭이벤트
                button2.addEventListener('click',()=>{
                //주문삭제
                this.deleteOrders();
                 });
                     // 버튼 생성
               const button3 = document.createElement('button');
               button3.textContent = '초기화';
               button3.style.cursor = 'pointer';
               button3.style.backgroundColor = '#fb8c00';
               button3.style.color = 'white';
               button3.style.border = 'none';
               button3.style.padding = '5px 10px';
               button3.style.borderRadius = '4px';
                //버튼클릭이벤트
                button3.addEventListener('click',()=>{
                //초기화
                this.rollbackEdit();
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
                container1.appendChild(button1);
                container1.appendChild(button2);
                container1.appendChild(button3);
                container1.appendChild(inputText1);

                //페이징 영역에 컨테이너삽입
                paginationPanel1.insertBefore(container1,paginationPanel1.firstChild);
            }
        },

        // 부모로 부터 (주문서조회) 부터 받은 order 
        async getOrderInfo() { 
            
            //console.log("넘어온값",this.order);
            let result = await axios.get(`${ajaxUrl}/orderInfo/${this.order.orderlist_num}}`)
                                    .catch(err=> console.log(err));
                       
            this.rowData = result.data;
            this.rowData = result.data.map((col) => ({
            ...col,
            order_status : this.statusOrderMap[col.order_status],
            })
        );
        //console.log("rowData:",this.rowData);
            
            
        },
        //추가주문 형성 
        addMaterial() {
        
            const newMaterial={
            order_num: null,
            product_code : '',
            product_name : '',
            order_amount: null,
            per_price: null
            };
            this.rowData.push(newMaterial);
            this.rowData = [ ...this.rowData];

            //마지막 material 요소의 productCode가 공백인 경우 newMaterial 형성 못하게 하기 
            // if(this.materials.length == 0){
            //     this.rowData.push(newMaterial);
            //     //console.log(this.materials[this.materials.length]);
            // }else if(this.materials[this.materials.length -1 ].newProductCode != ''){
            //     this.materials.push(newMaterial);
            // }   
        },

        openModal() {
            this.isShowModal = true; 
            //console.log("modalopen")
        },

        selectproduct(product){
        //console.log(product); 
        this.selectedProCode = product.product_code;
        this.selectedProName = product.product_name;
        //console.log("선택", this.selectedProCode,this.selectedProName);
        },

        confirm(){
            //console.log("선택된변경컬럼====",this.Scol);
            // this.rowData[this.Scol] = this.rowData[this.Scol].map((col) => ({
            //     ...col,
            //     product_code : this.selectedProCode,
            //     product_name : this.selectedProName,
            //      })
            // );  
            //console.log(this.rowData[this.Scol].order_num ,this.rowData[this.Scol].order_status )

            if(this.rowData[this.Scol].order_status == "미출고"){
                    this.rowData[this.Scol] ={
                    order_num : this.rowData[this.Scol].order_num,
                    product_code : this.selectedProCode,
                    product_name : this.selectedProName,
                    order_amount : this.rowData[this.Scol].order_amount,
                    per_price : this.rowData[this.Scol].per_price,
                    order_status : this.rowData[this.Scol].order_status,

                    }
            } else if (
                this.rowData[this.Scol].order_status === "출고완료" ||
                this.rowData[this.Scol].order_status === "부분출고"
            ) {
                // 출고완료 또는 부분출고 상태일 때 알림 추가
                this.$notify({
                    text: `출고완료 또는 부분출고 상태에서는 수정할 수 없습니다.`,
                    type: "warn",
                });
            }else {
                    this.rowData[this.Scol] = {
                    order_num: null,
                    product_code : this.selectedProCode,
                    product_name : this.selectedProName,
                    order_amount: null,
                    per_price: null
                    }
            }
                
            

           
            // 넣고 나서 다시 풀었다가 다시 배열 형성 
            this.rowData = [... this.rowData]
            
            //console.log("최종:",this.rowData[this.Scol] )
        
            this.closeModal();
        },
        closeModal() {
        this.isShowModal = false;
    },

    // onClickedWh(col){

    //    this.Scol = col.node.rowIndex
    //    console.log(this.Scol);

    //     if(col.colDef.field === 'product_name'){
    //         this.openModal();
    //     }
    // },

    // 주문추가 삭제 함수
    renderButton(params){
        let rowDelete = params.data;

        this.rowData = this.rowData.filter((row)=> row!=rowDelete);

    },


    dateFormat(value, format) {
        return userDateUtils.dateFormat(value, format);
    },
   

    //주문수정
    async updateOrder(){
    
        //주문  업데이트
        const selectedRows = this.gridApi.getSelectedRows(); 
        //console.log(selectedRows);
        //업데이트 해야 하는 주문 내용 (배열형성)
        let orderAmounts = []
        let perPrices = []
        let productCodes = []
        let orderCodes =[]

         // preparing 상태가 아닌 데이터가 있는지 체크
        let hasInvalidStatus = false;

        selectedRows.forEach(row=>{
            //console.log(row.order_status);
            if(row.product_code === '' || row.product_code === null || row.order_amount === '' || row.order_amount === null || row.per_price === '' || row.per_price === null ){
                this.$notify({
                    text: `제품명과 주문수량, 개별금액은 필수로 입력해야 합니다.`,
                    type: 'error',
                });
                return;
            }
            if(row.order_status === '미출고' || row.order_num === '' || row.order_num === null){
                orderAmounts.push(Number(row.order_amount));
                productCodes.push(row.product_code);
                perPrices.push(row.per_price);
                orderCodes.push(row.order_num);
            }else {
            // preparing이 아닌 상태가 존재할 경우 플래그를 설정
            hasInvalidStatus = true;
            }
        })
        if (hasInvalidStatus) {
        // preparing이 아닌 상태가 있는 경우 알림 표시
        this.$notify({
            text: `주문이 진행 중이 주문 건이 있습니다. 확인해주세요.`,
            type: 'warn',
        });
        return; // 부모로 데이터 전송 중단
        }
        

        let updateOrderInfo = {
            orderCode: JSON.stringify(orderCodes),
            productCode :JSON.stringify(productCodes),
            orderAmount : JSON.stringify(orderAmounts),
            perPrice : JSON.stringify(perPrices),
        }
        //console.log("보내기:",updateOrderInfo);
        //부모에게 주문 수정 내용 넘기기 
        this.$emit('updateOrder',updateOrderInfo);

       
      },

      // 삭제 (주문서)
      async deleteOrder(){
        //console.log("삭제 실행 ", this.order);
        if(this.order.orderlist_status === '등록'){
            let result = await axios.delete(`${ajaxUrl}/orderlist/delete/${this.order.orderlist_num}`)
                                    .catch(err => console.log(err));
            if(result.data.result === 'success'){
                        this.$notify({
                            text: `${this.order.orderlist_title}이 삭제되었습니다.` ,
                            type: 'success',
                        });
                        window.location.reload();
                }else if (result.data.result === 'fail'){
                        this.$notify({
                            text: '삭제 오류 발생',
                            type: 'error',
                        });
                }
        }else if (this.order.orderlist_status === '진행중' || this.order.orderlist_status === '완료'){
            this.$notify({
                    text: '현재 출고 진행 중 이거나 출고 가 완료 된 건은 삭제 불가 합니다.',
                    type: 'warn',
                });
        }
     
       
      }, 
      //주문삭제 
      async deleteOrders(){
        const selectedRows = this.gridApi.getSelectedRows();
        //console.log("삭제될것==",selectedRows);

        let errorMessage = null; // 알림 메시지를 저장할 변수

        let orderNums = []

        selectedRows.forEach(row=>{
            if(row.order_status == "미출고"){
                orderNums.push(row.order_num);
            }else if(row.order_status == "출고완료" || row.order_status == "부분출고"){
                errorMessage = "기존의 주문이 진행 중이거나 완료 건은 삭제 불가 합니다.";
            }else if (row.order_num == null){
                errorMessage = "주문번호가 없는 건은 삭제할 수 없습니다.";
            }
        });
         // 오류 메시지가 있으면 알림을 띄우고 종료
        if (errorMessage) {
            this.$notify({
                text: errorMessage,
                type: 'error',
            });
            return;
        }
        // 삭제 요청 전송 (필요 시 추가)
        if (orderNums.length > 0) {
            let deleteOrder = {
                orderNum : JSON.stringify(orderNums)
            }

            //console.log("서버에 보낼 데이터==",deleteOrder);

            let result = await axios.put(`${ajaxUrl}/order/delete`,deleteOrder)
                                    .catch(err => console.log(err));
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
        }

      },
      
 
        
    }//end method
}
</script>

<style lang="scss" scoped>
.main-container {
  background-color: #e9ecef;
  margin: 20px;
  border-radius: 10px;
}
.content {
  margin: 20px;
  padding: 10px;
}
.client {
  padding: 10px;
  cursor: pointer;
  &:hover {
    background-color: #f8f9fa;
  }
}
.selected {
  background-color: #ffeeba;
  font-weight: bold;
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
