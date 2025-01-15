<template>
    <div>
        <wj-flex-grid :items-source="data">
            <!-- 체크박스 열 -->
            <wj-flex-grid-column :width="50">
                <!-- 헤더에 체크박스 추가 -->
                <template v-slot:headerTemplate>
                    <input type="checkbox" v-model="isAllSelected" @change="toggleAll" />
                </template>
                <!-- 각 행에 체크박스 추가 -->
                <template v-slot:cellTemplate="{ item }">
                    <input type="checkbox" v-model="item.selected" />
                </template>
            </wj-flex-grid-column>
            <!-- 데이터 열 -->
            <wj-flex-grid-column header="ID" binding="id"></wj-flex-grid-column>
            <wj-flex-grid-column header="Name" binding="name"></wj-flex-grid-column>
            <wj-flex-grid-column header="Age" binding="age"></wj-flex-grid-column>
            <wj-flex-grid-column header="Nick" binding="nick"></wj-flex-grid-column>
        </wj-flex-grid>
        <!-- 선택된 아이템 확인 버튼 -->
        <button @click="logSelectedItems">Log Selected Items</button>
    </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { WjFlexGrid } from '@grapecity/wijmo.vue2.grid';
import { WjFlexGridColumn } from '@grapecity/wijmo.vue2.grid';

export default defineComponent({
    components: {
        WjFlexGrid,
        WjFlexGridColumn,
    },
    setup() {
        const data = ref([
            { id: 1, name: 'John Doe', age: 28, nick: 'aba', selected: false },
            { id: 2, name: 'Jane Smith', age: 34, nick: 'aba', selected: false },
            { id: 3, name: 'Michael Johnson', age: 45, nick: 'aba', selected: false },
            { id: 3, name: 'Michael Johnson', age: 45, nick: 'aba', selected: false },
            { id: 3, name: 'Michael Johnson', age: 45, nick: 'aba', selected: false },
            { id: 3, name: 'Michael Johnson', age: 45, nick: 'aba', selected: false },
            { id: 3, name: 'Michael Johnson', age: 45, nick: 'aba', selected: false },
            { id: 3, name: 'Michael Johnson', age: 45, nick: 'aba', selected: false },
            { id: 3, name: 'Michael Johnson', age: 45, nick: 'aba', selected: false },
            { id: 3, name: 'Michael Johnson', age: 45, nick: 'aba', selected: false },
            { id: 3, name: 'Michael Johnson', age: 45, nick: 'aba', selected: false },
            { id: 3, name: 'Michael Johnson', age: 45, nick: 'aba', selected: false },
            { id: 3, name: 'Michael Johnson', age: 45, nick: 'aba', selected: false },
        ]);

        const isAllSelected = ref(false);

        const toggleAll = () => {
            const newValue = isAllSelected.value;
            data.value.forEach(item => {
                item.selected = newValue;
            });
        };

        const logSelectedItems = () => {
            const selectedItems = data.value.filter(item => item.selected);
            console.log('Selected Items:', selectedItems);
        };

        return { data, isAllSelected, toggleAll, logSelectedItems };
    },
});
</script>