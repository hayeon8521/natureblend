<template>
<!--모달 안에 거래처 목록 출력-->

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
                                       거래처 이름
                                    </th> 
                                </tr>
                            </thead>
                            <tbody>
                            </tbody>
                                <tr
                                    v-for="client in clientList" 
                                    :key="client.com_name"
                                    class="client"
                                    :class=" { selected : selectedCom === client.com_name}"
                                    @click = "selectClient(client)"
                                > 
                                <td>
                                    <div class="d-flex px-2">
                                        <div class="my-auto">
                                            <h6 class="mb-0 text-sm">{{ client.com_name }}</h6>
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
    name : "ClientList",

    data(){
        return{
            clientList:[], //거래처명 목록 저장
            selectedCom : "", // 거래처명 선택한것 
        }
    },
    created(){
        this.getClientList()
    },
    methods: {
        async getClientList(){
            let result = await axios.get(`${ajaxUrl}/orderlist/clients`) //서버호출
                                    .catch(err=> console.log(err));
            this.clientList = result.data; //거래처목록 저장
        },

        selectClient(client){
            this.selectedCom = client.com_name;
            this.$emit('selectclient',client);
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