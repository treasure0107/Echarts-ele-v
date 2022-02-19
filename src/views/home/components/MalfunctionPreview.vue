<!--
 * @Descripttion:故障总览
-->

<template>
  <div class="common-chart-wrap-container">
    <Header
      title="故障总览"
      :link-opt="linkOpt"
    />
    <div class="common-chart-content">
      <el-row
        class="fill-h"
        :gutter="20"
      >
        <el-col
          class="fill-h"
          :span="11"
        >
          <div class="content-text">
            <div class="mt-10">
              <span class="mr-10">故障时长</span>
              <span>{{item?item.faultDuration: 0}} h</span>
            </div>
            <div class="mt-10">
              <span class="mr-10">故障次数</span>
              <span>{{item?item.faultCount+item.warnCount : 0}} 次</span>
            </div>
            <div class="mt-10">
              <span class="mr-10">故障损失</span>
              <span>{{item?item.lossOfElectricity : 0}} kWh</span>
            </div>
          </div>
        </el-col>
        <el-col
          class="fill-h"
          :span="13"
        >
          <div
            class="malfunction-preview-chart"
            id="MalfunctionPreviewChart"
            style="width:100%;height:100%;"
          ></div>
        </el-col>
      </el-row>
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
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {
      linkOpt: {
        path: '/malfunctionPreview',
        params: {}
      }
    };
  },
  computed: {},
  watch: {
    'item': {
      handler: function (newValue, oldValue) {
        this.loadChart();
      },
      deep: true
    }
  },
  created() { },
  mounted() { },
  methods: {
    loadChart() {
      const myChart = this.$echarts.init(document.getElementById('MalfunctionPreviewChart'));
      const chartOption = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        grid: {
          left: 0
        },
        legend: {
          // orient: 'horizontal',
          // bottom: 0,
          // left: 'center',
          type: 'scroll',
          orient: 'vertical',
          right: 30,
          top: 20,
          bottom: 20,
          itemWidth: 10,
          itemHeight: 10,
          selectedMode: false,
          textStyle: {
            color: '#fff'
          },
          data: ['告警信息', '设备故障']
        },
        series: [
          {
            name: '故障总览',
            type: 'pie',
            radius: ['50%', '70%'],
            center: ['26%', '50%'],
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
              { value: this.item.warnCount || null, name: '告警信息' },
              { value: this.item.faultCount || null, name: '设备故障' },
              { value: 0, name: '' }
            ]
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
  top: 340px;
  right: 20px;
  .content-text {
    padding: 10px 0 0 40px;
    font-size: 14px;
  }
}
</style>
