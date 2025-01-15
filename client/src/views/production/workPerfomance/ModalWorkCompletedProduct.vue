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
                      제품코드
                    </th>
                    <th
                        class="text-uppercase text-center text-secondary text-md font-weight-bolder opacity-7 ps-2"
                    >
                      제품명
                    </th>
                    <th
                        class="text-uppercase text-center text-secondary text-md font-weight-bolder opacity-7 ps-2"
                    >
                      용량(ml)
                    </th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr
                      v-for="product in productList"
                      :key="product.product_code"
                      class="working-order"
                      :class="{ selected: selectedProductCode === product.product_code }"
                      @click="selectProduct(product)"
                  >
                    <td>
                      <h6 class="mb-0 text-center text-sm">{{ product.product_code }}</h6>
                    </td>
                    <td>
                      <p class="text-sm font-weight-bold mb-0">{{ product.product_name }}</p>
                    </td>
                    <td>
                      <p class="text-sm text-end font-weight-bold mb-0">{{ product.capacity }}</p>
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
  name: "ModalWorkCompletedProduct",

  data() {
    return {
      productList: [],
      selectedProductCode: ''
    }
  },

  created() {
    this.getProductList()
  },

  methods: {
    async getProductList() {
      let result =
          await axios.get(`${ajaxUrl}/production/work/complete/product`)
              .catch(err => console.log(err));
      this.productList = result.data
    },

    selectProduct(product) {
      this.selectedProductCode = product.product_code
      this.$emit('selectProduct', product)
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