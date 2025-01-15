<template>
    <div class="border-radius-lg py-3 pe-1">
      <reports-bar-chart
        :chart="{
          labels: ['오렌쥬시(500ml)', '애플팜(500ml)', '포도17(500ml)', '오렌쥬시(750ml)', '포도17(1.5L)'],
          datasets: [
            {
              label: '2024년 1월',
              data: [25600, 22000, 15000, 7000, 5000],
              backgroundColor: 'rgba(251, 140, 0, 0.7)',
              borderColor: 'rgba(251, 140, 0, 1)',
              borderWidth: 1,
            },
            {
              label: '2025년 1월',
              data: [10600, 6000, 2600, 2500, 2000],
              backgroundColor: 'rgba(76, 175, 80, 0.7)',
              borderColor: 'rgba(76, 175, 80, 1)',
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