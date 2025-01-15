// 영업 라우터
import orderForm from '@/views/sales/Order/orderForm.vue';
import orderlistSearch from '@/views/sales/Order/orderlistSearch.vue';
import orderInfo from '@/views/sales/Order/orderInfo.vue';
import outputManage from '@/views/sales/ProductOutput/outputManage.vue';
import inputManage from '@/views/sales/ProductInput/inputManage.vue';
import inputList from '@/views/sales/ProductInput/inputList.vue';
import productInventory from '@/views/sales/productInventory.vue';
import lotInventory from '@/views/sales/lotInventory.vue'
import returnManage from '@/views/sales/ProductReturn/returnManage.vue';
import returnList from '@/views/sales/ProductReturn/returnList.vue';
import outputList from '@/views/sales/ProductOutput/outputList.vue';
import store from '@/store/index.js'
import { notify } from "@kyvg/vue3-notification";

const checkAuth = (to, next) => {
    if(!store.state.loginInfo.name) {
        notify({
            title: "로그인요청",
            text: "로그인이 필요한 페이지입니다.",
            type: 'error',
        });
        next(false)
    } else if(store.state.loginInfo.job_num !== 1 && store.state.loginInfo.level !== 3) {
        notify({
            title: "로그인요청",
            text: "영업팀 또는 관리자만 접속 가능합니다.",
            type: 'error',
        });
        next(false)
    } else {
        next()
    }
}


const salesRoute = [
    {
        path:'/',
        name: 'salesList',
        redirect :{ name : 'salesList'},
        beforeEnter: (to, from, next) => {
            checkAuth(to, next)
        }
    },
    {
        path:'orderlist/insert',
        name :'orderForm',
        component: orderForm,
        beforeEnter: (to, from, next) => {
            checkAuth(to, next)
        }
    },
    {
        path:'orderlist/management',
        name :'orderlistSearch',
        component: orderlistSearch,
        beforeEnter: (to, from, next) => {
            checkAuth(to, next)
        }
    },

    {
        path:'orderlist/orderinfo/:no',
        name : 'orderInfo',
        component: orderInfo,
        beforeEnter: (to, from, next) => {
            checkAuth(to, next)
        }
    },

    {
        path:'output/management',
        name:'outputManage',
        component:outputManage,
        beforeEnter: (to, from, next) => {
            checkAuth(to, next)
        }
    },
    {
        path:'output/outputlist',
        name:'outputList',
        component :outputList,
        beforeEnter: (to, from, next) => {
            checkAuth(to, next)
        }
    },

    {
        path:'input/management',
        name: 'inputManage',
        component:inputManage,
        beforeEnter: (to, from, next) => {
            checkAuth(to, next)
        }
    },
    {
        path : 'input/inputlist',
        name : 'inputList',
        component:inputList,
        beforeEnter: (to, from, next) => {
            checkAuth(to, next)
        }
    },
    {
        path : 'inventory/product',
        name : 'productInventory',
        component:productInventory,
        beforeEnter: (to, from, next) => {
            checkAuth(to, next)
        }
    },
    {
        path:'inventory/lot',
        name:'lotInventory',
        component:lotInventory,
        beforeEnter: (to, from, next) => {
            checkAuth(to, next)
        }

    },
    {
        path:'return/management',
        name : 'returnManage',
        component:returnManage,
        beforeEnter: (to, from, next) => {
            checkAuth(to, next)
        }
    },
    {
        path:'return/returnlist',
        name:'returnList',
        component :returnList,
        beforeEnter: (to, from, next) => {
            checkAuth(to, next)
        }
    },
    



];

export default salesRoute;