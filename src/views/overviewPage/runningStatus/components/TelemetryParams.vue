<!--
 * @Author: JTune
 * @Description: 遥测参数
 * @FilePath: \centralized-control-sys-web\src\views\overviewPage\runningStatus\components\telemetryParams.vue
-->
<template>
  <div class="params-con scroll-bar">
    <el-row :gutter="20">
      <el-col
        :span="8"
        :xs="20"
        :sm="12"
        :xl="8"
        v-for="(item,index) in list"
        :key="index"
      >
        <div class="grid-content"><span class="g-tit">{{item.pointItemCodeName}}</span>：<span class="g-txt">{{item.pointItemCodeValue}}</span></div>
      </el-col>
    </el-row>
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

    };
  },
  computed: {},
  watch: {},
  created() { },
  mounted() {

  },
  methods: {

  }
};
</script>
<style scoped lang='scss'>
.run-status {
  background-color: #22cce2;
}
.warn-status {
  background-color: #ff3d57;
}
.recondition-status {
  background-color: #fdbf5e;
}
</style>
