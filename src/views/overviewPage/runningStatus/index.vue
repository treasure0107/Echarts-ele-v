<!--
 * @Author: JTune
 * @Description: 数据概览-运行页面
 * @FilePath: \centralized-control-sys-web\src\views\overviewPage\runningStatus\index.vue
-->
<template>
  <div class="run-container">
    <!-- <el-button
      type="primary"
      class="wind-btn"
      @click="handleWind"
    >风机详情</el-button> -->
    <div class="main">
      <div class="con-left">
        <ul class="run-l list scroll-bar">
          <li
            v-for="(item, index) in tableData"
            :key="index"
            :class="active == index ? 'active' : ''"
            @click="handleDevice(index)"
            :title="item.deviceTypeName"
          >
            <span> {{ item.deviceTypeName }}</span>
            <span
              class="num warn"
              v-if="item.hasError"
            ></span>
            <span
              class="num maintenanc"
              v-if="!item.hasError&&item.hasWarning"
            ></span>

            <!-- <span
              v-if="item.isWindMachine"
              class="wind-icon"
              @click.stop="handleWind"
            >
              <img
                src="~@/assets/image/wind-icon.png"
                alt=""
              ></span> -->
          </li>
          <li
            class="btn-more"
            v-if="isMore"
            @click="handleMore"
          >更多</li>
        </ul>
        <ul class="run-c list scroll-bar">
          <li
            v-for="(item, index) in deviceNameList"
            :key="index"
            :class="codActive == index ? 'active-b' : ''"
            @click="handleCod(index, item.deviceCode,item.deviceId)"
            :title="item.deviceName"
          >
            <span> {{ item.deviceName }}</span>
            <span
              class="num"
              :class="{'warn':item.runningStatus==3,'maintenanc':item.runningStatus==4}"
            ></span>
          </li>
        </ul>
      </div>
      <div class="con-right">
        <!-- <div class="tit">设备参数</div> -->
        <div>
          <el-tabs
            v-model="activeName"
            @tab-click="handleClick"
          >
            <el-tab-pane
              label="遥测参数"
              name="1"
            >
              <TelemetryParams
                v-if="isTelemetry"
                :list="telemetryList"
              />
            </el-tab-pane>
            <el-tab-pane
              label="遥信参数"
              name="2"
            >
              <TelesignalisationParams
                v-if="isTelesignalisation"
                :list="telesignalisationList"
              />
            </el-tab-pane>
            <el-tab-pane
              label="遥脉参数"
              name="3"
            >
              <TelepulseParams
                v-if="isTelepulse"
                :list="telepulseList"
              />
            </el-tab-pane>
            <el-tab-pane
              label="故障报警记录"
              name="4"
            >
              <GeneratorModel
                v-show="failureWarn"
                :deviceId="deviceId"
              />
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import Api from '@/utils/api.js';
import { wsUrl } from '@/config/env.js';
import { sendWebsocket, closeWebsocket } from '@/utils/webSocket.js';
import { mapState } from 'vuex';
import TelemetryParams from './components/TelemetryParams';
import TelesignalisationParams from './components/TelesignalisationParams';
import TelepulseParams from './components/TelepulseParams';
import GeneratorModel from './components/GeneratorModel';
export default {
  name: '',
  components: { TelemetryParams, TelesignalisationParams, TelepulseParams, GeneratorModel },
  data() {
    return {
      activeName: '1',
      isTelemetry: true,
      isTelesignalisation: false,
      isTelepulse: false,
      failureWarn: false,
      deviceNameList: [],
      codList: [],
      tableData: [],
      tableList: [],
      active: 0,
      codActive: 0,
      loading: false,
      deviceTypeName: '',
      deviceCode: '',
      deviceId: '',
      telemetryList: [],
      telesignalisationList: [],
      telepulseList: [],
      isMore: true
    };
  },
  computed: {
    ...mapState({
      powerPlantId: (state) => state.powerPlant.powerPlantId
    })
  },
  watch: {
    powerPlantId: function (val) {
      this.queryDeviceData();
      this.requstWs();
    }
  },
  created() { },
  mounted() {
    this.queryDeviceData();
  },
  methods: {
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
    // 设备详情ws：/ws/device/{deviceCode}
    // module：telemetering遥测，telesignaling遥信
    requstWs() {
      // 防止用户多次连续点击发起请求，所以要先关闭上次的ws请求。
      closeWebsocket();
      // 跟后端协商，需要什么参数数据给后台
      const postUrl = `${wsUrl}ws/device/${this.deviceCode}`;
      const params = {};
      // 发起ws请求 ws:htpp;wss:https
      sendWebsocket(postUrl, params, this.wsMessage, this.wsError);
    },
    // 更新ws数据
    updateWsData(res) {
      // 解决切换socket拉取上一条数据问题
      if (res.deviceCode != this.deviceCode) return;
      const module = res.module;
      const data = res.data;
      switch (module) {
        // 遥测
        case 'telemetering':
          data.forEach(item1 => {
            let flag = false;
            this.telemetryList.forEach(item2 => {
              if (item1.pointItemCodeName === item2.pointItemCodeName) {
                item2.pointItemCodeValue = item1.pointItemCodeValue;
              }
            });
            flag = this.telemetryList.some(item2 => {
              return item1.pointItemCodeName === item2.pointItemCodeName;
            });
            if (!flag) {
              this.telemetryList.push(item1);
            }
          });
          break;
        // 遥信
        case 'telesignaling':
          data.forEach(item1 => {
            let flag = false;
            this.telesignalisationList.forEach(item2 => {
              if (item1.pointItemCodeName === item2.pointItemCodeName) {
                item2.pointItemCodeValue = item1.pointItemCodeValue;
              }
            });
            flag = this.telesignalisationList.some(item2 => {
              return item1.pointItemCodeName === item2.pointItemCodeName;
            });
            if (!flag) {
              this.telesignalisationList.push(item1);
            }
          });
          break;
        // 遥脉
        case 'telepulse':
          data.forEach(item1 => {
            let flag = false;
            this.telepulseList.forEach(item2 => {
              if (item1.pointItemCodeName === item2.pointItemCodeName) {
                item2.pointItemCodeValue = item1.pointItemCodeValue;
              }
            });
            flag = this.telepulseList.some(item2 => {
              return item1.pointItemCodeName === item2.pointItemCodeName;
            });
            if (!flag) {
              this.telepulseList.push(item1);
            }
          });
          break;
      }
    },
    beforeDestroy() {
      // 页面销毁时关闭ws。因为有可能ws连接接收数据尚未完成，用户就跳转了页面
      // 在需要主动关闭ws的地方都可以调用该方法
      closeWebsocket();
    },
    // 查询升压站设备二级菜单树
    queryDeviceData() {
      this.tableData = [];
      // this.loading = true;
      const data = {};
      this.$axios.get(Api.overview.queryDeviceData + `?powerPlantId=${this.powerPlantId}`, data, (res) => {
        // this.loading = false;
        if (res.isSuccess) {
          if (res.data.length) {
            const data = res.data.filter(item => {
              if (!item.isWindMachine) return item;
            });
            this.tableList = data;
            this.tableData = data.slice(0, 7);
            if (this.tableList.length > 7) {
              this.isMore = true;
            } else {
              this.isMore = false;
            }
            this.deviceNameList = data[0].deviceDataVoList;
            this.deviceCode = this.deviceNameList[0].deviceCode;
            this.deviceId = this.deviceNameList[0].deviceId;
            this.queryByDeviceCodeTelemetering();
            this.queryByDeviceCodeTelesignaling();
            this.queryByRealTimeDatasDeviceTelepulse();
            this.requstWs();
          }
        }
      });
    },
    handleMore() {
      this.tableData = this.tableList;
      this.isMore = false;
    },
    // 根据设备编码查询遥测点项数据
    queryByDeviceCodeTelemetering() {
      const deviceCode = this.deviceCode;
      this.$axios.get(
        Api.overview.queryByDeviceCodeTelemetering +
        `/${deviceCode}`,
        {},
        (res) => {
          if (res.isSuccess) {
            this.telemetryList = res.data.dataList;
          }
        }
      );
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
        Api.overview.queryByRealTimeDatasDeviceTelepulse +
        `/${deviceCode}`,
        {},
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
    handleWind() {
      // this.$router.push({ path: `/windGenerator/${row.deviceId}/${row.deviceCode}` });
      this.$router.push({ path: `/windGenerator/1/1` });
    },
    handleReset() {
      this.isTelemetry = false;
      this.isTelesignalisation = false;
      this.isTelepulse = false;
      this.failureWarn = false;
    },
    handleClick(tab, event) {
      this.handleReset();
      if (tab.name == '1') {
        this.isTelemetry = true;
      } else if (tab.name == '2') {
        this.isTelesignalisation = true;
      } else if (tab.name == '3') {
        this.isTelepulse = true;
      } else if (tab.name == '4') {
        this.failureWarn = true;
      }
      // 滚动到头部
      document.getElementsByClassName('el-tabs__content')[0].scrollTo(0, 0);
    },
    // 一级
    handleDevice(index) {
      this.active = index;
      this.codActive = 0;
      this.activeName = '1';
      this.isTelemetry = true;
      this.isTelesignalisation = false;
      this.deviceNameList = this.tableData[index].deviceDataVoList;
      this.deviceCode = this.deviceNameList[0].deviceCode;
      this.deviceId = this.deviceNameList[0].deviceId;
      this.queryByDeviceCodeTelemetering();
      this.queryByDeviceCodeTelesignaling();
      this.queryByRealTimeDatasDeviceTelepulse();
      this.requstWs();
    },
    // 二级
    handleCod(index, deviceCode, deviceId) {
      this.codActive = index;
      this.deviceCode = deviceCode;
      this.deviceId = deviceId;
      this.activeName = '1';
      this.isTelemetry = true;
      this.isTelesignalisation = false;
      this.queryByDeviceCodeTelemetering();
      this.queryByDeviceCodeTelesignaling();
      this.queryByRealTimeDatasDeviceTelepulse();
      this.requstWs();
    }
  }
};
</script>

<style scoped lang="scss">
.run-container {
  width: 100%;
  color: #333;
  font-family: Microsoft YaHei;
  background-color: #fff;
  position: relative;
  .wind-btn {
    position: absolute;
    top: 10px;
    right: 30px;
    z-index: 10000000;
  }
  .main {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: flex-start;
    align-content: flex-start;
    width: 100%;
    background-color: #fff;
    min-height: calc(100vh - 160px);
    border: 1px solid #dcdfe4;
    .con-left {
      width: 390px;
      flex-basis: 390px;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: flex-start;
      align-items: flex-start;
      align-content: flex-start;
      background-color: #fff;
      box-sizing: border-box;
      overflow: hidden;
      .list {
        width: 300px;
        flex: 1;
        height: calc(100vh - 160px);
        overflow-y: auto;
        font-size: 14px;
        box-sizing: border-box;
        li {
          position: relative;
          padding: 10px 10px 10px 15px;
          cursor: pointer;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          .num {
            position: absolute;
            top: 4px;
            left: 8px;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            color: #fff;
            &.maintenanc {
              background-color: #fb9602;
            }
            &.warn {
              background-color: #ff3d57;
            }
          }
          &.btn-more {
            color: #1890ff;
          }
        }
      }
      .run-l {
        border-right: 1px solid #dcdfe4;
        li {
          &.active {
            background: #e4e5e6;
          }
          position: relative;
          .wind-icon {
            position: absolute;
            right: 10px;
            top: 0px;
            img {
              padding: 9px 10px;
              width: 18px;
              height: 18px;
            }
            // background: url(~@/assets/image/wind-icon.png) center no-repeat;
          }
        }
        li:hover {
          background: #e4e5e6;
          .wind-icon {
            background-color: #cdcdcd;
          }
        }
      }
      .run-c {
        border-right: 1px solid #dcdfe4;
        li {
          width: 300px;
          &.active-b {
            border-left: 4px solid #3350d4;
            background: #f4f4f4;
          }
        }
        li:hover {
          background: #f4f4f4;
        }
      }
    }
    .con-right {
      flex: 1;
      padding: 5px 20px;
      background-color: #fff;
      height: calc(100vh - 230px);
      overflow: hidden;
      // overflow-y: auto;
      // .tit {
      //   font-size: 14px;
      //   height: 19px;
      //   font-weight: 800;
      //   line-height: 19px;
      //   color: #333333;
      // }
    }
  }
}
::v-deep .params-con {
  font-size: 14px;
  font-weight: 400;
  padding: 20px;
  height: 100%;
  // overflow-y: auto;
  color: #999999;
  .el-row {
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    margin-bottom: 3px;
    border-radius: 4px;
  }
  .grid-content {
    height: 36px;
    min-height: 36px;

    .g-tit {
      color: #acb1c9;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .g-txt {
      font-weight: bold;
      color: #3350d4;
    }
  }
  .status {
    display: inline-block;
    width: 8px;
    height: 8px;
    margin-left: 3px;
    border-radius: 50%;
    &.run-status {
      background-color: #22cce2;
    }
    &.warn-status {
      background-color: #ff3d57;
    }
    &.recondition-status {
      background-color: #fdbf5e;
    }
  }
}
::v-deep .el-tabs__nav {
  .el-tabs__item.is-active {
    color: #3350d4;
  }
  .el-tabs__active-bar {
    background-color: #3350d4;
  }
}
::v-deep .el-tabs__content {
  height: calc(100vh - 280px);
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 13px !important;
  }
  &::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: rgba(0, 0, 0, 0.3);
}
}

// 滚动条样式
.scroll-bar::-webkit-scrollbar {
  width: 6px;
  height: 13px;
}
.scroll-bar::-webkit-scrollbar-track {
  background: rgb(239, 239, 239);
  border-radius: 2px;
}
.scroll-bar::-webkit-scrollbar-thumb {
  background: #bfbfbf;
  border-radius: 10px;
}
.scroll-bar::-webkit-scrollbar-thumb:hover {
  background: #333;
}
.scroll-bar::-webkit-scrollbar-corner {
  background: #179a16;
}
</style>
