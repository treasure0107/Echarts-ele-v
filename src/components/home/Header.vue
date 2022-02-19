
<template>
  <div class="common-chart-head-container">
    <div class="title">{{title}}</div>
    <router-link
      class="arrows-btn"
      tag="div"
      :to="{path: linkOpt.path, query: linkOpt.params}"
    ></router-link>
  </div>
</template>

<script>
export default {
  name: 'Header',
  components: {},
  props: {
    title: {
      type: String,
      default: ''
    },
    linkOpt: {
      type: Object,
      default: () => {
        return {
          path: '',
          params: {}
        };
      }
    }
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() { },
  mounted() { },
  methods: {}
};
</script>

<style scoped lang="scss">
.common-chart-head-container {
  width: 100%;
  height: 33px;
  line-height: 33px;
  position: relative;
  font-size: 14px;
  color: #fff;
  text-align: center;
  .arrows-btn {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 25px;
    height: 25px;
    background: url(~@/assets/image/arrows-r.png) center no-repeat;
    background-size: 100% 100%;
    cursor: pointer;
    &:hover {
      background: url(~@/assets/image/arrows-r-h.png) center no-repeat;
      background-size: 100% 100%;
      cursor: pointer;
    }
  }
}
</style>
