<!--
 * @Descripttion:风机模型
-->
<template>
  <div class="generator-model-container">
    <div class="group-overview-container">
      <div class="search">
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
      <!--    showSerial 默认序号是否显示-->
      <dy-table
        :maxTableHeight="300"
        :keys="colKey"
        :fetchData="fetchData"
        :pagination='pagination'
        :isPagination="true"
        :list='tableData'
        :showHeader="true"
        :wind-generator-view="true"
        :table-tit="tableTit"
      >
      </dy-table>
    </div>
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
      tableTit: '故障报警记录',
      key: '',
      id: '',
      tableData: [],
      pagination: {
        total: 0,
        start: 1,
        size: 20
      },
      colKey: {
        idx: '序号',
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
        faultPointItemCodeDesc: {
          label: '故障描述',
          width: 360,
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
      const data = {
        key: this.key,
        startDate: this.startDate,
        endDate: '',
        dateType: '',
        deviceId: this.id,
        powerPlantId: this.powerPlantId,
        start: this.pagination.start,
        size: this.pagination.size
      };
      this.$axios.post(Api.group.faultDetails, data, (res) => {
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
      this.fetchData();
    }
  }
};
</script>

<style scoped lang="scss">
.generator-model-container {
  width: 1340px;
  height: 390px;
  position: absolute;
  left: 600px;
  top: 20px;
  overflow: hidden;
  .search {
    position: absolute;
    right: 23px;
    top: 30px;
    z-index: 999999;
  }
  .header-container {
    height: 70px;
    padding: 30px 20px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .tit {
    font-size: 16px;
  }
  ::v-deep .el-input .el-input__inner {
    color: #7c919b;
  }
}
::v-deep .dytable-view-container .dytable-view-body {
  height: 260px !important;
}
::v-deep .dytable-view-container {
  min-height: 200px;
}
::v-deep .dytable-view-container .dytable-view-empty img {
  margin-top: 0;
}
::v-deep .dytable-header {
  margin-bottom: 10px !important;
}
::v-deep .dytable-view-paging {
  margin-top: 0 !important;
}
</style>
