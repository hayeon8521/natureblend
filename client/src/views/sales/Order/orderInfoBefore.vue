<template>
           <div class="container-fluid py-4">
            <h2>주문서상세</h2>
                <div class= "main-container">
                <div class="content" v-for = "(order,idx) in orderInfo" :key="idx">
                    <form class="row gx-3 gy-2 align-items-center" v-if="idx==0" >
                        <div class="col-sm-2"  >
                            <!-- v-for="(material, index) in materials" :key="index" -->
                            <label class="col-form-label fw-bold" for="orderlistNum">주문서코드</label>
                            <input type="text" class="form-control" id="orderlistNum" v-model="order.orderlist_num" readonly>
                        </div>
                        <div class="sm-3">
                            <label class="col-form-label fw-bold" for="orderName">주문서명</label>
                            <input type="text" class="form-control" id="orderName" v-model="order.orderlist_title">
                        </div>
                        <div class="col-sm-4">
                            <label class="col-form-label fw-bold" for="clientName">거래처명</label>
                            <div class="input-group">
                            <input type="text" class="form-control" id="clientName" v-model="order.com_name" readonly>
                            </div>
    
                        </div>
                        <div class="col-sm-2">
                            <label class="col-form-label fw-bold" for="EmpName">담당자</label>
                            <div class="input-group">
                            <input type="text" class="form-control" id="EmpName" v-model="order.name" readonly>
                            </div>
                           
                        </div>
                        <div class="col-sm-3">
                            <label class="col-form-label fw-bold" for="dueDate">납기일자 {{ order.due_date }}</label>
                            <div class="input-group">
                            <input type="date" class="form-control" id="dueDate" v-model=  "order.due_date">
                            </div>
                        </div>
                        <div class="col-sm-3">
                            <label class="col-form-label fw-bold" for="dueDate">주문서상태</label>
                            <div class="input-group">
                            <input type="text" class="form-control" id="dueDate" v-model="order.orderlist_status" readonly>
                            </div>
                        </div>
                    </form>

                    <div class="row gx-3 gy-2 align-items-center" >
                        <form class="row gx-3 gy-2 align-items-center mt-2">
                            <div class="col-sm-1">
                                <label class="col-form-label fw-bold" for="orderCode">주문코드</label>
                                <input type="text" class="form-control" id="orderCode" v-model="order.order_num" readonly>
                            </div>
                            <div class="col-sm-1">
                                <label class="col-form-label fw-bold" for="productCode">제품코드</label>
                                <input type="text" class="form-control" id="productCode" v-model="order.product_code" readonly>
                            </div>
                            <div class="col-sm-2">
                                <label class="col-form-label fw-bold" for="productName">제품명</label>
                                <input type="text" class="form-control" id="productName" v-model="order.product_name" readonly>
                            </div>
                            <div class="col-sm-2">
                                <label class="col-form-label fw-bold" for="orderNum">주문수량</label>
                                <div class="input-group">
                                <input type="text" class="form-control" id="orderNum" v-model="order.order_amount" :readonly="order.order_status !== 'preparing'">
                                </div>
                            </div>
                            <div class="col-sm-2">
                                <label class="col-form-label fw-bold"  for="perSale">개당가격</label>
                                <div class="input-group">
                                <input type="text" class="form-control" id="perSale" v-model="order.per_price" :readonly="order.order_status !== 'preparing'">
                                </div>
                            </div>
                            <div class="col-sm-2">
                                <label class="col-form-label fw-bold"  for="perSale">총가격</label>
                                <div class="input-group">
                                <input type="text" class="form-control" id="perSale" v-model="order.total_price" readonly>
                                </div>
                            </div>
                            <div class="col-sm-2">
                                <label class="col-form-label fw-bold"  for="perSale">주문상태</label>
                                <div class="input-group">
                                <input type="text" class="form-control" id="perSale" v-model="order.order_status" readonly>
                                </div>
                            </div>
                            <!-- <div class="col-sm-2">
                                <material-button size="sm" color="warning" type="button" class="mt-5"  @click="deleteMaterial(index)">삭제</material-button>
                            </div>       -->
                        </form>
                    </div>
                
                   

                </div>
                <div class="mb-3 text-end">
                        <material-button size="sm" color="warning" class="button"  @click="addMaterial">+</material-button>
                    </div>
                    <div v-for="(material, index) in materials" :key="index" class="row gx-3 gy-2 align-items-center" >
                        <form class="row gx-3 gy-2 align-items-center mt-2">
                            <div class="col-sm-2">
                                <label class="col-form-label fw-bold" for="orderCode">주문코드</label>
                                <input type="text" class="form-control" id="orderCode" v-model="material.newOrderCode" readonly>
                            </div>
                            <div class="col-sm-2">
                                <label class="col-form-label fw-bold" for="productCode">제품코드</label>
                                <input type="text" class="form-control" id="productCode" v-model="material.newProductCode" readonly>
                            </div>
                            <div class="col-sm-2">
                                <label class="col-form-label fw-bold" for="productName">제품명</label>
                                <input type="text" class="form-control" id="productName" v-model="material.newProductName" @click="openModal()" readonly>
                            </div>
                            <Modal
                                    :isShowModal="isShowModal"
                                    :modalTitle="'제품선택'"
                                    :noBtn="'닫기'"
                                    :yesBtn="'선택'"
                                    @closeModal="closeModal()"
                                    @confirm="confirm()"
                                >
                                <template v-slot:list>
                                    <proList v-show="isShowModal" @selectproduct="selectproduct" :indexNum="indexNum"/>
                                </template>
                            </Modal>
                            <div class="col-sm-2">
                                <label class="col-form-label fw-bold" for="orderNum">주문수량</label>
                                <div class="input-group">
                                <input type="text" class="form-control" id="orderNum" v-model="material.newProductNum">
                                </div>
                            </div>
                            <div class="col-sm-2">
                                <label class="col-form-label fw-bold"  for="perSale">개당가격</label>
                                <div class="input-group">
                                <input type="text" class="form-control" id="perSale" v-model="material.newPerPrice">
                                </div>
                            </div>
                            <div class="col-sm-2">
                                <material-button size="sm" color="danger" type="button" class="mt-5"  @click="deleteMaterial(index)">삭제</material-button>
                            </div>      
                        </form>
                    </div>
                <div class="col-auto mt-5 text-center">
                        <material-button type="button" color="success" class="button" @click="updateOrder">수정</material-button>
                        <material-button type="button" color="danger" class="button" @click="deleteOrder(this.orderInfo[0]['orderlist_num'])" >삭제</material-button>
                </div>
            </div>
        </div>
      
  
 
        <!-- <div class="col-sm-2" v-for = "order in orderInfo" :key="order.orderlist_num">
            {{ order.orderlist_title }}
        </div> -->
</template>
<script>
import MaterialButton from "@/components/MaterialButton.vue";
import axios from "axios";
import {ajaxUrl} from "@/utils/commons";
import proList from "@/views/sales/Order/ProductModal.vue"
import Modal from "@/views/natureBlendComponents/modal/Modal.vue";
import userDateUtils from '@/utils/useDates.js';

export default{
    name:"orderInfo",
    components:{
        MaterialButton,
        proList,
        Modal,
        
    },

    data(){
        return{
            
            orderInfo: {},

            

            //새로운 주문 추가 
            materials:[],
            indexNum:'',

            //모달에서 제품 선택 
            selectedProCode : '',
            selectedProName : '',
            
            isShowModal: false,



        }
    },

  

    created(){
        let searchNo = this.$route.params.no;

        this.getOrderInfo(searchNo);
    }, 


    methods:{
        async getOrderInfo(searchNo) {
            console.log(searchNo);
            let result = await axios.get(`${ajaxUrl}/orderInfo/${searchNo}`)
                                    .catch(err=> console.log(err));
                       
            this.orderInfo = result.data;
            
            console.log("데이터:",this.orderInfo,"기한:",this.orderInfo[0]['due_date']);
            this.orderInfo[0]['due_date'] = this.dateFormat(this.orderInfo[0]['due_date'],'yyyy-MM-dd')
            console.log(this.orderInfo[0]['due_date']);
        },
        addMaterial() {
        
            const newMaterial={
            newOrderCode: '',
            newProductCode : '',
            newProductName : '',
            newProductNum: '',
            newPerPrice: ''
            };
            //마지막 material 요소의 productCode가 공백인 경우 newMaterial 형성 못하게 하기 
            if(this.materials.length == 0){
                this.materials.push(newMaterial);
                //console.log(this.materials[this.materials.length]);
            }else if(this.materials[this.materials.length -1 ].newProductCode != ''){
                this.materials.push(newMaterial);
            }   
        },

        openModal() {
            this.isShowModal = true; 
            console.log("modalopen")
        },

        selectproduct(product){
        //console.log(product); 
        this.selectedProCode = product.product_code;
        this.selectedProName = product.product_name;
        console.log( this.selectedProCode,this.selectedProName);
        },

        confirm(){
            this.newProductCode = this.selectedProCode;
            this.newProductName = this.selectedProName;
            //순서대로 공백이면 차례대로 넣기 
            for(let i=0; i<this.materials.length; i++){
                if(this.materials[i]['newProductCode'] == ''){
                    this.materials[i]['newProductCode'] = this.newProductCode;
                    this.materials[i]['newProductName'] = this.newProductName;
                    break;
                }
            }
            console.log(this.materials);
            this.closeModal();
        },
        closeModal() {
        this.isShowModal = false;
    },

        deleteMaterial(index){
        //console.log("deleteMaterial실행");
        // let index = parseInt(this.value);
        // const selectedNum = this.materials[index];
        this.materials = this.materials.filter((material, idx) => index != idx);
        //console.log(this.materials);
        },

        dateFormat(value, format) {
          return userDateUtils.dateFormat(value, format);
      },


      async updateOrder(){
        //추가주문 
        if(this.materials.length != 0){
            let newProductCodes = []
            let newProductNums = []
            let newPerPrices = []
            // materials 배열을 순회하면서 새 주문 정보를 추출
            this.materials.forEach((newOrderInfo)=>{
                newProductCodes.push(newOrderInfo.newProductCode);
                newProductNums.push(newOrderInfo.newProductNum);
                newPerPrices.push(newOrderInfo.newPerPrice);
            })
            // 새 주문 정보 객체
            let newOrderInfo = {
                orderlistNum : this.orderInfo[0]['orderlist_num'],
                newProductCode : JSON.stringify(newProductCodes),
                newProductNum : JSON.stringify(newProductNums),
                newPerPrice : JSON.stringify(newPerPrices),
            }
            // newProductNum 또는 newPerPrice가 비어 있으면 경고
            if (newProductNums.some(num => num === '' || num === null) || newPerPrices.some(price => price === '' || price === null)) {
                this.$notify({
                    text: `주문 수량과 가격을 입력해주세요.`,
                    type: 'error',
                });
                return;  // 추가 작업 진행하지 않음
            }
            await axios.post(`${ajaxUrl}/orderUpdate/insert`,newOrderInfo)
                        .then(Response =>{
                            if(Response.statusText === 'OK'){
                                console.log("추가등록완료");
                            }
                        })
                        .catch(err => console.log(err));  
        }

        
        //주문,주문서 업데이트
        //업데이트 해야 하는 주문서 내용 
        // let obj = {
        //     orderlist_title : this.orderInfo[0]['orderlist_title'],
        //     due_date: this.orderInfo[0]['due_date'],
        // }
        //업데이트 해야 하는 주문 내용 (배열형성)
        let orderAmounts = []
        let perPrices = []
        let productCodes = []
        let orderCodes =[]
        for(let i=0; i<this.orderInfo.length; i++){
            if(this.orderInfo[i]['order_status'] === 'preparing'){
                 // 주문상태가 preparing 인 경우 만 배열에 넣기 
                orderAmounts.push(Number(this.orderInfo[i]['order_amount']));
                productCodes.push(this.orderInfo[i]['product_code'])
                perPrices.push(this.orderInfo[i]['per_price']);
                orderCodes.push(this.orderInfo[i]['order_num']);
            }
        }
        

        let updateOrderInfo = {
            orderlist_title : this.orderInfo[0]['orderlist_title'],
            due_date: this.orderInfo[0]['due_date'],
            orderCode: JSON.stringify(orderCodes),
            productCode :JSON.stringify(productCodes),
            orderAmount : JSON.stringify(orderAmounts),
            perPrice : JSON.stringify(perPrices),
        }

        console.log(updateOrderInfo);
        let result = await axios.put(`${ajaxUrl}/orderUpdate/update/${this.orderInfo[0]['orderlist_num']}`,updateOrderInfo)
                                    .catch(err=>console.log(err));
            console.log(result);
        if(result.statusText === 'OK'){
            this.$notify({
                text: `${this.orderInfo[0]['orderlist_title']}이 수정되었습니다.`,
                type: 'success',
            });  
        }

       
      },

      
      async deleteOrder(orderlistNum){
        console.log("삭제 실행 ");
        if(this.orderInfo[0]['orderlist_status'] === 'update'){
            for(let i=0; i<this.orderInfo.length; i++){
                if(this.orderInfo[i]['order_status'] === 'preparing'){
                    let result = await axios.delete(`${ajaxUrl}/orderlist/delete/${orderlistNum}`)
                                        .catch(err => console.log(err));
                    console.log(result);
                    if(result.data.result === 'success'){
                        this.$notify({
                            text: `${this.orderInfo[0]['orderlist_title']}이 삭제되었습니다.` ,
                            type: 'success',
                        });  
                        this.$router.push({name :'orderlistSearch'});
                        break;
                    }else if (result.data.result === 'fail'){
                        this.$notify({
                            text: '삭제 오류 발생',
                            type: 'error',
                        });
                        break;
                    }
                 }
                 this.$notify({
                        text: '현재 출고 진행 중인 건이 있습니다.',
                        type: 'error',
                    });
                    break;
            }
        }else if (this.orderInfo[0]['orderlist_status'] === 'continue' || this.orderInfo[0]['orderlist_status'] === 'done'){
            this.$notify({
                    text: '현재 출고 진행 중인 건이 있습니다.',
                    type: 'error',
                });
        }
       
      }, 
        
    }//end method
}
</script>

<style lang="scss" scoped>
.main-container {
  background-color: #e9ecef;
  margin: 20px;
  border-radius: 10px;
}
.content {
  margin: 20px;
  padding: 10px;
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
