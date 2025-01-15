<template>

  <div class="container-fluid py-4">

    <h3>정비 완료 내역</h3>
    <div class="grid-container" >
      <ag-grid-vue
        :rowData="requestRow"
        :columnDefs="requestCol"
        :theme="theme"
        @grid-ready="onReady"
        :rowHeight="50"
        style="height: 493px;"
        :pagination="true"
        :paginationPageSize="8"
        :paginationPageSizeSelector="[8, 16, 40, 80]"
      ></ag-grid-vue>
    </div>

  </div>

</template>


<script setup>
import { ajaxUrl } from '@/utils/commons.js';
import axios from 'axios';
import theme from "@/utils/agGridTheme";
import userDateUtils from "@/utils/useDates.js";
import {shallowRef, onBeforeMount} from 'vue';


const requestRow = shallowRef([]);
const requestCol = shallowRef([
  { headerName: '설비번호', field: 'machine_num', cellStyle: { textAlign: "center" }, flex: 2 },
  { headerName: '설비분류', field: 'machine_type', flex: 3 },
  { headerName: '설비이름', field: 'machine_name', flex: 3 },
  { headerName: '정비내용', field: 'maintenance_detail', flex: 4 },
  { headerName: '작업자', field: 'work_emp_name', cellStyle: { textAlign: "center" }, flex: 2 },
  { headerName: '완료일자', field: 'end_date', cellStyle: { textAlign: "center" }, flex: 3 },
]);


// 정비 요청 내역 데이터
const getRequests = async () => {
  let result = await axios.get(`${ajaxUrl}/maintenances/completeList`)
                          .catch(err => console.log(err));

  let newary = [];
  for(let data of result.data) {
    if(data.maintenance_state == 'done') {
      newary.push(data);
    }
  }
  requestRow.value = newary;

  for(let i in requestRow.value) {
    requestRow.value[i].end_date = userDateUtils.dateFormat(requestRow.value[i].end_date, 'yyyy-MM-dd');
  }
}


// 마운트전
onBeforeMount(()=>{
  getRequests();
});
</script>


<style scoped>

</style>
