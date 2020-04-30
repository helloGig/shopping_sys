<template>
  <el-container class="home-container">
    <!--头部-->
    <el-header>
      <div>
        <img src="../assets/picture/home/heima.png" alt />
        <span>电商管理后台</span>
      </div>
      <el-button type="info" @click="fnquit()">退出</el-button>
    </el-header>
    <el-container>
      <!--侧边栏-->
      <el-aside :width="isCollapse ? '64px':'200px'">
        <div class="toggle-button" @click="fnToggleCollapse()">|||</div>
        <!--侧边栏菜单-->
        <el-menu
          :default-active="activePath"
          :router="true"
          :collapse-transition="false"
          :collapse="isCollapse"
          :unique-opened="true"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
        >
          <!--二级菜单-->
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <!--二级菜单模板区域-->
            <template slot="title">
              <!--图标-->
              <i :class="iconName[item.id]"></i>
              <!--文本-->
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item
              :index="'/'+subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="fnSaveNavState('/'+subItem.path)"
            >
              <template slot="title">
                <!--图标-->
                <i class="el-icon-menu"></i>
                <!--文本-->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--主体-->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      //是否展开列表
      isCollapse: true,
      //列表状态
      activePath: "",
      menuList: [],
      iconName: {
        "125": "iconfont icon-user",
        "103": "iconfont icon-tijikongjian",
        "101": "iconfont icon-shangpin",
        "102": "iconfont icon-danju",
        "145": "iconfont icon-baobiao"
      }
    };
  },
  created() {
    this.fnGetMenuList();
    this.activePath=window.sessionStorage.getItem('activePath');
  },
  methods: {
    //退出
    fnquit() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    //获取所有的菜单
    async fnGetMenuList() {
      const { data: _request } = await this.$http.get("menus");
      if (_request.meta.status !== 200)
        return this.$message.error(_request.meta.msg);
      this.menuList = _request.data;
      console.log(this.menuList);
    },
    //点击按钮切换菜单的折叠喝展开
    fnToggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    //保存左侧列表状态
    fnSaveNavState(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
      this.activePath=activePath;
    }
  }
};
</script>
<style lang="less" scoped>
.el-header {
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  background: #373d41;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background: #333744;
  .el-menu {
    border-right: 0px;
  }
}
.el-main {
  background: #eaedf1;
}
.home-container {
  height: 100%;
}
.iconfont {
  margin-right: 10px;
  font-size: 20px;
}
.toggle-button {
  background: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>