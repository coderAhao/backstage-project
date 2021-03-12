<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="~@/assets/logo.png" alt="">
      </div>
      <!-- 登录表单区域 -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-s-custom" v-model="loginForm.username" ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password" prefix-icon="el-icon-search" class="password"></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>

</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123456',
      },
      loginFormRules: {
        username: [
          { required: true, message: '请输入登录名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetLoginForm() {
      // Ele自带的重置方法,只需要获取到当前对象并对其调用此重置方法即可
      this.$refs.loginFormRef.resetFields();
    },
    login() {
      // 登录方法需要传递一个回调函数作为形参
      this.$refs.loginFormRef.validate(async valid => {
        if(!valid) return;
        // 将请求到的实际数据data重命名为res
        const {data: res} = await this.$http.post('login', this.loginForm);
        if(res.meta.status !== 200) return this.$message.error('用户名或密码输入错误,请重新输入');
        this.$message.success('登录成功')

        // 将登录成功后的token保存在客户端的seeeion Storage中
        // 项目中除了登录之外的其他API接口都必须在登录成功之后访问
        // token只在当前网站打开期间生效
        window.sessionStorage.setItem("token", res.data.token);

        // 登录成功并将tooken保存在客户端后就可以进入网站主页面了
        this.$router.push("/home")

        console.log(res);
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .login_container {
    background: #2b4b6b;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .login_box {
    position: relative;
    width: 450px;
    height: 300px;
    border-radius: 3px;
    background: #fff;
  }
  .avatar_box {
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    background: #fff;
    img {
      width: 100%;
      height: 100%;  
      border-radius: 50%;
      background: #eee;
    }
  }
  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .btns {
    display: flex;
    justify-content: flex-end;
  }
  .username {
    font-size: 20px;
  }
  .password {
    font-size: 24px;
  }
</style>