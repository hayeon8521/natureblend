<template>
    <div class="container-fluid">
        <wj-flex-grid headersVisibility="Column" :alternatingRowStep="0" :itemsSource="data" />
        <wj-collection-view-navigator headerFormat="Page {currentPage:n0} of {pageCount:n0}" :byPage="true"
            :cv="data" />
    </div>
</template>

<script>
import "@mescius/wijmo.styles/wijmo.css";
import "bootstrap/dist/css/bootstrap.css";
//import { createApp } from "vue"
//import { CollectionView } from '@mescius/wijmo';
//import { registerInput } from '@mescius/wijmo.vue2.input';
//import { registerGrid } from '@mescius/wijmo.vue2.grid';
import { defineComponent } from "vue"; // Vue 3의 defineComponent 사용
import { CollectionView } from "@mescius/wijmo";
import { WjFlexGrid } from "@mescius/wijmo.vue2.grid";
import { WjCollectionViewNavigator } from "@mescius/wijmo.vue2.nav";

export default defineComponent({
    components: {
        WjFlexGrid,
        WjCollectionViewNavigator,
    },
    data() {
        return {
            data: this.getData(), // 데이터 초기화
        };
    },
    methods: {
        getData() {
            let countries = "US,Germany,UK,Japan,Italy,Greece".split(",");
            let products = "Piano,Violin,Flute,Guitar,Cello".split(",");
            let data = [];
            for (let i = 0; i < 1000; i++) {
                data.push({
                    id: i,
                    country: countries[i % countries.length],
                    product: products[i % products.length],
                    sales: Math.random() * 10000,
                    expenses: Math.random() * 5000,
                });
            }

            return new CollectionView(data, {
                pageSize: 6, // 페이지 크기 설정
            });
        },
    },
});
</script>
<style scoped>
.container-fluid {
    position: relative;
    width: 730px;
    height: auto;
    overflow: visible; /* 숨겨지는 문제 방지 */
}
</style>