<!--
 * @Author: your name
 * @Description: In User Settings Edit
 * @FilePath: \centralized-control-sys-web\src\views\overviewPage\runCondition\new.vue
-->
<template>
  <div class="wind-con clearfix">
    <div class="con-left">
      <el-row :gutter="20">
        <el-col
          :span="8"
          :xs="10"
          :sm="6"
          :xl="4"
          v-for="item in list"
          :key="item.deviceId"
        >
          <div
            class="item-con"
            @click="handleLinkTo(item)"
          >
            <div class="img-fan">
              <div v-if="item.runningStatus==1">
                <img
                  v-if="item.windSpeed<3 || item.windSpeed>20 || item.power<=0"
                  src="@/assets/image/fan-r.png"
                  alt=""
                >
                <img
                  v-else
                  src="@/assets/image/fan-gif.gif"
                  alt=""
                >
              </div>
              <img
                v-else-if="item.runningStatus==2"
                src="@/assets/image/fan-s.png"
                alt=""
              >
              <img
                v-else-if="item.runningStatus==3"
                src="@/assets/image/fan-m.png"
                alt=""
              >
              <img
                v-else
                src="@/assets/image/fan-w.png"
                alt=""
              >
            </div>
            <div class="text-fan">
              <div class="t-p">编号：<span>{{item.deviceName}}</span></div>
              <!-- <p v-if="deviceState==2">
                检修状态：
                <span :class="[{'inProgress':item.fixProgress=='IN_PROGRESS'},{'progress':item.fixProgress=='FINISHED'}]">
                  {{item.fixTypeText}}{{item.fixProgressText}}
                </span>
              </p> -->
              <!-- <p>运行状态：
                <span
                  v-if="item.runningStatus==1"
                  style="color:#33DEC4;font-weight:bold;"
                >运行</span>
                <span
                  v-if="item.runningStatus==2"
                  style="color:#FFD868;font-weight:bold;"
                >检修</span>
                <span
                  v-if="item.runningStatus==3"
                  style="color:#FF3D57;font-weight:bold;"
                >故障</span>
                <span
                  v-if="item.runningStatus==4"
                  style="color:#FB9602;font-weight:bold;"
                >告警</span>
              </p> -->
              <div class="t-p">风速： <span class="t-i">{{item.windSpeed || 0}}</span> m/s</div>
              <div class="t-p">功率：<span class="t-i">{{item.power || 0}}</span> kW</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="con-right">
      <div class="wind-overview">
        <div class="tit">风电场概况</div>
        <ul>
          <li><span>装机容量</span><span>{{fanData.capacity}}</span></li>
          <li><span>装机总台数</span><span>{{fanData.total}}</span></li>
          <li><span>投入总台数</span><span>{{fanData.investmentTotal}}</span></li>
          <li><span>发电总台数</span><span>{{fanData.electricityGenerationTotal}}</span></li>
          <li><span>日发电量</span><span>{{fanData.dayGeneratingCapacity}}</span></li>
          <li><span>月发电量</span><span>{{fanData.monthGeneratingCapacity}}</span></li>
          <li><span>年发电量</span><span>{{fanData.yearGeneratingCapacity}}</span></li>
          <li><span>全场可利用率</span><span>{{fanData.fullAvailability}}</span></li>
          <li><span>平均风速</span><span>{{fanData.averageWindSpeed}}</span></li>
        </ul>
      </div>
      <div class="fan-b">
        <div class="tit">风机状态统计</div>
        <div class="fan-status">
          <div
            class="fill-h"
            id="fanStatusStatistics"
          ></div>
        </div>
        <ul class="device-state">
          <li>
            <div><span>运行:</span><span>{{queryFenData.fanRunCount || 0}}</span></div>
            <div><span>告警:</span><span>{{queryFenData.fanWarningCount || 0}}</span></div>
          </li>
          <li>
            <div><span>故障:</span><span>{{queryFenData.fanMalfunctionCount || 0}}</span></div>
            <div><span>检修:</span><span>{{queryFenData. fanMaintenanceCount || 0}}</span></div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import Api from '@/utils/api.js';
import { mapState } from 'vuex';
import { sendWebsocket, closeWebsocket } from '@/utils/webSocket.js';
import { wsUrl } from '@/config/env.js';
export default {
  name: '',
  components: {},
  data() {
    return {
      activeIdx: 1,
      deviceType: '1',
      deviceState: '',
      manufactor: '',
      checked: false,
      loading: false,
      pagination: {
        total: 0,
        start: 1,
        size: 1000
      },
      list: [],
      fanData: {},
      queryFenData: {
        fanRunCount: '',
        fanMaintenanceCount: '',
        fanMalfunctionCount: '',
        fanWarningCount: ''
      },
      faultOverviewData: {
        faultDuration: 10,
        faultCount: 3,
        lossOfElectricity: 4,
        warnCount: 1
      }
    };
  },
  computed: {
    ...mapState({
      powerPlantId: state => state.powerPlant.powerPlantId
    })
  },
  watch: {
    powerPlantId: function (val) {
      this.init();
      this.requstWs();
    }
  },
  created() {
  },
  mounted() {
    this.init();
    this.requstWs();
  },

  methods: {
    queryFanDataOverview() {
      const powerPlantId = this.powerPlantId;
      this.$axios.get(
        Api.overview.queryFanDataOverview + `/${powerPlantId}`,
        {},
        (res) => {
          if (res.isSuccess) {
            this.fanData = res.data;
          }
        }
      );
    },
    // 查询场站风机数据
    getQueryFenData() {
      const powerPlantId = this.powerPlantId;
      this.$axios.get(Api.overview.queryFenData + `/${powerPlantId}`, {}, (res) => {
        if (res.isSuccess) {
          this.queryFenData = res.data;
          this.loadChart();
        }
      });
    },
    loadChart() {
      const myChart = this.$echarts.init(document.getElementById('fanStatusStatistics'));
      const chartOption = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        grid: {
          left: 0
        },
        legend: {
          orient: 'horizontal',
          selectedMode: false,
          bottom: 0,
          left: 'center',
          itemWidth: 10,
          itemHeight: 10,
          textStyle: {
            color: '#333'
          },
          data: ['运行', '告警', '故障', '检修']
        },
        series: [
          {
            name: '风机状态统计',
            type: 'pie',
            radius: ['50%', '70%'],
            center: ['50%', '40%'],
            avoidLabelOverlap: false,
            hoverAnimation: false,
            color: ['#33DEC4', '#FB9602', '#FF3D57', '#FFD868', '#18ABFE'], // 修改颜色
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: false,
                fontSize: '16',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: this.queryFenData.fanRunCount || null, name: '运行' },
              { value: this.queryFenData.fanWarningCount || null, name: '告警' },
              { value: this.queryFenData.fanMalfunctionCount || null, name: '故障' },
              { value: this.queryFenData.fanMaintenanceCount || null, name: '检修' },
              { value: 0, name: '' }
            ]
          }
        ]
      };
      myChart.setOption(chartOption);
      setTimeout(() => {
        window.onresize = () => {
          myChart.resize();
        };
      }, 200);
    },
    // 查询站点风机的详情数据
    init() {
      this.getQueryFenData();
      this.queryFanDataOverview();
      this.tableData = [];
      this.loading = true;
      const data = {
        deviceType: '1',
        powerPlantId: this.powerPlantId,
        vendorName: this.manufactor,
        deviceState: '',
        start: this.pagination.start,
        size: this.pagination.size
      };
      this.$axios.post(Api.overview.queryFanDetail, data, (res) => {
        this.loading = false;
        if (res.isSuccess) {
          this.list = res.data.data;
          this.pagination.total = res.data.total;
        }
      });
    },
    handleLinkTo(row) {
      this.$router.push({ path: `/windGenerator/${row.deviceId}/${row.deviceCode}` });
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
      const postUrl = `${wsUrl}ws/windMachineList/${this.powerPlantId}`;
      const params = {};
      // 发起ws请求 ws:htpp;wss:https
      sendWebsocket(postUrl, params, this.wsMessage, this.wsError);
    },
    // 更新ws数据
    updateWsData(res) {
      const moduleWs = res.module;
      const dataWs = res.data;
      if (moduleWs) {
        this.list.forEach(item => {
          if (item.deviceId == moduleWs) {
            item.deviceCode = dataWs.deviceCode;
            item.deviceName = dataWs.deviceName;
            item.fixProgress = dataWs.fixProgress;
            item.fixProgressText = dataWs.fixProgressText;
            item.fixType = dataWs.fixType;
            item.fixTypeText = dataWs.fixTypeText;
            item.manufactorName = dataWs.manufactorName;
            item.runningStatus = dataWs.runningStatus;
            item.typeListOrder = dataWs.typeListOrder;
            item.typeName = dataWs.typeName;
            item.windSpeed = dataWs.windSpeed;
            item.power = dataWs.power;
          }
        });
      }
    },
    beforeDestroy() {
      // 页面销毁时关闭ws。因为有可能ws连接接收数据尚未完成，用户就跳转了页面
      // 在需要主动关闭ws的地方都可以调用该方法
      closeWebsocket();
    }
  }
};
</script>
<style scoped lang='scss'>
.wind-con {
  display: flex;
  min-height: 800px;
  .con-left {
    flex: 5.3;
    .item-con {
      min-width: 230px;
      height: 100px;
      margin-bottom: 16px;
      background: #fff;
      border: 1px solid #dcdfe4;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: flex-start;
      align-items: flex-start;
      align-content: flex-start;
      cursor: pointer;
      .img-fan {
        flex: 4;
        img {
          margin-top: 3px;
          width: 90px;
        }
      }
      .text-fan {
        font-size: 12px;
        color: #999;
        padding-top: 13px;
        flex: 6;
        .t-p {
          line-height: 16px;
          padding-bottom: 10px;
        }
        .t-i {
          font-size: 14px;
          font-weight: bold;
          color: #3350d4;
        }
        .inProgress {
          color: #ffa81f;
        }
        .progress {
          color: #4ddeff;
        }
      }
    }
  }
  .con-right {
    flex: 1;
    width: 230px;
    margin-left: 20px;
    padding: 20px 6px 10px;
    background-color: #fff;
    .tit {
      font-size: 14px;
      margin-left: 3px;
      color: #333;
      font-weight: bold;
    }
    .wind-overview {
      font-size: 13px;
      color: #323233;
      border-bottom: 1px solid #dcdfe4;
      ul {
        padding: 20px 10px;
        li {
          padding-bottom: 15px;
          display: flex;
          span:first-child {
            flex: 4;
          }
          span:last-child {
            flex: 3;
            font-weight: bold;
            color: #3350d4;
          }
        }
      }
    }
  }
  .fan-b {
    font-size: 14px;
    color: #323233;
    margin-top: 20px;
    .fan-status {
      height: 200px;
      .fill-h {
        height: 100%;
        min-height: 100%;
        margin-top: 30px;
        margin-left: 10px;
      }
    }
    .device-state {
      font-size: 14px;
      padding: 16px 10px;
      color: #999999;
      padding-left: 50px;
      li {
        padding-bottom: 10px;
        display: flex;
        > div {
          flex: 1;
          overflow: hidden;
          span:last-child {
            margin-left: 10px;
          }
        }
      }
    }
  }
}
</style>
