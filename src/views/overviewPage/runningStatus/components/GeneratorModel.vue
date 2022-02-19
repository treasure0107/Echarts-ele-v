<!--
 * @Author: JTune
 * @FilePath: \centralized-control-sys-web\src\views\overviewPage\runningStatus\components\GeneratorModel.vue
-->
<template>

  <div
    v-loading='loading'
    class="data-overview-container"
  >
    <dy-table
      :loading="loading"
      :isPagination="true"
      :keys="colKey"
      :fetchData="fetchData"
      :pagination='pagination'
      :list='tableData'
      :data-overview-view="true"
      :showHeader="true"
    >
      <div slot="header">
        <el-select
          class="mr-20"
          v-model="faultType"
          clearable
          placeholder="请选择故障类型"
          @change="handleSearch"
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
            @click="handleSearch"
            slot="suffix"
            class="el-input__icon el-icon-search"
          ></i>
        </el-input>
      </div>
    </dy-table>
  </div>

</template>

<script>
import DyTable from '@/components/DyTable';
import Api from '@/utils/api.js';
import { mapState } from 'vuex';
export default {
  name: '',
  components: { DyTable },
  props: {
    deviceId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      key: '',
      id: '',
      faultType: '',
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
      tableData: [],
      pagination: {
        total: 0,
        start: 1,
        size: 20
      },
      colKey: {
        idx: {
          label: '序号',
          width: 80
        },
        faultType: {
          label: '故障类型',
          width: 100,
          showTooltip: true,
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
        manufactor: {
          label: '厂商',
          width: 100,
          showTooltip: true,

          handle: function (scope, createElement) {
            if (scope.row.endTime) {
              return createElement('span', scope.row.manufactor);
            } else {
              return createElement('span', {
                style: {
                  color: '#FF3D57'
                }
              }, scope.row.manufactor);
            }
          }
        },
        faultDuration: {
          label: '故障时长(h)',
          width: 160,
          showTooltip: true,
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
          width: 160,
          sortable: true,
          showTooltip: true,
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
          width: 160,
          showTooltip: true,
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
          width: 160,
          showTooltip: true,
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
        },
        faultPointItemCodeDesc: {
          label: '故障描述',
          // width: 360,
          showTooltip: true,
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
        }
      }
    };
  },
  computed: {
    ...mapState({
      powerPlantId: state => state.powerPlant.powerPlantId
    })
  },
  watch: {
    'deviceId': {
      handler: function (newValue, oldValue) {
        this.id = newValue;
        this.fetchData();
      },
      deep: true
    }
  },
  created() { },
  mounted() { },
  methods: {
    fetchData() {
      if (!this.id) return;
      this.tableData = [];
      this.loading = true;
      const data = {
        key: this.key,
        startDate: this.startDate,
        endDate: '',
        dateType: '',
        faultType: this.faultType,
        deviceId: this.id,
        powerPlantId: this.powerPlantId,
        start: this.pagination.start,
        size: this.pagination.size
      };
      this.$axios.post(Api.group.faultDetails, data, (res) => {
        this.loading = false;
        if (res.isSuccess) {
          const starts = this.pagination.start - 1;
          const size = this.pagination.size;
          res.data.map((item, index) => {
            const idx = index + 1;
            item.idx = idx + starts * size;
            // item.faultDuration = item.faultDuration * 1;
          });
          this.tableData = res.data;
          this.pagination.total = res.total;
        }
      });
    },
    handleSearch() {
      this.pagination.start = 1;
      this.fetchData();
    }
  }
};
</script>

<style scoped lang="scss">
.data-overview-container {
  .search {
    position: absolute;
    right: 23px;
    top: 30px;
  }
  ::v-deep .el-input .el-input__inner {
    color: #7c919b;
  }
  ::v-deep .dytable-view-container {
    margin-top: 0 !important;
    padding-top: 0 !important;
  }
}
</style>
