<template>
    <div class="d-flex flex-row mb-3">
        <div class="P-0" style="width: 35px; height: 110px; display: flex; justify-content: center; align-items: center;">
        </div>
        <div class="P-0">
            <div style="height: 150px; width: 240px; overflow-y: auto; overflow-x: hidden; position: relative;">
                <table class="table align-items-center text-center" style="table-layout: fixed; width: 100%;">
                    <tr>
                        <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                            제품명
                        </th>
                        <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                            수량
                        </th>
                    </tr>
                    <tr v-for="(cl, index) in productQty" :key="index">
                        <td class="text-uppercase text-dark fs-6 font-weight-bolder opacity-7 ps-2" style="text-align: left;">
                            {{ cl.product_name }}
                        </td>
                        <td class="text-uppercase text-dark fs-6 font-weight-bolder opacity-7 ps-2" style="text-align: right;">
                            {{ cl.product_qty }} 개
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { defineProps } from 'vue';     //watch

    const { productQty } = defineProps({
        productQty: Array,
    });
</script>

<style lang="scss" scoped>
    table {
        border-spacing: 0;
        border-collapse: collapse;
    }

    table tr td {
        margin: 0;
        padding: 0;
    }
    img {
        border-radius: 50px;
        padding-left: 5px;
        padding-right: 5px;
    }
</style>