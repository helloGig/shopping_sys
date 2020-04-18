<template>
  <div class="login_container">
    <div class="login_box">
      <!--logo区域-->
      <div class="logo_box">
        <img src="../assets/picture/view.png" alt />
      </div>
      <!--表单区域-->
      <!--账户-->
      <el-form ref="loginFormRef" class="form_login" :model="loginForm" :rules="loginFormRule">
        <el-form-item prop="username">
          <el-input
            placeholder="请输入用户名"
            prefix-icon="iconfont icon-user"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="password">
          <el-input
            placeholder="请输入密码"
            type="password"
            prefix-icon="iconfont icon-3702mima"
            v-model="loginForm.password"
          ></el-input>
        </el-form-item>
        <!--按钮-->
        <el-form-item class="btn_login">
          <el-button type="primary" @click="fnLogin()">登录</el-button>
          <el-button type="info" @click="resetForm('loginFormRef')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //登录表单的数据绑定对象,v-model双向绑定
      loginForm: {
        username: "admin",
        password: "123456"
      },
      //表单验证规则
      loginFormRule: {
        //验证用户名是否合法
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        //验证密码是否合法
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 10, message: "长度在 6 到 12 位间", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    //重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
      // console.log(this)
    },
    fnLogin() {
      console.log(JSON.stringify(this.loginForm));
      //表单预验证,通过返回true否则false
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return 0;
        const { data: _requst } = await this.$http.post(
          "login",
          this.loginForm
        );
        console.log(_requst);
        if (_requst.meta.status !== 200)
          return this.$message.error({
            message: "登录失败",
            center: true
          });
        this.$message.success({
          message: "登录成功",
          center: true
        });
        //sessionStorage中的Token只在当前网页打开时候生效
        window.sessionStorage.setItem("Token", _requst.data.token);
        //跳转到主页
        this.$router.push("/home"); //   /是当前目录
      });
    }
  }
};
</script>

<style lang="less" scoped>
.login_container {
  background: #2b4b6b;
  height: 100%;
  position: relative;
}
.login_box {
  width: 450px;
  height: 300px;
  background: white;
  border-radius: 6px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.logo_box {
  height: 130px;
  width: 130px;
  position: absolute;
  top: -21%;
  left: 36.5%;
  border-radius: 50%;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
  }
}
.form_login {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}
.btn_login {
  display: flex;
  justify-content: flex-end;
}
</style>