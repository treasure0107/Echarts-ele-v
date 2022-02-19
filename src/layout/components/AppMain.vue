<!--
 * @Author: your name
 * @Description: In User Settings Edit
 * @FilePath: \centralized-control-sys-web\src\layout\components\AppMain.vue
-->
<template>
  <section
    class="app-main"
    :class="[$route.meta.isGroupHeader ? 'group-bg':$route.meta.isWindGeneratorHeader ?'wind-generator-bg' :'place-bg']"
  >
    <div class="app-container">
      <Breadcrumb
        v-if="!$route.meta.isHideBreadcrumb"
        :data-overview-view="$route.meta.isGroupHeader?false:true"
      />
      <TopNav />
      <router-view />
    </div>

  </section>
</template>

<script>
import TopNav from '@/components/TopNav';
import Breadcrumb from '@/components/Breadcrumb';
export default {
  name: 'AppMain',
  components: { Breadcrumb, TopNav },
  data() {
    return {

    };
  },
  computed: {

  },
  watch: {

  },
  created() { },
  mounted() {
    // console.log(this.$route, '111');
  },
  methods: {

  }

};
</script>

<style scoped lang="scss">
.app-main {
  // min-height: calc(100% - 96px);
  // min-height: calc(100% - 46px);
  // width: 100%;
  position: relative;
  overflow: hidden;
  // box-sizing: border-box;
  &.group-bg {
    background-color: $bg-theme-box;
    padding: 64px 32px 32px;
  }
  &.place-bg {
    background-color: #f0f4fa;
    padding: 64px 71px 32px;
  }
  &.wind-generator-bg {
    // background: #050a20;
    background: #000;
    padding: 86px 71px 10px;
  }
}
</style>
