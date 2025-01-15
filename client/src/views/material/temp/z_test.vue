<template>
  <div>
    <default-line-chart
      :chartData="chartData"
      :chartOptions="chartOptions"
    />
  </div>
</template>

<script>
import DefaultLineChart from "@/charts/DefaultLineChart.vue";

export default {
  components: {
    DefaultLineChart,
  },
  data() {
    return {
      chartData: {
        labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [
          {
            label: "Organic Search",
            data: [50, 40, 300, 220, 500, 250, 400, 230, 500],
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderWidth: 2,
            tension: 0.4, // 곡선형 라인
          },
          {
            label: "Referral",
            data: [30, 90, 40, 140, 290, 290, 340, 230, 400],
            borderColor: "rgba(255, 99, 132, 1)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderWidth: 2,
            tension: 0.4,
          },
          {
            label: "Direct",
            data: [40, 80, 70, 90, 30, 90, 140, 130, 200],
            borderColor: "rgba(54, 162, 235, 1)",
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderWidth: 2,
            tension: 0.4,
          },
        ],
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top", // 범례 위치
          },
          tooltip: {
            enabled: true, // 툴팁 활성화
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Months",
            },
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Values",
            },
          },
        },
      },
    };
  },
};
</script>
