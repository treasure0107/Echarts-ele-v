
<template>
  <div
    v-loading='loading'
    class="group-overview-container"
  >
    <div class="chart-container group-item-bg mt-20">
      <div
        v-show="seriesData.length"
        id="groupMalfunctionPreview"
        class="fill-h"
      ></div>
      <div
        v-show="!seriesData.length"
        class="empty-container"
      >
        <img
          src="@/assets/image/empty.png"
          alt=""
        >
        <p>暂无数据</p>
      </div>
    </div>
    <!--    showSerial 默认序号是否显示-->
    <dy-table
      :loading="loading"
      :isPagination="false"
      :actions="actions"
      :keys="colKey"
      :fetchData="fetchData"
      :pagination='pagination'
      :list='tableData'
      :showHeader="true"
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
          v-model="manufactor"
          clearable
          placeholder="请选择厂商"
          @change="fetchData"
          popper-class="group-select-option"
        >
          <el-option
            v-for="item in manufactorList"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          >
          </el-option>
        </el-select>
        <el-input
          class="mr-20"
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
      :is-black="true"
      @handleDialogVisibleDetail="handleDialogVisibleDetail"
    >
      <div
        class="dialog-content"
        slot="content"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="grid-content"> <span>厂商：</span> {{listDetails.manufactor}}</div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content"> <span>设备编码：</span> {{listDetails.deviceCode}}</div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content"> <span>设备名称：</span> {{listDetails.deviceName}}</div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content"> <span>设备类型：</span> {{listDetails.deviceType}}</div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content"> <span>故障次数：</span> {{listDetails.faultCount}}</div>
          </el-col>
          <el-col :span="24">
            <div> <span>故障名称：</span> {{listDetails.faultPointItemCodeDesc}}</div>
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
export default {
  name: '',
  components: { DyTable, DetailsPopUp },
  data() {
    return {
      loading: false,
      key: '',
      manufactor: '',
      dialogVisibleDetail: false,
      tableData: [],
      seriesData: [],
      legendData: [],
      pagination: {
        total: 0,
        start: 1,
        size: 20
      },
      manufactorList: [],
      colKey: {
        idx: '序号',
        manufactor: '厂商',
        deviceCode: '设备编码',
        deviceName: '设备名称',
        deviceType: '设备类型',
        faultPointItemCodeDesc: '故障名称',
        faultCount: {
          label: '故障次数',
          sortable: true
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
      ],
      listDetails: {
        manufactor: '',
        deviceCode: '',
        deviceName: '',
        deviceType: '',
        faultPointItemCodeDesc: '',
        faultCount: ''
      }
    };
  },
  computed: {

  },
  watch: {},
  created() { },
  mounted() {
    this.getChartData();
    this.getManufactorLista();
  },
  methods: {
    fetchData() {
      this.tableData = [];
      this.loading = true;
      const data = {
        key: this.key,
        manufactor: this.manufactor,
        start: 1,
        size: 10000
      };
      this.$axios.post(Api.group.faultTypeStatistic, data, (res) => {
        this.loading = false;
        if (res.isSuccess) {
          const starts = this.pagination.start - 1;
          const size = this.pagination.size;
          res.data.map((item, index) => {
            const idx = index + 1;
            item.idx = idx + starts * size;
          });
          this.tableData = res.data;
          this.pagination.total = res.total;
        }
      });
    },
    getChartData() {
      const data = {};
      this.$axios.get(Api.group.faultTypeStatisticChart, data, (res) => {
        if (res.isSuccess) {
          this.seriesData = [];
          this.legendData = [];
          res.data.forEach(item => {
            const obj = {
              name: item.faultPointItemCodeDesc,
              value: item.faultCount
            };
            this.seriesData.push(obj);
            this.legendData.push(item.faultPointItemCodeDesc);
          });
          setTimeout(() => {
            this.loadChart();
          }, 100);
        }
      });
    },
    loadChart() {
      const myChart = this.$echarts.init(document.getElementById('groupMalfunctionPreview'));
      const chartOption = {
        title: {
          text: '设备故障',
          textStyle: {
            color: '#C8C9CC',
            fontSize: 12
          }
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          selectedMode: false,
          right: 100,
          top: 20,
          bottom: 20,
          itemWidth: 10,
          itemHeight: 10,
          textStyle: {
            color: '#C8C9CC'
          },
          data: this.legendData
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
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
        series: [
          {
            name: '设备故障',
            type: 'pie',
            radius: '50%',
            center: ['50%', '50%'],
            // radius: [20, 110],
            // roseType: 'radius',
            label: {
              show: false
            },
            emphasis: {
              label: {
                show: true
              }
            },
            color: ['#18ABFE', '#FF3D57', '#22CCE2', '#5EFDAD', '#FDBF5E', '#835EFD'], // 修改颜色
            data: this.seriesData
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
    getManufactorLista() {
      const data = {};
      this.$axios.post(Api.overview.manufactorList, data, (res) => {
        if (res.isSuccess) {
          this.manufactorList = res.data;
        }
      });
    },
    handleSelectDate(idx) {
      this.activeIdx = idx;
    },
    search() {
      this.pagination.start = 1;
      this.fetchData();
    },
    editHandle(row) {
      this.listDetails = row;
      this.dialogVisibleDetail = true;
    },
    handleDialogVisibleDetail(val) {
      this.dialogVisibleDetail = val;
    },
    handleDownload() {
      const params = `key=${this.key}&manufactor=${this.manufactor}&start=1&size=10000`;
      const url = `${this.baseUrl}realTimeDatasFaultStatistic/v1/exportData?exportModel=faultTypeStatistic&${params}`;
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
    height: 288px;
    padding: 20px;
    box-sizing: border-box;
    .empty-container {
      text-align: center;
      img {
        margin-top: 50px;
        width: 100px;
      }
      p {
        color: #909399;
        margin-top: 20px;
      }
    }
  }
  .group-malfunction-preview {
    height: calc(100% - 43px);
  }
}
.dialog-content {
  min-height: 160px;
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .grid-content {
    font-size: 14px;
    height: 19px;
    line-height: 19px;
    padding-bottom: 30px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #ffffff;
  }
}
</style>
