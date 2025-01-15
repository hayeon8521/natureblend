// 생산 라우터

import ProductionPlanList from '@/views/production/ProductionPlanList.vue';
import productionPlanAdd from "@/views/production/productionPlanAdd/PlanAdd.vue";
import productionOrderList from "@/views/production/ProductionOrderList.vue";
import productionOrderAdd from "@/views/production/ProductionOrderAdd/OrderAdd.vue";
import workingList from "@/views/production/workList/workingList.vue";
import productionWorkDoneList from "@/views/production/workPerfomance/productionWorkDoneList.vue";

import store from '@/store/index.js'
import { notify } from "@kyvg/vue3-notification";

const prodLv2Access = [
  'productionPlanAdd',
  'productionOrderAdd'
]

const checkAuth = (to, next) => {
  if(!store.state.loginInfo.name) {
    notify({
      title: "로그인요청",
      text: "로그인이 필요한 페이지입니다.",
      type: 'error',
    });
    next(false)
  } else if(store.state.loginInfo.job_num !== 2 && store.state.loginInfo.level !== 3) {
    notify({
      title: "로그인요청",
      text: "생산팀 또는 관리자만 접속 가능합니다.",
      type: 'error',
    });
    next(false)
  } else if(prodLv2Access.includes(to.name) && store.state.loginInfo.level === 1) {
    notify({
      title: "로그인요청",
      text: "생산반장 또는 관리자만 접속 가능합니다.",
      type: 'error',
    });
    next(false)
  } else {
    next()
  }
}

const productionRoute = [
  {
    path: '/',
    name: 'productionPlanList',
    redirect : { name : 'productionPlanList'},
    beforeEnter: (to, from, next) => {
      checkAuth(to, next)
    }
  },
  {
    path: 'plan/list',
    name: 'productionPlanList',
    component: ProductionPlanList,
    beforeEnter: (to, from, next) => {
      checkAuth(to, next)
    }
  },
  {
    path: 'plan/add',
    name: 'productionPlanAdd',
    component: productionPlanAdd,
    beforeEnter: (to, from, next) => {
      checkAuth(to, next)
    }
  },
  {
    path: 'order/list',
    name: 'productionOrderList',
    component: productionOrderList,
    beforeEnter: (to, from, next) => {
      checkAuth(to, next)
    }
  },
  {
    path: 'order/add',
    name: 'productionOrderAdd',
    component: productionOrderAdd,
    beforeEnter: (to, from, next) => {
      checkAuth(to, next)
    }
  },
  {
    path: 'working/list',
    name: 'workingList',
    component: workingList,
    beforeEnter: (to, from, next) => {
      checkAuth(to, next)
    }
  },
  {
    path: 'workdone/list',
    name: 'productionWorkDoneList',
    component: productionWorkDoneList,
    beforeEnter: (to, from, next) => {
      checkAuth(to, next)
    }
  },
];

export default productionRoute;