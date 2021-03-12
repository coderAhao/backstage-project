<template>
  <div class="home">
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  name: "Home",
  methods: {
    // 退出登录页面,只需将客户端的token值清除掉再让其跳转到登录页即可,再次访问就要重新登录才有token值
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    }
  }
};
</script>

<style lang="less" scoped>
</style>