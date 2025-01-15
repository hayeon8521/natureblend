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
                      공정코드
                    </th>
                    <th
                        class="text-uppercase text-center text-secondary text-md font-weight-bolder opacity-7 ps-2"
                    >
                      공정이름
                    </th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr
                      v-for="process in processList"
                      :key="process.process_code"
                      class="working-order"
                      :class="{ selected: selectedProcessCode === process.process_code }"
                      @click="selectProcess(process)"
                  >
                    <td>
                      <h6 class="mb-0 text-center text-sm">{{ process.process_code }}</h6>
                    </td>
                    <td>
                      <p class="text-sm font-weight-bold mb-0">{{ process.process_name }}</p>
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

export default {
  name: "ModalProcessList",

  data() {
    return {
      processList: [],
      selectedProcessCode: ''
    }
  },

  created() {
    this.getProcessList()
  },

  methods: {
    async getProcessList() {
      let result =
          await axios.get(`${ajaxUrl}/production/work/process`)
              .catch(err => console.log(err));
      this.processList = result.data
    },

    selectProcess(process) {
      this.selectedProcessCode = process.production_order_num
      this.$emit('selectProcess', process)
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