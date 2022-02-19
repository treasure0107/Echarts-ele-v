<!--
 * @Descripttion:用电情况排行
-->
<template>
  <div class="common-chart-wrap-container">
    <Header
      title="风电场利用小时数"
      :link-opt="linkOpt"
    />
    <div class="common-chart-content">
      <div
        v-show="item.length"
        class="electricity-top-chart fill-h"
        id="electricityTop"
      ></div>
      <div
        v-show="!item.length"
        class="empty-text"
      >暂无数据</div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/home/Header';
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
        path: '/electricityConsumptionTop',
        params: {}
      },
      yAxisData: [],
      seriesData1: [],
      seriesData2: [],
      seriesData: [],
      seriesFillData: []
    };
  },
  computed: {},
  watch: {
    'item': {
      handler: function (newValue, oldValue) {
        this.yAxisData = [];
        this.seriesData = [];
        this.seriesData1 = [];
        this.seriesData2 = [];
        newValue.forEach(item => {
          this.yAxisData.push(item.powerPlant);
          // this.seriesData1.push(item.onGridEnergy);
          // this.seriesData2.push(item.lossOfElectricity);
          const equivalentUtilizationHours = item.equivalentUtilizationHours ? (item.equivalentUtilizationHours * 1).toFixed(2) : '0.00';
          this.seriesData.push(equivalentUtilizationHours);
          this.seriesFillData.push(100);
        });
        setTimeout(() => {
          this.loadChart();
        }, 100);
      },
      deep: true
    }
  },
  created() { },
  mounted() { },
  methods: {
    loadChart() {
      const myChart = this.$echarts.init(document.getElementById('electricityTop'));
      const chartOption = {
        grid: [
          {
            left: '3%',
            top: '0%',
            right: '10%',
            bottom: '0%',
            containLabel: true
          },
          {
            left: '10%',
            top: '0%',
            right: '5%',
            bottom: '0%',
            containLabel: true
          }
        ],
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: `风电场利用小时数：{c}`
        },
        xAxis: {
          type: 'value',
          show: false,
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: 'category',
          inverse: true, // 倒叙
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#fff',
              lineHeight: 56
            },
            show: false
          },
          axisLabel: {
            margin: 20,
            fontSize: '14',
            textStyle: {
              color: '#fff'
            }
          },
          data: this.yAxisData
        },
        series: [
          {
            name: '实际发电量',
            type: 'bar',
            barWidth: 14, // 柱条的宽度,默认自适应
            data: this.seriesData,
            label: { // 图形上的文本标签
              show: true,
              position: 'right', // 标签的位置
              offset: [5, 0], // 标签文字的偏移，此处表示向上偏移40
              // formatter: '{c}{a}', // 标签内容格式器 {a}-系列名,{b}-数据名,{c}-数据值
              color: '#fff', // 标签字体颜色
              fontSize: 12 // 标签字号
            },
            itemStyle: {
              color: ['#18ABFE']
            },
            zlevel: 1 // zlevel:1//柱状图所有图形的 zlevel 值,zlevel 大的 Canvas 会放在 zlevel 小的 Canvas 的上面
          },
          {
            name: '计划发电量',
            type: 'bar',
            barGap: '-100%', // 不同系列的柱间距离，为百分比。
            // 在同一坐标系上，此属性会被多个 'bar' 系列共享。
            // 此属性应设置于此坐标系中最后一个 'bar' 系列上才会生效，
            // 并且是对此坐标系中所有 'bar' 系列生效。
            data: this.seriesFillData,
            barWidth: 14, // 柱图宽度
            color: ['#2A3460', '#18ABFE'], // 柱条颜色
            itemStyle: {

            }
          }

        ]

      };
      // const chartOption = {
      //   title: {
      //     text: '单位:h',
      //     textStyle: {
      //       color: '#fff',
      //       fontSize: 12
      //     }
      //   },
      //   tooltip: {
      //     trigger: 'axis',
      //     axisPointer: { // 坐标轴指示器，坐标轴触发有效
      //       type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
      //     }
      //   },
      //   legend: {
      //     textStyle: {
      //       color: '#fff'
      //     },
      //     itemWidth: 10,
      //     itemHeight: 10,
      //     data: [] // '上网电量', '损失电量'
      //   },
      //   grid: {
      //     left: '3%',
      //     top: '20%',
      //     right: '5%',
      //     bottom: '-5%',
      //     containLabel: true
      //   },
      //   xAxis: {
      //     type: 'value',
      //     show: false
      //   },
      //   yAxis: {
      //     type: 'category',
      //     inverse: true, // 倒叙
      //     axisTick: {
      //       show: false
      //     },
      //     axisLine: {
      //       lineStyle: {
      //         color: '#fff',
      //         lineHeight: 26
      //       },
      //       show: false
      //     },
      //     axisLabel: {
      //       margin: 20,
      //       fontSize: '14',
      //       textStyle: {
      //         color: '#fff'
      //       }
      //     },
      //     data: this.yAxisData
      //   },
      //   series: [
      //     {
      //       name: '上网电量',
      //       type: 'bar',
      //       stack: '总量',
      //       barWidth: 14, // 柱条的宽度,默认自适应
      //       color: ['#18ABFE'], // 修改颜色
      //       label: {
      //         fontSize: 11,
      //         show: false,
      //         lineHeight: 36,
      //         position: 'insideRight'
      //       },
      //       data: this.seriesData
      //     },
      //     {
      //       name: '损失电量',
      //       type: 'bar',
      //       stack: '总量',
      //       barWidth: 14, // 柱条的宽度,默认自适应
      //       color: ['#FFA81F'], // 修改颜色
      //       label: {
      //         fontSize: 11,
      //         lineHeight: 36,
      //         show: false,
      //         position: 'insideRight'
      //       },
      //       data: this.seriesFillData
      //     }

      //   ]
      // };
      myChart.setOption(chartOption);
    }
  }
};
</script>

<style scoped lang="scss">
.common-chart-wrap-container {
  top: 580px;
  left: 20px;
  .common-chart-content {
    height: calc(100% - 55px);
  }
  .empty-text {
    text-align: center;
    margin: 70px auto;
  }
}
</style>
