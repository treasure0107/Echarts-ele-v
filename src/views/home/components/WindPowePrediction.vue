<!--
 * @Descripttion:风功率预测
-->
<template>
  <div class="common-chart-wrap-container">
    <Header
      title="风功率预测"
      :link-opt="linkOpt"
    />
    <div class="common-chart-content">
      <div class="prediction-unit fr">单位：（MW）</div>
      <div
        class="wind-powe-prediction-chart fill-h"
        id="windPowePrediction"
      ></div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/home/Header';
import { splitStr } from '@/utils/utils';
export default {
  name: '',
  components: { Header },
  props: {
    item: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      linkOpt: {
        path: '/windPowePrediction',
        params: {}
      },
      xAxisData: [],
      seriesData1: [],
      seriesData2: []
    };
  },
  computed: {},
  watch: {
    'item': {
      handler: function (newValue, oldValue) {
        this.xAxisData = [];
        this.seriesData1 = [];
        this.seriesData2 = [];
        newValue.forEach(item => {
          this.xAxisData.push(splitStr(item.periodTime));
          this.seriesData1.push(item.realTimeWindPower);
          this.seriesData2.push(item.predictedWindPower);
        });
        this.loadChart();
      },
      deep: true
    }
  },
  created() { },
  mounted() {
    this.loadChart();
  },
  methods: {
    loadChart() {
      const myChart = this.$echarts.init(document.getElementById('windPowePrediction'));
      const chartOption = {
        color: ['#154880', 'rgba(34, 204, 226, 0.5)'],
        grid: {
          left: '3%',
          right: '4%',
          top: '5%',
          bottom: '0',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis'
          // formatter: `风功率:{c}`
          // axisPointer: {
          //   type: 'cross',
          //   label: {
          //     backgroundColor: '#6a7985'
          //   }
          // }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.xAxisData,
          lineStyle: {
            color: '#fff'
          },
          axisLabel: {
            interval: 6
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
            name: '实时功率',
            data: this.seriesData1,
            type: 'line',
            // symbol: 'none', // 这句就是去掉点的
            areaStyle: {},
            lineStyle: {
              color: '#18ABFE'
            }
          },
          {
            name: '预测功率',
            data: this.seriesData2,
            type: 'line',
            // symbol: 'none', // 这句就是去掉点的
            areaStyle: {},
            lineStyle: {
              color: '#22CCE2'
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
.common-chart-wrap-container {
  width: 840px;
  top: 820px;
  left: 540px;
  background: url(~@/assets/image/chart-box-bg-large.png) center no-repeat;
  background-size: 100% 100%;
  .prediction-unit {
    padding-right: 20px;
    position: relative;
    top: -15px;
  }
}
</style>
