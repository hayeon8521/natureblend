<template>
  <div v-if="loginData.name" class="wellcom-login" style="position: absolute; right: 90px; top: 37px; font-weight: bold; color: white;">
    [ {{ this.$store.state.loginInfo.name }}({{ this.$store.state.loginInfo.position }}) ]
  </div>
  <button  class="btn btn-success wellcom-btn" style="top: 8px; height: 30px; width: 65px; display: flex; align-items: center; justify-content: center;" v-if="loginData.name" @click="logout">
    Logout
  </button>
  <button class="btn-success" v-else @click="login">
    Login
  </button>
  <!-- <button  v-if="loginData.name" @click="logout" type="button" class="btn" style="top:5px; background-color: #f44335; color: white; width: 140px; height: 30px; display: flex; align-items: center; justify-content: center; margin-left: 30px;">
      공정별 현황보기
  </button> -->
</template>

<script>
  import axios from 'axios';
  import { ajaxUrl } from '@/utils/commons.js';
  import { mapMutations } from "vuex";
  
  export default {
    data() {
      return {
        loginData:{},
      };
    },
    watch:{
        loginData:{},
    },
    methods: {
        ...mapMutations(["addLoginInfo", "resetState"]),
      async loginconfig() {
        console.log('eee',this.$store.state.loginInfo.name);
        this.loginData = await this.$store.state.loginInfo;
        // const result = await axios.get(`${ajaxUrl}/loginconfig`)
        //                           .catch(err => console.log(err));
        // console.log('세션 출력',result.data);
        // this.loginData = result.data;
        // console.log(this.loginData);
      },

    //   async logout() {
    //     if(this.loginData.name){
    //         const loginObj = {
    //             emp_num: 0,
    //             name: '',
    //             birth: '',
    //             tel: '',
    //             job: '',
    //             job_num: 0,
    //             position: '',
    //             employment_date: '',
    //             resignation_date: '',
    //             level: 0,
    //             };
    //           this.addLoginInfo(loginObj);
    //           console.log('로그인이름',this.$store.state.loginInfo.name);
    //           // if(!this.$store.state.loginInfo.name){
    //           //     this.$router.push({name : 'login'});
    //           // }
              
    //           //this.$router.push({name : 'MainPage'});
    //           window.location.reload();
    //     }
    //     // try {
    //     //   const result = await axios.post(`${ajaxUrl}/logout`);
    //     //   if (result.data === '로그아웃'){
    //     //       console.log('로그아웃 성공', result.data);
    //     //       this.loginData = {};  // 로그아웃 후 세션 초기화
    //     //       const loginObj = {
    //     //         emp_num: 0,
    //     //         name: '',
    //     //         birth: '',
    //     //         tel: '',
    //     //         job: '',
    //     //         job_num: 0,
    //     //         position: '',
    //     //         employment_date: '',
    //     //         resignation_date: '',
    //     //         level: 0,
    //     //         };
    //     //       this.addLoginInfo(loginObj);
    //     //       console.log(this.loginData);
    //     //       this.$router.push({name : 'login'});
              
    //     //   }
    //     // } catch (err) {
    //     //   console.log('로그아웃 실패', err);
    //     // }
    // },


    async logout() {
      try {
        if (this.loginData.name) {
          const result = await axios.post(`${ajaxUrl}/logout`);
          if (result.data === '로그아웃') {
            console.log('로그아웃 성공', result.data);

            // 로그인 데이터 초기화
            const loginObj = {
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
            };

            this.addLoginInfo(loginObj); // Vuex 상태 초기화
            this.resetState(null);  //헤더메뉴 초기화
            this.loginData = {}; // 로컬 상태 초기화

            this.$router.push({ name: 'MainPage' });
            console.log('로그인이름', this.$store.state.loginInfo.name);

            //로그아웃하면 페이지 리다액션 필요없음 이제
            // 페이지 리다이렉션
            //this.$router.push('/');
            //window.location.reload();
          }
        }
      } catch (err) {
        console.error('로그아웃 실패', err);
        //alert('로그아웃 중 문제가 발생했습니다. 다시 시도해주세요.');
      }
    },


    async login(){
        this.$router.push({name : 'login'});
    }

      

  },
  mounted() { // 페이지 조회시 바로 발생
        console.log('로그인 테스트');
        this.loginconfig();
    },
};
</script>
<style scoped>
@media all and (min-width:480px) and (max-width:1201px) {
    .wellcom-login {
      display: none;
    }
}
.wellcom-btn {
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5); /* 우측 아래 하얀색 그림자 */
}
.wellcom-btn:hover {
  color: rgba(0, 0, 0, 0.5);
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5); /* 우측 아래 하얀색 그림자 */
}
</style>