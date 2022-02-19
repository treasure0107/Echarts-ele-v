<!--
 * @Author:JTune
 * @Description: 数据概览-故障总览组件
 * @FilePath: \centralized-control-sys-web\src\views\dataOverview\components\FaultOverview.vue
-->
<template>
  <div class="chart-wrap-container">
    <div class="chart-content">
      <div class="con-t">
        <div class="mt-20">故障时长：<span>{{faultOverviewData.faultDuration ||  0}} h</span></div>
        <div class="mt-20">故障次数：{{faultOverviewData.faultCount+faultOverviewData.warnCount ||  0}} 次</div>
        <div>故障损失：{{faultOverviewData.lossOfElectricity ||  0}} kWh</div>
      </div>
      <div
        class="fill-h"
        id="faultOverview"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  components: {},
  props: {
    list: {
      type: Object,
      default: function () {
        return {};
      }
    }
  },
  data() {
    return {
      faultOverviewData: {
        faultDuration: 0,
        faultCount: 0,
        lossOfElectricity: 0,
        warnCount: 0
      }
    };
  },
  computed: {},
  watch: {
    'list': {
      handler: function (newValue, oldValue) {
        this.faultOverviewData = {
          faultDuration: 0,
          faultCount: 0,
          lossOfElectricity: 0,
          warnCount: 0
        };
        this.faultOverviewData = newValue;
        this.loadChart();
      },
      deep: true
    }
  },
  created() {

  },
  mounted() { },
  methods: {
    loadChart() {
      const myChart = this.$echarts.init(document.getElementById('faultOverview'));
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
          bottom: 0,
          left: 'center',
          itemWidth: 10,
          itemHeight: 10,
          selectedMode: false,
          textStyle: {
            color: '#333'
          },
          data: ['告警信息', '设备故障']
        },
        series: [
          {
            name: '故障总览',
            type: 'pie',
            radius: ['50%', '70%'],
            center: ['50%', '40%'],
            avoidLabelOverlap: false,
            hoverAnimation: false,
            color: ['#22CCE2', '#FF3D57', '#18ABFE'], // 修改颜色
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
              { value: this.faultOverviewData.warnCount || null, name: '告警信息' },
              { value: this.faultOverviewData.faultCount || null, name: '设备故障' },
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
    position: relative;
    .con-t {
      position: absolute;
      top: 40px;
      left: 30px;
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      line-height: 16px;
      color: #999999;
    }
  }
  .fill-h {
    // width: 100%;
    height: 100%;
    min-height: 100%;
    margin-left: 100px;
  }
  .unit-i {
    font-size: 12px;
    font-family: Arial;
    font-weight: 400;
    line-height: 14px;
    padding-left: 20px;
    color: #808080;
  }
}
</style>
