<template>
  <div class="order">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 订单列表 -->
      <el-table :data="orderList" style="width: 100%" border stripe>
        <el-table-column label="#" width="width" type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" width="100px" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" width="100px" prop="pay_status">
          <template slot-scope="scope">              
            <el-tag type="danger" v-if="scope.row.pay_status === '0'">未付款</el-tag>
            <el-tag type="success" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" width="100px" prop="is_send">
          <template slot-scope="scope">
            {{scope.row.is_send}}
          </template>
        </el-table-column>
        <el-table-column label="下单时间" width="200px" prop="create_time">
          <template slot-scope="scope">
            {{scope.row.create_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template></template>
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showDialog"></el-button>
          <el-button type="success" icon="el-icon-location" size="mini" @click="showProgressBox"></el-button>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分页功能 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 3, 5, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total" background>
    </el-pagination>

    <!-- 修改地址的对话框 -->
    <el-dialog title="修改地址" :visible.sync="addressVisible" @close="addressDialogClosed">
      <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
        <!-- 省市区县的数据是一个JS文件,同order一个文件夹下是外部引入过来的 -->
          <el-cascader
            :options="cityData"
            v-model="addressForm.address1" :props="{expandTrigger: 'hover'}">
          </el-cascader>
        </el-form-item>  
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false">确 定</el-button>
      </div>
    </el-dialog>

  <!-- 展示物流进度对话框 -->
  <el-dialog
    title="物流进度"
    :visible.sync="progressVisible"
    width="width">

    <div slot="footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </div>
  </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata.js'
export default {
  name: 'Order',
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      orderList: [],
      total: 0,
      addressVisible: false,
      addressForm: {
        address1: [],
        address2: '',
      },
      addressFormRules: {
        address1: [
          {required: true, message:'请选择省市区县', trigger: 'blur'}
        ],
        address2: [
          {required: true, message:'请填写详细地址', trigger: 'blur'}
        ]
      },
      cityData,
      progressVisible: false,
      progressInfo: [],
    }
  },
  methods: {
    async getOrderList() {
      const {data: res} = await this.$http.get(`orders`, {params: this.queryInfo})
      if (res.meta.status !== 200) {
        return this.$message.error('获取订单列表失败')
      }
      this.total = res.data.total;
      this.orderList = res.data.goods;
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getOrderList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getOrderList();
    },
    showDialog() {
      this.addressVisible = true;
    },
    addressDialogClosed() {
      this.$refs.addressFormRef.resetFields();
    },
    async showProgressBox() {
      const {data: res} = await this.$http.get(`/kuaidi/1106975712662`)
      if (res.meta.status !== 200) {
        return this.$message.error('获取物流信息失败')
      }
      this.progressInfo = res.data;
      this.progressVisible = true;
      console.log(this.progressInfo);
    }
  },
  created() {
    this.getOrderList();
  },
}
</script>

<style lang="less" scoped>

</style>
