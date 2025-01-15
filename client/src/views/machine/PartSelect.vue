<template>
    <div class="grid-container">
        <ag-grid-vue
        
        :rowData="rowData"
        :columnDefs="columnData"
        :theme="theme"
        @grid-ready="onReady"
        @rowClicked="selectRow"
        rowSelection="single"
    />
    </div>
</template>
<script>
import axios from "axios";
import { ajaxUrl } from '@/utils/commons.js';
import theme from "@/utils/agGridTheme";

export default{
    name : "partSelect",

    props: {
        machineData: Object,
    },

    data(){
        return{
            theme : theme,
            rowData:[], //거래처명 목록 저장
            columnData : [
                {headerName : "부품번호", field:"part_num", flex: 1 },
                {headerName : "설비분류", field:"changeTypeList", flex: 1 },
                {headerName : "부품이름", field:"part_name", flex: 1 },
            ],
            selectedData : "", // 선택한 값

            
        }
    },
    methods: {
        async getChangePartList(mType){
            let result = await axios.get(`${ajaxUrl}/parts/changePartList/${mType}`)
                                    .catch(err=> console.log(err));
            

            for(let i in result.data) {
              result.data[i].changeTypeList = result.data[i].machine_type.replace('p1', '세척기기')
                                                                         .replace('p2', '음료제작기기')
                                                                         .replace('p3', '포장기기');
            }
            this.rowData = result.data;
        },

        selectRow(event){
            const selectData = event.data;
            this.$emit('selectData', selectData);
        },
        
        onReady(event){
            this.gridApi = event.api;
        },
        
    },

    watch: {
      machineData: {
        handler() {
          this.getChangePartList(this.machineData.process_code);
        },
        deep: true
      },
    }

}
    
    
</script>
<style scoped lang="scss">
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
/* Firefox  */
input[type='number'] {
  -moz-appearance: textfield;
}

.card {
  box-shadow: none;
}
.emp:hover {
  background-color: $main3;
  cursor: pointer;
  transition: all .1s ease-in-out;
  h6, p {
    color: $white;
  }

}
.selected {
  background-color: $main1;
  h6, p {
    color: $white;
  }
}

.styled-input {
    display: block; /* 가운데 정렬을 위한 블록 처리 */
    margin: 0 auto; /* 부모 컨테이너 기준 가운데 정렬 */
    margin-top: 10px;
    padding: 10px; /* 안쪽 여백 */
    width: 250px; /* 입력 필드 너비 */
    text-align: center; /* 텍스트 가운데 정렬 */
    border: 1px solid #ccc; /* 테두리 */
    border-radius: 20px; /* 테두리 둥글게 */
    outline: none; /* 포커스 시 기본 테두리 제거 */
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* 약간의 그림자 */
    transition: box-shadow 0.3s ease; /* 호버 효과 추가 */
}

/* 포커스 또는 호버 상태에서 효과 */
.styled-input:focus,
.styled-input:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2); /* 더 강한 그림자 */
    border-color: #007bff; /* 포커스 시 테두리 색상 변경 */
}
</style>