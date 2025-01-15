<template>
<div class="container-fluid py-4">
    <!--검색 폼 -->
        <h3>제품<span style="font-family:'Arial';">LOT</span>재고조회</h3>
        <div class= "main-container ">
            <div class="ps-4">
                     <!--LOT재고 상태 체크 박스-->
                     <div class="pt-2">
                            <label class="col-sm-2 col-form-label fw-bold">LOT재고상태</label>
                            <div>
                                <label class="me-3" v-for="status in statusList" :key="status">
                                    {{ status }}
                                <input 
                                    class="form-check-input"
                                    :value="status"
                                    type="checkbox"
                                    v-model="pickedStatus"
                                >
                                </label>
                            </div>
                    </div>
                    <!--유통기한 검색-->
                    <div class="row align-items-center">
                        <label class="col-sm-2 col-form-label fw-bold" >유통기한</label>
                            <div class="col-sm-6 d-flex align-items-center">
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
                            <div class="col-sm-4 text-end">
                                <!--검색 및 초기화-->
                                <material-button  size = "md" color="success" class="button" @click="searchLotNum">검색</material-button>
                                <material-button  size = "md" color="warning" class="button" @click="resetSearch">초기화</material-button>
                            </div>
                        </div>   
                    </div>
                </div>   
            </div>
        </div>
        <div class="container-fluid py-4">
            <div>
                <!-- 입고된 lot 조회 -->
                <div class="grid-container">
                    <ag-grid-vue
                    style ="height: 600px; "
                    :rowData="LotNum"
                    :columnDefs="columnLotNum"
                    :theme="theme"
                    @grid-ready="onReady1"
                    :quickFilterText="inputListsearch1"
                    :noRowsOverlayComponent="noRowsOverlayComponent"
                    rowSelection="multiple"
                    :pagination="true"
                    :paginationPageSize="10"
                    :paginationPageSizeSelector="[10, 20, 50, 100]"
                />
                </div>
                <div style="display: none">
                    <CustomNoRowsOverlay/>
                </div>
            </div>
        </div>
</template>

<script>
import MaterialButton from "@/components/MaterialButton.vue";
import theme from "@/utils/agGridTheme";
import userDateUtils from '@/utils/useDates.js';
import CustomNoRowsOverlay from "@/views/natureBlendComponents/grid/noDataMsg.vue";
import axios from "axios";
import { ajaxUrl } from '@/utils/commons.js';



export default{
    name :"inputList",
    components:{
            MaterialButton,
            CustomNoRowsOverlay,
            
    },
    data(){
        return{
            //검색 필터 데이터
            startDate:"", //입고날짜 시작 날짜
            endDate:"", //입고고날짜 끝 날짜
           

            //검색어 검색 (그리드 안)
            inputListsearch1:"", //검색어2 (lot)

          

            
            noRowsOverlayComponent: 'CustomNoRowsOverlay',
            theme : theme,
           
            // lot별 재고 갯수 조회 
             //주문서상태 체크 박스 관련 데이터
            statusList:["보관","폐기","취소","소진"], //상태 리스트
            pickedStatus:[], //체크박스 선택 값 저장

            LotNum :[],
            columnLotNum :[
            { headerName: "제품LOT번호 ", field: "product_lot", resizable: true, sortable: true ,flex: 3, cellStyle: { textAlign: "center" }},
            { headerName: "제품코드", field: "product_code", resizable: true, sortable: true ,flex: 2, cellStyle: { textAlign: "center" }},
            { headerName: "제품명 ", field: "product_name", resizable: true, sortable: true,flex: 3, cellStyle: { textAlign: "left" } },
            { headerName: "제품수량 "
            , field: "product_quantity"
            , resizable: true
            , sortable: true 
            ,flex: 2
            , cellStyle: { textAlign: "right" }
            ,cellRenderer: params =>{
                    if(params.value){
                        const formattedValue = params.value.toLocaleString(); // 숫자에 쉼표 추가
                        return `<span>${formattedValue}</span>`;
                    }
             }},
            { headerName: "창고위치 ", field: "warehouse_name", resizable: true, sortable: true ,flex: 2, cellStyle: { textAlign: "left" }},
            { headerName: "제조일자 ", field: "manufacturing_date", resizable: true, sortable: true,flex: 2, cellStyle: { textAlign: "center" } },
            { headerName: "유통기한 ", field: "expire_date", resizable: true, sortable: true ,flex: 2, cellStyle: { textAlign: "center" }},
            { headerName: "상태", field: "product_status", resizable: true, sortable: true ,flex: 1, cellStyle: { textAlign: "left" }},
            {
                headerName : "폐기",
                field : "status",
                editable : false,
                flex: 1, 
                cellStyle: { textAlign: "center" },
                cellRenderer: params =>{
                      // 유통기한 값을 받아옵니다.
                const expireDate = params.data.expire_date; // 유통기한이 날짜 형식이라 가정
                const productStatus = params.data.product_status; // lot재고 상태
                const currentDate = new Date();
                if( new Date(expireDate) <= currentDate && productStatus === '보관'){
                    const disposeButton = document.createElement('button');
                    disposeButton.innerText = '폐기';
                    disposeButton.style.marginRight = '10px';
                    disposeButton.style.cursor = 'pointer';
                    disposeButton.style.backgroundColor = '#f44335';
                    disposeButton.style.width = '60px';
                    disposeButton.style.height = '30px';
                    disposeButton.style.color = 'white';
                    disposeButton.style.border = 'none';
                    disposeButton.style.padding = '0';
                    disposeButton.style.borderRadius = '4px';
                    disposeButton.style.textAlign = 'center';
                    disposeButton.style.lineHeight = '30px';

                    disposeButton.addEventListener('click',()=>{
                        this.renderButton(params);
                    })
                    return disposeButton;
                }
            }
               
               

            }    
        ],


            isShowModal: false,

            
           

            
        }
    },
   
 

    methods:{
          onReady1(event){
            this.gridApi = event.api;
            // event.api.sizeColumnsToFit(); //그리드 api 넓이 슬라이드 안생기게하는거
            //페이징 영역에 버튼 만들기 
            const allPanels = document.querySelectorAll('.ag-paging-panel');

             //lot그리드
             const paginationPanel1 = allPanels[0];
            if (paginationPanel1) {
               // 컨테이너 생성
               const container1 = document.createElement('div');
               container1.style.display = 'flex';
               container1.style.alignItems = 'center';
               container1.style.gap = '5px'; // 버튼과 입력 필드 간격

               
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
                
                container1.appendChild(inputText1);

                //페이징 영역에 컨테이너삽입
                paginationPanel1.insertBefore(container1,paginationPanel1.firstChild);
            }
        },

        async searchLotNum(){
            if( new Date(this.startDate) > new Date(this.endDate)){
                this.$notify({
                        text: `시작 날짜는 종료 날짜보다 이전이어야 합니다. `,
                        type: 'error',
                    });
                return;
            }
            this.filters  = {
                productStatus : this.pickedStatus,
                startDate : this.startDate,
                endDate : this.endDate,
            }

            //console.log(this.filters);
            let result = await axios.put(`${ajaxUrl}/inventory/lot`,this.filters )
                                    .catch(err => console.log(err));
            //console.log(result.data);
            this.LotNum = result.data;
            this.LotNum = result.data.map((col) => ({
                ...col,
                manufacturing_date: this.dateFormat(col.manufacturing_date, "yyyy-MM-dd"),
                expire_date: this.dateFormat(col.expire_date, "yyyy-MM-dd"),
                })
            );  

        },
        dateFormat(value, format) {
          return userDateUtils.dateFormat(value, format);
        }, 

        // 버튼 렌더링 함수
        async renderButton(params) {

            let disposeLot = {
                disposeLots : params.data.product_lot
            };
            let result = await axios.put(`${ajaxUrl}/inventory/dispose`,disposeLot)
                                    .catch(err => console.log(err));
            //console.log(result.data.result);
            // ===  은 타입 까지 비교 (true,false는 boolean 타입 그래서 ''빼줘야 한다.)
            if(result.data.result === true){
                    this.$notify({
                    text: `해당 LOT는 폐기 되었습니다. `,
                    type: 'success',
                });
                window.location.reload(); 
            }else{
                this.$notify({
                    text: `해당 LOT는 폐기 처리 실패 했습니다. `,
                    type: 'error',
                });
            }

        },
        resetSearch(){
            this.startDate = "",
            this.endDate = "",
            this.pickedStatus = [],
            this.LotNum = []
        },
      

       


    },// method  
};
</script>
<style lang="scss" scoped>
.main-container{
    background-color:  #e9ecef;
    border-radius: 10px;
    //height: 150px;
    padding:15px;
    
}



.text-center {
  text-align: center;
}

.button {
  margin: 0 10px; /* 버튼 사이 간격 추가 */
}
/* material-button 크기 조정 */
material-button {
  padding: 5px 20px; /* 패딩으로 버튼 크기 조정 */
  font-size: 14px; /* 버튼 폰트 크기 조정 */
}

/* 버튼이 한 줄에 정렬되도록 조정 */
.row {
  align-items: center; /* 수직 정렬 */
}
.text-end {
  text-align: right; /* 오른쪽 정렬 */
}
/* 일반 input 태그 스타일 */
input {
  background-color: #ffffff; /* 배경색 흰색 */
  border: solid 1px #ced4da; /* 테두리 색상 */
  color: #495057; /* 텍스트 색상 */
}
/* readonly 상태의 input 태그 스타일 */
// input:read-only {
//   background-color: #ffffff; /* 배경색 흰색 고정 */
//   color: #495057; /* 텍스트 색상 유지 */
//   cursor: not-allowed; /* 읽기 전용 표시를 위한 커서 */
// }

/* input 포커스 상태에서도 배경색 유지 */
input:focus {
  background-color: #ffffff; /* 포커스 시 배경색 흰색 유지 */
  border-color: #86b7fe; /* 선택 시 테두리 색상 약간 강조 */
  outline: none; /* 기본 브라우저 포커스 아웃라인 제거 */
}

/* readonly input 요소가 포커스되어도 스타일 유지 */
// input:read-only:focus {
//   background-color: #ffffff; /* 배경색 흰색 고정 */
//   border-color: #ced4da; /* readonly 상태에서는 테두리 기본값 */
//   outline: none; /* 포커스 아웃라인 제거 */
// }
</style>
