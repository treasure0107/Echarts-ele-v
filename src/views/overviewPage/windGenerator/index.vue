<!--
 * @Descripttion:风机详情
 * @Date: 2021-01-07 11:39:41
-->
<template>
  <div class="wind-generator-container">
    <div
      class="scale-box-container"
      :style="{
        transform: `scale(${scale}) translate(-50%, -50%)`,
        WebkitTransform: `scale(${scale}) translate(-50%, -50%)`,
          width:`${width}px`,
          height:`${height}px`
        }"
    >
      <!-- <dv-border-box-1> -->
      <div class="wind-con">
        <div class="breadcrumb-box">
          <el-breadcrumb>
            <el-breadcrumb-item :to="{ path: '/runCondition' }"><a href="javascript:void(0);">风机</a></el-breadcrumb-item>
            <el-breadcrumb-item><span class="active">风机详情</span></el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <GeneratorList
          :activeIdx.sync='powerGenerationActive'
          :items="powerGenerationList"
          @changeActiveIdx="changeActiveIdx"
        />
        <MalfunctionInfo :items='telemetryList' />
        <GeneratorModel
          :deviceId="deviceId"
          ref="generatorModel"
        />
        <GearCase
          :verticalVibrationNoFilter="verticalVibrationNoFilter"
          :verticalVibrationFilter="verticalVibrationFilter"
        />
        <WindSpeed :list="dashboardList" />
        <WindPower
          :lateralVibrationNoFilter="lateralVibrationNoFilter"
          :lateralVibrationFilter="lateralVibrationFilter"
        />
        <!-- <DataPreview
          :telesignalisationList="telesignalisationList"
          :telepulseList="telepulseList"
        /> -->
        <GeneratorInfo :items="powerGeneration" />
      </div>
      <!-- </dv-border-box-1> -->
    </div>
  </div>
</template>

<script>
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
import Api from '@/utils/api.js';
import { mapState } from 'vuex';
import { wsUrl } from '@/config/env.js';
import { sendWebsocket, closeWebsocket } from '@/utils/webSocket.js';
import { sendWs, closeWs } from '@/utils/ws.js';
export default {
  name: 'Home',
  components: comObj,
  data() {
    return {
      scale: null,
      width: 1920,
      height: 1080,
      deviceId: '',
      deviceCode: '',
      powerGenerationActive: '', // 选中风机
      powerGenerationList: [], // 风机列表
      telemetryList: [], // 遥测
      telesignalisationList: [], // 遥信
      telepulseList: [], // 遥脉
      dashboardList: [], // 仪表盘数据
      isBreadcrumbShow: true,
      verticalVibrationNoFilter: [],
      verticalVibrationFilter: [],
      lateralVibrationNoFilter: [],
      lateralVibrationFilter: [],
      powerGeneration: {}
    };
  },
  computed: {
    ...mapState({
      powerPlantId: state => state.powerPlant.powerPlantId
    })
  },
  watch: {},
  created() { },
  mounted() {
    this.deviceId = this.$route.params.deviceId;
    this.deviceCode = this.$route.params.deviceCode;
    window.addEventListener('resize', this.setScale);
    this.getPowerGeneration();
    this.$nextTick(() => {
      this.loadData();
    });
    this.setScale();
    this.requstWs();
    // this.connectWS();
    this.requstWsDevice();
  },
  methods: {
    // ws连接成功，后台返回的ws数据，组件要拿数据渲染页面等操作
    wsMessage(res) {
      const data = res;
      this.updateWsData(data);
    },
    // ws连接失败，组件要执行的代码
    wsError() {
      // 比如取消页面的loading
    },
    requstWs() {
      // 防止用户多次连续点击发起请求，所以要先关闭上次的ws请求。
      closeWebsocket();
      // 跟后端协商，需要什么参数数据给后台
      const postUrl = `${wsUrl}ws/windMachineDetail/${this.deviceId}`;
      const params = {};
      // 发起ws请求 ws:htpp;wss:https
      sendWebsocket(postUrl, params, this.wsMessage, this.wsError);
    },
    // 更新ws数据
    updateWsData(res) {
      const module = res.module;
      const data = res.data;
      switch (module) {
        // 电量数据
        case 'devicePowerGeneration':
          this.powerGeneration = data;
          break;
        // 仪表盘
        case 'pointTypeData':
          this.dashboardList = data;
          break;
        // 机舱垂直方向振动（未滤波）
        case 'verticalVibrationNoFilter':
          this.verticalVibrationNoFilter = data;
          break;
        // 机舱垂直方向振动（已滤波）
        case 'verticalVibrationFilter':
          this.verticalVibrationFilter = data;
          break;
        // 机舱侧向振动（未滤波）
        case 'lateralVibrationNoFilter':
          this.lateralVibrationNoFilter = data;
          break;
        // 机舱轴向振动（已滤波）
        case 'lateralVibrationFilter':
          this.lateralVibrationFilter = data;
          break;
      }
    },
    beforeDestroy() {
      // this.websocketsClose();
      // this.websockets.close();
      closeWebsocket();
      closeWs();
    },
    loadData() {
      this.getPointTypeData();
      this.getDashboardData();
      this.queryDevicePowerGeneration();
      this.queryChartData('vertical_vibration_no_filter');
      this.queryChartData('vertical_vibration_filter');
      this.queryChartData('lateral_vibration_no_filter');
      this.queryChartData('lateral_vibration_filter');
      setTimeout(() => {
        this.$refs.generatorModel.fetchData();
      }, 300);
      // this.getPowerGeneration();
      // this.queryByDeviceCodeTelesignaling();
      // this.queryByRealTimeDatasDeviceTelepulse();
    },
    handleBack() {
      this.$router.go(-1);
    },
    // 风机列表
    getPowerGeneration() {
      this.tableData = [];
      const deviceId = this.$route.params.deviceId;
      // const deviceCode = this.$route.params.deviceCode;
      const data = {
        deviceType: '1',
        vendorName: '',
        deviceState: '',
        powerPlantId: this.powerPlantId,
        start: 1,
        size: 10000
      };
      this.$axios.post(Api.overview.queryFanDetail, data, (res) => {
        if (res.isSuccess) {
          this.powerGenerationList = res.data.data;
          this.powerGenerationList.forEach((item, key) => {
            if (item.deviceId == this.deviceId) {
              this.powerGenerationActive = key;
            }
          });
          if (deviceId == 1) {
            const powerGeneration = this.powerGenerationList[0];
            this.deviceId = powerGeneration.deviceId;
            this.deviceCode = powerGeneration.deviceCode;
            this.isBreadcrumbShow = false;
          }
          this.$nextTick(() => {
            this.loadData();
          });
        }
      });
    },
    // 遥测数据
    getPointTypeData() {
      const data = {
        deviceId: this.deviceId
      };
      this.$axios.get(Api.draughtDetails.getPointTypeData, data, (res) => {
        if (res.isSuccess) {
          this.telemetryList = res.data;
        }
      });
    },
    // 仪表盘数据
    getDashboardData() {
      const data = {
        deviceId: this.deviceId,
        isExtra: 1
      };
      this.$axios.get(Api.draughtDetails.getDashboardData, data, (res) => {
        if (res.isSuccess) {
          this.dashboardList = res.data;
        }
      });
    },
    // 折线图方法
    queryChartData(dataCode) {
      const data = {
        dataCode,
        deviceId: this.deviceId
      };
      this.$axios.get(Api.draughtDetails.queryChartData, data, (res) => {
        if (res.isSuccess) {
          if (dataCode == 'vertical_vibration_no_filter') {
            // 机舱垂直方向振动（未滤波）
            this.verticalVibrationNoFilter = res.data;
          }
          if (dataCode == 'vertical_vibration_filter') {
            // 机舱垂直方向振动（已滤波）
            this.verticalVibrationFilter = res.data;
          }
          if (dataCode == 'lateral_vibration_no_filter') {
            // 机舱侧向振动（已滤波）
            this.lateralVibrationNoFilter = res.data;
          }
          if (dataCode == 'lateral_vibration_filter') {
            // 机舱轴向振动（已滤波）
            this.lateralVibrationFilter = res.data;
          }
        }
      });
    },
    // 电量数据
    queryDevicePowerGeneration() {
      const data = {
        deviceId: this.deviceId
      };
      this.$axios.get(Api.draughtDetails.queryDevicePowerGeneration, data, (res) => {
        if (res.isSuccess) {
          this.powerGeneration = res.data;
        }
      });
    },
    // 根据设备编码查询遥信点项数据
    queryByDeviceCodeTelesignaling() {
      const deviceCode = this.deviceCode;
      this.$axios.get(
        Api.overview.queryByDeviceCodeTelesignaling +
        `/${deviceCode}`,
        {},
        (res) => {
          if (res.isSuccess) {
            this.telesignalisationList = res.data.dataList;
          }
        }
      );
    },
    // 根据设备编码查询遥脉点项数据
    queryByRealTimeDatasDeviceTelepulse() {
      const deviceCode = this.deviceCode;
      this.$axios.get(
        Api.overview.queryByRealTimeDatasDeviceTelepulse + `/${deviceCode}`, {},
        (res) => {
          if (res.isSuccess) {
            if (res.data) {
              this.telepulseList = res.data.dataList;
            } else {
              this.telepulseList = [];
            }
          }
        }
      );
    },
    changeActiveIdx(val) {
      this.deviceId = val.id;
      this.deviceCode = val.code;
      this.loadData();
      closeWebsocket();
      closeWs();
      this.requstWs();
      this.requstWsDevice();
      // this.websocketsClose();
      // this.connectWS();
    },

    // 遥测
    wsMessageDevice(res) {
      const data = res;
      this.updateWsDataDevice(data);
      // 这里写拿到数据后的业务代码
    },
    requstWsDevice() {
      // 防止用户多次连续点击发起请求，所以要先关闭上次的ws请求。
      closeWs();
      // 跟后端协商，需要什么参数数据给后台
      const postUrl = `${wsUrl}ws/device/${this.deviceCode}`;
      const params = {};
      // 发起ws请求 ws:htpp;wss:https
      sendWs(postUrl, params, this.wsMessageDevice, this.wsError);
    },
    updateWsDataDevice(res) {
      const moduleWs = res.module;
      const dataWs = res.data;
      if (moduleWs) {
        this.telemetryList.forEach(item => {
          item.pointDetails.forEach(param => {
            if (param.name == dataWs[0].pointItemCodeName) {
              const arr = dataWs[0].pointItemCodeValue.split(' ');
              param.value = arr[0];
            }
          });
        });
      }
    },
    getScale() {
      const { width, height } = this;
      const ww = window.innerWidth / width;
      const wh = window.innerHeight / height;
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
    }
    // connectWS() {
    //   if ('WebSocket' in window) {
    //     const url = `${wsUrl}ws/device/${this.deviceCode}`;
    //     this.websockets = new WebSocket(url);
    //     this.initWebSocketWS();
    //   } else {
    //     this.$message.error('当前浏览器 Not support websocket');
    //   }
    // },
    // // 遥测
    // initWebSocketWS() {
    //   // 连接错误
    //   this.websockets.onerror = this.setErrorMessage;
    //   // 连接成功
    //   this.websockets.onopen = this.setOnopenMessage;
    //   // 收到消息的回调
    //   this.websockets.onmessage = this.setOnmessageMessage;
    //   // 连接关闭的回调
    //   this.websockets.onclose = this.setOncloseMessage;
    //   // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
    //   window.onbeforeunload = this.onbeforeunload;
    // },
    // sendData(data) {
    //   this.websockets.send(data);
    // },
    // setErrorMessage() {
    //   console.log('WebSocket连接发生错误状态码：' + this.websockets.readyState);
    // },
    // setOnopenMessage() {
    //   console.log('WebSocket连接成功状态码：' + this.websockets.readyState);
    // },
    // setOncloseMessage() {
    //   console.log('WebSocket连接关闭状态码：' + this.websockets.readyState);
    // },
    // setOnmessageMessage(e) {
    //   const res = e.data;
    //   const result = JSON.parse(res);
    //   const data = result.data;
    //   if (result.module) {
    //     this.telemetryList.forEach(item => {
    //       item.pointDetails.forEach(param => {
    //         if (param.name == data[0].pointItemCodeName) {
    //           const arr = data[0].pointItemCodeValue.split(' ');
    //           param.value = arr[0];
    //         }
    //       });
    //     });
    //   }
    // },
    // onbeforeunload() {
    //   this.websocketsClose();
    // },
    // webSocketClose() {
    //   this.websockets.close();
    // },
  }
};
</script>
<style lang='scss' scoped>
.wind-generator-container {
  width: 100%;
  // height: calc(100vh - 196px);
  height: calc(100vh - 96px);
  min-height: calc(100% - 96px);
  color: #fff;
}
.scale-box-container {
  transform-origin: 0 0;
  position: absolute;
  padding: 80px 0 20px;
  box-sizing: border-box;
  left: 50%;
  top: 57%;
  // background: #050a20;
}
.wind-con {
  margin-top: 100px;
}
.breadcrumb-box {
  position: absolute;
  left: 20px;
  top: 10px;
  z-index: 99;
  ::v-deep.el-breadcrumb__inner {
    font-weight: 700;
    font-size: 12px;
    a {
      color: rgba(255, 255, 255, 0.6) !important;
      &:hover {
        color: #3350d4 !important;
        font-weight: 700;
        opacity: 1;
      }
    }
    .active {
      color: #fff;
    }
  }
}
</style>
