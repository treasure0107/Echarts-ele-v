<!--
 * @Author: JTune
 * @Description: 数据概览-设备故障排行组件
 * @FilePath: \centralized-control-sys-web\src\views\dataOverview\components\WindPowePrediction.vue
-->

<template>
  <div class="chart-wrap-container">
    <div class="chart-content">
      <div
        class="fill-h"
        id="windPowePrediction"
      ></div>
    </div>
  </div>
</template>

<script>
import { splitStr } from '@/utils/utils';
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
      xAxisData: [],
      seriesData1: [],
      seriesData2: []
    };
  },
  computed: {},
  watch: {
    'list': {
      handler: function (newValue, oldValue) {
        this.xAxisData = [];
        this.seriesData1 = [];
        this.seriesData2 = [];
        newValue && newValue.length && newValue.map((item, index) => {
          item.time = splitStr(item.periodTime);
          this.xAxisData.push(item.time);
          this.seriesData1.push(item.realTimeWindPower);
          this.seriesData2.push(item.predictedWindPower);
        });
        this.loadChart();
      },
      deep: true
    }
  },
  created() { },
  mounted() { },
  methods: {
    loadChart() {
      const myChart = this.$echarts.init(document.getElementById('windPowePrediction'));
      const chartOption = {
        title: {
          text: '单位：（MW）',
          x: '40',
          y: '0',
          zlevel: 6,
          textStyle: {
            color: '#808080', // 颜色
            fontStyle: 'Arial', // 风格
            fontWeight: 'normal', // 粗细
            fontFamily: 'Microsoft yahei', // 字体
            fontSize: 12, // 大小
            align: 'center' // 水平对齐
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'line', // 默认为直线，可选为：'line' | 'shadow' cross
            label: {
              backgroundColor: '#6a7985'
            }
          }
          // formatter: `风功率预测说明`
        },
        color: ['#00A0E9', '#22CCE2'],
        grid: {
          left: '3%',
          right: '4%',
          top: '13%',
          bottom: '0',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.xAxisData,
          lineStyle: {
            color: '#808080'
          },
          axisLine: {
            lineStyle: {
              color: '#808080'
            },
            show: false
          },
          axisLabel: {
            margin: 12,
            fontSize: '12',
            textStyle: {
              color: '#808080'
            },
            interval: 6
          },
          axisTick: {
            lineStyle: { color: '#808080' },
            show: false // 坐标刻度颜色
          }
        },
        yAxis: {
          type: 'value',
          splitLine: {
            lineStyle: {
              color: '#F4F4F4'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#808080'
            },
            show: false
          },
          axisLabel: {
            margin: 10,
            fontSize: '12',
            textStyle: {
              color: '#808080'
            }
          },
          axisTick: {
            lineStyle: { color: '#808080' }, // 坐标刻度颜色
            show: false // 坐标刻度颜色
          }
        },
        series: [{
          name: '实时功率',
          data: this.seriesData1,
          type: 'line',
          // symbol: 'none', // 这句就是去掉点的
          symbolSize: 6,
          areaStyle: {
            color: '#00A0E9', // 改变区域颜色
            opacity: 0.3
          },
          lineStyle: {
            color: '#00A0E9'
          }
        }, {
          name: '预测功率',
          data: this.seriesData2,
          type: 'line',
          // symbol: 'none', // 这句就是去掉点的
          symbolSize: 6,
          areaStyle: {
            color: '#22CCE2', // 改变区域颜色
            opacity: 0.3
          },
          lineStyle: {
            color: '#22CCE2'
          }
        }]
      };
      myChart.setOption(chartOption);
      setTimeout(() => {
        window.onresize = () => {
          myChart.resize();
        };
      }, 200);
    }
  }
};
</script>

<style scoped lang="scss">
// chart样式
.chart-wrap-container {
  width: 100%;
  // height: 310px;
  height: calc(100% - 60px);
  padding: 10px;
  // position: absolute;
  background-size: 100% 100%;
  box-sizing: border-box;
  .chart-content {
    height: 100%;
  }
  .fill-h {
    width: 100%;
    height: 100%;
    min-height: 100%;
  }
}
</style>
