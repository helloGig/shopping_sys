<template>
  <div>
    <!--面包xue导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goodsAdd">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- table表格区域 -->
      <el-table :data="goodsList" border stripe height="480">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="85px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="180px">
          <template v-slot="scope">{{scope.row.add_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="fnRemoveUser(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      //商品列表
      goodsList: [],
      //总数据条数
      total: null
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    //根据分页获取对应商品列表
    async getGoodsList() {
      const { data: _request } = await this.$http.get("goods", {
        params: this.queryInfo
      });
      if (_request.meta.status != 200)
        return this.$message.error("获取数据失败");

      this.goodsList = _request.data.goods;
      this.total = _request.data.total;
      //this.$message.success("获取数据成功");
      console.log(this.goodsList);
    },
    //每页显示条数改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getGoodsList();
    },
    //页码显示改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getGoodsList();
    },
    //根据ID删除用户
    async fnRemoveUser(goodsId) {
      //弹框询问用户是否删除用户
      const confirmResult = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      //如果用户点击确认删除,返回字符串confirm
      //如果如果用户点击取消删除,返回字符串cancel
      if (confirmResult != "confirm") {
        return this.$message.info("取消了删除操作");
      }
      const { data: _request } = await this.$http.delete("goods/" + goodsId);
      if (_request.meta.status != 200) {
        this.$message.error("删除商品失败");
      } else {
        this.$message.success("删除商品成功");
        this.getGoodsList();
      }
    },
    //添加商品
    goodsAdd(){
this.$router.push('/goods/add')
    }
  }
};
</script>
<style lang="less" scoped>
</style>