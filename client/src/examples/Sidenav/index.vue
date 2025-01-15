<template>
  <aside
    id="sidenav-main"
    class="fixed-start ms-3 sidenav navbar navbar-vertical navbar-expand-xs border-0 border-radius-xl my-3 ms-3"
    :class="`${sidebarType} ${isModalOpen && 'modal-back'}`"
  >
    <div class="sidenav-header">
      <i
        class="top-0 p-3 cursor-pointer fas fa-times text-secondary opacity-5 position-absolute end-0 d-none d-xl-none"
        aria-hidden="true"
        id="iconSidenav"
      ></i>
      <a class="m-0 p-3 navbar-brand" href="#" @click.prevent="handleResetAndNavigate">
        <span class="text-2xl font-weight-bold text-white">
          <div class="d-flex justify-content-center align-items-center pb-3">
          <img src="http://yeonsus.com/moive/jussionejo_color.png" width="60" alt="Nature Blend" class="logimg">
            <span style="margin: 0;">
              Nature Blend
            </span>
        </div>
        </span>
      </a>
    </div>
    <hr class="horizontal light mt-0 mb-2" />
    <sidenav-list />
  </aside>
</template>
<script>
import SidenavList from "./SidenavList.vue";
import logo from "@/assets/img/logo-ct.png";
import logoDark from "@/assets/img/logo-ct-dark.png";
import { mapState, mapMutations } from "vuex";

export default {
  name: "index",
  components: {
    SidenavList,
  },
  data() {
    return {
      logo,
      logoDark,
    };
  },
  computed: {
    // 사이드바 테마 설정
    ...mapState(["sidebarType", "isDarkMode", 'isModalOpen']),
  },

  methods: {
    ...mapMutations(["resetState"]),
    handleResetAndNavigate() {
      this.resetState(); // Vuex 상태 초기화
      this.$router.push("/"); // 라우터 이동
    },
  }
};
</script>

<style scoped>
  .logimg {
    position: relative;
    top: -5px;
    left: -9px;
  }
</style>