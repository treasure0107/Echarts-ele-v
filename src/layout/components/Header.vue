<!--
 * @Author: JTune
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \centralized-control-sys-web\src\layout\components\Header.vue
-->

<template>
  <div>
    <div
      v-show="!$route.meta.isHeaderHide && $route.meta.isGroupHeader"
      class="group-header-container flex-box flex-align-center"
    >
      <div class="head-logo"></div>
      <div class="head-title position-center">admin</div>
      <div class="login-out">
        <div class="fl mr-20 font-14">{{timeWeek}}</div>
        <div class="fl">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              用户名：{{$store.state.login.userName}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="1">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
    <div
      v-show="!$route.meta.isHeaderHide && !$route.meta.isGroupHeader"
      class="place-header-container flex-box flex-align-center"
    >
      <div class="head-title flex-1 t-l">
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
          router
          background-color="#3a3a4b"
          text-color="rgba(255,255,255,0.6)"
          active-text-color="#fff"
        >
          <el-menu-item index="/home">集团首页</el-menu-item>
          <el-menu-item index="/dataOverview">数据概览</el-menu-item>
          <el-menu-item index="/runCondition">风机</el-menu-item>
          <el-menu-item index="/runningStatus">升压站设备</el-menu-item>
          <el-menu-item index="/connectionDiagram">接线图</el-menu-item>
        </el-menu>
      </div>
      <div class="ml-10">
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            用户名：{{$store.state.login.userName}}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="1">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>

</template>

<script>
import Api from '@/utils/api.js';
import { timeWeekFormat } from '@/utils/utils';
export default {
  name: '',
  components: {},
  data() {
    return {
      activeIndex: '/dataOverview',
      times: new Date(),
      timer: null
    };
  },
  computed: {
    timeWeek() {
      return timeWeekFormat(this.times);
    }
  },
  watch: {
    $route: function (newVal, oldVal) {
      this.handleSetActiveIndex(newVal);
    }
  },
  created() { },
  mounted() {
    this.handleSetActiveIndex(this.$route);
    this.timer = setInterval(() => {
      this.times = new Date();
    }, 1000);
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  methods: {
    /**
     * @description: 退出登录
     */
    handleCommand(command) {
      if (command == 1) {
        const loginName = this.$store.state.login.loginName || this.$store.state.login.userName;
        const data = {
          data: {
            loginName
          }
        };
        this.$axios.post(Api.login.loginOut, data, (res) => {
          if (res.isSuccess) {
            this.$store.commit('CHANGE_SID', '');
            this.$store.commit('CHANGE_LONGIN_NAME', '');
            this.$store.commit('CHANGE_USER_NAME', '');
            this.$message.success('退出登录！');
            this.$router.push({ path: '/login' });
          } else {
            this.$message.error(res.message);
          }
        });
      }
    },
    handleSelect(index, keyPath) {

    },
    /**
     * @description: 设置activeIndex方法
     * @param {*} route 新的路由对象
     */
    handleSetActiveIndex(route) {
      if (route.meta.isOverview) {
        this.activeIndex = '/dataOverview';
      } else if (route.meta.isDiagram) {
        this.activeIndex = '/connectionDiagram';
      } else if (route.meta.isWind) {
        this.activeIndex = '/runCondition';
      } else {
        this.activeIndex = '/' + route.name;
      }
    }
  }
};
</script>
<style scoped lang="scss">
.group-header-container {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 64px;
  padding: 0 32px;
  z-index: 99;
  color: #fff;
  box-sizing: border-box;
  background: url("~@/assets/image/head-bg.png") center center no-repeat;
  background-size: 100% 100%;
  border: none;
  overflow: hidden;
  text-align: center;
  .head-logo {
    width: 32px;
    height: 32px;
    position: absolute;
    left: 32px;
    top: 9px;
    border-radius: 50%;
    background: url(~@/assets/image/logo-icon.png) center no-repeat;
    background-size: cover;
  }
  .head-title {
    font-size: 30px;
    line-height: 64px;
  }
  .login-out {
    position: absolute;
    top: 20px;
    right: 32px;
  }
}
.place-header-container {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 64px;
  padding: 0 32px;
  z-index: 99;
  color: #fff;
  box-sizing: border-box;
  background-color: #3a3a4b;
  border: none;
  overflow: hidden;

  .head-title {
    font-size: 30px;
    line-height: 64px;
  }
}
.el-dropdown-link {
  cursor: pointer;
  color: #fff;
}
::v-deep .el-menu.el-menu--horizontal {
  border: 0;
  > .el-menu-item {
    border-bottom-color: #3350d4;
  }
  > .el-menu-item.is-active {
    background-color: #313140 !important;
    border-bottom-color: #313140 !important;
  }
}
</style>
