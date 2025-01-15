<!-- 온통 구라천국 통계자료 -->
<template>
    <div>
        <h6 style="margin-bottom: 0px; display: flex; align-items: center;">
            &nbsp;&nbsp;&nbsp;네츄럴 블렌드 통계자료
            <button @click="fatoryprocess" type="button" class="btn" style="top:5px; background-color: #f44335; color: white; width: 140px; height: 30px; display: flex; align-items: center; justify-content: center; margin-left: 30px;">
                공정별 현황보기
            </button>
        </h6>
   </div>
    <div class="d-flex">
        <div class="p-2 flex-fill">
            <div class="container-fluid pl-4 pr-4 pt-0 pm-0">
                <div class="row">
                    <div class="col-12">
                        <div class="card my-4">
                            <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2 pb-2">
                                <div class="bg-gradient-success shadow-success border-radius-lg pt-1 pb-0">
                                    <h6 class="text-white text-capitalize ps-3">주간 공정 실적률</h6>
                                </div>
                            </div>
                            <div class="card-body px-0 pb-2 pt-0" style="width: 180px;">
                                <ProcessResults style="width: 400px; height: 280px;" class="p-3" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="p-2 flex-fill">
            <div class="container-fluid pl-4 pr-4 pt-0 pm-0">
                <div class="row">
                    <div class="col-12">
                        <div class="card my-4">
                            <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2 pb-2">
                                <div class="bg-gradient-success shadow-success border-radius-lg pt-1 pb-0">
                                    <h6 class="text-white text-capitalize ps-3">1월 제품 판매량 TOP 5 (개)</h6>
                                </div>
                            </div>
                            <div class="card-body px-0 pb-2 pt-0" style="width: 250px;">
                                <productBest style="width: 480px; height: 280px;" class="p-3" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="p-2 flex-fill">
            <div class="container-fluid pl-4 pr-4 pt-0 pm-0">
                <div class="row">
                    <div class="col-12">
                        <div class="card my-4">
                            <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2 pb-2">
                                <div class="bg-gradient-success shadow-success border-radius-lg pt-1 pb-0">
                                    <h6 class="text-white text-capitalize ps-3">자재별 보유 비율 (%)</h6>
                                </div>
                            </div>
                            <div class="card-body px-0 pb-2 pt-0" style="width: 250px;">
                                <materialratio style="width: 300px; height: 280px;" :chartData="sortedChartData"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="container-fluid pl-4 pr-4 pt-0 pm-0">
        <div class="row">
            <div class="col-12">
                <div class="card my-4">
                    <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2 pb-2">
                        <div class="bg-gradient-success shadow-success border-radius-lg pt-1 pb-0">
                            <h6 class="text-white text-capitalize ps-3">월별 과일쥬스 매출액 (만원)</h6>
                        </div>
                    </div>
                    <div class="card-body px-0 pb-2 pt-0">
                        <annualSales />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import annualSales from '@/views/material/mainpage/annualSales.vue';
    import materialratio from '@/views/material/mainpage/materialratio.vue';
    import productBest from '@/views/material/mainpage/productBest.vue';
    import ProcessResults from '@/views/material/mainpage/ProcessResults.vue';

    //라우팅 정보 가져오기
    import { useRouter } from 'vue-router';
    const router = useRouter();
    
    
    // 원본 데이터
    const chartData = {
        labels: ["포도", "사과", "오렌지", "레몬", "망고", "당근", "세척병(500ml)", "세척병(750ml)", "세척병(1.5L)", "설탕", "식용색소", "향료"],
        datasets: [
            {
                label: "Material",
                data: [18, 10, 5, 3, 18, 14, 5, 5, 3, 18, 0.5, 0.5],
                backgroundColor: [
                    "rgba(128, 0, 128, 0.8)", // 포도
                    "rgba(255, 0, 0, 0.8)",   // 사과
                    "rgba(255, 206, 86, 0.8)", // 오렌지
                    "rgba(255, 215, 0, 0.8)", // 레몬
                    "rgba(0, 255, 0, 0.8)",   // 망고
                    "rgba(54, 162, 235, 0.8)", // 당근
                    "rgba(0, 0, 128, 0.8)",   // 세척병 500
                    "rgba(176, 196, 205, 0.8)", // 세척병 750
                    "rgba(255, 192, 203, 0.8)", // 세척병 1500
                    "rgba(169, 169, 169, 0.8)", // 설탕
                    "rgba(100, 80, 255, 0.8)", // 색소
                    "rgba(0, 0, 0, 0.8)",     // 향료
                ],
                borderColor: [
                    "rgba(128, 0, 128, 1)",    // 포도
                    "rgba(255, 0, 0, 1)",      // 사과
                    "rgba(255, 206, 86, 1)",   // 오렌지
                    "rgba(255, 215, 0, 1)",    // 레몬
                    "rgba(0, 255, 0, 1)",      // 망고
                    "rgba(54, 162, 235, 1)",   // 당근
                    "rgba(0, 0, 128, 1)",      // 세척병 500
                    "rgba(176, 196, 205, 1)",  // 세척병 750
                    "rgba(255, 192, 203, 1)",  // 세척병 1500
                    "rgba(169, 169, 169, 1)",  // 설탕
                    "rgba(100, 80, 255, 1)",  // 색소
                    "rgba(0, 0, 0, 1)",        // 향료
                ],
            },
        ],
    };

    // 데이터 정렬
    const sortedChartData = {
        labels: [...chartData.labels],
        datasets: [
            {
                ...chartData.datasets[0],
                data: [...chartData.datasets[0].data],
                backgroundColor: [...chartData.datasets[0].backgroundColor],
                borderColor: [...chartData.datasets[0].borderColor],
            },
        ],
    };

    // 정렬 작업
    const combined = sortedChartData.labels.map((label, index) => ({
        label,
        value: sortedChartData.datasets[0].data[index],
        backgroundColor: sortedChartData.datasets[0].backgroundColor[index],
        borderColor: sortedChartData.datasets[0].borderColor[index],
    }));

    // 데이터 값 기준으로 내림차순 정렬
    combined.sort((a, b) => b.value - a.value);

    // 정렬된 데이터 반영
    sortedChartData.labels = combined.map((item) => item.label);
    sortedChartData.datasets[0].data = combined.map((item) => item.value);
    sortedChartData.datasets[0].backgroundColor = combined.map((item) => item.backgroundColor);
    sortedChartData.datasets[0].borderColor = combined.map((item) => item.borderColor);

    const fatoryprocess = () => {
        router.push({ name: 'Factoryprocess' });
    }
</script>