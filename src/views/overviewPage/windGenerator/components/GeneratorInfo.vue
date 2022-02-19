<!--
 * @Descripttion:风机信息
 * @Date: 2021-01-08 15:58:47
-->
<template>
  <div class="generator-info-container">
    <ul>
      <li class="malfunction-info-list">
        <div class="flex-box fs14">
          <span class="mr-10">日发电量</span>
          <span>{{malfunctionInfo.powerGeneration || 0}}</span>
          <span>kWh</span>
        </div>
      </li>
      <li class="malfunction-info-list">
        <div class="flex-box fs14">
          <div class="mr-10">月发电量</div>
          <div>{{malfunctionInfo.monthPowerGeneration || 0}}</div>
          <div>kWh</div>
        </div>
      </li>
      <li class="malfunction-info-list">
        <div class="flex-box fs14">
          <div class="mr-10">年发电量</div>
          <div>{{malfunctionInfo.yearPowerGeneration || 0}}</div>
          <div>kWh</div>
        </div>
      </li>

      <li class="malfunction-info-list malfunction-info-list-w">
        <div class="flex-box fs14">
          <div class="mr-10">风电机组月可利用小时数</div>
          <div>{{malfunctionInfo.monthEquivalentUtilizationHours || 0}}</div>
          <div>h</div>
        </div>
      </li>
      <li class="malfunction-info-list malfunction-info-list-w">
        <div class="flex-box fs14">
          <div class="mr-10">风电机组年可利用小时数</div>
          <div>{{malfunctionInfo.yearEquivalentUtilizationHours || 0}}</div>
          <div>h</div>
        </div>
      </li>
      <li class="malfunction-info-list w-l">
        <div class="flex-box fs14">
          <div class="mr-10">风电机组月可利用率</div>
          <div>{{malfunctionInfo.monthAvailability || 0}}</div>
          <div>%</div>
        </div>
      </li>
    </ul>
    <!-- <div class="text-gray mr-10">{{item.name}}</div>
          <div class="text-blue-light">{{item.value}}</div>
          <div class="text-yellow">{{item.unit}}</div> -->
  </div>
</template>

<script>
export default {
  name: '',
  components: {},
  props: {
    items: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      malfunctionInfo: {

      }
    };
  },
  computed: {},
  watch: {
    'items': {
      handler: function (newValue, oldValue) {
        this.malfunctionInfo = newValue;
      },
      deep: true
    }
  },
  created() { },
  mounted() { },
  methods: {}
};
</script>

<style scoped lang="scss">
.generator-info-container {
  width: 1340px;
  height: 60px;
  position: absolute;
  left: 586px;
  bottom: 130px;
  .malfunction-info-list {
    float: left;
    font-size: 15px;
    padding: 20px 10px;
    width: 180px;
  }
  .malfunction-info-list-w {
    width: 230px;
  }
  .w-l {
    width: 190px;
  }
  .fs14 {
    font-size: 14px;
  }
}
</style>
