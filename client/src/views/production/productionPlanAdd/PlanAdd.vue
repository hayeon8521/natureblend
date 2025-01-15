<template>
  <div class="container-fluid product-plan-add py-4">
    <h3>생산계획 등록</h3>
    <PlanAddOrderList @selectOrders="selectOrders"></PlanAddOrderList>
    <PlanAddForm :selectedOrders="selectedOrders" @resetSelectedOrders="resetSelectedOrders"></PlanAddForm>


  </div>
</template>
<script>
import PlanAddOrderList from "@/views/production/productionPlanAdd/PlanAddOrderList.vue";
import PlanAddForm from "@/views/production/productionPlanAdd/PlanAddForm.vue";


export default {
  name: "PlanAdd",
  components: {PlanAddForm, PlanAddOrderList},

  data() {
    return {
      selectedOrders: []
    };
  },

  methods: {
    selectOrders(orders) {
      this.selectedOrders = orders
    },

    resetSelectedOrders() {
      this.selectedOrders = []
    }
  }


  };
</script>
<style lang="scss" scoped>
.product-plan-add {
  min-height: 500px;

}

</style>