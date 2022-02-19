
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
        @change='handleChooseDateChange'
        :disabled='this.dateType==4 || this.dateType==5'
        class="group-select-picker mr-20"
        v-model="chooseDate"
        :picker-options="pickerOptions"
        :type="dateType == 1?'date':dateType == 2?'month':'year'"
        :placeholder="dateType == 1?'选择日期':dateType == 2?'选择月份':'选择年份'"
        :value-format="valueFormat"
        popper-class="group-select-picker"
      >
      </el-date-picker>
      <el-date-picker
        v-if="dateType == 5"
        v-model="compareDate"
        :clearable="false"
        type="daterange"
        @change='handleDateChange'
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      >
      </el-date-picker>
    </div>
    <div class="chart-container data-item-bg mt-20 box-border">
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="text-center">
            <div class="font-18">{{chartData.faultDuration}} h</div>
            <div class="mt-5">故障时长</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="text-center">
            <div class="font-18">{{chartData.faultCount+chartData.warnCount}} 次</div>
            <div class="mt-5">故障次数</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="text-center">
            <div class="font-18">{{chartData.lossOfElectricity}} 万kWh</div>
            <div class="mt-5">故障损失</div>
          </div>
        </el-col>
      </el-row>
      <div
        id="groupMalfunctionPreview"
        class="group-malfunction-preview mt-10"
      ></div>
    </div>
    <dy-table
      :keys="colKey"
      :loading="loading"
      :fetchData="fetchData"
      :actions="actions"
      :pagination='pagination'
      :list='tableData'
      :showHeader="true"
      :data-overview-view="true"
    >
      <div
        slot="header"
        class="mb-20"
      >
        <el-button
          type="primary"
          class="mr10 export-btn"
          @click="handleDownload"
        >导出</el-button>
        <el-select
          class="mr-20"
          v-model="faultType"
          clearable
          placeholder="请选择故障类型"
          @change="search"
        >
          <el-option
            v-for="item in faultTypeList"
            :key="item.id"
            :label="item.val"
            :value="item.id"
          >
          </el-option>
        </el-select>
        <el-input
          placeholder="请输入内容"
          v-model="key"
        >
          <i
            @click="search"
            slot="suffix"
            class="el-input__icon el-icon-search"
          ></i>
        </el-input>
      </div>
    </dy-table>
    <DetailsPopUp
      v-if="dialogVisibleDetail"
      :dialog-visible-detail="dialogVisibleDetail"
      @handleDialogVisibleDetail="handleDialogVisibleDetail"
    >
      <div
        class="dialog-content"
        slot="content"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="grid-content"> <span>设备编码：</span> {{listDetails.deviceCode}}</div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content"> <span>设备名称：</span> {{listDetails.deviceName}}</div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content"> <span>故障类型：</span> {{listDetails.faultType}}</div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content"> <span>故障时长：</span> {{listDetails.faultDuration}}</div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content"> <span>损失电量：</span> {{listDetails.lossOfElectricity}}</div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content"> <span>开始时间：</span> {{listDetails.startTime}}</div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content"> <span>结束时间：</span> {{listDetails.endTime || '-'}}</div>
          </el-col>
          <el-col :span="24">
            <div class="grid-content"> <span>故障描述：</span> {{listDetails.faultPointItemCodeDesc}}</div>
          </el-col>
        </el-row>
      </div>
    </DetailsPopUp>
  </div>
</template>

<script>
import Api from '@/utils/api.js';
import DyTable from '@/components/DyTable';
import DetailsPopUp from '@/components/dialog/DetailsPopUp';
import { mapState } from 'vuex';
import { timeWeekFormat } from '@/utils/utils';
export default {
  name: '',
  components: { DyTable, DetailsPopUp },
  data() {
    return {
      dateType: 1,
      key: '',
      faultType: '',
      compareDate: '',
      startDate: '',
      endDate: '',
      chooseDate: '',
      checked: false,
      loading: false,
      dialogVisibleDetail: false,
      isBlack: true,
      tableData: [],
      chartData: {
        faultDuration: 0,
        faultCount: 0,
        lossOfElectricity: 0,
        warnCount: 0
      },
      listDetails: {
        powerPlant: '',
        deviceCode: '',
        deviceName: '',
        faultType: '',
        faultDuration: '',
        lossOfElectricity: '',
        startTime: '',
        endTime: '',
        faultPointItemCodeDesc: ''
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
        },
        {
          idx: 5,
          val: '自定义'
        }
      ],
      faultTypeList: [
        {
          id: '故障',
          val: '设备故障'
        },
        {
          id: '告警',
          val: '告警信息'
        }
      ],
      pagination: {
        total: 0,
        start: 1,
        size: 20
      },
      colKey: {
        idx: '序号',
        powerPlantName: {
          label: '风电场',
          handle: function (scope, createElement) {
            if (scope.row.endTime) {
              return createElement('span',
                {}, scope.row.powerPlantName);
            } else {
              return createElement('span', {
                style: {
                  color: '#FF3D57'
                }
              }, scope.row.powerPlantName);
            }
          }
        },
        deviceCode: {
          label: '编号',
          handle: function (scope, createElement) {
            if (scope.row.endTime) {
              return createElement('span', scope.row.deviceCode);
            } else {
              return createElement('span', {
                style: {
                  color: '#FF3D57'
                }
              }, scope.row.deviceCode);
            }
          }
        },
        deviceName: {
          label: '设备名称',
          handle: function (scope, createElement) {
            if (scope.row.endTime) {
              return createElement('span', scope.row.deviceName);
            } else {
              return createElement('span', {
                style: {
                  color: '#FF3D57'
                }
              }, scope.row.deviceName);
            }
          }
        },
        faultType: {
          label: '故障类型',
          handle: function (scope, createElement) {
            if (scope.row.endTime) {
              return createElement('span', scope.row.faultType);
            } else {
              return createElement('span', {
                style: {
                  color: '#FF3D57'
                }
              }, scope.row.faultType);
            }
          }
        },
        faultPointItemCodeDesc: {
          label: '故障描述',
          handle: function (scope, createElement) {
            if (scope.row.endTime) {
              return createElement('span', scope.row.faultPointItemCodeDesc);
            } else {
              return createElement('span', {
                style: {
                  color: '#FF3D57'
                }
              }, scope.row.faultPointItemCodeDesc);
            }
          }
        },
        faultDuration: {
          label: '故障时长(h)',
          sortable: true,
          handle: function (scope, createElement) {
            if (scope.row.endTime) {
              return createElement('span', scope.row.faultDuration);
            } else {
              return createElement('span', {
                style: {
                  color: '#FF3D57'
                }
              }, scope.row.faultDuration);
            }
          }
        },
        lossOfElectricity: {
          label: '损失电量（万kWh）',
          sortable: true,
          handle: function (scope, createElement) {
            if (scope.row.endTime) {
              return createElement('span', scope.row.lossOfElectricity);
            } else {
              return createElement('span', {
                style: {
                  color: '#FF3D57'
                }
              }, scope.row.lossOfElectricity);
            }
          }
        },
        startTime: {
          label: '开始时间',
          handle: function (scope, createElement) {
            if (scope.row.endTime) {
              return createElement('span', scope.row.startTime);
            } else {
              return createElement('span', {
                style: {
                  color: '#FF3D57'
                }
              }, scope.row.startTime);
            }
          }
        },
        endTime: {
          label: '结束时间',
          handle: function (scope, createElement) {
            if (scope.row.endTime) {
              return createElement('span', scope.row.endTime);
            } else {
              return createElement('span', {
                style: {
                  color: '#FF3D57'
                }
              }, '-');
            }
          }
        }
      },
      actions: [
        {
          width: '60px',
          label: '查看',
          action: row => {
            this.editHandle(row);
          }
        }
      ]
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
    this.getChartData();
    this.loadChart();
  },
  methods: {
    handleChooseDateChange(val) {
      this.search();
    },
    fetchData() {
      this.tableData = [];
      this.loading = true;
      const data = {
        key: this.key,
        faultType: this.faultType,
        startDate: this.startDate,
        endDate: this.endDate,
        chooseDate: this.chooseDate,
        dateType: this.dateType == 1 ? 'DAY' : this.dateType == 2 ? 'MONTH' : this.dateType == 3 ? 'YEAR' : '',
        powerPlantId: this.powerPlantId,
        start: this.pagination.start,
        size: this.pagination.size
      };
      this.$axios.post(Api.group.faultDetails, data, (res) => {
        this.loading = false;
        if (res.isSuccess) {
          this.tableData = res.data;
          const starts = this.pagination.start - 1;
          const size = this.pagination.size;
          this.tableData.map((item, index) => {
            const idx = index + 1;
            item.idx = idx + starts * size;
          });
          this.pagination.total = res.total;
        }
      });
    },
    getChartData() {
      const data = {
        startDate: this.startDate,
        endDate: this.endDate,
        dateType: this.dateType == 1 ? 'DAY' : this.dateType == 2 ? 'MONTH' : this.dateType == 3 ? 'YEAR' : '',
        powerPlantId: this.powerPlantId
      };
      this.$axios.get(Api.group.faultOverview, data, (res) => {
        if (res.isSuccess) {
          this.chartData = res.data;
          this.loadChart();
        }
      });
    },
    loadChart() {
      const myChart = this.$echarts.init(document.getElementById('groupMalfunctionPreview'));
      const chartOption = {
        title: {
          text: '故障总览',
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
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
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
          data: ['告警信息', '设备故障']
        },
        series: [
          {
            name: '故障总览',
            type: 'pie',
            radius: ['50%', '70%'],
            center: ['50%', '40%'],
            avoidLabelOverlap: false,
            hoverAnimation: false,
            color: ['#22CCE2', '#FF3D57', '#18ABFE'], // 修改颜色
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
              { value: this.chartData.warnCount || null, name: '告警信息' },
              { value: this.chartData.faultCount || null, name: '设备故障' },
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
      this.dateType = idx || 1;
      if (idx != 5) {
        this.compareDate = '';
        this.startDate = '';
        this.endDate = '';
      } else {
        return;
      }
      this.getChartData();
      this.fetchData();
    },
    search() {
      this.pagination.start = 1;
      this.fetchData();
      this.getChartData();
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
      const dateType = this.dateType == 1 ? 'DAY' : this.dateType == 2 ? 'MONTH' : this.dateType == 3 ? 'YEAR' : '';
      const params = `key=${this.key}&dateType=${dateType}&startDate=${this.startDate}&endDate=${this.endDate}&chooseDate=${this.chooseDate}&faultType=${this.faultType}&start=1&size=10000&powerPlantId=${this.powerPlantId}`;
      const url = `${this.baseUrl}realTimeDatasFaultStatistic/v1/exportData?exportModel=faultDetails&${params}`;
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
