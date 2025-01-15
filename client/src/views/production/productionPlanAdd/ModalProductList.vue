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
                      class="text-center text-uppercase text-secondary text-md font-weight-bolder opacity-7"
                  >
                    제품번호
                  </th>
                  <th
                      class="text-center text-uppercase text-secondary text-md font-weight-bolder opacity-7 ps-2"
                  >
                    제품이름
                  </th>
                </tr>
                </thead>
                <tbody>
                <tr
                    v-for="product in productList"
                    :key="product.product_code"
                    class="product"
                    :class="{ selected: selectedCode === product.product_code }"
                    @click="clickProduct(product)"
                >
                  <td>
                    <div class="d-flex justify-content-center px-2">
                      <div class="my-auto">
                        <h6 class="mb-0 text-sm">{{ product.product_code }}</h6>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p class="text-center text-sm font-weight-bold mb-0">{{ product.product_name }}</p>
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
  name: "productList",

  data() {
    return {
      productList: [],
      selectedCode: ''
    }
  },

  mounted() {
      this.getProductList()
  },

  methods: {
    async getProductList() {
      let result =
          await axios.get(`${ajaxUrl}/production/plan/products`)
              .catch(err => console.log(err));
      this.productList = result.data
    },

    clickProduct(product) {
      this.selectedCode = product.product_code
      this.$emit('selectProduct', product)
    },
  }
}
</script>



<style scoped lang="scss">
.card {
  box-shadow: none;
}
.product:hover {
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