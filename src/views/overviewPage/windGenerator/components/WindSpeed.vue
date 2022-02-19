<!--
 * @Descripttion:风速
 * @Author: JTune
 * @Date: 2021-01-07 16:09:46
-->
<template>
  <div class="wind-speed-container">
    <ul>
      <li class="wind-speed-list fl">
        <div
          :color="['#164F76', '#164F76']"
          backgroundColor="#060c23"
        >
          <!-- <dv-charts :option="option" /> -->
          <div
            id="cabinAngle"
            class="chart-container"
          ></div>
          <div class="item-name">{{labelTit.name1}}</div>
        </div>
      </li>
      <li class="wind-speed-list fl">
        <div
          :color="['#164F76', '#164F76']"
          backgroundColor="#060c23"
        >
          <!-- <dv-charts :option="option" /> -->
          <div
            id="lanAngle"
            class="chart-container"
          ></div>
          <el-tooltip
            class="item"
            effect="dark"
            :content="labelTit.name2"
            placement="top"
            popper-class="group-tooltip"
          >
            <div class="item-name text-ellipsis">{{labelTit.name2}}</div>
          </el-tooltip>
        </div>
      </li>
      <li class="wind-speed-list fl">
        <div
          :color="['#164F76', '#164F76']"
          backgroundColor="#060c23"
        >
          <!-- <dv-charts :option="option" /> -->
          <div
            id="axisWindAngle"
            class="chart-container"
          ></div>
          <div class="item-name">{{labelTit.name3}}</div>
        </div>
      </li>
      <li class="wind-speed-list fl">
        <div
          :color="['#164F76', '#164F76']"
          backgroundColor="#060c23"
        >
          <!-- <dv-charts :option="option" /> -->
          <div
            id="gearInletOilAngle"
            class="chart-container"
          ></div>
          <div class="item-name">{{labelTit.name4}}</div>
        </div>
      </li>
      <li class="wind-speed-list fl">
        <div
          :color="['#164F76', '#164F76']"
          backgroundColor="#060c23"
        >
          <!-- <dv-charts :option="option" /> -->
          <div
            id="gearFilterOilAngle"
            class="chart-container"
          ></div>
          <div class="item-name ">{{labelTit.name5}}</div>
        </div>
      </li>
      <li class="wind-speed-list fl">
        <div
          :color="['#164F76', '#164F76']"
          backgroundColor="#060c23"
        >
          <!-- <dv-charts :option="option" /> -->
          <div
            id="gearOilLevelAngle"
            class="chart-container"
          ></div>
          <div class="item-name ">{{labelTit.name6}}</div>
        </div>
      </li>
      <li class="wind-speed-list fl">
        <div
          :color="['#164F76', '#164F76']"
          backgroundColor="#060c23"
        >
          <div
            id="hubTem"
            class="chart-container"
          ></div>
          <div class="item-name ">{{labelTit.name7}}</div>
          <!-- <div class="pd-10 box-sizing text-center">
            <dv-water-level-pond
              :config="hubTem"
              style="width:136px;height:100px"
              id="hubTem"
            />
            <div class="level-name ">轮毂内温度</div>
          </div> -->
        </div>
      </li>
      <li class="wind-speed-list fl">
        <div
          :color="['#164F76', '#164F76']"
          backgroundColor="#060c23"
        >
          <div
            id="conTem"
            class="chart-container"
          ></div>
          <div class="item-name ">{{labelTit.name8}}</div>
          <!-- <div class="pd-10 box-sizing text-center">
            <dv-water-level-pond
              :config="conTem"
              style="width:136px;height:100px"
            />
            <div class="level-name ">机舱控制柜内温度</div>
          </div> -->
        </div>
      </li>
      <li class="wind-speed-list fl">
        <div
          :color="['#164F76', '#164F76']"
          backgroundColor="#060c23"
        >
          <div
            id="oilTem"
            class="chart-container"
          ></div>
          <div class="item-name ">{{labelTit.name9}}</div>
          <!--  <div class="pd-10 box-sizing text-center">
            <dv-water-level-pond
              :config="oilTem"
              style="width:136px;height:100px"
            />
            <div class="level-name ">齿轮箱油路入口温度</div>
          </div> -->
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: '',
  components: {},
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      hubTem: {
        data: [33],
        formatter: '{value}℃'
      },
      conTem: {
        data: [66],
        formatter: '{value}℃'
      },
      oilTem: {
        data: [99],
        formatter: '{value}℃'
      },
      angleList: [{ value: 0, name: '' }, { value: 0, name: '' }, { value: 0, name: '' }],
      oilList: [{ value: 0, name: '' }, { value: 0, name: '' }, { value: 0, name: '' }],
      temList: [{ value: 0, name: '' }, { value: 0, name: '' }, { value: 0, name: '' }],
      labelTit: {
        name1: '',
        name2: '',
        name3: '',
        name4: '',
        name5: '',
        name6: '',
        name7: '',
        name8: '',
        name9: ''
      }
    };
  },
  computed: {},
  watch: {
    'list': {
      handler: function (newValue, oldValue) {
        newValue && newValue.length && newValue.map((item, index) => {
          if (item.listOrder == 1) {
            this.angleList = item.pointDetails;
            this.labelTit.name1 = this.angleList[0].name;
            this.labelTit.name2 = this.angleList[1].name;
            this.labelTit.name3 = this.angleList[2].name;
          }
          if (item.listOrder == 2) {
            this.oilList = item.pointDetails;
            this.labelTit.name4 = this.oilList[0].name;
            this.labelTit.name5 = this.oilList[1].name;
            this.labelTit.name6 = this.oilList[2].name;
          }
          if (item.listOrder == 3) {
            this.temList = item.pointDetails;
            this.labelTit.name7 = this.temList[0].name;
            this.labelTit.name8 = this.temList[1].name;
            this.labelTit.name9 = this.temList[2].name;
          }
          setTimeout(() => {
            this.init();
          }, 100);
        });
      },
      deep: true
    }
  },
  created() { },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      // this.loadChartCabinAngle();
      // this.loadChartLanAngle();
      // this.loadChartAxisWindAngle();
      // this.loadChartGearInletOilAngle();
      // this.loadChartGearFilterOilAngle();
      // this.loadChartGearOilLevelAngle();
      // this.loadChartHubTem();
      // this.loadChartConTem();
      // this.loadChartOilTem();
      this.initChart('cabinAngle', 0, 300, this.angleList[0].value, '℃'); // 齿轮箱油路入口温度
      this.initChart('lanAngle', 0, 300, this.angleList[1].value, '℃');// 齿轮箱高速轴驱动端轴承温度
      this.initChart('axisWindAngle', -20, 75, this.angleList[2].value, '℃');// 齿轮箱油池温度
      this.initChart('gearInletOilAngle', 0, 300, this.oilList[0].value);// 齿轮箱油位
      this.initChart('gearFilterOilAngle', -40, 65, this.oilList[1].value, '℃');// 主轴承温度
      this.initChart('gearOilLevelAngle', 0, 1, this.oilList[2].value);// 液压站油位
      this.initChart('hubTem', 480, 750, this.temList[0].value, 'V');// AB线电压
      this.initChart('conTem', 0, 4, this.temList[1].value, 'kA');// 网侧L1相电流
      this.initChart('oilTem', 47.5, 52.5, this.temList[2].value, 'Hz');// 网侧频率
    },
    initChart(id, min, max, val, unit = '') {
      const myChart = this.$echarts.init(document.getElementById(id));
      const chartOption = {
        series: [{
          center: ['50%', '50%'],
          number: [0, '50%'],
          type: 'gauge',
          splitNumber: 5,
          // radius: '69%',
          min: -40,
          max: 180,
          axisLine: {
            lineStyle: {
              width: 10,
              color: [
                [-40, '#33DEC4'],
                [1, '#33DEC4']
              ]
            }
          },
          pointer: {
            width: 3,
            length: '60%',
            itemStyle: {
              color: 'auto'
            }
          },
          axisTick: {
            distance: -30,
            length: 3,
            splitNumber: 1,
            lineStyle: {
              color: '#fff',
              width: 1
            }
          },
          splitLine: {
            distance: 30,
            length: 9,
            lineStyle: {
              color: '#fff',
              width: 1
            }
          },
          axisLabel: {
            color: 'auto',
            distance: 3,
            fontSize: 10
          },
          detail: {
            valueAnimation: true,
            formatter: '{value}' + ` ${unit}`,
            color: 'auto',
            fontSize: 12,
            width: '60%',
            offsetCenter: [0, '90%']
          },
          data: [{
            // value: val
          }]
        }]
      };
      chartOption.series[0].min = min;
      chartOption.series[0].max = max;
      chartOption.series[0].data[0].value = val;
      // if (min < 0) {
      //   chartOption.series[0].axisLine.lineStyle.color[0][0] = 0;
      // } else {
      //   chartOption.series[0].axisLine.lineStyle.color[0][0] = min;
      // }
      chartOption.series[0].axisLine.lineStyle.color[0][0] = min;
      // chartOption.series[0].axisLine.lineStyle.color[0][1] = '#fff';
      this.detectionData(id, chartOption, val);
      myChart.setOption(chartOption);
    },
    detectionData(id, chartOption, val) {
      // if (id == 'cabinAngle') {
      //   chartOption.series[0].axisLine.lineStyle.color[0][1] = '#33DEC4';
      // }
      if (id == 'lanAngle') {
        if (val >= 90) {
          chartOption.series[0].axisLine.lineStyle.color[0][1] = '#ff3d57';
        }
      }
      // 齿轮箱油池温度
      if (id == 'axisWindAngle') {
        // || val < 5
        if (val > 70) {
          chartOption.series[0].axisLine.lineStyle.color[0][1] = '#fb9602';
        }
        if (val > 75 || val < -20) {
          chartOption.series[0].axisLine.lineStyle.color[0][1] = '#ff3d57';
        }
      }
      // 主轴承温度
      if (id == 'gearFilterOilAngle') {
        if (val > 60 || val < -30) {
          chartOption.series[0].axisLine.lineStyle.color[0][1] = '#fb9602';
        }
        if (val > 65 || val < -40) {
          chartOption.series[0].axisLine.lineStyle.color[0][1] = '#ff3d57';
        }
      }

      if (id == 'oilTem') {
        if (val > 50.5 || val < 49.5) {
          chartOption.series[0].axisLine.lineStyle.color[0][1] = '#fb9602';
        }
        if (val > 51 || val < 48) {
          chartOption.series[0].axisLine.lineStyle.color[0][1] = '#ff3d57';
        }
      }
    },
    // 齿轮箱油路入口温度
    loadChartCabinAngle() {
      const myChart = this.$echarts.init(document.getElementById('cabinAngle'));
      // [0.2, '#18ABFE'],
      // [0.4, '#835EFD'],
      // [0.6, '#22CCE2'],
      // [0.8, '#5EFDAD'],
      // [1, '#FF3D57']
      const chartOption = {
        series: [{
          type: 'gauge',
          splitNumber: 5,
          min: 0,
          max: 200,
          axisLine: {
            lineStyle: {
              width: 10,
              color: [
                [0, '#22CCE2'],
                [1, '#22CCE2']
              ]
            }
          },
          pointer: {
            width: 3,
            length: '60%',
            itemStyle: {
              color: 'auto'
            }
          },
          axisTick: {
            distance: -30,
            length: 3,
            splitNumber: 1,
            lineStyle: {
              color: '#fff',
              width: 1
            }
          },
          splitLine: {
            distance: 30,
            length: 9,
            lineStyle: {
              color: '#fff',
              width: 1
            }
          },
          axisLabel: {
            color: 'auto',
            distance: 3,
            fontSize: 10
          },
          detail: {
            valueAnimation: true,
            formatter: '{value} ℃',
            color: 'auto',
            fontSize: 12,
            width: '60%',
            offsetCenter: [0, '90%']
          },
          data: [{
            value: this.angleList[0].value
          }]
        }]
      };
      // 33DEC4 ff3d57
      // chartOption.series[0].axisLine.lineStyle.color[0][0] = this.angleList[0].value;
      // chartOption.series[0].axisLine.lineStyle.color[0][1] = '#ff3d57';
      myChart.setOption(chartOption);
    },
    // 齿轮箱高速轴驱动端轴承温度
    loadChartLanAngle() {
      const myChart = this.$echarts.init(document.getElementById('lanAngle'));
      const chartOption = {
        series: [{
          type: 'gauge',
          splitNumber: 6,
          min: 0,
          max: 180,
          axisLine: {
            lineStyle: {
              width: 10,
              color: [
                [0, '#22CCE2'],
                [1, '#22CCE2']
              ]
            }
          },
          pointer: {
            width: 3,
            length: '60%',
            itemStyle: {
              color: 'auto'
            }
          },
          axisTick: {
            distance: -30,
            length: 3,
            splitNumber: 1,
            lineStyle: {
              color: '#fff',
              width: 1
            }
          },
          splitLine: {
            distance: -30,
            length: 10,
            lineStyle: {
              color: '#fff',
              width: 1
            }
          },
          axisLabel: {
            color: 'auto',
            distance: 3,
            fontSize: 10
          },
          detail: {
            valueAnimation: true,
            formatter: '{value} ℃',
            color: 'auto',
            fontSize: 12,
            width: '60%',
            offsetCenter: [0, '90%']
          },
          data: [{
            value: this.angleList[1].value
          }]
        }]
      };
      myChart.setOption(chartOption);
    },
    // 齿轮箱油池温度
    loadChartAxisWindAngle() {
      const myChart = this.$echarts.init(document.getElementById('axisWindAngle'));
      const chartOption = {
        series: [{
          type: 'gauge',
          splitNumber: 5,
          min: -20,
          max: 75,
          axisLine: {
            lineStyle: {
              width: 10,
              color: [
                [0, '#22CCE2'],
                [1, '#22CCE2']
              ]
            }
          },
          pointer: {
            width: 3,
            length: '60%',
            itemStyle: {
              color: 'auto'
            }
          },
          axisTick: {
            distance: -30,
            length: 3,
            splitNumber: 1,
            lineStyle: {
              color: '#fff',
              width: 1
            }
          },
          splitLine: {
            distance: -30,
            length: 10,
            lineStyle: {
              color: '#fff',
              width: 1
            }
          },
          axisLabel: {
            color: 'auto',
            distance: 3,
            fontSize: 10
          },
          detail: {
            valueAnimation: true,
            formatter: '{value} ℃',
            color: 'auto',
            fontSize: 12,
            width: '60%',
            offsetCenter: [0, '90%']
          },
          data: [{
            value: this.angleList[2].value
          }]
        }]
      };
      myChart.setOption(chartOption);
    },
    // 齿轮箱油路入口油压
    loadChartGearInletOilAngle() {
      const myChart = this.$echarts.init(document.getElementById('gearInletOilAngle'));
      const chartOption = {
        series: [{
          type: 'gauge',
          splitNumber: 6,
          min: 0,
          max: 180,
          axisLine: {
            lineStyle: {
              width: 10,
              color: [
                [0, '#33DEC4'],
                [1, '#33DEC4']
              ]
            }
          },
          pointer: {
            width: 3,
            length: '60%',
            itemStyle: {
              color: 'auto'
            }
          },
          axisTick: {
            distance: -30,
            length: 3,
            splitNumber: 1,
            lineStyle: {
              color: '#fff',
              width: 1
            }
          },
          splitLine: {
            distance: -30,
            length: 10,
            lineStyle: {
              color: '#fff',
              width: 1
            }
          },
          axisLabel: {
            color: 'auto',
            distance: 3,
            fontSize: 10
          },
          detail: {
            valueAnimation: true,
            formatter: '{value} ℃',
            color: 'auto',
            fontSize: 12,
            width: '60%',
            offsetCenter: [0, '90%']
          },
          data: [{
            value: this.oilList[0].value
          }]
        }]
      };
      myChart.setOption(chartOption);
    },
    // 齿轮箱油路滤网前油压
    loadChartGearFilterOilAngle() {
      const myChart = this.$echarts.init(document.getElementById('gearFilterOilAngle'));
      const chartOption = {
        series: [{
          type: 'gauge',
          splitNumber: 5,
          min: -40,
          max: 65,
          axisLine: {
            lineStyle: {
              width: 10,
              color: [
                [0, '#18ABFE'],
                [1, '#18ABFE']
              ]
            }
          },
          pointer: {
            width: 3,
            length: '60%',
            itemStyle: {
              color: 'auto'
            }
          },
          axisTick: {
            distance: -30,
            length: 3,
            splitNumber: 1,
            lineStyle: {
              color: '#fff',
              width: 1
            }
          },
          splitLine: {
            distance: -30,
            length: 10,
            lineStyle: {
              color: '#fff',
              width: 1
            }
          },
          axisLabel: {
            color: 'auto',
            distance: 3,
            fontSize: 10
          },
          detail: {
            valueAnimation: true,
            formatter: '{value} ℃',
            color: 'auto',
            fontSize: 12,
            width: '60%',
            offsetCenter: [0, '90%']
          },
          data: [{
            value: this.oilList[1].value
          }]
        }]
      };
      myChart.setOption(chartOption);
    },
    // 齿轮箱油位
    loadChartGearOilLevelAngle() {
      const myChart = this.$echarts.init(document.getElementById('gearOilLevelAngle'));
      const chartOption = {
        series: [{
          type: 'gauge',
          splitNumber: 5,
          min: 0,
          max: 1,
          axisLine: {
            lineStyle: {
              width: 10,
              color: [
                [0, '#18ABFE'],
                [1, '#18ABFE']
              ]
            }
          },
          pointer: {
            width: 3,
            length: '60%',
            itemStyle: {
              color: 'auto'
            }
          },
          axisTick: {
            distance: -30,
            length: 3,
            splitNumber: 1,
            lineStyle: {
              color: '#fff',
              width: 1
            }
          },
          splitLine: {
            distance: -30,
            length: 10,
            lineStyle: {
              color: '#fff',
              width: 1
            }
          },
          axisLabel: {
            color: 'auto',
            distance: 3,
            fontSize: 10
          },
          detail: {
            valueAnimation: true,
            formatter: '{value} ℃',
            color: 'auto',
            fontSize: 12,
            width: '60%',
            offsetCenter: [0, '90%']
          },
          data: [{
            value: this.oilList[2].value
          }]
        }]
      };
      myChart.setOption(chartOption);
    },
    // AB线电压
    loadChartHubTem() {
      const myChart = this.$echarts.init(document.getElementById('hubTem'));
      const chartOption = {
        series: [{
          type: 'gauge',
          splitNumber: 5,
          min: 480,
          max: 750,
          // startAngle: 200,
          // endAngle: -20,
          axisLine: {
            lineStyle: {
              width: 10,
              color: [
                [0, '#5EFDAD'],
                [1, '#5EFDAD']
              ]
            }
          },
          pointer: {
            width: 3,
            length: '60%',
            itemStyle: {
              color: 'auto'
            }
          },
          axisTick: {
            distance: -30,
            length: 3,
            splitNumber: 1,
            lineStyle: {
              color: '#fff',
              width: 1
            }
          },
          splitLine: {
            distance: 30,
            length: 9,
            lineStyle: {
              color: '#fff',
              width: 1
            }
          },
          axisLabel: {
            color: 'auto',
            distance: 3,
            fontSize: 10
          },
          detail: {
            valueAnimation: true,
            formatter: '{value} V',
            color: 'auto',
            fontSize: 12,
            width: '60%',
            offsetCenter: [0, '90%']
          },
          data: [{
            value: this.temList[0].value
          }]
        }]
      };
      myChart.setOption(chartOption);
    },
    // 网侧L1相电流
    loadChartConTem() {
      const myChart = this.$echarts.init(document.getElementById('conTem'));
      const chartOption = {
        series: [{
          type: 'gauge',
          splitNumber: 5,
          min: 0,
          max: 4,
          // startAngle: 200,
          // endAngle: -20,
          axisLine: {
            lineStyle: {
              width: 10,
              color: [
                [0, '#5EFDAD'],
                [1, '#5EFDAD']
              ]
            }
          },
          pointer: {
            width: 3,
            length: '60%',
            itemStyle: {
              color: 'auto'
            }
          },
          axisTick: {
            distance: -30,
            length: 3,
            splitNumber: 1,
            lineStyle: {
              color: '#fff',
              width: 1
            }
          },
          splitLine: {
            distance: 30,
            length: 9,
            lineStyle: {
              color: '#fff',
              width: 1
            }
          },
          axisLabel: {
            color: 'auto',
            distance: 3,
            fontSize: 10
          },
          detail: {
            valueAnimation: true,
            formatter: '{value} A',
            color: 'auto',
            fontSize: 12,
            width: '60%',
            offsetCenter: [0, '90%']
          },
          data: [{
            value: this.temList[1].value
          }]
        }]
      };
      myChart.setOption(chartOption);
    },
    // 网侧频率
    loadChartOilTem() {
      const myChart = this.$echarts.init(document.getElementById('oilTem'));
      const chartOption = {
        series: [{
          type: 'gauge',
          splitNumber: 5,
          min: 47.5,
          max: 52.5,
          // startAngle: 200,
          // endAngle: -20,
          axisLine: {
            lineStyle: {
              width: 10,
              color: [
                [0, '#5EFDAD'],
                [1, '#5EFDAD']
              ]
            }
          },
          pointer: {
            width: 3,
            length: '60%',
            itemStyle: {
              color: 'auto'
            }
          },
          axisTick: {
            distance: -30,
            length: 3,
            splitNumber: 1,
            lineStyle: {
              color: '#fff',
              width: 1
            }
          },
          splitLine: {
            distance: 30,
            length: 9,
            lineStyle: {
              color: '#fff',
              width: 1
            }
          },
          axisLabel: {
            color: 'auto',
            distance: 3,
            fontSize: 10
          },
          detail: {
            valueAnimation: true,
            formatter: '{value} Hz',
            color: 'auto',
            fontSize: 12,
            width: '60%',
            offsetCenter: [0, '90%']
          },
          data: [{
            value: this.temList[2].value
          }]
        }]
      };
      myChart.setOption(chartOption);
    }
  }
};
</script>

<style scoped lang="scss">
.wind-speed-container {
  width: 500px;
  height: 460px;
  position: absolute;
  left: 1020px;
  top: 430px;
  box-sizing: border-box;
  border-radius: 3px;
  .wind-speed-list {
    width: 160px;
    height: 151px;
    padding-top: 5px;
    background-color: rgb(6, 12, 35);
    box-shadow: rgb(22 79 118) 0px 0px 40px inset;
    border: 1px solid rgb(22, 79, 118);
    box-sizing: border-box;
    position: relative;
    margin-bottom: 3px;
    .item-name {
      width: 100%;
      font-size: 14px;
      position: absolute;
      top: 10px;
      left: 56%;
      transform: translate(-50%, -50%);
    }
    .level-name {
      font-size: 14px;
      margin-top: 10px;
    }
    .chart-container {
      width: 160px;
      height: 160px;
      padding-top: 3px;
    }
  }
}
</style>
