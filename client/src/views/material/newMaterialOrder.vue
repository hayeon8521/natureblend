<!-- 
    메뉴 : 자재>자재발주>자재 발주 관리
    자재 발주 관리 메뉴 리메이크 (이걸로 사용중)
-->
<template>
    <div class="p-3 pb-0">
        <h3>&nbsp;&nbsp;자재 발주 관리</h3>
    </div>
    <div class="d-flex">
        <div class="p-2 flex-fill">
            <!-- productorderlist자식에게 needMaterialList 자식꺼 에밋으로 받아올때 발동하는 메소드 -->
            <newMaterialOrderPlan :productorderlist="productorderlist" @planAndBomList="needMaterialList"/>
        </div>
        <div class="p-2 flex-fill">
            <newMaterialOrderList @planAndClientList="needClientList" :material_code="material_code" :material_name="material_name"/>
        </div>
    </div>
   <!-- 위에서 만들어진거 요기에 보냄-->
   <newMaterialOrderOffer :planMaterialList="planMaterialList" :clientList="clientList" @seachClient="seachClienting" @goPOlist="letGoPoList"/>

   <div v-if="showprogress2" style="width: 100%; height: 100%; background-color: #0005; position: fixed; top: 0px; left: 0px; z-index: 1000;">
        <div style="position: fixed; top: 50%; left: 30%;  width: 50%;">
            <material-progress color="success" :percentage="number" />
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import { ajaxUrl } from '@/utils/commons.js';

import newMaterialOrderPlan from '@/views/material/newMaterialOrderPlan.vue';
import newMaterialOrderList from '@/views/material/newMaterialOrderList.vue';
import newMaterialOrderOffer from '@/views/material/newMaterialOrderOffer.vue';

import MaterialProgress from "@/components/MaterialProgress.vue";

import { mapMutations } from "vuex";   //로그인정보

export default {
    name: "myBestPage",
    components: {
        newMaterialOrderPlan,
        newMaterialOrderList,
        newMaterialOrderOffer,
        MaterialProgress,
    },
    // 변수 선언
    data() {
        return {
            loginInfo: {},
            showprogress2: false,
            productorderlist: [],
            planMaterialList: [],
            material_code: '',
            material_name: '',
            clientList: [],
            polist: [],
            my_result: 'OK',
            number: 0,
        };
    },
    computed: {
    },
    //각종 메소드들
    methods: {
        ...mapMutations(["addLoginInfo"]),
        //계획 리스트 불러옴
        async productorder(){
            this.loginInfo = this.$store.state.loginInfo;
            console.log('직업',this.loginInfo);
            if(this.loginInfo.job === '자재' || this.loginInfo.position === '관리자'){
                let result = await axios.get(`${ajaxUrl}/material/orderplan`)
                                .catch(err => console.log(err));
                this.productorderlist = result.data;
                //console.log(result.data);
            }else{
                this.$notify({ text: '자재팀 또는 관리자만 접속 가능합니다.', type: 'error' });    // success, warn, error 가능 // title:'로그인요청', 
                this.$router.push({ name : 'MainPage' });
            }
        },
        needMaterialList(data) {
            this.planMaterialList = [];
            this.planMaterialList = data;
            console.log('부모에서 받은 자재 리스트:', this.planMaterialList);
        },
        seachClienting(data, data2) {
            this.material_code = data;
            this.material_name = data2;
            console.log('부모에서 받은 자재 코드:', this.material_code, this.material_name);
        },
        needClientList(data) {
            this.clientList = data;
            console.log('부모한테 받은 회사코드', this.clientList);
            this.material_code = '';
            this.material_name = '';
        },
        //그래도 마지막은 자식보단 부모에서 작업해야지 [ 발주 등록 처리 ]
        async letGoPoList(data) {
            this.polist = data;
            console.log('부모한테 받은 발주서 : ', this.polist);

            this.polist = this.polist.map((val) => ({
                ...val,
                emp_num: this.loginInfo.emp_num,
                go_qty: val.material.includes('병') ? Number(val.go_qty) : Number(val.go_qty)*1000,
                go_price: val.material.includes('병') ? Number(val.go_price) : Number(val.go_price)*1000,
                go_total_price: val.material.includes('병') ? Number(val.go_total_price) : Number(val.go_total_price)*1000,
            }));

            let artificial_head = new Date();
            artificial_head = artificial_head.getTime();
            let percentNum = 100/this.polist.length;
            this.showprogress2 = true;
            for(let i=0; i<this.polist.length; i++){
                this.number = this.number + percentNum;
                await this.inputpolist(artificial_head, this.polist[i]);
            }
            if( this.my_result === 'OK' ){
                this.showprogress2 = false;
                this.number = 0;
                this.$notify({ text: '발주 등록에 성공 하셨습니다.', type: 'success' });    // success, warn, error 가능    // title:'발주성공', 
                this.$router.push({ name : 'materialOrderList' });
            }else{
                this.showprogress2 = false;
                this.number = 0;
                this.$notify({ text: this.my_result+'발주 오류 관리자 호출 해주세요.', type: 'error' });    // success, warn, error 가능  // title:'발주오류', 
            }
        },
        async inputpolist(key, data){
            let result = await axios.post(`${ajaxUrl}/material/inputPoLIst2/${key}`, data)
                            .catch(err => console.log(err));
            this.productorderlist = result.data;
            if( this.productorderlist[0][0]['v_result'] !== 'OK' ){
                this.my_result = this.productorderlist[0][0]['v_result'];
            }
        }
    },

    //생성될떄 작업하는거
    created(){
        this.productorder();
    },
};  
</script>