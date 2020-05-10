<template>
  <div>
    <!--面包xue导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <!---->
    <el-card>
      <el-row>
        <el-col>
          <!--添加角色按钮-->
          <el-button type="primary" @click="addRoleDialogVisible=true">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolesList" border stripe height="400px">
        <!--展开列-->
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row
              v-for="(item1,i1) in scope.row.children"
              :key="item1.id"
              :class="['bdbottom',i1===0?'bdtop':'','vcenter']"
            >
              <!--一级权限-->
              <el-col :span="5">
                <el-tag closable @close="fnRemoveRight(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!--二,三级权限-->
              <el-col :span="19">
                <!--通过for循环嵌套渲染二级菜单-->
                <el-row
                  v-for="(item2,i2) in item1.children"
                  :key="item2.id"
                  :class="[i2=== 0 ? '':'bdtop','vcenter']"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="fnRemoveRight(scope.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="fnRemoveRight(scope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!--索引列-->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="fnEditRoleBt(scope.row.id)"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-dalete"
              size="mini"
              @click="fnRemoveRole(scope.row.id)"
            >删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="fnShowSetRightDialog(scope.row)"
            >权限分配</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="fnSetRightDialogClosed"
    >
      <!--树形控件-->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKey"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="fnAllRight">确 定</el-button>
      </span>
    </el-dialog>
    <!--添加角色对话框-->
    <el-dialog
      title="添加角色"
      :visible.sync="addRoleDialogVisible"
      width="50%"
      @close="fnAddRoleDiaClosed('addRoleFormRef')"
    >
      <!--主体部分-->
      <el-form
        ref="addRoleFormRef"
        :model="addRoleForm"
        label-width="80px"
        :rules="addRoleFormRules"
      >
        <el-form-item label="角色名称" prop="roleName" :required="true">
          <el-input v-model="addRoleForm.roleName" class="border-color" placeholder="请输入角色名称"></el-input>
        </el-form-item>

        <el-form-item label="角色描述">
          <el-input v-model="addRoleForm.roleDesc" class="border-color" placeholder="请输入角色描述"></el-input>
        </el-form-item>
      </el-form>
      <!--底部区域-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="fnAddRole">确 定</el-button>
      </span>
    </el-dialog>
    <!--编辑角色对话框-->
    <el-dialog
      title="编辑角色信息"
      :visible.sync="editRoleDialogVisaible"
      width="50%"
      @close="fnCloseEditRoleDia('editRoleFormRef')"
    >
      <el-form
        ref="editRoleFormRef"
        :model="addRoleForm"
        label-width="80px"
        :rules="addRoleFormRules"
      >
        <!--内容主体-->
        <el-form-item label="角色名称" prop="roleName" :required="true">
          <el-input v-model="addRoleForm.roleName" class="border-color" placeholder="请输入角色名称"></el-input>
        </el-form-item>

        <el-form-item label="角色描述">
          <el-input v-model="addRoleForm.roleDesc" class="border-color" placeholder="请输入角色描述"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisaible = false">取 消</el-button>
        <el-button type="primary" @click="fnEditRoleConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //添加角色和编辑角色的双向绑定数据
      addRoleForm: {
        roleName: "",
        roleDesc: ""
      },
      rolesList: [],
      //所有权限数据
      rightsList: [],
      //分配权限对话框
      setRightDialogVisible: false,
      //添加角色对话框
      addRoleDialogVisible: false,
      //编辑角色对话框
      editRoleDialogVisaible: false,
      //树形控件的属性绑定对象
      treeProps: {
        label: "authName",
        children: "children"
      },
      //默认勾选选中节点Id值数组
      defKey: [],
      //即将分配权限和编辑角色的Id
      roleId: "",
      //添加角色规则
      addRoleFormRules: {
        roleName: [
          { required: true, message: "请输入角色名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.fnGetRolesList();
  },
  methods: {
    async fnGetRolesList() {
      const { data: _request } = await this.$http.get("roles");
      if (_request.meta.status != 200) {
        return this.$message.error("获取角色列表失败");
      } else {
        this.rolesList = _request.data;
        this.$message.success("获取角色列表成功");
      }
    },
    //根据id删除对应权限
    async fnRemoveRight(role, rightId) {
      console.log(role);
      //弹框提示
      const confirmResult = await this.$confirm(
        "此操作将永久删除该用户权限, 是否继续?",
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
        `roles/${role.id}/rights/${rightId}`
      );
      if (_request.meta.status != 200) {
        this.$message.error("权限删除失败");
      } else {
        this.$message.success("权限删除成功");
        // this.fnGetRolesList();
        role.children = _request.data;
      }
    },
    //分配权限的对话框
    async fnShowSetRightDialog(role) {
      this.roleId = role.id;
      const { data: _request } = await this.$http.get("rights/tree");
      if (_request.meta.status != 200) {
        return this.$message.error("获取权限数据失败");
      } else {
        //把权限数据保存到数组中
        this.rightsList = _request.data;
        console.log(this.rightsList);
      }
      //递归获取三级节点Id
      this.fnGetLeafKeys(role, this.defKey);
      this.setRightDialogVisible = true;
    },
    //通过递归形式,获取角色所有三级权限
    fnGetLeafKeys(node, arr) {
      //如果当前node节点不包含children属性,则是三级节点
      if (!node.children) {
        return arr.push(node.id);
      } else {
        node.children.forEach(item => {
          this.fnGetLeafKeys(item, arr);
        });
      }
    },
    //监听权限分配对话框关闭事件
    fnSetRightDialogClosed() {
      this.defKey = [];
    },
    //点击为角色分配权限
    async fnAllRight() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        this.$refs.treeRef.getHalfCheckedNodes()
      ];
      const idStr = keys.join(",");
      console.log(idStr);
      const {
        data: _request
      } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr });
      if (_request.meta.status != 200) return this.$message.error(分配角色失败);
      this.$message.success("分配角色成功");
      this.setRightDialogVisible = false;
      this.fnGetRolesList();
    },
    //添加角色
    async fnAddRole() {
      const { data: _request } = await this.$http.post(
        "roles",
        this.addRoleForm
      );

      if (_request.meta.status !== 201)
        return this.$message.error("添加角色失败");
      this.$message.success("添加角色成功");
      this.fnGetRolesList();
      this.addRoleDialogVisible = false;
    },
    //关闭添加角色对话框
    fnAddRoleDiaClosed(formName) {
      this.addRoleForm.roleDesc = "";
      this.$refs[formName].resetFields();
    },
    //删除角色
    async fnRemoveRole(id) {
      //弹框询问用户是否删除该角色
      const confirmResult = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
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
      const { data: _request } = await this.$http.delete("roles/" + id);
      if (_request.meta.status != 200) {
        this.$message.error("删除角色失败");
      } else {
        this.$message.success("删除角色成功");
        this.fnGetRolesList();
      }
    },
    //关闭编辑角色对话框
    fnCloseEditRoleDia(formName) {
      this.addRoleForm.roleDesc = "";
      this.$refs[formName].resetFields();
    },
    //编辑角色信息按钮
    async fnEditRoleBt(id) {
      this.editRoleDialogVisaible = true;
      this.roleId = id;
    },
    //编辑角色确认按钮
    async fnEditRoleConfirm() {
      const { data: _request } = await this.$http.put(
        "roles/" + this.roleId,
        this.addRoleForm
      );
      if (_request.meta.status != 200)
        return this.$message.error("角色编辑失败");
      this.$message.success("编辑用户成功");
      this.fnGetRolesList();
      this.editRoleDialogVisaible = false;
    }
  }
};
</script>
<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>