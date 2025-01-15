<!-- 공정흐름도 모달에서 공정추가를 눌렀을때 추가할 공정을 선택할수있는 모달 -->
<template>
    <div class="modal fade" @click.self="closeModal2" :class="{ show: isShowModal2 }" id="exampleModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">{{ modalTitle2 }}</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <slot name="list"></slot>
            <div class="mb-1">
              <!-- 공정 조회  -->
              <div class="grid-container" >
                <ag-grid-vue 
                  style ="width: 100%; margin-bottom: 15px;"
                  :rowData="rowData"
                  :columnDefs="columnDefs"
                  :theme="theme"
                  :pagination="true"
                  :paginationPageSize="5"
                  @grid-ready="onReady"
                  @rowClicked="onRowClicked"
              >
                </ag-grid-vue>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="closeModal2">닫기</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  <script>
    import theme from "@/utils/agGridTheme";
    import { ajaxUrl } from '@/utils/commons.js';
    import axios from 'axios';
  
  export default {
    name: "Modal",
    props: {
      isShowModal2: Boolean,
      modalTitle2: String,
      // noBtn: String,
      // yesBtn: String,
      // modalData: Array,
    },
    watch : {
        modalTitle2(){
            console.log('로그');
        },
    },
    data() {
      return {
        theme: theme,
        rowData:[],
        process:[],
        columnDefs:[
            { headerName:"공정코드" , field:"process_code" },
            { headerName:"공정명" , field:"process_name" },
        ],
      };
    },
    onReady(param) {
        param.api.sizeColumnsToFit();
    },
    created(){
    },
    methods: {
      closeModal2() {
        this.$emit('closeModal2');
        console.log('닫기클릭확인');
      },
      onRowClicked(row) {
        console.log('클릭된 데이터 : ', row.data);
        this.$emit( 'selectItem', { process_code : row.data.process_code,
                                    process_name : row.data.process_name,
          }
        )
        this.closeModal2();
      },
      async processList(){
        console.log('리스트 조회전 연결 콘솔 확인');
        let result = await axios.get(`${ajaxUrl}/processList`)
        if(result && result.data){
          this.process = result.data;
          this.rowData = result.data;
          console.log("연결성공");
        }else {
          console.log("연결실패");
        }
      },
      // async processAdd(){ // 흐름도에 공정 추가

      // },
      getSelectedProcess() {
          return this.rowData[0];
      },
    },
    mounted() { // 페이지 조회시 바로 발생
      this.processList();
    },
  }
  </script>
  
  <style scoped>
  .modal-dialog {
    max-width: 30%;
  }
  .modal-body{
    background-color: white;
  }
  .modal-body .form-control {
      width: 100px;
      max-width: 300px; /* 최대 너비 제한 */
      height: 45px;
      background-color: white;
  }
  .modal {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    .modal-body {
      max-height: 500px;
    }
  }
  .show {
    display: block;
  }
  button {
    font-size: 16px;
  }
b, strong {
    font-weight: 700;
    color: white;
}
.mt-3 {
    margin-top: 1rem !important;
    color: white;
}
  </style>
