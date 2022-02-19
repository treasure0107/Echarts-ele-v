
<template>
  <div
    v-loading='loading'
    class="group-overview-container"
  >
    <div class="title-container flex-box flex-align-center">
      <el-select
        class="mr-20 select-date-format"
        v-model="activeIdx"
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
        @change='handleChooseDateChange'
        :disabled='this.activeIdx==4'
        class="group-select-picker mr-20"
        v-model="queryData.chooseDate"
        :picker-options="pickerOptions"
        :type="activeIdx == 1?'date':activeIdx == 2?'month':'year'"
        :placeholder="activeIdx == 1?'选择日期':activeIdx == 2?'选择月份':'选择年份'"
        :value-format="valueFormat"
        popper-class="group-select-picker"
      >
      </el-date-picker>
      <div class="mr-20">
        <el-checkbox
          v-model="checked"
          :disabled="activeIdx == 4 || checkedPowerPlant"
          @change="handleCheckboxChange"
        >对比时间段</el-checkbox>
      </div>
      <el-date-picker
        v-if="checked"
        :clearable="false"
        @change='handleDateChange'
        class="group-select-picker mr-20"
        v-model="queryData.compareDate"
        :picker-options="pickerOptions"
        :type="activeIdx == 1?'date':activeIdx == 2?'month':'year'"
        :placeholder="activeIdx == 1?'选择日期':activeIdx == 2?'选择月份':'选择年份'"
        :value-format="valueFormat"
        popper-class="group-select-picker"
      >
      </el-date-picker>
      <div>
        <span>风电场：</span>
        <el-select
          class="mr-20"
          v-model="queryData.powerPlantId"
          clearable
          placeholder="请选择"
          popper-class="group-select-option"
          @change="handlePowerPlant"
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
      <div class="mr-20">
        <el-checkbox
          v-model="checkedPowerPlant"
          @change="handleChangePowerPlant"
          :disabled="!queryData.powerPlantId || checked"
        >对比风电场</el-checkbox>
      </div>
      <div v-if="checkedPowerPlant">
        <el-select
          class="mr-20"
          v-model="queryData.comparePlantId"
          clearable
          placeholder="请选择对比的风电场"
          popper-class="group-select-option"
          @change="handlePowerPlantChange"
        >
          <el-option
            v-for="item in nodeDistributionWindList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </div>
      <div>
        <span>风机：</span>
        <el-select
          class="mr-20"
          v-model="queryData.deviceId"
          clearable
          placeholder="请选择"
          popper-class="group-select-option"
          @change="handleFans"
          :disabled="!queryData.powerPlantId || checkedPowerPlant"
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
    <div class="chart-container group-item-bg mt-20">
      <div
        id="groupWindPowePrediction"
        class="fill-h"
      ></div>
    </div>
    <dy-table
      v-if="queryData.compareDate"
      :loading="loading"
      :keys="colKey2"
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
    <dy-table
      v-else-if="queryData.comparePlantId"
      :loading="loading"
      :isPagination="false"
      :keys="colKey3"
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
    <dy-table
      v-else
      :loading="loading"
      :isPagination="false"
      :keys="colKey"
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
import { timeWeekFormat } from '@/utils/utils';
export default {
  name: '',
  components: { DyTable },
  data() {
    return {
      activeIdx: 1,
      queryData: {
        queryType: '',
        powerPlantId: '',
        compareDate: '',
        chooseDate: '',
        comparePlantId: ''
      },
      checked: false,
      checkedPowerPlant: false,
      loading: false,
      dataZoomVisible: false, // 是否展示时间轴
      totalPowerGeneration: 0,
      nodeDistributionList: [],
      nodeDistributionWindList: [],
      tableData: [],
      copyData: [],
      compareTableData: [],
      seriesData: [],
      compareSeriesData: [],
      chartTimeData: [],
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
      fanList: [],
      deviceId: '',
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
      },
      colKey3: {
        /**
         * 表头内容与后端字段一一对应
         */
        periodTime: '日期',
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
    }
  },
  watch: {},
  created() { },
  mounted() {
    this.getNodeDistribution();
    this.getTotalPowerGeneration();
  },
  methods: {
    handlePowerPlant(val) {
      this.getPowerGeneration(val);
      this.fetchData();
      this.nodeDistributionWindList = this.nodeDistributionList.filter(item => {
        if (item.id != val) return item;
      });
    },
    handlePowerPlantChange(val) {
      this.getPowerGeneration(val);
      this.fetchData();
    },
    handleFans(val) {
      this.fetchData();
    },
    handleDownload() {
      const queryType = this.activeIdx == 1 ? 'DAY' : this.activeIdx == 2 ? 'MONTH' : this.activeIdx == 3 ? 'YEAR' : '';
      const str = this.queryData.deviceId
        ? `realTimeDatasDeviceAll/v1/exportData?exportModel=deviceGenerationOfDate&deviceId=${this.queryData.deviceId}&dateType=${queryType}`
        : `powerGeneration/v1/exportData?exportModel=powerGeneration&queryType=${queryType}`;
      const url = `${this.baseUrl}${str}&compareDate=${this.queryData.compareDate}&chooseDate=${this.queryData.chooseDate}&comparePlantId=${this.queryData.comparePlantId}`;
      window.location.href = url;
    },
    getPowerGeneration(val) {
      const data = {
        deviceType: '1',
        vendorName: '',
        deviceState: '',
        powerPlantId: val,
        start: 1,
        size: 10000
      };
      this.$axios.post(Api.overview.queryFanDetail, data, (res) => {
        if (res.isSuccess) {
          this.fanList = res.data.data;
        }
      });
    },
    getTotalPowerGeneration() {
      const data = {
        queryType: 'statistics'
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
          if (this.queryData.compareDate || this.queryData.comparePlantId) {
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
            });
            this.loadChart();
          }
        }
      });
    },
    loadChart() {
      const myChart = this.$echarts.init(document.getElementById('groupWindPowePrediction'));
      const { chooseDate, compareDate, comparePlantId } = this.queryData;
      const chartOption = {
        title: {
          text: `发电量`,
          textStyle: {
            color: '#C8C9CC',
            fontSize: 12
          }
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
        color: ['#18ABFE', '#22CCE2'],
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'line' // 默认为直线，可选为：'line' | 'shadow'
          }
          // formatter: `重要事件`
        },
        grid: {
          left: '4%',
          right: '4%',
          top: '40',
          bottom: '80',
          containLabel: true
        },
        dataZoom: [
          {
            type: 'slider',
            show: this.dataZoomVisible,
            startValue: 0,
            handleSize: '100%',
            backgroundColor: 'rgba(32,44,96,1)',
            borderColor: '#202C60',
            textStyle: {
              color: '#C8C9CC'
            },

            handleStyle: {
              color: '#0B3C6F',
              shadowBlur: 3,
              shadowColor: 'rgba(0, 0, 0, 0.6)',
              shadowOffsetX: 2,
              shadowOffsetY: 2
            },
            bottom: '10px'
          }
        ],
        legend: {
          orient: 'horizontal',
          bottom: 50,
          left: 'center',
          icon: 'circle',
          itemWidth: 10,
          itemHeight: 10,
          selectedMode: false,
          textStyle: {
            color: '#C8C9CC'
          },
          data: this.activeIdx == 1 && compareDate ? [`${timeWeekFormat(chooseDate, 'yyyy-MM-dd')}  发电量`, `${compareDate}  对比发电量`] : ['发电量', '对比发电量']
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.chartTimeData.map(function (str) {
            return str.replace(',', '\n');
          }),
          lineStyle: {
            color: '#C8C9CC'
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
            name: this.activeIdx == 1 && compareDate ? `${compareDate}  对比发电量` : compareDate ? '对比发电量' : comparePlantId ? '对比发电量' : '',
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
    // 获取风电场列表
    getNodeDistribution() {
      const data = {};
      this.$axios.post(Api.group.getNodeDistribution, data, (res) => {
        if (res.isSuccess) {
          this.nodeDistributionList = res.data;
        }
      });
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
      this.getTotalPowerGeneration();
    },
    handleCheckboxChange(val) {
      if (!val) {
        this.queryData.compareDate = '';
        this.compareSeriesData = [];
        this.chartTimeData = [];
        this.fetchData();
        this.getTotalPowerGeneration();
      }
      this.queryData.comparePlantId = '';
    },
    handleChangePowerPlant(val) {
      if (!val) {
        this.compareSeriesData = [];
        this.chartTimeData = [];
        this.fetchData();
        this.getTotalPowerGeneration();
      }
      this.queryData.compareDate = '';
      this.queryData.deviceId = '';
    },
    handleChooseDateChange() {
      this.compareSeriesData = [];
      this.chartTimeData = [];
      this.queryData.compareDate = '';
      this.fetchData();
      this.getTotalPowerGeneration();
    },
    handleDateChange() {
      this.compareSeriesData = [];
      this.chartTimeData = [];
      this.fetchData();
      this.getTotalPowerGeneration();
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
