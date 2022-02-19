<!--
 * @Author: JTune
 * @Description: 数据概览-故障排行-设备故障
 * @FilePath: \centralized-control-sys-web\src\views\overviewPage\faultOverviewDetails\index.vue
-->

<template>
  <div
    class="data-overview-container"
    v-loading='loading'
  >
    <div class="chart-container data-item-bg box-border">
      <div
        v-show="seriesData.length"
        id="faultOverviewDetails"
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
    <dy-table
      :keys="colKey"
      :loading="loading"
      :isPagination="false"
      :fetchData="fetchData"
      :pagination='pagination'
      :list='tableData'
      :showHeader="true"
      :data-overview-view="true"
      :actions='actions'
      class="box-border"
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
          @change="handleChange"
        >
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          >
          </el-option>
        </el-select>
        <el-input
          placeholder="请输入内容"
          v-model="key"
        >
          <i
            @click="handleSearch"
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
            <div class="grid-content"> <span> 厂商：</span> {{listDetails.manufactor}}</div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content"> <span>设备名称：</span> {{listDetails.deviceName}}</div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content"> <span>设备编码：</span> {{listDetails.deviceCode}}</div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content"> <span>设备类型：</span> {{listDetails.deviceType}}</div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content"> <span>故障次数：</span> {{listDetails.faultCount}}</div>
          </el-col>
          <el-col :span="24">
            <div class="grid-content"> <span>故障名称：</span> {{listDetails.faultPointItemCodeDesc}}</div>
          </el-col>
        </el-row>
      </div>
    </DetailsPopUp>
  </div>
</template>

<script>
import Api from '@/utils/api.js';
import { mapState } from 'vuex';
import DyTable from '@/components/DyTable';
import DetailsPopUp from '@/components/dialog/DetailsPopUp';
export default {
  name: '',
  components: { DyTable, DetailsPopUp },
  data() {
    return {
      activeIdx: 1,
      key: '',
      manufactor: '',
      checked: false,
      loading: false,
      dialogVisibleDetail: false,
      listDetails: [],
      actions: [
        {
          label: '查看',
          width: '90px',
          action: row => {
            this.editHandle(row);
          }
        }
      ],
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
      options: [{
        id: '',
        name: '',
        code: ''
      }],
      tableData: [],
      seriesData: [],
      legendData: [],
      pagination: {
        total: 0,
        start: 1,
        size: 20
      },
      colKey: {
        idx: {
          label: '序号',
          width: 90
        },
        manufactor: {
          label: '厂商',
          filters: this.filtersList
        },
        deviceName: '设备名称',
        deviceCode: '设备编码',
        deviceType: '设备类型',
        faultPointItemCodeDesc: {
          label: '故障名称',
          width: 390
        },
        faultCount: {
          label: '故障次数',
          width: 100,
          sortable: true
        }
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
    this.getManufactorLista();
    this.getFaultTypeStatistic();
  },
  methods: {
    fetchData() {
      this.getChartData();
    },
    // 查询故障详情数据
    getFaultTypeStatistic() {
      this.tableData = [];
      this.loading = true;
      const data = {
        // powerPlantId: this.powerPlantId,
        manufactor: this.manufactor,
        key: this.key,
        start: 1,
        size: 10000,
        powerPlantId: this.$store.state.powerPlant.powerPlantId
      };
      this.$axios.post(Api.group.faultTypeStatistic, data, (res) => {
        this.loading = false;
        if (res.isSuccess) {
          this.tableData = res.data;
          const starts = this.pagination.start - 1;
          const size = this.pagination.size;
          this.tableData.map((item, index) => {
            const idx = index + 1;
            item.idx = idx + starts * size;
          });
          this.pagination.total = res.data.length;
        }
      });
    },
    getChartData() {
      const data = {
        powerPlantId: this.$store.state.powerPlant.powerPlantId
      };
      this.seriesData = [];
      this.legendData = [];
      this.$axios.get(Api.group.faultTypeStatisticChart, data, (res) => {
        if (res.isSuccess) {
          const data = res.data;
          data.forEach(item => {
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
    // 厂商下拉框数据
    getManufactorLista() {
      const data = {};
      this.$axios.post(Api.overview.manufactorList, data, (res) => {
        if (res.isSuccess) {
          this.options = res.data;
        }
      });
    },
    handleChange(value) {
      this.manufactor = value;
      this.getFaultTypeStatistic();
    },
    editHandle(row) {
      this.listDetails = row;
      this.dialogVisibleDetail = true;
    },
    handleDialogVisibleDetail(val) {
      this.dialogVisibleDetail = val;
    },
    handleSelectDate(idx) {
      this.activeIdx = idx;

      // grid: {
      //   left: '3%',
      //   right: '4%',
      //   top: '13%',
      //   bottom: '50',
      //   containLabel: true
      // },
    },
    handleSearch() {
      this.pagination.start = 1;
      this.getFaultTypeStatistic();
    },
    loadChart() {
      const myChart = this.$echarts.init(document.getElementById('faultOverviewDetails'));
      const chartOption = {
        title: {
          text: '设备故障',
          textStyle: {
            color: '#333',
            fontSize: 12
          }
        },
        legend: {
          left: 'right',
          top: 'top',
          orient: 'vertical',
          itemWidth: 10,
          itemHeight: 10,
          selectedMode: false,
          textStyle: {
            color: '#333'
          },
          data: this.legendData
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        series: [
          {
            name: '设备故障',
            type: 'pie',
            center: ['50%', '50%'],
            radius: '50%',
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
    handleDownload() {
      const params = `key=${this.key}&manufactor=${this.manufactor}&start=1&size=10000`;
      const url = `${this.baseUrl}realTimeDatasFaultStatistic/v1/exportData?exportModel=faultTypeStatistic&${params}`;
      window.location.href = url;
    }
  }

};
</script>

<style scoped lang="scss">
.chart-container {
  height: 377px;
  padding: 20px;
  box-sizing: border-box;
  .empty-container {
    text-align: center;
    img {
      margin-top: 70px;
      width: 100px;
    }
    p {
      color: #909399;
      margin-top: 20px;
    }
  }
}
</style>
