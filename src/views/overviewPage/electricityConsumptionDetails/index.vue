
<template>
  <div
    v-loading='loading'
    class="data-overview-container"
  >
    <div class="title-container flex-box flex-align-center">
      <el-select
        class="mr-20 select-date-format"
        v-model="dateType"
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
        @change='handleDateChange'
        class="data-select-picker mr-20"
        v-model="compareDate"
        :picker-options="pickerOptions"
        :type="dateType == 'DAY'?'date':dateType == 'MONTH'?'month':'year'"
        :placeholder="dateType == 'DAY'?'选择日期':dateType == 'MONTH'?'选择月份':'选择年份'"
        popper-class="data-select-picker"
        :value-format="valueFormat"
      >
      </el-date-picker>
    </div>
    <div class="chart-container data-item-bg mt-20 box-border">

      <div
        id="groupMalfunctionPreview"
        class="group-malfunction-preview mt-10"
      ></div>
    </div>
    <dy-table
      :keys="colKey"
      :loading="loading"
      :fetchData="fetchData"
      :pagination='pagination'
      :list='tableData'
      :showHeader="true"
      :showPagination="false"
      :data-overview-view="true"
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
import { mapState } from 'vuex';
import { timeWeekFormat } from '@/utils/utils';
export default {
  name: '',
  components: { DyTable },
  data() {
    return {
      dateType: 'DAY',
      key: '',
      faultType: '',
      compareDate: '',
      startDate: '',
      endDate: '',
      checked: false,
      loading: false,
      dialogVisibleDetail: false,
      isBlack: true,
      tableData: [],
      chartData: {
        equivalentUtilizationHours: 0
      },
      dateData: [
        {
          idx: 'DAY',
          val: '日'
        },
        {
          idx: 'MONTH',
          val: '月'
        },
        {
          idx: 'YEAR',
          val: '年'
        }
      ],
      pagination: {
        total: 0,
        start: 1,
        size: 10
      },
      pickerOptions: {
        disabledDate: (time) => {
          // 日
          if (this.dateType == 1) {
            return time.getTime() > Date.now() - 8.64e7;
          } else if (this.dateType == 2) { // 月
            const data = new Date();
            data.setDate(1);
            data.setHours(0);
            data.setSeconds(0);
            data.setMinutes(0);
            return time.getTime() > data.getTime();
          } else if (this.dateType == 3) { // 年
            const data = new Date();
            data.setDate(1);
            data.setMonth(0);
            return time.getTime() > data.getTime();
          }
        }
      },
      colKey: {
        date: '日期',
        equivalentUtilizationHours: '等效利用小时(h)'
        // theoreticalEquivalentUtilizationHours: '理论等效利用小时(h)'
      }
    };
  },
  computed: {
    ...mapState({
      powerPlantId: state => state.powerPlant.powerPlantId
    }),
    valueFormat: function () {
      if (this.dateType == 'DAY') {
        return 'yyyy-MM-dd';
      } else if (this.dateType == 'MONTH') {
        return 'yyyy-MM';
      } else if (this.dateType == 'YEAR') {
        return 'yyyy';
      }
      return 'yyyy';
    }
  },
  watch: {},
  created() { },
  mounted() {
    // this.getChartData();
    // this.loadChart();
  },
  methods: {
    fetchData() {
      this.tableData = [];
      this.loading = true;
      const data = {
        queryType: this.dateType,
        periodTime: this.compareDate,
        powerPlantId: this.powerPlantId,
        start: this.pagination.start,
        size: this.pagination.size
      };
      this.$axios.get(Api.overview.realTimeDatasPowerPlantHourStatistics, data, (res) => {
        this.loading = false;
        if (res.isSuccess) {
          this.tableData = res.data;
          this.chartData = res.data[0];
          this.pagination.total = res.total;
          this.loadChart();
        }
      });
    },
    getChartData() {
      const data = {
        periodTime: this.compareDate,
        powerPlantId: this.powerPlantId
      };
      this.$axios.get(Api.overview.realTimeDatasPowerPlantHourStatistics, data, (res) => {
        if (res.isSuccess) {
          this.chartData = res.data[0];
          this.loadChart();
        }
      });
    },
    loadChart() {
      const myChart = this.$echarts.init(document.getElementById('groupMalfunctionPreview'));
      const chartOption = {
        title: {
          text: `风电场等效利用小时`,
          textStyle: {
            color: '#333',
            fontSize: 12
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c}'
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
        grid: {
          left: 0
        },
        legend: {
          orient: 'horizontal',
          selectedMode: false,
          bottom: 0,
          left: 'center',
          itemWidth: 10,
          itemHeight: 10,
          textStyle: {
            color: '#333'
          },
          data: ['等效利用小时']
        },
        graphic: {
          type: 'text',
          left: 'center',
          top: '40%',
          style: {
            text: `${this.chartData.equivalentUtilizationHours}h`,
            textAlign: 'center',
            fill: '#333',
            fontSize: 16,
            fontWeight: 400
          }
        },
        series: [
          {
            name: '风电场等效利用小时',
            type: 'pie',
            radius: ['50%', '70%'],
            center: ['50%', '40%'],
            avoidLabelOverlap: false,
            hoverAnimation: false,
            color: ['#22CCE2'], // 修改颜色
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
              { value: this.chartData.equivalentUtilizationHours || null, name: '等效利用小时' },
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
    },
    handleSelectDate(idx) {
      this.dateType = idx || 'DAY';
      if (idx != 5) {
        this.compareDate = '';
      } else {
        return;
      }
      // this.getChartData();
      this.fetchData();
    },
    search() {
      this.pagination.start = 1;
      this.fetchData();
      // this.getChartData();
    },
    editHandle(row) {
      this.listDetails = row;
      this.dialogVisibleDetail = true;
    },
    handleDialogVisibleDetail(val) {
      this.dialogVisibleDetail = val;
    },
    handleDateChange() {
      this.startDate = timeWeekFormat(this.compareDate[0], 'yyyy-MM-dd');
      this.endDate = timeWeekFormat(this.compareDate[1], 'yyyy-MM-dd');
      this.search();
    },
    handleDownload() {
      const url = `${this.baseUrl}realTimeDatasPowerPlant/v1/exportData?exportModel=multipleUsedElectricity&dateType=${this.dateType}&chooseDate=${this.compareDate}&start=${this.pagination.start}&size=${this.pagination.size}&powerPlantId=${this.powerPlantId}`;
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
    // border: 1px solid #dcdfe4;
  }
  .date-btn-group {
    margin-right: 80px;
  }
  .chart-container {
    height: 288px;
    padding: 20px;
    box-sizing: border-box;
    color: #333;
  }
  .group-malfunction-preview {
    height: calc(100% - 43px);
  }
  .select-date-format {
    ::v-deep .el-input {
      width: 90px;
    }
  }
}
</style>
