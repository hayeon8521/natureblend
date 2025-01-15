<!--자재 관리 메뉴-->
<template>
   <div class="partList container-fluid py-4">
    <div>
       <h3>&nbsp;&nbsp;반품코드 관리</h3>
    </div>
 <!-- 검색 메뉴 레이아웃 -->
 <div class="main-container">
    <div class="content" style="height: 130px; margin: 20px;">
       <form class="row gx-3 gy-2 align-items-center">
          <!-- 반품코드 -->
          <div class="col-sm-2">
             <label class="col-form-label fw-bold" for="returnCode">반품코드</label>
             <input type="text" class="form-control" style="background-color: white; padding-left: 20px;" id="returnCode" v-model="returnCode" >
          </div>
 
          <!-- 반품사유 -->
          <div class="col-sm-2">
             <label class="col-form-label fw-bold" for="returnReason">반품사유</label>
             <input type="text" class="form-control" style="background-color: white; padding-left: 20px;" id="returnReason" v-model="returnReason" >
          </div>

          <!-- 저장 버튼 -->
          <div class="col-sm-3">
             <button style="position:relative; top:29px;" type="button" class="btn btn-success me-5" @click="upin? input_update(2) : input_update(1)">등록/수정</button>
             <button style="position:relative; width:120px ; top:29px;" type="button" class="btn btn-warning me-5" @click="refresh"  >새로고침</button>
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
 </div>
 <deleteModal
      :showModal="showDeleteModal"
      @deleteConfirmed="onDeleteConfirmed"
      @deleteCancelled="onDeleteCancelled"
 />
 </template>
 <script>
 import axios from 'axios';
 import { ajaxUrl } from '@/utils/commons.js';
 // import userDateUtils from '@/utils/useDates.js';
 import theme from "@/utils/agGridTheme";
 import { mapMutations } from "vuex";
 import deleteModal from './deleteModal.vue';
 
 export default {
   components:{
      deleteModal,
   },
   data() {
     return {
       returnCode: '',   // 반품코드
       returnReason: '',  // 반품사유
       showDeleteModal: false, // 삭제 모달 표시 여부
       selectedCode: null,
       columnDefs: [
         { headerName: "반품코드", field: "return_code", width: 220 },
         { headerName: "반품사유", field: "return_reason" },
         {
           headerName: "반품코드삭제",
           field: "삭제",
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
               this.selectedCode = params.data;
               this.showDeleteModal = true;
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
      onDeleteCancelled(){
         this.showDeleteModal = false;
      },
      async onDeleteConfirmed(){
         if(this.selectedCode){

                    axios.delete(`${ajaxUrl}/returnDelete/${this.selectedCode.return_code}`)
                    .then(res => {
                        if(res.data === '성공'){
                           this.$notify({ text: '코드가 삭제되었습니다.', type: 'success' });
                            this.returnList();
                        }else{
                           this.$notify({ text: '삭제실패.', type: 'error' });
                        }
                    })
                    .catch(err => console.log(err));
                    this.showDeleteModal = false;
         }
      },
      refresh(){
         this.returnList();
         this.upin = '';
         this.returnCode = '';
         this.returnReason = '';
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
    async returnList(){ // 조회
        const result = await axios.get(`${ajaxUrl}/returnList`)
                                    .catch(err => console.log(err));
        this.rowData = result.data;
    },
     onReady(param) {
       param.api.sizeColumnsToFit(); // 그리드 api 넓이 슬라이드 안 생기게 하는 거
     },
     onCellClicked(params){
        if(params.colDef.field !== '삭제'){
            console.log("레코드 확인[클릭] : " , JSON.stringify(params.data));
            this.returnCode = params.data.return_code;
            this.returnReason = params.data.return_reason;
            this.upin = 'update';
        }
     },
     async returnInsert(newList){
        const result = await axios.post(`${ajaxUrl}/returnInsert`, newList)
                                  .catch(err => console.log(err));
                                  console.log(result.data);
            this.returnList();

     },
     input_update() {
       console.log('등록 또는 수정 기능여기서 추가');
       if(this.returnCode === '' || this.returnReason === ''){
         this.$notify({ text: '빈칸을 입력해주세요.', type: 'error' });
           return;
       }
       this.newList = {
        return_code : this.returnCode,
        return_reason : this.returnReason
       };
       if(this.upin === 'update'){
            this.$notify({ text: '수정되었습니다.', type: 'success' });
            this.returnInsert(this.newList);
         } else {
            for(let i = 0; i < this.rowData.length; i++){
               if(this.rowData[i].return_code === this.returnCode){
                  this.$notify({ text: '이미 존재하는 반품코드입니다.', type: 'error' });
                  return;
               }
            }
            this.$notify({ text: '등록되었습니다.', type: 'success' });
            this.returnInsert(this.newList);
         }
      //  this.returnInsert(this.newList);
       this.returnList();
     },
   },
   // 화면 생성되는 시점
   mounted() {
     // 전체조회 쿼리 실행
     this.checkLogin();
     this.returnList();
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