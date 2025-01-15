<template>
  <div class="d-flex">
      <div class="form-container">
          <h1> BOM 관리 </h1>
          <div class="search pe-md-3 d-flex align-items-center ms-md-auto">
              <div class="d-flex align-items-center">
                  <span>BOM번호</span>
                  <input v-model="searchBomnum" readonly id="search-bomnum" type="text" class="form-control"/>
              </div>
              <div class="d-flex align-items-center">
                  <span>제품코드</span>
                  <input v-model="searchProductcode"  id="search-productcode" type="text" class="form-control"/>
              </div>
          </div>
          <div class="search pe-md-3 d-flex align-items-center ms-md-auto">
              <div class="d-flex align-items-center">
                  <span>제품명</span>
                  <input v-model="searchProduct" id="product-search" type="text" class="form-control"/>
              </div>
              <div class="d-flex align-items-center ms-md-3">
                  <span>용량</span>
                  <input v-model="searchCapacity" id="capacity-search" type="text" class="form-control"/>
              </div>
          </div>
          
          <div class="search pe-md-3 d-flex align-items-center ms-md-auto" v-for="(item, index) in bomBox" :key="index">
            <div class="d-flex align-items-center ms-md-3">
                  <span>자재코드</span>
                  <input v-model="item.material_code" :id="'materialcode-' + index" type="text" class="form-control"/>
              </div>
              <div class="d-flex align-items-center ms-md-3">
                  <span>자재</span>
                  <input v-model="item.material" :id="'material-' + index" type="text" class="form-control"/>
              </div>
              <div class="d-flex align-items-center ms-md-3">
                  <span>단위</span>
                  <input v-model="item.material_con" :id="'unit-' + index" type="text" class="form-control"/>
              </div>
          </div>

          
          <button type="button" @click="updateBom" class="btn btn-success">
              수정 완료
          </button>
          <button type="button" @click="addMaterial" class="btn btn-primary">
             자재 추가
          </button>
          <button type="button" @click="insertBom" class="btn btn-danger">
            BOM 등록
          </button>
      </div>
      
      <div class="table-container">
          <div class="container">
              <table class="table table-hover">
                  <thead>
                      <tr>
                          <th>제품명</th>
                          <th>용량</th>
                          <th>제품코드</th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr :key="i" v-for="(bom, i) in bomList">
                          <td>{{ bom.product_name }}</td>
                          <td>{{ bom.capacity }}</td>
                          <td>{{ bom.product_code }}</td>
                          <td><button type="button" @click="view(bom.product_name,bom.capacity,bom.bom_num,bom.material_code,bom.product_code)" class="btn btn-secondary">조회</button></td>
                          <td><button type="button" @click="dele(bom.bom_num)" class="btn btn-warning">삭제</button></td>
                      </tr>
                  </tbody>
              </table>
          </div>
      </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import { ajaxUrl } from '@/utils/commons.js';
  
  export default { 
      name: 'BomManagement',
      data() {
        return { 
          bomList: [],
          bomBox: [],
          bomBox2: [],
          newList: [],

          searchBomnum: '',  // BOM 번호
          searchProductcode: '', // 제품코드
          searchProduct: '', // 제품명
          searchCapacity: '', // 용량
          searchMaterialcode: '', // 자재코드
          isUpdated : false
        };
      },
      created() {
        this.getBomList();
      },
      methods: {
        async getBomList() {
            let result = await axios.get(`${ajaxUrl}/bomview`);
            if (result && result.data) {
              this.bomList = result.data;
            } else {
              console.log("서버 연결 실패");
            }
        },
        async getBom(bomnum){
          let result = await axios.get(`${ajaxUrl}/boms/${bomnum}`);
          this.bomBox=result.data;
          this.bomBox2 = JSON.parse(JSON.stringify(this.bomBox));
          // console.log(result.data);
        },
        
        
        async updateBomlist({ bom_seq, bom_num, material_code, material, material_con }){
        /*
        console.log(bomarray);
        console.log(bomarray.bom_seq);
        if (!Array.isArray(bomarray)) {
              console.error('Invalid data: bomarray is not an array', bomarray);
              return; 
        };
      
        this.newList = bomarray.map(({ bom_num, material_code, material, material_con }) => ({
              bom_num,
              material_code,
              material,
              material_con
          })); */
        
          this.newList = { bom_num, material_code, material, material_con };
              console.log(this.newList);

            console.log('update 데이터');
            let result = await axios.post(`${ajaxUrl}/bomupdate/${bom_seq}`, this.newList);
            console.log(result.data);
            

          },
          async insertBomlist({ bom_num, material_code, material, material_con }){
          this.newList = { bom_num, material_code, material, material_con };
              console.log(this.newList);

            console.log('insert 데이터');
            let result = await axios.post(`${ajaxUrl}/bominsert/${bom_num}`, this.newList);
            console.log(result.data);
          },
          async insertBom() { // 등록
            this.newList = { product_code: this.searchProductcode , product_name: this.searchProduct, capacity : this.searchCapacity};
              console.log('등록될 제품',this.newList);
              let result = await axios.post(`${ajaxUrl}/bomregist`,this.newList);
              console.log(result.data);   
              window.location.reload();
          },       
          view(productname,capa,bomnum,materialcode,productcode) {
            console.log('제품코드',productcode);
            console.log('제품번호',bomnum);
            this.getBom(bomnum);
            this.searchBomnum = bomnum;
            this.searchProduct = productname;  // 제품명 입력창에 값 설정
            this.searchCapacity = capa;        // 용량 입력창에 값 설정
            this.searchMaterialcode = materialcode;
            this.searchProductcode = productcode; // 제품코드
          },
          async dele(bomnum){
            console.log('삭제할번호',bomnum);
            let result1 = await axios.delete(`${ajaxUrl}/bomdelete/${bomnum}`);
            console.log(result1);
            let result2 = await axios.delete(`${ajaxUrl}/bomdelete/${bomnum}`);
            console.log(result2);
          },
          addMaterial() {
            this.bomBox.push({ bom_num:'', material_code: '', material: '', material_con: '' });
          },
          goToDetail(bomNum) {
            this.$router.push({ name : 'bomInfo', params : { bomno : bomNum }});
          },
          updateBom() {
            for(let i =0; i<this.bomBox2.length; i++){
              console.log(i);
            }
              // console.log(this.bomBox);
              this.bomBox.forEach(item => {
                if(!item.bom_num) {
                  item.bom_num = this.searchBomnum;
                }
              });// 새로 만든 칸에 bomnum을 같은 값으로 넣어줌
              // console.log(this.bomBox);
              // console.log(this.bomBox2);
              for(let i = 0; i<this.bomBox.length; i++){

                if(i < this.bomBox2.length ){
                  if(this.bomBox[i]['material'] != this.bomBox2[i]['material'] || this.bomBox[i]['material_code'] != this.bomBox2[i]['material_code']
                    || this.bomBox[i]['material_con'] != this.bomBox2[i]['material_con']
                  ){
                    console.log('같지않음');
                    // console.log(this.bomBox[i]);
                    this.updateBomlist(this.bomBox[i]);
                  }else{
                    console.log('같은값');
                  }

                }else{
                  console.log('insert 해야하는 데이터');
                  console.log(this.bomBox[i]);
                  this.insertBomlist(this.bomBox[i]);
                }
              }
            }
        }
    }
</script>

<style scoped>
.d-flex {
  display: flex;
  justify-content: space-between;
}

.form-container {
  width: 45%;
}

.table-container {
  width: 50%;
}

.search {
  margin-top: 24px;
}

button {
  padding: 10px;
  margin-left: 20px;
}

div {
  margin-left: 20px;
  margin-right: 20px;
  margin-bottom: 5px;
}

.d-flex span {
  margin-right: 10px;
}
span{
  width: 120px;
}
.ms-md-3 {
  margin-left: 15px;
}

.form-control {
  width: 100%;
  padding: 8px;
  border: 1px solid #ced4da;
  border-radius: 4px; 
  box-sizing: border-box; 
}

.form-control:focus {
  border-color: #80bdff; 
  outline: none;
}

</style>