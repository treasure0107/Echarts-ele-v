
<template>
  <div
    v-loading='loading'
    class="group-overview-container"
  >
    <div class="title-container flex-box flex-align-center">
      <el-select
        class="mr-20 select-date-format"
        v-model="queryType"
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
        class="group-select-picker mr-20"
        v-model="chooseDate"
        :picker-options="pickerOptions"
        :type="queryType == 'DAY'?'date':queryType == 'MONTH'?'month':'year'"
        :placeholder="queryType == 'DAY'?'选择日期':queryType == 'MONTH'?'选择月份':'选择年份'"
        :value-format="valueFormat"
        popper-class="group-select-picker"
      >
      </el-date-picker>
      <!-- <el-button-group class="date-btn-group">
        <el-button
          type="primary"
          :class="{'active':queryType == item.idx}"
          v-for="(item,key) in dateData"
          :key="key"
          @click="handleSelectDate(item.idx)"
        >{{item.val}}</el-button>
      </el-button-group> -->
    </div>
    <div class="chart-container group-item-bg mt-20">
      <div
        id="groupGeneratingCapacityTop"
        class="fill-h"
      ></div>
    </div>
    <!--    showSerial 默认序号是否显示-->
    <dy-table
      :keys="colKey"
      :loading="loading"
      :isPagination="false"
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
      queryType: 'MONTH',
      chooseDate: '',
      loading: false,
      xAxisData: [],
      seriesData: [],
      seriesFillData: [],
      dateData: [
        {
          idx: 'MONTH',
          val: '月'
        },
        {
          idx: 'YEAR',
          val: '年'
        }
      ],
      tableData: [],
      pagination: {
        total: 0,
        start: 1,
        size: 20
      },
      pickerOptions: {
        disabledDate: (time) => {
          // 日
          if (this.queryType == 'DAY') {
            return time.getTime() > Date.now() - 8.64e7;
          } else if (this.queryType == 'MONTH') { // 月
            const data = new Date();
            data.setDate(1);
            data.setHours(0);
            data.setSeconds(0);
            data.setMinutes(0);
            return time.getTime() > data.getTime();
          } else if (this.queryType == 'YEAR') { // 年
            const data = new Date();
            data.setDate(1);
            data.setMonth(0);
            return time.getTime() > data.getTime();
          }
        }
      },
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
        powerGeneration: '实际发电量(万kWh)',
        planPowerGeneration: '计划发电量(万kWh)',
        generationCompletionRate: {
          label: '完成率',
          sortable: true,
          handle: (scope, createElement) => {
            return createElement('span', {

            }, `${scope.row.generationCompletionRate * 100}%`);
          }
        }
      }
    };
  },
  computed: {
    valueFormat: function () {
      if (this.queryType == 'DAY') {
        return 'yyyy-MM-dd';
      } else if (this.queryType == 'MONTH') {
        return 'yyyy-MM';
      } else if (this.queryType == 'YEAR') {
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
        queryType: this.queryType,
        chooseDate: this.chooseDate,
        start: 1,
        size: 10000
      };
      this.$axios.get(Api.group.getPowerCompletion, data, (res) => {
        this.loading = false;
        if (res.isSuccess) {
          this.tableData = res.data;
          this.pagination.total = res.data.length;
          this.xAxisData = [];
          this.seriesData = [];
          this.seriesFillData = [];
          const starts = this.pagination.start - 1;
          const size = this.pagination.size;
          this.tableData.forEach((item, index) => {
            const idx = index + 1;
            item.idx = idx + starts * size;
            this.xAxisData.push(item.powerPlant);
            this.seriesData.push(item.generationCompletionRate * 100);
            this.seriesFillData.push(100);
          });
          this.loadChart();
        }
      });
    },
    loadChart() {
      const myChart = this.$echarts.init(document.getElementById('groupGeneratingCapacityTop'));
      const chartOption = {
        title: {
          text: `发电完成率`,
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
          formatter: `发电量完成率：{c}%`
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
            bottom: '2%',
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
            fontSize: '12',
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
              lineHeight: 14,
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
            formatter: '{value}%', // 给Y轴上的刻度加上单位
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
            name: '实际发电量',
            type: 'bar',
            barWidth: 14, // 柱条的宽度,默认自适应
            data: this.seriesData,
            label: { // 图形上的文本标签
              show: false,
              position: 'right', // 标签的位置
              offset: [5, 0], // 标签文字的偏移，此处表示向上偏移40
              // formatter: '{c}{a}', // 标签内容格式器 {a}-系列名,{b}-数据名,{c}-数据值
              color: '#C8C9CC', // 标签字体颜色
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
            color: '#2A3460' // 柱条颜色
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
    handleDateChange(val) {
      this.xAxisData = [];
      this.seriesData = [];
      this.seriesFillData = [];
      this.pagination.start = 1;
      this.fetchData();
    },
    handleSelectDate(idx) {
      this.queryType = idx || 'MONTH';
      this.fetchData();
    },
    handleRowClick(row) {
      this.$store.commit('CHANGE_POWER_PLANT_ID', row.powerPlantId);
      this.$store.commit('CHANGE_POWER_PLANT', row.powerPlant);
      this.$router.push({ path: '/dataOverview' });
    },
    handleDownload() {
      const url = `${this.baseUrl}powerGeneration/v1/exportData?exportModel=powerCompletion&queryType=${this.queryType}&chooseDate=${this.chooseDate}&start=1&size=10000`;
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
  .select-date-format {
    ::v-deep .el-input {
      width: 90px;
    }
  }
}
</style>
