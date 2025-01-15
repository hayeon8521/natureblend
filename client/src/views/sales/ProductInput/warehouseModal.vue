<template>
    <div>
            <!--모달 안에 창고 목록 출력-->
        <input type="text" v-model="inputListsearch" class="text-center styled-input" placeholder="창고이름 입력하세요"/>
        <div class="grid-container">
            <ag-grid-vue
            
            :rowData="rowData"
            :columnDefs="columnWarlist"
            :theme="theme"
            @grid-ready="onReady"
            :quickFilterText="inputListsearch"
            :noRowsOverlayComponent="noRowsOverlayComponent"
            @rowClicked="selectWarehouse"
            rowSelection="single" 
        />
        </div>
        <div style="display: none">
            <CustomNoRowsOverlay/>
        </div>
    </div>


</template>
<script>
import axios from "axios";
import { ajaxUrl } from '@/utils/commons.js';
import theme from "@/utils/agGridTheme";
import CustomNoRowsOverlay from "@/views/natureBlendComponents/grid/noDataMsg.vue";

export default{
    name : "WarehouseList",
    components:{
        CustomNoRowsOverlay,
    },

    data(){
        return{
            noRowsOverlayComponent:'CustomNoRowsOverlay',
            rowData: [],
            selectedwarehouseName:"",
            selectedwarehouseCode:"",
            theme : theme,
            columnWarlist :[
            {headerName : "창고 코드", field:"warehouse_code",resizable: true, sortable: true},
            {headerName : "창고 이름", field:"warehouse_name",resizable: true, sortable: true},

            ],
             //검색어 검색 (그리드 안)
             inputListsearch: "", //검색어 1 (제품)
        }
    },
    created(){
        this.getWarehouseList()
    },
    methods: {
        async getWarehouseList(){
            let result = await axios.get(`${ajaxUrl}/input/warehouse`) //서버호출
                                    .catch(err=> console.log(err));
            this.rowData = result.data; //거래처목록 저장
        },

        selectWarehouse(event){
            const warehouse = event.data;
            this.$emit('selectwarehouse',warehouse);
        },
        onReady(event){
            this.gridApi = event.api;
            //event.api.sizeColumnsToFit(); //그리드 api 넓이 슬라이드 안생기게하는거
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