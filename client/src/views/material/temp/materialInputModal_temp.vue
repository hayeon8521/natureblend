<!-- 사용안함 자재입고 메뉴에 모달 ag그리도 시도한것 -->
<template>
    <div class="modal fade" @click.self="closeModal" :class="{ show: isShowModal }" id="exampleModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">입고하기</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" v-if="isShowModal">
            <div class="grid-container">
                <ag-grid-vue
                    :rowData="[...nuwList]"
                    :columnDefs="columnDefs"
                    :theme="theme"
                    @grid-ready="onReady"
                    
                    rowSelection="multiple"
                    >
                </ag-grid-vue>
            </div>


                <!-- <ul>
                    <li v-for="(row, index) in nuwList" :key="index">
                    {{ row }}
                    </li>
                </ul> -->
            </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-warning" @click="confirm">입고하기</button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="closeModal">취소하기</button>
          </div>
        </div>
      </div>
    </div>
  </template>


<script setup>
  import { defineProps, defineEmits, ref } from 'vue';     //watch

  const { isShowModal, nuwList, testStr  } = defineProps({
        isShowModal: Boolean,
        nuwList: Array,
        testStr: String,
    });

    const emit = defineEmits(['closeModal', 'confirm']);

    const closeModal = () => {
        emit('closeModal'); // 부모 컴포넌트로 이벤트 전송
    };

    const confirm = () => {
        emit('confirm'); // 부모 컴포넌트로 이벤트 전송
        console.log(testStr);
    };

// 행 레코드 삽입하는 변수 (지금 newlist로 바로 넣고 있음)
//const rowData = ref([]);
 

  //그리드 api 컬럼명 들어가는 거
 const columnDefs = ref([
        { headerName: "발주코드", field: "order_code", width:300 },
        { headerName: "자재명", field: "material_name" },
        { headerName: "정상수량", field: "pass_qnt" },
        {
          headerName: "창고",
          field: "warehouse1",
          cellEditor: "agSelectCellEditor", // 셀렉트 에디터
          cellEditorParams: {
            values: ["자재창고", "보관창고", "폐기창고"],
          },
          editable: true, //편집가능
        },
        { headerName: "불량수량", field: "rjc_qnt" },
        {
          headerName: "창고2",
          field: "warehouse1",
          cellEditor: "agSelectCellEditor", // 셀렉트 에디터
          cellEditorParams: {
            values: ["자재창고", "보관창고", "폐기창고"],
          },
          editable: true, //편집가능
        },
      ]);

//ag-grid 메소드 API가 준비된 후 발생하는 이벤트
const onReady = (param) => {
  param.api.sizeColumnsToFit(); //그리드 api 넓이 슬라이드 안생기게하는거
}
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
  </style>