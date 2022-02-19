<!--
 * @Author: your name
 * @Description: In User Settings Edit
 * @FilePath: \centralized-control-sys-web\src\views\connectionDiagram\index.vue
-->
<template>
  <div
    class="data-overview-container"
    v-loading='loading'
  >
    <div class="preview-con">
      <topology
        preview="true"
        v-show="isShow"
        :configs="topologyConfigs"
        :data="defalutData"
      />
    </div>
  </div>
</template>

<script>
import { wsUrl } from '@/config/env.js';
import { mapState } from 'vuex';
import Api from '@/utils/api.js';
import Vue from 'vue';
import Topology from 'topology-vue';
Vue.use(Topology);
import 'topology-vue/topology-vue.css';
// import axios from 'axios';
// import {
//   defalutData
// } from './wiringDiagramJson/mainData.js';
export default {
  name: '',
  data() {
    return {
      loading: false,
      formData: {
        errorCount: 0,
        normalCount: 0,
        pic: '',
        total: 0
      },
      topologyConfigs: {
        license: {
          key: '33823',
          value: '2488J8e8J8e82848M828J8gAa848g8V8e848V8e8i83848j8eAo',
          version: '16AkAjAZ'
        }
      },
      defalutData: {},
      isShow: false
    };
  },
  computed: {
    ...mapState({
      powerPlant: state => state.powerPlant.powerPlant,
      powerPlantId: state => state.powerPlant.powerPlantId
    })
  },
  watch: {
    powerPlantId: function (val) {
      this.init();
      window.registerTools();
    }
  },
  created() {
    this.loading = true;
    window.registerTools();
    this.init();
    // window.topology.fitView(16);
    // const newInstance = axios.create({
    //   baseURL: '',
    //   timeout: 5000,
    //   headers: { 'Content-type': 'json' }
    // });
    // newInstance.get('jsonData/wiringDiagramData.json').then(res => {
    //   const data = res.data;
    //   this.defalutData = data;
    //   // console.log('hello1', data);
    //   this.isShow = true;
    //   setTimeout(() => {
    //     this.loading = false;
    //     window.topology.fitView(16);
    //     // window.topology.render();
    //   }, 0);
    // });
  },
  mounted() {},
  methods: {
    init() {
      const powerPlantId = this.powerPlantId;
      this.$axios.get(Api.connectionDiagram.queryPowerPlantDeviceCount + '?powerPlantId=' + powerPlantId, {}, (res) => {
        if (res.isSuccess) {
          this.loading = false;
          if (!res.data.pic) {
            this.$message.warning('没有接线图数据');
            this.defalutData = {};
            return;
          }
          this.formData = res.data;
          this.defalutData = JSON.parse(res.data.pic);
          const jsonData = res.data.jsonData;
          setTimeout(() => {
            jsonData.map(item => {
              this.setDiagramData(item);
            });
          }, 1000);
          const websocketUrl = `${wsUrl}ws/diagram/${this.powerPlantId}`;
          this.isShow = true;
          setTimeout(() => {
            window.topology.fitView(16);
            window.topology.closeSocket();
            window.topology.data.websocket = websocketUrl;
            window.topology.openSocket();
            window.topology.data.socketEvent = true;
            window.topology.on('websocket', (e) => {
              this.setDiagramData(e);
            });
            // window.topology.getValue('LHS-YX006','icon').charCodeAt().toString(16);
            // window.topology.getValue('aaaaaa', 'iconFamily');  topology.activeLayer.pens
          }, 0);
        } else {
          this.$message.error(res.message);
          this.loading = false;
        }
      });
    },
    setDiagramData(param) {
      const obj = JSON.parse(param);
      const { data } = obj;
      if (obj.module == 'telemetering' || obj.module == 'telepulse') {
        window.topology.setValue({
          'tag': data.tag,
          'text': data.value
        });
      } else {
        const iconCode = window.topology.getValue(data.tag, 'icon') ? window.topology.getValue(data.tag, 'icon').charCodeAt().toString(16) : 'e95b';
        let colors = '#ef2d05ff';
        let circleColor = '#ADA7A7FF';
        if (data.value == 1) {
          colors = '#ef2d05ff';
          circleColor = '#F5A623FF';
        } else {
          colors = '#7afc2eff';
          circleColor = '#ADA7A7FF';
        }
        if (iconCode == 'e95b') {
          window.topology.setValue({
            'tag': data.tag,
            'iconColor': colors
          });
        } else {
          if (data.value == 1) {
            window.topology.setValue({
              'tag': data.tag,
              'icon': '\uea61',
              'iconFamily': 'ltdx', // ltdx变成十字架 电气工程常用
              'iconColor': colors
            });
          } else {
            window.topology.setValue({
              'tag': data.tag,
              'icon': '\ue95d',
              'iconFamily': 'sgcc', // sgcc 变成开关 国家电网图元规范
              'iconColor': colors
            });
          }
        }
        const tagName = window.topology.getValue(data.tag, 'name'); // circle fillStyle  灰色 #ADA7A7FF ,橙色 #F5A623FF
        if (tagName == 'circle') {
          window.topology.setValue({
            'tag': data.tag,
            'fillStyle': circleColor
          });
        }
      }
    }
  }
};
</script>

<style scoped lang="scss">
.data-overview-container {
  width: 100%;
  // height: calc(100vh -300px);
  overflow: hidden;
  color: #333;
  h1 {
    font-size: 14px;
  }
  .c-h {
    height: 32px;
    padding: 10px 0 40px 0;

    h1 {
      font-size: 14px;
      line-height: 32px;
    }
    .h-n {
      text-align: right;
      height: 30px;
      .wind-name {
        display: inline-block;
        min-width: 160px;
        height: 32px;
        line-height: 32px;
        font-size: 14px;
        font-weight: 400;
        padding-left: 10px;
        padding-right: 10px;
        text-align: left;
        border: 1px solid #dcdfe4;
        color: #333333;
        background: #fff;
      }
    }
  }
  .preview-con {
    width: 100%;
    // height: 806px;
    height: calc(100vh - 163px);
    overflow: hidden;
  }

  .connection-diagram-content {
    width: 100%;
    background: #fff;
    padding: 20px 13px;
    box-sizing: border-box;
    position: relative;
    .connection-diagram-info {
      position: absolute;
      .connection-diagram-item {
        background: #f3f3f3;
        border: 1px solid #dcdfe4;
        box-sizing: border-box;
        font-size: 16px;
        font-weight: bold;
        line-height: 21px;
        padding: 7px 13px;
        cursor: pointer;
        .run {
          color: #22cce2;
        }
        .fault {
          color: #ff3d57;
        }
      }
    }

    .connection-diagram-img {
      height: 100%;
      padding: 10px;
      box-sizing: border-box;
      margin: auto;
      text-align: center;
      .title {
        font-size: 16px;
        font-weight: bold;
        line-height: 21px;
        color: #333333;
      }
      img {
        width: 90%;
        margin: auto;
      }
    }
  }
}
</style>
