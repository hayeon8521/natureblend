<template>
    <!--모달 안에 영업직원 목록 출력-->
    
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
                                        담당자이름
                                        </th> 
                                    </tr>
                                </thead>
                                <tbody>
                                </tbody>
                                    <tr
                                        v-for="emp in empList" 
                                        :key="emp.name"
                                        class="emp"
                                        :class=" { selected : selectedEmpName === emp.name}"
                                        @click = "selectemp(emp)"
                                    > 
                                    <td>
                                        <div class="d-flex px-2">
                                            <div class="my-auto">
                                                <h6 class="mb-0 text-sm">{{ emp.name }}</h6>
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
        name : "EmpList",
    
        data(){
            return{
                empList:[], //영업직원명 목록 저장
                selectedEmpName : "", // 영업직원명 선택한것 
            }
        },
        created(){
            this.getEmpList()
        },
        methods: {
            async getEmpList(){
                let result = await axios.get(`${ajaxUrl}/orderlist/emps`) //서버호출
                                        .catch(err=> console.log(err));
                this.empList = result.data; //직원목록 저장
                console.log(this.empList);
            },
    
            selectemp(emp){
                this.selectedEmpName = emp.name;
                this.$emit('selectemp',emp);
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