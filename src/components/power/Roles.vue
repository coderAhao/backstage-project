<template>
  <div class="rolse">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表区域 -->
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template v-slot="scope">
            <!-- for循环按需动态绑定两个类 -->
            <el-row v-for="(itemx, index) in scope.row.children" :key="itemx.id" :class="['bdbottom', index === 0 ? 'bdtop' : '']">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, itemx.id)">{{itemx.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级权限 -->
              <el-col :span="19">
                <el-row v-for="(itemy, indey) in itemx.children" :key="itemy.id" :class="[indey === 0 ? '' : 'bdtop']">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRightById(scope.row, itemy.id)">{{itemy.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning" v-for="(itemz, indez) in itemy.children" :key="itemz.id" closable @close="removeRightById(scope.row, itemz.id)">{{itemz.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">          
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            <el-button type="primary" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
            </template>
        </el-table-column>
      </el-table>
    </el-card>

      <!-- 分配权限的对话框 -->
      <el-dialog title="提示" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClosed">
        <!-- 树形控件 -->
        <el-tree :data="rightsList" :props="treeProps" show-checkbox default-expand-all node-key="id" :default-checked-keys="defKeys" ref="treeRef"></el-tree>
        <!-- 确定取消按钮 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRightDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>
      </el-dialog>

  </div>
</template>

<script>
export default {
  name: 'Roles',
  data() {
    return {
      rolesList: [],
      rightsList: [],
      // 分配权限的对话框
      setRightDialogVisible: false,
      // 树形控件的属性绑定对象
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      defKeys: [],
      roleId: '',
    }
  },
  created() {
    this.getRolesList();
  },
  methods: {
    async getRolesList() {
      // 请求的路径加不加斜杠竟然都行
      // const { data: res } = await this.$http.get('/roles');
      const { data: res } = await this.$http.get('roles');
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败');
      }
      this.rolesList = res.data;
      console.log(this.rolesList);
    },
    async removeRightById(role, rightId) {
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).catch(error => error);
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200 ) {
        return this.$message.error('删除权限失败')
      }
      role.children = res.data;
    },
    // 当点击分配权限按钮时弹出对话框并将权限显示出来
    async showSetRightDialog(role) {
      this.roleId = role.id;
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error(获取权限列表失败)
      }
      this.rightsList = res.data;
      // 当点击时调用下面的递归函数将所有的三级节点渲染出来
      this.getleafKeys(role, this.defKeys);
      this.setRightDialogVisible = true;
    },
    // 通过递归形式获取角色下所有三级权限的id并保存到数组defKeys中
    getleafKeys(node, arr) {
      // 如果当前node节点不包含children则说明它是最低级,即为三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getleafKeys(item, arr)
      });
    },
    // 当对话框关闭时将数组defKeys清空,否则每次点击按钮都会将里面的数据渲染到tree上
    setRightDialogClosed() {
      this.defKeys = [];
    },
    // 点击确定按钮,将被选节点进行组合为数组后发起请求
    async allotRights() {
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      const idStr = keys.join(',');
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, {rids: idStr})
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功')
      this.getRolesList();
      this.setRightDialogVisible = false;
      // 个人认为需要把roleId再清空 但视频没有
      this.roleId = '';
    }
  },
}
</script>

<style lang="less" scoped>
  .el-tag {
    margin: 7px;
  }
  .bdtop {
    border-top: 1px solid #eee;
  }
  .bdbottom {
    border-bottom: 1px solid #eee;
  }
  .el-row {
    display: flex;
    align-items: center;
  }
</style>