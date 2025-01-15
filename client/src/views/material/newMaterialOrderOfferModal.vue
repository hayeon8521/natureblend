<!-- 
    메뉴 : 자재>자재발주>자재 발주 관리 [개별주문 모달 > 자재리스팅 그리드]
-->
<template>
    <input type="text" v-model="inputListsearch" class="text-center styled-input" placeholder="자재명 입력하세요" />
    <div class="grid-container">
        <ag-grid-vue
            :rowData="rowData"
            :columnDefs="columnMateriallist"
            :theme="theme"
            @grid-ready="onReady"
            :quickFilterText="inputListsearch"
            :noRowsOverlayComponent="noRowsOverlayComponent"
            @rowClicked="selectMaterial"
            rowSelection="single"
        />
    </div>
    <div style="display: none">
        <CustomNoRowsOverlay/>
    </div>
</template>
<script>
import axios from "axios";
import { ajaxUrl } from '@/utils/commons.js';
import theme from "@/utils/agGridTheme";

export default{
    name : "MaterialList",

    data(){
        return{
            rowData:[], //거래처명 목록 저장
            theme : theme,
            selectedCom : "", // 거래처명 선택한것 
            columnMateriallist : [
                {headerName : "자재코드", field:"material_code",resizable: true, sortable: true, flex: 2, cellStyle: { textAlign: "center" }},
                {headerName : "자재명", field:"material_name",resizable: true, sortable: true, flex: 3, cellStyle: { textAlign: "left" }},
                {headerName : "안전재고", field:"safety_inventory",resizable: true, sortable: true, flex: 2, 
                    cellStyle: { textAlign: "right" },
                    cellRenderer: params => {
                        if (params.value) {
                            if(params.data.material_name.includes('병')){
                                const formatted_qty = params.value.toLocaleString()+' 개';
                                return `<span style="text-align: right;">${formatted_qty}</span>`;
                            }else{
                                const formatted_qty = params.value.toLocaleString()+' kg';
                                return `<span style="text-align: right;">${formatted_qty}</span>`;
                            }
                        } else {
                            return `<span style="text-align: right;"></span>`;
                        }
                    },

                },
                {headerName : "현재재고", field:"stok_qty",resizable: true, sortable: true, flex: 2, 
                    cellStyle: { textAlign: "right" },
                    cellRenderer: params => {
                        if (params.value) {
                            if(params.data.material_name.includes('병')){
                                const formatted_t_qty = params.value.toLocaleString()+' 개';
                                return `<span style="text-align: right;">${formatted_t_qty}</span>`;
                            }else{
                                const formatted_t_qty = params.value.toLocaleString()+' kg';
                                return `<span style="text-align: right;">${formatted_t_qty}</span>`;
                            }
                        } else {
                            return `<span style="text-align: right;"></span>`;
                        }
                    },
                },
            ],
            //검색어 검색 (그리드 안)
            inputListsearch: "", //검색어 1 (제품)
        }
    },
    created(){
        this.getMaterialList()
    },
    methods: {
        async getMaterialList(){
            let result = await axios.get(`${ajaxUrl}/material/material_list`) //서버호출
                                    .catch(err=> console.log(err));
            //this.rowData = result.data; //거래처목록 저장
            // this.rowData = result.data.map((col) => ({
            //     ...col,
            //     stok_qty: col.material.includes('병') ? Number(col.stok_qty).toLocaleString() : (col.stok_qty * 0.001).toLocaleString(),
            //     safety_inventory: col.material.includes('병') ? Number(col.safety_inventory).toLocaleString() : (col.safety_inventory * 0.001).toLocaleString(),
            // }));
            this.rowData = result.data.map((col) => ({
                ...col,
                stok_qty: col.material_name && col.material_name.includes('병')
                    ? Number(col.stok_qty).toLocaleString()
                    : (col.stok_qty * 0.001).toLocaleString(),
                safety_inventory: col.material_name && col.material_name.includes('병')
                    ? Number(col.safety_inventory).toLocaleString()
                    : (col.safety_inventory * 0.001).toLocaleString(),
            }));


        },

        selectMaterial(event){
            const Material = event.data;
            //console.log(Material);
            this.$emit('selectmaterial',Material);
        },
        onReady(event){
            this.gridApi = event.api;
            event.api.sizeColumnsToFit(); //그리드 api 넓이 슬라이드 안생기게하는거
            //페이징 영역에 버튼 만들기 
            const allPanels = document.querySelectorAll('.ag-paging-panel');
            const paginationPanel = allPanels[0];
            if (paginationPanel) {
               // 컨테이너 생성
               const container = document.createElement('div');
               container.style.display = 'flex';
               container.style.alignItems = 'center';
               container.style.gap = '5px'; // 버튼과 입력 필드 간격

               
                //입력필드생성 
                const inputText = document.createElement('input');
                inputText.type = 'text';
                inputText.placeholder = '검색';
                inputText.style.padding = '5px';
                inputText.style.width = '250px';
                inputText.style.border = '1px solid #ccc';
                inputText.style.borderRadius = '4px';

                //텍스트 계속 바꿔서 치면 ag그리드가 바꿔줌
                inputText.addEventListener('input',(event)=>{
                    const value = event.target.value;
                    //console.log("입력된 값:", value);

                    //검색로직추가기능
                    this.inputListsearch = value;
                });

                //컨테이너에 버튼, 입력 필드 추가
                container.appendChild(inputText);
                
            }
        },
    }
}
    
    
</script>
<style scoped lang="scss">
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