<!-- 공정기준정보 관리 메뉴 -->
<template>
  <div class="partList container-fluid py-4">
    <div>
       <h3>&nbsp;&nbsp;공정기준정보 관리</h3>
    </div>
 <!-- 검색 메뉴 레이아웃 -->
 <div class="main-container">
    <div class="content" style="height: 130px; margin: 20px;">
       <form class="row gx-3 gy-2 align-items-center">
          <!-- 공정코드 -->
          <div class="col-sm-2">
             <label class="col-form-label fw-bold" for="processCode">공정코드</label>
             <input type="text" class="form-control" style="background-color: white; padding-left: 20px;" id="processCode" v-model="processCode" >
          </div>
 
          <!-- 공정명 -->
          <div class="col-sm-2">
             <label class="col-form-label fw-bold" for="processName">공정명</label>
             <input type="text" class="form-control" style="background-color: white; padding-left: 20px;" id="processName" v-model="processName" >
          </div>
 
          <!-- 설비분류 -->
          <div class="col-sm-2">
             <label class="col-form-label fw-bold" for="machineType">설비분류</label>
             <input type="text" class="form-control" style="background-color: white; padding-left: 20px;" id="machineType" v-model="machineType" >
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
       processCode: '',   // 공정코드
       processName: '',  // 공정이름
       machineType: '',  // 설비분류
       showDeleteModal: false, // 삭제 모달 표시 여부
       selectedProcess: null,
       columnDefs: [
         { headerName: "공정코드", field: "process_code", width: 220 },
         { headerName: "공정명", field: "process_name" },
         { headerName: "설비분류", field: "machine_type" },
         {
           headerName: "공정정보삭제",
           field: "삭제",
           cellStyle: { textAlign: 'center' },
           upin : '',
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
               console.log("삭제할 공정코드 : ", params.data.process_code);
               this.selectedProcess = params.data;
               this.showDeleteModal = true;

             });
             return button2;
           }
         },
       ],
       newList: [], // 등록 이나 수정할때 사용할 리스트
       rowData: [], // 데이터 잡아넣을 그리드 api 행
       theme:theme,
     };
   },
   methods: {
    onDeleteCancelled(){
        this.showDeleteModal = false;
    },
    async onDeleteConfirmed(){
        if(this.selectedProcess){
                    axios.delete(`${ajaxUrl}/processDelete/${this.selectedProcess.process_code}`)
                    .then(res => {
                        if(res.data === '성공'){
                            this.$notify({ text: '공정이 삭제되었습니다.', type: 'success' });
                            this.processList();
                        }else{
                            this.$notify({ text: '삭제실패.', type: 'error' });
                        }
                    })
                    .catch(err => console.log(err));
                    this.showDeleteModal = false;
        }
    },
    refresh(){
        this.processList();
        this.upin = '';
        this.processCode = '';
        this.processName = '';
        this.machineType = '';
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
    async processList(){
        const result = await axios.get(`${ajaxUrl}/processList`)
                                          .catch(err => console.log(err));
        console.log(result.data);
        this.rowData = result.data;
        console.log(this.rowData);
    },
    onReady(param) {
       param.api.sizeColumnsToFit(); // 그리드 api 넓이 슬라이드 안 생기게 하는 거
    },
    onCellClicked(params) {
        if(params.colDef.field !== '삭제'){
            console.log("레코드 확인[클릭] : ", JSON.stringify(params.data));
            this.processCode = params.data.process_code;
            this.processName = params.data.process_name;
            this.machineType = params.data.machine_type;
            this.upin = 'update';
        }
    },
     async input_update(number) {
       console.log('등록 또는 수정 기능여기서 추가');
        console.log(this.processCode);
        console.log(this.processName);
        console.log(this.machineType);
        if(number === 1){
            if(this.processCode === '' || this.processName === '' || this.machineType === ''){
                this.$notify({ text: '빈칸을 입력해주세요.', type: 'error' });
                return;
            }else{
                console.log('등록');
                let dataresult = 'ok';
                // 중복체크
                for(let i = 0; i < this.rowData.length; i++){
                    if(this.rowData[i].process_code === this.processCode){
                        this.$notify({  text: '중복된 공정입니다.', type: 'error' });
                        dataresult = 'no';
                        return;
                    }
                }
                if(dataresult === 'ok'){
                    this.newList = {
                        process_code: this.processCode,
                        process_name: this.processName,
                        machine_type: this.machineType,
                    }
                    console.log(this.newList);
                    this.processInsert(this.newList);
                return
                }
            }
        }else if(number === 2){
            console.log('수정');
            this.newList = {
                process_code: this.processCode,
                process_name: this.processName,
                machine_type: this.machineType,
            }
            this.processUpdate(this.newList);
        }
     },
     async processInsert(newList){
        const result = await axios.post(`${ajaxUrl}/processInsert`, newList)
                                    .catch(err => console.log(err));
            if(result.data === '성공'){
                this.$notify({ text: '공정이 등록되었습니다.', type: 'success' });
                this.processList();
            }else{
                this.$notify({ text: '등록실패.', type: 'error' });
            }
     },
        async processUpdate(newList){
            const result = await axios.post(`${ajaxUrl}/processUpdate/${this.processCode}`, newList)
                if(result.data === '성공'){
                    this.$notify({ text: '공정이 수정되었습니다.', type: 'success' });
                    this.processList();
                    this.upin = '';
                    this.processCode = '';
                    this.processName = '';
                    this.machineType = '';
                }else{
                    this.$notify({ text: '수정실패.', type: 'error' });
                }
        },
   },
   // 화면 생성되는 시점
   mounted() {
    this.checkLogin();
    this.processList();
     // 전체조회 쿼리 실행
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