<template>
  <div class="paranms">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

  <!-- 卡片视图区域 -->
    <el-card>
      <el-alert
        title="注意:只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon>
      </el-alert>

      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类的级联选择框 options绑定数据列表 props用来配置级联选择框 v-model将选中的id值绑定到数组中,即选中的某个节点 -->
          <el-cascader
            v-model="selectedCateKeys"
            :options="catelist"
            :props="cateProps"
            @change="handleChange" clearable>
          </el-cascader>
        </el-col>
      </el-row>

      <!-- tab页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="selectedCateKeys.length !== 3" @click="addDialogVisible=true"> 添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTabData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag closable type="success" v-for="(item, index) in scope.row.attr_vals" :key="index" @close="handleClose(index,scope.row)">{{item}}</el-tag>
                <!-- 点击按钮添加新的标签 将标签转为输入框 -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>                  
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>                  
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="selectedCateKeys.length !== 3" @click="addDialogVisible=true"> 添加属性</el-button>
          <!-- 静态参数表格 -->
          <el-table :data="onlyTabData" border stripe>
            <!-- 展开行 由于静态展开行的效果和动态是一样的因此这个展开行中的代码复制的动态展开行,代码一模一样 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag closable type="success" v-for="(item, index) in scope.row.attr_vals" :key="index" @close="handleClose(index,scope.row)">{{item}}</el-tag>
                <!-- 点击按钮添加新的标签 将标签转为输入框 -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>                  
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>                  
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%" @close="addDialogClosed">
      <el-form ref="addFormRef" :model="addForm" label-width="100px" :rules="addFormRules">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 点击修改弹出修改对话框 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDialogVisible"
      width="50%">
      <el-form ref="editFormRef" :model="editForm" label-width="100px" :rules="editFormRules">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Params',
  data() {
    return {
      // 商品分类列表
      catelist: [],
        // value指定选择的值 label指定看到的值 children指定父子节点
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        // checkStrictly: true
      },
      // 级联选择框双向绑定到的数组
      selectedCateKeys: [],
      // 被激活的页签的名称
      activeName: 'many',
      // 动态参数数据
      manyTabData: [],
      // 静态参数数据
      onlyTabData: [],
      // 对话框默认关闭
      addDialogVisible: false,
      editDialogVisible: false,
      addForm: {
        attr_name: ''
      },
      // 校验规则
      addFormRules: {
        attr_name: [
          {required: true, message:'请输入参数名称', trigger: 'blur'}
        ]
      },
      editForm: {
        attr_name: ''
      },
      editFormRules: {
        attr_name: [
          {required: true, message:'请输入', trigger: 'blur'}
        ]
      },
    }
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败');
      }
      this.catelist = res.data;
    },
    handleTabClick() {
      this.getParamsData();
    },
    handleChange() {
      this.getParamsData();
    },
    // 获取参数的列表数据 当级联选择器及tab页签区域发生变化时均发起一次请求,故将其抽离出来
    // 其实也可以不要这个函数,将代码写到handleChange中,然后handleTabClick内调用handleChange即可
    async getParamsData() {
      // 当选中的不是三级菜单时强制将选择框及下面的动静态数据表格清空 因为要求只能选中三级
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = [];
        this.manyTabData = [];
        this.onlyTabData = [];
        return 
      } 
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`,{
        params:{sel:this.activeName}
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数失败')
      }
      res.data.forEach(item => {
        item.inputVisible = false;
        item.inputValue = '';
        item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
        // 用上面这行代替下面这行是因为当参数为空时下面这行代码会渲染出一个空标签
        // item.attr_vals = item.attr_vals.split(',')
      })
      this.activeName === 'many' ? this.manyTabData = res.data : this.onlyTabData = res.data;
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    // 点击确定按钮将参数添加进去
    addParams() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 201 ) {
          return this.$message.error('添加参数失败')
        }
        this.$message.success('添加参数成功')
        this.getParamsData();
        this.addDialogVisible = false;
      })
    },
    async showEditDialog(attr_id) {
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`, {
        params: {attr_sel: this.activeName}
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数失败')
      }
      this.editForm = res.data;
      this.editDialogVisible = true;
    },
    editParams() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return 
        const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
          attr_name: this.editForm.attr_name,
          attr_sel: this.activeName
        })         
        if (res.meta.status !== 200) return this.$message.error('更新状态失败')
        this.$message.success('更新状态成功')
        this.getParamsData();
        this.editDialogVisible = false;
      })
    },
    // 点击删除按钮删除参数
    async removeParams(attr_id) {
      const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(error => error);          
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      // 删除业务逻辑
      const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除参数失败')
      }
      this.getParamsData();
      this.$message.success('删除参数成功')
    },
    // 将发起请求,保存此次添加(删除)操作抽离成一个函数
    async saveAttrVals(row) {
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{attr_name:row.attr_name, attr_sel: row.attr_sel, attr_vals: row.attr_vals.join(',')})
      if (res.meta.status !== 200) {
        return this.$message.error('添加参数失败')
      }
      this.$message.success('添加参数成功')
    },
    // 判断输入框输入内容是否全是空格且在其失去焦点后再打开时将其清空
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputVisible = false;
        row.inputValue = '';
        return        
      }
      row.attr_vals.push(row.inputValue.trim());
      row.inputValue = '';
      row.inputVisible = false;
      this.saveAttrVals(row);
    },
    // 将标签转换为输入框
    showInput(row) {
      row.inputVisible = true;
      // el-ui提供的文本框自动获取焦点 $nextTick作用是当页面重新渲染完成后再执行函数,否则页面未渲染完成是拿不到input输入框的,获取焦点时便报错
      this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
    },
    // 点击tag标签后的叉号发起请求删除此标签
    handleClose(i, row) {
      row.attr_vals.splice(i, 1);
      this.saveAttrVals(row);
    }
  },
  computed: {
    // 分类ID
    cateId() {
      return this.selectedCateKeys.length === 3 ? this.selectedCateKeys[2] : null
    },
    titleText() {
      return this.activeName === 'many' ? '动态参数' : '静态属性'
    }
  }
}
</script>

<style lang="less" scoped>
  .cat_opt {
    margin: 15px 0;
  }
  .el-tag {
    margin: 5px;
  }
  .input-new-tag {
    width: 100px;
  }
</style>
