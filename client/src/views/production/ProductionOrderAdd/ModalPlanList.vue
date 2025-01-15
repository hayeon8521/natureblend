<template>
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
                      class="text-uppercase text-secondary text-md font-weight-bolder opacity-7"
                  >
                    생산계획번호
                  </th>
                  <th
                      class="text-uppercase text-secondary text-md font-weight-bolder opacity-7 ps-2"
                  >
                    생산계획명
                  </th>
                  <th
                      class="text-uppercase text-secondary text-md font-weight-bolder opacity-7 ps-2"
                  >
                    계획시작일자
                  </th>
                  <th
                      class="text-uppercase text-secondary text-md font-weight-bolder opacity-7 ps-2"
                  >
                    계획종료일자
                  </th>
                  <th
                      class="text-uppercase text-secondary text-md font-weight-bolder opacity-7 ps-2"
                  >
                    제품코드
                  </th>
                  <th
                      class="text-uppercase text-secondary text-md font-weight-bolder opacity-7 ps-2"
                  >
                    제품명
                  </th>
                  <th
                      class="text-uppercase text-secondary text-md font-weight-bolder opacity-7 ps-2"
                  >
                    계획수량
                  </th>

                </tr>
                </thead>
                <tbody>
                <tr
                    v-for="(plan) in planList"
                    :key="plan.rownum"
                    class="plan"
                    :class="{ selected: selectedNum === plan.rownum, 'bold-border': plan.rownum_by_plan === 1 }"
                    @click="selectPlan(plan)"
                >
                  <td>
                    <div class="d-flex justify-content-end px-2">
                      <h6 class="mb-0 text-sm">{{ plan.plan_num }}</h6>
                    </div>
                  </td>
                  <td>
                    <p class="text-sm font-weight-bold mb-0">{{ plan.plan_name }}</p>
                  </td>
                  <td>
                    <p class="text-sm text-center font-weight-bold mb-0">{{ dateFormat(plan.plan_start_date, 'yyyy-MM-dd') }}</p>
                  </td>
                  <td>
                    <p class="text-sm text-center font-weight-bold mb-0">{{ dateFormat(plan.plan_end_date, 'yyyy-MM-dd') }}</p>
                  </td>
                  <td>
                    <p class="text-sm font-weight-bold mb-0">{{ plan.product_code }}</p>
                  </td>
                  <td>
                    <p class="text-sm font-weight-bold mb-0">{{ plan.product_name }}</p>
                  </td>
                  <td>
                    <p class="text-sm text-end font-weight-bold mb-0">{{ plan.total_plan_qty }}</p>
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
</template>

<script>

import axios from "axios";
import {ajaxUrl} from "@/utils/commons";
import userDateUtils from "@/utils/useDates";

export default {
  name: "PlanList",

  props: {

  },

  data() {
    return {
      planList: [],
      selectedNum: ''
    }
  },

  created() {
    this.getPlanList()
  },

  methods: {
    dateFormat(value, format) {
      return userDateUtils.dateFormat(value, format);
    },

    async getPlanList() {
      let result =
          await axios.get(`${ajaxUrl}/production/order/plans`)
              .catch(err => console.log(err));
      this.planList = result.data
    },

    selectPlan(plan) {
      this.selectedNum = plan.rownum
      this.$emit('selectPlan', plan)
    },
  }
}
</script>



<style scoped lang="scss">
.card {
  box-shadow: none;
}
.plan:hover {
  background-color: $main3;
  cursor: pointer;
  transition: all .1s ease-in-out;
  h6, p {
    color: $white;
  }
}
.bold-border {
  border-top: 1px solid $gray-900 !important;
}
tr {
  border-style: dotted !important;
}
.selected {
  background-color: $main1;
  h6, p {
    color: $white;
  }
}
</style>