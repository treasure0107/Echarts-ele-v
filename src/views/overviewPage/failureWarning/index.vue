<!--
 * @Author: JTune
 * @Description: 数据概览-故障报警
 * @FilePath: \centralized-control-sys-web\src\views\overviewPage\failureWarning\index.vue
-->
<template>
  <div
    class="data-overview-container"
    v-loading='loading'
  >

    <!-- <div>
      <iframe
        class="iframe"
        style="width:10600px;height:900px"
        src="http://192.168.1.125:5888/display.html?tag=displays/industry/power.json"
        frameborder="0"
      />
    </div> -->
    <dy-table
      :keys="colKey"
      :loading="loading"
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
      </div>
    </dy-table>

    <DetailsPopUp
      v-if="dialogVisibleDetail"
      :dialog-visible-detail="dialogVisibleDetail"
      :isBlack="isBlack"
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
            <div class="grid-content"> <span>开始时间：</span> {{listDetails.startTime}}</div>
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
import { mapState } from 'vuex';
import DyTable from '@/components/DyTable';
import DetailsPopUp from '@/components/dialog/DetailsPopUp';
export default {
  name: '',
  components: { DyTable, DetailsPopUp },
  data() {
    return {
      activeIdx: 1,
      value: '',
      manufactor: '',
      devicePosition: '1',
      faultType: '',
      options: [],
      checked: false,
      loading: false,
      dialogVisibleDetail: false,
      isBlack: false,
      actions: [
        {
          label: '查看',
          action: row => {
            this.editHandle(row);
          }
        }
      ],
      equipmentList: [
        {
          value: '1',
          label: '风机'
        },
        {
          value: '2',
          label: '升压站'
        }
      ],
      listDetails: {
        manufactor: '',
        deviceCode: '',
        deviceName: '',
        deviceType: '',
        faultPointItemCodeDesc: '',
        faultCount: ''
      },
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
        idx: {
          label: '序号',
          width: 90
        },
        manufactor: { label: '厂商' },
        deviceCode: '设备编码',
        deviceName: '设备名称',
        deviceType: '设备类型',
        faultPointItemCodeDesc: '故障描述',
        startTime: '开始时间'
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
    this.devicePosition = this.$route.params.type;
    this.faultType = this.$route.params.faultType == 1 ? '故障' : this.$route.params.faultType == 2 ? '告警' : '检修';
  },
  mounted() {
    this.getManufactorLista();
  },
  methods: {
    fetchData() {
      this.getFaultDetails();
    },
    // 查询故障详情数据
    getFaultDetails() {
      this.tableData = [];
      this.loading = true;
      const data = {
        deviceType: this.deviceType,
        manufactor: this.manufactor,
        devicePosition: this.devicePosition,
        powerPlantId: this.powerPlantId,
        faultType: this.faultType,
        isFaulting: true,
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
      this.pagination.start = 1;
      this.getFaultDetails();
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
    box-sizing: border-box;
  }
}
::v-deep .dytable-view-container.data-overview-view .el-table {
  color: #ff3d57;
}
.dytable-view-container {
  margin-top: 0;
}
</style>
