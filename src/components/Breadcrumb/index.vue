
<template>
  <div class="main-breadcrumb-n">
    <el-breadcrumb
      :class="{'app-breadcrumb':true,'data-overview-view':dataOverviewView}"
      separator="/"
    >
      <transition-group name="breadcrumb">
        <el-breadcrumb-item
          v-for="(item,index) in levelList"
          :key="item.path"
        >
          <span
            v-if="item.redirect==='noRedirect'||index==levelList.length-1"
            class="no-redirect"
          >{{
          item.meta.title }}</span>
          <a
            v-else
            @click.prevent="handleLink(item)"
          >{{item.meta.title}}</a>
        </el-breadcrumb-item>
      </transition-group>
    </el-breadcrumb>
    <div
      class="wind-name-n"
      v-if="isWind"
    >
      <span class="wind-name">{{powerPlant}}</span>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import pathToRegexp from 'path-to-regexp';
export default {
  name: '',
  components: {},
  props: {
    /**
    * 切换数据概览样式
    * @param {String}
    */
    dataOverviewView: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      levelList: null,
      isWind: false
    };
  },
  computed: {
    ...mapState({
      powerPlant: state => state.powerPlant.powerPlant
    })
  },
  watch: {
    $route() {
      this.getBreadcrumb();
    }
  },
  created() {
    this.getBreadcrumb();
  },
  mounted() {
    console.log(' state.powerPlant.powerPlant', this.powerPlant);
  },
  methods: {
    getBreadcrumb() {
      // only show routes with meta.title
      const routes = this.$route;
      this.isWind = routes.meta.isOverview;
      const matched = this.$route.matched.filter(item => item.meta && item.meta.title);

      this.levelList = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false);
    },
    isDashboard(route) {
      const name = route && route.name;
      if (!name) {
        return false;
      }
    },
    pathCompile(path) {
      // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
      const { params } = this.$route;
      var toPath = pathToRegexp.compile(path);
      return toPath(params);
    },
    handleLink(item) {
      const { redirect, path } = item;
      if (redirect) {
        this.$router.push(redirect);
        return;
      }
      this.$router.push(this.pathCompile(path));
    }
  }
};
</script>

<style lang="scss">
.main-breadcrumb-n {
  display: flex;
  .app-breadcrumb {
    margin-bottom: 20px;
    flex: 1;

    //面包屑
    .el-breadcrumb__inner a,
    .el-breadcrumb__separator {
      color: #ffffff !important;
      opacity: 0.6;
      &:hover {
        color: #3350d4 !important;
        font-weight: 700;
        opacity: 1;
      }
    }
    .el-breadcrumb__inner {
      font-size: 12px;
      font-weight: 700;
      color: #ffffff !important;
    }
    &.data-overview-view {
      margin-top: 20px;
      .el-breadcrumb__inner a,
      .el-breadcrumb__separator {
        color: #8a8a8a !important;
        opacity: 1;
        &:hover {
          color: #3350d4 !important;
          font-weight: 700;
          opacity: 1;
        }
      }
      .el-breadcrumb__inner {
        font-size: 12px;
        font-weight: 700;
        color: #333333 !important;
        &:hover {
          font-weight: 700;
        }
      }
    }
  }
  .wind-name-n {
    flex: 1;
    text-align: right;
    .wind-name {
      display: inline-block;
      min-width: 160px;
      height: 32px;
      line-height: 32px;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      padding-left: 10px;
      padding-right: 10px;
      margin-top: 11px;
      text-align: left;
      border: 1px solid #dcdfe4;
      color: #333333;
      background: #fff;
    }
  }
}
</style>
