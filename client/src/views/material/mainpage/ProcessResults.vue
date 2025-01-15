<template>
    <div class="border-radius-lg py-3 pe-1">
      <reports-bar-chart
        :chart="{
          labels: dateLabels,
          datasets: [
            {
              label: '실적률',
              data: [90, 94, 97, 96, 95, 96, 50],
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
  import ReportsBarChart from "@/charts/ReportsBarChart3.vue";
  
  export default {
    components: {
      ReportsBarChart,
    },
    data() {
      return {
        dateLabels: this.generateDateLabels(),
      };
    },
    methods: {
      generateDateLabels() {
        const labels = [];
        const today = new Date();
  
        for (let i = 0; i < 7; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() - i); // 오늘부터 -5일까지
          const formattedDate = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
          labels.unshift(formattedDate); // 최신 날짜가 뒤로 가도록
        }
        return labels;
      },
    },
  };
 </script>