
<!-- home -->
<template>
  <div class="home-container">

    <div
      class="scale-box-container"
      :style="{
        transform: `scale(${scale}) translate(-50%, -50%)`,
        WebkitTransform: `scale(${scale}) translate(-50%, -50%)`,
          width:`${width}px`,
          height:`${height}px`
        }"
    >
      <!-- left -->
      <GeneratingCapacity :item="powerGenerationData" />
      <GeneratingCapacityTop :item="powerCompletionList" />
      <ElectricityTop :item="electricityConsumptionList" />
      <!-- <WindSpeed /> -->
      <!-- center -->
      <MapOfChina :item="nodeDistributionList" />
      <WindPowePrediction :item="windPowerList" />
      <!-- right -->
      <Operation :item="operationStatisticsData" />
      <MalfunctionPreview :item="faultOverviewData" />
      <FailureEquipmentTop :item="faultTypeStatisticList" />
      <WindPowerStationFailureTop :item="faultPlantStatisticList" />
      <!-- Element跑马灯轮播导致后面页面文字闪烁 -->
      <WindSpeed :item="windSpeedList" />
    </div>
  </div>
</template>

<script>
import { sendWebsocket, closeWebsocket } from '@/utils/webSocket.js';
// 引入所有需要的动态组件
const requireComponent = require.context(
  './components', // 组件所在目录的相对路径
  true, // 是否查询其子目录
  /\w+\.vue$/ // 匹配基础组件文件名的正则表达式
);
var comObj = {};
requireComponent.keys().forEach(fileName => {
  // 获取文件名
  var names = fileName
    .split('/')
    .pop()
    .replace(/\.\w+$/, '');
  // 获取组件配置
  const componentConfig = requireComponent(fileName);
  // 若该组件是通过"export default"导出的，优先使用".default"，否则退回到使用模块的根
  comObj[names] = componentConfig.default || componentConfig;
});
import { wsUrl } from '@/config/env.js';
import Api from '@/utils/api.js';
export default {
  name: 'Home',
  components: comObj,
  data() {
    return {
      scale: null,
      width: 1920,
      height: 1080,
      powerGenerationData: {},
      powerCompletionList: [],
      electricityConsumptionList: [],
      windSpeedList: [],
      windPowerList: [],
      operationStatisticsData: {},
      nodeDistributionList: [],
      faultOverviewData: {},
      faultTypeStatisticList: [],
      faultPlantStatisticList: []
    };
  },
  computed: {},
  watch: {},
  created() { },
  mounted() {
    this.requstWs();
    this.setScale();
    this.loadData();
    window.addEventListener('resize', this.setScale);
  },
  beforeDestroy() {
    // 页面销毁时关闭ws。因为有可能ws连接接收数据尚未完成，用户就跳转了页面
    // 在需要主动关闭ws的地方都可以调用该方法
    closeWebsocket();
  },
  methods: {
    loadData() {
      this.getPowerGeneration();
      this.getPowerCompletion();
      this.getElectricityConsumption();
      this.getWindSpeed();
      this.getWindPower();
      this.getOperationStatistics();
      this.getNodeDistribution();
      this.getFaultOverview();
      this.getFaultTypeStatistic();
      this.getFaultPlantStatistic();
    },
    // 发电量数据
    getPowerGeneration() {
      const data = {
        queryType: 'statistics'
      };
      this.$axios.get(Api.group.getPowerGeneration, data, (res) => {
        if (res.isSuccess) {
          const data = res.data[0] || {};
          const obj = {
            powerGeneration: data.powerGeneration ? (data.powerGeneration).toFixed(0) : 0,
            totalPowerGeneration: data.totalPowerGeneration ? (data.totalPowerGeneration).toFixed(0) : 0,
            yearPowerGeneration: data.yearPowerGeneration ? (data.yearPowerGeneration).toFixed(0) : 0
          };
          this.powerGenerationData = obj;
          // this.powerGenerationData = res.data[0];
        }
      });
    },
    // 发电完成情况数据
    getPowerCompletion() {
      const data = {
        queryType: 'MONTH',
        start: 1,
        size: 5
      };
      this.$axios.get(Api.group.getPowerCompletion, data, (res) => {
        if (res.isSuccess) {
          this.powerCompletionList = res.data;
        }
      });
    },
    // 风电场利用小时数
    getElectricityConsumption() {
      const data = {
        queryType: 'DAY',
        start: 1,
        size: 4
      };
      this.$axios.get(Api.group.getElectricityConsumption, data, (res) => {
        if (res.isSuccess) {
          this.electricityConsumptionList = res.data;
        }
      });
    },
    // 风速情况数据
    getWindSpeed() {
      const data = {};
      this.$axios.get(Api.group.getWindSpeed, data, (res) => {
        if (res.isSuccess) {
          this.windSpeedList = res.data;
        }
      });
    },
    // 风功率情况数据
    getWindPower() {
      const data = {};
      this.$axios.get(Api.group.getWindPower, data, (res) => {
        if (res.isSuccess) {
          this.windPowerList = res.data;
        }
      });
    },
    // 运行统计情况数据
    getOperationStatistics() {
      const data = {
        queryType: 'statistics'
      };
      this.$axios.get(Api.group.getOperationStatistics, data, (res) => {
        if (res.isSuccess) {
          this.operationStatisticsData = res.data[0];
        }
      });
    },
    // 获取站点分布及状态数据
    getNodeDistribution() {
      const data = {};
      this.$axios.post(Api.group.getNodeDistribution + '?isGroup=1', data, (res) => {
        if (res.isSuccess) {
          this.nodeDistributionList = res.data;
        }
      });
    },
    // 故障总览数据
    getFaultOverview() {
      const data = {};
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
        isGroup: true
      };
      this.$axios.post(Api.group.faultTypeStatistic, data, (res) => {
        if (res.isSuccess) {
          this.faultTypeStatisticList = res.data;
        }
      });
    },
    // 风电场故障统计数据
    getFaultPlantStatistic() {
      const data = {
        dateType: 'MONTH',
        start: 1,
        size: 4
      };
      this.$axios.get(Api.group.faultPlantStatistic, data, (res) => {
        if (res.isSuccess) {
          this.faultPlantStatisticList = res.data;
        }
      });
    },
    getScale() {
      const { width, height } = this;
      const ww = window.innerWidth / width;
      const wh = window.innerHeight / height;
      // const ww = document.body.clientWidth / width;
      // const wh = document.body.clientHeight / height;
      return ww < wh ? ww : wh;
    },
    setScale() {
      this.scale = this.getScale();
    },
    debounce(fn, delay) {
      const delays = delay || 500;
      let timer;
      return function () {
        const th = this;
        const args = arguments;
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(function () {
          timer = null;
          fn.apply(th, args);
        }, delays);
      };
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
      const postUrl = `${wsUrl}ws/index`;
      const params = {};
      // 发起ws请求 ws:htpp;wss:https
      sendWebsocket(postUrl, params, this.wsMessage, this.wsError);
    },
    // 更新ws数据
    updateWsData(res) {
      const module = res.module;
      const data = res.data;
      switch (module) {
        // 发电量
        case 'powerGeneration':
          this.powerGenerationData = data[0];
          break;
        // 发电完成率排行
        case 'powerCompletion':
          this.powerCompletionList = data;
          break;
        // 风电场利用小时数
        case 'electricityConsumption':
          console.log(data);
          this.electricityConsumptionList = data;
          break;
        // 风电场平均风速
        case 'windSpeed':
          this.windSpeedList = data;
          break;
        // 风功率预测
        case 'windPower':
          this.windPowerList = data;
          break;
        // 运行统计
        case 'operationStatistics':
          this.operationStatisticsData = data[0];
          break;
        // 故障总览
        case 'faultOverview':
          this.faultOverviewData = data;
          break;
        // 设备故障排行
        case 'faultTypeStatistic':
          this.faultTypeStatisticList = data;
          break;
        // 风电场故障排行
        case 'faultPlantStatistic':
          this.faultPlantStatisticList = data;
          break;
        // 风电场状态
        case 'nodeDistribution':
          this.nodeDistributionList = data;
          break;
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.home-container {
  width: 100%;
  height: calc(100vh - 96px);
  color: #fff;
}
.scale-box-container {
  transform-origin: 0 0;
  position: absolute;
  left: 50%;
  top: 50%;
  // transition: 0.3s;
  background: url("~@/assets/image/app-main-bg.png") center center no-repeat;
  background-size: 100% 100%;
}
</style>
