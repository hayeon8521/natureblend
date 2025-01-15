<!-- 출력 리스트 -->

<template>
  <div
    class="w-auto h-auto collapse navbar-collapse max-height-vh-100 h-100"
    id="sidenav-collapse-main"
  >
    <!-- 전체 네비게이션바 목록 -->
    <ul class="navbar-nav">

      <!-- 네비게이션바 항목 시작 -->
      <li v-if="headerMenu === $departments[1]" class="nav-item">
        <sidenav-collapse
          url="#"
          :aria-controls="''"
          v-bind:collapse="true"
          collapseRef="mainpage"
          navText="주문서"
        >
          <template v-slot:icon>
            <i class="material-icons-round opacity-10 fs-5">dashboard</i>
          </template>
          <template v-slot:list>
            <li class="sub-item" @click="movePage('orderForm')">주문서등록</li>
            <li class="sub-item" @click="movePage('orderlistSearch')">주문서조회</li>
          </template>
        </sidenav-collapse>
        <sidenav-collapse
          url="#"
          :aria-controls="''"
          v-bind:collapse="true"
          collapseRef="mainpage"
          navText="제품출고"
        >
          <template v-slot:icon>
            <i class="material-icons-round opacity-10 fs-5">dashboard</i>
          </template>
          <template v-slot:list>
            <li class="sub-item" @click="movePage('outputManage')">제품출고등록</li>
            <li class="sub-item" @click="movePage('outputList')">제품출고조회</li>
          </template>
        </sidenav-collapse>
        <sidenav-collapse
          url="#"
          :aria-controls="''"
          v-bind:collapse="true"
          collapseRef="mainpage"
          navText="제품입고"
        >
          <template v-slot:icon>
            <i class="material-icons-round opacity-10 fs-5">dashboard</i>
          </template>
          <template v-slot:list>
            <li class="sub-item" @click="movePage('inputManage')">제품입고등록</li>
            <li class="sub-item" @click="movePage('inputList')">제품입고조회</li>
          </template>
        </sidenav-collapse>
        <sidenav-collapse
          url="#"
          :aria-controls="''"
          v-bind:collapse="true"
          collapseRef="mainpage"
          navText="제품반품"
        >
          <template v-slot:icon>
            <i class="material-icons-round opacity-10 fs-5">dashboard</i>
          </template>
          <template v-slot:list>
            <li class="sub-item" @click="movePage('returnManage')">제품반품등록</li>
            <li class="sub-item" @click="movePage('returnList')">제품반품조회</li>
          </template>
        </sidenav-collapse>
        <sidenav-collapse
          url="#"
          :aria-controls="''"
          v-bind:collapse="true"
          collapseRef="mainpage"
          navText="제품재고"
        >
          <template v-slot:icon>
              <i class="material-icons-round opacity-10 fs-5">dashboard</i>
            </template>
            <template v-slot:list>
              <li class="sub-item" @click="movePage('productInventory')">제품재고조회</li>
              <li class="sub-item" @click="movePage('lotInventory')">제품LOT조회</li>
            </template> 
        </sidenav-collapse>
      </li>
      <li v-else-if="headerMenu === $departments[2]" class="nav-item">
        <sidenav-collapse
            url="#"
            :aria-controls="''"
            v-bind:collapse="true"
            collapseRef="mainpage"
            navText="자재 발주"
            @click="movePage('materialList2')"
        >
          <template v-slot:icon>
            <i class="material-icons-round opacity-10 fs-5">dashboard</i>
          </template>
          <template v-slot:list>
            <!--<li class="sub-item" @click="movePage('materialList')">자재 발주 관리</li>-->
            <li class="sub-item" @click="movePage('materialList2')">자재 발주 관리</li>
            <li class="sub-item" @click="movePage('materialOrderList')">자재 발주 조회</li>
          </template>
        </sidenav-collapse>
        <sidenav-collapse
            url="#"
            :aria-controls="''"
            v-bind:collapse="true"
            collapseRef="mainpage"
            navText="자재 입고"
            @click="movePage('materialInput')"
        >
          <template v-slot:icon>
            <i class="material-icons-round opacity-10 fs-5">dashboard</i>
          </template>
          <template v-slot:list>
            <li class="sub-item" @click="movePage('materialInput')">자재 입고</li>
            <li class="sub-item" @click="movePage('materialInputList')">자재 입고 조회</li>
          </template>
        </sidenav-collapse>
        <sidenav-collapse
            url="#"
            :aria-controls="''"
            v-bind:collapse="true"
            collapseRef="mainpage"
            navText="자재 재고"
            @click="movePage('materialLotqty')"
        >
          <template v-slot:icon>
            <i class="material-icons-round opacity-10 fs-5">dashboard</i>
          </template>
          <template v-slot:list>
            <li class="sub-item" @click="movePage('materialLotqty')">자재 LOT 조회</li>
            <li class="sub-item" @click="movePage('materialqty')">자재 재고 조회</li>
          </template>
        </sidenav-collapse>
      </li>
      <li v-else-if="headerMenu === $departments[3]" class="nav-item">
        <sidenav-collapse
            url="#"
            :aria-controls="''"
            v-bind:collapse="true"
            collapseRef="productionPlan"
            navText="생산계획"
        >
          <template v-slot:icon>
            <i class="material-icons-round opacity-10 fs-5">dashboard</i>
          </template>
          <template v-slot:list>
            <li class="sub-item" @click="movePage('productionPlanAdd')">생산계획 등록</li>
            <li class="sub-item" @click="movePage('productionPlanList')">생산계획 목록</li>
          </template>
        </sidenav-collapse>
        <sidenav-collapse
            url="#"
            :aria-controls="''"
            v-bind:collapse="true"
            collapseRef="productionOrder"
            navText="생산지시"
        >
          <template v-slot:icon>
            <i class="material-icons-round opacity-10 fs-5">dashboard</i>
          </template>
          <template v-slot:list>
            <li class="sub-item" @click="movePage('productionOrderAdd')">생산지시 등록</li>
            <li class="sub-item" @click="movePage('productionOrderList')">생산지시 목록</li>
          </template>
        </sidenav-collapse>
        <sidenav-collapse
            url="#"
            :aria-controls="''"
            :collapse="false"
            collapseRef="workingList"
            navText="공정작업"
            @click="movePage('workingList')"
        >
          <template v-slot:icon>
            <i class="material-icons-round opacity-10 fs-5">dashboard</i>
          </template>
<!--          <template v-slot:list>-->
<!--            <li class="sub-item" @click="movePage('workingList')">실행작업 목록</li>-->
<!--            <li class="sub-item" @click="movePage('workDoneList')">완료작업 목록</li>-->
<!--          </template>-->
        </sidenav-collapse>
        <sidenav-collapse 
            url="#"
            :aria-controls="''"
            v-bind:collapse="false"
            collapseRef="mainpage"
            navText="공정실적"
            @click="movePage('productionWorkDoneList')"
        >
          <template v-slot:icon>
            <i class="material-icons-round opacity-10 fs-5">dashboard</i>
          </template>
        </sidenav-collapse>
      </li>
      <li v-else-if="headerMenu === $departments[4]" class="nav-item">
        <sidenav-collapse
            url="#"
            :aria-controls="''"
            v-bind:collapse="true"
            collapseRef="mainpage"
            navText="입고검사"
            @click="movePage('qCMaterialApply')"
        >
          <template v-slot:icon>
            <i class="material-icons-round opacity-10 fs-5">dashboard</i>
          </template>
          <template v-slot:list>
            <li class="sub-item" @click="movePage('qCMaterialApply')">검사신청</li>
            <li class="sub-item" @click="movePage('qCMaterialInspec')">입고검사관리</li>
            <li class="sub-item" @click="movePage('qCMaterialRecord')">검사기록조회</li>
            <li class="sub-item" @click="movePage('qCMaterialFaulty')">불량내역조회</li>
          </template>
        </sidenav-collapse>
        <sidenav-collapse
            url="#"
            :aria-controls="''"
            v-bind:collapse="true"
            collapseRef="mainpage"
            navText="공정품질검사"
            @click="movePage('qCProcessCleanInspec')"
        >
          <template v-slot:icon>
            <i class="material-icons-round opacity-10 fs-5">dashboard</i>
          </template>
          <template v-slot:list>
            <li class="sub-item" @click="movePage('qCProcessCleanInspec')">세척검사관리</li>
            <li class="sub-item" @click="movePage('qCProcessBeverageInspec')">음료검사관리</li>
            <li class="sub-item" @click="movePage('qCProcessCleaningRecord')">세척검사기록조회</li>
            <li class="sub-item" @click="movePage('qCProcessCleaningFaulty')">세척검사불량내역조회</li>
            <li class="sub-item" @click="movePage('qCProcessBevarageRecord')">음료검사기록조회</li>
          </template>
        </sidenav-collapse>
        <sidenav-collapse
            url="#"
            :aria-controls="''"
            v-bind:collapse="true"
            collapseRef="mainpage"
            navText="포장품질검사"
            @click="movePage('qCPackingInspec')"
        >
          <template v-slot:icon>
            <i class="material-icons-round opacity-10 fs-5">dashboard</i>
          </template>
          <template v-slot:list>
            <li class="sub-item" @click="movePage('qCPackingInspec')">포장검사관리</li>
            <li class="sub-item" @click="movePage('qCPackingRecord')">검사기록조회</li>
            <li class="sub-item" @click="movePage('qCPackingFaulty')">불량내역조회</li>
          </template>
        </sidenav-collapse>
      </li>

      <!-- 설비 메뉴 -->
      <li v-else-if="headerMenu === $departments[5]" class="nav-item">
        <sidenav-collapse
            url="#"
            :aria-controls="''"
            v-bind:collapse="flase"
            collapseRef="mainpage"
            navText="설비 정보"
        >
          <template v-slot:icon>
            <i class="material-icons-round opacity-10 fs-5">dashboard</i>
          </template>
          <template v-slot:list>
            <li class="sub-item" @click="movePage('machineList')">설비 관리</li>
            <li class="sub-item" @click="movePage('partList')">부품 관리</li>
            <li class="sub-item" @click="movePage('inActList')">비가동 관리</li>
          </template>
        </sidenav-collapse>

        <sidenav-collapse
            url="#"
            :aria-controls="''"
            v-bind:collapse="true"
            collapseRef="mainpage"
            navText="정비 정보"
        >
          <template v-slot:icon>
            <i class="material-icons-round opacity-10 fs-5">dashboard</i>
          </template>
          <template v-slot:list>
            <li class="sub-item" @click="movePage('requestList')">정비 요청 내역</li>
            <li class="sub-item" @click="movePage('requestEnd')">정비 완료 내역</li>
          </template>
        </sidenav-collapse>
      </li>

      <li v-else-if="headerMenu === $departments[6]" class="nav-item">
        <sidenav-collapse 
            class="sub-item" @click="movePage('employeemanagement')"
            url=""
            :aria-controls="''"
            v-bind:collapse="false"
            collapseRef="mainpage"
            navText="사원 관리"
        >
          <template v-slot:icon>
            <i class="material-icons-round opacity-10 fs-5">dashboard</i>
          </template>
        </sidenav-collapse>
        <sidenav-collapse
            class="sub-item" @click="movePage('customermanagement')"
            url="#"
            :aria-controls="''"
            v-bind:collapse="false"
            collapseRef="mainpage"
            navText="거래처 관리"
        >
        <template v-slot:icon>
            <i class="material-icons-round opacity-10 fs-5">dashboard</i>
          </template>
        </sidenav-collapse>
        <sidenav-collapse
            class="sub-item" @click="movePage('bommanagement')"
            url="#"
            :aria-controls="''"
            v-bind:collapse="false"
            collapseRef="mainpage"
            navText="BOM 관리"
        >
        <template v-slot:icon>
            <i class="material-icons-round opacity-10 fs-5">dashboard</i>
          </template>
        </sidenav-collapse>
        <sidenav-collapse
            class="sub-item" @click="movePage('processflowmanagement')"
            url="#"
            :aria-controls="''"
            v-bind:collapse="false"
            collapseRef="mainpage"
            navText="공정 흐름도 관리"
        >
        <template v-slot:icon>
            <i class="material-icons-round opacity-10 fs-5">dashboard</i>
          </template>
        </sidenav-collapse>
        <sidenav-collapse
            class="sub-item" @click="movePage('productmanagement')"
            url="#"
            :aria-controls="''"
            v-bind:collapse="false"
            collapseRef="mainpage"
            navText="제품 관리"
        >
        <template v-slot:icon>
            <i class="material-icons-round opacity-10 fs-5">dashboard</i>
          </template>
        </sidenav-collapse>
        <sidenav-collapse
            class="sub-item" @click="movePage('materialmanagement')"
            url="#"
            :aria-controls="''"
            v-bind:collapse="false"
            collapseRef="mainpage"
            navText="자재 관리"
        >
        <template v-slot:icon>
            <i class="material-icons-round opacity-10 fs-5">dashboard</i>
          </template>
        </sidenav-collapse>
        <sidenav-collapse
            class="sub-item" @click="movePage('badcodemanagement')"
            url="#"
            :aria-controls="''"
            v-bind:collapse="false"
            collapseRef="mainpage"
            navText="불량 코드 관리"
        >
        <template v-slot:icon>
            <i class="material-icons-round opacity-10 fs-5">dashboard</i>
          </template>
        </sidenav-collapse>
        <sidenav-collapse
            class="sub-item" @click="movePage('returncodemanagement')"
            url="#"
            :aria-controls="''"
            v-bind:collapse="false"
            collapseRef="mainpage"
            navText="반품 코드 관리"
        >
        <template v-slot:icon>
            <i class="material-icons-round opacity-10 fs-5">dashboard</i>
          </template>
        </sidenav-collapse>
        <sidenav-collapse
            class="sub-item" @click="movePage('processstandardmanagement')"
            url="#"
            :aria-controls="''"
            v-bind:collapse="false"
            collapseRef="mainpage"
            navText="공정기준정보 관리"
        >
        <template v-slot:icon>
            <i class="material-icons-round opacity-10 fs-5">dashboard</i>
          </template>
        </sidenav-collapse>
        <sidenav-collapse
            class="sub-item" @click="movePage('warehousemanagement')"
            url="#"
            :aria-controls="''"
            v-bind:collapse="false"
            collapseRef="mainpage"
            navText="창고 관리"
        >
        <template v-slot:icon>
            <i class="material-icons-round opacity-10 fs-5">dashboard</i>
          </template>
        </sidenav-collapse>
      </li>

      
      <!-- 네비게이션바 항목 끝-->
    </ul>
    

  </div>
</template>
<script>
import SidenavCollapse from "./SidenavCollapse.vue";
import {mapState} from "vuex";

export default {
  name: "SidenavList",
  props: {
    cardBg: String,
  },
  data() {
    return {
      title: "Soft UI Dashboard PRO",
      controls: "dashboardsExamples",
      isActive: "active",
    };
  },
  components: {
    SidenavCollapse,
  },

  computed: {
    ...mapState(["headerMenu"]),
  },

  created() {
  },

  methods: {
    movePage(page) {
      this.$router.push({ name: page });
    }
  }
};
</script>
<style scoped>
.sub-item {
  font-size: 14px;
  cursor: pointer;
  border-left: 3px solid #ffa500;
  padding: 2px 1px 2px 4px;
  margin: 7px 6px 11px 32px;
}

.sub-item:hover {
  color: $orange !important;
}
</style>
