<!--
 * @Author: JTune
 * @Description: In User Settings Edit
 * @FilePath: \centralized-control-sys-web\src\views\overviewPage\windGenerator\components\GearCase.vue
-->

<template>
  <div class="gear-case-container">
    <div
      :color="['#164F76', '#164F76']"
      backgroundColor="#060c23"
    >
      <div
        id="gearCaseChart"
        class="chart-model"
      ></div>
      <div style="width:95%;height:2px;margin-left:10px; background-color: #3faacb;"></div>
      <div
        id="gearCaseChart2"
        class="chart-model"
      >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  components: {},
  props: {
    verticalVibrationNoFilter: {
      type: Array,
      default: () => []
    },
    verticalVibrationFilter: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      seriesData0: [],
      seriesData1: [],
      xAxisData0: [
        '01:00',
        '02:00',
        '03:00',
        '04:00',
        '05:00',
        '06:00',
        '07:00',
        '08:00',
        '09:00',
        '10:00',
        '11:00',
        '12:00',
        '13:00',
        '14:00',
        '15:00',
        '16:00',
        '17:00',
        '18:00',
        '19:00',
        '20:00',
        '21:00',
        '22:00',
        '23:00',
        '24:00'
      ],
      xAxisData1: [
        '01:00',
        '02:00',
        '03:00',
        '04:00',
        '05:00',
        '06:00',
        '07:00',
        '08:00',
        '09:00',
        '10:00',
        '11:00',
        '12:00',
        '13:00',
        '14:00',
        '15:00',
        '16:00',
        '17:00',
        '18:00',
        '19:00',
        '20:00',
        '21:00',
        '22:00',
        '23:00',
        '24:00'
      ]
    };
  },
  computed: {},
  watch: {
    'verticalVibrationNoFilter': {
      handler: function (newValue, oldValue) {
        this.xAxisData0 = [];
        this.seriesData0 = [];
        newValue && newValue.length && newValue.map((item, index) => {
          // this.xAxisData.push(`${item.periodTime.split(' ')[1]}${item.periodTime.split(' ')[2]}${item.periodTime.split(' ')[3]}`);
          this.xAxisData0.push(item.periodTime);
          this.seriesData0.push(item.data);
        });
        this.loadChart();
      },
      deep: true
    },
    'verticalVibrationFilter': {
      handler: function (newValue, oldValue) {
        this.xAxisData1 = [];
        this.seriesData1 = [];
        newValue && newValue.length && newValue.map((item, index) => {
          // this.xAxisData.push(`${item.periodTime.split(' ')[1]}${item.periodTime.split(' ')[2]}${item.periodTime.split(' ')[3]}`);
          this.xAxisData1.push(item.periodTime);
          this.seriesData1.push(item.data);
        });
        this.loadChart1();
      },
      deep: true
    }
  },
  created() { },
  mounted() {
    this.loadChart();
    this.loadChart1();
  },
  methods: {
    loadChart() {
      const myChart = this.$echarts.init(document.getElementById('gearCaseChart'));
      const chartOption = {
        title: {
          text: '机舱垂直方向振动（未滤波）',
          subtext: '单位：（m/s^2）',
          x: '30',
          y: '5',
          zlevel: 6,
          textStyle: {
            color: '#fff', // 颜色
            fontFamily: 'Microsoft yahei', // 字体
            fontSize: 14, // 大小
            align: 'center' // 水平对齐
          },
          subtextStyle: {
            color: '#fff', // 颜色
            fontFamily: 'Microsoft yahei', // 字体
            fontSize: 12, // 大小
            align: 'center' // 水平对齐
          }
        },
        color: ['#154880'],
        grid: {
          left: '20',
          right: '20',
          bottom: '10',
          containLabel: true
        },
        legend: {
          orient: 'horizontal',
          selectedMode: false,
          bottom: 0,
          left: 'center',
          icon: 'circle',
          itemWidth: 10,
          itemHeight: 10,
          show: false,
          textStyle: {
            color: '#fff'
          },
          data: ['发电量']
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'line' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.xAxisData0,
          lineStyle: {
            color: '#fff'
          },
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#fff'
            },
            show: false
          }
          // axisLabel: {
          //   color: '#fff',
          //   interval: 6
          // }
        },
        yAxis: {
          type: 'value',
          splitLine: {
            lineStyle: {
              color: '#0E2A5C'
            }
          },
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#fff'
            },
            show: false
          }
        },
        series: [
          {
            name: '机舱垂直方向振动（未滤波）',
            data: this.seriesData0,
            type: 'line',
            areaStyle: {},
            lineStyle: {
              color: '#18ABFE'
            }
          }
        ]
      };
      myChart.setOption(chartOption);
    },
    loadChart1() {
      const myChart = this.$echarts.init(document.getElementById('gearCaseChart2'));
      const chartOption = {
        title: {
          text: '机舱垂直方向振动（已滤波）',
          subtext: '单位：（m/s^2）',
          x: '30',
          y: '5',
          zlevel: 6,
          textStyle: {
            color: '#fff', // 颜色
            fontFamily: 'Microsoft yahei', // 字体
            fontSize: 14, // 大小
            align: 'center' // 水平对齐
          },
          subtextStyle: {
            color: '#fff', // 颜色
            fontFamily: 'Microsoft yahei', // 字体
            fontSize: 12, // 大小
            align: 'center' // 水平对齐
          }
        },
        color: ['#154880'],
        grid: {
          left: '20',
          right: '20',
          bottom: '10',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.xAxisData1,
          lineStyle: {
            color: '#fff'
          },
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#fff'
            },
            show: false
          }
        },
        yAxis: {
          type: 'value',
          splitLine: {
            lineStyle: {
              color: '#0E2A5C'
            }
          },
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#fff'
            },
            show: false
          }
        },
        series: [
          {
            name: '机舱垂直方向振动（已滤波）',
            data: this.seriesData1,
            type: 'line',
            areaStyle: {},
            lineStyle: {
              color: '#18ABFE'
            }
          }
        ]
      };
      myChart.setOption(chartOption);
    }
  }
};
</script>

<style scoped lang="scss">
.gear-case-container {
  width: 400px;
  height: 460px;
  position: absolute;
  left: 600px;
  top: 430px;
  box-shadow: #164f76 0px 0px 40px inset;
  border: 1px solid rgb(22, 79, 118);
  box-sizing: border-box;
  border-radius: 3px;
  .chart-model {
    width: 99%;
    height: 220px;
  }
}
</style>
