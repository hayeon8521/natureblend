<!--
    달력사용하려했는데 실패 능력부족
-->
<template>
    <flat-pickr
        class="form-control custom-input"
        placeholder="📅  "
        v-model="selectedDate"
        :config="dateConfig"
    />
  </template>
  
  <script>
  import FlatPickr from 'vue-flatpickr-component';
  import 'flatpickr/dist/flatpickr.css';
  import { Korean } from 'flatpickr/dist/l10n/ko.js';
  
  export default {
    name: "FlatPickrCellRenderer",
    components: {
      FlatPickr,
    },
    props: {
      value: String, // 초기 값 (AG Grid에서 전달됨)
    },
    data() {
      return {
        date: this.value || null, // 초기 값 설정
        dateConfig: {
            defaultDate: null, // 기본 선택 날짜 없음
            enableTime: false, // 달력에 시간 표시 여부
            dateFormat: 'Y-m-d',  //날짜형식
            //dateFormat: 'Y-m-d H:i',  //날짜형식
            time_24hr: true, // 24시간 형
            locale: Korean, // 한국어 로케일 설정
            mode: 'single', // 단일 날짜 선택
            closeOnSelect: true, // 날짜 선택 시 달력 닫기
            allowInput: true, // 사용자가 직접 입력 가능
        },
      };
    },
    methods: {
      onDateSelected(selectedDates) {
        // AG Grid에 변경된 값 반영
        this.$emit('update', selectedDates[0] || null);
      },
    },
  };
  </script>
  
  <style scoped>
  .flatpickr-calendar {
    z-index: 10000; /* 모달 내부에서 FlatPickr가 제대로 표시되도록 설정 */
  }
  
  </style>
  