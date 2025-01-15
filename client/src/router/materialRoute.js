// 자재 라우터

//자재 주문관리
import MaterialList from '@/views/material/temp/materialOrder.vue';

//자재 주문관리 (★리뉴얼)
import MaterialList2 from '@/views/material/newMaterialOrder.vue';

//자재 주문조회
import MaterialOrderList from '@/views/material/materialOrderList.vue';

//자재 입고
import MaterialInput from '@/views/material/materialInput.vue';

//자재 입고 조회
import MaterialInputList from '@/views/material/materialInputList.vue';

//자재 LOT 조회
import MaterialLotqty from '@/views/material/materialLotqty.vue';

//자재 재고 조회
import Materialqty from '@/views/material/materialqty.vue';

//테스트
import Tabletest from '@/views/material/temp/Tables.vue';

//테스트2 (제품 등록)
import Tabletest2 from '@/views/material/temp/z_product_input.vue';

//테스트3 (진짜연습장)
import Tabletest3 from '@/views/material/temp/z_test.vue';

//테스트4 (자재 등록)
import Tabletest4 from '@/views/material/temp/z_material_input.vue';

//공장흐름
import Factory from '@/views/material/factoryProcess/factoryProcess.vue';

import Main from '@/views/material/mainpage/main.vue';

const materialRoute = [
  {
    path: '/',
    name: 'materialList2',
    redirect : { name : 'materialList2'}
  },
  {
    path: 'order',
    name: 'materialList',
    component: MaterialList
  },
  {
    path: 'newOrder',
    name: 'materialList2',
    component: MaterialList2
  },
  {
    path: 'orderlist',
    name: 'materialOrderList',
    component: MaterialOrderList
  },
  {
    path: 'input',
    name: 'materialInput',
    component: MaterialInput
  },
  {
    path: 'inputlist',
    name: 'materialInputList',
    component: MaterialInputList
  },
  {
    path: 'lotqty',
    name: 'materialLotqty',
    component: MaterialLotqty
  },
  {
    path: 'materialqty',
    name: 'materialqty',
    component: Materialqty
  },
  {
    path: 'test',
    name: 'tabletest',
    component: Tabletest
  },
  {
    path: 'test2',
    name: 'Tabletest2',
    component: Tabletest2
  },
  {
    path: 'test3',
    name: 'Tabletest3',
    component: Tabletest3
  },
  {
    path: 'test4',
    name: 'Tabletest4',
    component: Tabletest4
  },
  {
    path: 'factory',
    name: 'Factory',
    component: Factory
  },
  {
    path: 'main',
    name: 'Main',
    component: Main
  },
];

export default materialRoute;