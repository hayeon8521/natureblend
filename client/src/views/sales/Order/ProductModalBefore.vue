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
                                        제품코드
                                        </th>
                                        <th
                                            class="text-uppercase text-secondary text-md font-weight-bolder opacity-7 ps-2"
                                        >
                                        제품명
                                        </th> 
                                    </tr>
                                </thead>
                                <tbody>
                                </tbody>
                                    <tr
                                        v-for="product in productList" 
                                        :key="product.product_code"
                                        class="product"
                                        :class=" { selected : selectedProNum === product.product_code}"
                                        @click = "selectproduct(product)"
                                    > 
                                    <td>
                                        <div class="d-flex px-2">
                                            <div class="my-auto">
                                                <h6 class="mb-0 text-sm">{{ product.product_code }}</h6>
                                            </div>
                                        </div> 
                                    </td>
                                    <td>
                                        <p class="text-sm font-weight-bold mb-0">{{product.product_name }}</p>
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
    name : "ProductList",

    data(){
        return{
            productList:[], //제품 목록 저장
            selectedProNum: "" // 선택한 제품 코드 초기화
        }
    },
    created(){
        this.getEmpList()
    },
    methods: {
        async getEmpList(){
            let result = await axios.get(`${ajaxUrl}/orderlist/products`) //서버호출
                                    .catch(err=> console.log(err));
            this.productList = result.data; //제품목록 저장
        },

        selectproduct(product){
            this.selectedProNum = product.product_code;
            // console.log(this.selectedProNum,product.product_name);
            this.$emit('selectproduct',product);
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