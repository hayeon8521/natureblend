<template>
  <div class="container-fluid py-4">
    <div>
      <h3>생산 지시 목록</h3>
    </div>
    <div class="grid-container work" style="padding-top: 10px;">
      <ag-grid-vue
          :rowData="rowData"
          :columnDefs="columnDefs"
          :theme="theme"
          :pagination="true"
          :paginationPageSize="10"
          @grid-ready="onReady"
          style="height: 513px;"
          rowSelection="multiple"
          :quickFilterText="listSearch"
          :paginationPageSizeSelector="[10, 20, 50, 100]"
      >
      </ag-grid-vue>
    </div>
  </div>
</template>
<script>
import theme from "@/utils/agGridTheme";
import axios from "axios";
import {ajaxUrl} from "@/utils/commons";
import userDateUtils from "@/utils/useDates";

export default {
  name: "ProductionOrderList",

  data() {
    return {
      listSearch: '',
      rowData: [],
      columnDefs: [
        { headerName: "",
          headerCheckboxSelection: true,
          field: "check",
          resizable: false,
          editable: true,
          sortable: false,
          checkboxSelection: true,
          width: 50,
          flex: 1
        },
        { headerName: "생산지시번호", field: 'production_order_num', cellStyle: { textAlign: 'right' }, flex: 1},
        { headerName: "생산지시명", field: 'production_order_name', flex: 2 },
        { headerName: "생산계획명", field: 'plan_name', flex: 2 },
        { headerName: "작업일자", field: 'work_date', cellStyle: { textAlign: 'center' }, flex: 1 },
        { headerName: "제품명", field: 'product_name', flex: 1 },
        { headerName: "지시량(개)", field: 'production_order_qty', cellStyle: { textAlign: 'right' }, flex: 1 },
        {
          headerName: "작업진행",
          field: 'production_order_status',
          cellClass: (params) => {
            return params.value === '완료' ? 'green' : params.value === '진행중' ? 'gray' : params.value === '대기중' ? 'red' : ''
          },
          flex: 1
        },
      ],
      prodOrderStatus: {
        'work_waiting': '대기중',
        'work_in_process': '진행중',
        'work_complete': '완료'
      }
    }
  },

  computed: {
    theme() {
      return theme
    }
  },

  created() {
    this.getProdOrderList()
  },

  methods: {
    onReady(param){
      this.gridApi = param.api
      // param.api.sizeColumnsToFit();

      const paginationPanel = document.querySelector('.ag-paging-panel');
      if (paginationPanel){
        const container1 = document.createElement('div');
        container1.style.display = 'flex';
        container1.style.alignItems = 'center';

        const inputText1 = document.createElement('input');
        inputText1.type = 'text';
        inputText1.placeholder = '검색';
        inputText1.style.padding = '5px';
        inputText1.style.width = '200px';
        inputText1.style.border = '1px solid #ccc';
        inputText1.style.borderRadius = '4px';
        inputText1.style.position = 'absolute';
        inputText1.style.left = '80px';

        inputText1.addEventListener('input', (event) => {
          this.listSearch = event.target.value;
        });

        const button = document.createElement('button');
        button.textContent = '삭제';
        button.style.marginRight = '10px';
        button.style.cursor = 'pointer';
        button.style.backgroundColor = '#f44335';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.padding = '5px 10px';
        button.style.borderRadius = '4px';
        button.style.position = 'absolute';
        button.style.left = '10px';
        // 버튼 클릭 이벤트
        button.addEventListener('click', () => {
          this.deleteProdOrder()
        });

        container1.appendChild(inputText1);
        container1.appendChild(button);
        paginationPanel.insertBefore(container1, paginationPanel.firstChild);
      }
    },

    async deleteProdOrder() {
      const selectedRows = this.gridApi.getSelectedRows()

      if(selectedRows.length === 0) {
        this.$notify({
          text: "삭제할 생산지시를 선택해주세요.",
          type: 'error',
        });
        return
      }

      let prodOrderNums = []
      let isStop = false

      selectedRows.forEach((row) => {
        if(row.production_order_status !== '대기중' && !isStop) {
          this.$notify({
            text: "대기중인 생산지시만 삭제 가능합니다.",
            type: 'error',
          });
          isStop = true
        } else {
          prodOrderNums.push(row.production_order_num)
        }
      })

      if(isStop) {
        return
      }

      let result1 = await axios.post(`${ajaxUrl}/production/order/delete`, prodOrderNums)
          .catch(err => console.log(err));

      let result2 = await axios.post(`${ajaxUrl}/production/order/delete/process`, prodOrderNums)
          .catch(err => console.log(err));

      let result3 = await axios.post(`${ajaxUrl}/production/order/delete/invalid/material`, prodOrderNums)
          .catch(err => console.log(err));

      if(result1.data.message === 'success' && result2.data.message === 'success' && result3.data.message === 'success') {
        this.$notify({
          text: "삭제되었습니다.",
          type: 'success',
        });
        await this.getProdOrderList()
      } else {
        this.$notify({
          text: "삭제 실패하였습니다.",
          type: 'error',
        });
      }

    },

    dateFormat(value, format) {
      return userDateUtils.dateFormat(value, format);
    },

    async getProdOrderList() {
      let result = await axios.get(`${ajaxUrl}/production/order`)
          .catch(err => console.log(err));
      this.rowData = []

      if(result.data.length === 0) {
        return
      }

      let keys = []
      this.columnDefs.forEach((col) => {
        keys.push(col.field)
      })

      result.data.forEach((data, idx) => {
        this.rowData[idx] = {
          [keys[1]]: data[keys[1]],
          [keys[2]]: data[keys[2]],
          [keys[3]]: data[keys[3]],
          [keys[4]]: this.dateFormat(data[keys[4]], 'yyyy-MM-dd'),
          [keys[5]]: data[keys[5]],
          [keys[6]]: data[keys[6]],
          [keys[7]]: this.prodOrderStatus[data[keys[7]]],
        }
      })
    }
  }


};
</script>
<style scoped lang="scss">
.main-container{
  background-color:  #e9ecef;
  margin-left: 20px;
  margin-right: 20px;
  margin-top: 0px;
  margin-bottom: 0px;
  border-radius: 10px;
}
.content{
  margin-left: 20px;
  margin-right: 20px;
  margin-top: 0px;
  margin-bottom: 0px;
  padding: 0px;
}
input {
  background-color: $white;
  border: solid 1px  ;
}
</style>