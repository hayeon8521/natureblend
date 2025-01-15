<template>
    <!--모달 안에 제품 목록 출력-->
    
    <div class="container-fluid">
        <div class="row w-100">
            <div class="col-12">
                <div class="card">
                    <div class="card-body px-0">
                        <div class="table-responsive p-0">
                            <table
                      class="table align-items-center justify-content-center mb-0"
                         >
                                <thead>
                                    <tr>
                                        <th
                                            class="text-uppercase text-secondary text-md font-weight-bolder opacity-7 ps-2"
                                        >
                                        반품코드
                                        </th>
                                        <th
                                            class="text-uppercase text-secondary text-md font-weight-bolder opacity-7 ps-2"
                                        >
                                        반품이유
                                        </th> 
                                    </tr>
                                </thead>
                                <tbody>
                                </tbody>
                                    <tr
                                        v-for="returns in returnList" 
                                        :key="returns.return_code"
                                        class="returns"
                                        :class=" { selected : selectedReturnCode === returns.return_code}"
                                        @click = "selectreturn(returns)"
                                    > 
                                        <td>
                                        <div class="d-flex px-2">
                                            <div class="my-auto">
                                                <h6 class="mb-0 text-sm">{{ returns.return_code }}</h6>
                                            </div>
                                        </div> 
                                    </td>
                                    <td>
                                        <p class="text-sm font-weight-bold mb-0">{{returns.return_reason }}</p>
                                    </td>
                                </tr> 
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import axios from "axios";
import { ajaxUrl } from '@/utils/commons.js';



export default{
    name : "ReturnList",

    data(){
        return{
            returnList:[], //반품 목록 저장
            selectedReturnCode: "", // 선택한 제품 코드 초기화
            selectedReturnReason:""
        }
    },
    created(){
        this.getReturnList()
    },
    methods: {
        async getReturnList(){
            let result = await axios.get(`${ajaxUrl}/return`) //서버호출
                                    .catch(err=> console.log(err));
            this.returnList = result.data; //반품목록 저장
            console.log(this.returnList);
        },

        selectreturn(returns){
            this.selectedReturnCode = returns.return_code; 
            this.selectedReturnReason = returns.return_reason; 
            this.$emit('selectreturn',returns);
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
</style>