<template>
  <flat-pickr
    class="form-control custom-input"
    placeholder="📅  "
    v-model="selectedDate"
    :config="dateConfig"
  />
  {{ selectedDate }}
</template>

<script>
import FlatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import { Korean } from 'flatpickr/dist/l10n/ko.js';

export default {
  components: { FlatPickr },
  data() {
    return {
      selectedDate: null,
      dateConfig: {
        defaultDate: null, // 기본 선택 날짜 없음
        enableTime: false, // 달력에 시간 표시 여부
        dateFormat: 'Y-m-d',  //날짜형식
        //dateFormat: 'Y-m-d H:i',  //날짜형식
        time_24hr: true, // 24시간 형
        locale: Korean, // 한국어 로케일 설정
        mode: 'single', // 단일 날짜 선택
        closeOnSelect: true, // 날짜 선택 시 달력 닫기
      },
    };
  },
};
</script>
<style scoped>
.custom-input::placeholder {
  text-align: right;
}
.custom-input {
  width: 200px;
  background-color: white;
  border: solid 1px;
  text-align: center;
}
.flatpickr-calendar {
  z-index: 10000; /* 모달 내부에서 FlatPickr가 제대로 표시되도록 설정 */
}
</style>