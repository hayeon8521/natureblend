<template>
  <div class="container-fluid py-1">
    <div class="row gx-3 align-items-center"> <!-- 부품 이름, 교체 주기(년/월/일) -->
      <div class="col-3">
        <div class="row">
          <label for="" class="col-md-auto">부품이름</label>
          <input type="text" class="col" v-model="partInfo.partName" :readonly="props.isUpdate">
        </div>
      </div>

      <div class="col-7">
        <div class="row">
          <label for="" class="col-md-auto">교체주기</label>
          <div class="col">
            <div class="row">
              <input type="number" class="col" v-model="partInfo.yearCycle" :readonly="props.isUpdate">
              <label for="" class="col">년</label>
            </div>
          </div>
          <div class="col">
            <div class="row">
              <input type="number" class="col" v-model="partInfo.monthCycle" :readonly="props.isUpdate">
              <label for="" class="col">월</label>
            </div>
          </div>
          <div class="col">
            <div class="row">
              <input type="number" class="col" v-model="partInfo.dayCycle" :readonly="props.isUpdate">
              <label for="" class="col">일</label>
            </div>
          </div>
        </div>
      </div>

      <div class="col" v-if="props.isUpdate">
        <button @click="openModal">교체</button>

        <Modal
          :isShowModal="isShowModal"
          :modalTitle="'교체 가능한 부품'"
          :noBtn="'닫기'"
          :yesBtn="'선택'"
          @closeModal="closeModal"
          @confirm="confirm"
        >
          <template v-slot:list>
            <ComList v-show="isShowModal" :machineData="props.machineData" @selectData="selectFnc"/>
          </template>
        </Modal>
      </div>
      <div class="col" v-if="props.rowNum == props.lastNum && !props.isUpdate">
        <button @click="addBtn"> + </button>
        <button @click="delBtn"> - </button>
      </div>
      <div class="col" v-if="props.rowNum != props.lastNum && !props.isUpdate">
        <button @click="delBtn"> x </button>
      </div>

    </div>

  </div>
</template>

<script setup>

import { ref, onBeforeMount ,onUpdated , watch } from 'vue';
import axios from 'axios';
import { ajaxUrl } from '@/utils/commons.js';
import Modal from "@/views/natureBlendComponents/modal/Modal.vue";
import ComList from "@/views/machine/PartSelect.vue";


// props
const props = defineProps({
  partDataList: Array,
  rowNum: Number,
  lastNum: Number,
  isUpdate: Boolean,
  oldPartNum: Array,
  machineData: Object,
});

onBeforeMount(() => {
  getPartInfo(props.oldPartNum[props.rowNum - 1]);
})

// 부품 상세 정보
const partData = ref({});
const getPartInfo = async (pno) => {
  let result = await axios.get(`${ajaxUrl}/parts/partInfo/${pno}`)
                          .catch(err => console.log(err));
  partData.value = result.data;

  partInfo.value.partNum = result.data.part_num;
  partInfo.value.partName = result.data.part_name;
  partInfo.value.yearCycle = Math.floor(result.data.replace_cycle / 365);
  partInfo.value.monthCycle = Math.floor((result.data.replace_cycle % 365) / 30);
  partInfo.value.dayCycle = Math.floor((result.data.replace_cycle % 365) % 30);
}

onUpdated (() => {
  partInfo.value = props.partDataList[props.rowNum - 1];
})

// emit
const emit = defineEmits(['add', 'del', 'chInput']);

// 추가 제거 버튼
const addBtn = () => {
  emit('add');
}
const delBtn = () => {
  emit('del', props.rowNum);
}

// 입력 데이터
const partInfo = ref({
  partNum: 0,
  partName: '',
  yearCycle: 0,
  monthCycle: 0,
  dayCycle: 0,
});

// 교체 모달
const isShowModal = ref(false);
const openModal = () => {
  isShowModal.value = true; 
}
const confirm = () => {
  getPartInfo(selectData.value.part_num);
  closeModal();

}
const closeModal = () => {
  isShowModal.value = false;
}

const selectData = ref();

const selectFnc = (data) => {
  selectData.value = data;
}

watch (
  partInfo.value,
  (newVal) => {
    emit('chInput', props.rowNum, newVal);
  },
  { deep: true }
)


</script>

<style scoped lang="scss">
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
/* Firefox  */
input[type='number'] {
  -moz-appearance: textfield;
}

button {
  background-color: $gray-200;
  padding: 2px 5px;
  margin: 0 3px;
  border-radius: 7px;
  font-weight: 700;
  font-family: inherit;
  min-width: 30px;
  height: auto;
}

</style>