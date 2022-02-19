<!--
 * @Descripttion:设备故障信息
-->
<template>
  <div class="malfunction-info-container">
    <div class="header-container text-center">
      <p>遥测参数</p>
    </div>
    <div
      :color="['#164F76', '#164F76']"
      backgroundColor="#060c23"
      class="malfunction-con scroll-bar"
    >
      <ul class="malfunction-info-list">
        <li
          v-for="(item,key) in malfunctionInfoList"
          :key="key"
          class="malfunction-info-item"
        >
          <div>
            <div class="font-16">{{item.typeName}}</div>
            <el-row
              :gutter="20"
              v-for="(val,idx) in item.pointDetails"
              :key="idx"
              class="mt-20"
            >
              <el-col :span="14">
                <!-- <el-tooltip
                  class="item"
                  effect="dark"
                  :content="val.name"
                  placement="top"
                  popper-class="group-tooltip"
                > -->
                <div class="text-ellipsis text-left text-gray">{{val.name}}</div>
                <!-- </el-tooltip> -->
              </el-col>
              <el-col :span="5">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="val.value"
                  placement="top"
                  popper-class="group-tooltip"
                >
                  <div class="text-ellipsis text-left text-blue-light">{{val.value}}</div>
                </el-tooltip>
              </el-col>
              <el-col :span="5">
                <div class="text-ellipsis text-left text-yellow">{{val.unit}}</div>
              </el-col>
            </el-row>
          </div>
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
    items: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      malfunctionInfoList: [
        {
          name: '风机型号',
          value: '2000',
          unit: 'kW'
        }
      ],
      activeIdx: 0
    };
  },
  computed: {},
  watch: {
    'items': {
      handler: function (newValue, oldValue) {
        this.malfunctionInfoList = newValue;
      },
      deep: true
    }
  },
  created() { },
  mounted() {
    // this.requstWsDevice();
  },
  methods: {
    selectItem(key) {
      this.activeIdx = key;
    }

  }
};
</script>

<style scoped lang="scss">
.malfunction-info-container {
  position: absolute;
  width: 380px;
  height: 900px;
  left: 200px;
  top: 40px;
  box-shadow: #164f76 0px 0px 40px inset;
  .header-container {
    font-size: 16px;
    padding-bottom: 5px;
    p {
      margin-top: 15px;
    }
  }
  .malfunction-con {
    height: 860px;
  }
  .malfunction-info-list {
    height: calc(100% - 100px);
    // overflow: auto;
  }
  .malfunction-info-item {
    font-size: 13px;
    padding: 20px;
    overflow: auto;
  }
}
.scroll-bar {
  overflow-y: scroll;
  scrollbar-color: transparent transparent;
  scrollbar-track-color: transparent;
  -ms-scrollbar-track-color: transparent;
  overflow: -moz-scrollbars-none;
  /*三角箭头的颜色*/
  // scrollbar-arrow-color: #fff;
  /*滚动条滑块按钮的颜色*/
  scrollbar-face-color: rgb(6, 12, 35);
  /*滚动条整体颜色*/
  scrollbar-highlight-color: rgb(6, 12, 35);
  /*滚动条阴影*/
  scrollbar-shadow-color: rgb(6, 12, 35);
  /*滚动条轨道颜色*/
  scrollbar-track-color: rgb(6, 12, 35);
  /*滚动条3d亮色阴影边框的外观颜色——左边和上边的阴影色*/
  scrollbar-3dlight-color: rgb(6, 12, 35);
  /*滚动条3d暗色阴影边框的外观颜色——右边和下边的阴影色*/
  scrollbar-darkshadow-color: rgb(6, 12, 35);
  /*滚动条基准颜色*/
  scrollbar-base-color: rgb(6, 12, 35);
}
.scroll-bar::-webkit-scrollbar {
  width: 5px;
  height: 10px;
}
.scroll-bar::-webkit-scrollbar-track {
  background: rgb(6, 12, 35);
  border-radius: 2px;
}
.scroll-bar::-webkit-scrollbar-thumb {
  background: rgb(6, 12, 35);
  border-radius: 10px;
}
.scroll-bar::-webkit-scrollbar-thumb:hover {
  background: rgb(6, 12, 35);
}
.scroll-bar::-webkit-scrollbar-corner {
  background: rgb(6, 12, 35);
}
</style>
