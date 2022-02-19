<!--
 * @Author: your name
 * @Date: 2021-08-10 16:33:15
 * @LastEditTime: 2021-11-04 10:17:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \centralized-control-sys-web\src\layout\index.vue
-->

<template>
  <div class="layout-container">
    <Header />
    <AppMain />
  </div>

</template>

<script>
import Header from './components/Header';
import AppMain from './components/AppMain';
export default {
  name: 'GroupLayout',
  components: { Header, AppMain },
  data() {
    return {
      scale: null,
      width: 1920,
      height: 1080
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
.layout-container {
  width: 100%;
  height: 100%;
}
.scale-box-container {
  transform-origin: 0 0;
  position: absolute;
  left: 50%;
  top: 50%;
  // transition: 0.3s;
}
</style>
