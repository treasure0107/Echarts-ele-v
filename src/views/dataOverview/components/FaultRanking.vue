<!--
 * @Author:JTune
 * @Description: 数据概览-设备故障排行
 * @FilePath: \centralized-control-sys-web\src\views\dataOverview\components\FaultRanking.vue
-->
<template>
  <div>
    <div class="fault-ranking">
      <ul v-if="faultRankList.length">
        <li class="title">
          <el-row :gutter="20">
            <el-col :span="3">
              <div class="text-ellipsis">排名</div>
            </el-col>
            <el-col :span="10">
              <div class="text-ellipsis">故障名称</div>
            </el-col>
            <el-col :span="8">
              <div class="text-ellipsis">厂商</div>
            </el-col>
            <el-col :span="3">
              <div class="text-ellipsis">次数</div>
            </el-col>
          </el-row>
        </li>
        <li
          v-for="(item,key) in faultRankList"
          :key="key"
          class="mt-15"
        >
          <el-row :gutter="20">
            <el-col :span="3">
              <div class="text-ellipsis">{{key+1}}</div>
            </el-col>
            <el-col :span="10">
              <div class="text-ellipsis">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="item.faultPointItemCodeDesc"
                  placement="top"
                  popper-class="group-tooltip"
                >
                  <div class="text-ellipsis">{{item.faultPointItemCodeDesc}}</div>
                </el-tooltip>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="text-ellipsis">{{item.manufactor}}</div>
            </el-col>
            <el-col :span="3">
              <div class="">{{item.faultCount}}</div>
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
export default {
  name: '',
  components: {},
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      faultRankList: []
    };
  },
  computed: {},
  watch: {
    'list': {
      handler: function (newValue, oldValue) {
        this.faultRankList = newValue;
      },
      deep: true
    }
  },
  created() { },
  mounted() {

  },
  methods: {

  }
};
</script>

<style scoped lang="scss">
.mt-15 {
  margin-top: 15px;
}
.fault-ranking {
  padding: 20px;
  .title {
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: #333333;
  }
  li {
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #999999;
    height: 16px;
    line-height: 16px;
  }
  .empty-text {
    text-align: center;
    margin: 40px auto;
  }
}
</style>
