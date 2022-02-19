<!--
 * @Descripttion:风电场平均风速
-->
<template>
  <div class="common-chart-wrap-container">
    <Header
      title="风电场平均风速"
      :link-opt="linkOpt"
    />
    <div class="common-chart-content">
      <el-carousel
        trigger="click"
        height="135px"
        arrow="never"
        v-if="item.length"
      >
        <el-carousel-item
          v-for="(items,key) in dataList"
          :key="key"
        >
          <div class="swipper-item">
            <ul>
              <li
                v-for="(val,idx) in items"
                :key="idx"
                class="swipper-item-list mt-10"
              >
                <el-row :gutter="20">
                  <el-col
                    class="text-ellipsis"
                    :span="12"
                  >
                    {{val.powerPlant}}
                  </el-col>
                  <el-col
                    class="text-ellipsis"
                    :span="12"
                  >
                    {{val.avgWindSpeed}} m/s
                  </el-col>
                </el-row>
              </li>
            </ul>
          </div>
        </el-carousel-item>
      </el-carousel>
      <div
        v-else
        class="empty-text"
      >暂无数据</div>
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
        path: '/windSpeed',
        params: {}
      },
      dataList: []
    };
  },
  computed: {},
  watch: {
    'item': {
      handler: function (newValue, oldValue) {
        let index = 0;
        this.dataList = [];
        while (index < newValue.length) {
          this.dataList.push(newValue.slice(index, index += 8));
        }
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
.common-chart-wrap-container {
  top: 820px;
  left: 20px;
  .el-carousel--horizontal {
    width: 100%;
    height: 100%;
  }
  .swipper-item-list {
    float: left;
    width: 50%;
  }
  .empty-text {
    text-align: center;
    margin: 70px auto;
  }
}
</style>
