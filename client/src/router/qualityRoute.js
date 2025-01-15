// 품질 라우터

/*
  파일명 : QualityRoute.js
  작성자 : 이신화
  개요   : 품질 라우터
  작성일 : 2024-12-12
*/

// import QualityList from '../views/quality/QualityList.vue';
// import QualityList2 from '@/views/quality/QualityList2.vue';
// import QualityList3 from '@/views/quality/QualityList3.vue';
// import QualityList4 from '@/views/quality/QualityList4.vue';

//입고(자재)검사
//신청(등록)
import QCMaterialApply from '@/views/quality/qMaterial/QCMaterialApply.vue';
//검사처리(검사기록수정 및 불량등록)
import QCMaterialInspec from '../views/quality/qMaterial/QCMaterialInspec.vue';
//검사기록조회
import QCMaterialRecord from '../views/quality/qMaterial/QCMaterialRecord.vue';
//불량내역조회
import QCMaterialFaulty from '../views/quality/qMaterial/QCMaterialFaulty.vue';

//공정검사
//세척검사처리
import QCProcessCleanInspec from '../views/quality/qProcess/QCProcessCleanInspec.vue';
//음료검사처리
import QCProcessBeverageInspec from '../views/quality/qProcess/QCProcessBeverageInspec.vue';
//세척검사기록조회
import QCProcessCleaningRecord from '../views/quality/qProcess/QCProcessCleaningRecord.vue';
//세척검사 불량내역조회
import QCProcessCleaningFaulty from '../views/quality/qProcess/QCProcessCleaningFaulty.vue';
//음료검사기록조회
import QCProcessBevarageRecord from '../views/quality/qProcess/QCProcessBevarageRecord.vue';

//포장검사
//검사처리
import QCPackingInspec from '../views/quality/qPacking/QCPackingInspec.vue';
//검사기록조회
import QCPackingRecord from '../views/quality/qPacking/QCPackingRecord.vue';
//불량내역조회
import QCPackingFaulty from '../views/quality/qPacking/QCPackingFaulty.vue';
import store from '@/store/index.js'
import { notify } from "@kyvg/vue3-notification";

const checkAuth = (to, next) => {
  if(!store.state.loginInfo.name) {
    notify({
      title: "로그인요청",
      text: "로그인이 필요한 페이지입니다.",
      type: 'error',
    });
    next(false)
  } else if(store.state.loginInfo.job_num !== 4 && store.state.loginInfo.level !== 3) {
    notify({
      title: "로그인요청",
      text: "품질팀 또는 관리자만 접속 가능합니다.",
      type: 'error',
    });
    next(false)
  } else {
    next()
  }
}

const qualityRoute = [
  //입고검사 
  // - 신청
  {
    path: '/',
    redirect : { name : 'qualityList'},
    name: 'qualityList',
    beforeEnter: (to, from, next) => {
      checkAuth(to, next)
    }
  },
  {
    path: 'material',
    redirect : { name : 'qualityList'},
    beforeEnter: (to, from, next) => {
      checkAuth(to, next)
    }
  },
  {
    path: 'material/apply',
    name: 'qCMaterialApply',
    component: QCMaterialApply,
    beforeEnter: (to, from, next) => {
      checkAuth(to, next)
    }
  },
  // - 검사 처리
  {
    path: 'material/inspec',
    name: 'qCMaterialInspec',
    component: QCMaterialInspec,
    beforeEnter: (to, from, next) => {
      checkAuth(to, next)
    }
  },
  // - 검사 기록 조회
  {
    path: 'material/record',
    name: 'qCMaterialRecord',
    component: QCMaterialRecord,
    beforeEnter: (to, from, next) => {
      checkAuth(to, next)
    }
  },
  // - 불량 내역 조회
  {
    path: 'material/faulty',
    name: 'qCMaterialFaulty',
    component: QCMaterialFaulty,
    beforeEnter: (to, from, next) => {
      checkAuth(to, next)
    }
  },

  //  공정검사
  {
    path: 'process',
    redirect : { name : 'qCProcess'},
    beforeEnter: (to, from, next) => {
      checkAuth(to, next)
    }
  },
  {
    path: 'process/inspec',
    redirect : { name : 'qCProcessCleanInspection'},
    beforeEnter: (to, from, next) => {
      checkAuth(to, next)
    }
  },

  // - 세척 검사 처리
  {
    path: 'process/inspec/clean',
    name: 'qCProcessCleanInspec',
    component: QCProcessCleanInspec,
    beforeEnter: (to, from, next) => {
      checkAuth(to, next)
    }
  },
  // - 음료 검사 처리
  {
    path: 'process/inspec/beverage',
    name: 'qCProcessBeverageInspec',
    component: QCProcessBeverageInspec,
    beforeEnter: (to, from, next) => {
      checkAuth(to, next)
    }
  },
  // -세척 검사 기록 조회
  {
    path: 'process/record/cleaning',
    name: 'qCProcessCleaningRecord',
    component: QCProcessCleaningRecord,
    beforeEnter: (to, from, next) => {
      checkAuth(to, next)
    }
  },
  // - 세척 불량 내역 조회
  {
    path: 'process/faulty/cleaning',
    name: 'qCProcessCleaningFaulty',
    component: QCProcessCleaningFaulty,
    beforeEnter: (to, from, next) => {
      checkAuth(to, next)
    }
  },
  // - 음료 검사 기록 조회
  {
    path: 'process/record/bevarage',
    name: 'qCProcessBevarageRecord',
    component: QCProcessBevarageRecord,
    beforeEnter: (to, from, next) => {
      checkAuth(to, next)
    }
  },


  // 포장검사
  {
    path: 'packing',
    redirect : { name : 'qCPackingInspec'},
    beforeEnter: (to, from, next) => {
      checkAuth(to, next)
    }
  },
  // - 포장 검사 처리
  {
    path: 'packing/inspec',
    name: 'qCPackingInspec',
    component: QCPackingInspec,
    beforeEnter: (to, from, next) => {
      checkAuth(to, next)
    }
  },
  // - 검사 기록 조회
  {
    path: 'packing/record',
    name: 'qCPackingRecord',
    component: QCPackingRecord,
    beforeEnter: (to, from, next) => {
      checkAuth(to, next)
    }
  },
  // - 불량 내역 조회
  {
    path: 'packing/faulty',
    name: 'qCPackingFaulty',
    component: QCPackingFaulty,
    beforeEnter: (to, from, next) => {
      checkAuth(to, next)
    }
  },



];

export default qualityRoute;
