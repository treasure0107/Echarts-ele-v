<!--
 * @Descripttion:风机列表
 * @Date: 2021-01-07 14:41:56
-->
<template>
  <div class="generator-list-container">

    <div
      :color="['#164F76', '#164F76']"
      backgroundColor="#060c23"
    >
      <div class="header-container text-center">
        <p>风机列表</p>
      </div>
      <div class="generator-con">
        <ul class="generator-list text-gray">
          <li
            :class="[activeIdx ==key?'active':'','generator-list-item']"
            v-for="(item,key) in items"
            :key="key"
            @click="selectItem(item,key)"
          >
            <div :class="[item.runningStatus == 1?'run-type':item.runningStatus == 2?'repair-type':item.runningStatus == 3?'fault-type':item.runningStatus == 4?'warn-type':'danger-type']">{{item.deviceName}}</div>
          </li>
        </ul>
      </div>
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
    },
    activeIdx: {
      type: [String, Number],
      default: 0
    }
  },
  data() {
    return {
      // activeIdx: 0
    };
  },
  computed: {},
  watch: {},
  created() { },
  mounted() { },
  methods: {
    selectItem(item, key) {
      this.$emit('update:activeIdx', key);
      this.$emit('changeActiveIdx', { id: item.deviceId, code: item.deviceCode });
    }
  }
};
</script>

<style scoped lang="scss">
.generator-list-container {
  position: absolute;
  width: 160px;
  height: 900px;
  left: 20px;
  top: 40px;
  box-shadow: #164f76 0px 0px 40px inset;

  .header-container {
    font-size: 16px;
    p {
      margin-top: 16px;
    }
  }
  .generator-con {
    height: 860px;
    overflow: auto;
  }
  .generator-list {
    font-size: 13px;
    padding: 20px;
    box-sizing: border-box;
    // height: calc(100% - 100px);
    // overflow: auto;
  }
  .generator-list-item {
    text-align: center;
    padding: 15px 10px;
    cursor: pointer;
    &:hover {
      background: #163d70;
    }
  }
  .active {
    background: #163d70;
    color: #ffffff;
  }
  .run-type {
    color: #33dec4;
  }
  .repair-type {
    color: #ffd868;
  }
  .fault-type {
    color: #ff3d57;
  }
  .warn-type {
    color: #fb9602;
  }
  .danger-type {
    color: #7c919b;
  }
}
</style>
