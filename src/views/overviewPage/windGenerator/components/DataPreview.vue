<!--
 * @Descripttion:实时预览
 * @Author: JTune
 * @Date: 2021-01-07 15:58:47
-->
<template>
  <div class="data-preview-container">
    <dv-border-box-13
      :color="['#164F76', '#164F76']"
      backgroundColor="#060c23"
    >
      <div class="header-container">
        <dv-decoration-7
          :color="['#164F76','#164F76']"
          style="width:100%;height:30px;"
        > 遥信参数 </dv-decoration-7>
      </div>
      <ul class="data-preview-list">
        <li
          v-for="(item,key) in telesignalisationList"
          :key="key"
          class="data-preview-item"
        >
          <el-row :gutter="20">
            <el-col :span="16">
              <div class="text-ellipsis text-left text-gray">{{item.pointItemCodeName}}</div>
            </el-col>
            <el-col :span="8">
              <div class="text-ellipsis text-left text-blue-light">{{item.pointItemCodeValue}}</div>
            </el-col>
          </el-row>
        </li>
      </ul>
      <div class="header-container">
        <dv-decoration-7
          :color="['#164F76','#164F76']"
          style="width:100%;height:30px;"
        > 遥脉参数 </dv-decoration-7>
      </div>
      <ul class="data-preview-list">
        <li
          v-for="(item,key) in telepulseList"
          :key="key"
          class="data-preview-item"
        >
          <el-row :gutter="20">
            <el-col :span="16">
              <div class="text-ellipsis text-left text-gray">{{item.pointItemCodeName}}</div>
            </el-col>
            <el-col :span="8">
              <div class="text-ellipsis text-left text-blue-light">{{item.pointItemCodeValue}}</div>
              <div class="text-ellipsis text-left text-yellow">{{item.unit}}</div>
            </el-col>
          </el-row>
        </li>
      </ul>
    </dv-border-box-13>
  </div>
</template>

<script>
export default {
  name: '',
  components: {},
  props: {
    telesignalisationList: {
      type: Array,
      default: () => []
    },
    telepulseList: {
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
  mounted() { },
  methods: {}
};
</script>

<style scoped lang="scss">
.data-preview-container {
  width: 400px;
  height: 480px;
  position: absolute;
  left: 600px;
  top: 460px;
  overflow: auto;
  .header-container {
    padding-top: 20px;
    font-size: 16px;
  }
  .data-preview-item {
    font-size: 13px;
    padding: 10px;
  }
  .data-preview-list {
    padding: 0 30px;
  }
}
</style>
