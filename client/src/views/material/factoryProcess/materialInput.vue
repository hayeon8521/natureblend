h5<template>
    <div class="d-flex flex-row mb-3">
        <div class="P-0" style="height: 110px; display: flex; justify-content: center; align-items: center;">
            <img src="http://yeonsus.com/academy/materialInput.gif" alt="자재입고대기" height="75" width="75"/>
        </div>
        <div class="P-0">
            <div style="height: 150px; width: 190px;">
                <table class="table align-items-center text-center">
                    <tr>
                        <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                            자재명
                        </th>
                        <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                            수량
                        </th>
                    </tr>
                    <tr v-for="(cl, index) in material_input.slice(0, 5)" :key="index">
                        <td class="text-uppercase text-dark fs-6 font-weight-bolder opacity-7 ps-2" style="text-align: left;">
                            {{ cl.material_name }}
                        </td>
                        <td class="text-uppercase text-dark fs-6 font-weight-bolder opacity-7 ps-2" style="text-align: right;">
                            {{ cl.ord_qty }}
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { defineProps } from 'vue';     //watch

    const { material_input } = defineProps({
        material_input: Array,
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