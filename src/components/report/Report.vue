<template>
  <div class="report">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 第二步 为echarts准备一个容器 -->
      <div id="main" style="width: 600px;height:400px;"></div>
    </el-card>
  </div>
</template>
<script>
// 第一步 导入echarts 官网示例导入方式报错
// import echarts from 'echarts'

import * as echarts from 'echarts'

export default {
  name: "Report",
  data() {
    return {

    }
  },
  // mounted中页面上的元素已经被渲染完毕
  mounted() {
    // 第三步 基于准备好的DOM,初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'));

    //第四步 指定图表的配置项和数据
    var option = {
        title: {
            text: 'ECharts 入门示例'
        },
        tooltip: {},
        legend: {
            data:['销量']
        },
        xAxis: {
            data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
        },
        yAxis: {},
        series: [{
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
        }]
    };

    //第五步 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
  },
}
</script>

<style lang="less" scoped>

</style>