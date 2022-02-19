<!--
 * @Author:JTune
 * @Description:数据概览-综合场用电量组件
 * @FilePath: \centralized-control-sys-web\src\views\dataOverview\components\electricityConsumption.vue
-->

<template>
  <div class="chart-wrap-container">
    <div class="chart-content">
      <!-- <div class="unit-i">
        单位：万kWh
      </div> -->
      <div
        class="fill-h"
        id="electricityConsumption"
      ></div>
    </div>
  </div>
</template>

<script>

export default {
  name: '',
  components: {},
  props: {
    item: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      xAxisData: [],
      seriesData: [],
      faultOverviewData: {
        equivalentUtilizationHours: 0
      }
    };
  },
  computed: {},
  watch: {
    'item': {
      handler: function (newValue, oldValue) {
        this.faultOverviewData = {
          equivalentUtilizationHours: 0
        };
        this.faultOverviewData = newValue[0];
        this.loadChart();
      },
      deep: true
    }
  },
  created() { },
  mounted() {
  },
  methods: {
    loadChart() {
      const myChart = this.$echarts.init(document.getElementById('electricityConsumption'));
      const chartOption = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c}'
        },
        grid: {
          left: 0
        },
        legend: {
          orient: 'horizontal',
          bottom: 0,
          left: 'center',
          itemWidth: 10,
          itemHeight: 10,
          selectedMode: false,
          textStyle: {
            color: '#333'
          },
          data: []
        },
        graphic: {
          type: 'text',
          left: 'center',
          top: '40%',
          style: {
            text: `${this.faultOverviewData.equivalentUtilizationHours}h`,
            textAlign: 'center',
            fill: '#333',
            fontSize: 16,
            fontWeight: 400
          }
        },
        series: [
          {
            name: '风电场等效利用小时',
            type: 'pie',
            radius: ['50%', '70%'],
            center: ['50%', '40%'],
            avoidLabelOverlap: false,
            hoverAnimation: false,
            color: ['#22CCE2'], // 修改颜色
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
              { value: this.faultOverviewData.equivalentUtilizationHours || null },
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
  .unit-i {
    font-size: 12px;
    font-family: Arial;
    font-weight: 400;
    line-height: 14px;
    padding-left: 20px;
    margin-left: 20px;
    color: #808080;
  }
}
</style>
