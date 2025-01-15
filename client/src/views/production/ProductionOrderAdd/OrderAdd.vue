<template>
  <div class="container-fluid product-order-add py-4">
    <div class="top">
      <h3>생산지시 등록</h3>
      <material-button size="lg" color="success" class="button" @click="openModal">등록</material-button>
    </div>
    <div class="main-container">
      <div class="con-top">
        <OrderAddForm
            @setRowDataNeed="setRowDataNeed"
            @setRowDataStock="setRowDataStock"
            @updateNeedStock="updateNeedStock"
            @updateInputData="updateInputData"
            @getProcessFlow="getProcessFlow"
            @getSearchPlan="getSearchPlan"
            :isOrderAddFormReset="isOrderAddFormReset"
        />

        <div class="grid-container grid-1" >
          <h5>필요한 자재</h5>
          <ag-grid-vue
              :rowData="rowDataNeed"
              :columnDefs="columnDefsNeed"
              :theme="theme"
              @grid-ready="onGridReady"
              :paginationPageSizeSelector="[10, 20, 50, 100]"
          />
        </div>

        <div class="grid-container grid-2">
          <h5>자재 재고</h5>
          <ag-grid-vue
              :rowData="rowDataStock"
              :columnDefs="columnDefsStock"
              :theme="theme"
              @grid-ready="onGridReady"
              :pagination="true"
              :paginationPageSize="10"
              :paginationPageSizeSelector="[10, 20, 50, 100]"
          />
        </div>
      </div>
      <div class="con-bottom">
        <div class="grid-container grid-3">
          <h5>사용할 자재</h5>
          <ag-grid-vue
              :rowData="rowDataUse"
              :columnDefs="columnDefsUse"
              :theme="theme"
              @grid-ready="onGridReady"
              :stopEditingWhenCellsLoseFocus="true"
              @cell-editing-stopped="onCellEditingStopped"
              :pagination="true"
              :paginationPageSize="10"
              :paginationPageSizeSelector="[10, 20, 50, 100]"
          />
        </div>
      </div>
    </div>
    <Modal
        :isShowModal="isShowModal"
        :modalTitle="modalTitle"
        :noBtn="'취소'"
        :yesBtn="'확인'"
        @closeModal="closeModal"
        @confirm="confirm"
    >
      <template v-slot:list>
        <h6 class="modal-text">생산지시를 등록하시겠습니까?</h6>
      </template>
    </Modal>
  </div>
</template>
<script>
import MaterialButton from "@/components/MaterialButton.vue";
import theme from "@/utils/agGridTheme";
import OrderAddForm from "@/views/production/ProductionOrderAdd/OrderAddForm.vue";
import Modal from "@/views/natureBlendComponents/modal/Modal.vue";
import axios from "axios";
import {ajaxUrl} from "@/utils/commons";

export default {
  name: "OrderAdd" ,
  components: {Modal, OrderAddForm, MaterialButton},

  data() {
    return {
      modalTitle: '생산지시 등록',
      isShowModal: false,
      theme: theme,
      rowDataNeed: [],
      columnDefsNeed: [
        { headerName: "자재명", field: 'needMaterialName', flex: 1},
        { headerName: "용량(g 또는 ml)", field: 'needAmount', cellStyle: { textAlign: 'right' }, flex: 1 },
      ],

      rowDataStock: [],
      columnDefsStock: [
        { headerName: "자재Lot번호", field: 'stockLot', cellStyle: { textAlign: 'center' }, flex: 1},
        { headerName: "자재명", field: 'stockMaterialName', flex: 1 },
        {
          headerName: "용량(g 또는 ml)",
          field: 'stockAmount',
          cellStyle: { textAlign: 'right' },
          flex: 1,
          cellRenderer: (params) => {
            if(params.value < 0) {
              return 0
            } else {
              return params.value
            }
          }
        },
        { headerName: "유통기한", field: 'expiryDate', cellStyle: { textAlign: 'center' }, flex: 1 },
        { headerName: "자재코드", field: 'stockMaterialCode', hide: true },
        {
          headerName: "사용",
          field: 'useBtn',
          editable: false,
          cellRenderer: params => {
            const button = document.createElement('button');
            button.innerText = '사용';
            button.style.backgroundColor = '#fff'
            button.style.border = "1px solid #fb8c00"
            button.style.borderRadius = '4px'
            button.style.height = '35px'
            button.style.color = '#fb8c00'
            button.style.padding = '0 12px'
            button.style.lineHeight = '35px'
            button.addEventListener('click', () => {
              this.selectStock(params)
            });
            return button;
          },
          flex: 1
        },
      ],

      rowDataUse: [],
      columnDefsUse: [
        { headerName: "자재Lot번호", field: 'useLot', cellStyle: { textAlign: 'center' }, flex: 1},
        { headerName: "자재명", field: 'useMaterialName', flex: 2 },
        { headerName: "자재코드", field: 'useMaterialCode', hide: true },
        {
          headerName: "용량(g 또는 ml)",
          field: 'useAmount',
          editable: true,
          cellStyle: { textAlign: 'right' },
          flex: 2
        },
        {
          headerName: "삭제",
          field: 'deleteBtn',
          cellRenderer: params => {
            const button = document.createElement('button');
            button.innerText = '삭제';
            button.style.backgroundColor = '#fff'
            button.style.border = "1px solid #f44335"
            button.style.borderRadius = '4px'
            button.style.height = '35px'
            button.style.color = '#f44335'
            button.style.padding = '0 12px'
            button.style.lineHeight = '35px'
            button.addEventListener('click', () => {
              this.deleteMaterial(params)
            });
            return button;
          },
          flex: 1
        },
      ],
      orderInfo: {},
      newProdOrderNum: 0,
      processFlow: [],
      searchPlan: {},
      isOrderAddFormReset: false,
      originalRowDataNeed: [],
      selectedStock: {}
    }
  },

  methods: {
    focusOnCell() {
      this.gridApi.ensureIndexVisible(0)
      this.gridApi.ensureColumnVisible('useAmount')

      // 셀 포커스 및 편집 모드 시작
      this.gridApi.startEditingCell({
        rowIndex: 0,
        colKey: 'useAmount',
      })
    },

    getSearchPlan(searchPlan) {
      this.searchPlan = searchPlan
    },

    onCellEditingStopped(params) {
      if(Number(params.value) > this.selectedStock.stockAmount) {
        this.$notify({
          text: `재고 수량을 초과하였습니다. 최대 수량은 ${this.selectedStock.stockAmount}입니다`,
          type: 'error',
        });
      }
    },

    updateNeedStock() {
      // 원본 값 저장 (초기화되지 않도록 설정)
      if (this.originalRowDataNeed.length === 0) {
        this.originalRowDataNeed = JSON.parse(JSON.stringify(this.rowDataNeed))
      }

      this.rowDataNeed = this.originalRowDataNeed.map((data) => {
        return {
          ...data,
          needAmount: data.needAmount * this.orderInfo.prodOrderQty
        }
      })
    },

    updateInputData(orderInfo) {
      if(!orderInfo.prodOrderQty) {
        return
      }

      this.orderInfo = orderInfo
    },

    getProcessFlow(processFlow) {
      this.processFlow = processFlow
    },

    isFillOutAll() {
      let isInputFilledOut = Object.values(this.orderInfo).filter((value) => value === 0 || value === '').length === 0

      let isStockQtyFillerOut = true
      this.rowDataUse.forEach((data) => {
        if(!data.useAmount) {
          return false
        }
      })

      return isInputFilledOut && isStockQtyFillerOut
    },

    openModal() {
      if(!this.isFillOutAll()) {
        this.$notify({
          text: "빈칸을 입력해주세요.",
          type: 'error',
        });
        return
      }

      this.isShowModal = !this.isShowModal
    },

    closeModal() {
      this.isShowModal = false
    },

    isStockInShort() {
      // rowDataStock을 group by 자재명으로.
      let newRowDataStock = []

      this.rowDataStock.forEach((stock) => {
        if((newRowDataStock.filter((item) => item.stockMaterialName === stock.stockMaterialName)).length) {
          newRowDataStock.forEach((newData) => {
            if((newData.stockMaterialName === stock.stockMaterialName) && stock.stockAmount > 0) {
              newData.stockAmount += stock.stockAmount
            }
          })
        } else {
          newRowDataStock.push({ stockMaterialName: stock.stockMaterialName, stockAmount: stock.stockAmount > 0 ? stock.stockAmount : 0 })
        }
      })

      let isStop = false
      this.rowDataNeed.forEach((needStock) => {
        newRowDataStock.forEach((newData) => {
          if((needStock.needMaterialName === newData.stockMaterialName) && (needStock.needAmount > newData.stockAmount) && !isStop) {
            this.$notify({
              text: "재고가 부족합니다.",
              type: 'error',
            });
            this.closeModal()
            isStop = true
          }
        })
      })

      return isStop
    },

    async confirm() {
      if(this.isStockInShort()) {
        return
      }

      await this.addProductionOrder()

      // 자재별 홀딩자재 등록
      for (const data of this.rowDataUse) {
        await this.holdMaterial(data)
      }

      // 생산지시 등록 시, 공정흐름도에 따라 공정작업헤더 등록
      let isLastProcess = false
      for (const process of this.processFlow) {
        if(process.process_code === this.processFlow[this.processFlow.length - 1].process_code) {
          isLastProcess = true
        }
        await this.addProcessWork(process, isLastProcess)
      }

      this.closeModal()
    },

    async addProcessWork(process, isLastProcess) {
      let processInfo = {
        productionOrderNum: this.newProdOrderNum,
        productionOrderName: this.orderInfo.prodOrderName,
        productionOrder_qty: this.orderInfo.prodOrderQty,
        productCode: this.searchPlan.product_code,
        productName: this.searchPlan.product_name,
        capacity: this.searchPlan.capacity,
        processCode: process.process_code,
        processName: process.process_name,
        machineType: process.machine_type,
        workDate: this.orderInfo.workDate
      }

      let result = await axios.post(`${ajaxUrl}/production/order/process`, processInfo)
          .catch(err => console.log(err));


      if(isLastProcess && result.data.message === 'success') {
        this.$notify({
          text: "생산지시가 등록되었습니다.",
          type: 'success',
        });
        this.isOrderAddFormReset = false
        this.resetAddInfo()
      } else if(result.data.message !== 'success') {
        this.$notify({
          text: "생산지시 등록을 실패하였습니다.",
          type: 'error',
        });
      }
    },

    resetAddInfo() {
      this.isOrderAddFormReset = true
      this.rowDataNeed = []
      this.rowDataStock = []
      this.rowDataUse = []
    },

    async holdMaterial(data) {
      let holdStockInfo = {
        newProdOrderNum: this.newProdOrderNum,
        useMaterialCode: data.useMaterialCode,
        useLot: data.useLot,
        useLotSeq: Number(data.useLotSeq),
        useAmount: Number(data.useAmount)
      }

      await axios.post(`${ajaxUrl}/production/order/stockhold`, holdStockInfo)
          .catch(err => console.log(err));
    },

    async addProductionOrder() {
      let result =
          await axios.post(`${ajaxUrl}/production/order`, this.orderInfo)
              .catch(err => console.log(err));
      this.newProdOrderNum = result.data.newProdOrderNum
    },

    setRowDataStock(data) {
      this.rowDataStock = data
    },

    setRowDataNeed(data) {
      this.rowDataNeed = data
    },

    deleteMaterial(params) {
      this.rowDataUse = this.rowDataUse.filter((item) => item.useLotSeq !== params.data.useLotSeq)
    },

    selectStock(params) {
      setTimeout(() => {
        this.focusOnCell()
      }, 10)

      this.selectedStock = params.data

      let isStop = false
      this.rowDataUse.forEach((data) => {
        if((data.useLotSeq === this.selectedStock.stockLotSeq) && !isStop) {
          this.$notify({
            text: "이미 선택한 자재입니다.",
            type: 'error',
          })
          isStop = true
        }
      })

      if(isStop) {
        return
      }

      this.rowDataUse = [
        ...this.rowDataUse,
        {
          useLotSeq: this.selectedStock.stockLotSeq,
          useLot: this.selectedStock.stockLot,
          useMaterialName: this.selectedStock.stockMaterialName,
          useMaterialCode: this.selectedStock.stockMaterialCode
        }
      ]
    },

    onGridReady(params) {
      this.gridApi = params.api;
    },
  }

}
</script>


<style lang="scss" scoped>
.product-order-add {
  min-height: 500px;
  .top {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-content: center;
    > button {
      height: 50px;
    }
  }
  .main-container {
    width: 100%;
    padding: 40px;
    border-radius: 8px;
    background-color: $gray-200;
    margin-top: 12px;
    .grid-container {
      > div {
        height: inherit;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.25);
      }
    }
    .con-top {
      width: 100%;
      display: flex;
      justify-content: space-between;

      .grid-1 {
        height: 400px;
        width: 30%;
        padding: 0 20px 20px 28px;

      }
      .grid-2 {
        height: 400px;
        width: 60%;
        padding: 0 0 20px 20px;

      }
    }
    .con-bottom {
      display: flex;
      justify-content: flex-end;
      width: calc(100% - 316px);
      margin: 100px 0 100px auto;
      .grid-3 {
        height: 500px;
        width: 100%;
        padding: 0 0 20px 0;

      }
    }

  }
  .modal-text {
    text-align: center;
    margin: 20px;
  }
}

</style>