<template>
  <div>
    <!--面包xue导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card>
      <!--搜索与添加区域-->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            class="input-with-select"
            clearable
            @clear="fnGetUserList()"
          >
            <el-button slot="append" icon="el-icon-search" @click="fnGetUserList()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!--用户列表-->
      <el-table :data="usersList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <!--作用于插槽-->
          <template v-slot="scope">
            <el-switch v-model="scope.row.mg_state" @change="fnUserStatuChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="185px">
          <template v-slot="scope">
            <!--修改按钮-->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="fnShowEditDialog(scope.row.id)"
            ></el-button>
            <!--删除按钮-->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="fnRemoveUser(scope.row.id)"
            ></el-button>
            <!--分配角色按钮-->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="fnSetRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--分页区域-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!--添加用户对话框-->
    <el-dialog
      title="提示"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="fnAddDialogClose('addFormRef')"
    >
      <!--主体部分-->
      <el-form ref="addFormRef" :model="addForm" label-width="70px" :rules="addFormRules">
        <el-form-item label="用户名" prop="username" :required="true">
          <el-input v-model="addForm.username" class="border-color"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password" :required="true">
          <el-input v-model="addForm.password" class="border-color"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email" :required="true">
          <el-input v-model="addForm.email" class="border-color"></el-input>
        </el-form-item>

        <el-form-item label="手机号" prop="mobile" :required="true">
          <el-input v-model="addForm.mobile" class="border-color"></el-input>
        </el-form-item>
      </el-form>
      <!--底部区域-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="fnAddUser()">确 定</el-button>
      </span>
    </el-dialog>
    <!--修改用户对话框-->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisaible"
      width="50%"
      @close="fnCloseEditDialog()"
    >
      <!--内容主体-->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" class="border-color" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" class="border-color" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisaible = false">取 消</el-button>
        <el-button type="primary" @click="fnEditUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%"
      @close="SetRoleDialogClosed"
    >
      <div>
        <p>当前用户: {{userInfo.username}}</p>
        <p>当前角色: {{userInfo.role_name}}</p>
        <p>
          分配新角色:
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="fnSaveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    // 手机号验证
    var checkPhone = (rule, value, callback) => {
      const phoneReg = /^1[3|4|5|6|7|8][0-9]{9}$/;
      if (!value) {
        return callback(new Error("电话号码不能为空"));
      }
      setTimeout(() => {
        if (!Number.isInteger(+value)) {
          callback(new Error("请输入数字值"));
        } else {
          if (phoneReg.test(value)) {
            callback();
          } else {
            callback(new Error("电话号码格式不正确"));
          }
        }
      }, 100);
    };
    return {
      input3: "",
      //获取用户列表的参数
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2
      },
      //用户列表
      usersList: [],
      total: 0,
      addDialogVisible: false,
      editDialogVisaible: false,
      //添加用户的表单数据
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      //添加表单的验证规则对象
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: "blur"
          }
        ],
        mobile: [{ required: true, validator: checkPhone, trigger: "blur" }]
      },
      //查询到的用户对象信息
      editForm: {},
      //编辑用户信息规则
      editFormRules: {
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: "blur"
          }
        ],
        mobile: [{ required: true, validator: checkPhone, trigger: "blur" }]
      },
      //控制分配角色对话框显示与隐藏
      setRoleDialogVisible: false,
      //需要被分配角色的用户信息
      userInfo: {},
      //所有角色列表
      roleList: [],
      //已选中的角色Id值
      selectedRoleId: ""
    };
  },
  created() {
    this.fnGetUserList();
  },
  methods: {
    //重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
      // console.log(this)
    },
    async fnGetUserList() {
      const { data: _request } = await this.$http.get("users", {
        params: this.queryInfo
      });
      if (_request.meta.status !== 200) {
        return this.$message.error("获取用户列表失败");
      } else {
        this.usersList = _request.data.users;
        this.total = _request.data.total;
      }
    },
    //监听 每页多少条数据 改变 的事件
    handleSizeChange(newSize) {
      console.log(newSize);
      this.queryInfo.pagesize = newSize;
      this.fnGetUserList();
    },
    //监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.fnGetUserList();
    },
    //监听swith开关
    async fnUserStatuChanged(userInfo) {
      console.log(userInfo);
      const { data: _request } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      );
      if (_request.meta.status != 200) {
        userInfo.mg_state = !userInfo.mg_state;
        return this.$message.error("更新用户状态失败");
      }
      this.$message.success("更新用户状态成功");
    },
    ///监听表单关闭事件
    fnAddDialogClose(formName) {
      this.$refs[formName].resetFields();
    },
    //添加用户
    fnAddUser() {
      //this.addDialogVisible = false;
      this.$refs.addFormRef.validate(async valid => {
        console.log(valid);
        if (!valid) return false;
        const { data: _request } = await this.$http.post("users", this.addForm);
        if (_request.meta.status != 201) {
          this.$message.error("创建用户失败");
        } else {
          this.$message.success("创建用户成功");
        }
        //隐藏列表
        this.addDialogVisible = false;
        //重新获取用户列表数据
        this.fnGetUserList();
      });
    },
    //显示用户编辑对话框
    async fnShowEditDialog(id) {
      const { data: _request } = await this.$http.get("users/" + id);
      console.log(_request);
      if (_request.meta.status != 200) {
        this.$message.error("查询用户信息失败");
      } else {
        this.editDialogVisaible = true;
        this.editForm = _request.data;
      }
    },
    //监听用户修改对话框关闭事件
    fnCloseEditDialog() {
      //重置表单验证
      this.$refs.editFormRef.resetFields();
    },
    //修改用户信息
    fnEditUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error("请填写正确的信息格式!");
        } else {
          const { data: _request } = await this.$http.put(
            "users/" + this.editForm.id,
            { email: this.editForm.email, mobile: this.editForm.mobile }
          );

          if (_request.meta.status != 200) {
            this.$message.error("用户信息修改失败!");
          } else {
            this.fnGetUserList();
            this.$message.success("用户信息修改成功!");
          }
          this.editDialogVisaible = false;
        }
      });
    },
    //根据ID删除用户
    async fnRemoveUser(id) {
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
      const { data: _request } = await this.$http.delete("users/" + id, {
        id: id
      });
      if (_request.meta.status != 200) {
        this.$message.error("删除用户失败");
      } else {
        this.$message.success("删除用户成功");
        this.fnGetUserList();
      }
    },
    //展示分配角色对话框
    async fnSetRole(userInfo) {
      this.userInfo = userInfo;
      //在展示对话框以前获取列表
      const { data: _request } = await this.$http.get("roles");
      if (_request.meta.status != 200) {
        return this.$message.error("失败");
      } else {
        this.roleList = _request.data;
      }
      this.setRoleDialogVisible = true;
    },
    //点击按钮,分配角色
    async fnSaveRoleInfo() {
      if (!this.selectedRoleId) {
        return this.$$message.error("请选择要分配的角色");
      } else {
        const { data: _request } = await this.$http.put(
          `users/${this.userInfo.id}/role`,
          {
            rid: this.selectedRoleId
          }
        );
        if (_request.meta.status !== 200) {
          this.$message.error(_request.meta.msg);
        } else {
          this.$message.success(_request.meta.msg);
          this.fnGetUserList();
          this.setRoleDialogVisible = false;
        }
      }
    },
    //关闭角色分配对话框
    SetRoleDialogClosed() {
      this.selectedRoleId = '';
      this.userInfo = {};
    }
  }
};
</script>
<style lang="less" scoped>
</style>