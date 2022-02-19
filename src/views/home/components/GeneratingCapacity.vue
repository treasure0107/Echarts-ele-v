<!--
 * @Descripttion:发电量组件
-->
<template>
  <div class="common-chart-wrap-container">
    <Header
      title="发电量"
      :link-opt="linkOpt"
    />
    <div class="common-chart-content">
      <div class="generating-capacity-content">
        <el-row
          :gutter="20"
          type="flex"
          justify="center"
          align="middle"
        >
          <el-col :span="2">
            <div class="grid-content"> <i class="electricity-ic"></i></div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content"> 总发电量</div>
          </el-col>
          <el-col :span="10">
            <div class="grid-content generating-capacity-sum"> {{item.totalPowerGeneration}}</div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content generating-capacity-unit"> 万kWh</div>
          </el-col>
        </el-row>
      </div>

      <div class="generating-capacity-content">
        <el-row
          :gutter="20"
          type="flex"
          justify="center"
          align="middle"
        >
          <el-col :span="2">
            <div class="grid-content"> <i class="electricity-ic"></i></div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content"> 年发电量</div>
          </el-col>
          <el-col :span="10">
            <div class="grid-content generating-capacity-sum"> {{item.yearPowerGeneration}}</div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content generating-capacity-unit"> 万kWh</div>
          </el-col>
        </el-row>
      </div>
      <div class="generating-capacity-content">
        <el-row
          :gutter="20"
          type="flex"
          justify="center"
          align="middle"
        >
          <el-col :span="2">
            <div class="grid-content"> <i class="electricity-ic"></i></div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content"> 日发电量</div>
          </el-col>
          <el-col :span="10">
            <div class="grid-content generating-capacity-sum"> {{item.powerGeneration}}</div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content generating-capacity-unit"> 万kWh</div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/home/Header';
export default {
  name: '',
  components: { Header },
  props: {
    item: {
      type: Object,
      default: function () {
        return {};
      }
    }
  },
  data() {
    return {
      linkOpt: {
        path: '/generatingCapacity',
        params: {}
      }
    };
  },
  computed: {},
  watch: {},
  created() { },
  mounted() { },
  methods: {}
};
</script>

<style scoped lang="scss">
.common-chart-wrap-container {
  top: 100px;
  left: 20px;
  .common-chart-content {
    padding-right: 58px;
  }
  .generating-capacity-content {
    margin-bottom: 20px;
    color: #fff;
    .electricity-ic {
      margin-right: 10px;
      width: 25px;
      height: 25px;
      background: url(~@/assets/image/electricity-ic.png) center no-repeat;
      background-size: 100% 100%;
      display: inline-block;
    }
    .generating-capacity-unit {
      color: #ffa81f;
    }
    .generating-capacity-sum {
      font-size: 20px;
      font-family: Arial;
      font-weight: bold;
      color: #22cce2;
    }
  }
}
</style>
