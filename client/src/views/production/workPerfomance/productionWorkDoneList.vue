<template>
  <div class="container-fluid py-4">
    <div class="pb-4">
      <h3>공정 실적</h3>
    </div>
    <div class="main-container mt-4">
      <div class="content">
        <form class="row gx-3 gy-2 align-items-center">
          <div class="col-sm-2">
            <label class="col-form-label fw-bold" for="order">생산지시</label>
            <input type="text" readonly @click="openModal('order')" :value="searchProdOrder.production_order_name" class="form-control cursor-pointer" style="background-color: white; padding-left: 20px;" id="order">
          </div>
          <div class="col-sm-2">
            <label class="col-form-label fw-bold" for="process">공정</label>
            <input type="text" readonly @click="openModal('process')" :value="searchProcess.process_name" class="form-control cursor-pointer" style="background-color: white; padding-left: 20px;" id="process">
          </div>
          <div class="col-sm-2">
            <label class="col-form-label fw-bold" for="product">제품</label>
            <input type="text" readonly @click="openModal('product')" :value="searchProduct.product_name" class="form-control cursor-pointer" style="background-color: white; padding-left: 20px;" id="product">
          </div>
        </form>
        <div class="col-auto mt-5 text-center">
          <button type="button" class="btn me-5 fs-6 btn-success" @click="search">조회</button>
          <button type="button" class="btn btn-warning fs-6" @click="resetFilter">초기화</button>
        </div>
      </div>
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
    <Modal
        :isShowModal="isShowModal"
        :modalTitle="modalTitle"
        :noBtn="'닫기'"
        :yesBtn="'선택'"
        :width="modalType === 'order' ? 800 : 400"
        @closeModal="closeModal"
        @confirm="confirm"
    >
      <template v-slot:list>
        <ModalProdOrderList v-show="isShowModal && modalType === 'order'" @selectCompletedOrder="selectCompletedOrder"/>
        <ModalProcessList v-show="isShowModal && modalType === 'process'" @selectProcess="selectProcess"/>
        <ModalWorkCompletedProduct v-show="isShowModal && modalType === 'product'" @selectProduct="selectProduct"></ModalWorkCompletedProduct>
      </template>
    </Modal>
  </div>
</template>
<script>
import theme from "@/utils/agGridTheme";
import axios from "axios";
import {ajaxUrl} from "@/utils/commons";
import userDateUtils from "@/utils/useDates";
import Modal from "@/views/natureBlendComponents/modal/Modal.vue";
import ModalProdOrderList from "@/views/production/workPerfomance/ModalProdOrderList.vue";
import ModalProcessList from "@/views/production/workPerfomance/ModalProcessList.vue";
import ModalWorkCompletedProduct from "@/views/production/workPerfomance/ModalWorkCompletedProduct.vue";

export default {
  name: "ProductionOrderList",
  components: {ModalWorkCompletedProduct, ModalProcessList, ModalProdOrderList, Modal},

  data() {
    return {
      modalTitle: '완료 생산지시 목록',
      isShowModal: false,
      listSearch: '',
      rowData: [],
      columnDefs: [
        { headerName: "No.", field: 'no', cellStyle: { textAlign: 'right' }, flex: 1},
        { headerName: "생산지시번호", field: 'production_order_num', cellStyle: { textAlign: 'right' }, flex: 2},
        { headerName: "공정명", field: 'process_name', flex: 2 },
        { headerName: "제품명", field: 'product_name', flex: 2 },
        { headerName: "설비명", field: 'machine_name', flex: 2 },
        { headerName: "작업자", field: 'emp_name', flex: 2 },
        { headerName: "생산량(개)", field: 'production_qty', cellStyle: { textAlign: 'right' }, flex: 2},
        { headerName: "불량량(개)", field: 'fail_qty', cellStyle: { textAlign: 'right' }, flex: 2},
        { headerName: "합격량(개)", field: 'success_qty', cellStyle: { textAlign: 'right' }, flex: 2 },
        { headerName: "작업시작시간", field: 'partial_process_start_time', cellStyle: { textAlign: 'center' }, flex: 3 },
        { headerName: "작업완료시간", field: 'partial_process_end_time', cellStyle: { textAlign: 'center' }, flex: 3},
      ],
      selectedProdOrder: {},
      searchProdOrder: {},
      selectedProcess: {},
      searchProcess: {},
      modalType: 'order', // process, product
      selectedProduct: {},
      searchProduct: {}
    }
  },

  computed: {
    theme() {
      return theme
    }
  },

  created() {
    this.getWorkDoneList()
  },

  methods: {
    resetFilter() {
      this.searchProdOrder = {}
      this.searchProcess = {}
      this.searchProduct = {}

      this.getWorkDoneList()
    },

    search() {
      let listInfo = {
        prodOrderNum: this.searchProdOrder.production_order_num,
        processCode: this.searchProcess.process_code,
        productCode: this.searchProduct.product_code,
      }
      this.getWorkDoneList(listInfo)
    },

    selectCompletedOrder(order) {
      this.selectedProdOrder = order
    },

    selectProcess(process) {
      this.selectedProcess = process
    },

    selectProduct(product) {
      this.selectedProduct = product
    },

    confirm() {
      if(this.modalType === 'order') {
        this.searchProdOrder = this.selectedProdOrder
      } else if(this.modalType === 'process'){
        this.searchProcess = this.selectedProcess
      } else {
        this.searchProduct = this.selectedProduct
      }

      this.closeModal()
    },

    closeModal() {
      this.isShowModal = false
    },

    openModal(type) {
      this.modalType = type

      this.modalTitle = type === 'order' ? '완료 생산지시 목록' : type === 'process' ? '공정 목록' : '제품 목록'

      this.isShowModal = !this.isShowModal
    },

    onReady(){
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
        inputText1.style.left = '20px';

        inputText1.addEventListener('input', (event) => {
          this.listSearch = event.target.value;
        });

        container1.appendChild(inputText1);
        paginationPanel.insertBefore(container1, paginationPanel.firstChild);
      }
    },

    dateFormat(value, format) {
      return userDateUtils.dateFormat(value, format);
    },

    async getWorkDoneList(params) {
      let result = null

      if(params) {
        result = await axios.get(`${ajaxUrl}/production/work/done?prodOrderNum=${params.prodOrderNum || ''}&processCode=${params.processCode || ''}&productCode=${params.productCode || ''}`)
            .catch(err => console.log(err));
      } else {
        result = await axios.get(`${ajaxUrl}/production/work/done`)
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

      result.data.forEach((data, idx) => {
        this.rowData[idx] = {
          [keys[0]]: data[keys[0]],
          [keys[1]]: data[keys[1]],
          [keys[2]]: data[keys[2]],
          [keys[3]]: data[keys[3]],
          [keys[4]]: data[keys[4]],
          [keys[5]]: data[keys[5]],
          [keys[6]]: data[keys[7]] + data[keys[8]],
          [keys[7]]: data[keys[7]],
          [keys[8]]: data[keys[8]],
          [keys[9]]: this.dateFormat(data[keys[9]], 'yyyy-MM-dd hh:mm:ss'),
          [keys[10]]: this.dateFormat(data[keys[10]], 'yyyy-MM-dd hh:mm:ss'),
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