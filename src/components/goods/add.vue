<template>
  <div>
    <!--面包xue导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-alert title="消息提示的文案" type="info" center show-icon :closable="false"></el-alert>
      </el-row>
      <!-- 步骤条 -->
      <el-steps :active="activeId - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 地址栏 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          v-model="activeId"
          :tab-position="'left'"
          :before-leave="beforeLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                expand-trigger="hover"
                :options="cateList"
                :props="cateProps"
                v-model="addForm.goods_cat"
                @change="handleChange"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的Item项 -->
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <!-- 复选框 -->
                <el-checkbox border :label="cb" v-for="(cb,index) in item.attr_vals" :key="index"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action:服务器接收图片的地址 -->
            <el-upload
              :headers="headerObj"
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <!-- 添加商品按钮 -->
            <el-button type="primary" class="btnAdd" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img class="previewImg" :src="previewPath" alt />
    </el-dialog>
  </div>
</template>

<script>
import _ from "lodash";
export default {
  data() {
    return {
      activeId: "0",
      //添加商品表单数据对象
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        //商品所属的分类数组
        goods_cat: [],
        //图片数组
        pics: [],
        //商品的详情
        goods_introduce: "",
        attrs: []
      },
      //表单规则
      addFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" }
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" }
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" }
        ]
      },
      //shang商品分类列表
      cateList: [],
      cateProps: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      //动态参数列表
      manyTableData: [],
      //静态参数列表
      onlyTableData: [],
      //上传图片的URL地址
      uploadURL: "http://127.0.0.1:8888/api/private/v1/upload",
      //图片上传请求头
      headerObj: {
        Authorization: window.sessionStorage.getItem("Token")
      },
      previewPath: "",
      previewVisible: false
    };
    handlePreview;
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      //获取所有商品分类数据
      const { data: _request } = await this.$http.get("categories");
      if (_request.meta.status != 200) return this.$message.error("失败");
      this.cateList = _request.data;
      this.$message.success({ message: "获取数据成功", duration: 2000 });
      console.log(this.cateList);
    },
    //级联选择器选中项变化
    handleChange() {
      if (this.addForm.goods_cat.length != 3) {
        this.addForm.goods_cat = [];
      }
    },
    //离开
    beforeLeave(activeName, oldActiveName) {
      if (oldActiveName === "0" && this.addForm.goods_cat.length !== 3) {
        this.$message.error({ message: "请选择三级列表", duration: 2000 });
        return false;
      }
    },
    //tab列表点击事件
    async tabClicked() {
      //证明访问时动态参数面板
      if (this.activeId === "1") {
        const { data: _request } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: "many" }
          }
        );

        if (_request.meta.status != 200) return this.$message.error("失败");

        _request.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
        });
        this.manyTableData = _request.data;
        console.log(this.manyTableData);
      } else if (this.activeId === "2") {
        const { data: _request } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: "only" }
          }
        );

        if (_request.meta.status != 200)
          return this.$message.error("获取静态属性失败");

        // _request.data.forEach(item => {
        //   item.attr_vals =
        //     item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
        // });
        this.onlyTableData = _request.data;
        console.log(_request.data);
      }
    },
    //处理图片预览效果
    handlePreview(file) {
      this.previewPath = file.response.data.url;
      this.previewVisible = true;
      console.log(this.previewPath);
    },
    //处理移除图片的操作
    handleRemove(file) {
      //1.获取要删除的图片的临时路径
      const filePath = file.response.data.tmp_path;
      //2.从pics数组中,找到这个图片对应的索引值
      const i = this.addForm.pics.findIndex(x => x.pic === filePath);
      //3.调用数组的splice方法，把图片信息,从pics中移除
      this.addForm.pics.splice(i, 1);

      console.log(this.addForm.pics);
    },
    //监听图片上传成功事件
    handleSuccess(response) {
      //1.拼接得到的图片信息对象
      const picInfo = { pic: response.data.tmp_path };
      //2.将图片信息对象push到pics数组
      this.addForm.pics.push(picInfo);
      console.log(this.addForm.pics);
    },
    async addGoods() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error("请填选必要的表单项");
        }
        //执行添加的业务逻辑
        //深拷贝 lodash cloneDeep(obj)
        const form = _.cloneDeep(this.addForm);
        form.goods_cat = form.goods_cat.join(",");
        //处理动态参数
        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(" ")
          };
          this.addForm.attrs.push(newInfo);
        });
        //静态属性
        this.onlyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          };
          this.addForm.attrs.push(newInfo);
        });
        form.attrs = this.addForm.attrs;
        console.log(form);
        //发起请求添加商品
        //商品名称必须唯一
        const { data: _request } = await this.$http.post("goods", form);
        if (_request.meta.status !== 201) {
          return this.$message.error(_request.meta.msg);
        }
        this.$message.success(_request.meta.msg);
        this.$router.push('/goods')
      });
    }
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2];
      }
      return null;
    }
  }
};
</script>
<style lang="less" scoped>
.el-checkbox {
  margin: 0;
}
.previewImg {
  width: 100%;
}
.btnAdd {
  margin-top: 15px;
}
</style>

<style>
.el-tabs__item {
  font-size: 15px;
}
.el-steps {
  margin: 15px 0;
}

.el-step__title {
  font-size: 13px;
}
</style>