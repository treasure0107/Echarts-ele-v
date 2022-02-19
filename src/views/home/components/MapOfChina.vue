<!--
 * @Descripttion:风机运行地图展示
 * @version:参考 https://echarts.apache.org/examples/zh/editor.html?c=doc-example/scatter-visualMap-piecewise
 * @Author: JTune
 * @Date: 2020-10-14 17:12:06
-->
<template>
  <div class="map-container">
    <el-button
      size="medium"
      type="primary"
      @click.native="handleLinkTo()"
      class="btn link-btn"
    >大屏模式</el-button>

    <el-button
      size="mini"
      type="primary"
      v-if="provincesName"
      @click="backMap()"
      class="btn back-btn"
    >返 回</el-button>

    <div
      id="MapOfChina"
      style="width:100%;height:100%;"
    ></div>
    <div class="map-info">
      <div>
        <span class="map-ic type1"></span>
        <span>并网运行</span>
      </div>
      <div>
        <span class="map-ic type2"></span>
        <span>限电运行</span>
      </div>
      <div>
        <span class="map-ic type3"></span>
        <span>停电检修</span>
      </div>
      <div>
        <span class="map-ic type4"></span>
        <span>调试中</span>
      </div>
    </div>
    <div
      class="select-box"
      v-show="isShow"
    >
      <!-- <div class="item active">莲花山一期</div> -->
      <div
        class="item"
        v-for="(item,index) in nodes"
        :key="index"
        @click="handleLink(item)"
        :class="{'active':index==0}"
      >{{item.name}}</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ChinaEcharts',
  props: {
    item: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      provincesName: '',
      provincesCode: '',
      isShow: false,
      nodes: []
    };
  },
  mounted() { },
  watch: {
    'item': {
      handler: function (newValue, oldValue) {
        newValue.forEach(item => {
          if (item.runningState === 'INTERCONNECTION_RUN') {
            item.value = 1;
          } else if (item.runningState === 'RATION_THE_POWER_SUPPLY_RUN') {
            item.value = 2;
          } else if (item.runningState === 'POWER_CUT_MAINTENANCE') {
            item.value = 3;
          } else {
            item.value = 4;
          }
        });
        this.loadChart();
      },
      deep: true
    }
  },
  methods: {
    handleLinkTo() {
      window.location.href = 'http://bserver.runshihua.com/rshfans/';
    },
    backMap() {
      this.provincesName = '';
      this.provincesCode = '';
      this.loadChart();
    },
    loadChart() {
      const provinces = require(`@/utils/map/provinces.json`);
      const provincesCode = require(`@/utils/map/provincesCode.json`);
      // 初始化echarts实例
      this.$echarts.init(document.getElementById('MapOfChina')).dispose(); // 销毁实例
      var myChart = this.$echarts.init(document.getElementById('MapOfChina'));
      const that = this;
      var convertData = function (data) {
        var res = [];
        // data[i].nodes
        for (var i = 0; i < data.length; i++) {
          var arr = [data[i].longitude, data[i].latitude, data[i].region, data[i].id, data[i].name, data[i].value];
          if (that.provincesName) {
            if (that.provincesCode.substring(0, 2) == data[i].region.substring(0, 2)) {
              res.push(arr);
            }
          } else {
            res.push(arr);
          }
        }
        return res;
      };
      // 地图配置项
      if (this.provincesName) {
        initEcharts(this.provincesName);
      } else {
        initEcharts('china');
      }
      function initEcharts(map) {
        const option = {
          tooltip: {
            trigger: 'item',
            formatter: function (params) {
              return `${params.data[4]}:${params.data[5] == 1 ? '并网运行' : params.data[5] == 2 ? '限电运行' : params.data[5] == 3 ? '停电检修' : '调试中'}`;
            }
          },
          visualMap: {
            min: 1,
            max: 3,
            splitNumber: 3,
            textStyle: {
              color: '#fff'
            },
            pieces: [
              { value: 1, color: '#22CCE2' },
              { value: 2, color: '#FEBA02' },
              { value: 3, color: '#FF3D57' },
              { value: 4, color: '#b5b5b5' }
            ],
            show: false// 图注
          },
          geo: {
            map: map,
            roam: !!that.provincesName,
            selectedMode: false,
            zoom: that.provincesName ? 0.9 : 1.2,
            // 图形上的文本标签，可用于说明图形的一些数据信息
            label: {
              normal: {
                show: true,
                fontSize: '12',
                color: 'rgba(255,255,255,1)'
              },
              emphasis: { // 动态展示的样式
                color: '#ffffff'
              }
            },
            // 地图区域的多边形 图形样式，有 normal 和 emphasis 两个状态
            itemStyle: {
              // normal 是图形在默认状态下的样式；
              normal: {
                areaColor: '#082C93',
                borderWidth: 2,
                borderColor: '#070B47'
              },
              // emphasis 是图形在高亮状态下的样式，比如在鼠标悬浮或者图例联动高亮时。
              emphasis: {
                areaColor: '#0f1185',
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowBlur: 20,
                borderWidth: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          },
          series: [
            {
              mapType: map,
              type: 'scatter',
              coordinateSystem: 'geo',
              data: convertData(that.item)
            }
          ]
        };
        myChart.setOption(option);
      }
      // 点击触发
      myChart.on('click', param => {
        if (param.data) {
          const paramId = param.data[3];
          let nodes = [];
          const list = this.item || [];
          list.map(params => {
            if (params.id == paramId) {
              nodes = params.nodes;
            }
          });
          // 判断风电场是否有区分
          if (nodes.length) {
            this.isShow = true;
            this.nodes = nodes;
          } else {
            this.$store.commit('CHANGE_POWER_PLANT_ID', param.data[3]);
            this.$store.commit('CHANGE_POWER_PLANT', param.data[4]);
            this.$router.push({ path: '/dataOverview' });
          }
        } else {
          if (param.name in provinces) {
            // 处理省模块
            that.provincesName = param.name;
            for (const key in provincesCode) {
              if (param.name == key) {
                that.provincesCode = provincesCode[key];
                break;
              }
            }
            for (const key in provinces) {
              if (that.provincesName == key) {
                showProvince(provinces[key], key);
                break;
              }
            }
          }
        }
      });
      // 展示对应的省
      function showProvince(eName, param) {
        const data = require(`@/utils/map/province/${eName}.json`);
        that.$echarts.registerMap(param, data);
        initEcharts(param);
      }
    },
    handleLink(item) {
      this.$store.commit('CHANGE_POWER_PLANT_ID', item.id);
      this.$store.commit('CHANGE_POWER_PLANT', item.name);
      this.$router.push({ path: '/dataOverview' });
    }
  }
};
</script>
<style scoped lang="scss">
.map-container {
  width: 840px;
  height: 700px;
  position: absolute;
  top: 100px;
  left: 540px;
  .map-info {
    position: absolute;
    bottom: 20px;
    left: 60px;

    div {
      float: left;
      margin-right: 5px;
    }
    .map-ic {
      height: 10px;
      width: 10px;
      display: inline-block;
      border-radius: 10px;
      margin-right: 5px;
    }
    .type1 {
      background: #22cce2;
    }
    .type2 {
      background: #feba02;
    }
    .type3 {
      background: #ff3d57;
    }
    .type4 {
      background: #b5b5b5;
    }
  }
  .btn {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 99;
  }
  .link-btn {
    text-align: center;
    &.el-button {
      width: 100px;
      height: 34px;
      text-align: center;
      background-color: #3350d4;
    }
  }
  .back-btn {
    &.el-button {
      width: 90px;
      height: 33px;
      background-color: #3350d4;
    }
  }

  .el-button--primary {
    border-color: #3350d4;
  }
  .select-box {
    position: absolute;
    top: 330px;
    right: 3px;
    width: 130px;
    height: 64px;
    background: #0a185b;
    border-radius: 6px;
    .item {
      width: 100%;
      height: 32px;
      line-height: 32px;
      text-align: center;
      font-size: 12px;
      border-radius: 6px 6px 0 0;
      cursor: pointer;
      &:hover {
        background: #28356e;
      }
      &.active {
        background: #0d42e3;
      }
    }
  }
}
</style>
