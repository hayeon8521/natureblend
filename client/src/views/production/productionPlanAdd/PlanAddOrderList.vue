<template>
  <div class="container-fluid">
    <div class="search-container mt-4">
      <h4>주문목록</h4>
      <div class="input-group w-auto h-25">
        <input type="text" @click="openModal" autocomplete="off" :value="searchProduct.product_name" readonly class="form-control border p-2 cursor-pointer" placeholder="제품명">
      </div>
      <material-button size="sm" color="success" class="button" @click="findOrdersAll">전체조회</material-button>
    </div>
    <div class="grid-container" >
      <ag-grid-vue
          :rowData="rowData"
          :columnDefs="columnDefs"
          :theme="theme"
          @grid-ready="onGridReady"
          :noRowsOverlayComponent="noRowsOverlayComponent"
          @rowClicked="onRowClicked"
          :pagination="true"
          :paginationPageSize="10"
          :paginationPageSizeSelector="[10, 20, 50, 100]"
      />
    </div>
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
    <div style="display: none">
      <CustomNoRowsOverlay/>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {ajaxUrl} from "@/utils/commons";
import MaterialButton from "@/components/MaterialButton.vue";
import ProductList from "@/views/production/productionPlanAdd/ModalProductList.vue";
import Modal from "@/views/natureBlendComponents/modal/Modal.vue";
import theme from "@/utils/agGridTheme";
import CustomNoRowsOverlay from "@/views/natureBlendComponents/grid/noDataMsg.vue";
import userDateUtils from "@/utils/useDates";

export default {
  name: "orderList",
  components: {Modal, ProductList, MaterialButton, CustomNoRowsOverlay},

  data() {
    return {
      noRowsOverlayComponent: 'CustomNoRowsOverlay',
      orders: [],
      searchProduct: {
        product_code: '',
        product_name: '',
      },
      isShowModal: false,
      modalTitle: '제품 목록',
      selectedProduct: {
        product_code: '',
        product_name: '',
      },
      selectedOrders: [],
      theme: theme,
      rowData: [],

      columnDefs: [
        { headerName: "주문번호", field: 'orderNum', cellStyle: { textAlign: 'right' },  flex: 1},
        { headerName: "주문일자", field: 'orderDate', cellStyle: { textAlign: 'center' }, flex: 2 },
        { headerName: "납기일자", field: 'dueDate', cellStyle: { textAlign: 'center' }, flex: 2 },
        { headerName: "제품명", field: 'productName', flex: 2 },
        { headerName: "주문량", field: 'orderQty', cellStyle: { textAlign: 'right' }, flex: 1  },
        { headerName: "기계획량", field: 'plannedQty', cellStyle: { textAlign: 'right' }, flex: 1 },
        { headerName: "미계획량", field: 'unplannedQty', cellStyle: { textAlign: 'right' }, flex: 1 },
        { headerName: "재고", field: 'stockQty', hide: true },
        { headerName: "상품코드", field: 'productCode', hide: true },
      ],
      loading: false,
    }

  },

  created() {
    this.getOrders()
  },

  methods: {
    onGridReady(params) {
      this.gridApi = params.api;
      // this.gridApi.sizeColumnsToFit();
    },

    dateFormat(value, format) {
      return userDateUtils.dateFormat(value, format);
    },

    async getOrders() {
      let result =
          await axios.get(`${ajaxUrl}/production/plan/orders${this.searchProduct?.product_code && '?product_code=' + this.searchProduct.product_code}`)
              .catch(err => console.log(err));
      this.orders = result.data
      this.rowData = []

      if(!this.orders.length) {
        return
      }

      this.orders.forEach((order) => {
        order.order_date = this.dateFormat(order.order_date, 'yyyy-MM-dd')
        order.due_date = this.dateFormat(order.due_date, 'yyyy-MM-dd')
      })

      let keys = []
      this.columnDefs.forEach((col) => {
        keys.push(col.field)
      })

      this.rowData = []
      this.orders.forEach((order, idx) => {
        this.rowData[idx] = {
          [keys[0]]: order.order_num,
          [keys[1]]: order.order_date,
          [keys[2]]: order.due_date,
          [keys[3]]: order.product_name,
          [keys[4]]: order.order_amount,
          [keys[5]]: order.plan_qty,
          [keys[6]]: order.unplanned_qty < 0 ? 0 : order.unplanned_qty,
          [keys[7]]: '재고',
          [keys[8]]: order.product_code
        }
      })
    },

    openModal() {
      this.isShowModal = !this.isShowModal
    },

    confirm() {
      this.searchProduct = this.selectedProduct
      this.getOrders()
      this.closeModal()
    },

    findOrdersAll() {
      this.searchProduct = {
        product_code: '',
        product_name: '',
      }

      this.getOrders()
    },

    async onRowClicked(row) {
      let order = row.data
      order.stockQty = await this.getProductStock(order.productCode)

      if (!this.selectedOrders.some(selectedOrder => selectedOrder.orderNum === order.orderNum)) {
        this.selectedOrders.push(order);
      } else {
        this.selectedOrders = this.selectedOrders.filter((selectedOrder) => selectedOrder.orderNum !== order.orderNum)
      }

      this.$emit('selectOrders', this.selectedOrders)
    },

    async getProductStock(productCode) {
      let result =
          await axios.get(`${ajaxUrl}/production/plan/stock/${productCode}`)
              .catch(err => console.log(err));
      return result.data.stock
    },

    closeModal() {
      this.isShowModal = false
    },

    selectProduct(product) {
      this.selectedProduct = product
    },
  },
}
</script>



<style lang="scss" scoped>
.container-fluid {
  padding: 0;
  .search-container {
    display: flex;
    height: 50px;
    align-content: center;
    h4 {
      width: 120px;
      margin-right: 12px;
      line-height: 40px;
    }
    input {
      background-color: transparent;
    }
    .button {
      height: 40px;
      margin-left: 20px;
      font-size: 16px;
    }

  }
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
}
.ag-row.selected {
  background-color: red;
}

</style>