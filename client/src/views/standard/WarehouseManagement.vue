<!--창고 관리 메뉴-->
<template>
   <div class="partList container-fluid py-4">
    <div>
       <h3>&nbsp;&nbsp;창고 관리</h3>
    </div>
 <!-- 검색 메뉴 레이아웃 -->
 <div class="main-container">
    <div class="content" style="height: auto;  margin: 20px; padding-bottom: 30px;">
       <form class="row gx-3 gy-2 align-items-center">
         <div class="d-flex">
            <div class="p-2 flex-fill">
               <!-- 창고코드 -->
               <div class="col-sm-8">
                  <label class="col-form-label fw-bold" for="warehouseCode">창고코드</label>
                  <input type="text" class="form-control" style="background-color: white; padding-left: 20px;" id="warehouseCode" v-model="warehouseCode" >
               </div>
               <!-- 담당자 -->
               <div class="col-sm-8">
                  <label class="col-form-label fw-bold" for="empName">담당자</label>
                  <input type="text" class="form-control" style="background-color: white; padding-left: 20px;" id="empName" v-model="empName" >
               </div>
            </div>
            <div class="p-2 flex-fill">
               <!-- 창고명 -->
               <div class="col-sm-8">
                  <label class="col-form-label fw-bold" for="warehouseName">창고명</label>
                  <input type="text" class="form-control" style="background-color: white; padding-left: 20px;" id="warehouseName" v-model="warehouseName" >
               </div>
               <!-- 연락처 -->
               <div class="col-sm-8">
                  <label class="col-form-label fw-bold" for="empTel">연락처</label>
                  <input type="text" class="form-control" style="background-color: white; padding-left: 20px;" id="empTel" v-model="empTel" >
               </div>
            </div>
            <div class="p-2 flex-fill">
               <!-- 보관가능여부 -->
               <div class="col-sm-8">
                  <label class="col-form-label fw-bold" for="storage">보관가능여부</label>
                  <input type="text" class="form-control" style="background-color: white; padding-left: 20px;" id="storage" v-model="storage" >
               </div>
               <!-- 창고면적 -->
               <div class="col-sm-8">
                  <label class="col-form-label fw-bold" for="warehouseArea">창고면적</label>
                  <input type="text" class="form-control" style="background-color: white; padding-left: 20px;" id="warehouseArea" v-model="warehouseArea" >
               </div>
            </div>
            <div class="p-2 flex-fill">
               <!-- 창고위치 -->
               <div class="col-sm-8">
                  <label class="col-form-label fw-bold" for="warehouseLocation">창고위치</label>
                  <input type="text" class="form-control" style="background-color: white; padding-left: 20px;" id="warehouseLocation" v-model="warehouseLocation" >
               </div>
               <!-- 저장 버튼 -->
               <div class="col-sm-11">
                  <button style="position:relative;  top:45px;" type="button" class="btn btn-success me-5" @click="upin? input_update(2) : input_update(1)">등록/수정</button>
                  <button style="position:relative; width:120px ; top:45px;" type="button" class="btn btn-warning me-5" @click="refresh"  >새로고침</button>
               </div>
            </div>
         </div>
      </form>
    </div>
 </div>
 
 <!-- 검색 메뉴 레이아웃 끝 -->
 <div class="grid-container" style="padding-top: 10px;">
    <ag-grid-vue
       :rowData="rowData"
       :columnDefs="columnDefs"
       :theme="theme"
       :pagination="true"
       :paginationPageSize="10"
       @grid-ready="onReady"
       style="height: 513px;"
       rowSelection="multiple"
       @cellClicked="onCellClicked"

    > 
    </ag-grid-vue>
 </div>
 <deleteModal
      :showModal="showDeleteModal"
      @deleteConfirmed="onDeleteConfirmed"
      @deleteCancelled="onDeleteCancelled"
      style="z-index : '9999';"
 />
 </div>
 </template>
 
 <script>
 import axios from 'axios';
 import { ajaxUrl } from '@/utils/commons.js';
 // import userDateUtils from '@/utils/useDates.js';
 import theme from "@/utils/agGridTheme";
 import { mapMutations } from "vuex";
 import deleteModal from './deleteModal.vue';
 
 export default {
   components: {
      deleteModal, // 모달 컴포넌트 등록
   },
   data() {
     return {
        warehouseCode:'',
        warehouseName:'',
        storage:'',
        warehouseLocation:'',
        empName:'',
        empTel:'',
        warehouseArea:'',
        showDeleteModal: false, // 삭제 모달 표시 여부
        selectedWarehouse: null, // 선택된 창고 데이터
       columnDefs: [
         { headerName: "창고코드", field: "warehouse_code", width: 220 },
         { headerName: "창고명", field: "warehouse_name" },
         { headerName: "보관가능여부", field: "storage" },
         { headerName: "창고위치", field: "warehouse_location" },
         { headerName: "담당자", field: "emp_name" },
         { headerName: "연락처", field: "emp_tel" ,cellStyle: { textAlign: 'center' } },
         { headerName: "창고면적", field: "warehouse_area" ,cellStyle: { textAlign: 'right' }},
         {
           headerName: "창고삭제",
           field: "삭제",
           upin : '',
           cellStyle: { textAlign: 'center' },
           editable: false,
           cellRenderer: (params) => {
             const button2 = document.createElement('button');
             button2.innerText = '삭제';
             button2.style.marginRight = '10px';
             button2.style.cursor = 'pointer';
             button2.style.backgroundColor = '#f7b84d';
             button2.style.width = '60px';
             button2.style.height = '30px';
             button2.style.color = 'white';
             button2.style.border = 'none';
             button2.style.padding = '0';
             button2.style.borderRadius = '4px';
             button2.style.textAlign = 'center';
             button2.style.lineHeight = '30px';
             button2.addEventListener('click', () => {
               console.log("레코드 확인[삭제] : ", JSON.stringify(params.data));
               console.log("삭제할 창고코드 : ", params.data.warehouse_code);
               this.selectedWarehouse = params.data; // 삭제할 창고 선택
               this.showDeleteModal = true; // 모달 띄우기
             });
             return button2;
           }
         },
       ],
       newList: [],
       rowData: [], // 데이터 잡아넣을 그리드 api 행
       theme:theme,
     };
   },
   methods: {
      refresh(){
         this.warehouseList();
         this.upin = '';
         this.warehouseCode = '';
         this.warehouseName = '';
         this.storage = '';
         this.warehouseLocation = '';
         this.empName = '';
         this.empTel = '';
         this.warehouseArea = '';
      },
      onDeleteCancelled() {
         this.showDeleteModal = false; // 모달 닫기
      },
      async onDeleteConfirmed() {
      if (this.selectedWarehouse) {
        try {
          const res = await axios.delete(`${ajaxUrl}/warehouseDelete/${this.selectedWarehouse.warehouse_code}`);
          if (res.data === '성공') {
            this.$notify({ text: '창고가 삭제되었습니다.', type: 'success' });
            this.warehouseList(); // 삭제 후 목록 새로고침
          } else {
            this.$notify({ text: '삭제 실패.', type: 'error' });
          }
        } catch (error) {
          console.log(error);
          this.$notify({ text: '삭제 중 오류 발생', type: 'error' });
        }
      }
      this.showDeleteModal = false; // 모달 닫기
    },
      ...mapMutations(["addLoginInfo"]),
      async checkLogin(){
          this.loginInfo = this.$store.state.loginInfo;
          console.log('직업',this.loginInfo);
          if(this.loginInfo.job === '관리자'){
            console.log('성공');
          }else{
              this.$notify({ text: '관리자만 접속 가능', type: 'error' });
              this.$router.push({ name : 'MainPage' });
          }
      },

    async warehouseList(){ // 조회하기
        const result = await axios.get(`${ajaxUrl}/warehouseList`)
                                        .catch(err => console.log(err));
        this.rowData = result.data;
    },
     onReady(param) {
       param.api.sizeColumnsToFit(); // 그리드 api 넓이 슬라이드 안 생기게 하는 거
     },
     onCellClicked(params) {
        if(params.colDef.field !== '삭제'){
            console.log("레코드 확인[클릭] : ", JSON.stringify(params.data));
            this.warehouseCode = params.data.warehouse_code;
            this.warehouseName = params.data.warehouse_name;
            this.storage = params.data.storage;
            this.warehouseLocation = params.data.warehouse_location;
            this.empName = params.data.emp_name;
            this.empTel = params.data.emp_tel;
            this.warehouseArea = params.data.warehouse_area;
            this.upin = 'update';
        }
    },
    async warehouseInsert(newList){
           const result = await axios.post(`${ajaxUrl}/warehouseInsert`, newList)
                                       .catch(err => console.log(err));
           console.log(result.data);
           this.warehouseList();
    },
     input_update() {
       console.log('등록 또는 수정 기능여기서 추가');
       if(this.warehouseCode === '' || this.warehouseName === '' || this.storage === '' || this.warehouseLocation === '' || this.empName === '' || this.empTel === '' || this.warehouseArea === ''){
         this.$notify({ text: '빈칸을 입력해주세요.', type: 'error' });
           return;
       }
       this.newList = { warehouse_code : this.warehouseCode,
                        warehouse_name : this.warehouseName,
                        storage : this.storage,
                        warehouse_location : this.warehouseLocation,
                        emp_name : this.empName,
                        emp_tel : this.empTel,
                        warehouse_area : this.warehouseArea
       };
       if(this.upin === 'update'){
            this.$notify({ text: '수정되었습니다.', type: 'success' });
            this.warehouseInsert(this.newList);
         } else {
            this.$notify({ text: '등록되었습니다.', type: 'success' });
            this.warehouseInsert(this.newList);
         }
      //  this.warehouseInsert(this.newList);
       this.warehouseList();
     },
   },
   // 화면 생성되는 시점
   mounted() {
     // 전체조회 쿼리 실행
     this.checkLogin();
     this.warehouseList();
   },
 };
 </script>
 
 <style lang="scss" scoped>
 .main-container{
     background-color:  #e9ecef;
     margin-left: 20px;
     margin-right: 20px;
     margin-top: 0px;
     margin-bottom: 0px;
     border-radius: 10px;
 }
 .content{
    margin-left: 20px;
    margin-right: 20px;
    margin-top: 0px;
    margin-bottom: 0px;
    padding: 0px;
 }
 input {
       background-color: $white;
       border: solid 1px  ;
 }
 input:focus {
  background-color: #ffffff; /* 포커스 시 배경색 흰색 유지 */
  border-color: #86b7fe; /* 선택 시 테두리 색상 약간 강조 */
  outline: none; /* 기본 브라우저 포커스 아웃라인 제거 */
}
 </style>