<!--리뉴얼로 사용 안하는 페이지-->
<!-- 자재 주문 -->
<template>
  <div class="container-fluid pl-4 pr-4 pt-0 pm-0"><!--py-4-->
    <div class="row">
      <div class="col-12">
        <div class="card my-4">
          <div class="card-body px-0 pb-2">
            <div class="table-responsive p-0">
              <table class="table align-items-center mb-0">
                <thead>
                  <tr>
                    <th class="align-middle text-center text-xxs font-weight-bolder opacity-7">
                      <label><input type="checkbox" v-model="allSelected2" @click="click_all2"/></label>
                    </th>
                    <th class="align-middle text-center text-xxs font-weight-bolder opacity-7">
                      원자재코드
                    </th>
                    <th class="align-middle text-center text-xxs font-weight-bolder opacity-7">
                      자재명
                    </th>
                    <th class="align-middle text-center text-xxs font-weight-bolder opacity-7">
                      자재재고
                    </th>
                    <th class="align-middle text-center text-xxs font-weight-bolder opacity-7">
                      안전재고
                    </th>
                    <th class="align-middle text-center text-xxs font-weight-bolder opacity-7">
                      계획재고
                    </th>
                    <th class="align-middle text-center text-xxs font-weight-bolder opacity-7">
                      발주중재고
                    </th>
                    <th class="align-middle text-center text-xxs font-weight-bolder opacity-7">
                      필요수량
                    </th>
                    <th class="align-middle text-center text-xxs font-weight-bolder opacity-7">
                      거래처명
                    </th>
                    <th class="align-middle text-center text-xxs font-weight-bolder opacity-7">
                      거래처선택
                    </th>
                    <th class="align-middle text-center text-xxs font-weight-bolder opacity-7">
                      발주수량(KG)
                    </th>
                    <th class="align-middle text-center text-xxs font-weight-bolder opacity-7">
                      단가
                    </th>
                    <th class="align-middle text-center text-xxs font-weight-bolder opacity-7">
                      총금액
                    </th>
                    <th class="align-middle text-center text-xxs font-weight-bolder opacity-7">
                      납기일
                    </th>
                    <th class="align-middle text-center text-xxs font-weight-bolder opacity-7">
                      발주제거
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="material in needMaterialListCopy" :key="material.material_code">
                    <td class="align-middle text-center">
                      <label><input type="checkbox" :value="material.material_code" v-model="checked2"></label>
                    </td>
                    <td>
                      <div class="d-flex px-2 py-1">
                        <div class="d-flex flex-column justify-content-center">
                          <h6 class="mb-0 text-sm">{{ material.material_code }}</h6>
                        </div>
                      </div>
                    </td>
                    <td class="align-middle text-center">
                      <div class="d-flex px-2 py-1">
                        <div class="d-flex flex-column justify-content-center">
                          <h6 class="mb-0 text-sm">{{ material.material }}</h6>
                        </div>
                      </div>
                    </td>
                    <td class="align-middle text-center">
                      <div class="d-flex px-2 py-1">
                        <div class="d-flex flex-column justify-content-center">
                          <h6 class="mb-0 text-sm">{{ gToKg(material.stok_qty) }} Kg</h6>
                        </div>
                      </div>
                    </td>
                    <td class="align-middle text-center">
                      <div class="d-flex px-2 py-1">
                        <div class="d-flex flex-column justify-content-center">
                          <h6 class="mb-0 text-sm">{{ gToKg(material.safety_inventory) }} Kg</h6>
                        </div>
                      </div>
                    </td>
                    <td class="align-middle text-center">
                      <div class="d-flex px-2 py-1">
                        <div class="d-flex flex-column justify-content-center">
                          <h6 class="mb-0 text-sm">{{ gToKg(material.plan_qty) }} Kg</h6>
                        </div>
                      </div>
                    </td>
                    <td class="align-middle text-center">
                      <div class="d-flex px-2 py-1">
                        <div class="d-flex flex-column justify-content-center">
                          <h6 class="mb-0 text-sm">{{ gToKg(material.ordering_qty) }} Kg</h6>
                        </div>
                      </div>
                    </td>
                    <td class="align-middle text-center">
                      <div class="d-flex px-2 py-1">
                        <div class="d-flex flex-column justify-content-center">
                          <h6 class="mb-0 text-sm">{{ gToKg(material.need_qty) }} Kg</h6>
                        </div>
                      </div>
                    </td>
                    <td class="align-middle text-center">
                      <div class="d-flex px-2 py-1">
                        <div class="d-flex flex-column justify-content-center">
                          <h6 class="mb-0 text-sm">{{ material.clientName }}</h6>
                        </div>
                      </div>
                    </td>
                    <td class="align-middle text-center">
                      <div class="d-flex px-2 py-1">
                        <div class="d-flex flex-column justify-content-center">
                          <h6 class="mb-0 text-sm">
                            <button type="button" @click="openModal(material.material, gToKg(material.need_qty))" data-bs-toggle="modal" data-bs-target="#exampleModal">
                              거래처선택
                            </button>
                          </h6>
                        </div>
                      </div>
                    </td>
                    <td class="align-middle text-center">
                      <div class="d-flex px-2 py-1">
                        <div class="d-flex flex-column justify-content-center">
                          <h6 class="mb-0 text-sm"><input type="number" v-model.number="material.qty" class="form-control" style="width: 50px;" placeholder="수량"></h6>
                        </div>
                      </div>
                    </td>
                    <td class="align-middle text-center">
                      <div class="d-flex px-2 py-1">
                        <div class="d-flex flex-column justify-content-center">
                          <h6 class="mb-0 text-sm"><input type="number" v-model.number="material.pic" class="form-control" style="width: 50px;" placeholder="단가"></h6>
                        </div>
                      </div>
                    </td>
                    <td class="align-middle text-center">
                      <div class="d-flex px-2 py-1">
                        <div class="d-flex flex-column justify-content-center">
                          <h6 class="mb-0 text-sm">{{ calculateTotalPrice(material.qty, material.pic) }} 원</h6>
                        </div>
                      </div>
                    </td>
                    <td class="align-middle text-center">
                      <div class="d-flex px-2 py-1">
                        <div class="d-flex flex-column justify-content-center">
                          <h6 class="mb-0 text-sm"><input type="date" v-model="material.lastDate" class="form-control" ></h6>
                        </div>
                      </div>
                    </td>
                    <td class="align-middle text-center">
                      <div class="d-flex px-2 py-1">
                        <div class="d-flex flex-column justify-content-center">
                          <h6 class="mb-0 text-sm"><button @click="materialRemove(material.material_code)">항목제거</button></h6>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <button type="button" class="btn btn-outline-warning" @click="materialInputGo">발주하기</button>{{ checked2 }}
               모달로 거래처1개만 선택해야함 제발 ㅠㅠ // 주문도 하나만 체크 하고 해야함 // 제약조건 다 안했음
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div>
    <Modal :isShowModal="isShowModal" :modalName="modalName" :needQty="needQty" @closeModal="closeModal" @confirm="confirm">
      <!--
      <template v-slot:list>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
      </template>
      -->
    </Modal>
  </div>
</template>
<script>
import axios from 'axios';
import { ajaxUrl } from '@/utils/commons.js';
import userDateUtils from '@/utils/useDates.js';
import Modal from "@/views/material/temp/materialOrderChildModal.vue";  //모달

export default {
  props: {
    needMaterialList: {
      type: Array,  //받는 타입
      required: true, //엄마 값이여야함
      default: () => [],  //값없을때 기본 값 []
    },
  },
  components: {
    Modal,
  },
  data() {
    return {
      qty: 0,
      pic: 0,
      checked2: [],
      needMaterialListCopy: [],
      isShowModal: false, //모달 기본 숨겨짐
      modalName: '',  //모달이름
      needQty: '',  //필요수량
      clientselect: [],
      materialObj: {},
    };
  },
  // 감시하다 값이 바뀌면 작업하는 녀석
  watch: {
    needMaterialList: {
      handler(newNeedList) {
        //this.needMaterialListCopy = [...newNeedList];
        // 초기화할 때 clientName 속성 추가
        this.needMaterialListCopy = newNeedList.map((material) => ({
          ...material,
          clientName: material.clientName || '-',
        }));
      },
      immediate: true, // 컴포넌트 실행시 내용없어도 1회 실행
    },
  },
  computed: {
  },
  methods: {
    dateFormat(value, format) {
        return userDateUtils.dateFormat(value, format);
    },
    //그램 투 키로그램
    gToKg(gran){
      return gran*0.001;
    },
    // 거래금액 계산기
    calculateTotalPrice(qty, pic) {
      return qty && pic ? qty * pic : 0;
    },
    //전체 쳌
    click_all2(){
      if(this.allSelected2){
        this.checked2 = [];
      }else{
        this.checked2 = this.needMaterialListCopy.map(material => material.material_code);
      }
      this.allSelected2 = !this.allSelected2;
    },
    //항목제거
    materialRemove(materialCode) {
      this.needMaterialListCopy = this.needMaterialListCopy.filter(material => material.material_code !== materialCode);
      this.checked2 = this.checked2.filter(code => code !== materialCode);
    },
    //모달 열기
    openModal(materialvalue, needQtyValue) {
      this.isShowModal = !this.isShowModal;
      this.modalName = materialvalue;
      this.needQty = needQtyValue;
    },
    //모달 확인버튼
    confirm(data) {
      console.log('살려줘', data);
      //materialid: "설탕"name: "설탕나라회사"price: 100qty: 200
      //console.log('needMaterialListCopy:', this.needMaterialListCopy);
      //console.log('data[0].materialid:', data[0].materialid);

      let targetMaterial = this.needMaterialListCopy.find(
        (material) => material.material === data[0].materialid
      );
      //console.log('this',targetMaterial);

      if (targetMaterial) {
        this.checked2.push(targetMaterial.material_code);
        targetMaterial.clientName = data[0].name;
        targetMaterial.qty = data[0].qty;
        targetMaterial.pic = data[0].price;
        targetMaterial.code = data[0].code;
      }

      this.closeModal();
    },
    //모달 취소버튼
    closeModal() {
      this.isShowModal = false;
    },
    //이제 인서트 간다!
    materialInputGo() {
      console.log(this.checked2);
      let selectedMaterials = this.needMaterialListCopy.filter((material) =>
        this.checked2.includes(material.material_code)
      );

      let totalprice = (selectedMaterials[0].pic * selectedMaterials[0].qty);

      //필요한거
      // console.log('주문하는회사:', selectedMaterials[0].clientName);
      // console.log('납기일자:', selectedMaterials[0].lastDate);
      // console.log('단가:', selectedMaterials[0].pic);
      // console.log('발주수량:', selectedMaterials[0].qty);
      // console.log('총금액:', totalprice);
      // console.log('자재코드:', selectedMaterials[0].material_code);
      // console.log('사원번호: 로그인해야 알지');
      // console.log('거래처코드:', selectedMaterials[0].code);
      //이걸로 배열만들고 함수에 던지고
      //값을 받아서 처리할수 있게 SQL에 프로시저인가 함수인가 먼가 만들어야함
      this.materialObj = {
        clientNum: selectedMaterials[0].code,   //회사코드
        empNum: 1,    //추후에 로구인 아이디 받는걸로 바꿔야함!!! //사원코드
        materialCode: selectedMaterials[0].material_code, //자재코드
        ordQty: selectedMaterials[0].qty, //발주수량
        limitDate: selectedMaterials[0].lastDate,  //납기일자
        unitPrice: selectedMaterials[0].pic,  //단가
        totalPrice: totalprice //총금액
      };
      this.materialInputPOList(this.materialObj);
    },
    async materialInputPOList(materialObj){
      console.log(materialObj);
      let result = await axios.post(`${ajaxUrl}/material/inputPoLIst`, materialObj)
                               .catch(err => console.log(err));
      console.log(result.data);
      const resultValue = result.data[0][0]; 
      if(resultValue.result == 'OK'){
        this.$router.push({ name : 'materialOrderList' });
      }else{
        alert('개발자한테 문의 해주세요 ERRCODE 001');
      }
    },
  },
  created(){
  },  
};
</script>
<style scoped>
.pagination {
  display: flex;
  justify-content: center;
}
/* 모달 CSS */
.container-fluid {
  min-height: 500px;
  .search {
    margin-top: 24px;
  }
}
</style>