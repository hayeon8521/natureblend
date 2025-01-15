<!--거래처 관리 메뉴-->
<template>
  <div class="partList container-fluid py-4">
   <div>
       <h3>&nbsp;&nbsp;거래처 관리</h3>
   </div>
   <div class="d-flex">
       <div class="p-2 flex-fill" style="width: 500px;">
            <!-- 검색 메뉴 레이아웃 -->
    <div class="main-container" style="width:450px;">
       <div class="content" style="height: auto; width: 400px ; margin: 20px; padding-bottom: 30px;" >
          <form class="d-flex flex-column">
           <div class="d-flex">
                     <div class="p-2 flex-fill">
                         <!-- 거래처번호 -->
                         <div class="mb-3">
                           <label class="col-form-label fw-bold" for="clientNum">거래처번호</label>
                           <input type="text" readonly class="form-control" style="background-color: white; padding-left: 20px;" id="clientNum" v-model="clientNum" >
                         </div>
                         <!-- 업체명 -->
                         <div class="mb-3">
                            <label class="col-form-label fw-bold" for="comName">업체명</label>
                            <input type="text" class="form-control" style="background-color: white; padding-left: 20px;" id="comName" v-model="comName" >
                         </div>

                     </div>
                     <div class="p-2 flex-fill">
                         <!-- 사업자번호 -->
                         <div class="mb-3">
                            <label class="col-form-label fw-bold" for="comNum">사업자번호</label>
                            <input type="text" class="form-control" style="background-color: white; padding-left: 20px;" id="comNum" v-model="comNum" >
                         </div>
                          <!-- 거래분류 -->
                          <div class="mb-3">
                            <label class="col-form-label fw-bold" for="trade">거래분류</label>
                            <input type="text" class="form-control" style="background-color: white; padding-left: 20px;" id="trade" v-model="trade" >
                         </div>
                     </div>
                   </div>
                          <!-- 주소 -->
                          <div class="mb-1">
                           <label class="col-form-label fw-bold" for="address">주소</label>
                           <input type="text" class="form-control" style="background-color: white; margin-left: 8px; width: 384px; padding-left: 20px; " id="address" v-model="address"  autocomplete="off"  >
                         </div>
                   <div class="d-flex">
                     <div class="p-2 flex-fill">
                      <!-- 대표자 -->
                      <div class="mb-3">
                         <label class="col-form-label fw-bold" for="boss">대표자</label>
                         <input type="text" class="form-control" style="background-color: white; padding-left: 20px;" id="boss" v-model="boss" >
                      </div>
                      <!-- 담당자 -->
                      <div class="mb-3">
                          <label class="col-form-label fw-bold" for="empName">담당자</label>
                          <input type="text" class="form-control" style="background-color: white; padding-left: 20px;" id="empName" v-model="empName" >
                      </div>

                    </div>
                    <div class="p-2 flex-fill">
                          <!-- 대표연락처 -->
                          <div class="mb-3">
                            <label class="col-form-label fw-bold" for="bossTel">대표연락처</label>
                            <input type="text" class="form-control" style="background-color: white; padding-left: 20px;" id="bossTel" v-model="bossTel" >
                          </div>

                           <!-- 담당자연락처 -->
                           <div class="mb-3">
                               <label class="col-form-label fw-bold" for="empTel">담당자연락처</label>
                               <input type="text" class="form-control" style="background-color: white; padding-left: 20px;" id="empTel" v-model="empTel" >
                           </div>
                    </div>
                   </div>
             <!-- 버튼 -->
             <div class="col-sm-5">
                <div class="d-flex">
                  <div class="p-2 flex-fill">
                    <button style="position:relative; width:120px ; top:29px;" type="button" class="btn btn-success me-5" @click="upin? input_update(2) : input_update(1)"  >등록/수정</button>
                  </div>
                  <div class="p-2 flex-fill">
                    <button style="position:relative; width:120px ; top:29px;" type="button" class="btn btn-warning me-5" @click="refresh"  >새로고침</button>
                  </div>
                </div>
              </div>
             
          </form>
       </div>
           <!-- 검색 메뉴 레이아웃 끝 -->
       </div>
   </div>
       <div class="p-2 flex-fill" style="width: 1000px;">
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
   </div>
   <deleteModal
      :showModal="showDeleteModal"
      @deleteConfirmed="onDeleteConfirmed"
      @deleteCancelled="onDeleteCancelled"
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
            clientNum: '', // 거래처번호
            comName: '', // 업체명
            boss: '', // 대표자
            empName: '', // 담당자
            trade: '', // 거래분류
            comNum: '', // 사업자번호
            address: '', // 주소
            bossTel: '', // 대표연락처
            empTel: '', // 담당자연락처
            showDeleteModal: false, // 삭제 모달 표시 여부
            selectedCustomer: null,
          columnDefs: [
            { headerName:"업체명" , field:"com_name"},
            { headerName:"주소" , field:"address"},
            { headerName:"거래분류" , field:"trade" , cellStyle: { textAlign: 'center' }},
            {
              headerName: "거래처삭제",
              field: "삭제",
              upin : '',
              cellStyle: { textAlign: 'center' },
              editable: false,
              cellRenderer: (params) => {
                const button2 = document.createElement('button');
                button2.innerText = '삭제';
                button2.style.marginRight = '10px';
                button2.style.cursor = 'pointer';
                button2.style.backgroundColor = '#f44335';
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
                  console.log("삭제할 거래처번호 : ", params.data.client_num , "업체명 : ", params.data.com_name);
                  this.selectedCustomer = params.data;
                  this.showDeleteModal = true; // 모달 띄우기
                });
                return button2;
              }
            },
          ],
          newList: [], // 등록 , 수정
          rowData: [], // 데이터 잡아넣을 그리드 api 행
          theme:theme,
        };
      },
      methods: {
        async checkBusinessNumber(comNum) {
          try {
            const response = await axios.get(`${ajaxUrl}/checkBusinessNumber/${comNum}`);
            return response.data.message === '사용 가능한 사업자번호입니다.'; // 중복되지 않으면 true 반환
          } catch (error) {
            return false; // 오류가 발생하면 사용 불가능으로 간주
          }
        },
        onDeleteCancelled() {
          this.showDeleteModal = false;
        },
        async onDeleteConfirmed(){
          if (this.selectedCustomer) {
            try{
              axios.delete(`${ajaxUrl}/customerDelete/${this.selectedCustomer.client_num}`)
                .then(res => {
                  if (res.data === '성공') {
                    this.$notify({ text: '거래처가 삭제되었습니다.', type: 'success' });
                    this.customerList();
                  } else {
                    this.$notify({ text: '삭제실패.', type: 'error' });
                  }
                })
            }catch(error){
              console.log(error);
              this.$notify({ text: '삭제실패.', type: 'error' });
            }
            this.showDeleteModal = false;
          }
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
       async customerList() {
           const result = await axios.get(`${ajaxUrl}/customerList`)
                                     .catch(err => console.log(err));
             this.rowData = result.data;
       },
       onReady(param) {
         param.api.sizeColumnsToFit(); // 그리드 api 넓이 슬라이드 안 생기게 하는 거
       },
       onCellClicked(params) {
           if(params.colDef.field !== '삭제'){   
             console.log("레코드 확인[클릭] : ", JSON.stringify(params.data));
              this.clientNum = params.data.client_num;
              this.comName = params.data.com_name;
              this.boss = params.data.boss;
              this.empName = params.data.emp_name;
              this.trade = params.data.trade;
              this.comNum = params.data.com_num;
              this.address = params.data.address;
              this.bossTel = params.data.boss_tel;
              this.empTel = params.data.emp_tel;
              this.upin = 'update';
           }
       },
       async customerInsert(newList){
        const isBusinessNumberValid = await this.checkBusinessNumber(newList.com_num);
          if (isBusinessNumberValid) {
            this.$notify({ text: '이미 등록된 사업자번호입니다.', type: 'error' });
            return; // 중복된 사업자번호가 있을 경우, 등록을 하지 않음
          }
        // const comNumber = await axios.get(`${ajaxUrl}/customerList`);
           const result = await axios.post(`${ajaxUrl}/customerInsert`, newList)
                                     .catch(err => console.log(err));
           if(result.data === '성공'){
              this.$notify({ text: '거래처가 등록되었습니다.', type: 'success' });
               this.customerList();
           }else{
              this.$notify({ text: '등록에 실패하였습니다.', type: 'error' });
           }
       },
       async customerUpdate(newList){
          const result = await axios.post(`${ajaxUrl}/customerUpdate/${this.clientNum}`, newList)
                                     .catch(err => console.log(err));
          if(result.data === '성공'){
            this.$notify({ text: '거래처가 수정되었습니다.', type: 'success' });
              this.customerList();
              this.upin = '';
              this.clientNum = '';
              this.comName = '';
              this.boss = '';
              this.empName = '';
              this.trade = '';
              this.comNum = '';
              this.address = '';
              this.bossTel = '';
              this.empTel = '';
          }else{
            this.$notify({ text: '수정 실패하였습니다.', type: 'error' });
          }
       },
        refresh(){
            this.customerList();
            this.upin = '';
              this.clientNum = '';
              this.comName = '';
              this.boss = '';
              this.empName = '';
              this.trade = '';
              this.comNum = '';
              this.address = '';
              this.bossTel = '';
              this.empTel = '';
        },
       input_update(number) {
         console.log('등록 또는 수정 기능여기서 추가');
          console.log(this.clientNum);
          console.log(this.comName);
          console.log(this.boss);
          console.log(this.empName);
          console.log(this.trade);
          console.log(this.comNum);
          console.log(this.address);
          console.log(this.bossTel);
          console.log(this.empTel);
          if(number === 1){
            if(this.comName === '' || this.boss === '' || this.empName === '' || this.trade === '' || this.comNum === '' || this.address === '' || this.bossTel === '' || this.empTel === ''){
              this.$notify({ text: '빈칸을 입력해주세요', type: 'error' });
                return;
            }else{
                console.log('등록');
                let dataresult = 'ok';
                if(dataresult === 'ok'){
                    this.newList = {
                      com_num: this.comNum,
                      client_num: this.clientNum,
                      com_name: this.comName,
                      address: this.address,
                      boss: this.boss,
                      boss_tel: this.bossTel,
                      emp_name: this.empName,
                      emp_tel: this.empTel,
                      trade: this.trade,
                    }
                    console.log('데이터 확인',this.newList);
                    this.customerInsert(this.newList);
                return
                }
            }
        }else if(number === 2){
            console.log('수정');
            this.newList = {
              com_num: this.comNum,
              client_num: this.clientNum,
              com_name: this.comName,
              address: this.address,
              boss: this.boss,
              boss_tel: this.bossTel,
              emp_name: this.empName,
              emp_tel: this.empTel,
              trade: this.trade,
            }
            this.customerUpdate(this.newList);
        }
          
          
        },
      },
      // 화면 생성되는 시점
      mounted() {
        // 전체조회 쿼리 실행
        this.checkLogin();
        this.customerList();
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
/* input 포커스 상태에서도 배경색 유지 */
input:focus {
  background-color: #ffffff; /* 포커스 시 배경색 흰색 유지 */
  border-color: #86b7fe; /* 선택 시 테두리 색상 약간 강조 */
  outline: none; /* 기본 브라우저 포커스 아웃라인 제거 */
}
    </style>