<!--
 * @Author: JTune
 * @Description: 数据概览-发电量详情页
 * @FilePath: \centralized-control-sys-web\src\views\overviewPage\generatingCapacityDetails\index.vue
-->
<template>
  <div
    v-loading='loading'
    class="data-overview-container"
  >
    <div class="title-container flex-box flex-align-center box-border">
      <el-select
        class="mr-20 select-date-format"
        v-model="activeIdx"
        clearable
        placeholder="请选择"
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
        @change='handleChooseDateChange'
        class="data-select-picker mr-20"
        v-model="queryData.chooseDate"
        :picker-options="pickerOptions"
        :type="activeIdx == 1?'date':activeIdx == 2?'month':'year'"
        :placeholder="activeIdx == 1?'选择日期':activeIdx == 2?'选择月份':'选择年份'"
        popper-class="data-select-picker"
        :value-format="valueFormat"
      >
      </el-date-picker>
      <div class="mr-20">
        <el-checkbox
          v-model="checked"
          :disabled="activeIdx == 4"
          @change="handleCheckboxChange"
        >对比时间段</el-checkbox>
      </div>
      <el-date-picker
        v-if="checked"
        :clearable="false"
        @change='handleDateChange'
        class="data-select-picker mr-20"
        v-model="queryData.compareDate"
        :picker-options="pickerOptions"
        :type="activeIdx == 1?'date':activeIdx == 2?'month':'year'"
        :placeholder="activeIdx == 1?'选择日期':activeIdx == 2?'选择月份':'选择年份'"
        popper-class="data-select-picker"
        :value-format="valueFormat"
      >
      </el-date-picker>

      <div>
        <span style="color:#333;">风机：</span>
        <el-select
          class="mr-20"
          v-model="queryData.deviceId"
          clearable
          placeholder="请选择"
          popper-class="data-select-picker"
          @change="handleFans"
        >
          <el-option
            v-for="item in fanList"
            :key="item.deviceId"
            :label="item.deviceName"
            :value="item.deviceId"
          >
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="chart-container box-border data-item-bg mt-20">
      <div
        id="groupWindPowePrediction"
        class="fill-h"
      ></div>
    </div>
    <dy-table
      v-if="!queryData.compareDate"
      :loading="loading"
      :isPagination="false"
      :keys="colKey"
      :fetchData="fetchData"
      :pagination='pagination'
      :list='tableData'
      :data-overview-view="true"
      class="box-border"
      :showHeader="true"
    >
      <div
        slot="header"
        class="mb-20"
      >
        <el-button
          type="primary"
          class="export-btn"
          @click="handleDownload"
        >导出</el-button>
      </div>
    </dy-table>
    <dy-table
      v-else
      :loading="loading"
      :keys="colKey2"
      :isPagination="false"
      :fetchData="fetchData"
      :pagination='pagination'
      :list='tableData'
      :data-overview-view="true"
      class="box-border"
      :showHeader="true"
    >
      <div
        slot="header"
        class="mb-20"
      >
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
import { timeWeekFormat } from '@/utils/utils';
import { mapState } from 'vuex';
export default {
  name: '',
  components: { DyTable },
  data() {
    return {
      activeIdx: 1,
      queryData: {
        queryType: '',
        powerPlantId: this.$store.state.powerPlant.powerPlantId,
        compareDate: '',
        endDate: '',
        chooseDate: ''
      },
      checked: false,
      loading: false,
      dataZoomVisible: false, // 是否展示时间轴
      totalPowerGeneration: 0,
      tableData: [],
      copyData: [],
      compareTableData: [],
      seriesData: [],
      compareSeriesData: [],
      chartTimeData: [],
      fanList: [],
      pagination: {
        total: 0,
        start: 1,
        size: 20
      },
      pickerOptions: {
        disabledDate: (time) => {
          // 日
          if (this.activeIdx == 1) {
            return time.getTime() > Date.now() - 8.64e7;
          } else if (this.activeIdx == 2) { // 月
            const data = new Date();
            data.setDate(1);
            data.setHours(0);
            data.setSeconds(0);
            data.setMinutes(0);
            return time.getTime() > data.getTime();
          } else if (this.activeIdx == 3) { // 年
            const data = new Date();
            data.setDate(1);
            data.setMonth(0);
            return time.getTime() > data.getTime();
          }
        }
      },
      dateData: [
        {
          idx: 1,
          val: '日'
        },
        {
          idx: 2,
          val: '月'
        },
        {
          idx: 3,
          val: '年'
        },
        {
          idx: 4,
          val: '全部'
        }
      ],
      colKey: {
        /**
         * 表头内容与后端字段一一对应
         */
        periodTime: '日期',
        powerGeneration: { label: '发电量（万kWh）', sortable: true }
        // event: '重要事件'
      },
      colKey2: {
        /**
         * 表头内容与后端字段一一对应
         */
        periodTime: '日期',
        compareDate: '对比日期',
        powerGeneration: '发电量（万kWh）',
        compareElectricity: '对比发电量（万kWh）'
      }

    };
  },
  computed: {
    valueFormat: function () {
      if (this.activeIdx == 1) {
        return 'yyyy-MM-dd';
      } else if (this.activeIdx == 2) {
        return 'yyyy-MM';
      } else if (this.activeIdx == 3) {
        return 'yyyy';
      }
      return 'yyyy';
    },
    ...mapState({
      powerPlant: (state) => state.powerPlant.powerPlant,
      powerPlantId: (state) => state.powerPlant.powerPlantId
    })
  },
  watch: {},
  created() { },
  mounted() {
    this.getTotalPowerGeneration();
    this.getPowerGeneration();
  },
  methods: {
    getTotalPowerGeneration() {
      const data = {
        queryType: 'statistics',
        powerPlantId: this.$store.state.powerPlant.powerPlantId
      };
      this.$axios.get(Api.group.getPowerGeneration, data, (res) => {
        if (res.isSuccess) {
          this.totalPowerGeneration = res.data[0].totalPowerGeneration;
          this.loadChart();
        }
      });
    },
    fetchData() {
      this.loading = true;
      this.queryData.queryType = this.activeIdx == 1 ? 'DAY' : this.activeIdx == 2 ? 'MONTH' : this.activeIdx == 3 ? 'YEAR' : '';
      const url = this.queryData.deviceId ? Api.group.queryDeviceGenerationOfDate : Api.group.getPowerGeneration;
      this.$axios.get(url, this.queryData, (res) => {
        this.loading = false;
        if (res.isSuccess) {
          // 添加对比时间
          if (this.queryData.compareDate) {
            this.compareTableData = res.data;
            // 合并table
            this.chartTimeData = [];
            this.compareSeriesData = [];
            if (this.tableData.length) {
              this.pagination.total = res.data.length;
              this.tableData.forEach((item, key) => {
                let timer;
                if (this.activeIdx == 1) {
                  timer = `${item.periodTime.split(' ')[1]}${item.periodTime.split(' ')[2]}${item.periodTime.split(' ')[3]}`;
                } else {
                  timer = `${item.periodTime},${this.compareTableData[key].periodTime}`;
                }
                this.chartTimeData.push(timer);
                this.compareSeriesData.push(this.compareTableData[key].powerGeneration || 0);
                item.compareDate = this.compareTableData[key].periodTime;
                item.compareElectricity = this.compareTableData[key].powerGeneration;
              });
            } else {
              this.compareTableData.forEach((item, key) => {
                let timer;
                if (this.activeIdx == 1) {
                  timer = `${item.periodTime.split(' ')[1]}${item.periodTime.split(' ')[2]}${item.periodTime.split(' ')[3]}`;
                } else {
                  timer = `${item.periodTime},${this.tableData[key].periodTime}`;
                }
                this.chartTimeData.push(timer);
                this.compareSeriesData.push(item.powerGeneration || 0);
              });
              this.tableData = this.compareTableData;
              this.pagination.total = this.tableData.length;
            }
            this.loadChart();
          } else {
            // 拷贝table数据
            this.copyData = JSON.parse(JSON.stringify(res.data));
            this.tableData = res.data;
            this.pagination.total = res.data.length;
            this.seriesData = [];
            this.chartTimeData = [];
            this.tableData.forEach(item => {
              this.seriesData.push(item.powerGeneration);
              if (this.activeIdx == 1) {
                const timer = `${item.periodTime.split(' ')[1]}${item.periodTime.split(' ')[2]}${item.periodTime.split(' ')[3]}`;
                this.chartTimeData.push(timer);
              } else {
                this.chartTimeData.push(item.periodTime);
              }
              this.totalPowerGeneration = item.totalPowerGeneration; // 总发电量
            });
            this.loadChart();
          }
        }
      });
    },
    loadChart() {
      const myChart = this.$echarts.init(document.getElementById('groupWindPowePrediction'));
      const { chooseDate, compareDate } = this.queryData;
      const chartOption = {
        title: {
          text: `发电量`,
          textStyle: {
            color: '#333',
            fontSize: 12
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
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'line' // 默认为直线，可选为：'line' | 'shadow'
          }
          // formatter: `重要事件`
        },
        grid: {
          left: '3%',
          right: '4%',
          top: '40',
          bottom: '90',
          containLabel: true
        },
        dataZoom: [{
          type: 'slider',
          show: this.dataZoomVisible,
          startValue: 0,
          handleSize: '100%',
          backgroundColor: '#F4F9FF',
          borderColor: '#F4F9FF',
          showDataShadow: false,
          textStyle: {
            color: '#333'
          },
          handleStyle: {
            color: '#18ABFE',
            shadowBlur: 3,
            shadowColor: 'rgba(0, 0, 0, 0.6)',
            shadowOffsetX: 2,
            shadowOffsetY: 2,
            backgroundColor: '#3350D4',
            borderColor: '#3350D4'
          },
          bottom: 0
        }],
        legend: {
          orient: 'horizontal',
          selectedMode: false,
          bottom: 50,
          left: 'center',
          icon: 'circle',
          itemWidth: 10,
          itemHeight: 10,
          // textStyle: {
          //   color: '#fff'
          // },
          data: this.activeIdx == 1 && compareDate ? [`${timeWeekFormat(chooseDate, 'yyyy-MM-dd')}  发电量`, `${compareDate}  对比发电量`] : ['发电量', '对比发电量']
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.chartTimeData.map(function (str) {
            return str.replace(',', '\n');
          }),
          lineStyle: {
            color: '#18ABFE'
          },
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#333'
            },
            show: false
          }
        },
        yAxis: {
          type: 'value',
          splitLine: {
            lineStyle: {
              color: '#F4F4F4'
            }
          },
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#333'
            },
            show: false
          }
        },
        series: [
          {
            data: this.seriesData,
            name: this.activeIdx == 1 && compareDate ? `${timeWeekFormat(chooseDate, 'yyyy-MM-dd')}  发电量` : '发电量',
            type: 'line',
            // symbol: 'none', // 这句就是去掉点的
            areaStyle: {
              color: '#00A0E9',
              opacity: 0.3
            },
            lineStyle: {
              color: '#18ABFE'
            }
          },
          {
            data: this.compareSeriesData,
            name: this.activeIdx == 1 && compareDate ? `${compareDate}  对比发电量` : compareDate ? '对比发电量' : '',
            type: 'line',
            // symbol: 'none', // 这句就是去掉点的
            areaStyle: {
              color: '#22CCE2',
              opacity: 0.3
            },
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
    getPowerGeneration() {
      const data = {
        deviceType: '1',
        vendorName: '',
        deviceState: '',
        powerPlantId: this.powerPlantId,
        start: 1,
        size: 10000
      };
      this.$axios.post(Api.overview.queryFanDetail, data, (res) => {
        if (res.isSuccess) {
          this.fanList = res.data.data;
        }
      });
    },
    handleFans(val) {
      this.fetchData();
    },
    handleSelectDate(idx) {
      this.activeIdx = idx || 1;
      if (idx == 4) {
        this.dataZoomVisible = true;
      } else {
        this.dataZoomVisible = false;
      }
      this.queryData.compareDate = '';
      this.queryData.chooseDate = '';
      this.compareSeriesData = [];
      this.chartTimeData = [];
      if (this.checked) {
        this.checked = false;
      }
      this.pagination.start = 1;
      this.fetchData();
    },
    handleCheckboxChange(val) {
      if (!val) {
        this.queryData.compareDate = '';
        this.compareSeriesData = [];
        this.chartTimeData = [];
        this.fetchData();
      }
    },
    handleChooseDateChange(val) {
      this.compareSeriesData = [];
      this.chartTimeData = [];
      this.queryData.compareDate = '';
      this.pagination.start = 1;
      this.fetchData();
    },
    handleDateChange() {
      this.compareSeriesData = [];
      this.chartTimeData = [];
      this.pagination.start = 1;
      this.fetchData();
    },
    handleDownload() {
      // const queryType = this.activeIdx == 1 ? 'DAY' : this.activeIdx == 2 ? 'MONTH' : this.activeIdx == 3 ? 'YEAR' : '';
      // const params = `queryType=${queryType}&chooseDate=${this.queryData.chooseDate}&compareDate=${this.queryData.compareDate}&powerPlantId=${this.powerPlantId}`;
      // const url = `${this.baseUrl}powerGeneration/v1/exportData?exportModel=powerGeneration&${params}`;
      // window.location.href = url;
      const queryType = this.activeIdx == 1 ? 'DAY' : this.activeIdx == 2 ? 'MONTH' : this.activeIdx == 3 ? 'YEAR' : '';
      const str = this.queryData.deviceId
        ? `realTimeDatasDeviceAll/v1/exportData?exportModel=deviceGenerationOfDate&deviceId=${this.queryData.deviceId}&dateType=${queryType}`
        : `powerGeneration/v1/exportData?exportModel=powerGeneration&queryType=${queryType}&powerPlantId=${this.powerPlantId}`;
      const url = `${this.baseUrl}${str}&compareDate=${this.queryData.compareDate}&chooseDate=${this.queryData.chooseDate}`;
      window.location.href = url;
    }
  }

};
</script>

<style scoped lang="scss">
.data-overview-container {
  .title-container {
    padding: 0 20px;
    height: 60px;
    background: #ffffff;
  }
  .date-btn-group {
    margin-right: 80px;
  }
  .chart-container {
    height: 377px;
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
