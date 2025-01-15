<template>
    <div>
        <h1>테스트</h1>
    </div>
</template>

<script>
  import axios from 'axios';
  import { ajaxUrl } from '@/utils/commons.js';

  
  export default {
    data() {
      return {
      };
    },
    methods: {
      async loginconfig() {
        const result = await axios.get(`${ajaxUrl}/loginconfig`)
                                  .catch(err => console.log(err));
        console.log('세션 출력',result.data);
      },

      

  },
  mounted() { // 페이지 조회시 바로 발생
        console.log('로그인 테스트');
        this.loginconfig();
    },
};
</script>