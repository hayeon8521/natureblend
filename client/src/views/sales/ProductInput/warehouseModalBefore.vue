<template>
<!--모달 안에 창고 목록 출력-->

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
                                      창고 코드
                                    </th> 
                                    <th
                                        class="text-uppercase text-secondary text-md font-weight-bolder opacity-7 ps-2"
                                    >
                                      창고 이름
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                            </tbody>
                                <tr
                                    v-for="warehouse in warehouseList" 
                                    :key="warehouse.warehouse_code"
                                    class="warehouse"
                                    :class=" { selected : selectedwarehouseCode === warehouse.warehouse_code}"
                                    @click = "selectWarehouse(warehouse)"
                                > 
                                    <td>
                                        <div class="d-flex px-2">
                                            <div class="my-auto">
                                                <h6 class="mb-0 text-sm">{{ warehouse.warehouse_code }}</h6>
                                            </div>
                                        </div> 
                                    </td>
                                    <td>
                                        <div class="d-flex px-2">
                                            <div class="my-auto">
                                                <h6 class="mb-0 text-sm">{{ warehouse.warehouse_name }}</h6>
                                            </div>
                                        </div> 
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
    name : "WarehouseList",

    data(){
        return{

            warehouseList: [],
            selectedwarehouseName:"",
            selectedwarehouseCode:"",
        }
    },
    created(){
        this.getWarehouseList()
    },
    methods: {
        async getWarehouseList(){
            let result = await axios.get(`${ajaxUrl}/input/warehouse`) //서버호출
                                    .catch(err=> console.log(err));
            this.warehouseList = result.data; //거래처목록 저장
        },

        selectWarehouse(warehouse){
            this.selectedwarehouseCode = warehouse.warehouse_code;
            this.selectedwarehouseName = warehouse.warehouse_name;
            this.$emit('selectwarehouse',warehouse);
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