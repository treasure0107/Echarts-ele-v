<!--
 * @Author: JTune
 * @Description: 数据概览-运行状态
 * @FilePath: \centralized-control-sys-web\src\views\overviewPage\runCondition\index.vue
-->
<template>
  <div
    class="data-overview-container"
    v-loading='loading'
  >
    <!-- <div class="chart-container group-item-bg mt-20"></div> -->
    <dy-table
      :keys="colKey"
      :loading="loading"
      :fetchData="fetchData"
      :pagination='pagination'
      :list='tableData'
      :actions="deviceType == 1?actions:[]"
      :showHeader="true"
      :data-overview-view="true"
      class="box-border"
    >
      <div
        slot="header"
        class="mb-20"
      >
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
            :value="item.id"
          >
          </el-option>
        </el-select>
        <el-select
          class="mr-20"
          v-model="deviceState"
          clearable
          placeholder="请选择运行状态"
          @change="handleChangeState"
        >
          <el-option
            v-for="item in list"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
    </dy-table>
  </div>
</template>

<script>
import Api from '@/utils/api.js';
import { mapState } from 'vuex';
import DyTable from '@/components/DyTable';
export default {
  name: '',
  components: { DyTable },
  data() {
    return {
      activeIdx: 1,
      deviceType: '1',
      deviceState: '',
      manufactor: '',
      checked: false,
      loading: false,
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
      actions: [
        {
          width: '60px',
          label: '查看',
          action: row => {
            this.editHandle(row);
          }
        }
      ],
      options: [],
      list: [{
        value: '1',
        label: '运行'
      }, {
        value: '2',
        label: '检修'
      }, {
        value: '3',
        label: '故障'
      }, {
        value: '4',
        label: '告警'
      }],
      tableData: [],
      pagination: {
        total: 0,
        start: 1,
        size: 20
      },
      /**
         * 表头内容与后端字段一一对应
         */
      colKey: {
        deviceCode: '设备编码',
        manufactorName: { label: '厂商' },
        deviceName: '设备名称',
        typeName: '设备类型',
        runningStatus: {
          label: '运行状态',
          handle: function (scope, createElement) {
            if (scope.row.runningStatus == 1) {
              return createElement('span', '运行');
            } else if (scope.row.runningStatus == 2) {
              return createElement('span', {
                style: {
                  color: '#fdbf5e'
                }
              }, '检修');
            } else if (scope.row.runningStatus == 3) {
              return createElement('span', {
                style: {
                  color: '#ff3d57'
                }
              }, '故障');
            } else {
              return createElement('span', {
                style: {
                  color: '#ff3d57'
                }
              }, '告警');
            }
          }
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
  created() {
    this.deviceType = this.$route.params.type;
    this.deviceState = this.$route.params.deviceState;
  },
  mounted() {
    this.getManufactorLista();
  },
  methods: {
    fetchData() {
      this.getPowerGeneration();
    },
    // 查询站点风机的详情数据
    getPowerGeneration() {
      this.tableData = [];
      this.loading = true;
      const data = {
        deviceType: this.deviceType,
        vendorName: this.manufactor,
        deviceState: this.deviceState,
        powerPlantId: this.powerPlantId,
        start: this.pagination.start,
        size: this.pagination.size
      };
      this.$axios.post(Api.overview.queryFanDetail, data, (res) => {
        this.loading = false;
        if (res.isSuccess) {
          this.tableData = res.data.data;
          this.pagination.total = res.data.total;
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
      this.getPowerGeneration();
    },
    handleChangeState(value) {
      this.deviceState = value;
      this.getPowerGeneration();
    },
    handleSelectDate(idx) {
      this.activeIdx = idx;
    },
    editHandle(row) {
      this.$router.push({ path: `/windGenerator/${row.deviceId}/${row.deviceCode}` });
    }
  }

};
</script>

<style scoped lang="scss">
.dytable-view-container {
  margin-top: 0;
}
.group-overview-container {
  .date-btn-group {
    margin-right: 80px;
  }
  .chart-container {
    height: 377px;
    box-sizing: border-box;
  }
}
</style>
