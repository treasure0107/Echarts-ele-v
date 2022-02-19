<!--
 * @Descripttion:
 * @Author: JTune
 * @Date: 2020-10-29 18:16:47
-->
<!--
 * @Descripttion:设备故障排行
 * @Author: JTune
-->
<template>
  <div class="common-chart-wrap-container">
    <Header
      title="设备故障排行"
      :link-opt="linkOpt"
    />
    <div class="common-chart-content">
      <ul v-if="item.length">
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
          v-for="(item,key) in item"
          :key="key"
          class="mt-10"
        >
          <el-row :gutter="20">
            <el-col :span="3">
              <div class="text-ellipsis">{{key+1}}</div>
            </el-col>
            <el-col :span="10">
              <el-tooltip
                class="item"
                effect="dark"
                :content="item.faultPointItemCodeDesc"
                placement="top"
                popper-class="group-tooltip"
              >
                <div class="text-ellipsis">{{item.faultPointItemCodeDesc}}</div>
              </el-tooltip>
            </el-col>
            <el-col :span="8">
              <div class="text-ellipsis">{{item.manufactor}}</div>
            </el-col>
            <el-col :span="3">
              <div class="text-ellipsis">{{item.faultCount}}</div>
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
        path: '/failureEquipment',
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
  top: 580px;
  right: 20px;
  .title {
    color: #4ddeff;
  }
  .empty-text {
    text-align: center;
    margin: 80px auto;
  }
}
</style>
