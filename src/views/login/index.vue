<template>
  <div class="login-main">
    <div class="login-con">
      <h1>admin</h1>
      <div>
        <el-input
          v-model="loginName"
          placeholder="请输入用户名"
          size="middle"
        >
          <i
            slot="prefix"
            class="el-input__icon el-icon-user-solid"
          ></i>
        </el-input>
      </div>
      <div class="mt30">
        <el-input
          placeholder="请输入密码"
          v-model="password"
          show-password
          @keyup.enter.native="handleLogin"
          size="middle"
        >
          <i
            slot="prefix"
            class="el-input__icon el-icon-s-goods"
          ></i>
        </el-input>
      </div>
      <el-button
        class="mt30 login-btn"
        type="primary"
        @click="handleLogin"
      >登 录</el-button>
    </div>
  </div>
</template>

<script>
import Api from '@/utils/api.js';
export default {
  components: {},

  data() {
    return {
      loginName: '',
      password: ''
    };
  },

  computed: {},

  created() { },

  mounted() { },

  methods: {
    handleLogin() {
      if (!this.loginName) {
        this.$message.warning('请输入账户');
        return;
      }
      if (!this.password) {
        this.$message.warning('请输入密码');
        return;
      }
      const data = {
        data: {
          loginName: this.loginName,
          password: this.password
        }
      };
      this.$axios.post(Api.login.login, data, (res) => {
        if (res.isSuccess) {
          this.$store.commit('CHANGE_SID', res.sid);
          this.$store.commit('CHANGE_LONGIN_NAME', this.loginName);
          this.$store.commit('CHANGE_USER_NAME', res.data.user.name);
          this.$message.success('登录成功！');
          window.localStorage.removeItem('activeIndex');
          this.$router.push({ path: '/' });
        } else {
          this.$message.error(res.message);
        }
      });
    }
  }
};
</script>
<style lang='scss' scoped>
.login-main {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #cc6300;
  background: url(~@/assets/image/logo.jpg) center no-repeat;
  background-size: 100% 100%;
  .login-con {
    // width: 360px;
    // height: 300px;
    width: 390px;
    height: 360px;
    background-color: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-30%, -60%);
    text-align: center;
    border-radius: 6px;
    padding: 30px;
    .mt30 {
      margin-top: 30px;
    }
    .mb30 {
      margin-bottom: 30px;
    }
    h1 {
      font-size: 30px;
      margin-top: 10px;
      margin-bottom: 60px;
      color: #333;
    }
    .login-btn {
      font-size: 16px;
      width: 100%;
      padding: 13px;
    }
  }
}
</style>
