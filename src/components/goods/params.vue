<template>
  <div>
    <!--面包xue导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card>
      <!-- 警告区域 -->
      <el-alert show-icon :closable="false" title="注意:只允许为第三级分类设置相关参数！" type="warning"></el-alert>
      <!-- 选择商品分类区 -->
      <el-row class="cat_opt">
        <el-col>
          <span>商品数据分类:</span>
          <el-cascader
            v-model="selectKeys"
            :options="cateList"
            :props="cascaderProps"
            @change="parentCateChange"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- 标签页面 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible=true"
          >添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template v-slot="scope">
                <!-- 循环Tag标签 -->
                <el-tag
                  v-for="(item,index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClose(index,scope.row)"
                >{{item}}</el-tag>
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <!-- 添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scoped">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scoped.row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteParams(scoped.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态参数的面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible=true"
          >添加属性</el-button>
          <!-- 静态属性列表 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template v-slot="scope">
                <!-- 循环Tag标签 -->
                <el-tag
                  v-for="(item,index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClose(index,scope.row)"
                >{{item}}</el-tag>
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <!-- 添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数对话框 -->
    <el-dialog
      :title="'添加'+titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @closed="addDialogClosed"
    >
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name" :required="true">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑对话框 -->
    <el-dialog
      :title="'添加'+titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @closed="editDialogClosed"
    >
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name" :required="true">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //商品分类列表
      cateList: [],
      //指定级联选择器对象
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        chidren: "children",
        expandTrigger: "hover"
      },
      ///选中的父级元素
      selectKeys: [],
      //被激活的也标签名称
      activeName: "many",
      //动态参数
      manyTableData: [],
      //静态属性参数
      onlyTableData: [],
      //k控制添加对话框显示
      addDialogVisible: false,
      //添加参数的表单数据
      addForm: {
        attr_name: ""
      },
      addFormRules: {
        attr_name: [
          { required: true, message: "请输入数据名称", trigger: "blur" }
        ]
      },
      //编辑对话框
      editDialogVisible: false,
      //编辑的表单数据
      editForm: {
        attr_name: ""
      },
      //修改表单的验证规则
      editFormRules: {
        attr_name: [
          { required: true, message: "请输入数据名称", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    //获取所有商品分类列表
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: _request } = await this.$http.get("categories");
      if (_request.meta.status !== 200)
        return this.$message.error("获取商品分类列表失败");
      this.cateList = _request.data;
    },
    //选择项发生变化出发这个函数
    async parentCateChange() {
      this.getParamsData();
      //是否选中3级分类
    },
    //Tab标签点击事件
    handleTabClick() {
      this.getParamsData();
    },
    //获取参数的列表
    async getParamsData() {
      if (this.selectKeys.length != 3) {
        this.selectKeys = [];
        this.manyTableData = [];
        this.onlyTableData = [];
        return this.$message.info("请选择三级分类");
      } else {
        //根据所选的Id和面板获取对应的数据
        const { data: _request } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: this.activeName }
          }
        );
        if (_request.meta.status !== 200) {
          return this.$message.error("获取数据列表失败");
        }
        _request.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
          //控制文本框的显示与隐藏
          item.inputVisible = false;
          //文本框中输入的值
          item.inputValue = "";
        });
        if (this.activeName === "many") {
          this.manyTableData = _request.data;
          console.log(this.manyTableData);
        } else {
          this.onlyTableData = _request.data;
        }
      }
    },
    //监听对话框关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    //添加参数
    addParams() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return;
        const { data: _request } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          }
        );
        if (_request.meta.status !== 201)
          return this.$message.error("添加参数失败");
        this.$message.success("添加参数成功");
        this.getParamsData();
        this.addDialogVisible = false;
      });
    },
    // 编辑按钮对话框
    async showEditDialog(attr_id) {
      const { data: _request } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attr_id}`,
        {
          params: { attr_sel: this.activeName }
        }
      );
      if (_request.meta.status !== 200)
        return this.$message.error(_request.meta.msg);
      this.editDialogVisible = true;
      this.editForm = _request.data;
    },
    //重置修改的表单
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    //点击按钮修改参数
    editParams() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return;
        const {
          data: _request
        } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          { attr_name: this.editForm.attr_name, attr_sel: this.activeName }
        );
        if (_request.meta.status !== 200)
          return this.$message.error(_request.meta.msg);
        this.getParamsData();
        this.$message.success(_request.meta.msg);
        this.editDialogVisible = false;
      });
    },
    //删除按钮
    async deleteParams(attr_id) {
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
      const { data: _request } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${attr_id}`
      );
      if (_request.meta.status != 200) {
        this.$message.error("删除用户失败");
      } else {
        this.$message.success("删除用户成功");
        this.getParamsData();
      }
    },
    //文本框失去焦点或按下enter键触发
    async handleInputConfirm(row) {
      row.inputVisible = false;
      if (row.inputValue.trim().length === 0) {
        row.inputValue = "";
        row.inputVisible = false;
        return;
      }
      //如果没有return,则表明输入的内容，需要做后续处理
      row.attr_vals.push(row.inputValue.trim());
      row.inputValue = "";
      row.inputVisible = false;
      //发起请求,保存这次操作
      this.saveAttrVals(row);
    },
    //将attr_vals的操作保存在数据库
    async saveAttrVals(row) {
      //发起请求,保存这次操作
      const { data: _request } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(" ")
        }
      );
      if (_request.meta.status != 200) {
        return this.$message.error("修改参数失败");
      } else {
        this.$message.success("修改参数成功");
      }
    },
    //点击按钮展示文本输入框
    showInput(row) {
      row.inputVisible = true;
      //让文本框自动获得焦点
      //nextTick方法作用（当页面上的元素杯重新渲染后，才能指定回调函数中的代码）
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    //删除tag
    handleClose(i, row) {
      row.attr_vals.splice(i, 1);
      this.saveAttrVals(row);
    }
  },
  computed: {
    //如果按钮需要被禁用,则返回true,否则返回false
    isBtnDisabled() {
      if (this.selectKeys.length != 3) {
        return true;
      } else {
        return false;
      }
    },
    //当前选中的三级分类
    cateId() {
      if (this.selectKeys.length === 3) {
        return this.selectKeys[2];
      }
      return null;
    },
    //动态计算标题文本
    titleText() {
      if (this.activeName === "many") {
        return "动态参数";
      } else {
        return "静态属性";
      }
    }
  }
};
</script>
<style lang="less" scoped>
//scoped  防止组件样式冲突
.cat_opt {
  margin: 15px 0px;
}
.el-tag {
  margin: 8px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>