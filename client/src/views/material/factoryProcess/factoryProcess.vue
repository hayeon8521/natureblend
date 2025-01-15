<!-- 자재 발주 관리 메뉴 리메이크 (이걸로 사용중)-->
<template>
    <div>
        <h3>&nbsp;&nbsp;실시간 공정 흐름도&nbsp;&nbsp;&nbsp;&nbsp;현재시각 : [ {{ formattedDate }} ]</h3>
    </div>
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding-bottom: 30px;">
        <div class="d-flex flex-row m-0">
            <div class="p-0 material_processing" >
                <div style="width: 285px;">
                    <h5 class="mb-0">&nbsp;&nbsp;자재검사대기</h5>
                    <materialOrder :orderOk="orderOk"/>
                </div>
            </div>
            <div class="p-0 material_processing">
                <div style="width: 40px; height: 200px; display: flex; justify-content: center; align-items: center;">
                    <img src="http://yeonsus.com/academy/arrow_sample.png" alt="화살표" width="25"/>
                </div>
            </div>
            <div class="p-0 material_processing">
                <div style="width: 285px;">
                    <h5 class="mb-0">&nbsp;&nbsp;자재검사중</h5>
                    <materialQcing :material_qcing="material_qcing"/>
                </div>
            </div>
            <div class="p-0 material_processing">
                <div style="width: 40px; height: 200px; display: flex; justify-content: center; align-items: center;">
                    <img src="http://yeonsus.com/academy/arrow_sample.png" alt="화살표" width="25"/>
                </div>
            </div>
            <div class="p-0" style="height: 240px;">
                <div style="width: 285px;" class="material_processing">
                    <h5 class="mb-0">&nbsp;&nbsp;자재입고대기</h5>
                    <materialInput :material_input="material_input"/>
                </div>
                <div class="p-0">
                    <div class="material_processing" style="width: 285px; height: 40px; display: flex; justify-content: center; align-items: center;">
                        <img src="http://yeonsus.com/academy/arrow_sample_bottom.png" height="25"/>
                    </div>
                </div>
            </div>
            <div class="p-0">
                <div style="width: 40px; height: 200px; display: flex; justify-content: center; align-items: center;">
                </div>
            </div>
            <div class="p-0 product_processing">
                <div style="width: 285px;">
                    <h5 class="mb-0">&nbsp;&nbsp;제품출고대기</h5>
                    <productOut :produceOutWait="produceOutWait"/>
                </div>
            </div>
            <div class="p-0 product_processing">
                <div style="width: 40px; height: 200px; display: flex; justify-content: center; align-items: center;">
                    <img src="http://yeonsus.com/academy/arrow_sample_left.png" alt="화살표" width="25"/>
                </div>
            </div>
            <div class="p-0 product_processing">
                <div style="width: 285px;">
                    <h5 class="mb-0">&nbsp;&nbsp;제품 재고 현황</h5>
                    <productqtyqty :productQty="productQty" />
                </div>
            </div>
        </div>







        <div class="d-flex flex-row mb-0">
            <div class="p-0" style="height: 240px;">
                <div style="width: 285px;" class="process_processing">
                    <h5 class="mb-0">&nbsp;&nbsp;생산지시</h5>
                    <processOrder :process_list="process_list"/>
                </div>
                <div class="p-0">
                    <div class="process_processing" style="width: 285px; height: 40px; display: flex; justify-content: center; align-items: center;">
                        <img src="http://yeonsus.com/academy/arrow_sample_bottom.png" height="25"/>
                    </div>
                </div>
            </div>
            <div class="p-0">
                <div style="width: 40px; height: 200px; display: flex; justify-content: center; align-items: center;">
                </div>
            </div>
            <div class="p-0">
                <div style="width: 285px;">
                </div>
            </div>
            <div class="p-0">
                <div style="width: 40px; height: 200px; display: flex; justify-content: center; align-items: center;">
                </div>
            </div>
            <div class="p-0 material_processing">
                <div style="width: 285px;">
                    <h5 class="mb-0">&nbsp;&nbsp;자재 재고 현황</h5>
                    <materialqtyqty :materialqty="materialqty"/>
                </div>
            </div>
            <div class="p-0">
                <div style="width: 40px; height: 200px; display: flex; justify-content: center; align-items: center;">
                </div>
            </div>
            <div class="p-0 process_processing">
                <div style="width: 285px;">
                    <h5 class="mb-0">&nbsp;&nbsp;제품입고대기</h5>
                    <productInput :productinputwait="productinputwait"/>
                </div>
            </div>
            <div class="p-0 process_processing">
                <div style="width: 40px; height: 200px; display: flex; justify-content: center; align-items: center;">
                    <img src="http://yeonsus.com/academy/arrow_sample_left.png" alt="화살표" width="25"/>
                </div>
            </div>
            <div class="p-0">
                <div style="width: 285px;" class="process_processing">
                    <h5 class="mb-0">&nbsp;&nbsp;포장검사</h5>
                    <process3qc :process3_qc_list="process3_qc_list"/>
                </div>
                <div class="p-0">
                    <div class="process_processing" style="width: 285px; height: 40px; display: flex; justify-content: center; align-items: center;">
                        <img src="http://yeonsus.com/academy/arrow_sample_top.png" height="25"/>
                    </div>
                </div>
            </div>
        </div>







        <div class="d-flex flex-row mb-0">
            <div class="p-0 process_processing">
                <div style="width: 285px;">
                    <h5 class="mb-0">&nbsp;&nbsp;음료제작공정</h5>
                    <process1 :process1_list="process1_list" />
                </div>
            </div>
            <div class="p-0 process_processing">
                <div style="width: 40px; height: 200px; display: flex; justify-content: center; align-items: center;">
                    <img src="http://yeonsus.com/academy/arrow_sample.png" alt="화살표" width="25"/>
                </div>
            </div>
            <div class="p-0 process_processing">
                <div style="width: 285px;">
                    <h5 class="mb-0">&nbsp;&nbsp;음료제작검사</h5>
                    <process1qc :process1_qc_list="process1_qc_list"/>
                </div>
            </div>
            <div class="p-0 process_processing">
                <div style="width: 40px; height: 200px; display: flex; justify-content: center; align-items: center;">
                    <img src="http://yeonsus.com/academy/arrow_sample.png" alt="화살표" width="25"/>
                </div>
            </div>
            <div class="p-0 process_processing">
                <div style="width: 285px;">
                    <h5 class="mb-0">&nbsp;&nbsp;병세척공정</h5>
                    <process2 :process2_list="process2_list"/>
                </div>
            </div>
            <div class="p-0 process_processing">
                <div style="width: 40px; height: 200px; display: flex; justify-content: center; align-items: center;">
                    <img src="http://yeonsus.com/academy/arrow_sample.png" alt="화살표" width="25"/>
                </div>
            </div>
            <div class="p-0 process_processing">
                <div style="width: 285px;">
                    <h5 class="mb-0">&nbsp;&nbsp;세척병검사</h5>
                    <process2qc :process2_qc_list="process2_qc_list"/>
                </div>
            </div>
            <div class="p-0 process_processing">
                <div style="width: 40px; height: 200px; display: flex; justify-content: center; align-items: center;">
                    <img src="http://yeonsus.com/academy/arrow_sample.png" alt="화살표" width="25"/>
                </div>
            </div>
            <div class="p-0 process_processing">
                <div style="width: 285px;">
                    <h5 class="mb-0">&nbsp;&nbsp;포장공정</h5>
                    <process3 :process3_list="process3_list"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import axios from 'axios';
    import { ajaxUrl } from '@/utils/commons.js';

    import { ref, onBeforeMount, onUnmounted } from 'vue'; //onBeforeMount

    import userDateUtils from '@/utils/useDates.js';

    import materialOrder from '@/views/material/factoryProcess/materialOrder.vue';
    import materialQcing from '@/views/material/factoryProcess/materialQcing.vue';
    import materialInput from '@/views/material/factoryProcess/materialInput.vue';
    import productInput from '@/views/material/factoryProcess/productInput.vue';
    import productOut from '@/views/material/factoryProcess/productOut.vue';
    import processOrder from '@/views/material/factoryProcess/processOrder.vue';
    import process1 from '@/views/material/factoryProcess/process1.vue';
    import process1qc from '@/views/material/factoryProcess/process1qc.vue';
    import process2 from '@/views/material/factoryProcess/process2.vue';
    import process2qc from '@/views/material/factoryProcess/process2qc.vue';
    import process3 from '@/views/material/factoryProcess/process3.vue';
    import process3qc from '@/views/material/factoryProcess/process3qc.vue';
    import productqtyqty from '@/views/material/factoryProcess/productqtyqty.vue';
    import materialqtyqty from '@/views/material/factoryProcess/materialqtyqty.vue';


    //자재발주서 생성(검수대기항목들)
    const orderOk = ref([]);
    const matrialOrderList2 = async function(){
        const seachcondition = {
            materialCode: '',
            clientName: '',
            POListCode: '',
            startDate: '',
            endDate: '',
            materialState: ['a1'],
        };
        let result = await axios.put(`${ajaxUrl}/material/configloding`, seachcondition)
                                .catch(err=>console.log(err));
        console.log('aaaaaa',result.data);
        orderOk.value = result.data.map((col) => ({
            ...col,
            ord_qty: col.material_name.includes('병') ? Number(col.ord_qty).toLocaleString() + " 개" : (Number(col.ord_qty) * 0.001).toLocaleString() + " kg",
            order_date: userDateUtils.dateFormat(col.order_date, "yyyy-MM-dd"),
            limit_date: userDateUtils.dateFormat(col.limit_date, "yyyy-MM-dd"),
            unit_price: col.material_name.includes('병') ? Number(col.unit_price).toLocaleString() + " 원" : Number(col.unit_price*0.001).toLocaleString() + " 원",
            total_price: col.material_name.includes('병') ? Number(col.total_price).toLocaleString() + " 원" : Number(col.total_price*0.001).toLocaleString() + " 원"
            })
        );
        console.log('검수대기항목',orderOk.value);
    };

    //검사중인 자재
    const material_qcing = ref([]);
    
    const searchRequestAll = async function(){
        const result = {
            mName: "",
            startDate: null,
            endDate: null,
            qcState : 'qcs3',
        };
        let searchResult = await axios.post(`${ajaxUrl}/material/recordQCM2`, result)
                                        .catch(err => console.log(err));
        material_qcing.value = searchResult.data.map((col) => ({
            ...col,
            total_qnt: col.material_name && col.material_name.includes('병') ? Number(col.total_qnt).toLocaleString() + " 개" : (Number(col.total_qnt) * 0.001).toLocaleString() + " kg",
            })
        );
        console.log('검사중인 자재',material_qcing);
    };

    //자재 입고해야할 목록(자재입고대기)
    const material_input = ref([]);
    const matrialQcInput = async function(){
        let result = await axios.get(`${ajaxUrl}/material/miql2`)
                            .catch(err=>console.log(err));
        material_input.value = result.data;
        material_input.value = result.data.map(col => ({
            ...col,
            inspec_end: userDateUtils.dateFormat(col.inspec_endm, "yyyy-MM-dd"),
            ord_qty: col.material_name.includes('병') ? (Number(col.ord_qty)).toLocaleString() + " 개" : (Number(col.ord_qty) * 0.001).toLocaleString() + " kg",
            total_qnt: col.material_name.includes('병') ? (Number(col.total_qnt)).toLocaleString() + " 개" : (Number(col.total_qnt) * 0.001).toLocaleString() + " kg",
            pass_qnt: col.material_name.includes('병') ? (Number(col.pass_qnt)).toLocaleString() + " 개" : (Number(col.pass_qnt) * 0.001).toLocaleString() + " kg",
            rjc_qnt: col.material_name.includes('병') ? (Number(col.rjc_qnt)).toLocaleString() + " 개" : (Number(col.rjc_qnt) * 0.001).toLocaleString() + " kg",
            unit_price: col.material_name.includes('병') ? Number(col.unit_price).toLocaleString() + " 원" : Number(col.unit_price*0.001).toLocaleString() + " 원",
            total_price: col.material_name.includes('병') ? Number(col.total_price).toLocaleString() + " 원" : Number(col.total_price*0.000001).toLocaleString() + " 원",
        }));
        console.log('자재입고대기',material_input.value);
    }

    // 생산 지시 목록
    const process_list = ref([]);
    const processList = async function(){
        let result = await axios.get(`${ajaxUrl}/material/processlist`)
                            .catch(err=>console.log(err));
        process_list.value = result.data;
        console.log('생산 지시 목록 ',process_list.value);
    };

    // 착즙 공정 목록
    const process1_list = ref([]);
    const process1List = async function(){
        let result = await axios.get(`${ajaxUrl}/material/process1list`)
                            .catch(err=>console.log(err));
        process1_list.value = result.data;
        console.log('착즙',process1_list.value);
    };

    // 착즙 공정 완료 (품질)
    const process1_qc_list = ref([]);
    const process1QcList = async function(){
        let result = await axios.get(`${ajaxUrl}/material/process1QcList`)
                            .catch(err=>console.log(err));
        process1_qc_list.value = result.data;
        console.log('착즙 품질',process1_qc_list.value);
    };

    // 세척 공정 목록
    const process2_list = ref([]);
    const process2List = async function(){
        let result = await axios.get(`${ajaxUrl}/material/process2List`)
                            .catch(err=>console.log(err));
        process2_list.value = result.data;
        console.log('세척 목록 ',process2_list.value);
    };

    // 세척 공정 품질
    const process2_qc_list = ref([]);
    const process2QcList = async function(){
        let result = await axios.get(`${ajaxUrl}/material/process2QcList`)
                            .catch(err=>console.log(err));
        process2_qc_list.value = result.data;
        console.log('세척 품질',process2_qc_list.value);
    };

    // 포장 공정 목록
    const process3_list = ref([]);
    const process3List = async function(){
        let result = await axios.get(`${ajaxUrl}/material/process3List`)
                            .catch(err=>console.log(err));
        process3_list.value = result.data;
        console.log('포장 목록 ',process3_list.value);
    };

    // 포장 공정 품질
    const process3_qc_list = ref([]);
    const process3QcList = async function(){
        let result = await axios.get(`${ajaxUrl}/material/process3QcList`)
                            .catch(err=>console.log(err));
        process3_qc_list.value = result.data;
        console.log('포장 품질',process3_qc_list.value);
    };

    // 제품 입고 대기
    const productinputwait = ref([]);
    const productInputWait = async function(){
        let result = await axios.get(`${ajaxUrl}/material/productInputWait`)
                            .catch(err=>console.log(err));
        productinputwait.value = result.data;
        console.log('제품 입고 대기',productinputwait.value);
    };

    // 제품 출고 대기
    const produceOutWait = ref([]);
    const produceoutwait = async function(){
        let result = await axios.get(`${ajaxUrl}/material/produceoutwait`)
                            .catch(err=>console.log(err));
        produceOutWait.value = result.data;
        console.log('제품 입고 대기',produceOutWait.value);
    };

    // 제품 재고
    const productQty = ref([]);
    const productqtying = async function(){
        let result = await axios.get(`${ajaxUrl}/material/productqtying`)
                            .catch(err=>console.log(err));
        productQty.value = result.data;
        console.log('제품 재고',productQty.value);
    };

    // 자재 재고
    const materialqty = ref([]);
    const materialQtying = async function(){
        let result = await axios.get(`${ajaxUrl}/material/materialQtying`)
                            .catch(err=>console.log(err));
        //materialqty.value = result.data;
        console.log('자재 재고',materialqty.value);
        materialqty.value = result.data.map((col) => ({
            ...col,
            stok_qty: col.material_name.includes('병') ? Number(col.stok_qty).toLocaleString() + " 개" : (Number(col.stok_qty) * 0.001).toLocaleString() + " kg",
            })
        );
    };

    //날짜와 매초 데이터 불러오는곳
    const formattedDate = ref('');
    let timer = null;
    const startprocess = () => {
        const now = new Date();
        formattedDate.value = `${now.getFullYear()}년 ${String(now.getMonth() + 1).padStart(2, '0')}월 ${String(now.getDate()).padStart(2, '0')}일 ${String(now.getHours()).padStart(2, '0')}시 ${String(now.getMinutes()).padStart(2, '0')}분 ${String(now.getSeconds()).padStart(2, '0')}초`;
        console.log("형식화된 시간:", formattedDate);
        
        //5초마다 메소드 실행
        if (now.getSeconds() % 5 === 0) {
            matrialOrderList2();   //자재발주서 생성(검수대기항목들)
            searchRequestAll(); //검사중인 자재(자재검사중)
            matrialQcInput();        //자재 입고해야할 목록(자재입고대기)
            processList();  //생산 지시 목록
            process1List(); //착즙 공정
            process1QcList();   // 착즙 공정 QC
            process2List(); //세척 공정
            process2QcList(); //세척 공정 품질
            process3List(); //포장 공정
            process3QcList(); //포장 공정 품질
            productInputWait(); //제품 입고 대기
            produceoutwait();   //제품 출고 대기
            productqtying();    //제품 재고
            materialQtying();   //자재 재고
        }
    };

    // 화면 생성되는 시점 (최초 1회 실행 이후에 startprocess 메소드에서 5초마다 실행)
    onBeforeMount(()=>{
        startprocess();     //현재시간 불러오는 메소드
        //matrialOrderList2();   //자재발주서 생성(검수대기항목들)
        //searchRequestAll(); //검사중인 자재(자재검사중)
        //matrialQcInput();        //자재 입고해야할 목록(자재입고대기)
        timer = setInterval(startprocess, 1000);    // 1초마다 타이머 돌아감
    });

    //★★★★★★★이거 없으면 서버터짐!!!!!!!
    onUnmounted(() => {
        clearInterval(timer); // setInterval 정리
    });

</script>
<style scoped>
.material_processing {
    background-color: rgb(249, 237, 218);
    border-radius: 25px;
    height: 200px;
}
.process_processing {
    background-color: rgb(220, 249, 190);
    border-radius: 25px;
    height: 200px;
}
.product_processing {
    background-color: rgb(178, 228, 245);
    border-radius: 25px;
    height: 200px;
}
h5 {
    padding-top: 10px;
}
</style>