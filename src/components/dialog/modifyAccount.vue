<!--
 * @Author: your name
 * @Date: 2021-08-10 16:33:15
 * @LastEditTime: 2021-11-15 16:54:00
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \centralized-control-sys-web\src\components\dialog\modifyAccount.vue
-->
<template>
  <div>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <span>这是一段信息</span>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleClose" plain>取 消</el-button>
        <el-button type="primary" @click="handleSure">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    dialogVisibleAccount: {
      type: Boolean
    }
  },
  components: {},

  data() {
    return {
      dialogVisible: true
    };
  },

  computed: {},

  created() {},

  mounted() {},
  watch: {
    dialogVisible: function (val) {
      this.$emit('handleDialogVisibleAccount', val);
    }
  },
  methods: {
    handleClose() {
      this.dialogVisible = false;
      // this.$emit("handleDialogVisibleAccount", false);
    },
    handleSure() {
      this.dialogVisible = false;
      // this.$emit("handleDialogVisibleAccount", false);
    }
  }
};
</script>
<style lang='scss' scoped>
</style>
