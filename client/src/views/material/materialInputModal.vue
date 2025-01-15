 <!-- 
    메뉴 : 자재>자재입고>자재입고의 입고 모달 (창고 선택용)
-->
<template>
    <div class="modal fade" @click.self="closeModal" :class="{ show: isShowModal }" id="exampleModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header" style="background-color: #e9ecef;">
            <h1 class="modal-title fs-5" id="exampleModalLabel">입고하기</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" v-if="isShowModal">
            <!--테이블 그리드 폼-->
            <div class="container-fluid pl-4 pr-4 pt-0 pm-0"><!--py-4-->
                    <div class="row">
                        <div class="col-12">
                            <div class="card my-4 pb-2"  style="border-radius:10px;">
                                <div class="card-body px-0 pb-0 pt-0" style="background-color: #fb8c00; border-radius: 10px;">
                                        <table class="table align-items-center mb-0">
                                          <thead>
                                            <tr>
                                                <th class="text-center text-light text-xs font-weight-bolder ps-2">
                                                발주코드
                                                </th>
                                                <th class="text-center text-light text-xs font-weight-bolder ps-2">
                                                자재명
                                                </th>
                                                <th class="text-center text-light text-xs font-weight-bolder ps-2">
                                                정상수량
                                                </th>
                                                <th class="text-center text-light text-xs font-weight-bolder ps-2">
                                                창고선택
                                                </th>
                                                <th class="text-center text-light text-xs font-weight-bolder ps-2">
                                                불량수량
                                                </th>
                                                <th class="text-center text-light text-xs font-weight-bolder ps-2">
                                                창고선택
                                                </th>
                                            </tr>
                                          </thead>
                                        <tbody v-if="nuwList.length" style="background-color: white;">
                                          <tr v-for="nlist in nuwList" :key="nlist.order_code">
                                            <td class="text-xxs font-weight-bolder ps-2 text-center">
                                              {{ nlist.order_code }}
                                            </td>
                                            <td class="align-middle text-dark text-bold" style="text-align: left;">
                                              {{ nlist.material_name }}
                                            </td>
                                            <td class="align-middle text-bold" style="color: #4caf50;">
                                              {{ nlist.pass_qnt }}
                                            </td>
                                            <td class="text-xxs font-weight-bolder ps-2">
                                              <!-- 값이없으면 스타일없고, 값이있으면 그값이 폐기인지 찾고 그에맞게 처리 ?. 체이닝 연산자 이용해서 결과 이후엔 언디파인으로 거짓처리 -->
                                              <select v-model="nlist.warehouse1" class="form-select text-center"
                                                :style="{
                                                  color: nlist.warehouse1 === '' ? '' : 
                                                        whList.find(wh => wh.warehouse_code === nlist.warehouse1)?.warehouse_name.includes('폐기') ? '#f44335' : '#4caf50',
                                                  fontWeight: nlist.warehouse1 === '' ? '' : 
                                                            whList.find(wh => wh.warehouse_code === nlist.warehouse1)?.warehouse_name.includes('폐기') ? 'normal' : 'bold',
                                                }"
                                              >
                                                <option disabled value="">창고선택</option>
                                                <option v-for="wh in whList" :key="wh.warehouse_code" :value="wh.warehouse_code"
                                                  :style="{ 
                                                    color: wh.warehouse_name.includes('폐기') ? '#f44335' : '#4caf50',
                                                    fontWeight: wh.warehouse_name.includes('폐기') ? 'normal' : 'bold',
                                                  }">
                                                  {{ wh.warehouse_name }}
                                                </option>
                                            </select>
                                            </td>
                                            <td class="align-middle text-bold" style="color: #f44335;">
                                              {{ nlist.rjc_qnt }}
                                            </td>
                                            <td class="text-xxs font-weight-bolder ps-2">
                                              <select v-model="nlist.warehouse2" class="form-select text-center"
                                              :style="{
                                                color: nlist.warehouse2 && whList.find(wh => wh.warehouse_code === nlist.warehouse2)?.warehouse_name.includes('폐기') ? '#f44335' : '#4caf50',
                                                fontWeight: nlist.warehouse2 && whList.find(wh => wh.warehouse_code === nlist.warehouse2)?.warehouse_name.includes('폐기') ? 'bold' : 'normal',
                                              }">
                                              <!-- ?. 옵셔널 체이닝연산자 : 참인값 찾으면 이후껀 다 언디파인으로 출력 -->
                                                <option disabled value="">창고선택</option>
                                                <option
                                                  v-for="wh in whList"
                                                  :key="wh.warehouse_code"
                                                  :value="wh.warehouse_code"
                                                  :style="{ 
                                                    color: wh.warehouse_name.includes('폐기') ? '#f44335' : '#4caf50',
                                                    fontWeight: wh.warehouse_name.includes('폐기') ? 'bold' : 'normal'
                                                  }"
                                                >
                                                  {{ wh.warehouse_name }}
                                                </option>
                                              </select>
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


                <!-- <ul>
                    <li v-for="(row, index) in whList" :key="index">
                    {{ row }}
                    </li>
                </ul> -->
            </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="closeModal">닫기</button>
            <button type="button" class="btn" style="background-color: #4caf50; color: white;" @click="confirm">입고</button>
          </div>
        </div>
      </div>
    </div>
  </template>


<script setup>
  import { defineProps, defineEmits } from 'vue';     //watch

  const { isShowModal, nuwList, whList } = defineProps({
        isShowModal: Boolean,
        nuwList: Array,
        whList: Array,
    });

    const emit = defineEmits(['closeModal', 'confirm']);

    const closeModal = () => {
        emit('closeModal'); // 부모 컴포넌트로 이벤트 전송
    }; 
  
    const confirm = () => {
      //console.log('최종 nuwList 데이터:', nuwList); 
      emit('confirm', nuwList); // 부모로 원본 데이터를 전달
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
      max-height: 500px;
    }
  }
  .show {
    display: block;
  }
  button {
    font-size: 16px;
  }
  .modal-dialog {
    max-width: 600px;
    margin: auto;
    }
    td {
      text-align: right;
    }
  </style>