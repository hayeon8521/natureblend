<template>
    <div class="container-fluid py-4">
    <!--검색 폼 -->
    <h3>제품출고조회</h3>
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
                  <!--제품명 검색-->
                  <div class="row align-items-center mb-3">
                    <label class="col-sm-2 col-form-label fw-bold" >제품명</label>
                    <div class="col-sm-4">
                        <input type="text" class="form-control" id="productName" placeholder="제품명"
                            v-model="productName" @click="openModal('product')"  autocomplete="off"  >
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
                    <label class="col-sm-2 col-form-label fw-bold">출고일자</label>
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
        style ="height: 600px; "
        :rowData="rowData"
        :columnDefs="columnOrderlist"
        :theme="theme"
        @grid-ready="onReady"
        :quickFilterText="inputListsearch"
        :noRowsOverlayComponent="noRowsOverlayComponent"
        @rowClicked="onOrderRowClicked"
        rowSelection="multiple"
        :pagination="true"
        :paginationPageSize="10"
        :paginationPageSizeSelector="[10, 20, 50, 100]"
    />
    </div>
    <div style="display: none">
        <CustomNoRowsOverlay/>
    </div>    
</template>

<script>
import MaterialButton from "@/components/MaterialButton.vue";
import Modal from "@/views/natureBlendComponents/modal/Modal.vue";
import proList from "@/views/sales/Order/ProductModal.vue"
import ComList from "@/views/sales/Order/clientModal.vue";
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
            proList,
            ComList,
            CustomNoRowsOverlay,
            
    },
    data(){
        return{
            

            //검색 필터 데이터
            orderName:"", // 주문서명
            startDate:"", //주문날짜 시작 날짜
            endDate:"", //주문날짜 끝 날짜
            //거래처 모달 
            searchCom:"", // 저장 될 거래처 명 
            selectedCom: "", //선택된 거래처 명

            //제품 모달
            selectedProName:"",//선택될 제품 이름
            productName:'', //저장될 제품 이름 
            selectedProCode:"", //선택될 제품 코드 
            productCode:'', //저장될 제품 코드 

          

            //주문서 조회 결과 
            noRowsOverlayComponent: 'CustomNoRowsOverlay',
            filteredOrderlist : [],
            theme : theme,
            rowData : [],
            columnOrderlist : [
            { headerName : "출고번호", field:'output_num',flex: 2,cellStyle: { textAlign: "right" }},
            { headerName : "주문서명", field:'orderlist_title' ,flex: 4,cellStyle: { textAlign: "left" }},
            { headerName : "거래처명",field:'com_name' ,flex: 3,cellStyle: { textAlign: "left" }},
            { headerName : "제품코드",field:'product_code' ,flex: 2,cellStyle: { textAlign: "center" }},
            { headerName : "제품명",field:'product_name' ,flex: 3,cellStyle: { textAlign: "left" }},
            { headerName : "제품LOT번호",field:'product_lot' ,flex: 3,cellStyle: { textAlign: "center" }},
            { headerName : "출고수량",
            field:'output_amount' ,
            flex: 2,
            cellStyle: { textAlign: "right" }
            ,cellRenderer: params =>{
                    if(params.value){
                        const formattedValue = params.value.toLocaleString(); // 숫자에 쉼표 추가
                        return `<span>${formattedValue}</span>`;
                    }
            }},
            { headerName : "출고날짜",field:'output_date' ,flex: 3,cellStyle: { textAlign: "center" }},
            ],
           
            //검색어 검색 (그리드 안)
            inputListsearch: "", //검색어 1 (제품)
    

            

           
         

            


            isShowModal: {
            client: false, // 거래처 모달
            emp: false, // 직원 모달
            product : false, //제품모달
            },

            
           

            
        }
    },
 

    methods:{
        selectclient(client){
            this.selectedCom = client; 
        },
        selectproduct(product){
            //console.log(product); 
            this.selectedProCode = product.product_code;
            this.selectedProName = product.product_name;
        },
        openModal(modalType){
            this.isShowModal[modalType] = true; 
            //console.log(`${modalType} modal open`);
        },
        
        confirm(modalType){
            if (modalType === 'client') {
                this.searchCom = this.selectedCom;
            } else if (modalType === 'product') {
                this.productName = this.selectedProName;
                this.productCode = this.selectedProCode;
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
            this.productName = "";
            this.productCode = "";
            this.orderData = {};  // 객체 초기화
            this.rowData =[];
            //console.log(this.orderData);

            this.searchEmpName="";
        },
        
        async searchOrderlists(){
        this.filters  = {
            clientName : this.searchCom,
            productCode : this.productCode,
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

        let result = await axios.put(`${ajaxUrl}/outputList/search`,this.filters )
                                .catch(err => console.log(err));
        
        this.rowData = result.data;
        this.rowData = result.data.map((col) => ({
            ...col,
            output_date: this.dateFormat(col.output_date, "yyyy-MM-dd"),
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
            const paginationPanel = allPanels[2];
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
