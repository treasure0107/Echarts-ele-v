
<template>
  <div
    class="data-overview-container"
    v-loading='loading'
  >
    <div class="data-item-bg box-border">
      <div class="checkbox-con">
        <el-checkbox-group
          v-model="checkedList"
          :min="0"
          :max="2"
          @change="checkboxChange"
        >
          <el-checkbox
            v-for="item in windPowerList"
            :label="item"
            :key="item"
          >{{item}}</el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="chart-container">
        <div
          id="groupWindPowePrediction"
          class="fill-h"
        ></div>
      </div>
    </div>
    <dy-table
      :keys="colKey"
      :isPagination="false"
      :loading="loading"
      :fetchData="fetchData"
      :pagination='pagination'
      :list='tableData'
      :data-overview-view="true"
      class="box-border"
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
import { mapState } from 'vuex';
import { splitStr } from '@/utils/utils';
import DyTable from '@/components/DyTable';
export default {
  name: '',
  components: { DyTable },
  data() {
    return {
      myChart: null,
      activeIdx: 1,
      value: '',
      checked: false,
      loading: false,
      checkedList: ['实时功率', '预测功率'],
      legendData: ['实时功率', '预测功率'],
      windPowerList: ['实时功率', '预测功率', '实时风速', '预测风速'],
      isPower: true,
      isWind: false,
      realTimeWindPowerList: [], // 实时功率
      predictedWindPowerList: [], // 预测功率
      realTimeWindSpeedList: [], // 实时风速
      predictedWindSpeedList: [], // 预测风速
      powerSeriesName: '实时功率',
      windSeriesName: '预测功率',
      powerSeriesData: [], // 实际数据
      windSeriesData: [], // 预测数据
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
        realTimeWindPower: { label: '实时功率（MW）' },
        predictedWindPower: '预测功率（MW）',
        realTimeWindSpeed: '实时风速（m/s）',
        predictedWindSpeed: '预测风速（m/s）'
      }
    };
  },
  computed: {
    ...mapState({
      powerPlantId: state => state.powerPlant.powerPlantId
    })
  },
  watch: {},
  created() { },
  mounted() {
  },
  methods: {
    fetchData() {
      this.loading = true;
      const data = {
        start: 1,
        size: 10000,
        powerPlantId: this.powerPlantId
      };
      this.$axios.get(Api.group.getWindPower, data, (res) => {
        this.loading = false;
        if (res.isSuccess) {
          this.tableData = res.data;
          this.pagination.total = res.data.length;
          this.realTimeWindPowerList = [];
          this.predictedWindPowerList = [];
          this.realTimeWindSpeedList = [];
          this.predictedWindSpeedList = [];
          this.xAxisData = [];
          this.tableData.forEach(item => {
            this.xAxisData.push(splitStr(item.periodTime));
            this.realTimeWindPowerList.push(item.realTimeWindPower);
            this.predictedWindPowerList.push(item.predictedWindPower);
            this.realTimeWindSpeedList.push(item.realTimeWindSpeed);
            this.predictedWindSpeedList.push(item.predictedWindSpeed);
          });
          this.powerSeriesData = this.realTimeWindPowerList;
          this.windSeriesData = this.predictedWindPowerList;
          this.loadChart();
        }
      });
    },
    loadChart() {
      if (this.myChart) {
        this.myChart.clear();
      }
      this.myChart = this.$echarts.init(document.getElementById('groupWindPowePrediction'));
      const chartOption = {
        title: {
          text: `风功率预测`,
          textStyle: {
            color: '#333',
            fontSize: 12
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'line' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        toolbox: {
          show: true,
          itemSize: 19,
          iconStyle: {
            borderColor: '#3350d4'
          },
          emphasis: {
            iconStyle: {
              borderColor: '#3350d4'
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
        color: ['#18ABFE', '#22CCE2'],
        grid: {
          left: '3%',
          right: '4%',
          top: '16%',
          bottom: '60',
          containLabel: true
        },
        legend: {
          orient: 'horizontal',
          selectedMode: false,
          bottom: 10,
          left: 'center',
          icon: 'circle',
          itemWidth: 10,
          itemHeight: 10,
          textStyle: {
            color: '#333'
          },
          data: this.legendData
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
        yAxis: [
          {
            type: 'value',
            show: !!this.isPower,
            name: '单位：（MW）',
            nameTextStyle: {
              align: 'left'
            },
            splitLine: {
              lineStyle: {
                color: '#F4F4F4'
              }
              // show: false
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
              },
              interval: 6
            },
            axisTick: {
              lineStyle: { color: '#808080' }, // 坐标刻度颜色
              show: false // 坐标刻度颜色
            }
          }, {
            type: 'value',
            show: !!this.isWind,
            name: '风速：（m/s）',
            nameTextStyle: {
              align: 'right'
            },
            splitLine: {
              lineStyle: {
                color: '#F4F4F4'
              },
              show: false // 背景线
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
          }
        ],
        series: [
          {
            name: this.powerSeriesName,
            data: this.powerSeriesData,
            type: 'line',
            // symbol: 'none', // 这句就是去掉点的
            symbolSize: 8,
            areaStyle: {
              color: '#00A0E9', // 改变区域颜色
              opacity: 0.3
            },
            lineStyle: {
              color: '#00A0E9'
            }
          },
          {
            name: this.windSeriesName,
            data: this.windSeriesData,
            type: 'line',
            yAxisIndex: 1,
            symbolSize: 8,
            areaStyle: {
              color: '#22CCE2', // 改变区域颜色
              opacity: 0.3
            },
            lineStyle: {
              color: '#22CCE2'
            }
            // symbol: 'none'
          }
        ]
      };
      this.myChart.setOption(chartOption);
      setTimeout(() => {
        window.onresize = () => {
          this.myChart.resize();
        };
      }, 200);
    },
    checkboxChange(val) {
      if (val.length) {
        if (val.length == 2) {
          if (val.indexOf('实时功率') > -1 && val.indexOf('预测功率') > -1) {
            this.powerSeriesName = '实时功率';
            this.windSeriesName = '预测功率';
            this.legendData[0] = '实时功率';
            this.legendData[1] = '预测功率';
            this.powerSeriesData = this.realTimeWindPowerList;
            this.windSeriesData = this.predictedWindPowerList;
            this.isPower = true;
            this.isWind = false;
          }
          if (val.indexOf('实时功率') > -1 && val.indexOf('实时风速') > -1) {
            this.powerSeriesName = '实时功率';
            this.windSeriesName = '实时风速';
            this.legendData[0] = '实时功率';
            this.legendData[1] = '实时风速';
            this.powerSeriesData = this.realTimeWindPowerList;
            this.windSeriesData = this.realTimeWindSpeedList;
            this.isPower = true;
            this.isWind = true;
          }
          if (val.indexOf('实时功率') > -1 && val.indexOf('预测风速') > -1) {
            this.powerSeriesName = '实时功率';
            this.windSeriesName = '预测风速';
            this.legendData[0] = '实时功率';
            this.legendData[1] = '预测风速';
            this.powerSeriesData = this.realTimeWindPowerList;
            this.windSeriesData = this.predictedWindSpeedList;
            this.isPower = true;
            this.isWind = true;
          }
          if (val.indexOf('预测功率') > -1 && val.indexOf('实时风速') > -1) {
            this.powerSeriesName = '预测功率';
            this.windSeriesName = '实时风速';
            this.legendData[0] = '预测功率';
            this.legendData[1] = '实时风速';
            this.powerSeriesData = this.predictedWindPowerList;
            this.windSeriesData = this.realTimeWindSpeedList;
            this.isPower = true;
            this.isWind = true;
          }
          if (val.indexOf('预测功率') > -1 && val.indexOf('预测风速') > -1) {
            this.powerSeriesName = '预测功率';
            this.windSeriesName = '预测风速';
            this.legendData[0] = '预测功率';
            this.legendData[1] = '预测风速';
            this.powerSeriesData = this.predictedWindPowerList;
            this.windSeriesData = this.predictedWindSpeedList;
            this.isPower = true;
            this.isWind = true;
          }
          if (val.indexOf('实时风速') > -1 && val.indexOf('预测风速') > -1) {
            this.powerSeriesName = '实时风速';
            this.windSeriesName = '预测风速';
            this.legendData[0] = '实时风速';
            this.legendData[1] = '预测风速';
            this.powerSeriesData = this.realTimeWindSpeedList;
            this.windSeriesData = this.predictedWindSpeedList;
            this.isPower = false;
            this.isWind = true;
          }
        } else if (val.length == 1) {
          const data = val[0];
          this.legendData = val;
          switch (data) {
            case '实时功率':
              this.powerSeriesName = data;
              this.powerSeriesData = this.realTimeWindPowerList;
              this.windSeriesName = '';
              this.windSeriesData = [];
              this.isPower = true;
              this.isWind = false;
              break;
            case '预测功率':
              this.powerSeriesName = data;
              this.powerSeriesData = this.predictedWindPowerList;
              this.windSeriesName = '';
              this.windSeriesData = [];
              this.isPower = true;
              this.isWind = false;
              break;
            case '实时风速':
              this.windSeriesName = data;
              this.windSeriesData = this.realTimeWindSpeedList;
              this.powerSeriesName = '';
              this.powerSeriesData = [];
              this.isPower = false;
              this.isWind = true;
              break;
            case '预测风速':
              this.windSeriesName = data;
              this.windSeriesData = this.predictedWindSpeedList;
              this.powerSeriesName = '';
              this.powerSeriesData = [];
              this.isPower = false;
              this.isWind = true;
              break;
          }
        }
      } else {
        this.windSeriesName = '';
        this.powerSeriesData = [];
        this.powerSeriesName = '';
        this.windSeriesData = [];
        this.isPower = false;
        this.isWind = false;
      }
      this.loadChart();
    },
    handleDownload() {
      const url = `${this.baseUrl}powerGeneration/v1/exportData?exportModel=windPowerAll&powerPlantId=${this.powerPlantId}`;
      window.location.href = url;
    }
  }

};
</script>

<style scoped lang="scss">
.title-container {
  padding: 0 20px;
  height: 60px;
  background: #ffffff;
  // border: 1px solid #dcdfe4;
}
.checkbox-con {
  // padding-top: 20px;
  // padding-left: 30px;
  padding: 20px 30px;
}
.chart-container {
  height: 377px;
  padding-left: 20px;
  padding-right: 20px;
  box-sizing: border-box;
}
</style>
