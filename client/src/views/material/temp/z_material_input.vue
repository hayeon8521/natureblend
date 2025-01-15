<template>
   <div>
     <pie-chart
       id="pie-chart-component"
       :chartData="chartData"
       :chartOptions="chartOptions"
       style="width: 500px; height: 500px;"
     />
   </div>
 </template>
 
 <script>
import PieChart from "@/charts/PieChart.vue";
export default {
  components: {
    PieChart,
  },
  data() {
    return {
      chartData: {
        labels: ["Facebook", "Direct", "Organic", "Referral"],
        datasets: [
          {
            label: "Projects",
            data: [15, 20, 12, 60],
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
      chartOptions: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          tooltip: {
            enabled: true,
          },
        },
      },
    };
  },
};
</script>