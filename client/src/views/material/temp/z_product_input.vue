<template>
   <div class="border-radius-lg py-3 pe-1">
     <reports-bar-chart
       :chart="{
         labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
         datasets: [
           {
             label: 'Sales',
             data: [50, 20, 10, 22, 50, 10, 40],
             backgroundColor: 'rgba(75, 192, 192, 0.2)',
             borderColor: 'rgba(75, 192, 192, 1)',
             borderWidth: 1,
           },
         ],
       }"
     />
   </div>
 </template>
 
 <script>
import ReportsBarChart from "@/charts/ReportsBarChart2.vue";

export default {
  components: {
    ReportsBarChart,
  },
};
</script>