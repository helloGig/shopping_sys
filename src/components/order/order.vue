<template>
  <div>
    <!--面包xue导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" clearable>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table border stripe :data="orderList">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template v-slot="scope">
            <el-tag v-if="scope.row.pay_status==='0'" type="warning">未付款</el-tag>
            <el-tag v-else-if="scope.row.pay_status==='1'" type="success">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="order_pay">
          <template v-slot="scope">
            <el-tag v-if="scope.row.order_pay==='0'" type="warning">未发货</el-tag>
            <el-tag v-else-if="scope.row.order_pay==='1'" type="success">已发货</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template v-slot="scope">{{scope.row.create_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot>
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showBox"></el-button>
            <el-button type="success" icon="el-icon-location" size="mini" @click="showProgressBox"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :current-page="queryInfo.pagenum"
      ></el-pagination>
    </el-card>
    <!-- 修改地址提示框 -->
    <el-dialog title="修改地址" :visible.sync="addressVisible" width="50%" @close="addressDialogClosed">
      <el-form :model="adressForm" :rules="adressRules" ref="adressFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader v-model="adressForm.address1" :options="cityData" class="address"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="adressForm.address2" placeholder="请输入详细地址"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 展示物流进度对话框 -->
    <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%">
      <!-- timeline时间线 -->
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in logistics"
          :key="index"
          :color="activity.color"

          :timestamp="activity.time"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>
<script>
import cityData from "./citydata.js";
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      total: null,
      orderList: [],
      addressVisible: false,
      adressForm: {
        address1: [],
        address2: ""
      },
      adressRules: {
        address1: [
          { required: true, message: "请选择省市/县", trigger: "blur" }
        ],
        address2: [
          { required: true, message: "请输入详细地址", trigger: "blur" }
        ]
      },
      cityData,
      progressVisible: false,
      logistics: [
        {
          time: "2018-05-10 09:39:00",
          ftime: "2018-05-10 09:39:00",
          context: "已签收,感谢使用顺丰,期待再次为您服务",
          location: "",
          color:'#0bbd87',
          icon:'el-icon-s-flag'
        },
        {
          time: "2018-05-10 08:23:00",
          ftime: "2018-05-10 08:23:00",
          context:
            "[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件",
          location: "",
          color:'#ff0000',
          icon:'el-icon-more'
        },
        {
          time: "2018-05-10 07:32:00",
          ftime: "2018-05-10 07:32:00",
          context: "快件到达 [北京海淀育新小区营业点]",
          location: "",
          icon:'el-icon-more',
          color:'#008000',
        },
         {
          time: "2018-05-10 07:32:00",
          ftime: "2018-05-10 07:32:00",
          context: "抱歉,你的快递在运输中发生火灾",
          location: "",
          icon:'el-icon-more',
          color:'#008000',
        }
      ]
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    async getOrderList() {
      const { data: _request } = await this.$http.get("orders", {
        params: this.queryInfo
      });
      if (_request.meta.status !== 200)
        return this.$message.error(_request.meta.msg);
      this.total = _request.data.total;
      this.orderList = _request.data.goods;
      console.log(_request);
    },
    //
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getOrderList();
    },
    //
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getOrderList();
    },
    //
    showBox() {
      this.addressVisible = !this.addressVisible;
    },
    //
    addressDialogClosed() {
      this.$refs.adressFormRef.resetFields();
    },
    //
    showProgressBox() {
      this.progressVisible = true;
    }
  }
};
</script>
<style lang="less" scoped>
// @import "../../plugins/timeline/timeline.css";
// @import "../../plugins/timelineitem/timeline-item.css";
.el-cascader {
  width: 100%;
}
</style>