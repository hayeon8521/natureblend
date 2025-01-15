<template>
  <div class="grid-container">
    <ag-grid-vue
    
      :rowData="rowData"
      :columnDefs="columnDefs"
      :theme="theme"
      @grid-ready="onReady"
      :noRowsOverlayComponent="noRowsOverlayComponent"
      rowSelection="multiple"
      :quickFilterText="inputListsearch"
      @rowClicked="onRowClicked"
      :pagination="true"
      :paginationPageSize="5"
      :paginationPageSizeSelector="[5, 10, 20, 50, 100]"
  />
  
  </div>
  <div style="display: none">
      <CustomNoRowsOverlay/>
  </div>
<!-- 부모의 값이 자식으로 넘어갈때 자꾸 빈 값이 넘어가는 경우 v-if를 줘서 다시 렌더링 되게 만들어 준다.-->
  <orderInfo :order="order" v-if="Object.values(order).length > 0"  @updateOrder="updateOrder"></orderInfo> 

</template>


<script>
import axios from "axios";
import { ajaxUrl } from '@/utils/commons.js';
import userDateUtils from '@/utils/useDates.js';
import theme from "@/utils/agGridTheme";
import CustomNoRowsOverlay from "@/views/natureBlendComponents/grid/noDataMsg.vue";
import orderInfo from "./orderInfo.vue";


export default {
  name: "orderList",
  props: {
    filters: {
        type: Object,
        required: true,
    },
  },
  components:{
    CustomNoRowsOverlay,
    orderInfo,
  },
  
 
  data(){
    return {
      noRowsOverlayComponent: 'CustomNoRowsOverlay',
      filterOrderlist : [],
      statusMap: {         // DB 상태값과 화면 상태명 매핑
        "update": "등록",
        "continue": "진행중",
        "done": "완료",
      },
      
      theme : theme,
      rowData : [],
      columnDefs : [
        { headerName : "주문서번호", field:'orderlist_num',resizable: true, sortable: true ,cellStyle: { textAlign: "right" },flex: 2},
        { headerName : "주문서명", field:'orderlist_title',editable: true, sortable: true ,cellStyle: { textAlign: "left" },flex: 4},
        { headerName : "거래처명",field:'com_name',resizable: true, sortable: true ,cellStyle: { textAlign: "left" },flex: 2},
        { headerName : "담당자",field:'name',resizable: true, sortable: true ,cellStyle: { textAlign: "left" },flex: 2},
        { headerName : "주문일자",field:'order_date',resizable: true, sortable: true ,cellStyle: { textAlign: "center" },flex: 2},
        { headerName : "납기일자",field:'due_date', editable: true, sortable: true ,cellStyle: { textAlign: "center" },flex: 2},
        { headerName : "진행상태",field:'orderlist_status',resizable: true, sortable: true ,cellStyle: { textAlign: "left" },flex: 2},

      ],
      order : {},

       //검색어 검색 (그리드 안)
       inputListsearch: "", //검색어 1

       //수정,추가등록 플래그
       added : "",
       updated:"",

    }
  },
    
    
  watch: {
    filters:{
      handler(){
        this.searchOrder();
      },
    },
  },
  created(){
    this.searchOrder() // 컴포넌트가 생성될 때 초기 검색
  },
  methods:{
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
                  //console.log("입력된 값1:", value);

                  //검색로직추가기능
                  this.inputListsearch = value;
              });

              //컨테이너에 버튼, 입력 필드 추가
              
              container.appendChild(inputText);

              //페이징 영역에 컨테이너삽입
              paginationPanel.insertBefore(container,paginationPanel.firstChild);
        }
    },
    async searchOrder(){
      if( new Date(this.filters.startDate) > new Date(this.filters.endDate)){
          this.$notify({
                  text: `시작 날짜는 종료 날짜보다 이전이어야 합니다. `,
                  type: 'error',
              });
          return;
      }
      let obj = {
        orderStatus:this.filters.orderStatus,
        clientName:this.filters.clientName,
        orderName :this.filters.orderName,
        startDate:this.filters.startDate,
        endDate:this.filters.endDate 
      }

      //console.log(obj.orderStatus);
      //서버에 검색 필터 데이터 전송
        let result = await axios.put(`${ajaxUrl}/orderlist/search`,obj)
                                .catch(err=> console.log(err));
        this.rowData = result.data;
      //console.log("rowdata===",this.rowData)
        this.rowData = result.data.map((col) => ({
            ...col,
            order_date: this.dateFormat(col.order_date, "yyyy-MM-dd"),
            due_date: this.dateFormat(col.due_date, "yyyy-MM-dd"),
            orderlist_status : this.statusMap[col.orderlist_status],
            })
        );  

       
        
      },// searchOrder

      
    dateFormat(value, format) {
          return userDateUtils.dateFormat(value, format);
      },

    onRowClicked(row) {
        this.order = row.data
        //console.log('클릭된 셀 데이터:',this.order);
        //this.$router.push({ name:'orderInfo', params : {no: order.orderListNum} })
      },

//주문의 수정 및 추가주문 진행 
      async updateOrder(updateOrderInfo){
        //console.log("부모로 온 데이터:",updateOrderInfo);
        //console.log("주문서변경값:", this.order.orderlist_title , this.order.due_date);
        // 문자열을 배열로 변환
          const orderCodeArray = JSON.parse(updateOrderInfo.orderCode);  // ['null', 34]
          const productCodeArray = JSON.parse(updateOrderInfo.productCode);  // ['P006', 'P002']
          const orderAmountArray = JSON.parse(updateOrderInfo.orderAmount);  // [1000, 20]
          const perPriceArray = JSON.parse(updateOrderInfo.perPrice);  // [2000, 1500]

          // orderCode가 null인 항목과 아닌 항목으로 나누기
          const ordersWithOrderNum = [];
          const ordersWithoutOrderNum = [];

          // 배열의 길이만큼 반복하여 처리
          for (let i = 0; i < orderCodeArray.length; i++) {
              const order = {
                  orderCode: orderCodeArray[i],
                  productCode: productCodeArray[i],
                  orderAmount: orderAmountArray[i],
                  perPrice: perPriceArray[i]
              };

              // orderCode가 null인 경우와 아닌 경우로 나누기
              if (order.orderCode === null || order.orderCode === 'null') {
                  ordersWithoutOrderNum.push(order);
              } else {
                  ordersWithOrderNum.push(order);
              }
          }
          
        //주문추가 
       
        if(ordersWithoutOrderNum.length >0){
          //console.log("orderCode가 null인 주문:", ordersWithoutOrderNum);
          let newProductCodes = []
          let newProductNums = []
          let newPerPrices = []
          ordersWithoutOrderNum.forEach(row =>{
            newProductCodes.push(row.productCode);
            newProductNums.push(row.orderAmount);
            newPerPrices.push(row.perPrice);
          })

          let addOrdersWithoutOrderNum ={
            orderlistNum :this.order.orderlist_num,
            newProductCode : JSON.stringify(newProductCodes),
            newProductNum : JSON.stringify(newProductNums),
            newPerPrice : JSON.stringify(newPerPrices)
          }
           //newProductNum 또는 newPerPrice가 비어 있으면 경고
            if (newProductNums.some(num => num === '' || num === null) || newPerPrices.some(price => price === '' || price === null)) {
                this.$notify({
                    text: `주문 수량과 가격을 입력해주세요.`,
                    type: 'warn',
                });
                return;  // 추가 작업 진행하지 않음
            }
            await axios.post(`${ajaxUrl}/orderUpdate/insert`,addOrdersWithoutOrderNum)
                        .then(Response =>{
                              if(Response.statusText === 'OK'){
                                //console.log("추가등록완료");
                                this.added = true;
                              }
                            })
                        .catch(err => console.log(err));  
      

          
        }
          
          //업데이트 작업 
          
        if(ordersWithOrderNum.length > 0){
          //console.log("orderCode가 null이 아닌 주문:", ordersWithOrderNum);
          //업데이트 해야 하는 주문 내용 (배열형성)
          let orderAmounts = []
          let perPrices = []
          let productCodes = []
          let orderCodes =[]
          ordersWithOrderNum.forEach(row=>{
            orderAmounts.push(Number(row.orderAmount));
            perPrices.push(row.perPrice);
            productCodes.push(row.productCode);
            orderCodes.push(row.orderCode);
          })
        // updateOrderInfo.orderlistTitle = this.order.orderlist_title;
        // updateOrderInfo.dueDate = this.order.due_date;
        // 혹은 스프레드 연산자(...)를 사용하여 기존 객체를 복사하면서 새 속성을 추가
        // 새로운 속성을 추가한 객체 생성
          let updateOrdersWithOrderNum = {
              orderlistTitle: this.order.orderlist_title,
              dueDate: this.order.due_date,
              orderCode : JSON.stringify(orderCodes),
              productCode : JSON.stringify(productCodes),
              orderAmount : JSON.stringify(orderAmounts),
              perPrices : JSON.stringify(perPrices),
        
          };

          let result = await axios.put(`${ajaxUrl}/orderUpdate/update/${this.order.orderlist_num}`,updateOrdersWithOrderNum)
                                  .catch(err=>console.log(err));
              //console.log(result);
          if(result.statusText === 'OK'){
            this.updated = true; 
          }

        }

        //알림 처리  (각 성공의 경우 플래그 걸어서 주기 : added, updated )
        if(this.added && this.updated){
          this.$notify({
                  text: `${this.order.orderlist_title}에 주문이 추가 되고 수정되었습니다.`,
                  type: 'success',
              }); 
              window.location.reload();  
        }else if (this.added){
          this.$notify({
                  text: `${this.order.orderlist_title}에 주문이 추가 되었습니다.`,
                  type: 'success',
              }); 
              window.location.reload();  
        }else if (this.updated){
          this.$notify({
                  text: `${this.order.orderlist_title}이 수정되었습니다.`,
                  type: 'success',
              }); 
              window.location.reload();  
        }
          
       
      },
      

      
    },//end-Method
    
   
};
</script>
<style lang="scss" scoped>
.table-responsive {
    height: 250px;
    overflow-y: auto;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    thead {
      th {
        color: $gray-900 !important;

      }
      tr {
        position: sticky;
        top: 0;
        background-color: $main8 !important;
      }
    }
    tbody {
      tr:hover {
        background-color: $gray-100;
        cursor: pointer;
      }
      .selected {
        background-color: $gray-300 !important;
      }
    }

  }
</style>