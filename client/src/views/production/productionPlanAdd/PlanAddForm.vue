<template>
  <div>
    <div class="add-top mt-4">
      <h4>생산계획 등록</h4>
      <span>* 위의 주문을 클릭 시 생산계획에 추가됩니다.</span>
      <material-button size="sm" color="success" class="button" @click="addPlan">등록</material-button>
    </div>
    <div class="main-container">
      <div class="table-responsive p-0">
        <table

            class="table align-items-center justify-content-center mb-0"
        >
          <thead>
          <tr>
            <th v-for="col in cols" :key="col"
                class="text-uppercase text-secondary text-md font-weight-bolder text-center"
            >
              {{ col }}
            </th>
          </tr>
          </thead>

          <tbody v-show="!selectedOrders.length" class="no-data">
           <tr><td :colspan="cols.length"></td></tr>
          </tbody>
          <tbody v-show="selectedOrders.length">
          <tr v-for="order in selectedOrders" :key="order.orderNum">
            <td>
              <p class="mb-0 text-sm text-end">{{ order.orderNum }}</p>
            </td>
            <td>
              <p class="mb-0 text-sm text-center">{{ order.orderDate }}</p>
            </td>
            <td>
              <p class="mb-0 text-sm text-center">{{ order.dueDate }}</p>
            </td>
            <td>
              <p class="mb-0 text-sm">{{ order.productName }}</p>
            </td>
            <td>
              <p class="mb-0 text-sm text-end">{{ order.orderQty }}</p>
            </td>
            <td>
              <p class="mb-0 text-sm text-end">{{ order.plannedQty }}</p>
            </td>
            <td>
              <p class="mb-0 text-sm text-end">{{ order.unplannedQty }}</p>
            </td>
            <td class="plan-qty-group input-group w-50 h-25 text-end m-lg-auto" :class="{ 'plan-input': !order.planQty  }" >
              <input type="number" autocomplete="off" class="plan-qty mb-0 text-sm text-end form-control border p-2 cursor-pointer" v-model="order.planQty"/>
            </td>
            <td>
              <p class="mb-0 text-sm text-end">{{ order.stockQty }}</p>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="input-container">
        <div class="input-content">
          <h6>생산계획명</h6>
          <div class="input-group w-auto h-25">
            <input type="text" autocomplete="off" class="form-control border p-2" v-model="planName"/>
          </div>
        </div>
        <div class="input-content">
          <h6>계획시작일자</h6>
          <div class="input-group w-auto h-25">
            <input type="date" autocomplete="off" class="form-control border p-2" v-model="planStartDate"/>
          </div>
        </div>
        <div class="input-content">
          <h6>계획종료일자</h6>
          <div class="input-group w-auto h-25">
            <input type="date" autocomplete="off" class="form-control border p-2" v-model="planEndDate"/>
          </div>
        </div>
        <div class="input-content ">
          <h6>등록인</h6>
          <div class="input-group w-auto h-25">
            <input type="text" @click="openModal" autocomplete="off" :value="searchEmp.name" readonly class="form-control border p-2 emp" />
          </div>
        </div>
      </div>
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
        <EmpList @selectEmp="selectEmp"/>
      </template>
    </Modal>
  </div>

</template>
<script>
import MaterialButton from "@/components/MaterialButton.vue";
import axios from "axios";
import {ajaxUrl} from "@/utils/commons";
import Modal from "@/views/natureBlendComponents/modal/Modal.vue";
import EmpList from "@/views/production/productionPlanAdd/ModalEmpList.vue";

export default {
  name: "PlanAddForm" ,
  components: {EmpList, Modal, MaterialButton},
  props: {
    selectedOrders: Array,
  },

  data() {
    return {
      planName: '',
      productStock: null,
      planStartDate: '',
      planEndDate: '',
      planCreator: '',
      isShowModal: false,
      modalTitle: '직원 목록',
      searchEmp: {},
      selectedEmp: {},
      cols: ['주문번호', '주문일자', '납기일자', '제품명', '주문량(개)', '기계획량(개)', '미계획량(개)', '현계획량(개)', '재고(개)']
    }
  },

  methods: {
    selectEmp(emp) {
      this.selectedEmp = emp
    },

    openModal() {
      this.isShowModal = !this.isShowModal
    },

    async addPlan() {
      if(!this.selectedOrders.length) {
        this.$notify({
          text: "주문을 선택해주세요.",
          type: 'error',
        });
        return
      }

      if(this.selectedOrders.filter((order) => !order.planQty).length) {
        this.$notify({
          text: "주문별 현계획량을 입력해주세요.",
          type: 'error',
        });
        return
      }

      if(!this.planName || !this.planStartDate || !this.planEndDate || !this.planName) {
        this.$notify({
          text: "입력칸을 채워주세요.",
          type: 'error',
        });
        return
      }

      let orderNums = []
      let productCodes = []
      let planQtys = []
      this.selectedOrders.forEach((order) => {
        orderNums.push(order.orderNum)
        productCodes.push(order.productCode);
        planQtys.push(order.planQty)
      })

      let planInfo = {
        orderNums: JSON.stringify(orderNums),
        planName: this.planName,
        productCode: JSON.stringify(productCodes),
        planQty: JSON.stringify(planQtys),
        planStartDate: this.planStartDate,
        planEndDate: this.planEndDate,
        empNum: this.selectedEmp.emp_num,
      }

      let result =
          await axios.post(`${ajaxUrl}/production/plan`, planInfo)
              .catch(err => console.log(err));

      if(result.data.message === 'success') {
        this.$notify({
          text: `${this.planName}이 등록되었습니다.`,
          type: 'success',
        });

        this.planName = ''
        this.planStartDate = ''
        this.planEndDate = ''
        this.searchEmp = {}
        this.$emit('resetSelectedOrders')
      }
    },

    confirm() {
      this.searchEmp = this.selectedEmp
      this.closeModal()
    },

    closeModal() {
      this.isShowModal = false
    },
  },

  watch: {

  }
}
</script>



<style lang="scss" scoped>
.add-top {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-content: center;
  button {
    height: 40px;
    font-size: 16px;
  }
  > span {
    position: absolute;
    left: 150px;
    top: 6px;
    font-size: 16px;
    font-weight: 700;
    margin-left: 12px;
  }
}
.main-container {
  justify-content: space-between;
  width: 100%;
  padding: 40px;
  border-radius: 8px;
  background-color: $gray-200;
  margin-top: 12px;
  .table-responsive {
    background-color: $gray-100;
    margin-bottom: 40px;
    border-radius: 8px;
    thead {
      background-color: #EE9900;
      tr, th {
        color: #fff !important;
      }
    }
    tbody p {
      font-weight: 400;
      color: #222
    }
    .no-data{
      td {
        text-align: center;
        height: 80px;
        font-weight: 800;
      }
    }
    .plan-qty-group {
      position: relative;
      .plan-qty {
        background-color: #fff;
        padding-left: 30px;
      }
    }
    .plan-input::before {
      content: "";
      background-image: url('http://yeonsus.com/academy/cell-modify-icon.png');
      background-size: contain; /* 아이콘이 잘리지 않도록 크기 조절 */
      background-repeat: no-repeat;
      width: 20px; /* 아이콘 크기 */
      height: 20px; /* 아이콘 크기 */
      position: absolute;
      left: 20px; /* 아이콘 위치 조정 */
      top: 50%;
      transform: translateY(-50%);
      z-index: 1;
    }
  }
  .input-container {
    display: flex;
    width: 100%;
    justify-content: space-between;
    .input-content {
      position: relative;
      display: flex;
      align-content: center;
      margin-bottom: 8px;

      > h6 {
        width: 100px;
        margin-right: 8px;
        font-size: 16px;
        margin-bottom: 0;
        line-height: 44px;
        &.orderNum {
          width: 80px;
        }
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
      &:read-only {
        background-color: $gray-100;
      }
      &.emp {
        cursor: pointer;
      }
    }
  }
}
</style>