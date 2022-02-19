<!--
 * @Author: JTune
 * @LastEditors: Please set LastEditors
 * @Description: 数据概览页面
 * @FilePath: \centralized-control-sys-web\src\views\dataOverview\index.vue
-->
<template>
  <div class="power-plant-content">
    <!-- <div class="c-h flex-box clearfix">
      <h1 class="flex-1">数据概览</h1>
      <div class="h-n flex-1">
        <span class="wind-name">{{ powerPlant }}</span>
      </div>
    </div> -->
    <div class="main">
      <!-- <div class="video-c">
      </div> -->
      <div class="con-c">
        <el-row :gutter="20">
          <el-col :span="10">
            <div class="item">
              <div class="tit">负荷</div>
              <div class="item-con item-c">
                <div class="pr-10">
                  <p class="d-c">{{ queryLoad ? queryLoad.maximumLoad : 0 }} MW</p>
                  <p>最大负荷</p>
                </div>
                <div class="pl-10">
                  <p class="d-c">{{ queryLoad ? queryLoad.minimumLoad : 0 }} MW</p>
                  <p>最小负荷</p>
                </div>
                <div class="pl-10">
                  <p class="d-c">{{ queryLoad ? queryLoad.averageLoad : 0 }} MW</p>
                  <p>平均负荷</p>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="14">
            <div class="item">
              <div class="tit">升压站</div>
              <div class="item-con item-c">
                <!-- <div>
                  <router-link to="failureWarning/2/1">
                    <p class="warn">
                      {{
                      queryBoosterStation
                      ? queryBoosterStation.substationFaultNumber
                      : 0
                      }}
                    </p>
                    <p>变电故障</p>
                  </router-link>
                </div> -->
                <div>
                  <router-link to="runningStatus">
                    <p class="d-c">{{queryBoosterStation.state == 1?'运行':queryBoosterStation.state == 2?'检修':queryBoosterStation.state == 3?'故障':queryBoosterStation.state == 4?'调试中':''}}</p>
                    <p>运行状态</p>
                  </router-link>
                </div>
                <div
                  @click="
                    handleBoosterStation(
                      queryBoosterStation ? queryBoosterStation.title : '',
                      queryBoosterStation ? queryBoosterStation.data : ''
                    )
                  "
                  class="grid text-ellipsis"
                >
                  <!-- <el-tooltip
                    :content="queryBoosterStation.operationName"
                    placement="top"
                    popper-class="group-tooltip"
                  > -->
                  <p
                    class="d-c"
                    :title="queryBoosterStation.operationName"
                  >
                    {{ queryBoosterStation ? queryBoosterStation.operationName : "无" }}
                  </p>
                  <!-- </el-tooltip> -->
                  <p>历史操作</p>
                </div>
              </div>
            </div>
          </el-col>
          <!-- <el-col :span="8">
            <div class="item flex-1">
              <div class="tit">风机</div>
              <div class="item-con item-c">
                <div>
                  <router-link to="runCondition">
                    <p class="run">{{ queryFenData ? queryFenData.fanRunCount : 0 }}</p>
                    <p>运行</p>
                  </router-link>
                </div>
                <div>
                  <router-link to="runCondition">
                    <p class="service">
                      {{ queryFenData ? queryFenData.fanMaintenanceCount : 0 }}
                    </p>
                    <p>检修</p>
                  </router-link>
                </div>
                <div>
                  <router-link to="runCondition">
                    <p class="fault">
                      {{ queryFenData ? queryFenData.fanMalfunctionCount : 0 }}
                    </p>
                    <p>故障</p>
                  </router-link>
                </div>
                <div>
                  <router-link to="runCondition">
                    <p class="warn">
                      {{ queryFenData ? queryFenData.fanWarningCount : 0 }}
                    </p>
                    <p>告警</p>
                  </router-link>
                </div>
              </div>
            </div>
          </el-col> -->
        </el-row>
        <el-row
          :gutter="20"
          class="mt-20"
        >
          <el-col :span="10">
            <div class="item">
              <div class="tit">气象数据</div>
              <div class="item-con item-c">
                <div>
                  <el-popover
                    placement="bottom-end"
                    trigger="hover"
                    width="430"
                  >
                    <div class="weather-con">
                      <div>
                        <span class="tit-p">天气：</span>
                        <span :class="{ 'weather-red': queryMeteorologicalData.level=='红色', 'weather-orange': queryMeteorologicalData.level=='橙色',
                        'weather-yellow': queryMeteorologicalData.level=='黄色','weather-blue': queryMeteorologicalData.level=='蓝色',}">
                          {{queryMeteorologicalData.weather}}</span>
                      </div>
                      <div><span class="tit-p">气温：</span>{{queryMeteorologicalData.airTemperature}}</div>
                      <div><span class="tit-p">风向：</span>{{queryMeteorologicalData.windDirection}}</div>
                      <!-- <div>预警等级：{{queryMeteorologicalData.level}}</div> -->
                      <div><span class="tit-p">预警标题：</span>{{queryMeteorologicalData.title}}</div>
                      <div><span class="tit-p">预警类型名称：</span>{{queryMeteorologicalData.typeName}}</div>
                      <div>
                        <span class="tit-p">预警详细描述：</span>
                        <div class="dec-p">
                          {{queryMeteorologicalData.text}}
                        </div>
                      </div>
                    </div>
                    <div slot="reference">
                      <p
                        class="d-c"
                        :class="{ 'weather-red': queryMeteorologicalData.level=='红色', 'weather-orange': queryMeteorologicalData.level=='橙色',
                        'weather-yellow': queryMeteorologicalData.level=='黄色','weather-blue': queryMeteorologicalData.level=='蓝色',}"
                      >{{ queryMeteorologicalData.weather}}</p>
                      <p>天气</p>
                    </div>
                  </el-popover>
                </div>
                <div>
                  <p class="d-c">
                    <span v-if="queryMeteorologicalData.airTemperature">{{ queryMeteorologicalData.airTemperature }}</span>
                  </p>
                  <p>气温</p>
                </div>
                <div>
                  <p class="d-c">{{ queryMeteorologicalData.windDirection }}</p>
                  <p>风向</p>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="14">
            <div class="item">
              <div class="tit">风资源指标</div>
              <div class="item-con">
                <div>
                  <p class="d-c">{{ queryWindResource.avgWindSpeed || 0}} m/s</p>
                  <p>平均风速</p>
                </div>
                <div>
                  <p class="d-c">{{ queryWindResource.averageAirDensity|| 0 }} kg/m³</p>
                  <p>平均空气密度</p>
                </div>
                <div>
                  <p class="d-c">{{ queryWindResource.validHoursOfWind || 0}} h</p>
                  <p>有效风时</p>
                </div>
                <div>
                  <p class="d-c">{{ queryWindResource.effectiveWindTimeRate || 0}}%</p>
                  <p>有效风时率</p>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="content">
      <div class="con-l">
        <div class="con-l-i flex-box">
          <div class="flex-1">
            <span
              class="arrows-btn"
              @click="handleGenerate"
            ></span>
            <div class="tit">发电量</div>
            <GeneratingCapacity :list="powerGenerationList" />
          </div>
          <div class="flex-1 ml-20">
            <span
              class="arrows-btn"
              @click="handleWindPower"
            ></span>
            <div class="tit">风功率预测</div>
            <WindPowePrediction :list="windPowerList" />
          </div>
        </div>
        <div class="con-l-i flex-box mt-20">
          <div class="flex-1">
            <span
              class="arrows-btn"
              @click="handleWattage"
            ></span>
            <div class="tit">风电场等效利用小时</div>
            <ElectricityConsumption :item="multipleUsedElectricityList" />
          </div>
          <div class="flex-1 ml-20">
            <span
              class="arrows-btn"
              @click="handleFaultOverview"
            ></span>
            <div class="tit">故障总览</div>
            <FaultOverview :list="faultOverviewData" />
          </div>
        </div>
      </div>
      <div class="con-r ml-20">
        <div class="data-target">
          <div class="tit">数据指标</div>
          <IndicatorData :list="indicatorData" />
        </div>
        <div class="fault-con">
          <span
            class="arrows-btn"
            @click="handleFault"
          ></span>
          <div class="tit">设备故障排行</div>
          <FaultRanking :list="faultRankList" />
        </div>
      </div>
    </div>
    <DetailsPopUp
      v-if="dialogVisibleDetail"
      :dialog-visible-detail="dialogVisibleDetail"
      :isBlack="isBlack"
      @handleDialogVisibleDetail="handleDialogVisibleDetail"
    >
      <div
        class="dialog-content"
        slot="content"
      >
        <div class="tit">重大操作：{{ boosterStationTitle }}</div>
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in activities"
            :key="index"
            :timestamp="activity.timestamp"
          >
            <div>{{ activity.date }}</div>
            <div>{{ activity.dispatchOrder }}</div>
            <div>{{ activity.dispatchReply }}</div>
          </el-timeline-item>
        </el-timeline>
      </div>
    </DetailsPopUp>
  </div>
</template>

<script>
import { sendWebsocket, closeWebsocket } from '@/utils/webSocket.js';
import { wsUrl } from '@/config/env.js';
import Api from '@/utils/api.js';
// import { splitStr } from '@/utils/utils';
import { mapState } from 'vuex';
import IndicatorData from './components/IndicatorData';
import FaultRanking from './components/FaultRanking';
import WindPowePrediction from './components/WindPowePrediction';
import GeneratingCapacity from './components/GeneratingCapacity';
import ElectricityConsumption from './components/ElectricityConsumption';
import FaultOverview from './components/FaultOverview';
import DetailsPopUp from '@/components/dialog/DetailsPopUp';
export default {
  name: '',
  components: {
    IndicatorData,
    FaultRanking,
    WindPowePrediction,
    GeneratingCapacity,
    ElectricityConsumption,
    FaultOverview,
    DetailsPopUp
  },
  data() {
    return {
      dialogVisibleDetail: false,
      isBlack: false,
      boosterStationTitle: '风电场并网由检修转运行',
      activities: [
        {
          dispatchOrder: '',
          dispatchReply: '',
          date: ''
        }
      ],
      queryFenData: {},
      queryBoosterStation: {},
      queryMeteorologicalData: {},
      queryWindResource: {},
      queryLoad: {},
      indicatorData: [],
      powerGenerationList: [],
      windPowerList: [],
      multipleUsedElectricityList: [],
      faultOverviewData: {},
      faultRankList: [],
      windPowerPlantWs: {}
    };
  },
  computed: {
    ...mapState({
      powerPlant: (state) => state.powerPlant.powerPlant,
      powerPlantId: (state) => state.powerPlant.powerPlantId
    })
  },
  watch: {
    powerPlantId: function (val) {
      this.init();
    }
  },
  created() { },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.getQueryFenData();
      this.getQueryBoosterStation();
      this.getQueryMeteorologicalData();
      this.getQueryWindResource();
      this.getQueryLoad();
      this.getQueryDataIndicators();
      this.getPowerGeneration();
      this.getWindPower();
      this.getQueryMultipleUsedElectricity();
      this.getFaultOverview();
      this.getFaultTypeStatistic();
      this.requstWs();
    },
    // 查询场站气象数据
    getQueryMeteorologicalData() {
      const powerPlantId = this.powerPlantId;
      this.$axios.get(
        Api.overview.queryMeteorologicalData + `/${powerPlantId}`,
        {},
        (res) => {
          if (res.isSuccess) {
            const data = res.data;
            if (data.text) {
              const textstr = data.text.split('防御指南')[0];
              data.text = textstr;
            }
            this.queryMeteorologicalData = data;
          }
        }
      );
    },
    // 查询风资源指标
    getQueryWindResource() {
      const powerPlantId = this.powerPlantId;
      this.$axios.get(Api.overview.queryWindResource + `/${powerPlantId}`, {}, (res) => {
        if (res.isSuccess) {
          this.queryWindResource = res.data;
        }
      });
    },
    // 负荷
    getQueryLoad() {
      const powerPlantId = this.powerPlantId;
      this.$axios.get(Api.overview.queryLoad + `/${powerPlantId}`, {}, (res) => {
        if (res.isSuccess) {
          this.queryLoad = res.data;
        }
      });
    },
    // 查询风资源指标
    getQueryDataIndicators() {
      const powerPlantId = this.powerPlantId;
      this.$axios.get(
        Api.overview.queryDataIndicators + `/${powerPlantId}`,
        {},
        (res) => {
          if (res.isSuccess) {
            this.indicatorData = res.data;
          }
        }
      );
    },
    // 发电量数据
    getPowerGeneration() {
      const data = {
        queryType: 'DAY',
        powerPlantId: this.powerPlantId
      };
      this.xAxisData = [];
      this.seriesData1 = [];
      this.$axios.get(Api.group.getPowerGeneration, data, (res) => {
        if (res.isSuccess) {
          this.powerGenerationList = res.data;
        }
      });
    },
    // 风功率情况数据
    getWindPower() {
      const data = {
        powerPlantId: this.powerPlantId
      };
      this.$axios.get(Api.group.getWindPower, data, (res) => {
        if (res.isSuccess) {
          // res.data.map((item) => {
          //   item.time = splitStr(item.periodTime);
          // });
          this.windPowerList = res.data;
        }
      });
    },
    // 风电场等效利用小时
    getQueryMultipleUsedElectricity() {
      const data = {
        periodTime: '',
        powerPlantId: this.powerPlantId
      };
      this.$axios.get(Api.overview.realTimeDatasPowerPlantHourStatistics, data, (res) => {
        if (res.isSuccess) {
          this.multipleUsedElectricityList = res.data;
        }
      });
      // queryMultipleUsedElectricity
      // this.$axios.post(Api.overview.queryEquivalentUtilizationHours, data, (res) => {
      //   if (res.isSuccess) {
      //     this.multipleUsedElectricityList = res.data;
      //   }
      // });
    },
    // 故障总览数据
    getFaultOverview() {
      const data = {
        powerPlantId: this.powerPlantId
      };
      this.$axios.get(Api.group.faultOverview, data, (res) => {
        if (res.isSuccess) {
          this.faultOverviewData = res.data;
        }
      });
    },
    // 设备故障排行数据
    getFaultTypeStatistic() {
      const data = {
        start: 1,
        size: 5,
        powerPlantId: this.powerPlantId,
        isGroup: true
      };
      this.$axios.post(Api.group.faultTypeStatistic, data, (res) => {
        if (res.isSuccess) {
          this.faultRankList = res.data;
        }
      });
    },
    // 查询场站风机数据
    getQueryFenData() {
      const powerPlantId = this.powerPlantId;
      this.$axios.get(Api.overview.queryFenData + `/${powerPlantId}`, {}, (res) => {
        if (res.isSuccess) {
          this.queryFenData = res.data;
        }
      });
    },
    // 查询站点升压站看板数据
    getQueryBoosterStation() {
      const powerPlantId = this.powerPlantId;
      this.$axios.get(Api.overview.queryBoosterStation + `/${powerPlantId}`, {}, (res) => {
        if (res.isSuccess) {
          this.queryBoosterStation = res.data;
        }
      }
      );
    },
    // ws连接成功，后台返回的ws数据，组件要拿数据渲染页面等操作
    wsMessage(res) {
      const data = res;
      this.updateWsData(data);
      // 这里写拿到数据后的业务代码
    },
    // ws连接失败，组件要执行的代码
    wsError() {
      // 比如取消页面的loading
    },
    requstWs() {
      // 防止用户多次连续点击发起请求，所以要先关闭上次的ws请求。
      closeWebsocket();
      // 跟后端协商，需要什么参数数据给后台
      const postUrl = `${wsUrl}ws/node/${this.powerPlantId}`;
      const params = {};
      // 发起ws请求 ws:htpp;wss:https
      sendWebsocket(postUrl, params, this.wsMessage, this.wsError);
    },
    // 更新ws数据
    updateWsData(res) {
      const module = res.module;
      const data = res.data;
      switch (module) {
        // 风机
        case 'fenData':
          this.queryFenData = data;
          break;
        // 升压站
        case 'boosterStation':
          this.queryBoosterStation = data;
          break;
        // 负荷
        case 'load':
          this.queryLoad = data;
          break;
        // 气象数据
        case 'meteorologicalData':
          this.queryMeteorologicalData = data;
          break;
        // 风资源指标
        case 'windResource':
          this.queryWindResource = data;
          break;
        // 发电量
        case 'powerGeneration':
          this.powerGenerationList = data;
          break;
        // 风功率预测
        case 'windPower':
          this.windPowerList = data;
          break;
        // 数据指标
        case 'dataIndicators':
          this.indicatorData = data;
          break;
        // 风电场等效利用小时
        case 'validHours':
          this.multipleUsedElectricityList = data;
          break;
        // 故障总览
        case 'faultOverview':
          this.faultOverviewData = data;
          break;
        // 设备故障排行
        case 'faultTypeStatistic':
          this.faultRankList = data;
          break;
        case 'nodeFaultCount':
          this.windPowerPlantWs = data;
          break;
      }
    },
    beforeDestroy() {
      // 页面销毁时关闭ws。因为有可能ws连接接收数据尚未完成，用户就跳转了页面
      // 在需要主动关闭ws的地方都可以调用该方法
      closeWebsocket();
    },
    // 发电量
    handleGenerate() {
      this.$router.push({ name: 'generatingCapacityDetails' });
    },
    // 风功率预测
    handleWindPower() {
      this.$router.push({ name: 'windPowePredictionDetails' });
    },
    // 综合用电量
    handleWattage() {
      this.$router.push({ name: 'electricityConsumptionDetails' });
    },
    // 故障总览
    handleFaultOverview() {
      this.$router.push({ name: 'faultOverviewDetails' });
    },
    // 故障排行-设备故障
    handleFault() {
      this.$router.push({ name: 'faultRankingDetails' });
    },
    handleDialogVisibleDetail(val) {
      this.dialogVisibleDetail = val;
    },
    handleBoosterStation(title, data) {
      this.boosterStationTitle = title;
      this.activities = data;
      this.dialogVisibleDetail = true;
    }
  }
};
</script>

<style scoped lang="scss">
.power-plant-content {
  width: 100%;
  min-height: calc(100vh - 96px);
  color: #333333;
  .ml-20 {
    margin-left: 20px;
  }
  .mt-20 {
    margin-top: 20px;
  }
  .pr-10 {
    padding-right: 10px;
  }
  .pl-10 {
    padding-left: 10px;
  }
  h1 {
    line-height: 32px;
  }
  .tit {
    font-size: 14px;
    font-family: Microsoft YaHei;
    padding: 10px;
    font-weight: 800;
  }

  .c-h {
    height: 32px;
    padding-top: 10px;
    padding-bottom: 35px;

    h1 {
      font-size: 14px;
    }
    .h-n {
      text-align: right;
      .wind-name {
        display: inline-block;
        min-width: 160px;
        height: 32px;
        line-height: 32px;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        padding-left: 10px;
        padding-right: 10px;
        text-align: left;
        border: 1px solid #dcdfe4;
        color: #333333;
        background: #fff;
      }
    }
  }
  .main {
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: flex-start;
    align-content: flex-start;
    .video-c {
      flex: 1;
      height: 424px;
      margin-right: 20px;
      background: url(~@/assets/image/shipin.png) center no-repeat;
      background-size: 100% 100%;
      border: 1px solid #dcdfe4;
      box-sizing: border-box;
    }
    .grid {
      cursor: pointer;
    }
    .con-c {
      flex: 1;
      .item {
        width: 100%;
        height: 126px;
        background: #fff;
        border: 1px solid #dcdfe4;
        box-sizing: border-box;
      }
      .item-f {
        width: 100%;
        height: 130px;
        background: #fff;
        border: 1px solid #dcdfe4;
        // box-sizing: border-box;
      }
      .item-c {
        min-width: 200px;
        // max-width: 460px;
      }
      .item-con {
        padding: 20px 30px;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: flex-start;
        align-items: flex-start;
        align-content: flex-start;

        > div {
          flex: 1;
          text-align: center;
          font-size: 12px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #999;
          a {
            color: #999;
          }
          p {
            width: 100%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          p:first-child {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 4px;
            height: 28px;
            line-height: 28px;
          }

          .run {
            color: #22cce2;
          }
          .service {
            color: #fdbf5e;
          }
          .fault {
            color: #ff3d57;
          }
          .warn {
            color: #ff3d57;
          }
          .d-c {
            color: #3350d4;
          }
          .weather-text {
            cursor: pointer;
          }
          .weather-red {
            color: #ff3d57;
          }
          .weather-orange {
            color: #fb9602;
          }
          .weather-yellow {
            color: #ffd868;
          }
          .weather-blue {
            color: #3350d4;
          }
        }
      }
    }
  }
  .content {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: flex-start;
    align-content: flex-start;

    .con-l {
      flex: 3;

      .con-l-i {
        width: 100%;
        height: 335px;

        > div {
          background-color: #fff;
          position: relative;
          border: 1px solid #dcdfe4;
          box-sizing: border-box;
          .arrows-btn {
            position: absolute;
            right: 10px;
            top: 20px;
            transform: translateY(-50%);
            width: 20px;
            height: 20px;
            background: url(~@/assets/image/arrow-i.png) center no-repeat;
            background-size: 100% 100%;
            cursor: pointer;
            border-radius: 50%;
            &:hover {
              background: url(~@/assets/image/arrow-i-h.png) center no-repeat;
            }
          }
        }
      }
    }
    .con-r {
      flex: 1;

      .data-target {
        min-height: 300px;
        padding-bottom: 10px;
        background-color: #fff;
        border: 1px solid #dcdfe4;
        box-sizing: border-box;
      }
      .fault-con {
        position: relative;
        min-height: 160px;
        margin-top: 20px;
        background-color: #fff;
        border: 1px solid #dcdfe4;
        box-sizing: border-box;
        .arrows-btn {
          position: absolute;
          right: 10px;
          top: 20px;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
          background: url(~@/assets/image/arrow-i.png) center no-repeat;
          background-size: 100% 100%;
          cursor: pointer;
          border-radius: 50%;
        }
      }
    }
  }
}
.dialog-content {
  padding: 0 20px;
  font-size: 14px;
  overflow: auto;
  .tit {
    margin-bottom: 20px;
  }
}
.weather-con {
  font-size: 14px;
  color: #999;
  > div {
    padding-bottom: 10px;
  }
  .tit-p {
    color: #333;
  }
  .dec-p {
    line-height: 23px;
  }
}
.weather-red {
  color: #ff3d57;
}
.weather-orange {
  color: #fb9602;
}
.weather-yellow {
  color: #ffd868;
}
.weather-blue {
  color: #3350d4;
}
::v-deep .group-tooltip.el-tooltip__popper.is-dark {
  background: #fff;
  color: #ccc;
}
</style>
