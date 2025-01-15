<!-- 하연 막대 차트 -->
<template>
    <div class="chart-container">
      <canvas ref="barChartCanvas"></canvas>
    </div>
  </template>
  
  <script>
  import { Chart, registerables } from "chart.js";
  Chart.register(...registerables);
  
  export default {
    name: "ReportsBarChart",
    props: {
      chart: {
        type: Object,
        required: true,
      },
    },
    mounted() {
      this.renderChart();
    },
    methods: {
      renderChart() {
        if (this.barChart) {
          this.barChart.destroy(); // 기존 차트를 제거하여 중복 방지
        }
        const ctx = this.$refs.barChartCanvas.getContext("2d");
        this.barChart = new Chart(ctx, {
          type: "bar", // 바 차트
          data: this.chart,
          options: {
            indexAxis: "y", // 가로 방향으로 설정
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "bottom",
              },
              tooltip: {
                enabled: true,
              },
            },
            scales: {
              x: {
                beginAtZero: true,
                grid: {
                  display: false, // X축 격자선 제거
                },
                ticks: {
                  callback: function (value) {
                    return value.toLocaleString();
                    },
                },
              },
              y: {
                beginAtZero: true,
                grid: {
                  display: false, // X축 격자선 제거
                },
              },
            },
          },
        });
      },
    },
    beforeUnmount() {
      if (this.barChart) {
        this.barChart.destroy();
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
    height: 100% !important;
  }
  </style>
  