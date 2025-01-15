import { createStore } from "vuex";
import createPersistedState from 'vuex-persistedstate';

// 전체 상태값

export default createStore({
  state: {
    hideConfigButton: false,
    isPinned: true,
    showConfig: false,
    sidebarType: "bg-white",
    color: "warning",
    isNavFixed: false,
    isAbsolute: false,
    showNavs: true,
    showSidenav: true,
    showNavbar: true,
    showFooter: true,
    showMain: true,
    isDarkMode: false,
    loginInfo: {
      emp_num: 0,
      name: '',
      birth: '',
      tel: '',
      job: '',
      job_num: 0,
      position: '',
      employment_date: '',
      resignation_date: '',
      level: 0,
    },
    navbarFixed:
      "position-sticky blur shadow-blur left-auto top-1 z-index-sticky px-0 mx-4",
    absolute: "position-absolute px-4 mx-0 w-100 z-index-2",
    headerMenu: '',
  },
  mutations: {
    toggleConfigurator(state) {
      state.showConfig = !state.showConfig;
    },
    navbarMinimize(state) {
      const sidenav_show = document.querySelector(".g-sidenav-show");

      if (sidenav_show.classList.contains("g-sidenav-pinned")) {
        sidenav_show.classList.remove("g-sidenav-pinned");
        state.isPinned = true;
      } else {
        sidenav_show.classList.add("g-sidenav-pinned");
        state.isPinned = false;
      }
    },
    navbarFixed(state) {
      if (state.isNavFixed === false) {
        state.isNavFixed = true;
      } else {
        state.isNavFixed = false;
      }
    },
    toggleEveryDisplay(state) {
      state.showNavbar = !state.showNavbar;
      state.showSidenav = !state.showSidenav;
      state.showFooter = !state.showFooter;
    },
    toggleHideConfig(state) {
      state.hideConfigButton = !state.hideConfigButton;
    },
    color(state, payload) {
      state.color = payload;
    },
    selectHeaderMenu(state, headerMenu) {
      state.headerMenu = headerMenu;
    },
    //로그인하면 테이터 바꾸는거
    addLoginInfo(state, loginObj) {
      state.loginInfo = {
        ...state.loginInfo, // 기존 데이터 유지
        ...loginObj,        // 새로운 데이터 추가 또는 업데이트
      };
    },
    // 상태 초기화
    resetState(state) {
      state.headerMenu = '';
    },
  },
  actions: {
    setColor({ commit }, payload) {
      commit("color", payload);
    },
    setHeaderMenu({commit}, headerMenu) {
      commit("selectHeaderMenu", headerMenu);
    },
    // loginInfo(context, loginobj){
    //   context.commit('loginInfo', loginobj);
    // },
  },
  plugins:[createPersistedState()],
  getters: {},
});
