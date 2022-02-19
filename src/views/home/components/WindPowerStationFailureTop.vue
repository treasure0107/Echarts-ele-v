<!--
 * @Descripttion:
 * @Author: JTune
 * @Date: 2020-10-29 09:03:50
-->
<!--
 * @Descripttion:风电场故障排行
-->
<template>
  <div class="common-chart-wrap-container">
    <Header
      title="风电场故障排行(月)"
      :link-opt="linkOpt"
    />
    <div class="common-chart-content">
      <div v-if="item.length">单位：万kWh</div>
      <ul
        v-if="item.length"
        class="mt-10"
      >
        <li class="title">
          <el-row :gutter="20">
            <el-col :span="3">
              <div class="text-ellipsis">排名</div>
            </el-col>
            <el-col :span="8">
              <div class="text-ellipsis">风电场</div>
            </el-col>
            <el-col :span="6">
              <div class="text-ellipsis">故障次数</div>
            </el-col>
            <el-col :span="7">
              <div class="text-ellipsis">损失电量</div>
            </el-col>
          </el-row>
        </li>
        <li
          v-for="(item,key) in item"
          :key="key"
          class="mt-10"
        >
          <el-row :gutter="20">
            <el-col :span="3">
              <div class="text-ellipsis">{{key+1}}</div>
            </el-col>
            <el-col :span="8">
              <el-tooltip
                class="item"
                effect="dark"
                :content="item.powerPlant"
                placement="top"
                popper-class="group-tooltip"
              >
                <div class="text-ellipsis">{{item.powerPlant}}</div>
              </el-tooltip>
            </el-col>
            <el-col :span="6">
              <div class="text-ellipsis">{{item.faultCount+item.warnCount}}</div>
            </el-col>
            <el-col :span="7">
              <div class="text-ellipsis">{{item.lossOfElectricity}}</div>
            </el-col>
          </el-row>
        </li>
      </ul>
      <div
        v-else
        class="empty-text"
      >暂无故障</div>
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
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      linkOpt: {
        path: '/windPowerStation',
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
  top: 820px;
  right: 20px;
  .title {
    color: #4ddeff;
  }
  .empty-text {
    text-align: center;
    margin: 60px auto;
  }
}
</style>
