<template>
  <div class="user">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <!-- 点击查询事件有个小bug,如不在第一页之后进行查询会查询不到数据 比如因为当前页码是2,想办法将其改为1再调用getUserList方法 -->
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="showAddUser">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <!-- stripe用来隔行变色 -->
      <el-table :data="userList" border stripe>
        <!-- 某一列只需加一个type属性就可让其成为索引列 它会自动根据行数添加索引数字 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template v-slot="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template v-slot="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            <!-- 编辑按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
            <!-- 操作按钮 tooltip文字提示 做了一点优化,增加了“hide-after”提示500毫秒后自动消失 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false" :hide-after="500">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

<!-- 添加用户的对话框 visible.sync控制对话框的显示与隐藏 -->
<el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
  <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
    <el-form-item label="用户名" prop="username">
      <el-input v-model="addForm.username"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input v-model="addForm.password"></el-input>
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="addForm.email"></el-input>
    </el-form-item>
    <el-form-item label="手机" prop="mobile">
      <el-input v-model="addForm.mobile"></el-input>
    </el-form-item>
  </el-form>

  <!-- 底部区域 -->
  <div slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </div>
</el-dialog>

<!-- 修改用户信息的对话框 -->
<el-dialog title="修改用户信息" :visible.sync="editDialogVisible" width="50%" @close="editDialogClose">
  <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
    <el-form-item label="用户名" >
      <el-input v-model="editForm.username" disabled></el-input>
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="editForm.email"></el-input>
    </el-form-item>
    <el-form-item label="手机" prop="mobile">
      <el-input v-model="editForm.mobile"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUserInfo">确 定</el-button>
  </div>
</el-dialog>

<!-- 给用户分配权限的对话框 -->
<el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="50%" @close="setRoleDialogClosed">
  <div>
    <p>当前的用户: {{userInfo.username}}</p> 
    <p>当前的角色: {{userInfo.role_name}}</p> 
    <!-- 给用户分配角色的选择下拉列表 -->
    <el-select v-model="selectRoleId" placeholder="请选择">
      <el-option
        v-for="item in rolesList"
        :key="item.id"
        :label="item.roleName"
        :value="item.id">
      </el-option>
    </el-select>
  </div>
  <div slot="footer" class="dialog-footer">
    <el-button @click="setRoleDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
  </div>
</el-dialog>

  </div>
</template>

<script>
export default {
  name: 'Users',
  data() {
    // 自定义校验规则 验证邮箱和电话
    let checkMobile = (rule, value, callback) => {
      const regMobile = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (regMobile.test(value)) {
        return callback()
        }
      callback(new Error('请输入合法的电话号码'))
    };
    let checkEmail = (rule, value, callback) => {
      const regEmail = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
      if (regEmail.test(value)) { 
        return callback()
      }
      callback(new Error('请输入合法的邮箱地址'))
    };
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        // 要搜索的关键字
        query: '',
        // 当前展示的页数
        pagenum: 1,
        // 每页展示几条
        pagesize: 2,
      },
      userList: [],
      total: 0,
      // 控制添加、编辑、分配权限用户对话框的显示与隐藏
      addDialogVisible: false,
      editDialogVisible: false,
      setRoleDialogVisible: false,
      // 添加用户表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      // 添加用户表单数据验证规则
      addFormRules: {
        username: [
          { required: true, message:'请输入用户名', trigger: 'blur' }, 
          { min: 3, max: 10, message: '长度在 3 到 10 个字符之间', trigger: 'blur' 
          }
        ],
        password: [
          { required: true, message:'请输入密码', trigger: 'blur' }, 
          { min: 6, max: 15, message: '长度在 6 到 15 个字符之间', trigger: 'blur' 
          }
        ],
        email: [
          { required: true, message:'请输入邮箱', trigger: 'blur' }, 
          { validator: checkEmail, trigger: 'blur'}
        ],
        mobile: [
          { required: true, message:'请输入手机号码', trigger: 'blur' }, 
          {
            validator: checkMobile, trigger: 'blur'
          }
        ],
      },
      // 修改用户表单数据
      editForm: {
        username: '',
        email: '',
        mobile: '',
      },
      editFormRules: {
        email: [
          { required: true, message:'请输入邮箱', trigger: 'blur' }, 
          { validator: checkEmail, trigger: 'blur'}
        ],
        mobile: [
          { required: true, message:'请输入手机号码', trigger: 'blur' }, 
          {
            validator: checkMobile, trigger: 'blur'
          }
        ],
      },
      // 用来存储哪个点击的用户的名字
      userInfo: '',
      // 获取所有权限名
      rolesList: [],
      // 存储给用户分配好的权限角色
      selectRoleId: [],
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if(res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败')
      }
      this.userList = res.data.users;
      this.total = res.data.total;
      console.log(res);
    },
    // 监听每页显示几条
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    // 监听页数的改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    // 以冒号开头一般都是一个参数
    // 监听switch开关状态
    async userStateChanged(userinfo) {
      const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`);
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state;
        return this.$message.error('更新用户状态失败')
      } 
      this.$message.success('更新用户状态成功')
    },
    // 显示添加用户的弹出界面
    showAddUser() {
      this.addDialogVisible = true;
    },
    // 监听添加用户的弹出界面是否关闭
    addDialogClose() {
      this.$refs.addFormRef.resetFields();
    },
    // 点击确定按钮添加用户
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {return}
        // 表单验证通过发起真正的网络请求添加用户
        const { data: res} = await this.$http.post('users', this.addForm);
        if (res.meta.status !== 201) {
          return this.$message.error('添加用户失败')
        }
        this.$message.success('添加用户成功')
        // 添加成功后将弹出界面隐藏起来,重新获取用户列表
        this.addDialogVisible = false;
        this.getUserList();
      })
    },
    // 点击编辑用户信息
    async showEditDialog(id) {
      this.editDialogVisible = true;
      const { data: res} = await this.$http.get('users/' + id);
      if (res.meta.status !== 200) {return this.$message.error('查询用户信息失败')}
      this.editForm = res.data;
      console.log(this.editForm);
    },
    // 修改用户信息并提交
    editUserInfo() {
      console.log(147);
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {return}
        const { data: res } = await this.$http.put('users/' + this.editForm.id, {
          email: this.editForm.email,
          mobile: this.editForm.mobile,
        })
        if (res.meta.status !== 200) {return thsi.$message.error('更新用户信息失败')}
        this.editDialogVisible = false;
        this.getUserList();
        this.$message.success('更新用户信息成功')
        console.log(123);
      })
    },
    editDialogClose() {
      this.$refs.editFormRef.resetFields();
    },
    // 删除用户信息
    async removeUserById(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error)
      // 如果结果不为“confirm”说明不想删除用户那么弹框提示已取消删除即可
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !==200) {
        return this.$message.error('删除用户失败')
      }
      this.$message.success('删除用户成功')
      this.getUserList();
    },
    // 给角色分配权限 弹出对话框
    async setRole(userInfo) {
      this.userInfo = userInfo;
      // 获取所有角色的权限列表
      const { data: res} = await this.$http.get('roles');
      if (res.meta.status !== 200 ) {
        return this.$message.error('获取权限列表失败')
      }
      this.rolesList = res.data;
      this.setRoleDialogVisible = true;
    },
    // 点击确定按钮保存给用户分配的角色
    async saveRoleInfo() {
      if (!this.selectRoleId) {
        return this.$message.error('请选择要分配的角色')
      }
      const { data: res } = await this.$http.put(`users/${this.userInfo.id}/role`, {
        rid: this.selectRoleId
      })
      if (res.meta.status !== 200) {
        return this.$message.error('更新角色失败')
      }
      this.$message.success('更新角色成功')
      this.getUserList();
      this.setRoleDialogVisible = false;
    },
    // 分配成功后关闭对话框将选择下拉菜单清空方便下一次打开时选择框无东西
    setRoleDialogClosed() {
      this.selectRoleId = '';
      this.userInfo = {};
      // 其实也可将以上两行直接写在上一个方法即确定按钮中最后
    }
  }
}
</script>

<style lang="less" scoped>

</style>