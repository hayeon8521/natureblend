<template>
  <div>
    <div class="container-fluid">
      <div class="row w-100">
        <div class="col-12">
          <div class="card">
            <div class="card-body px-0">
              <div class="table-responsive p-0">
                <table
                    class="table align-items-center justify-content-center mb-0"
                >
                  <thead>
                  <tr>
                    <th
                        class="text-uppercase text-center text-secondary text-md font-weight-bolder opacity-7"
                    >
                      생산지시 코드
                    </th>
                    <th
                        class="text-uppercase text-center text-secondary text-md font-weight-bolder opacity-7 ps-2"
                    >
                      생산지시명
                    </th>
                    <th
                        class="text-uppercase text-center text-secondary text-md font-weight-bolder opacity-7 ps-2"
                    >
                      작업일자
                    </th>
                    <th
                        class="text-uppercase text-center text-secondary text-md font-weight-bolder opacity-7 ps-2"
                    >
                      제품명
                    </th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr
                      v-for="completedOrder in completedOrderList"
                      :key="completedOrder.production_order_num"
                      class="working-order"
                      :class="{ selected: selectedCompletedOrderNum === completedOrder.production_order_num }"
                      @click="selectOrder(completedOrder)"
                  >
                    <td>
                      <h6 class="mb-0 text-end text-sm">{{ completedOrder.production_order_num }}</h6>
                    </td>
                    <td>
                      <p class="text-sm font-weight-bold mb-0">{{ completedOrder.production_order_name }}</p>
                    </td>
                    <td>
                      <p class="text-sm text-center font-weight-bold mb-0">{{ dateFormat(completedOrder.work_date, 'yyyy-MM-dd') }}</p>
                    </td>
                    <td>
                      <p class="text-sm font-weight-bold mb-0">{{ completedOrder.product_name }}</p>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import {ajaxUrl} from "@/utils/commons";
import userDateUtils from "@/utils/useDates";

export default {
  name: "ModalProdOrderList",

  data() {
    return {
      completedOrderList: [],
      selectedCompletedOrderNum: ''
    }
  },

  created() {
    this.getCompletedOrderList()
  },

  methods: {
    dateFormat(value, format) {
      return userDateUtils.dateFormat(value, format);
    },

    async getCompletedOrderList() {
      let result =
          await axios.get(`${ajaxUrl}/production/work/completedorders`)
              .catch(err => console.log(err));
      this.completedOrderList = result.data
    },

    selectOrder(order) {
      this.selectedCompletedOrderNum = order.production_order_num
      this.$emit('selectCompletedOrder', order)
    },
  }
}
</script>



<style scoped lang="scss">
.card {
  box-shadow: none;
}
.working-order:hover {
  background-color: $main3;
  cursor: pointer;
  transition: all .1s ease-in-out;
  h6, p {
    color: $white;
  }

}
.selected {
  background-color: $main1;
  h6, p {
    color: $white;
  }
}
</style>