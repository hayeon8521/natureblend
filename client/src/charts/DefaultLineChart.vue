<!-- 하연작업 곡선 차트 -->
<template>
    <div class="chart-container">
      <canvas ref="lineChartCanvas"></canvas>
    </div>
  </template>
  
  <script>
  import { Chart, registerables } from "chart.js";
  Chart.register(...registerables);
  
  export default {
    name: "DefaultLineChart",
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
        if (this.lineChart) {
          this.lineChart.destroy();
        }
        const ctx = this.$refs.lineChartCanvas.getContext("2d");
        this.lineChart = new Chart(ctx, {
          type: "line",
          data: this.chartData,
          options: this.chartOptions,
        });
      },
    },
    beforeUnmount() {
      if (this.lineChart) {
        this.lineChart.destroy();
      }
    },
  };
  </script>
  
  <style scoped>
  .chart-container {
    width: 100%;
    height: 100%;
    position: relative;
  }
  canvas {
    width: 100% !important;
    height: 330px !important;
  }
  </style>
  