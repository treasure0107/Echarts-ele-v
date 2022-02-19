<!--
 * @Author: JTune
 * @Description: 数据概览-设备故障排行组件
 * @FilePath: \centralized-control-sys-web\src\views\dataOverview\components\indicatorData.vue
-->
<template>
  <div>
    <div class="fault-ranking">
      <ul>
        <li
          v-for="(item,key) in list"
          :key="key"
          class="mt-15"
        >
          <el-row :gutter="20">
            <el-col :span="3">
              <div
                class="icon icon1"
                v-if="item.type==1"
              ></div>
              <div
                class="icon icon2"
                v-else-if="item.type==2"
              ></div>
              <div
                class="icon icon3"
                v-else-if="item.type==3"
              ></div>
              <div
                class="icon icon4"
                v-else-if="item.type==4"
              ></div>
              <div
                class="icon icon5"
                v-else-if="item.type==5"
              ></div>
              <div
                class="icon icon6"
                v-else
              ></div>
            </el-col>
            <el-col :span="16">
              <div class="text-ellipsis">{{item.dataIndicatorsName}}</div>
            </el-col>
            <el-col :span="5">
              <div class="t-c" style="text-align:center;">{{item.dataIndicatorsValue}}</div>
            </el-col>
          </el-row>
        </li>
      </ul>
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
    return {};
  },
  computed: {},
  watch: {},
  created() { },
  mounted() { },
  methods: {}
};
</script>

<style scoped lang="scss">
.mt-15 {
  margin-top: 15px;
}
.fault-ranking {
  padding: 10px 20px;
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
    height: 32px;
    line-height: 32px;
  }
  .t-c {
    font-size: 14px;
    font-family: Arial;
    font-weight: bold;
    color: #3350d4;
  }
  .icon {
    width: 32px;
    height: 32px;
    background-size: 100% 100%;
  }
  .icon1 {
    background: url(~@/assets/image/indicator-icon1.png) center no-repeat;
  }
  .icon2 {
    background: url(~@/assets/image/indicator-icon2.png) center no-repeat;
  }
  .icon3 {
    background: url(~@/assets/image/indicator-icon3.png) center no-repeat;
  }
  .icon4 {
    background: url(~@/assets/image/indicator-icon4.png) center no-repeat;
  }
  .icon5 {
    background: url(~@/assets/image/indicator-icon5.png) center no-repeat;
  }
  .icon6 {
    background: url(~@/assets/image/indicator-icon6.png) center no-repeat;
  }
}
</style>
