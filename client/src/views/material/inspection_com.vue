<!-- 
    메뉴 : 자재>자재입고>자재입고의 검사표 모달
    메뉴 : 자재>자재입고>자재입고조회의 검사표 모달
-->
<template>
   <div class="modal fade" @click.self="closeModal2" :class="{ show: isShowModal2 }" id="exampleModal" tabindex="-1">
     <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
       <div class="modal-content">
         <div class="modal-header" style="background-color: #e9ecef;">
           <h1 class="modal-title fs-5" id="exampleModalLabel">[ {{ inspection_data.material_name }} ] 검수확인증</h1>
           <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
         </div>
          <div class="modal-body" v-if="isShowModal2">




            <div class="container mt-4">
               <table class="table table-bordered" v-if="resultdata && Object.keys(resultdata).length > 0">
                  <tbody>
                     <tr>
                        <td class="table-title">발주담당자</td>
                        <td>{{ resultdata.Iname }}</td>
                        <td class="table-title">생산업체명</td>
                        <td>{{ inspection_data.com_name }}</td>
                     </tr>
                     <tr>
                        <td class="table-title">발주코드</td>
                        <td>{{ inspection_data.order_code }}</td>
                        <td class="table-title">검수담당</td>
                        <td>{{ resultdata.Qname }}</td>
                     </tr>
                     <tr>
                        <td class="table-title">합격수량</td>
                        <td class="highlight-green">{{ inspection_data.pass_qnt }}</td>
                        <td class="table-title">불량수량</td>
                        <td class="highlight-red">{{ inspection_data.rjc_qnt }}</td>
                     </tr>
                  </tbody>
               </table>

               <table class="table table-bordered  text-center">
                     <thead class="table-light">
                        <tr>
                           <th>검사코드</th>
                           <th>처리코드</th>
                           <th>사유</th>
                           <th>개수 (kg, 개)</th>
                        </tr>
                     </thead>
                     <tbody>
                        <template v-if="inspectionList.length">
                        <tr v-for="val in inspectionList" :key="val.qc_material_rjc_id">
                           <td>{{ val.qc_material_rjc_id }}</td>
                           <td>{{ val.faulty_code }}</td>
                           <td>{{ val.faulty_reason }}</td>
                           <td style="text-align: right;">{{ val.rjc_quantity }}</td>
                        </tr>
                        </template>
                        <template v-else>
                        <tr>
                           <td colspan="4"><h3>불량 재고가 없습니다</h3></td>
                        </tr>
                        </template>
                     </tbody>
               </table>
            </div>




          </div>
         <div class="modal-footer">
           <button type="button" class="btn btn-secondary" @click="confirm2">닫기</button>
           <!--<button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal" @click="closeModal2">닫기</button>-->
         </div>
       </div>
     </div>
   </div>
 </template>

<script>
   import axios from 'axios';
   import { ajaxUrl } from '@/utils/commons.js';

   export default {
      name: "InspectionModal",
    //컴포넌트 선언했어
    components: {
    },
    //엄마가 주는 데이터 받을꺼
    props: {
      isShowModal2: Boolean,
      inspection_data: {
         type: Object,  //받는 타입
         required: true, //엄마 값이여야함
      },
    },
    // 널 계속 감시할꺼야
    watch: {
      inspection_data: {
         handler: "one_start",
         immediate: true, 
      },
    },
    //변수 넣는 통은 너야
    data(){
        return{
            inspectionList: [],
            resultdata: {},
        };
    },
    methods: {
      //모달 실행시 최초 1회 호출할 내용
      one_start(){
         this.inspectionInfo();
      },
      //DB 호출해서 화면에 오류처리함
      async inspectionInfo(){
         let result = await axios.post(`${ajaxUrl}/material/inspectionInfo`, this.inspection_data)
                                 .catch(err => console.log(err));
         //console.log('aaaaa',result.data);
         this.resultdata = result.data[0];
         if(result.data[0]){
            if(result.data[0]['faulty_code']){
               this.inspectionList = result.data.map( (val) => ({
                  faulty_code: val.faulty_code,
                  faulty_reason: val.faulty_reason,
                  qc_material_rjc_id: val.qc_material_rjc_id,
                  //rjc_quantity: val.rjc_quantity,
                  rjc_quantity: this.inspection_data.material_name.includes('병') ? (Number(val.rjc_quantity)) + ' 개' : (Number(val.rjc_quantity)*0.001) + ' kg',
               }));
               //console.log('bbbb',this.inspectionList);
            }
         }
      },
      

      closeModal2() {
         this.inspectionList = [];
         this.resultdata = {};
         this.$emit('closeModal2');
      },
      confirm2() {
         this.inspectionList = [];
         this.resultdata = {};
         this.$emit('confirm2');
      },
    },
};
</script>
 
 <style scoped>
 .modal {
   position: fixed;
   left: 0;
   top: 0;
   width: 100%;
   height: 100%;
   background: rgba(0, 0, 0, 0.4);
   .modal-body {
     max-height: 1000px;
   }
 }
 .show {
   display: block;
 }
 button {
   font-size: 16px;
 }
 .modal-dialog {
   max-width: 650px;
   margin: auto;
   }


.table-title {
   font-weight: bold;
   background-color: #e9ecef;
   text-align: center;
   color: black;
}
.highlight-green {
   color: green;
   font-weight: bold;
}
.highlight-red {
   color: red;
   font-weight: bold;
}
.table-bordered td, .table-bordered th {
   border: 1px solid #dee2e6 !important;
}
 </style>