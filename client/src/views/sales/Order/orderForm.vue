<template>
    <div class="container-fluid py-4">
        <h3>주문서등록</h3>
            <div class= "main-container">
            <div class="content">
                <div class="orderlistForm">
                    <form class="row gx-3 gy-2 align-items-center">
                        <div class="col-sm-2">
                            <label class="col-form-label fw-bold" for="orderlistNum">주문서번호</label>
                            <input type="text" class="form-control" id="orderlistNum" v-model="orderlistNum" autocomplete="off" readonly>
                        </div>
                        <div class="sm-2">
                            <label class="col-form-label fw-bold" for="orderlistName">주문서명<span> *</span></label>
                            <input type="text" class="form-control" id="orderlistName"
                                 v-model="orderName"  autocomplete="off" placeholder="주문서명"  >
                        </div>
                        <div class="col-sm-4">
                            <label class="col-form-label fw-bold" for="clientName">거래처명<span> *</span></label>
                            <div class="input-group">
                            <input type="text" class="form-control" id="clientName" 
                                @click="openModal('client')" v-model="searchCom.com_name"  autocomplete="off" placeholder="거래처명" >
                        </div>
                        <Modal
                            :isShowModal="isShowModal.client"
                            :modalTitle="'거래처선택'"
                            :noBtn="'닫기'"
                            :yesBtn="'선택'"
                            @closeModal="closeModal('client')"
                            @confirm="confirm('client')"
                        >
                            <template v-slot:list>
                                <ComList v-show="isShowModal.client" @selectclient="selectclient"/>
                            </template>
                        </Modal>
                        </div>
                        <div class="col-sm-2">
                            <label class="col-form-label fw-bold" for="EmpName">담당자<span> *</span></label>
                            <div class="input-group">
                            <input type="text" v-if="searchEmpName.name" class="form-control" id="EmpName" @click="openModal('emp')" v-model="searchEmpName.name"  autocomplete="off"  >
                            <input type="text" v-else class="form-control" id="EmpName" @click="openModal('emp')" v-model="searchEmpName"  autocomplete="off"  >
                            </div>
                            <Modal
                                :isShowModal="isShowModal.emp"
                                :modalTitle="'담당자선택'"
                                :noBtn="'닫기'"
                                :yesBtn="'선택'"
                                @closeModal="closeModal('emp')"
                                @confirm="confirm('emp')"
                            >
                            <template v-slot:list>
                                <EmpList v-show="isShowModal.emp" @selectemp="selectemp"/>
                            </template>
                            </Modal>
                        </div>
                        <div class="col-sm-4">
                            <label class="col-form-label fw-bold" for="dueDate">납기일자<span> *</span></label>
                            <div class="input-group">
                            <input type="date" class="form-control" id="dueDate" v-model="dueDate"  autocomplete="off"  >
                            </div>
                        </div>
                    </form>
                    <div class="mb-3 text-end">
                        <material-button size="sm" color="success" class="button"  @click="addMaterial">주문추가</material-button>
                    </div>

                </div>
                

                <div  v-for="(material, index) in materials" :key="index" class="row gx-3 gy-2 align-items-center plus-section">
                    <form class="row gx-3 gy-2 align-items-center mt-2">
                        <div class="col-sm-2">
                            <label class="col-form-label fw-bold" for="orderCode">주문번호</label>
                            <input type="text" class="form-control" id="orderCode" v-model="material.orderCode"  autocomplete="off" readonly >
                        </div>
                        <div class="col-sm-2">
                            <label class="col-form-label fw-bold" for="productCode">제품코드<span> *</span></label>
                            <input type="text" class="form-control" id="productCode" v-model="material.productCode"  autocomplete="off" readonly placeholder="제품코드" >
                        </div>
                        <div class="col-sm-2">
                            <label class="col-form-label fw-bold" for="productName">제품명<span> *</span></label>
                            <input type="text" class="form-control" id="productName" v-model="material.productName" @click="openModal('product',index)"  autocomplete="off" placeholder="제품명">
                        </div>
                        <Modal
                                :isShowModal="isShowModal.product"
                                :modalTitle="'제품선택'"
                                :noBtn="'닫기'"
                                :yesBtn="'선택'"
                                @closeModal="closeModal('product')"
                                @confirm="confirm('product')"
                            >
                            <template v-slot:list>
                                <proList v-show="isShowModal.product" @selectproduct="selectproduct" :indexNum="indexNum"/>
                            </template>
                        </Modal>
                        <div class="col-sm-2">
                            <label class="col-form-label fw-bold" for="orderNum">주문수량<span> *</span></label>
                            <div class="input-group">
                            <input type="number" class="form-control" id="orderNum" 
                                v-model="material.productNum" autocomplete="off" placeholder="주문수량"  >
                            </div>
                        </div>
                        <div class="col-sm-2">
                            <label class="col-form-label fw-bold"  for="perSale">개당가격<span> *</span></label>
                            <div class="input-group">
                            <input type="text" class="form-control" id="perSale" 
                                v-model="material.perPrice" autocomplete="off" placeholder="개당가격" >
                            </div>
                        </div>
                        <div class="col-sm-2">
                            <material-button size="sm" color="danger" type="button" class="mt-5"  @click="deleteMaterial(index)">삭제</material-button>
                        </div>      
                    </form>
                </div>
               

                <div class="col-auto mt-5 text-center">
                        <material-button type="button" class="button me-4" color="success" @click="insertOrder">등록</material-button>
                        <material-button type="button" class="button" color="warning" @click="resetSearch">초기화</material-button>
                </div>
            </div>
        </div>
    </div>
   
    
</template>

<script>
import MaterialButton from "@/components/MaterialButton.vue";
import ComList from "@/views/sales/Order/clientModal.vue";
import EmpList from "@/views/sales/Order/EmpModal.vue";
import proList from "@/views/sales/Order/ProductModal.vue"
import Modal from "@/views/natureBlendComponents/modal/Modal.vue";
import userDateUtils from '@/utils/useDates.js';
import axios from "axios";
import {ajaxUrl} from "@/utils/commons";
import { mapMutations } from "vuex";




export default{
    name:"orderForm",
    components:{
        MaterialButton,
        ComList,
        EmpList,
        proList,
        Modal,
       
    },
    data(){
        return{
            testing: {},

            orderlistNum :'',
            orderName : '',
            dueDate:'',

            orderCode:'' ,
            productCode:'',
            productName:'',
            productNum:'',
            perPrice:'',

            materials:[
            {
                orderCode: '', // 초기값
                productCode: '', // 초기값
                productName: '', // 초기값
                productNum: '', // 초기값
                perPrice: '' // 초기값
            }
            ],
            indexNum: null, // 선택된 index 저장

            //거래처 모달 
            searchCom:"", // 저장 될 거래처 명 
            selectedCom: "", //선택된 거래처 명

            //직원  모달
            searchEmpName:"", // 저장될 직원 명 
            selectedEmpName:"", //선택될 직원 명 

            //제품 모달(선택될)
            selectedProCode:"",
            selectedProName:"",

            isShowModal: {
            client: false, // 거래처 모달
            emp: false, // 직원 모달
            product:false // 제품 모달 
            },
        }
    },

    computed:{

    },
    mounted() {
      this.test();
    },

    methods:{
    
    ...mapMutations(["addLoginInfo"]),
    test(){
      this.testing = this.$store.state.loginInfo;
      //console.log('ddd', this.$store.state.loginInfo);
      this.searchEmpName = this.$store.state.loginInfo.name;
    },

    selectclient(client){
        this.selectedCom = client; 
    },
    selectemp(emp){
        this.selectedEmpName = emp;
    },
    selectproduct(product){
        //console.log(product); 
        this.selectedProCode = product.product_code;
        this.selectedProName = product.product_name;
    },
    //제품 index 가져오기 
    openModal(modalType,index) {
        this.isShowModal[modalType] = true; 
        this.indexNum = index; //현재 선택된 index
        //console.log(this.indexNum);
        console.log(`${modalType} modal open`);
    },
    confirm(modalType){
        if (modalType === 'client') {
        this.searchCom = this.selectedCom;
      } else if (modalType === 'emp') {
        this.searchEmpName = this.selectedEmpName;
      } else if(modalType === 'product'){
        this.productCode = this.selectedProCode;
        this.productName = this.selectedProName;
        
        //console.log(this.materials[this.indexNum])
        this.materials[this.indexNum]['productCode'] = this.productCode;
        this.materials[this.indexNum]['productName'] = this.productName;

        //순서대로 공백이면 차례대로 넣기 
        // for(let i=0; i<this.materials.length; i++){
        //     if(this.materials[i]['productCode'] == ''){
        //     this.materials[i]['productCode'] = this.productCode;
        //     this.materials[i]['productName'] = this.productName;
        //     break;
        //     }
        // }


        //console.log(this.materials);
        
      }

      this.closeModal(modalType); // 모달 닫기
    },
    closeModal(modalType) {
        this.isShowModal[modalType] = false;
    },

    dateFormat(value, format) {
          return userDateUtils.dateFormat(value, format);
    },
    addMaterial() {
        
    const newMaterial={
      orderCode: '',
      productCode : '',
      productName : '',
      productNum: '',
      perPrice: ''
    };
    //마지막 material 요소의 productCode가 공백인 경우 newMaterial 형성 못하게 하기 
        if(this.materials.length == 0){
            this.materials.push(newMaterial);
            //console.log(this.materials[this.materials.length]);
        }else if(this.materials[this.materials.length -1 ].productCode != ''){
            this.materials.push(newMaterial);
        }    
    },

    // materials 추가 삭제 
    deleteMaterial(index){
        //console.log("deleteMaterial실행");
        // let index = parseInt(this.value);
        // const selectedNum = this.materials[index];
        this.materials = this.materials.filter((material, idx) => index != idx);
        //console.log(this.materials);
       
        
    },

    //초기화
    resetSearch(){
        this.orderlistNum = "",
        this.orderName ="",
        this.dueDate="",

        this.orderCode="" ,
        this.productCode="",
        this.productName="",
        this.productNum="",
        this.perPrice="",
        this.materials= [],

        this.searchEmpName="",
        this.searchCom=""

    },
    //주문, 주문서 등록 
    async insertOrder(){
        // for(let i=0; i<this.materials.length; i++){
        //     let productCode = this.materials[i]['productCode'];
        //     let productName = this.materials[i]['productName'];
        //     let productNum = this.materials[i]['productNum'];
        //     let perPrice = this.materials[i]['perPrice'];
        //     console.log(this.orderName,this.dueDate,this.searchEmpName,productCode,productName,productNum,perPrice);
            
        // }

        if (!this.orderName || !this.dueDate || !this.searchEmpName) {
        this.$notify({ text: '필수 정보를 모두 입력하세요.', type: 'error' });
        return;
        }
        if (this.materials.length === 0) {
            this.$notify({ text: '주문 품목을 추가하세요.', type: 'error' });
            return;
        }
       
        if(new Date(this.dueDate) < new Date() ){
            this.$notify({ text: '납기일이 오늘보다 이전입니다.', type: 'error' });
            return;
        }

        let productCodes = []
        let productNums = []
        let perPrices = []
        //유효하지 않는 행 체크 
        let invalidRows = [];
        this.materials.forEach((orderInfo)=>{
            if(!orderInfo.productCode || !orderInfo.productNum || !orderInfo.perPrice){
                invalidRows.push(orderInfo);
            }else{
                productCodes.push(orderInfo.productCode);
                productNums.push(orderInfo.productNum);
                perPrices.push(orderInfo.perPrice);
            } 
        });
         // 유효하지 않은 행이 있으면 알림 띄우고 중단
         if (invalidRows.length > 0) {
            this.$notify({
                text: '제품명,주문수량,개당가격은 필수 값입니다.',
                type: 'error',
            });
            return;
        }

        let orderInfo = {
            orderName : this.orderName,
            dueDate : this.dueDate,
            searchCom: this.searchCom.com_name,
            productCode: JSON.stringify(productCodes),
            productNum : JSON.stringify(productNums),
            perPrice : JSON.stringify(perPrices),
        }
         // 조건에 따라 `name` 속성을 동적으로 추가
         if (!this.searchEmpName.name) {
                orderInfo.searchEmpName = this.searchEmpName;
            } else {
                orderInfo.searchEmpName = this.searchEmpName.name;
            }

        //console.log(orderInfo);

        let result =
            await axios.post(`${ajaxUrl}/orderForm/insert`,orderInfo)
                        .catch(err => console.log(err));
                        //console.log(result);
        if(result.statusText === 'OK'){
        this.$notify({
            text: `${this.orderName}이 등록되었습니다.`,
            type: 'success',
        });
        this.resetSearch();  // 주문 등록 후 초기화   
        }
    }
    
        
    }//end method
}
</script>

<style lang="scss" scoped>
.main-container {
//   background-color: #e9ecef;
  border: solid 5px #e9ecef;
  margin: 20px;
  border-radius: 10px;
}
.orderlistForm{
    background-color: #e9ecef;
    padding: 60px;
    padding-bottom: 20px;
    border-radius: 10px;
}
.content {
  margin: 20px;
  padding: 10px;
}
.plus-section{
    padding-left: 60px;
}

.client {
  padding: 10px;
  cursor: pointer;
  &:hover {
    background-color: #f8f9fa;
  }
}
.selected {
  background-color: #ffeeba;
  font-weight: bold;
}

/* 일반 input 태그 스타일 */
input {
  background-color: #ffffff; /* 배경색 흰색 */
  border: solid 1px #ced4da; /* 테두리 색상 */
  color: #495057; /* 텍스트 색상 */
}
/* readonly 상태의 input 태그 스타일 */
input:read-only {
  background-color: #ffffff; /* 배경색 흰색 고정 */
  color: #495057; /* 텍스트 색상 유지 */
  cursor: not-allowed; /* 읽기 전용 표시를 위한 커서 */
}

/* input 포커스 상태에서도 배경색 유지 */
input:focus {
  background-color: #ffffff; /* 포커스 시 배경색 흰색 유지 */
  border-color: #86b7fe; /* 선택 시 테두리 색상 약간 강조 */
  outline: none; /* 기본 브라우저 포커스 아웃라인 제거 */
}

/* readonly input 요소가 포커스되어도 스타일 유지 */
input:read-only:focus {
  background-color: #ffffff; /* 배경색 흰색 고정 */
  border-color: #ced4da; /* readonly 상태에서는 테두리 기본값 */
  outline: none; /* 포커스 아웃라인 제거 */
}
</style>
