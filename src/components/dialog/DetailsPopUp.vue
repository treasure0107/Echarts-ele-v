<!--
 * @Author: your name
 * @Date: 2021-08-10 16:33:15
 * @LastEditTime: 2021-11-15 16:54:24
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \centralized-control-sys-web\src\components\dialog\DetailsPopUp.vue
-->
<!--
 * @Author: JTune
 * @Description: 查看详情弹窗
 * @FilePath: \centralized-control-sys-web\src\components\dialog\detailsPopUp.vue
-->
<template>
  <div>
    <el-dialog
      title="详情"
      :visible.sync="dialogVisible"
      width="800px"
      :before-close="handleClose"
      :class="isBlack?'dialog-detail-black':'dialog-detail'"
      :close-on-click-modal="false"
    >
      <slot name="content"></slot>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <!-- <el-button
          type="primary"
          @click="handleSure"
        >确 认</el-button> -->
        <el-button
          type="primary"
          @click="handleClose"
        >关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    // 是否需要显示弹窗
    dialogVisibleDetail: {
      type: Boolean,
      default: false
    },
    // 是否需要黑色背景
    isBlack: {
      type: Boolean,
      default: false
    }
  },
  components: {},

  data() {
    return {
      dialogVisible: true
      // modal: false
    };
  },

  computed: {},

  created() { },

  mounted() { },
  watch: {
    dialogVisible: function (val) {
      this.$emit('handleDialogVisibleDetail', val);
    }
  },
  methods: {
    handleClose() {
      this.dialogVisible = false;
    },
    handleSure() {
      this.dialogVisible = false;
    }
  }
};
</script>
<style lang='scss' scoped>
::v-deep.dialog-detail {
  .el-dialog {
    margin-top: 25vh !important;
  }
  .el-dialog__title {
    font-size: 14px;
    color: #fff;
  }
  .el-dialog__header {
    padding-top: 16px;
    background-color: #3a3a4b;
  }
  .el-dialog__body {
    font-size: 14px;
    color: #333333;
  }
  .dialog-footer {
    padding-top: 20px;
    border-top: 1px solid #dcdfe4;
    .el-button {
      width: 60px;
      height: 32px;
      background-color: #3350d4;
    }
    .el-button--primary {
      border-color: #3350d4;
    }
  }
}

::v-deep.dialog-detail-black {
  .el-dialog {
    margin-top: 25vh !important;
    background-color: #131d4a;
  }
  .el-dialog__title,
  .el-dialog__body {
    font-size: 14px;
    color: #fff;
  }
  .el-dialog__header {
    padding-top: 16px;
    background-color: #2a3460;
  }
  .dialog-footer {
    .el-button {
      background-color: #3350d4;
    }
    .el-button--primary {
      border-color: #3350d4;
    }
  }
}
</style>
