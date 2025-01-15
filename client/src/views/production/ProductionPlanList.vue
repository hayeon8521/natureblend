<template>
  <div class="container-fluid py-4">
    <div class="pb-4">
      <h3>생산계획 목록</h3>
    </div>
    <div class="main-container mt-4">
      <div class="content">
        <form class="row gx-3 gy-2 align-items-center">
          <div class="col-sm-2">
            <label class="col-form-label fw-bold" for="product">제품명</label>
            <input type="text" readonly @click="openModal(false)" :value="searchProduct.product_name" class="form-control cursor-pointer" style="background-color: white; padding-left: 20px;" id="product">
          </div>
          <div class="radio-con">
            <label class="col-form-label fw-bold" for="planStatusOption">진행상태</label>
            <div id="planStatusOption" style="padding-left: 20px; display: inline-flex; align-items: center; gap: 15px; white-space: nowrap;">
              <label style="white-space: nowrap;"><input type="checkbox" class="form-check-input cursor-pointer" value="plan_waiting" v-model="planStatusOption"/>&nbsp;&nbsp;대기중</label>
              <label style="white-space: nowrap;"><input type="checkbox" class="form-check-input cursor-pointer" value="plan_in_process" v-model="planStatusOption"/>&nbsp;&nbsp;진행중</label>
              <label style="white-space: nowrap;"><input type="checkbox" class="form-check-input cursor-pointer" value="plan_complete" v-model="planStatusOption"/>&nbsp;&nbsp;완료</label>
            </div>
          </div>
          <div class="row gx-3 gy-2 mt-2 calendar-con">
            <div class="">
              <label class="col-form-label fw-bold" for="startDate">계획시작일자</label>
              <div class="input-group">
                <input type="date" class="form-control" style="background-color: white; padding-left: 20px;" id="startDate" v-model="startDate">
              </div>
            </div>
            <div class="">
              <label class="col-form-label fw-bold" for="endDate">계획종료일자</label>
              <div class="input-group">
                <input type="date" class="form-control" style="background-color: white; padding-left: 20px;" id="endDate" v-model="endDate">
              </div>
            </div>
          </div>
        </form>


        <div class="col-auto mt-1 text-center">
          <button type="button" class="btn me-5 fs-6 btn-success" @click="search">조회</button>
          <button type="button" class="btn btn-warning fs-6" @click="resetFilter">초기화</button>
        </div>
      </div>
    </div>
    <div class="grid-container work" style="padding-top: 10px;">
      <ag-grid-vue
          ref="agGrid"
          :rowData="rowData"
          :columnDefs="columnDefs"
          :theme="theme"
          :pagination="true"
          :paginationPageSize="10"
          @grid-ready="onReady"
          style="height: 513px;"
          rowSelection="multiple"
          :getRowClass="getRowClass"
          :quickFilterText="listSearch"
          @cell-editing-stopped="onCellEditingStopped"
          @cellDoubleClicked="onCellDoubleClicked"
          :paginationPageSizeSelector="[10, 20, 50, 100]"
      >
      </ag-grid-vue>
    </div>
    <h6 class="guide">
      * 수정 시, 셀을 더블 클릭하여 수정해주세요. 수정이 완료되면 상단 오른쪽에 메세지가 나타납니다.
      <br/>
      <span>대기중</span>인 계획만 수정 가능합니다.
    </h6>
    <Modal
        :isShowModal="isShowModal"
        :modalTitle="modalTitle"
        :noBtn="'닫기'"
        :yesBtn="'선택'"
        @closeModal="closeModal"
        @confirm="confirm"
    >
      <template v-slot:list>
        <ProductList v-show="isShowModal" @selectProduct="selectProduct"/>
      </template>
    </Modal>
  </div>
</template>
<script>
import theme from "@/utils/agGridTheme";
import axios from "axios";
import {ajaxUrl} from "@/utils/commons";
import ProductList from "@/views/production/productionPlanAdd/ModalProductList.vue";
import Modal from "@/views/natureBlendComponents/modal/Modal.vue";
import userDateUtils from "@/utils/useDates";

export default {
  name: "tables",
  components: {Modal, ProductList},

  data() {
    return {
      isForProductChange: false,
      startDate: '',
      endDate: '',
      planStatusOption: [],
      isShowModal: false,
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
        {
          headerName: "생산계획번호",
          field: 'plan_num',
          cellStyle: {textAlign: 'right'},
          flex: 2
        },
        {
          headerName: "생산계획명",
          field: 'plan_name',
          editable: params => {
            return params.data.plan_status === '대기중'
          },
          cellRenderer: (params) => {
            if(params.value && params.data.plan_status === '대기중'){
              return `
                <span style="display: flex; align-items: center; justify-content: flex-end;">
                    <span style="flex-grow: 1; text-align: left;">${params.value}</span>
                    <i class="fas fa-edit" style="color: #6c757d88" title="더블클릭하여 수정해주세요."></i>
                </span>
                `
            }
            else {
             return `<span style="flex-grow: 1; text-align: left;">${params.value || ''}</span>`
            }
          },
          flex: 3
        },
        {
          headerName: "계획시작일자",
          field: 'plan_start_date',
          cellStyle: {textAlign: 'center'},
          editable: params => {
            return params.data.plan_status === '대기중'
          },
          cellRenderer: (params) => {
            if(params.value && params.data.plan_status === '대기중'){
              return `
                <span style="display: flex; align-items: center; justify-content: flex-end;">
                    <span style="flex-grow: 1; text-align: left;">${params.value}</span>
                    <i class="fas fa-edit" style="color: #6c757d88" title="더블클릭하여 수정해주세요."></i>
                </span>
                `
            }
            else {
              return `<span style="display: flex; align-items: center; justify-content: flex-end;">
                        <span style="flex-grow: 1; text-align: left;">${params.value || ''}</span>
                      </span>`
            }
          },
          flex: 2
        },
        {
          headerName: "계획종료일자",
          field: 'plan_end_date',
          cellStyle: {textAlign: 'center'},
          editable: params => {
            return params.data.plan_status === '대기중'
          },
          cellRenderer: (params) => {
            if(params.value && params.data.plan_status === '대기중'){
              return `
                <span style="display: flex; align-items: center; justify-content: flex-end;">
                    <span style="flex-grow: 1; text-align: left;">${params.value}</span>
                    <i class="fas fa-edit" style="color: #6c757d88" title="더블클릭하여 수정해주세요."></i>
                </span>
                `
            }
            else {
              return `<span style="display: flex; align-items: center; justify-content: flex-end;">
                        <span style="flex-grow: 1; text-align: left;">${params.value || ''}</span>
                      </span>`
            }
          },
          flex: 2
        },
        {
          headerName: "진행상태",
          field: 'plan_status',
          cellClass: (params) => {
            return params.value === '완료' ? 'green' : params.value === '진행중' ? 'gray' : params.value === '대기중' ? 'red' : ''
          },
          cellStyle: {textAlign: 'center'},
          flex: 2
        },
        {
          headerName: "제품명",
          field: 'product_name',
          cellRenderer: (params) => {
            if(params.data.plan_status === '대기중'){
              return `
                <span style="display: flex; align-items: center; justify-content: flex-end;">
                    <span style="flex-grow: 1; text-align: left;">${params.value}</span>
                    <i class="fas fa-edit" style="color: #6c757d88" title="더블클릭하여 수정해주세요."></i>
                </span>
                `
            }
            else {
              return `<span style="display: flex; align-items: center; justify-content: flex-end;">
                        <span style="flex-grow: 1; text-align: left;">${params.value || ''}</span>
                      </span>`
            }
          },
        },
        { headerName: "계획수량",
          field: 'plan_qty',
          cellStyle: {textAlign: 'right'},
          editable: params => {
            return params.data.plan_status === '대기중'
          },
          cellRenderer: (params) => {
            if(params.data.plan_status === '대기중'){
              return `
                <span style="display: flex; align-items: center; justify-content: flex-end;">
                    <i class="fas fa-edit" style="color: #6c757d88" title="더블클릭하여 수정해주세요."></i>
                    <span style="flex-grow: 1; text-align: right;">${params.value}</span>
                </span>
                `
            }
            else {
              return `<span style="display: flex; align-items: center; justify-content: flex-end;">
                        <span style="flex-grow: 1; text-align: right;">${params.value || ''}</span>
                      </span>`
            }
          },
          flex: 2
        },
        { headerName: "주문계획번호", field: 'order_plan_num', hide: true },
        { headerName: "제품 번호", field: 'product_code', hide: true },
      ],
      planStatus: {
        'plan_waiting': '대기중',
        'plan_in_process': '진행중',
        'plan_complete': '완료'
      },
      modalTitle: '제품 목록',
      selectedProduct: {
        product_code: '',
        product_name: '',
      },
      searchProduct: {
        product_code: '',
        product_name: '',
      },
      planInfo: {}
    }
  },

  computed: {
    theme() {
      return theme
    }
  },

  created() {
    this.getPlanList()
  },

  methods: {
    onCellDoubleClicked(params) {
      if(params.colDef.field === 'product_name' && params.data.plan_status === '대기중') {
        this.setPlanInfo(params.data)
        this.openModal(true)
      }
    },

    confirm() {
      if(!this.isForProductChange) {
        this.searchProduct = this.selectedProduct
      } else {
        this.planInfo.orderPlanRelation.productCode = this.selectedProduct.product_code
        this.editPlan()
      }

      this.closeModal()
    },

    setPlanInfo(data) {
      this.planInfo = {
        plan: {
          planStartDate: data.plan_start_date,
          planEndDate: data.plan_end_date,
          planName: data.plan_name,
          planNum: data.plan_num
        },
        orderPlanRelation: {
          productCode: data.product_code,
          planQty: data.plan_qty,
          orderPlanNum: data.order_plan_num
        }
      }
    },

    async editPlan() {
      let result = await axios.put(`${ajaxUrl}/production/plan`, this.planInfo)
          .catch(err => console.log(err));

      if(result.data.message === 'success') {
        this.$notify({
          text: "수정되었습니다.",
          type: 'success',
        });
        await this.getPlanList()
      } else {
        this.$notify({
          text: "수정 실패하였습니다.",
          type: 'error',
        });
      }
    },

    async onCellEditingStopped(params) {
      this.setPlanInfo(params.data)
      await this.editPlan()
    },

    search() {
      let listInfo = {
        product: this.searchProduct.product_code,
        status: this.planStatusOption, //array
        startDate: this.startDate,
        endDate: this.endDate,
      }
      this.getPlanList(listInfo)
    },

    resetFilter() {
      this.searchProduct = {
        product_code: '',
        product_name: '',
      }
      this.planStatusOption = []
      this.startDate = ''
      this.endDate = ''

      this.getPlanList()
    },

    closeModal() {
      this.isShowModal = false
    },

    selectProduct(product) {
      this.selectedProduct = product
    },

    openModal(isForProductChange) {
      this.isForProductChange = isForProductChange
      this.isShowModal = !this.isShowModal
    },

    getRowClass(params) {
      if (params.data.plan_num !== null) {
        return "borderTop"
      } else {
        return 'noBorder'
      }
    },


    onReady(param){
      this.gridApi = param.api

      const paginationPanel = document.querySelector('.ag-paging-panel');
      if (paginationPanel){
        const container1 = document.createElement('div');
        container1.style.display = 'flex';
        container1.style.alignItems = 'center';
        container1.style.gap = '5px';

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
          this.deletePlan()
        });

        const inputText1 = document.createElement('input');
        inputText1.type = 'text';
        inputText1.placeholder = '검색';
        inputText1.style.padding = '5px';
        inputText1.style.width = '200px';
        inputText1.style.border = '1px solid #ccc';
        inputText1.style.borderRadius = '4px';
        inputText1.style.position = 'absolute';
        inputText1.style.left = '70px';

        inputText1.addEventListener('input', (event) => {
          this.listSearch = event.target.value;
        });

        container1.appendChild(button);
        container1.appendChild(inputText1);
        paginationPanel.insertBefore(container1, paginationPanel.firstChild);
      }
    },

    async deletePlan() {
      const selectedRows = this.gridApi.getSelectedRows()

      if(selectedRows.length === 0) {
        this.$notify({
          text: "삭제할 계획을 선택해주세요.",
          type: 'error',
        });
        return
      }

      let orderPlanNums = []
      selectedRows.forEach((row) => {
        orderPlanNums.push(row.order_plan_num)
      })

      let result = await axios.post(`${ajaxUrl}/production/plan/delete`, orderPlanNums)
          .catch(err => console.log(err));

      if(result.data.message === 'success') {
        this.$notify({
          text: "삭제되었습니다.",
          type: 'success',
        });
        await this.getPlanList()
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

    async getPlanList(params) {
      let result = null

      if(params) {
        result = await axios.get(`${ajaxUrl}/production/plan?productCode=${params.product}&status=${params.status}&startDate=${params.startDate}&endDate=${params.endDate}`)
            .catch(err => console.log(err));
      } else {
        result = await axios.get(`${ajaxUrl}/production/plan`)
            .catch(err => console.log(err));
      }

      this.rowData = []
      if(result.data.length === 0) {
        return
      }

      let keys = []
      this.columnDefs.forEach((col) => {
        keys.push(col.field)
      })

      result.data.forEach((data, idx, arr) => {
        if(idx === 0) {
          this.rowData[idx] = {
            [keys[1]]: data[keys[1]],
            [keys[2]]: data[keys[2]],
            [keys[3]]: this.dateFormat(data[keys[3]], 'yyyy-MM-dd'),
            [keys[4]]: this.dateFormat(data[keys[4]], 'yyyy-MM-dd'),
            [keys[5]]: this.planStatus[data[keys[5]]],
            [keys[6]]: data[keys[6]],
            [keys[7]]: data[keys[7]],
            [keys[8]]: data[keys[8]],
            [keys[9]]: data[keys[9]],
          }
        } else {
          this.rowData[idx] = {
            [keys[1]]: data[keys[1]] === arr[idx - 1][keys[1]] ? null : data[keys[1]],
            [keys[2]]: data[keys[1]] === arr[idx - 1][keys[1]] ? null : data[keys[2]],
            [keys[3]]: data[keys[1]] === arr[idx - 1][keys[1]] ? null : this.dateFormat(data[keys[3]], 'yyyy-MM-dd'),
            [keys[4]]: data[keys[1]] === arr[idx - 1][keys[1]] ? null : this.dateFormat(data[keys[4]], 'yyyy-MM-dd'),
            [keys[5]]: data[keys[1]] === arr[idx - 1][keys[1]] ? null : this.planStatus[data[keys[5]]],
            [keys[6]]: data[keys[6]],
            [keys[7]]: data[keys[7]],
            [keys[8]]: data[keys[8]],
            [keys[9]]: data[keys[9]]
          }
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
  form {
    display: flex;
  }
  .radio-con {
    width: 345px;
    display: flex;
    flex-direction: column;
    > div {
      height: 42px;
    }
  }
  .calendar-con {
    width: 400px;
    margin-bottom: 18px;
    > div {
      width: 50%;
    }
  }
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
.guide {
  margin-left: 16px;
  > span {
    margin: 8px 2px 0 12px;
    line-height: 30px;
    border-radius: 4px;
    padding: 4px 6px;
    font-weight: 900;
    color: white;
    background-color: #b82e24;
  }
}
</style>