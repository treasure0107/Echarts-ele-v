
<template>
  <div
    v-loading='loading'
    class="group-overview-container"
  >
    <div class="title-container flex-box flex-align-center">
      <div>
        <span>风电场：</span>
        <el-select
          class="mr-20"
          v-model="queryData.powerPlantId"
          clearable
          placeholder="请选择"
          popper-class="group-select-option"
          @change="fetchData"
        >
          <el-option
            v-for="item in nodeDistributionList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="chart-container group-item-bg mt-20">
      <div
        id="groupWindPowePrediction"
        class="fill-h"
      ></div>
    </div>
    <dy-table
      :keys="colKey"
      :isPagination="false"
      :loading="loading"
      :fetchData="fetchData"
      :pagination='pagination'
      :list='tableData'
      :showHeader="true"
    >
      <div slot="header">
        <el-button
          type="primary"
          class="export-btn"
          @click="handleDownload"
        >导出</el-button>
      </div>
    </dy-table>
  </div>
</template>

<script>
import Api from '@/utils/api.js';
import DyTable from '@/components/DyTable';
import { splitStr } from '@/utils/utils';
export default {
  name: '',
  components: { DyTable },
  data() {
    return {
      activeIdx: 1,
      value: '',
      loading: false,
      nodeDistributionList: [],
      xAxisData: [],
      seriesData1: [],
      seriesData2: [],
      queryData: {
        key: '',
        powerPlantId: '',
        start: 1,
        size: 10000
      },
      tableData: [],
      pagination: {
        total: 0,
        start: 1,
        size: 20
      },
      colKey: {
        /**
         * 表头内容与后端字段一一对应
         */
        periodTime: '日期',
        realTimeWindPower: '实时功率（MW）',
        predictedWindPower: '预测功率'
      }
    };
  },
  computed: {},
  watch: {},
  created() { },
  mounted() {
    this.getNodeDistribution();
  },
  methods: {
    fetchData() {
      this.loading = true;
      this.$axios.get(Api.group.getWindPower, this.queryData, (res) => {
        this.loading = false;
        if (res.isSuccess) {
          this.tableData = res.data;
          this.pagination.total = res.data.length;
          this.xAxisData = [];
          this.seriesData1 = [];
          this.seriesData2 = [];
          this.tableData.forEach(item => {
            item.periodTime = splitStr(item.periodTime);
            this.xAxisData.push(item.periodTime);
            this.seriesData1.push(item.realTimeWindPower);
            this.seriesData2.push(item.predictedWindPower);
          });
          this.loadChart();
        }
      });
    },
    loadChart() {
      const myChart = this.$echarts.init(document.getElementById('groupWindPowePrediction'));
      const chartOption = {
        title: {
          text: '风功率预测',
          textStyle: {
            color: '#C8C9CC',
            fontSize: 12
          }
        },
        color: ['#18ABFE', '#22CCE2'],
        grid: {
          left: '3%',
          right: '4%',
          top: '60',
          bottom: '30',
          containLabel: true
        },
        toolbox: {
          show: true,
          itemSize: 19,
          iconStyle: {
            // color: '#C8C9CC',
            borderColor: '#C8C9CC'
          },
          emphasis: {
            iconStyle: {
              // color: '#C8C9CC',
              borderColor: '#C8C9CC'
            }
          },
          feature: {
            saveAsImage: {
              show: true,
              excludeComponents: ['toolbox'],
              pixelRatio: 3
            }
          }
        },
        legend: {
          orient: 'horizontal',
          selectedMode: false,
          bottom: 0,
          left: 'center',
          icon: 'circle',
          itemWidth: 10,
          itemHeight: 10,
          textStyle: {
            color: '#C8C9CC'
          },
          data: ['实时功率', '预测功率']
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.xAxisData,
          lineStyle: {
            color: '#C8C9CC'
          },
          axisLabel: {
            interval: 6
          },
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#C8C9CC'
            },
            show: false
          }
        },
        yAxis: {
          type: 'value',
          name: '单位：（MW）',
          nameTextStyle: {
            align: 'left'
          },
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
              color: '#C8C9CC'
            },
            show: false
          },
          axisLabel: {
            margin: 10,
            fontSize: '12',
            textStyle: {
              color: '#C8C9CC'
            }
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
      setTimeout(() => {
        window.onresize = () => {
          myChart.resize();
        };
      }, 200);
    },
    // 获取风电场列表
    getNodeDistribution() {
      const data = {};
      this.$axios.post(Api.group.getNodeDistribution, data, (res) => {
        if (res.isSuccess) {
          this.nodeDistributionList = res.data;
        }
      });
    },
    handleDownload() {
      const url = `${this.baseUrl}powerGeneration/v1/exportData?exportModel=windPower&powerPlantId=${this.queryData.powerPlantId}`;
      window.location.href = url;
    }
  }
};
</script>

<style scoped lang="scss">
.group-overview-container {
  .date-btn-group {
    margin-right: 80px;
  }
  .chart-container {
    height: 300px;
    padding: 20px;
    box-sizing: border-box;
  }
}
</style>
