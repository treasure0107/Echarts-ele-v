
<template>
  <div
    v-loading='loading'
    class="group-overview-container"
  >
    <div class="chart-container group-item-bg mt-20">
      <div
        id="groupOperationChart"
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
      tableData: [],
      gridConnected: 0,
      limitedPower: 0,
      outageMaintenance: 0,
      debugging: 0,
      pagination: {
        total: 0,
        start: 1,
        size: 20
      },
      colKey: {
        powerPlant: {
          label: '风电场名称',
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
        runState: {
          label: '运行状态',
          handle: (scope, createElement) => {
            if (scope.row.runState == 'INTERCONNECTION_RUN') {
              return createElement('span', {
                style: {
                  color: '#22CCE2'
                }
              }, '并网运行');
            } else if (scope.row.runState == 'RATION_THE_POWER_SUPPLY_RUN') {
              return createElement('span', {
                style: {
                  color: '#FEBA02'
                }
              }, '限电运行');
            } else if (scope.row.runState == 'POWER_CUT_MAINTENANCE') {
              return createElement('span', {
                style: {
                  color: '#FF3D57'
                }
              }, '停电检修');
            } else {
              return createElement('span', {
                style: {
                  color: '#b5b5b5'
                }
              }, '调试中');
            }
          }
        }
      }
    };
  },
  computed: {

  },
  watch: {},
  created() { },
  mounted() {
    this.fetchChartData();
  },
  methods: {
    fetchData() {
      this.tableData = [];
      this.loading = true;
      const data = {
        queryType: 'lists'
      };
      this.$axios.get(Api.group.getOperationStatistics, data, (res) => {
        this.loading = false;
        if (res.isSuccess) {
          this.tableData = res.data;
          this.pagination.total = res.data.length;
        }
      });
    },
    fetchChartData() {
      const data = {
        queryType: 'statistics'
      };
      this.$axios.get(Api.group.getOperationStatistics, data, (res) => {
        if (res.isSuccess) {
          this.gridConnected = res.data[0].gridConnected;
          this.limitedPower = res.data[0].limitedPower;
          this.outageMaintenance = res.data[0].outageMaintenance;
          this.debugging = res.data[0].debugging;
          this.loadChart();
        }
      });
    },
    loadChart() {
      const myChart = this.$echarts.init(document.getElementById('groupOperationChart'));
      const chartOption = {
        title: {
          text: '运行统计',
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
          selectedMode: false,
          bottom: 0,
          left: 'center',
          itemWidth: 10,
          itemHeight: 10,
          textStyle: {
            color: '#C8C9CC'
          },
          data: ['并网运行', '限电运行', '停电检修', '调试中']
        },
        series: [
          {
            name: '运行统计',
            type: 'pie',
            radius: ['50%', '70%'],
            center: ['50%', '40%'],
            avoidLabelOverlap: false,
            hoverAnimation: false,
            color: ['#FF3D57', '#FEBA02', '#22CCE2', '#b5b5b5', '#18ABFE'], // 修改颜色
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
              { value: this.outageMaintenance || null, name: '停电检修' },
              { value: this.limitedPower || null, name: '限电运行' },
              { value: this.gridConnected || null, name: '并网运行' },
              { value: this.debugging || null, name: '调试中' },
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
    handleRowClick(row) {
      this.$store.commit('CHANGE_POWER_PLANT_ID', row.powerPlantId);
      this.$store.commit('CHANGE_POWER_PLANT', row.powerPlant);
      this.$router.push({ path: '/dataOverview' });
    },
    handleDownload() {
      const url = `${this.baseUrl}powerGeneration/v1/exportData?exportModel=operationStatistics&queryType=lists`;
      window.location.href = url;
    }
  }

};
</script>

<style scoped lang="scss">
.group-overview-container {
  .chart-container {
    height: 250px;
    padding: 20px;
    box-sizing: border-box;
  }
}
</style>
