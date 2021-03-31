<template>
  <div class="add">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <!-- 步骤条 -->
      <el-steps :space="200" :active="activeIndex" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form ref="addFormRef" :model="addForm" label-width="80px" label-position="top" :rules="addFormRule">
        <!-- 标签页 -->
        <el-tabs :tab-position="'left'" @tab-click="handleClick" :before-leave="beforeTabLeave">
          <!-- @tab-click是el-ui提供的方法,即当前的tab-pane被点击时触发的事件 让其和上面的步骤条实现联动效果只需让当前标签的index和上面的activeIndex相同即可 打印出tab发现其索引为tab.index -->
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price" type="number">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight" type="number">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number" type="number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader v-model="addForm.goods_cat" :options="cateList" :props="cateProps" @change="handleChange">
              </el-cascader>            
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数">
            <!-- 渲染表单的item项 -->
            <el-form-item :label="item.attr_name" v-for="item in manyTabData" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb"  v-for="(cb, i) in item.attr_vals" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性">
            <el-form-item :label="item.attr_name" v-for="(item, id) in onlyTabData" :key="id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片">
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture" :headers="headerObj" :on-success="handleSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容">
            <!-- npm安装富文本编辑器插件，并在main.js文件中进行全局注册使用 -->
            <!-- 默认高度太低 全局样式里给其一个300px的高度 -->
            <quill-editor v-model="addForm.goods_introduce">
            </quill-editor>
            <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>

    </el-card>

    <!-- 图片预览对话框 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" alt="">
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Add',
  data() {
    return {
      activeIndex: 0,
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        // 上传图片的数组
        pics: [],
        // 富文本编辑器
        goods_introduce: '',
        attrs: [],
      },
      addFormRule: {
        goods_name: [
          {required: true, message:'请输入商品名称', trigger: 'blur'}
        ],
        goods_price: [
          {required: true, message:'请输入商品价格', trigger: 'blur'}
        ],
        goods_weight: [
          {required: true, message:'请输入商品重量', trigger: 'blur'}
        ],
        goods_number: [
          {required: true, message:'请输入商品数量', trigger: 'blur'}
        ],
        goods_cat: [
          {required: true, message:'请选择商品分类', trigger: 'blur'}
        ]
      },
      // 获取商品分类数据
      cateList: [],
      cateProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
      },
      // 动态参数列表数组
      manyTabData: [],
      // 静态属性列表数据
      onlyTabData: [],
      // 图片上传地址
      uploadURL: 'https://daili.ahao.work/api/private/v1/upload',
      // 图片上传组件的heade请求头对象 因为除了登录时不要tooken，其余的每次请求都需要携带tooken才行,但upload组件并未用到axios发起ajax请求而是用自己内置的方法故报错,因此需将其请求头添加上
      headerObj: {
        Authorization: window.sessionStorage.getItem('token') 
      },
      // 图片预览地址及预览对话框是否显示
      previewPath: '',
      previewVisible: false,
    }
  },
  computed: {
    cateId() {
      return this.addForm.goods_cat.length === 3 ? this.addForm.goods_cat[2] : null
    }
  },
  methods: {
    async handleClick(tab) {      
      // this.activeIndex = parseInt(tab.index)
      // 不用显示转换的话也可用隐式, “- * /” 均可转换但“+”不行
      this.activeIndex = tab.index - 0;
      // 当点击的是第二个标签页时发起请求将级联选择器中选中商品的参数拿出
      if (this.activeIndex === 1) {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {params: {sel: 'many'}})
        if (res.meta.status !== 200) {
          return this.$message.error('获取参数列表失败')
        }
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
        });
        this.manyTabData = res.data;
      }
      else if (this.activeIndex === 2 ) {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {params: {sel: 'only'}})
        if (res.meta.status !== 200) {
          return this.$message.error('获取参数列表失败')
        }
        this.onlyTabData = res.data;
      }
    },
    async getCateList() {
      const { data: res } = await this.$http.get(`categories`);
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类列表失败')
      }
      this.cateList = res.data;
    },
    handleChange() {
      this.addForm.goods_cat.length !== 3 ? this.addForm.goods_cat = [] : '';
    },
    // el-ui规定的事件,即从一个标签页切换到另一个时触发,两个形参分别为切换到的标签页以及从哪个切换来的
    // 注意:如果return false那么就会只执行函数中的内容而不进行切换
    beforeTabLeave(activeName, oldActiveName) {
      // 如果是在商品名称这一项且未选择第三级分类则不允许切换
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类');
        return false;
      }
    },
    // 处理图片预览
    handlePreview(file) {
      // 源代码是下面这行但是由于使用了自己的代理请求的地址就不对了,因此需要使用自己的服务器地址再拼接上图片地址
      // this.previewPath = file.response.data.url;
      const URL = 'https://daili.ahao.work/'
      this.previewPath = URL + file.response.data.tmp_path;
      
      this.previewVisible = true;
    },
    // 移除图片
    handleRemove(file) {
      // 获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path;
      // 从pics数组中找到这个路径对应的索引
      const i = this.addForm.pics.findIndex(x => x.pic === filePath)
      // 找到后将其从pics数组中移除即可
      this.addForm.pics.splice(i, 1);
    },
    // 监听图片上传成功
    handleSuccess(response) {
      // 得到一个图片信息对象,再将其push到pics数组中
      const picInfo = {pic:response.data.tmp_path};
      this.addForm.pics.push(picInfo)
    },
    add() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请填写必要的表单项')
        }  
        // 深拷贝的方法 递归和Json.stringify
        // let obj = JSON.parse(JSON.stringify(origin))
        // 源代码下载了lodash包使用cloneDeep方法
        const form = JSON.parse(JSON.stringify(this.addForm));
        // join方法将数组转换为字符串
        form.goods_cat = form.goods_cat.join(',')

        // 处理动态参数
        this.manyTabData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            // 需要的是字符串因此将数组转为字符串
            attr_value: item.attr_vals.join(' '),
          }
          this.addForm.attrs.push(newInfo)
        })
        // 处理静态属性
        this.onlyTabData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals,
          }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs;
        const { data: res } = await this.$http.post('goods',form);
        if (res.meta.status !== 201) {
         return this.$message.error('添加商品失败')
        }
        this.$message.success('添加商品成功');
        this.$router.push('/goods')
      })
    }
  },
  created() {
    this.getCateList();
  }
}
</script>

<style lang="less" scoped>
  .btnAdd {
    margin-top: 15px;
  }
</style>