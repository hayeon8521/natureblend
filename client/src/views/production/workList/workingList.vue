<template>
  <div class="container-fluid working-list py-4">
    <h3>작업 목록</h3>
    <div class="container-fluid">
      <div class="search-container mt-4 mb-2">
        <div class="input-group w-auto h-25">
          <input type="text" @click="openModal('prodOrder')" :value="processList[0]?.production_order_name" readonly class="form-control border p-2 cursor-pointer" placeholder="생산지시 선택">
        </div>
        <div class="product" >
          <h6>제품명:</h6>
          <p>{{ processList[0] ? processList[0].product_name : '-' }}</p>
          <h6 class="bold">작업일자:</h6>
          <p>{{ processList[0] ? dateFormat(processList[0].work_date, 'yyyy-MM-dd') : '-'}}</p>
        </div>
      </div>
      <div class="grid-container work">
        <ag-grid-vue
            :rowData="rowData"
            :columnDefs="columnDefs"
            :theme="theme"
            @grid-ready="onGridReady"
            @rowClicked="onRowClicked"
        />
      </div>
      <div class="main-container">
        <div class="con-top container-fluid justify-content-center">
          <div class="row justify-content-center">
            <div class="process-name col-sm-6 col-md-4 col-lg-3">
              <p class="fw-bold field">공정명</p>
              <p v-if="Object.keys(selectedRow).length" class="fw-bold data">{{ selectedRow.process_name }}</p>
              <p v-else class="fw-bold data text-danger">위에서 작업을 선택해주세요</p>
            </div>
            <div class="process-name col-sm-6 col-md-4 col-lg-3">
              <p class="fw-bold field">공정 생산량</p>
              <p class="fw-bold data">{{ partialWorkFinalQty }}개</p>
            </div>
            <div class="process-name col-sm-6 col-md-4 col-lg-3">
              <p class="fw-bold field">공정 진행</p>
              <p class="fw-bold data">{{ processStatus[partialWorkFinalStatus] }}</p>
            </div>
            <div class="process-name col-sm-6 col-md-4 col-lg-3">
              <p class="fw-bold field">공정시작시간</p>
              <p class="fw-bold data">{{ partialWorkFirstStartTime }}</p>
            </div>
            <div class="process-name col-sm-6 col-md-4 col-lg-3">
              <p class="fw-bold field">공정완료시간</p>
              <p class="fw-bold data">{{ partialWorkLastEndTime }}</p>
            </div>
            <div class="process-name d-flex align-self-center col-sm-6 col-md-4 col-lg-3">
              <div style="padding-left: 20px; display: inline-flex; align-items: center; gap: 15px; white-space: nowrap;">
                <label style="white-space: nowrap;" for="all"><input type="radio" id="all" name="status" class="form-check-input cursor-pointer" value="all" v-model="radio"/>&nbsp;&nbsp;전체</label>
                <label style="white-space: nowrap;" for="in-progress"><input type="radio" id="in-progress" name="status" class="form-check-input cursor-pointer" value="in-progress" v-model="radio"/>&nbsp;&nbsp;진행중</label>
                <label style="white-space: nowrap;" for="completed"><input type="radio" id="completed" name="status" class="form-check-input cursor-pointer" value="completed" v-model="radio"/>&nbsp;&nbsp;완료</label>
              </div>
            </div>
            <i v-show="partialWorkFinalStatus !== 'process_complete'" class="col-sm-6 col-md-4 col-lg-3 fa fa-plus-circle fa-2x cursor-pointer" @click="addPartialWork"></i>
          </div>
        </div>
        <div class="container-fluid">
          <div class="row">
            <div
                v-for="(partialWork) in partialWorkList"
                :key="partialWork.process_num"
                class="col-12 col-md-6 col-lg-4 mb-4 card-con"
                :class="{
                  hide: (radio === 'in-progress' && partialWork.partial_process_status !== 'partial_processing') ||
                        (radio === 'completed' && partialWork.partial_process_status !== 'partial_process_complete')
                }"
            >
              <div class="card border shadow-sm p-3">
                <div class="card-body">
                  <h5 class="card-title text-center font-weight-bold w-100">분할작업번호 {{ partialWork.process_num }}</h5>

                  <p class="mb-2 text-center w-100 d-flex flex-column">
                    <strong>작업자</strong>
                    <span v-if="partialWork.emp_num !== null" class="m-lg-2">{{ partialWork.emp_name }}</span>
                    <input v-else readonly @click="openModal('emp', partialWork.process_num)" :value="partialWork.searchEmp?.name" class="form-control border p-2 cursor-pointer" />
                  </p>

                  <p class="mb-2 text-center w-48 d-flex flex-column">
                    <strong>설비명</strong>
                    <span v-if="partialWork.machine_num !== null" class="m-lg-2">{{ partialWork.machine_name }}</span>
                    <input v-else readonly @click="openModal('machine', partialWork.process_num)" :value="partialWork.searchMachine?.machine_name" class="form-control border p-2 cursor-pointer" />
                  </p>

                  <p class="mb-2 text-center w-48 ml-4 d-flex flex-column">
                    <strong>작업량</strong>
                    <span v-if="partialWork.process_todo_qty !== null" class="m-lg-2">{{ partialWork.process_todo_qty }}</span>
                    <input v-else v-model="partialWork.new_process_todo_qty" type="number" class="form-control border p-2 cursor-pointer text-start" />
                  </p>

                  <p class="mb-2 text-center w-48 d-flex flex-column">
                    <strong>불량량</strong>
                    <span v-if="partialWork.fail_qty !== null" class="m-lg-2">{{ partialWork.fail_qty }}</span>
                    <input v-else v-model="partialWork.new_fail_qty" :disabled="partialWork.partial_process_status === 'partial_process_waiting'" type="number" class="form-control border p-2 cursor-pointer text-start" />
                  </p>

                  <p class="mb-2 text-center w-48 ml-4 d-flex flex-column">
                    <strong>합격량</strong>
                    <span v-if="partialWork.success_qty !== null" class="m-lg-2">{{ partialWork.success_qty }}</span>
                    <input v-else v-model="partialWork.new_success_qty" :disabled="partialWork.partial_process_status === 'partial_process_waiting'" type="number" class="form-control border p-2 cursor-pointer text-start" />
                  </p>

                  <div class="text-center mb-2 w-100">
                    <button
                        @click="startPartialWork(partialWork)"
                        class="btn start text-md"
                        :disabled="partialWork.partial_process_start_time"
                    >
                      시작
                    </button>
                    <button
                        @click="endPartialWork(partialWork)"
                        class="btn end text-md"
                        :disabled="!partialWork.partial_process_start_time || partialWork.partial_process_end_time"
                    >
                      종료</button>
                  </div>

                  <p class="text-center mb-2 w-100">
                    <strong>작업시작시간:</strong>
                    {{ partialWork.partial_process_start_time ? dateFormat(partialWork.partial_process_start_time, 'yyyy-MM-dd hh:mm:ss') : '-' }}
                  </p>

                  <p class="text-center mb-2 w-100">
                    <strong>작업완료시간:</strong>
                    {{ partialWork.partial_process_end_time ? dateFormat(partialWork.partial_process_end_time, 'yyyy-MM-dd hh:mm:ss') : '-' }}
                  </p>

                  <p class="text-center mb-0 w-100">
                    <strong>진행상태:</strong>
                    <span class="badge m-lg-2"
                          :class="{
                'bg-danger': partialWork.partial_process_status === 'partial_process_waiting',
                'bg-secondary': partialWork.partial_process_status === 'partial_processing',
                'bg-success': partialWork.partial_process_status === 'partial_process_complete'
              }">
              {{ partialWorkStatus[partialWork.partial_process_status] }}
            </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Modal
        :isShowModal="isShowModal"
        :modalTitle="modalTitle"
        :noBtn="'닫기'"
        :yesBtn="'선택'"
        :width="modalType === 'prodOrder' ? 1000 : 500"
        @closeModal="closeModal"
        @confirm="confirm"
    >
      <template v-slot:list>
        <WorkingOrderList
            v-show="isShowModal && modalType === 'prodOrder'"
            @selectWorkingOrder="selectWorkingOrder"
        />
        <ModalWorkingEmpList
            v-show="isShowModal && modalType === 'emp'"
            @selectEmp="selectEmp"
        />
        <ModalWorkingMachineList
            v-if="isShowModal && modalType === 'machine' && selectedRow.process_code"
            @selectMachine="selectMachine"
            :processCode="selectedRow.process_code"
        />

      </template>
    </Modal>
  </div>
</template>
<script>
import Modal from "@/views/natureBlendComponents/modal/Modal.vue";
import WorkingOrderList from "@/views/production/workList/ModalWorkingOrderList.vue"
import ModalWorkingEmpList from "@/views/production/workList/ModalWorkingEmpList.vue"
import axios from "axios";
import {ajaxUrl} from "@/utils/commons";
import theme from "@/utils/agGridTheme";
import ModalWorkingMachineList from "@/views/production/workList/ModalWorkingMachineList.vue";
import userDateUtils from "@/utils/useDates";

export default {
  name: "workingList" ,
  computed: {
    theme() {
      return theme
    }
  },
  components: {ModalWorkingMachineList, Modal, WorkingOrderList, ModalWorkingEmpList},

  data() {
    return {
      radio: 'all',
      modalType: 'prodOrder',
      partialWorkList: [],
      selectedStatus: '전체',
      partialProcessStatusList: ['전체', '진행중', '완료'],
      isShowModal: false,
      modalTitle: '생산지시 목록',
      selectedWorkingOrder: {},
      searchWorkingOrder: {},
      rowData: [],

      columnDefs: [
        { headerName: "작업번호", field: 'process_work_header_num', cellStyle: { textAlign: 'right' }, flex: 1},
        { headerName: "공정코드", field: 'process_code', cellStyle: { textAlign: 'center' } , flex: 1},
        { headerName: "공정명", field: 'process_name', flex: 2 },
        { headerName: "설비분류", field: 'machine_type', flex: 2 },
        { headerName: "지시량(개)", field: 'production_order_qty', cellStyle: { textAlign: 'right' } , flex: 1 },
        { headerName: "진행상태",
          field: 'process_status',
          cellClass: (params) => {
            return params.value === '완료' ? 'green' : params.value === '진행중' ? 'gray' : params.value === '대기중' ? 'red' : ''
          },
          flex: 1
        },
      ],
      processList: [],
      processStatus: {
        'process_waiting': '대기중',
        'processing': '진행중',
        'process_complete': '완료',
        '-': '-'
      },
      partialWorkStatus: {
        'partial_process_waiting': '대기중',
        'partial_processing': '진행중',
        'partial_process_complete': '완료'
      },
      partialWorkFinalStatus: 'process_waiting', //process_waiting, processing, process_complete
      selectedRow: {},
      selectedEmp: {},
      selectedMachine: {},
      partialWorkFinalQty: 0,
      partialWorkFirstStartTime: '-',
      partialWorkLastEndTime: '-',
      modalForProcessNum: 0,
    }
  },

  created() {
    this.getTodayWorkList()
  },

  methods: {
    dateFormat(value, format) {
      return userDateUtils.dateFormat(value, format)
    },

    async startPartialWork(partialWork) {
      if(!partialWork.searchEmp.emp_num) {
        this.$notify({
          text: "작업자를 선택해주세요.",
          type: 'error',
        });
        return
      }
      if(!partialWork.searchMachine.machine_num ) {
        this.$notify({
          text: "설비를 선택해주세요.",
          type: 'error',
        });
        return
      }
      if(!partialWork.new_process_todo_qty) {
        this.$notify({
          text: "작업량을 입력해주세요.",
          type: 'error',
        });
        return
      }

      let workInfo = {
        empName: partialWork.searchEmp.emp_num,
        machineNum: partialWork.searchMachine.machine_num,
        todoQty: partialWork.new_process_todo_qty,
        failQty: partialWork.new_fail_qty,
        successQty: partialWork.new_success_qty,
        process_num: partialWork.process_num,
      }

      let result = await axios.put(`${ajaxUrl}/production/work/partial/start`, workInfo)
          .catch(err => console.log(err));
      if(result.data.message === 'success') {
        this.$notify({
          text: "작업이 시작되었습니다.",
          type: 'success',
        });
        await this.getPartialWorkList()
        this.startQc(partialWork)

        if(this.searchWorkingOrder.production_order_status === 'work_waiting') {
          this.updateProdOrderStatus('work_in_process')
          this.updatePlanStatus('plan_in_process')
        }
      }
    },

    async startQc(partialWork) {
      let qcInfo = {
        qcType: this.selectedRow.process_code,
        info: {
          processNum: partialWork.process_num,
          qty: partialWork.new_process_todo_qty,
          empNum: partialWork.searchEmp.emp_num
        }
      }

      await axios.post(`${ajaxUrl}/production/work/qc`, qcInfo)
          .catch(err => console.log(err));
    },

    async endPartialWork(partialWork) {
      if(typeof partialWork.fail_qty !== 'number' && typeof partialWork.new_fail_qty !== 'number') {
        this.$notify({
          text: "불량량을 입력해주세요.",
          type: 'error',
        });
        return
      }
      if(typeof partialWork.success_qty !== 'number' && typeof partialWork.new_success_qty !== 'number') {
        this.$notify({
          text: "합격량을 입력해주세요.",
          type: 'error',
        });
        return
      }

      let workInfo = {
        failQty: partialWork.new_fail_qty, // 불량량 입력 후 시작버튼 누른경우 partialWork.new_fail_qty -> null
        successQty: partialWork.new_success_qty, // 합격량 입력 후 시작버튼 누른경우 partialWork.new_success_qty -> null
        process_num: partialWork.process_num,
      }

      let result = await axios.put(`${ajaxUrl}/production/work/partial/end`, workInfo)
          .catch(err => console.log(err));
      if(result.data.message === 'success') {
        this.$notify({
          text: "작업이 종료되었습니다.",
          type: 'success',
        });
        await this.getPartialWorkList()
      }
    },

    async addPartialWork() {
      if(!this.selectedRow.process_work_header_num) {
        this.$notify({
          text: "공정작업을 먼저 선택해주세요.",
          type: 'error',
        });
        return
      }

      let initPartialWorkInfo = {
        process_work_header_num: this.selectedRow.process_work_header_num,
        product_code: this.processList[0].product_code,
      }

      let resultAdd = await axios.post(`${ajaxUrl}/production/work/partial`, initPartialWorkInfo)
          .catch(err => console.log(err));

      if(resultAdd.data.message === 'success') {
        this.$notify({
          text: "분할작업이 등록되었습니다.",
          type: 'success',
        });

        await this.getPartialWorkList()
      } else {
        this.$notify({
          text: "분할작업 등록 실패하였습니다.",
          type: 'fail',
        });
      }
    },

    getPartialWorkFinalQty() {
      let finalQty = 0
      this.partialWorkList.forEach((work) => {
        if(typeof work.success_qty === 'number') {
          finalQty += work.success_qty
        }
      })
      this.partialWorkFinalQty = finalQty
    },

    getPartialWorkFinalStatus() {
      let production_order_qty = Number(this.selectedRow.production_order_qty)

      let isStarted = false
      this.partialWorkList.forEach((work) => {
        if(!isStarted && work.partial_process_start_time) {
          isStarted = true
        }
      })

      if(!isStarted) {
        this.partialWorkFinalStatus = 'process_waiting'
      } else if(isStarted && (this.partialWorkFinalQty < production_order_qty)) {
        this.partialWorkFinalStatus = 'processing'
      } else {
        let isStop = false
        this.partialWorkFinalStatus = 'process_complete'

        this.partialWorkList.forEach((partialWork) => {
          if(partialWork.partial_process_status !=='partial_process_complete' && !isStop) {
            this.partialWorkFinalStatus = 'processing'
            isStop = true
          }
        })
      }
    },

    getPartialWorkFirstStartTime() {
      // 아직 분할작업 진행전이면 시작 시간 없음
      if(this.partialWorkFinalStatus === 'process_waiting') {
        this.partialWorkFirstStartTime = '-'
        return
      }

      let resultTimestamp = 0
      this.partialWorkList.forEach((work) => {
        if(!work.partial_process_start_time) {
          return
        }

        let workTimestamp = new Date(work.partial_process_start_time).getTime()
        if(!resultTimestamp || resultTimestamp > workTimestamp) {
          resultTimestamp = workTimestamp
        }
      })

      if(!resultTimestamp) {
        this.partialWorkFirstStartTime = '-'
      } else {
        this.partialWorkFirstStartTime = this.dateFormat(resultTimestamp, 'yyyy-MM-dd hh:mm:ss')
      }
    },

    getPartialWorkLastEndTime() {
      // 분할작업 완료가 아니면 완료 시간 없음
      if(this.partialWorkFinalStatus !== 'process_complete') {
        this.partialWorkLastEndTime = '-'
        return
      }

      let resultTimestamp = 0
      this.partialWorkList.forEach((work) => {
        if(!work.partial_process_start_time) {
          return
        }

        let workTimestamp = new Date(work.partial_process_end_time).getTime()
        if(!resultTimestamp || resultTimestamp < workTimestamp) {
          resultTimestamp = workTimestamp
        }
      })
      if(!resultTimestamp) {
        this.partialWorkLastEndTime = '-'
      } else {
        this.partialWorkLastEndTime = this.dateFormat(resultTimestamp, 'yyyy-MM-dd hh:mm:ss')
      }
    },

    async getPartialWorkList() {
      let resultList =
          await axios.get(`${ajaxUrl}/production/work/partial/${this.selectedRow.process_work_header_num}`)
              .catch(err => console.log(err));
      this.partialWorkList = resultList.data

      this.getPartialWorkFinalQty()
      this.getPartialWorkFinalStatus()
      this.getPartialWorkFirstStartTime()
      this.getPartialWorkLastEndTime()
    },

    onRowClicked(params) {
      this.selectedRow = params.data
      this.getPartialWorkList()
    },

    onGridReady(params) {
      this.gridApi = params.api;
    },

    openModal(type, processNum) {
      if(type === 'prodOrder') {
        this.modalTitle = '생산지시 목록'
      } else if(type === 'emp'){
        this.modalForProcessNum = processNum
        this.modalTitle = '생산직원 목록'
      } else if(type === 'machine'){
        this.modalForProcessNum = processNum
        this.modalTitle = '설비 목록'
      }


      this.modalType = type
      this.isShowModal = !this.isShowModal
    },

    closeModal() {
      this.isShowModal = false
    },

    confirm() {
      if(this.modalType === 'prodOrder') {
        this.searchWorkingOrder = this.selectedWorkingOrder
        this.getWorkList()
      } else if(this.modalType === 'emp') {
        this.partialWorkList.forEach((partialWork) => {
          if(partialWork.process_num === this.modalForProcessNum) {
            partialWork.searchEmp = this.selectedEmp
          }
        })
      } else if(this.modalType === 'machine') {
        this.partialWorkList.forEach((partialWork) => {
          if(partialWork.process_num === this.modalForProcessNum) {
            partialWork.searchMachine = this.selectedMachine
          }
        })
      }

      this.closeModal()
    },

    async getTodayWorkList() {
      this.rowData = []

      let result =
          await axios.get(`${ajaxUrl}/production/work/today`)
              .catch(err => console.log(err));

      if(result.data.length === 0) {
        this.$notify({
          text: "오늘 작업이 없습니다.",
          type: 'error',
        });
      } else {
        this.processList = result.data
        this.setRowData()
      }


    },

    setRowData() {
      let keys = []
      this.columnDefs.forEach((col) => {
        keys.push(col.field)
      })

      this.processList.forEach((process, idx) => {
        this.rowData[idx] = {
          [keys[0]]: process[keys[0]],
          [keys[1]]: process[keys[1]],
          [keys[2]]: process[keys[2]],
          [keys[3]]: process[keys[3]],
          [keys[4]]: process[keys[4]],
          [keys[5]]: this.processStatus[process[keys[5]]],
        }
      })
    },

    async getWorkList() {
      this.rowData = []
      let result =
          await axios.get(`${ajaxUrl}/production/work/list/${this.searchWorkingOrder.production_order_num}`)
              .catch(err => console.log(err));

      if(result.data.length !== 0) {
        this.processList = result.data
        this.setRowData()
      }
    },

    selectWorkingOrder(workingOrder) {
      this.selectedWorkingOrder = workingOrder
    },

    selectEmp(emp) {
      this.selectedEmp = emp
    },

    selectMachine(machine) {
      this.selectedMachine = machine
    },

    async deductMaterial() {
      let prodOrderNum = {
        prodOrderNum: this.searchWorkingOrder.production_order_num
      }
      let result = await axios.put(`${ajaxUrl}/production/work/material`, prodOrderNum)
          .catch(err => console.log(err));
      console.log('deductMaterial', result)
    },

    async updateProdOrderStatus(status) {
      let statusInfo = {
        productionOrderStatus: status,
        productionOrderNum: this.searchWorkingOrder.production_order_num
      }
      let result = await axios.put(`${ajaxUrl}/production/work/order/status`, statusInfo)
          .catch(err => console.log(err));
      console.log('updateProdOrderStatus', result)
    },

    async updatePlanStatus(status) {
      let planStatusInfo = {
        planStatus: status,
        planNum: this.searchWorkingOrder.plan_num
      }
      let result = await axios.put(`${ajaxUrl}/production/work/plan/status`, planStatusInfo)
          .catch(err => console.log(err));
      console.log('updatePlanStatus', result)
    }
  },

  watch: {
    async partialWorkFinalStatus() {
      let statusInfo = {
        processStatus: this.partialWorkFinalStatus === '-' ? null : this.partialWorkFinalStatus,
        processWorkHeaderNum: this.selectedRow.process_work_header_num
      }
      await axios.put(`${ajaxUrl}/production/work/process/status`, statusInfo)
              .catch(err => console.log(err));

      // process_work_header 상태값도 같이 업데이트 시키기
      await this.getWorkList()

      if(this.partialWorkFinalStatus === 'process_complete') {
        let result = await axios.get(`${ajaxUrl}/production/work/process/status/${this.searchWorkingOrder.production_order_num}`)
              .catch(err => console.log(err));

        let completeList = result.data.filter((res) => res.process_status === 'process_complete')

        if(completeList.length === result.data.length) {
          // 자재 차감
          await this.deductMaterial()
          // 생산지시 상태값 변경
          await this.updateProdOrderStatus('work_complete')
          // 생산계획 상태값 변경
          await this.updatePlanStatus('plan_complete')
        }
      }
    },
    partialWorkFirstStartTime() {
      let startInfo = {
        processStartTime: this.partialWorkFirstStartTime === '-' ? null : this.partialWorkFirstStartTime,
        processWorkHeaderNum: this.selectedRow.process_work_header_num
      }
      axios.put(`${ajaxUrl}/production/work/process/start`, startInfo)
          .catch(err => console.log(err));
    },
    partialWorkLastEndTime() {
      if(this.partialWorkLastEndTime === '-') {
        return
      }
      let endInfo = {
        processEndTime: this.partialWorkLastEndTime,
        processWorkHeaderNum: this.selectedRow.process_work_header_num
      }
      axios.put(`${ajaxUrl}/production/work/process/end`, endInfo)
          .catch(err => console.log(err));
    }

  }
}
</script>



<style scoped lang="scss">
.grid-container.work {
  .ag-cell.green {
    border-radius: 4px !important;
    padding: 4px 6px !important;
    width: fit-content !important;
    line-height: 20px !important;
    font-weight: 900 !important;
    color: $white !important;
    background: $green !important;
  }
  .red {
    border-radius: 4px;
    padding: 4px 6px;
    width: fit-content;
    line-height: 20px;
    font-weight: 900;
    color: $white;
    background: $red1;
  }
  .gray {
    border-radius: 4px;
    padding: 4px 6px;
    width: fit-content;
    line-height: 20px;
    font-weight: 900;
    color: $white;
    background: $gray-600;
  }
}
.working-list {
  min-height: 500px;
  .container-fluid {
    padding: 0;
    .search-container {
      display: flex;
      height: 50px;
      align-content: center;
      h5 {
        margin-bottom: 0;
        margin-left: 20px;
        line-height: 40px;
      }
      input {
        background-color: transparent;
      }
      .button {
        height: 40px;
        margin-left: 20px;
        font-size: 16px;
      }
      .product {
        display: flex;
        align-items: center;
        margin-left: 40px;
        > h6 {
          margin: 0 16px;
        }
        >p {
          margin-bottom: 0;
          font-weight: 700;
        }
      }

    }
    .hide {
      display: none;
    }
    .main-container {
      justify-content: space-between;
      width: 100%;
      padding: 40px;
      border-radius: 8px;
      background-color: $gray-200;
      margin-top: 12px;
      .con-top {
        width: 100%;
        display: flex;
        > div {
          display: flex;
          align-items: baseline;
          margin-bottom: 40px;
          .process-name {
            margin-right: 24px;
            .field {
              margin-right: 20px;
            }
            .data {
              background-color: $white;
              border-radius: 8px;
              padding: 0 8px;
              line-height: 40px;
            }
          }
          .status {
            > label {
              margin-right: 20px;
            }
            > div {
              height: 40px;
              background-color: $white;
              border-radius: 8px;
              padding: 0 8px;
              line-height: 40px;
              > label {
                margin-bottom: 0;
              }
            }
          }
          > i {
            width: fit-content;
            margin-left: auto;
            color: $green;
            cursor: pointer;
            position: absolute;
            right: 60px;
          }
        }

      }
      .card-body {
        display: ruby;
        input[disabled] {
          background-color: #e9ecef;
        }
        .w-48 {
          width: 48%;
        }
        .ml-4 {
          margin-left: 4%;
        }
        .start {
          border: 2px solid #4caf50;
          color: #4caf50;
          margin-right: 20px;
          margin-top: 20px;
        }
        .end {
          border: 2px solid #f44335;
          color: #f44335;
          margin-top: 20px;
        }
        button:disabled {
          border: 2px solid $gray-400;
          color: $gray-400;
        }
        .form-control {
          background-color: #fff;
        }
      }
    }
  }
}
</style>