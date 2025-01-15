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
          labels: ["2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월", "1월"],
          datasets: [
            {
              label: "포도17",
              data: [680, 600, 750, 650, 720, 850, 1150, 1500, 1650, 1100, 1150, 280],
              borderColor: "rgba(128, 0, 128, 1)",
              backgroundColor: "rgba(186, 85, 211, 0.2)",
              borderWidth: 2,
              tension: 0.4, // 곡선형 라인
            },
            {
              label: "애플팜",
              data: [1500, 1200, 1300, 1600, 1500, 2600, 4000, 3500, 3000, 2800, 2200, 600],
              borderColor: "rgba(250, 0, 0, 1)",
              backgroundColor: "rgba(255, 102, 102, 0.2)",
              borderWidth: 2,
              tension: 0.4, // 곡선형 라인
            },
            {
              label: "오렌쥬시",
              data: [3000, 2500, 2100, 2600, 2800, 2600, 3000, 3300, 3400, 3500, 3200, 1200],
              borderColor: "rgba(255, 165, 0, 1)",
              backgroundColor: "rgba(255, 213, 128, 0.2)",
              borderWidth: 2,
              tension: 0.4, // 곡선형 라인
            },
            {
              label: "레몬의꿈",
              data: [1000, 850, 700, 880, 910, 900, 1000, 1100, 1150, 1200, 1000, 200],
              borderColor: "rgba(255, 255, 0, 1)",
              backgroundColor: "rgba(255, 235, 224, 0.2)",
              borderWidth: 2,
              tension: 0.4, // 곡선형 라인
            },
            {
              label: "아이망고",
              data: [700, 620, 550, 720, 800, 1200, 2000, 1500, 1150, 750, 660, 120],
              borderColor: "rgba(0, 255, 127, 1)",
              backgroundColor: "rgba(173, 255, 47, 0.2)",
              borderWidth: 2,
              tension: 0.4, // 곡선형 라인
            },
            {
              label: "당근이세요?",
              data: [300, 250, 210, 260, 280, 260, 350, 550, 600, 430, 320, 50],
              borderColor: "rgba(0, 0, 139, 1)",
              backgroundColor: "rgba(0, 255, 255, 0.2)",
              borderWidth: 2,
              tension: 0.4, // 곡선형 라인
            },
          ],
        },
        chartOptions: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom", // 범례 위치
            },
            tooltip: {
              enabled: true, // 툴팁 활성화
            },
          },
          scales: {
            x: {
              title: {
                display: false,
                text: "Months",
              },
              grid: {
                display: false, // X축 격자선 제거
              },
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "(만)원",
              },
              grid: {
                display: false, // X축 격자선 제거
              },
            },
          },
        },
      };
    },
  };
  </script>
  