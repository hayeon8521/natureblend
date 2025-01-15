<template>
    <div class="modal fade" @click.self="closeModal" :class="{ show: isShowModal }" id="exampleModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header" style ="background-color: #e9ecef;">
            <h1 class="modal-title fs-5" id="exampleModalLabel">자재 선택</h1>
          </div>
          <div class="modal-body">
            <slot name="list"></slot>
            <div class="mb-1">
              <label for="searchInput" class="form-label"></label>
              <input type="text" v-model="search" class="text-center styled-input" placeholder="검색" />
              <!-- 자재 코드 조회 리스트 -->
              <div class="grid-container" >
                <ag-grid-vue 
                  style ="width: 100%;  "
                  :rowData="rowData"
                  :columnDefs="columnDefs"
                  :theme="theme"
                  :pagination="true"
                  :paginationPageSize="10"
                  @grid-ready="onReady"
                  @rowClicked="onRowClicked"
                  :quickFilterText="search"
              >
              <!-- quickFilterText 검색기능 -->
                </ag-grid-vue>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="closeModal">닫기</button>
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
      isShowModal: Boolean,
      modalTitle: String,
      // noBtn: String,
      // yesBtn: String,
      // modalData: Array,
    },
  
    data() {
      return {
        search:null,
        theme: theme,
        rowData:[], // [] 배열 {} 객체
        columnDefs:[
          { headerName:"자재코드",field:"material_code" },
          { headerName:"자재명",field:"material_name" },
        ],
        quickFilterText: '',
        bomInput:[],
        // modalState: this.isShowModal,
      };
    },
    watch : {
      modalTitle(){
        console.log('확인용');
        this.materialSelect();
      },
    },
    created(){
      this.materialSelect();
    },
    methods: {
      closeModal() {
        this.$emit('closeModal')
      },
      onRowClicked(row) {
        console.log('클릭된 데이터 : ', row.data);
        let bom = row.data;
        this.$emit( 'selectMaterial', { material_code : bom.material_code,
                                        material_name : bom.material_name
          }
        )
      },
      getSelectedProduct() {
          return this.rowData[0];
      },
      async materialSelect() {
        let result = await axios.get(`${ajaxUrl}/materialSelect`)
        if(result && result.data){
          console.log("연결성공");
          this.rowData = result.data;
        }else {
          console.log("연결실패");
        }
      },
    }
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
  #searchInput {
    /* text-align: center; */
    margin: auto;
  }
  .styled-input {
    display: block; /* 가운데 정렬을 위한 블록 처리 */
    margin: 0 auto; /* 부모 컨테이너 기준 가운데 정렬 */
    margin-top: 10px;
    padding: 10px; /* 안쪽 여백 */
    width: 250px; /* 입력 필드 너비 */
    text-align: center; /* 텍스트 가운데 정렬 */
    border: 1px solid #ccc; /* 테두리 */
    border-radius: 20px; /* 테두리 둥글게 */
    outline: none; /* 포커스 시 기본 테두리 제거 */
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* 약간의 그림자 */
    transition: box-shadow 0.3s ease; /* 호버 효과 추가 */
}

/* 포커스 또는 호버 상태에서 효과 */
.styled-input:focus,
.styled-input:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2); /* 더 강한 그림자 */
    border-color: #007bff; /* 포커스 시 테두리 색상 변경 */
}
  </style>