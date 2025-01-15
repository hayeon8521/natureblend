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
                    설비번호
                  </th>
                  <th
                      class="text-uppercase text-secondary text-md font-weight-bolder opacity-7 ps-2"
                  >
                    설비이름
                  </th>
                </tr>
                </thead>
                <tbody>
                <tr
                    v-for="machine in machineList"
                    :key="machine.machine_num"
                    class="machine"
                    :class="{ selected: selectedMachineNum === machine.machine_num }"
                    @click="selectMachine(machine)"
                >
                  <td>
                    <div class="d-flex px-2">
                      <div class="my-auto">
                        <h6 class="mb-0 text-sm">{{ machine.machine_num }}</h6>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p class="text-sm font-weight-bold mb-0">{{ machine.machine_name }}</p>
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
  name: "ModalWorkingMachineList",

  props: {
    processCode: String,
  },

  data() {
    return {
      machineList: [],
      selectedMachineNum: 0
    }
  },

  created() {
    this.getMachineList()
  },

  methods: {
    async getMachineList() {
      if(!this.processCode) {
        return
      }

      let result =
          await axios.get(`${ajaxUrl}/production/work/machine/${this.processCode}`)
              .catch(err => console.log(err));
      this.machineList = result.data
    },

    selectMachine(machine) {
      this.selectedMachineNum = machine.machine_num
      this.$emit('selectMachine', machine)
    },
  }
}
</script>


<style scoped lang="scss">
.card {
  box-shadow: none;
}

.machine:hover {
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