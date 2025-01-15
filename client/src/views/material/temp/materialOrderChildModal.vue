<!--리뉴얼로 사용 안하는 페이지-->
<template>
    <div class="modal fade" :class="{ show: isShowModal }" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">{{ mainName }} 거래처 선택</h1>
                <h1 class="modal-title fs-5" id="exampleModalLabel">현재 필요 수량 {{ needQtyName }} KG</h1>
            </div>
            <div class="modal-body">
                <!--<slot name="list">slot</slot>-->
                <input type="text" class="form-control" v-model="clientName" placeholder="거래처 입력" style="display: inline-block; width: 30%; margin-right: 10px;">
                <button style="display: inline-block; width: 20%;" @click="searchClient(clientName)">검색</button><br>
                <!--테이블 그리드 폼-->
                <div class="container-fluid pl-4 pr-4 pt-0 pm-0"><!--py-4-->
                    <div class="row">
                        <div class="col-12">
                            <div class="card my-4">
                                <div class="card-body px-0 pb-2">
                                    <div class="table-responsive p-0"></div>
                                        <table class="table align-items-center mb-0">
                                        <thead>
                                        <tr>
                                            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                                            업체명
                                            </th>
                                            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                                            담당자
                                            </th>
                                            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                                            연락처
                                            </th>
                                            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                                            추가
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr v-for="cl in clientList" :key="cl.com_name">
                                            <td>
                                            <div class="d-flex px-2 py-1">
                                            <div class="d-flex flex-column justify-content-center">
                                                <h6 class="mb-0 text-sm">{{ cl.com_name }}</h6>
                                            </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="d-flex px-2 py-1">
                                            <div class="d-flex flex-column justify-content-center">
                                                <h6 class="mb-0 text-sm">{{ cl.emp_name }}</h6>
                                            </div>
                                            </div>
                                        </td>
                                        <td class="align-middle text-center text-sm">
                                            <div class="d-flex px-2 py-1">
                                            <div class="d-flex flex-column justify-content-center">
                                                <h6 class="mb-0 text-sm">{{ cl.emp_tel }}</h6>
                                            </div>
                                            </div>
                                        </td>
                                        <td class="align-middle text-center text-sm">
                                            <div class="d-flex px-2 py-1">
                                            <div class="d-flex flex-column justify-content-center">
                                                <button type="button" @click="clientInput(cl.com_name, cl.client_num)">추가</button>
                                            </div>
                                            </div>
                                        </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!--테이블 그리드 폼 끝-->
                <!--테이블 그리드 폼-->
                <div class="container-fluid pl-4 pr-4 pt-0 pm-0"><!--py-4-->
                    <div class="row">
                        <div class="col-12">
                            <div class="card my-4">
                                <div class="card-body px-0 pb-2">
                                    <div class="table-responsive p-0"></div>
                                        <table class="table align-items-center mb-0">
                                        <thead>
                                        <tr>
                                            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                                            업체명
                                            </th>
                                            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                                            발주수량(KG,EX)
                                            </th>
                                            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                                            단가(원)
                                            </th>
                                            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                                            선택취소
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody v-if="clientselect.length">
                                            <tr v-for="cs in clientselect" :key="cs.name">
                                                <td class="text-uppercase text-xxs font-weight-bolder ps-2">
                                                            {{ cs.name }}
                                                </td>
                                                <td class="align-middle text-center">
                                                    <div class="d-flex px-2 py-1">
                                                        <div class="d-flex flex-column justify-content-center">
                                                            <h6 class="mb-0 text-sm"><input type="number" v-model.number="cs.qty" class="form-control" style="width: 75px;" placeholder="수량"></h6>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td class="align-middle text-center">
                                                    <div class="d-flex px-2 py-1">
                                                        <div class="d-flex flex-column justify-content-center">
                                                            <h6 class="mb-0 text-sm"><input type="number" v-model.number="cs.price" class="form-control" style="width: 75px;" placeholder="단가"></h6>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td class="align-middle text-center">
                                                    <div class="d-flex px-2 py-1">
                                                        <div class="d-flex flex-column justify-content-center">
                                                            <button type="button" @click="materialRemove2(cs.name)">삭제</button>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!--테이블 그리드 폼 끝-->
            </div>
            <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="closeModal">Close</button>
            <button type="button" class="btn btn-primary" @click="confirm" >거래처등록</button>
            </div>
        </div>
        </div>
    </div>
</template>
  <script>
import axios from 'axios';
import { ajaxUrl } from '@/utils/commons.js';

export default {
  name: "Modal",
  props: {
    isShowModal: Boolean,
    modalName: String,
    needQty: String,
  },
  data() {
    return {
      modalState: this.isShowModal,
      mainName: '',
      needQtyName: '',
      clientList: [],
      clientselect: [],
    };
  },
  watch: {
    modalName(clientMaterial) {
      this.mainName = clientMaterial;
      this.fullClient();
      this.clientselect = [];
    },
    needQty(need_qty) {
        this.needQtyName = need_qty ? need_qty : '0';
    },
  },
    created() {
    },
  methods: {
    async fullClient(){
        let result = await axios.get(`${ajaxUrl}/material/fullClient`)
                          .catch(err => console.log(err));
        this.clientList = result.data;
        //console.log(result.data);
    },
    async fullClientInfo(clientName){
        let result = await axios.get(`${ajaxUrl}/material/fullClientKeyWord/${clientName}`)
                          .catch(err => console.log(err));
        this.clientList = result.data;
        //console.log(result.data);
    },
    closeModal() {
        this.clientselect = [];
        this.$emit('closeModal');
    },
    confirm() {
        let newMaterial = {
            //필드명 : 당근
            materialid: this.mainName,
        };
        //값있으면 첫 배열에만 값추가함
        //Object.assign(this.clientselect[0], newMaterial);
        //Object.assign(this.clientselect, newMaterial);
        this.clientselect.forEach((idx) => {
            Object.assign(idx, newMaterial);
        });
        
        this.$emit('confirm', this.clientselect);
        //console.log(this.clientselect);
        this.clientselect = [];
    },
    searchClient(clientName) {
        if(clientName){
            this.fullClientInfo(clientName);
        }else{
            this.fullClient();
        }
        console.log(this.clientName);
    },
    clientInput(clientvalue, client_num) {
        let newClient = {
            name: clientvalue,
            code: client_num,
            qty: 0,
            price: 0,
        };
        //들어오는값 배열 만들어야해서
        if (!this.clientselect.some(cs => cs.name === clientvalue)) {
            this.clientselect.push(newClient);
        }
        /*
        //단건 리스팅
        if (!this.clientselect.includes(clientvalue)) {
            this.clientselect.push(clientvalue);
            console.log(this.clientselect);
        }
            */
    },
    materialRemove2(clientToRemove) {
        this.clientselect = this.clientselect.filter(cs => cs.name !== clientToRemove);
    },
  },
};
  </script>
  
  
  <style scoped>
  .show {
    display: block;
  }
  </style>