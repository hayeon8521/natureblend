<template>
    <div class="login-container">
      <div class="login-form">
        <div class="d-flex justify-content-center align-items-center pb-3">
          <img src="http://yeonsus.com/moive/jussionejo_color.png" width="70" alt="Nature Blend" class="logimg">
            <h2 style="font-family: 'Roboto', Helvetica, Arial, sans-serif; margin: 0;">
              &nbsp;&nbsp;Nature Blend
            </h2>
        </div>
        <form @submit.prevent="eventLogin">
          <div class="form-group">
            <label for="username">사원번호</label>
            <input
              type="text"
              id="username"
              v-model="empnum"
              placeholder="사원번호를 입력하세요"
              required
            />
          </div>
  
          <div class="form-group">
            <label for="password">비밀번호</label>
            <input
              type="password"
              id="password"
              v-model="password"
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>
  
          <div v-if="errorMessage" class="error-message">
            <p>{{ errorMessage }}</p>
          </div>
  
          <div class="form-actions">
            <button type="submit" class="btn btn-success" @click="login">로그인</button>
          </div>
        </form>
  
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { ajaxUrl } from '@/utils/commons.js';

  import { mapMutations } from "vuex";

  
  export default {
    name: 'Login',
    data() {
      return {
        empnum: '',
        password: '',
        errorMessage: '',
      };
    },
    methods: {
      ...mapMutations(["addLoginInfo"]),
      async login() {
        const loginInfo = {
          empnum : this.empnum,
          password : this.password,
        };
        this.errorMessage = '';
        
        try {
        const result = await axios.post(`${ajaxUrl}/login`, loginInfo);
        console.log('abcd');
        // 로그인 성공 시 처리
        if (result && result.data && result.data[0] && result.data[0].name) {
          console.log('로그인성공');
          const loginObj = {
            emp_num: result.data[0].emp_num,
            name: result.data[0].name,
            birth: result.data[0].birth,
            tel: result.data[0].tel,
            job: result.data[0].job,
            job_num: result.data[0].job_num,
            position: result.data[0].position,
            employment_date: result.data[0].employment_date,
            resignation_date: result.data[0].resignation_date,
            level: result.data[0].level,
          };
          
          this.addLoginInfo(loginObj);
          console.log('로그인성공', loginObj);
          this.$router.push('/');   // 로그인 성공시 메인페이지로 이동

          // if (this.$store.state.loginInfo.name) {
          //   window.location.reload();
          // }
        } else {
          // 로그인 실패
          this.errorMessage = '아이디 또는 비밀번호가 잘못되었습니다.';
          // window.location.reload();
        }
      } catch (error) {
        this.errorMessage = '로그인 중 문제가 발생했습니다. 다시 시도해주세요.';
        console.error('로그인 오류: ', error);
        // window.location.reload();
      }
    },
      // async loginconfig() {
      //   if(this.$store.state.loginInfo.name){
      //     this.$router.push('/mainpage');
      //     //this.$router.push({name : 'MainPage'});
      //   }
      // },
    },
    mounted() { // 페이지 조회시 바로 발생
        console.log('로그인 테스트');
        //this.loginconfig();
    },
  };
  </script>
  
  <style scoped>
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  .login-container::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('@/assets/img/illustrations/login.webp');
    background-size: cover;
    background-position: center;
    opacity: 0.6; /* 투명도 설정 */
    z-index: -1; /* 배경을 뒤로 보냄 */
  }
  .login-form {
    background-color: #ffffffdd;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 400px;
  }
  
  .login-form h2 {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 5px;
  }
  
  .form-group input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
  }
  
  .error-message {
    color: red;
    font-size: 14px;
    margin-bottom: 15px;
  }
  
  .form-actions {
    text-align: center;
  }
  
  .form-actions button {
    width: 100%;
    padding: 10px;
    /* background-color: #007bff; */
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    box-shadow: 0px 0px 0px #fff;
  }
  
  .form-actions button:hover {
    background-color: #3e8d40;
  }
  
  .signup-link {
    text-align: center;
    margin-top: 15px;
  }
  
  .signup-link a {
    color: #007bff;
    text-decoration: none;
  }
  
  .signup-link a:hover {
    text-decoration: underline;
  }
  </style>
