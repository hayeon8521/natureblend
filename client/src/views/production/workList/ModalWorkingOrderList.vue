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
                    <th
                        class="text-uppercase text-center text-secondary text-md font-weight-bolder opacity-7 ps-2"
                    >
                      지시수량(개)
                    </th>
<!--                    <th-->
<!--                        class="text-uppercase text-secondary text-md font-weight-bolder opacity-7 ps-2"-->
<!--                    >-->
<!--                      생산수량-->
<!--                    </th>-->
                  </tr>
                  </thead>
                  <tbody>
                  <tr
                      v-for="workingOrder in workingOrderList"
                      :key="workingOrder.production_order_num"
                      class="working-order"
                      :class="{ selected: selectedWorkingOrderNum === workingOrder.production_order_num }"
                      @click="selectOrder(workingOrder)"
                  >
                    <td>
                      <h6 class="mb-0 text-end text-sm">{{ workingOrder.production_order_num }}</h6>
                    </td>
                    <td>
                      <p class="text-sm font-weight-bold mb-0">{{ workingOrder.production_order_name }}</p>
                    </td>
                    <td>
                      <p class="text-sm text-center font-weight-bold mb-0">{{ workingOrder.work_date }}</p>
                    </td>
                    <td>
                      <p class="text-sm font-weight-bold mb-0">{{ workingOrder.product_name }}</p>
                    </td>
                    <td>
                      <p class="text-sm text-end font-weight-bold mb-0">{{ workingOrder.production_order_qty }}</p>
                    </td>
<!--                    <td>-->
<!--                      <p class="text-sm font-weight-bold mb-0">생산수량(진행전이나 진행중일 때)개</p>-->
<!--                    </td>-->
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

export default {
  name: "ModalProdOrderList",

  data() {
    return {
      workingOrderList: [],
      selectedWorkingOrderNum: ''
    }
  },

  created() {
    this.getWorkingOrderList()
  },

  methods: {
    async getWorkingOrderList() {
      let result =
          await axios.get(`${ajaxUrl}/production/work/activeorders`)
              .catch(err => console.log(err));
      this.workingOrderList = result.data
    },

    selectOrder(order) {
      this.selectedWorkingOrderNum = order.production_order_num
      this.$emit('selectWorkingOrder', order)
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