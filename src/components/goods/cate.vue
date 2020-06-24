<template>
  <div>
    <!--面包xue导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图-->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDia">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table
        class="treeTable"
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        index-text="#"
        border
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color:lightgreen"></i>
          <i class="el-icon-error" style="color:red" v-else></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag size="mini" type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="operate">
          <el-button type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDiaClosed"
    >
      <!-- 添加分类的表单 -->
      <el-form
        ref="addCateFormRef"
        :model="addCateForm"
        label-width="80px"
        :rules="addCateFormRules"
      >
        <el-form-item label="分类名称" :required="true" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
          <!--options指定数据源  -->
          <!--props配置对象  -->
          <el-cascader
            :options="parentCateList"
            :props="cascaderProps"
            v-model="selectKeys"
            @change="parentCateChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateCancel">取 消</el-button>
        <el-button type="primary" @click="addCateConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //商品分类的数据列表,默认为空
      cateList: [],
      //总数据条数
      total: 0,
      //查询条件
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      //为table指定列的定义
      columns: [
        {
          label: "商品分类",
          prop: "cat_name"
        },
        {
          label: "是否有效",
          //表示将当前列表示为模板列
          type: "template",
          //表示当前行的模板名称
          template: "isok"
        },
        {
          label: "排序",
          //表示将当前列表示为模板列
          type: "template",
          //表示当前行的模板名称
          template: "order"
        },
        {
          label: "操作",
          //表示将当前列表示为模板列
          type: "template",
          //表示当前行的模板名称
          template: "operate"
        }
      ],
      //控制添加分类对话框的显示
      addCateDialogVisible: false,
      //添加分类的表单数据对象
      valess: "",
      addCateForm: {
        //要分类的名称
        cat_name: "",
        //父级分类Id
        cat_pid: "",
        //分类的等级,默认添加的是一级
        cat_level: ""
      },
      //添加分类规则
      addCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      },
      //父级分类的列表
      parentCateList: [],
      //指定级联选择器对象
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        chidren: "children",
        expandTrigger: "hover",
        checkStrictly: true
      },
      ///选中的父级元素
      selectKeys: []
    };
  },
  created() {
    this.fnGetCateList();
  },
  methods: {
    //获取商品分类数据
    async fnGetCateList() {
      const { data: _request } = await this.$http.get("categories", {
        params: this.querInfo
      });
      if (_request.meta.status !== 200)
        return this.$message.error("获取商品分类列表失败");
      this.cateList = _request.data.result;
      //为总数据条数赋值
      this.total = _request.data.total;
    },
    //监听pageSize变化
    handleSizeChange(newSize) {
      this.querInfo.pagesize = newSize;
      this.fnGetCateList();
    },
    //监听pagenum变化
    handleCurrentChange(newPage) {
      this.querInfo.pagenum = newPage;
      this.fnGetCateList();
    },
    //点击按钮现实分类对话框
    showAddCateDia() {
      //先获取数据列表
      this.getParentCateList();
      this.addCateDialogVisible = true;
    },
    //获取父级分类数据列表
    async getParentCateList() {
      const { data: _request } = await this.$http.get("categories", {
        params: { type: 2 }
      });
      if (_request.meta.status != 200)
        return this.$message.error("获取数据列表失败");
      console.log(_request);
      this.parentCateList = _request.data;
    },
    //选择项发生变化出发这个函数
    parentCateChange() {
      //选中了父级分类，反之没有选中
      if (this.selectKeys > 0) {
        this.addCateForm.cat_pid = this.selectKeys[this.selectKeys.length - 1];
        this.addCateForm.cat_level = this.selectKeys.length;
        return;
      } else {
        this.addCateForm.cat_pid = 0;
        //为当前分类的等级复制
        this.addCateForm.cat_level = 0;
      }
    },
    //确定按钮
    addCateConfirm() {
      console.log(this.addCateForm);
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return;
        const { data: _request } = await this.$http.post(
          "categories",
          this.addCateForm
        );
        if (_request.meta.status !== 201) {
          return this.$message.error("添加分类失败");
        }
        this.$message.success("添加分类成功");
        this.$refs.addCateFormRef.resetFields();
        this.fnGetCateList();
      });
      this.addCateDialogVisible = false;
    },
    //分类对话框关闭事件监听,重置表单
    addCateDiaClosed() {
      console.log(this.addCateForm);
      this.selectKeys = [];
      this.addCateForm.cat_level = 0;
      this.addCateForm.cat_pid = 0;
    },
    //取消选择
    addCateCancel() {
      this.addCateDialogVisible = false;
      this.$refs.addCateFormRef.resetFields();
    }
  }
};
</script>
<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>