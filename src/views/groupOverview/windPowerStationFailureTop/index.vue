
<template>
  <div
    v-loading='loading'
    class="group-overview-container"
  >
    <div class="title-container flex-box flex-align-center">
      <el-select
        class="mr-20 select-date-format"
        v-model="dateType"
        clearable
        placeholder="请选择"
        popper-class="group-select-option"
        @change="handleSelectDate"
      >
        <el-option
          v-for="item in dateData"
          :key="item.id"
          :label="item.val"
          :value="item.idx"
        >
        </el-option>
      </el-select>
      <el-date-picker
        :clearable="false"
        @change='handleDateChange'
        :disabled='this.dateType==3'
        class="group-select-picker mr-20"
        v-model="chooseDate"
        :picker-options="pickerOptions"
        :type="dateType == 1?'month':'year'"
        :placeholder="dateType == 1?'选择月份':dateType == 2?'选择年份':'请选择'"
        :value-format="valueFormat"
        popper-class="group-select-picker"
      >
      </el-date-picker>
    </div>
    <div class="chart-container group-item-bg mt-20">
      <div
        id="groupWindPowerStationFailureTop"
        class="fill-h"
      ></div>
    </div>
    <!--    showSerial 默认序号是否显示-->
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
export default {
  name: '',
  components: { DyTable },
  data() {
    const that = this;
    return {
      dateType: 1,
      chooseDate: '',
      loading: false,
      tableData: [],
      pickerOptions: {
        disabledDate: (time) => {
          // 日
          if (this.queryType == 1) {
            return time.getTime() > Date.now() - 8.64e7;
          } else if (this.queryType == 2) { // 月
            const data = new Date();
            data.setDate(1);
            data.setHours(0);
            data.setSeconds(0);
            data.setMinutes(0);
            return time.getTime() > data.getTime();
          } else if (this.queryType == 3) { // 年
            const data = new Date();
            data.setDate(1);
            data.setMonth(0);
            return time.getTime() > data.getTime();
          }
        }
      },
      pagination: {
        total: 0,
        start: 1,
        size: 20
      },
      actions: [
        {
          label: '编辑',
          action: row => {
            this.editHandle(row);
          }
        }
      ],
      dateData: [
        {
          idx: 1,
          val: '月'
        },
        {
          idx: 2,
          val: '年'
        },
        {
          idx: 3,
          val: '全部'
        }
      ],
      colKey: {
        idx: '序号',
        powerPlant: {
          label: '风电场',
          handle: (scope, createElement) => {
            return createElement('span', {
              style: {
                color: '#18ABFE',
                cursor: 'pointer'
              },
              on: {
                click() {
                  that.handleRowClick(scope.row);
                }
              }
            }, scope.row.powerPlant);
          }
        },
        faultCount: {
          label: '故障次数',
          sortable: true,
          handle: (scope, createElement) => {
            return createElement('span', {}, scope.row.faultCount + scope.row.warnCount);
          }
        },
        faultDuration: { label: '故障时长', sortable: true },
        lossOfElectricity: { label: '损失电量(万kWh)', sortable: true }
      }
    };
  },
  computed: {
    valueFormat: function () {
      if (this.dateType == 1) {
        return 'yyyy-MM';
      } else if (this.dateType == 2) {
        return 'yyyy';
      }
      return true;
    }
  },
  watch: {},
  created() { },
  mounted() { },
  methods: {
    fetchData() {
      this.tableData = [];
      this.loading = true;
      const data = {
        dateType: this.dateType == 1 ? 'MONTH' : this.dateType == 2 ? 'YEAR' : '',
        chooseDate: this.chooseDate,
        start: 1,
        size: 10000
      };
      this.$axios.get(Api.group.faultPlantStatistic, data, (res) => {
        this.loading = false;
        if (res.isSuccess) {
          this.tableData = res.data;
          this.pagination.total = res.total;
          this.seriesData = [];
          this.xAxisData = [];
          const starts = this.pagination.start - 1;
          const size = this.pagination.size;
          this.tableData.forEach((item, index) => {
            const idx = index + 1;
            item.idx = idx + starts * size;
            this.xAxisData.push(item.powerPlant);
            this.seriesData.push(item.faultCount + item.warnCount);
          });
          this.loadChart();
        }
      });
    },
    loadChart() {
      const myChart = this.$echarts.init(document.getElementById('groupWindPowerStationFailureTop'));
      const chartOption = {
        title: {
          text: '风电场故障',
          textStyle: {
            color: '#C8C9CC',
            fontSize: 12
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: `故障次数:{c}`
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
        grid: [
          {
            left: '3%',
            top: '40',
            right: '3%',
            bottom: '0%',
            containLabel: true
          },
          {
            left: '3%',
            top: '20',
            right: '3%',
            bottom: '0%',
            containLabel: true
          }
        ],
        xAxis: {
          type: 'category',
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#C8C9CC',
              lineHeight: 56
            },
            show: false
          },
          axisLabel: {
            margin: 20,
            fontSize: '14',
            interval: 0,
            formatter: function (params) {
              var newParamsName = ''; // 最终拼接成的字符串
              var paramsNameNumber = params.length; // 实际标签的个数
              var provideNumber = 6; // 每行能显示的字的个数
              var rowNumber = Math.ceil(paramsNameNumber / provideNumber); // 换行的话，需要显示几行，向上取整
              /**
               * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
               */
              // 条件等同于rowNumber>1
              if (paramsNameNumber > provideNumber) {
                /** 循环每一行,p表示行 */
                for (var p = 0; p < rowNumber; p++) {
                  var tempStr = ''; // 表示每一次截取的字符串
                  var start = p * provideNumber; // 开始截取的位置
                  var end = start + provideNumber; // 结束截取的位置
                  // 此处特殊处理最后一行的索引值
                  if (p == rowNumber - 1) {
                    // 最后一次不换行
                    tempStr = params.substring(start, paramsNameNumber);
                  } else {
                    // 每一次拼接字符串并换行
                    tempStr = params.substring(start, end) + '\n';
                  }
                  newParamsName += tempStr; // 最终拼成的字符串
                }
              } else {
                // 将旧标签的值赋给新标签
                newParamsName = params;
              }
              // 将最终的字符串返回
              return newParamsName;
            },
            textStyle: {
              color: '#C8C9CC'
            }
          },
          data: this.xAxisData
        },
        yAxis: {
          type: 'value',
          show: true,
          axisTick: {
            show: false
          },
          splitLine: {
            lineStyle: {
              color: '#0E2A5C'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#C8C9CC',
              lineHeight: 56
            },
            show: false
          },
          axisLabel: {
            margin: 20,
            fontSize: '14',
            textStyle: {
              color: '#C8C9CC'
            }
          },
          min: 0,
          max: 100,
          boundaryGap: [0, 0.01]
        },
        series: [
          {
            name: '%',
            type: 'bar',
            barWidth: 14, // 柱条的宽度,默认自适应
            data: this.seriesData,
            label: { // 图形上的文本标签
              show: false,
              position: 'right', // 标签的位置
              offset: [5, 0], // 标签文字的偏移，此处表示向上偏移40
              formatter: '{c}{a}', // 标签内容格式器 {a}-系列名,{b}-数据名,{c}-数据值
              color: '#C8C9CC', // 标签字体颜色
              fontSize: 12 // 标签字号
            },
            itemStyle: {
              color: ['#18ABFE']
            },
            zlevel: 1 // zlevel:1//柱状图所有图形的 zlevel 值,zlevel 大的 Canvas 会放在 zlevel 小的 Canvas 的上面
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
    editHandle(row) {
    },
    handleDateChange(val) {
      this.seriesData = [];
      this.xAxisData = [];
      this.pagination.start = 1;
      this.fetchData();
    },
    handleSelectDate(idx) {
      this.dateType = idx;
      this.chooseDate = '';
      this.fetchData();
    },
    handleRowClick(row) {
      this.$store.commit('CHANGE_POWER_PLANT_ID', row.powerPlantId);
      this.$store.commit('CHANGE_POWER_PLANT', row.powerPlant);
      this.$router.push({ path: '/dataOverview' });
    },
    handleDownload() {
      const dateType = this.dateType == 1 ? 'MONTH' : this.dateType == 3 ? 'YEAR' : '';
      const params = `key=${this.key}&dateType=${dateType}&chooseDate=${this.chooseDate}&start=1&size=10000`;
      const url = `${this.baseUrl}realTimeDatasFaultStatistic/v1/exportData?exportModel=faultPlantStatistic&${params}`;
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
    height: 271px;
    padding: 20px;
    box-sizing: border-box;
  }
}
</style>
