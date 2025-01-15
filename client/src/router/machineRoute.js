/*
  파일명 : machineRoute.js
  작성자 : 김선용
  개요   : 설비 라우터
  작성일 : 2024-12-12
*/

import MachineList from '@/views/machine/MachineList.vue';
import MachineInfo from '@/views/machine/MachineInfo.vue';
import PartList from '@/views/machine/PartList';
import InActList from '@/views/machine/InActList';
import RequestList from '@/views/machine/RequestList';
import RequestEnd from '@/views/machine/RequestEnd';
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
  } else if(store.state.loginInfo.job_num !== 5 && store.state.loginInfo.level !== 3) {
    notify({
      title: "로그인요청",
      text: "설비팀 또는 관리자만 접속 가능합니다.",
      type: 'error',
    });
    next(false)
  } else {
    next()
  }
}
const machineRoute = [
  {
    path: '/',
    name: 'machineList',
    redirect : { name : 'machineList'},
    beforeEnter: (to, from, next) => {
      checkAuth(to, next)
    }
  },
  
  // 설비 페이지
  {
    path: 'list',
    name: 'machineList',
    component: MachineList,
    // beforeEnter: (to, from, next) => {
    //   checkAuth(to, next)
    // }
  },
  {
    path: 'machineInfo/:mno',
    name: 'machineInfo',
    component: MachineInfo,
    // beforeEnter: (to, from, next) => {
    //   checkAuth(to, next)
    // }
  },

  // 부품 페이지
  {
    path: 'partList',
    name: 'partList',
    component: PartList,
    beforeEnter: (to, from, next) => {
      checkAuth(to, next)
    }
  },

  // 비가동 페이지
  {
    path: 'inActList',
    name: 'inActList',
    component: InActList,
    beforeEnter: (to, from, next) => {
      checkAuth(to, next)
    }
  },

  // 정비 페이지
  {
    path: 'requestList',
    name: 'requestList',
    component: RequestList,
    // beforeEnter: (to, from, next) => {
    //   checkAuth(to, next)
    // }
  },
  {
    path: 'requestEnd',
    name: 'requestEnd',
    component: RequestEnd,
    beforeEnter: (to, from, next) => {
      checkAuth(to, next)
    }
  },

  // 테스트용


];

export default machineRoute;



