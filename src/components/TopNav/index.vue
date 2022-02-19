<!--
 * @Author: JTune
 * @Description: In User Settings Edit
 * @FilePath: \centralized-control-sys-web\src\components\TopNav\index.vue
-->

<template>
  <div class="top-nav-con">
    <div
      class="top-nav"
      v-show="!$route.meta.isHideTopNav"
    >
      <a
        href="javascript:void(0)"
        v-for="(item,index) in navList"
        :key="index"
        :class="{'active':windPowerPlantId==item.id}"
        @click="handleTab(item)"
      >
        <span>{{item.name}}</span>
        <span
          class="num warn"
          v-if="item.errorCount"
        ></span>
        <span
          class="num maintenanc"
          v-if="!item.errorCount&&item.warnCount"
        ></span>
      </a>
    </div>
  </div>
</template>

<script>
import Api from '@/utils/api.js';
import { mapState } from 'vuex';
export default {
  name: '',
  components: {},
  data() {
    return {
      windPowerPlantId: '',
      navList: [
        { id: 0, name: '测试站点', path: '/dataOverview' }
      ],
      powerPlantList: [],
      errorCount: 0,
      warnCount: 0
    };
  },
  computed: {
    ...mapState({
      powerPlant: (state) => state.powerPlant.powerPlant,
      powerPlantId: (state) => state.powerPlant.powerPlantId,
      windPowerPlantWs: (state) => state.powerPlant.windPowerPlantWs
    })
  },
  watch: {
    'powerPlantId': {
      handler: function (newValue, oldValue) {
        this.windPowerPlantId = newValue;
      }
    },
    'windPowerPlantWs': {
      handler: function (newValue, oldValue) {
        this.navList = this.navList.map(item => {
          newValue.map(param => {
            if (item.id == param.powerPlantId) {
              item.errorCount = param.errorCount;
              item.warnCount = param.warnCount;
            }
          });
          return item;
        });
      },
      deep: true
    }
  },
  created() {

  },
  beforeMount() {
  },
  mounted() {
    this.init();
    this.windPowerPlantId = this.powerPlantId;
    // const w = document.querySelector('.top-nav').offsetWidth;
  },
  methods: {
    init() {
      const promiseNav = this.getNodeDistribution();
      const promisePowerPlant = this.groupFaultingCountByPowerPlantId();
      Promise.all([promiseNav, promisePowerPlant])
        .then((res) => {
          const navList = res[0];
          const powerPlantList = res[1];
          this.navList = navList.map(item => {
            powerPlantList.map(param => {
              if (item.id == param.powerPlantId) {
                item.errorCount = param.errorCount;
                item.warnCount = param.warnCount;
              }
            });
            return item;
          });
        }).catch((err) => {
          console.log(err);
        });
    },
    // 获取站点分布及状态数据
    getNodeDistribution() {
      const data = {};
      return new Promise((resolve, reject) => {
        this.$axios.post(Api.group.getNodeDistribution, data, (res) => {
          if (res.isSuccess) {
            // this.navList = res.data;
            resolve(res.data);
          }
        });
      });
    },
    groupFaultingCountByPowerPlantId() {
      const data = {};
      return new Promise((resolve, reject) => {
        this.$axios.get(Api.overview.groupFaultingCountByPowerPlantId, data, (res) => {
          if (res.isSuccess) {
            // this.powerPlantList = res.data;
            resolve(res.data);
          }
        });
      });
    },
    handleTab(param) {
      this.$store.commit('CHANGE_POWER_PLANT_ID', param.id);
      this.$store.commit('CHANGE_POWER_PLANT', param.name);
      this.windPowerPlantId = param.id;
    }
  }
};
</script>
<style lang='scss' scoped>
/* @import url(); 引入css类 */
.top-nav-con {
  width: 100%;
  // overflow: hidden;
}
.top-nav {
  // width: 1000%;
  min-height: 53px;
  line-height: 53px;
  font-size: 14px;
  padding-left: 15px;
  padding-top: 3px;
  margin-bottom: 20px;
  // overflow-x: hidden;
  // overflow-y: scroll;
  // justify-content: space-between;
  // white-space: normal;
  background-color: #fff;
  a {
    position: relative;
    margin: 0 16px;
    padding: 6px 10px;
    border-radius: 20px;
    border: 1px solid #dcdfe4;
    color: #323233;
    &:hover {
      border: 1px solid #1989fa;
      background: #1989fa;
      color: #fff;
    }
    &.active {
      border: 1px solid #1989fa;
      background: #1989fa;
      color: #fff;
    }
    .num {
      position: absolute;
      top: -6px;
      right: -6px;
      font-size: 12px;
      width:10px;
      height: 10px;
      line-height: 10px;
      text-align: center;
      border-radius: 50%;
      color: #fff;
      &.maintenanc {
        background-color: #fb9602;
      }
      &.warn {
        background-color: #ff3d57;
      }
    }
  }
}
</style>
