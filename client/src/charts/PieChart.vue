<!--하연 원형 차트-->
<template>
  <div class="chart-container">
    <canvas ref="pieChartCanvas"></canvas>
  </div>
</template>
  
  <script>
  import { Chart, registerables } from "chart.js";
  Chart.register(...registerables);
  
  export default {
    name: "PieChart",
    props: {
      chartData: {
        type: Object,
        required: true,
      },
      chartOptions: {
        type: Object,
        default: () => ({}),
      },
    },
    mounted() {
      this.renderChart();
    },
    methods: {
      renderChart() {
        if (this.pieChart) {
          this.pieChart.destroy();
        }
        const ctx = this.$refs.pieChartCanvas.getContext("2d");
        this.pieChart = new Chart(ctx, {
          type: "pie",
          data: this.chartData,
          options: this.chartOptions,
        });
      },
    },
    beforeUnmount() {
      if (this.pieChart) {
        this.pieChart.destroy();
      }
    },
  };
  </script>
  
  <style scoped>
  .chart-container {
    width: 130%;
    height: 130%;
  }
  canvas {
    width: 100% !important;
    height: 100% !important;
  }
  </style>
  