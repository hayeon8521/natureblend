<!-- 설비 상세 페이지 machine/machineInfo -->
<template>
  <div class="container-fluid py-4">
    <!-- 설비 이름(설비 위치) / 설비 수정 버튼 / 설비 제거 버튼 -->
    <div class="row align-items-center" style="justify-content: space-between;">
      <div class="col-auto mname">
        <h3>{{ machineData.machine_name }}({{ machineData.machine_location }})</h3>
      </div>

      <div class="col-auto">
        <div class="row">
          <div class="col">
            <button
              class="btn btn-success w-100 mb-0 toast-btn"
              type="button"
              data-target="warningToast"
              @click="machineUpdate"
              style="margin: 5px;"
              :disabled="!checkJob"
            >
              설비 수정
            </button>
          </div>
          <div class="col">
            <button
              class="btn btn-danger w-100 mb-0 toast-btn"
              type="button"
              data-target="warningToast"
              @click="machineDelete"
              style="margin: 5px;"
              :disabled="!checkJob"
            >
              설비 제거
            </button>
          </div>
        </div>
      </div>

    </div>

    <MachineManage
      :isShowModal="isShowModal"
      :machineNo="machineNo"
      :isUpdate="true"
      @closeModal="closeModal"
      @confirm="confirmModal"
    />
      
    <!-- 이미지 / 설비 정보 항목-->
    <div class="row align-items-center machineInfo">
      <!-- 설비 이미지 -->
      <div class="col-3 mimg">
        <!-- 배포시 이미지 경로 제거(localUrl제거) -->
        <img v-if="machineData.machine_img" :src="`${localUrl}${machineData.machine_img}`"/>
        <div v-else class="noImg">
          <a>이미지 파일이 없습니다</a>
        </div>
      </div>

      <!-- 설비 정보 항목 -->
      <div class="col-9 mdata">
        <div class="row">
          <div class="col">
            <div>
              <div class="mdata-header">
                모델 번호
              </div>
              <div class="mdata-body">
                {{ machineData.model_num }}
              </div>
            </div>
          </div>
          <div class="col">
            <div>
              <div class="mdata-header">
                설비 분류
              </div>
              <div class="mdata-body">
                {{ machineData.machine_type }}
              </div>
            </div>
          </div>
          <div class="col" v-if="machineData.machine_state == '사용'">
            <div>
              <div class="mdata-header">
                작동 상태
              </div>
              <div class="mdata-body">
                작동중
              </div>
            </div>
          </div>
          <div class="col" v-else>
            <div>
              <div class="mdata-header">
                작동 상태
              </div>
              <div class="mdata-body">
                작동정지
              </div>
            </div>
          </div>
        </div>
        
        <div class="row">
          <div class="col">
            <div>
              <div class="mdata-header">
                제작 업체 
              </div>
              <div class="mdata-body">
                {{ machineData.com_name }}
              </div>
            </div>
          </div>
          <div class="col">
            <div>
              <div class="mdata-header">
                등록자 
              </div>
              <div class="mdata-body">
                {{ machineData.name }}
              </div>
            </div>
          </div>
          <div class="col">
            <div>
              <div class="mdata-header">
                구매 일자 
              </div>
              <div class="mdata-body">
                {{ machineData.buy_date }}
              </div>
            </div>
          </div>
        </div>
        
        <div class="row">
          <div class="col">
            <div>
              <div class="mdata-header">
                UPH 
              </div>
              <div class="mdata-body">
                {{ machineData.uph + this.unit }}
              </div>
            </div>
          </div>
          <div class="col" v-if="machinePrdData.success_sum != null">
            <div>
              <div class="mdata-header">
                하루 평균 생산량
              </div>
              <div class="mdata-body">
                {{
                  machinePrdData.hour_sum > 0 
                  ? ((machinePrdData.success_sum / machinePrdData.hour_sum) * 24).toFixed(3) + this.unit 
                  : (machinePrdData.success_sum * 24).toFixed(3) + this.unit
                }}
              </div>
            </div>
          </div>
          <div class="col" v-else>
            <div>
              <div class="mdata-header">
                하루 평균 생산량
              </div>
              <div class="mdata-body">
                {{ machineData.upd + this.unit }}
              </div>
            </div>
          </div>
          <div class="col" v-if="machinePrdData.success_sum != null">
            <div>
              <div class="mdata-header">
                불량률 
              </div>
              <div class="mdata-body">
                {{ ((machinePrdData.fail_sum / (Number(machinePrdData.success_sum) + Number(machinePrdData.fail_sum))) * 100).toFixed(3) }}%
              </div>
            </div>
          </div>
          <div class="col" v-else>
            <div>
              <div class="mdata-header">
                불량률 : 
              </div>
              <div class="mdata-body">
                {{ 0 }}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


    <!-- 부품 정보 -->
    <div class="row pinfo">
      <div class="col" v-if="machinePartList.length >= 1">
        <div>부품명 : <a>{{ machinePartList[0].part_name }}</a></div>
        <div>설치 일자 : <a>{{ dateFormat(machinePartList[0].replace_date, 'yyyy-MM-dd') }}</a></div>
        <div>다음 교체일 : <a>{{ replaceDate(machinePartList[0].replace_date, machinePartList[0].replace_cycle) }}</a></div>
      </div>
      <div class="col" v-if="machinePartList.length >= 2">
        <div>부품명 : <a>{{ machinePartList[1].part_name }}</a></div>
        <div>설치 일자 : <a>{{ dateFormat(machinePartList[1].replace_date, 'yyyy-MM-dd') }}</a></div>
        <div>다음 교체일 : <a>{{ replaceDate(machinePartList[1].replace_date, machinePartList[1].replace_cycle) }}</a></div>
      </div>
    </div>
    <div class="row pinfo">
      <div class="col" v-if="machinePartList.length >= 3">
        <div>부품명 : <a>{{ machinePartList[2].part_name }}</a></div>
        <div>설치 일자 : <a>{{ dateFormat(machinePartList[2].replace_date, 'yyyy-MM-dd') }}</a></div>
        <div>다음 교체일 : <a>{{ replaceDate(machinePartList[2].replace_date, machinePartList[2].replace_cycle) }}</a></div>
      </div>
      <div class="col" v-if="machinePartList.length >= 4">
        <div>부품명 : <a>{{ machinePartList[3].part_name }}</a></div>
        <div>설치 일자 : <a>{{ dateFormat(machinePartList[3].replace_date, 'yyyy-MM-dd') }}</a></div>
        <div>다음 교체일 : <a>{{ replaceDate(machinePartList[3].replace_date, machinePartList[3].replace_cycle) }}</a></div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ajaxUrl, localUrl } from '@/utils/commons.js';
import userDateUtils from "@/utils/useDates.js";
import MachineManage from "./MachineManage.vue";

import { mapMutations } from "vuex";

export default {
  name: "machineInfo",

  components: {
    MachineManage,
  },
  data() {
    return {
      localUrl: localUrl,

      // 로그인 사원 권한 체크
      checkJob: this.$store.state.loginInfo.job == '설비' ? true : this.$store.state.loginInfo.position == '관리자' ? true : false,

      machineData: {},
      machinePrdData: {},
      machinePartList: [],
      machineNo: 0,
      isShowModal: false,
      selectNo: null,

      unit: '',
    }
  },
  beforeMount() {
    this.selectNo = this.$route.params.mno;
    this.getMachineInfo(this.selectNo);
    this.getMachinePrdInfo(this.selectNo);
    this.getMachinePartInfo(this.selectNo);

    console.log(this.$store.state.loginInfo);
  },
  methods: {
    // 로그인 정보
    ...mapMutations(["addLoginInfo"]),

    // 설비 상세 정보
    async getMachineInfo(selectNo) {
      let result = await axios.get(`${ajaxUrl}/machine/machineInfo/${selectNo}`)
                              .catch(err => console.log(err));

      this.machineData = result.data;
      this.allFormat(this.machineData);
      this.machineNo = this.machineData.machine_num;
      this.machineData.machine_state = this.machineData.machine_state == 'run' ? '사용' : '미사용';
    },
    // 설비 생산 정보
    async getMachinePrdInfo(selectNo) {
      let result = await axios.get(`${ajaxUrl}/machine/machinePrdInfo/${selectNo}`)
                              .catch(err => console.log(err));
      this.machinePrdData = result.data;
    },
    // 설비 부품 리스트
    async getMachinePartInfo(selectNo) {
      let result = await axios.get(`${ajaxUrl}/machine/machinePartList/${selectNo}`)
                              .catch(err => console.log(err));

      let newPartInfo = [];
      for(let i in result.data) {
        let partNo = result.data[i].part_num;
        let partInfo = await this.getPartInfo(partNo);
        newPartInfo.push(partInfo);
      }
      this.machinePartList = [...newPartInfo];
    },
    // 부품 상세 정보
    async getPartInfo(pno) {
      let result = await axios.get(`${ajaxUrl}/parts/partInfo/${pno}`)
                              .catch(err => console.log(err));
      return result.data;
    },

    // 설비 수정 모달 = 등록 모달과 같은 모달
    machineUpdate() {
      this.isShowModal = !this.isShowModal;
    },
    confirmModal() {
      let selectNo = this.$route.params.mno;
      this.getMachineInfo(selectNo);
      this.getMachinePrdInfo(selectNo);
      this.getMachinePartInfo(selectNo);
      this.closeModal();
    },
    closeModal() {
      this.isShowModal = false;
    },

    // 설비 삭제 machineDelete
    async machineDelete() {
      let result = await axios.delete(`${ajaxUrl}/machine/machineDelete/${this.selectNo}`)
                              .catch(err => console.log(err));
      let delRes = result.data;
      if(delRes.result == 'success') {
        this.$notify({
          text: "설비 삭제가 성공했습니다.",
          type: 'success',
        });
        this.$router.go(-1); // 삭제 성공시 뒤로가기(설비 리스트로 이동)
      } else {
        this.$notify({
          text: "설비 삭제가 실패했습니다.",
          type: 'error',
        });
      }
    },
    // 형변환 파트 작업중
    // 전체 텍스트 변환
    allFormat(data) {
      // 날짜, 생산량, 거래처, 사원명 검색
      data.buy_date = this.dateFormat(data.buy_date, 'yyyy-MM-dd');

      if(data.machine_type == '음료제작기기') {
        this.unit = ' ml';
      } else {
        this.unit = ' 개';
      }

      // 거래처, 사원은 공정기준 등록 완성후 메소드 작성
    },
    // 날짜 변환
    dateFormat(value, format) {
      return userDateUtils.dateFormat(value, format);
    },
    // 교체일 계산
    replaceDate(replace_date, days) {
      let date = new Date(replace_date);

      date.setDate(date.getDate() + days);

      return userDateUtils.dateFormat(date, 'yyyy-MM-dd');
    }
  }
}
</script>

<style scoped lang="scss">
.mimg {
  padding: 12px;
  background-color: $gray-200;
  border-radius: 5px;
  text-align: center;
  height: 100%;
  border: 2px solid;
  border-radius: 5px;
}
img {
  width: 100%;
  height: 100%;
}
.noImg {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
}

.machineInfo {
  height: 300px;
  margin: 20px 0;
  align-items: center;
}
.mdata {
  height: 100%;
}
.mdata .row {
  height: 35%;
  margin-left: 7px;
}
.mdata .row .col {
  background-color: $gray-200;
  margin: 0 5px 18px 5px;
  padding: 0 10px;
  border: 2px solid;
  border-radius: 5px;

  display: flex;
  align-items: center;

  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, .2), 0 2px 4px -1px rgba(0, 0, 0, .06);
}
.mdata-header {
  margin-top: 0;
  margin-bottom: 4px;
  justify-content: start;
}
.mdata-body {
  margin-top: 0;
  font-size: 20px;
  font-weight: 700;
  color: black;
}

.pinfo {
  height: 120px;
  align-items: center;
}
.pinfo .col {
  background-color: $gray-200;
  margin: 10px;
  padding: 10px;
  border-radius: 5px;
  border: 2px solid;
  border-radius: 5px;
  max-width: 48%;
  
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, .2), 0 2px 4px -1px rgba(0, 0, 0, .06);
}
.pinfo a {
  font-size: large;
  color: black !important;
  font-weight: 800;
}


</style>
