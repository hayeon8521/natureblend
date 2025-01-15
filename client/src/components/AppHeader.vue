<template>
    <header class="header-bar">

      <ul class="nav-list">
        <li v-for="(item, index) in navItems" :key="index" @click="handleClick(item)" :class="{ active: item.active }">
          {{ item.text }}
        </li>
      </ul>
      <ul class="button-container">
        <li class="button-contain">
          <buttonTemplet/>
        </li>
      </ul>
      <div>
        <ul class="navbar-nav justify-content-end">
          <li class="nav-item d-xl-none ps-3 d-flex align-items-center">
            <a
                href="#"
                @click="toggleSidebar"
                class="p-0 nav-link text-body lh-1"
                id="iconNavbarSidenav"
            >
              <div class="hamburger-menu">
                <div class="line"></div>
                <div class="line"></div>
                <div class="line"></div>
              </div>
            </a>
          </li>
        </ul>

      </div>
    </header>
  </template>
  
  <script>
  import {mapActions, mapMutations, mapState} from "vuex";
  import buttonTemplet from "@/views/standard/buttonTemplet.vue";

  export default {
    name: "AppHeader",
    components: {
      buttonTemplet
    },
    data() {
      return {
        navItems: [
          { text: "영업", active: false },
          { text: "자재", active: false },
          { text: "생산", active: false },
          { text: "품질", active: false },
          { text: "설비", active: false },
          { text: "기준정보", active: false },
          { text: "현황", active: false }
        ],
      };
    },
    methods: {
      ...mapMutations(["navbarMinimize"]),
      ...mapActions(["setHeaderMenu"]),
      

      handleClick(item) {
        // 사이드바 동작
        if(this.headerMenu == item.text) {
          console.log('동일 헤더 클릭');
          this.navbarMinimize();
        }
        else {
          console.log('다른 헤더 클릭');
          // 페이지 이동
          switch(item.text) {
            case '영업':
              this.movePage('orderForm');
              break;
            case '자재':
              this.movePage('materialLotqty');
              break;
            case '생산':
              this.movePage('productionPlanAdd');
              break;
            case '품질':
              this.movePage('qCMaterialApply');
              break;
            case '설비':
              this.movePage('machineList');
              break;
            case '기준정보':
              this.movePage('employeemanagement');
              break;
            case '현황':
              this.movePage('Factory');
              break;
          }

          const sidenav_show = document.querySelector(".g-sidenav-show");

          if (!sidenav_show.classList.contains("g-sidenav-pinned")) {
            this.navbarMinimize();
          }
        }

        this.navItems.forEach(i => i.active = false);
        item.active = true;
        this.setHeaderMenu(item.text)
      },

      toggleSidebar() {
        this.navbarMinimize();
      },

      // 헤더용 페이지 이동
      movePage(page) {
        this.$router.push({ name: page });
      },
    },

    computed: {
      ...mapState([
        "isAbsolute",
        "headerMenu",
        "sidebarState",
      ]),

      currentRouteName() {
        return this.$route.name;
      },
    },

  };
  </script>
  
  <style scoped>
  .header-bar {
    background-color: rgba(255, 166, 0, 0.87);
    padding: 10px 20px;
    width: 100%;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 16px;
    border-radius: 10px;
  }
  
  .logo {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-right: 20px;
  }
  
  .logo-img {
    width: 50px;
    height: 50px;
    object-fit: contain;
    vertical-align: middle;
    border-radius: 50%;
  }

  .nav-list {
    list-style-type: none;
    display: flex;
    justify-content: center;
    gap: 48px;
    flex-grow: 1;
    margin: 0;
    padding: 0;
  }

  .nav-list li {
    color: #fff;
    text-decoration: none;
    font-weight: bold;
    font-size: 26px;
    cursor: pointer;
  }

  .nav-list li:hover {
    text-decoration: underline;
  }
  .hamburger-menu {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 30px;
    height: 20px;
    cursor: pointer;
  }

  .hamburger-menu .line {
    height: 3px; /* 각 선의 높이 */
    background-color: #fff; /* 선의 색상 */
    border-radius: 2px; /* 둥근 모서리 */
  }
  @media all and (min-width:480px) and (max-width:767px) {
    .nav-list {
      gap: 16px;
      li {
        font-size: 20px;
      }
    }
  }
  .button-container {
    list-style-type: none;
    margin: 0;
  }
  .button-contain{
    width: 62px;
  }
  </style>