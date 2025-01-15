<template>
  <div class="grid-container">
    <ag-grid-vue
      style ="height: 800px;"
      :rowData="rowData"
      :columnDefs="columnDefs"
      :theme="theme"
      @grid-ready="onGridReady"
      :noRowsOverlayComponent="noRowsOverlayComponent"
      rowSelection="multiple"
      @rowClicked="onRowClicked"
      :pagination="true"
      :paginationPageSize="10"
  />
  
  </div>
  <div style="display: none">
      <CustomNoRowsOverlay/>
    </div>
</template>


<script>
import axios from "axios";
import { ajaxUrl } from '@/utils/commons.js';
import userDateUtils from '@/utils/useDates.js';
import theme from "@/utils/agGridTheme";
import CustomNoRowsOverlay from "@/views/natureBlendComponents/grid/noDataMsg.vue";



export default {
  name: "orderList",
  props: {
    filters: {
        type: Object,
        required: true,
    },
  },
  components:{
    CustomNoRowsOverlay
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
        { headerName : "주문서코드", field:'orderListNum'},
        { headerName : "주문서명", field:'orderName'},
        { headerName : "거래처명",field:'clientName'},
        { headerName : "담당자",field:'empName'},
        { headerName : "주문일자",field:'orderDate'},
        { headerName : "납기일자",field:'dueDate'},
        { headerName : "진행상태",field:'orderStatus'},

      ],

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
    onGridReady(params) {
      this.gridApi = params.api;
      this.gridApi.sizeColumnsToFit();
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

      console.log(obj.orderStatus);
      //서버에 검색 필터 데이터 전송
        let result = await axios.put(`${ajaxUrl}/orderlist/search`,obj)
                                .catch(err=> console.log(err));
        
        this.filterOrderlist = result.data; //서버에 받은 데이터 저장 
        console.log(this.filterOrderlist);

        this.rowData = []; //초기화 
        for(let i=0; i < this.filterOrderlist.length; i++){
          let tempData = {'orderListNum': this.filterOrderlist[i].orderlist_num,
                           'orderName':this.filterOrderlist[i].orderlist_title ,
                           'clientName':this.filterOrderlist[i].com_name,
                           'empName': this.filterOrderlist[i].name,
                           'orderDate' : this.dateFormat(this.filterOrderlist[i].order_date, 'yyyy-MM-dd'),
                           'dueDate' : this.dateFormat(this.filterOrderlist[i].due_date, 'yyyy-MM-dd'),
                           'orderStatus' : this.statusMap[this.filterOrderlist[i].orderlist_status] || this.filterOrderlist[i].orderlist_status
                        }
                        // console.log(tempData);
          this.rowData[i] = tempData; // 객체를 배열로 넣기 
        }
        console.log(this.rowData);
        
        
      },// searchOrder

      
    dateFormat(value, format) {
          return userDateUtils.dateFormat(value, format);
      },

    onRowClicked(row) {
        console.log('클릭된 셀 데이터:',row.data);
        let order = row.data
        this.$router.push({ name:'orderInfo', params : {no: order.orderListNum} })
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