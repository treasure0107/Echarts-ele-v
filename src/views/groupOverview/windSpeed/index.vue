
<template>
  <div
    v-loading='loading'
    class="group-overview-container"
  >
    <div class="title-container flex-box flex-align-center">
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
    </div>
    <div class="chart-container group-item-bg mt-20">
      <div
        id="groupWindSpeedChart"
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
export default {
  name: '',
  components: { DyTable },
  data() {
    const that = this;
    return {
      loading: false,
      queryType: 'DAY',
      chooseDate: '',
      tableData: [],
      normalSpeed: 0,
      overSpeed: 0,
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
        },
        {
          idx: '',
          val: '全部'
        }
      ],
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
      pagination: {
        total: 0,
        start: 1,
        size: 20
      },
      colKey: {
        name: {
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
        avgWindSpeed: '平均风速(m/s)',
        windSpeedStatus: {
          label: '状态',
          handle: function (scope, createElement) {
            if (scope.row.windSpeedStatus == 'normal') {
              return createElement('span', '正常');
            } else {
              return createElement('span', {
                style: {
                  color: '#FFA81F'
                }
              }, '超速');
            }
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
  mounted() {
    this.getAvgWindSpeedPercent();
  },
  methods: {
    fetchData() {
      this.tableData = [];
      this.loading = true;
      const data = {
        chooseDate: this.chooseDate,
        start: 1,
        size: 10000
      };
      this.$axios.get(Api.group.getWindSpeed, data, (res) => {
        this.loading = false;
        if (res.isSuccess) {
          this.tableData = res.data;
          this.pagination.total = res.data.length;
        }
      });
    },
    loadChart() {
      const myChart = this.$echarts.init(document.getElementById('groupWindSpeedChart'));
      const chartOption = {
        title: {
          text: `风电场平均风速`,
          textStyle: {
            color: '#C8C9CC',
            fontSize: 12
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
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
          bottom: 0,
          left: 'center',
          itemWidth: 10,
          itemHeight: 10,
          selectedMode: false,
          textStyle: {
            color: '#C8C9CC'
          },
          data: ['正常', '超速']
        },
        series: [
          {
            name: '风电场平均风速',
            type: 'pie',
            radius: ['50%', '70%'],
            center: ['50%', '40%'],
            avoidLabelOverlap: false,
            hoverAnimation: false,
            color: ['#22CCE2', '#FEBA02', '#18ABFE'], // 修改颜色
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '16',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: this.normalSpeed || null, name: '正常' },
              { value: this.overSpeed || null, name: '超速' },
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
    getAvgWindSpeedPercent() {
      const data = {
        chooseDate: this.chooseDate
      };
      this.$axios.get(Api.group.getAvgWindSpeedPercent, data, (res) => {
        if (res.isSuccess) {
          this.normalSpeed = res.data.normal;
          this.overSpeed = res.data.over;
          this.loadChart();
        }
      });
    },
    handleDateChange(val) {
      this.normalSpeed = 0;
      this.overSpeed = 0;
      this.pagination.start = 1;
      this.fetchData();
    },
    handleRowClick(row) {
      this.$store.commit('CHANGE_POWER_PLANT_ID', row.powerPlantId);
      this.$store.commit('CHANGE_POWER_PLANT', row.powerPlant);
      this.$router.push({ path: '/dataOverview' });
    },
    handleDownload() {
      const url = `${this.baseUrl}powerGeneration/v1/exportData?exportModel=windSpeed&chooseDate=${this.chooseDate}`;
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
    height: 250px;
    padding: 20px;
    box-sizing: border-box;
  }
  .select-date-format {
    ::v-deep .el-input {
      width: 90px !important;
    }
  }
}
</style>
