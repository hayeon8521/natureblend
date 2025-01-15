<template>
    <div class="myChat">
      <pie-chart
        id="pie-chart-component"
        :chartData="chartData"
        :chartOptions="chartOptions"
      />
    </div>
</template>
  
<script>
    import PieChart from "@/charts/PieChart.vue";

    export default {
    components: {
        PieChart,
    },
    props: {
        chartData: {
        type: Object,
        required: true,
        },
    },
    data() {
        return {
        chartOptions: {
            responsive: true,
            plugins: {
            legend: {
                position: "right",
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

<style scoped>
    .myChat {
        justify-content: center;
        align-items: center;
        position: relative;
        top: -50px;
        left: 60px;
    }
</style>