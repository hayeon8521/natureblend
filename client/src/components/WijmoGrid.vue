<template>
    <div>
        <wj-flex-grid :items-source="data">
            <wj-flex-grid-column header="ID" binding="id"></wj-flex-grid-column>
            <wj-flex-grid-column header="Name" binding="name"></wj-flex-grid-column>
            <wj-flex-grid-column header="Age" binding="age"></wj-flex-grid-column>
            <wj-flex-grid-column header="Nick" binding="nick"></wj-flex-grid-column>
        </wj-flex-grid>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import { WjFlexGrid, WjFlexGridColumn } from '@grapecity/wijmo.vue2.grid'; // Vue 3에서도 Vue2용 패키지 사용
 
export default defineComponent({
    components: {
        WjFlexGrid,
        WjFlexGridColumn
    },
    setup() {
        const data = [
            { id: 1, name: 'John Doe', age: 28, nick: 'aba' },
            { id: 2, name: 'Jane Smith', age: 34, nick: 'aba' },
            { id: 3, name: 'Michael Johnson', age: 45, nick: 'aba' }
        ];
        return { data };
    }
});
</script>