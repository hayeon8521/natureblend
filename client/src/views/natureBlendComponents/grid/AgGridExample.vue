<template>
  <div class="grid-container" >
    <ag-grid-vue
      :rowData="rowData"
      :columnDefs="columnDefs"
      :theme="theme"
      @grid-ready="onGridReady"
  >
  </ag-grid-vue>
  </div>
</template>
<script>
import theme from "@/utils/agGridTheme";

export default {
  name: "AgGridExample",


  data() {
    return {
      theme: theme,
      rowData: [
        { make: "Tesla", model: "Model Y", price: 64950, electric: true },
        { make: "Ford", model: "F-Series", price: 33850, electric: true },
        { make: "Toyota", model: "Corolla", price: 29600, electric: false },
      ],

      columnDefs: [
        { field: "make"},
        { field: "model" },
        { field: "price" },
        {
          field: "electric",
          // checkboxSelection: true,
          editable: true,          // 편집 가능하게 설정
        }
      ],


    }
  },

  methods: {
    onGridReady(params) {
      this.gridApi = params.api;
      this.gridApi.sizeColumnsToFit();
    },
  }
}
</script>