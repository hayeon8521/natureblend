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
                      class="text-uppercase text-center text-secondary text-md font-weight-bolder opacity-7"
                  >
                    사원번호
                  </th>
                  <th
                      class="text-uppercase text-center text-secondary text-md font-weight-bolder opacity-7 ps-2"
                  >
                    이름
                  </th>
                </tr>
                </thead>
                <tbody>
                <tr
                    v-for="emp in empList"
                    :key="emp.emp_num"
                    class="emp"
                    :class="{ selected: selectedEmpNum === emp.emp_num }"
                    @click="selectEmp(emp)"
                >
                  <td class="w-50">
                    <h6 class="mb-0 text-end text-sm">{{ emp.emp_num }}</h6>
                  </td>
                  <td class="w-50">
                    <p class="text-sm text-center font-weight-bold mb-0">{{ emp.name }}</p>
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

export default {
  name: "ModalWorkingWorkerList",

  data() {
    return {
      empList: [],
      selectedEmpNum: 0
    }
  },

  created() {
    this.getEmpList()
  },

  methods: {
    async getEmpList() {
      let result =
          await axios.get(`${ajaxUrl}/production/work/emp`)
              .catch(err => console.log(err));
      this.empList = result.data
    },

    selectEmp(emp) {
      this.selectedEmpNum = emp.emp_num
      this.$emit('selectEmp', emp)
    },
  }
}
</script>



<style scoped lang="scss">
.card {
  box-shadow: none;
}
.emp:hover {
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