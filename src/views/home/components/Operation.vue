<!--
 * @Descripttion:运行统计组件
-->
<template>
  <div class="common-chart-wrap-container">
    <Header
      title="运行统计"
      :link-opt="linkOpt"
    />
    <div class="common-chart-content">
      <el-row
        class="fill-h"
        :gutter="20"
      >
        <el-col
          class="fill-h"
          :span="10"
        >
          <div class="content-text">
            <div class="mt-10 flex-box flex-align-center">
              <span class="mr-10">并网运行</span>
              <span class="text-blue font-18">{{item.gridConnected || 0}}</span>
            </div>
            <div class="mt-10 flex-box flex-align-center">
              <span class="mr-10">限电运行</span>
              <span class="text-orange font-18">{{item.limitedPower || 0}}</span>
            </div>
            <div class="mt-10 flex-box flex-align-center">
              <span class="mr-10">停电检修</span>
              <span class="text-red font-18">{{item.outageMaintenance || 0}}</span>
            </div>
            <div class="mt-10 flex-box flex-align-center">
              <span class="mr-10">调试中</span>
              <span
                class="text-gray font-18"
                style="padding-left:13px"
              >{{item.debugging || 0}}</span>
            </div>
          </div>
        </el-col>
        <el-col
          class="fill-h"
          :span="14"
        >
          <div
            class="operation-chart"
            id="homeOperationChart"
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
      default: function () {
        return {};
      }
    }
  },
  data() {
    return {
      linkOpt: {
        path: '/operation',
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
      const myChart = this.$echarts.init(document.getElementById('homeOperationChart'));
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
          // right: 'center',
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
          data: ['并网运行', '限电运行', '停电检修', '调试中']
        },

        series: [
          {
            name: '运行统计',
            type: 'pie',
            radius: ['50%', '70%'],
            center: ['30%', '50%'],
            avoidLabelOverlap: false,
            hoverAnimation: false,
            color: ['#22CCE2', '#FEBA02', '#FF3D57', '#b5b5b5', '#18ABFE'], // 修改颜色
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
              { value: this.item.gridConnected || null, name: '并网运行' },
              { value: this.item.limitedPower || null, name: '限电运行' },
              { value: this.item.outageMaintenance || null, name: '停电检修' },
              { value: this.item.debugging || null, name: '调试中' },
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
  top: 100px;
  right: 20px;
  .content-text {
    padding: 10px 0 0 40px;
    font-size: 14px;
  }
}
</style>
