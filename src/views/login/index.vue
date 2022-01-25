<template>
  <div class="login-container">
    <el-form
      size="medium"
      :rules="rules"
      ref="loginForm"
      :model="loginForm"
      class="loginForm"
    >
      <el-form-item>
        <div class="login-title">小区物业系统</div>
      </el-form-item>
      <el-form-item prop="username" label="用户名">
        <el-input
          type="text"
          v-model="loginForm.username"
          placeholder="请输入用户名"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password" label="密码">
        <el-input
          type="password"
          v-model="loginForm.password"
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>
      <el-form-item prop="userType">
        <el-radio-group v-model="loginForm.userType">
          <el-radio :label="'0'">业主</el-radio>
          <el-radio :label="'1'">物业</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-button @click="submit()" class="my-button" type="primary">登录</el-button>
          </el-col>
          <el-col :span="12">
            <el-button class="my-button">取消</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        loginForm: {
          username: "", //登录名
          password: "", //密码
          userType: "0", //用户类型 0：业主 1：物业
        },
        rules: {
          username: [
            {
              required: true,
              trigger: "change",
              message: "请输入用户名",
            },
          ],
          password: [
            {
              required: true,
              trigger: "change",
              message: "请输入密码",
            },
          ],
          userType: [
            {
              required: true,
              trigger: "change",
              message: "请选择用户类型",
            },
          ],
        },
      };
    },
    created() {},
    methods: {
      async submit() {
        this.$refs.loginForm.validate(async (valid) => {
          if (valid) {
            this.loading = true;
            this.$store
              .dispatch("user/login", this.loginForm)
              .then((res) => {
                this.$router.push({ path: this.redirect || "/" });
                this.loading = false;
              })
              .catch((error) => {
                this.loading = false;
              });
          }
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .login-container {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url("../../assets/images/login_bg.png");
  }

  .loginForm {
    height: 380px;
    width: 450px;
    border-radius: 10px;
    box-shadow: 0 0 25px #cac6c6;
    padding: 20px 35px;
    background-color: #fff;
  }
  .login-title {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    font-weight: 600;
    color: #409eff;
  }
  .my-button {
    width: 100%;
  }
</style>
