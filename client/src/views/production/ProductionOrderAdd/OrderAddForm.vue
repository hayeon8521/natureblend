<template>
  <div class="input-container">
    <div class="input-content">
      <h6>생산계획 코드</h6>
      <div class="input-group w-auto h-25">
        <input type="text" @click="openModal('plan')" :value="searchPlan.plan_num" readonly class="form-control border p-2 cursor-pointer" placeholder="생산계획 코드">
      </div>
    </div>
    <div class="input-content">
      <h6>제품명</h6>
      <div class="input-group w-auto h-25">
        <input type="text" :value="searchProduct" readonly class="form-control border p-2" />
      </div>
    </div>
    <div class="input-content">
      <h6>생산지시명</h6>
      <div class="input-group w-auto h-25">
        <input type="text" v-model="orderInfo.prodOrderName" class="form-control border p-2"/>
      </div>
    </div>
    <div class="input-content">
      <h6>지시수량</h6>
      <div class="input-group w-auto h-25">
        <input
            type="number"
            v-model="orderInfo.prodOrderQty"
            class="form-control border p-2"
            @focusout="checkQty"
        />
      </div>
      <p class="max-qty">* 최대수량: {{ searchPlan.total_plan_qty }}</p>
    </div>
    <div class="input-content ">
      <h6>작업일자</h6>
      <div class="input-group w-auto h-25">
        <input type="date" v-model="orderInfo.workDate" class="form-control border p-2" />
      </div>
    </div>
    <div class="input-content ">
      <h6>등록인</h6>
      <div class="input-group w-auto h-25">
        <input readonly @click="openModal('emp')" :value="searchEmp.name" class="form-control border p-2 cursor-pointer" />
      </div>
    </div>
    <div class="input-content ">
      <h6>공정흐름도</h6>
      <div v-if="!processFlow.length" class="input-group w-auto h-25">
        <input type="text" readonly class="form-control border p-2" />
      </div>
      <div v-else class="flow-con">
        <div v-for="(process, idx) in processFlow" :key="process.process_sequence" class="input-group w-auto h-25">
          <input type="text" readonly :value="process.process_name" class="form-control border p-2" />
          <i v-show="idx < processFlow.length - 1" class="fas fa-arrow-circle-down"></i>
        </div>

      </div>

    </div>
    <Modal
        :isShowModal="isShowModal"
        :modalTitle="modalTitle"
        :noBtn="'닫기'"
        :yesBtn="'선택'"
        :width="modalType === 'plan' ? 1100 : 500"
        @closeModal="closeModal"
        @confirm="confirm"
    >
      <template v-slot:list>
        <PlanList v-show="isShowModal && modalType === 'plan'" @selectPlan="selectPlan"/>
        <EmpList v-show="isShowModal && modalType === 'emp'" @selectEmp="selectEmp"/>
      </template>
    </Modal>
  </div>
</template>
<script>
import PlanList from "@/views/production/ProductionOrderAdd/ModalPlanList.vue";
import Modal from "@/views/natureBlendComponents/modal/Modal.vue";
import axios from "axios";
import {ajaxUrl} from "@/utils/commons";
import EmpList from "@/views/production/productionPlanAdd/ModalEmpList.vue";
// import isNumber from "@/utils/numberCheck";

export default {
  name: "OrderInputForm",
  components: {EmpList, Modal, PlanList},

  props: {
    isOrderAddFormReset: Boolean
  },

  data() {
    return {
      searchPlan: {},
      orderInfo: {
        prodOrderName: '',
        planNum: 0,
        productCode: '',
        workDate: '',
        prodOrderQty: 1,
        empNum: 0
      },

      isShowModal: false,
      modalTitle: '생산계획 목록',
      selectedPlan: {},
      searchProduct: '',

      processFlow: [],
      rowDataNeed: [],
      materialCodes: [],
      rowDataStock: [],
      modalType: 'plan',
      searchEmp: {},
    }
  },

  methods: {
    async getMaterialStock() {
      let result =
          await axios.post(`${ajaxUrl}/production/order/stock`, {materialCodes: JSON.stringify(this.materialCodes)})
              .catch(err => console.log(err));
      let materialList = result.data

      materialList.forEach((item) => {
        let row = {
          stockLotSeq: item.lot_seq,
          stockLot: item.lot_code,
          stockMaterialName: item.material_name,
          stockMaterialCode: item.material_code,
          stockAmount: item.stok_qty - (item.invalid_qty === null ? 0 : item.invalid_qty),
          expiryDate: item.limit_date.split('T')[0]
        }
        this.rowDataStock.push(row)
      })

      this.$emit('setRowDataStock', this.rowDataStock)
    },

    selectEmp(emp) {
      this.selectedEmp = emp
    },

    async getBom(productCode) {
      let result =
          await axios.get(`${ajaxUrl}/production/order/bom/${productCode}`)
              .catch(err => console.log(err));
      let bom = result.data

      this.materialCodes = []

      bom.forEach((item) => {
        let row = {needMaterialName: item.material, needAmount: item.material_con}
        this.rowDataNeed.push(row)

        this.materialCodes.push(item.material_code)
      })

      this.$emit('setRowDataNeed', this.rowDataNeed)
    },

    async getProcessFlow(productCode) {
      let result =
          await axios.get(`${ajaxUrl}/production/order/processflow/${productCode}`)
              .catch(err => console.log(err));
      this.processFlow = result.data
      this.$emit('getProcessFlow', this.processFlow)
    },

    selectPlan(plan) {
      this.selectedPlan = plan
    },

    checkQty() {
      if(this.orderInfo.prodOrderQty > this.selectedPlan.total_plan_qty) {
        this.$notify({
          text: "최대수량을 초과했습니다.",
          type: 'error',
        });
      }
    },

    async confirm() {
      if(this.modalType === 'plan') {
        this.searchPlan = this.selectedPlan
        this.$emit('getSearchPlan', this.searchPlan)

        this.searchProduct = this.searchPlan.product_name

        this.getProcessFlow(this.searchPlan.product_code)
        await this.getBom(this.searchPlan.product_code)
        await this.getMaterialStock()

        this.orderInfo.planNum = this.searchPlan.plan_num
        this.orderInfo.productCode = this.searchPlan.product_code
      } else {
        this.searchEmp = this.selectedEmp

        this.orderInfo.empNum = this.searchEmp.emp_num
      }

      this.closeModal()
    },

    openModal(type) {
      if(type === 'plan') {
        this.modalTitle = '생산계획 목록'
      } else {
        this.modalTitle = '직원 목록'
      }

      this.modalType = type
      this.isShowModal = !this.isShowModal
    },

    closeModal() {
      this.isShowModal = false
    },
  },

  watch: {
    'orderInfo.prodOrderQty': {
      handler() {
        setTimeout(() => {
          this.$emit('updateNeedStock')
        }, 10)
      },
      deep: true
    },

    orderInfo: {
      handler() {
        this.$emit('updateInputData', this.orderInfo)
      },
      deep: true
    },

    isOrderAddFormReset: {
      handler() {
        if(this.isOrderAddFormReset) {
          this.orderInfo = {
            prodOrderName: '',
            planNum: 0,
            productCode: '',
            workDate: '',
            prodOrderQty: 1,
            empNum: 0
          }
          this.searchPlan = {}
          this.searchProduct = ''
          this.searchEmp = {}
          this.processFlow = []
        }
      },
    }
  }
}
</script>



<style scoped lang="scss">
.input-container {

  .input-content {
    position: relative;
    display: flex;
    align-content: center;
    margin-bottom: 8px;
    .flow-con {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      i {
        width: 100%;
        text-align: center;
        position: absolute;
        top: 40px;
        z-index: 1;
      }
    }
    .max-qty {
      position: absolute;
      top: 32px;
      left: 8px;
      font-size: 12px;
      color: $red1;
    }
    > h6 {
      width: 100px;
      margin-right: 8px;
      font-size: 16px;
      margin-bottom: 0;
      line-height: 44px;
    }
    .order-num-input {
      position: relative;
      > span {
        position: absolute;
        right: -40px;
        bottom: 8px;
        width: 30px;
        height: 30px;
        background-color: $gray-600;
        border-radius: 50%;
        padding: 4px;
        color: $white;
        line-height: 23px;
        cursor: pointer;
      }
    }
    .order-num-container {
      display: flex;
      flex-direction: column;
    }
    button {
      height: 40px;
      font-size: 12px;
    }

  }
  input {
    background-color: $white;
    width: 180px !important;
    border-radius: 8px;
    &:read-only {
      background-color: $gray-100;
    }

  }
}
</style>