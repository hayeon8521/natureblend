<!--리뉴얼로 사용 안하는 페이지-->
<!-- 자재 주문 -->
<template>
  <div class="container-fluid pl-4 pr-4 pt-0 pm-0">
    <div class="row">
      <div class="col-12">
        <div class="card my-4">
          <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
            <div
                class="shadow-warning border-radius-lg pt-4 pb-3"
            >
              <h6 class="text-black text-capitalize ps-3">자재 주문 등록</h6>
            </div>
          </div>
          <div class="card-body px-0 pb-2">
            <div class="table-responsive p-0">
              <table class="table align-items-center mb-0">
                <thead>
                  <tr>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                      <label><input type="checkbox" v-model="allSelected" @click="click_all"/>전체선택</label>
                    </th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                      생산계획코드
                    </th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                      생산번호
                    </th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                      생산계획명
                    </th>
                    <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                      계획등록일자
                    </th>
                    <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                      총수량
                    </th>
                  </tr>
                </thead>
                <tbody>
                <tr v-for="pdt in productorderlist" :key="pdt.order_code">
                  <td>
                    <label><input type="checkbox" :value="pdt.order_plan_num" v-model="checked"></label>
                  </td>
                  <td>
                    <div class="d-flex px-2 py-1">
                      <div class="d-flex flex-column justify-content-center">
                        <h6 class="mb-0 text-sm">{{ pdt.order_plan_num }}</h6>
                      </div>
                    </div>
                  </td>
                  <td class="align-middle text-center text-sm">
                    <div class="d-flex px-2 py-1">
                      <div class="d-flex flex-column justify-content-center">
                        <h6 class="mb-0 text-sm">{{ pdt.plan_num }}</h6>
                      </div>
                    </div>
                  </td>
                  <td class="align-middle text-center text-sm">
                    <div class="d-flex px-2 py-1">
                      <div class="d-flex flex-column justify-content-center">
                        <h6 class="mb-0 text-sm">{{ pdt.product_code }}</h6>
                      </div>
                    </div>
                  </td>
                  <td class="align-middle text-center">
                    <div class="d-flex px-2 py-1">
                      <div class="d-flex flex-column justify-content-center">
                        <h6 class="mb-0 text-sm">{{ dateFormat(pdt.plan_create_date, 'yyyy-MM-dd') }}</h6>
                      </div>
                    </div>
                  </td>
                  <td class="align-middle">
                    <div class="d-flex px-2 py-1">
                      <div class="d-flex flex-column justify-content-center">
                        <h6 class="mb-0 text-sm">{{ pdt.plan_qty }}</h6>
                      </div>
                    </div>
                  </td>
                </tr>
                </tbody>
              </table>
              <button type="button" class="btn btn-outline-warning" @click="materialSelect(checked)">선택</button> 
              현재1건씩만처리됨 모든데이터다처리하고 중복값들 묶어서 아랫쪽으로 내리는 스크립트 필요
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--
    <material-pagination color="warning" size="md">
      <material-pagination-item prev />
      <material-pagination-item label="1" active />
      <material-pagination-item label="2" disabled />
      <material-pagination-item label="3" disabled/>
      <material-pagination-item label="4" disabled/>
      <material-pagination-item label="5" disabled/>
      <material-pagination-item next />
    </material-pagination>
    -->
  </div>
  <div>
    <materialChild :needMaterialList="needMaterialList" /> <!-- 자식 컴포넌트 부르고 뒤에 값은 자식한테 전달하고-->
  </div>
</template>
<script>
//import MaterialPagination from "@/components/MaterialPagination.vue";
//import MaterialPaginationItem from "@/components/MaterialPaginationItem.vue";
import axios from 'axios';
import { ajaxUrl } from '@/utils/commons.js';
import userDateUtils from '@/utils/useDates.js';
import materialChild from '@/views/material/temp/materialOrderChild.vue';

export default {
  name: "tables",
  components: {
    //MaterialPaginationItem,
    //MaterialPagination,
    materialChild,
  },
  data() {
    return {
      checked: [],
      allSelected : false,
      productorderlist: [],
      needMaterialList: [],
    };
  },
  computed: {
  },
  methods: {
    // 화면이 시작되면 나오는 화면 (0)
    async productorder(){
        let result = await axios.get(`${ajaxUrl}/material/orderplan`)
                          .catch(err => console.log(err));
        this.productorderlist = result.data;
        console.log(result.data);
    },
    //날짜변환 함수
    dateFormat(value, format) {
        return userDateUtils.dateFormat(value, format);
    },
    //전체 쳌
    click_all(){
      if(this.allSelected){
        this.checked = [];
      }else{
        //console.log(this.productorderlist);
        this.checked = this.productorderlist.map(pdt => pdt.plan_num);
      }
      this.allSelected = !this.allSelected;
    },
    //전달 받은 계획 코드에 맞는 자재 데이터 양산 (2)
    async needMaterialOrder(planCode){
      let needMaterialOrderResult = await axios.get(`${ajaxUrl}/material/needOrderMaterial/${planCode}`)
                          .catch(err => console.log(err));
        console.log(needMaterialOrderResult.data);
        this.needMaterialList = needMaterialOrderResult.data;
    },
    // 체크된 정보 수정해서 전달 (1)
    materialSelect(checked){
      for (let planCode of checked) {
        console.log(planCode);
        this.needMaterialOrder(planCode);
      }
    },
  },
  created(){
    this.productorder();
  },  
};
</script>
<style scoped>
.pagination {
  display: flex;
  justify-content: center;
}
</style>