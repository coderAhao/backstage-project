<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="~@/assets/imgs/heima.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- menu一级菜单 submenu二级菜单 menu-item三级菜单 -->
        <!-- 要重写某个属性可以简写如“:router="true"”简写为“router” -->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409EFF" unique-opened :collapse="isCollapse" :collapse-transition="false" router :default-active="activePath">
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
          <!-- 一级菜单模板区域 -->
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span slot="title">{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/' + subItem.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span slot="title">{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>  
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
</el-container>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      // 左侧菜单栏
      menulist: [],
      iconsObj: {
        '125': 'el-icon-user-solid',
        '103': 'el-icon-box',
        '101': 'el-icon-shopping-bag-1',
        '102': 'el-icon-message',
        '145': 'el-icon-s-platform',
      },
      // 菜单栏是否折叠
      isCollapse: false,
      // 被激活的链接地址
      avtivePath: '',
    }
  },
  created() {
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    // 退出登录页面,只需将客户端的token值清除掉再让其跳转到登录页即可,再次访问就要重新登录才有token值
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    // 获取所有菜单
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.console.error(res.meta.msg);
      this.menulist = res.data;
    },
    // 点击按钮切换菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    // 保存链接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath);
      this.activePath = activePath;
    }
  }
};
</script>

<style lang="less" scoped>
  .home-container {
    height: 100%;
  }
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 0;
    font-size: 20px;
    color: #fff;
    background-color: #373d41;
    > div {
      display: flex;
      align-items: center;
      > span {
        margin-left: 15px;
      }
    }
  }
  .el-aside {
    background-color: #333744;
    > .el-menu {
      border-right: 0;
    }
  }
  .toggle-button {
    line-height: 24px;
    text-align: center;
    font-size: 10px;
    letter-spacing: 0.2em;
    background-color: #4a5064;
    color: #fff;
    cursor: pointer;
  }
  .el-main {
    background-color: #eaefd1;
  }
</style>