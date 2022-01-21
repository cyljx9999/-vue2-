<template>
  <el-main>
    <!-- 搜索表单 -->
    <el-form
      :model="params"
      ref="searchForm"
      label-width="80px"
      :inline="true"
      size="small"
    >
      <el-form-item label="角色名称">
        <el-input v-model="params.roleName"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click="searchBtn">查询</el-button>
        <el-button
          icon="el-icon-delete"
          style="color: #ff7670"
          @click="resetBtn"
        >重置
        </el-button
        >
        <el-button type="primary" icon="el-icon-plus" @click="addBtn"
        >新增
        </el-button
        >
      </el-form-item>
    </el-form>
    <!-- 角色列表 -->
    <el-table :height="tableHeight" size="small" :data="roleList" empty-text="暂无数据" border stripe>
      <el-table-column align="center" label="角色名称" prop="roleName"></el-table-column>
      <el-table-column align="center" label="备注" prop="remark"></el-table-column>
      <el-table-column width="290" align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="small" @click="editRole(scope.row)">编辑</el-button>
          <el-button type="primary" icon="el-icon-edit" size="small" @click="assignRoleBtn(scope.row)">分配权限</el-button>
          <el-button type="danger" icon="el-icon-delete" size="small" @click="deleteRole(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页 -->
    <el-pagination
      @size-change="sizeChange"
      @current-change="currentChange"
      :current-page.sync="params.currentPage"
      :page-size="params.pageSize"
      layout="total, sizes, prev, pager, next"
      :total="params.total"
      background
    >
    </el-pagination>

    <!--  新增或编辑组件  -->
    <sys-dialog
      :title="dialog.title"
      :height="dialog.height"
      :width="dialog.width"
      :visible="dialog.visible"
      :innerVisible="dialog.innerVisible"
      :validErrorOjb="validErrorOjb"
      @onConfirm="onConfirm"
      @onClose="onClose"
    >
      <div slot="content">
        <el-form
          :model="addModel"
          ref="addForm"
          :rules="rules"
          label-width="80px"
          :inline="true"
          size="normal"
        >
          <el-form-item prop="roleName" label="角色名称">
            <el-input v-model="addModel.roleName"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="addModel.remark"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </sys-dialog>

    <!-- 分配权限弹框 -->
    <sys-dialog
      :title="assignDialog.title"
      :height="assignDialog.height"
      :width="assignDialog.width"
      :visible="assignDialog.visible"
      @onClose="assignClose"
      @onConfirm="assignConfirm"
    >
      <template slot="content">
        <span>
          <el-tree
            ref="assignTree"
            default-expand-all
            :default-checked-keys="assignTreeChecked"
            :data="assignTreeData"
            node-key="menuId"
            :props="defaultProps"
            empty-text="暂无数据"
            :show-checkbox="true"
          ></el-tree>
        </span>
      </template>
    </sys-dialog>
  </el-main>
</template>

<script>
  import {
    getRoleListApi,
    addRoleApi,
    editRoleApi,
    deleteRoleApi,
    getAssignTreeApi,
    assignSaveApi
  } from "@/api/role"
  import SysDialog from "@/components/System/SysDialog";
  import {getUserId} from "@/utils/auth";

  export default {
    name: "sysRoleList",
    data() {
      return {
        roleId:'',
        //树的字段映射配置
        defaultProps:{
          children:"children",
          label:"menuLabel"
        },
        //分配权限树
        assignTreeData: [],
        //权限树默认选中的节点
        assignTreeChecked: [],
        //分配权限弹出框属性
        assignDialog: {
          title: '',
          width: 300,
          height: 500,
          visible: false
        },
        //表单验证规则
        rules: {
          roleName: [{
            required: true,
            trigger: 'change',
            message: '请填写角色名称'
          }]
        },
        //新增或编辑数据绑定
        addModel: {
          roleId: '',
          roleName: '',
          remark: '',
          type: '' // 标识状态 0：新增 ，1：编辑
        },
        //弹框属性
        dialog: {
          title: "",
          height: 120,
          width: 610,
          visible: false,
          innerVisible: false,
        },
        //表格数据
        roleList: [],
        //表格的高度
        tableHeight: 0,
        //查询参数
        params: {
          pageSize: 10, //每页显示几条数据
          currentPage: 1, //当前第几页
          roleName: "",
          total: 0, //总条数
        },
        //数据校验错误信息
        validErrorOjb: {}
      }
    },

    props: {},

    components: {
      SysDialog
    },

    computed: {},

    watch: {},

    created() {
      this.getRoleList();
    },

    mounted() {
      this.$nextTick(() => {
        this.tableHeight = window.innerHeight - 210;
      });
    },

    methods: {
      // 分配权限弹框关闭事件
      assignClose() {
        this.assignDialog.visible = false;
      },
      // 分配权限弹框确认事件
      async assignConfirm() {
        let ids = this.$refs.assignTree
          .getCheckedKeys()
          .concat(this.$refs.assignTree.getHalfCheckedKeys());
        if (ids.length === 0) {
          this.$message.warning("请勾选权限！");
          return;
        }
        let param = {
          roleId: this.roleId,
          idList: ids,
        };
        let res = await assignSaveApi(param);
        if (res && res.code === 200) {
          this.assignDialog.visible = false;
          this.$message.success(res.msg);
        }else {
          this.$message.error(res.msg)
        }
      },
      //分配权限按钮
      async assignRoleBtn(row) {
        this.roleId = '';
        this.assignTreeData = [];
        this.assignTreeChecked = [];
        //设置弹框属性
        this.assignDialog.title = "为【  " + row.roleName + "  】分配权限";
        this.assignDialog.visible = true;
        this.roleId = row.roleId;
        let param = {
          userId: getUserId(),
          roleId: row.roleId,
        };
        let res = await getAssignTreeApi(param);
        if (res && res.code === 200) {
          this.assignTreeData = res.data.listMenu;
          this.assignTreeChecked = res.data.checkList;
        }else {
          this.$message.error(res.msg)
        }
        if (this.assignTreeChecked.length > 0) {
          let newArr = [];
          this.assignTreeChecked.forEach((item) => {
            this.checked(item, this.assignTreeData, newArr);
          });
          this.assignTreeChecked = newArr;
        }
      },
      checked(id, data, newArr) {
        data.forEach((item) => {
          if (item.menuId === id) {
            if (item.children && item.children.length === 0) {
              newArr.push(item.menuId);
            }
          } else {
            if (item.children != null && item.children.length !== 0) {
              this.checked(id, item.children, newArr);
            }
          }
        });
      },
      //删除按钮
      async deleteRole(row) {
        let flag = await this.$myconfirm("确定删除该角色嘛");
        if (flag) {
          let res = await deleteRoleApi({roleId: row.roleId});
          if (res && res.code === 200) {
            this.getRoleList();
            this.$message.success(res.msg)
          } else {
            this.getRoleList();
            this.$message.error(res.msg)
          }
        }
      },
      //编辑按钮
      editRole(row) {
        // 清空表单内容
        this.$resetForm("addForm", this.addModel);
        this.addModel.type = "1";
        // 数据回显
        this.$objCopy(this.addModel, row);
        // 设置类型为 编辑状态
        this.dialog.title = "编辑角色";
        // 显示弹窗
        this.dialog.visible = true;
      },
      //新增或编辑取消事件
      onClose(val) {
        //判断内层错误提示之后关闭再点击关闭外层的情况
        if (val === 400 && this.dialog.innerVisible === false) {
          this.dialog.visible = false;
        } else if (val === 400) {
          //关闭内层错误框
          this.dialog.innerVisible = false;
        } else {
          // 不进行提交操作就关闭
          this.dialog.visible = false;
        }
      },
      //新增或编辑确认事件
      onConfirm() {
        this.$refs.addForm.validate(async valid => {
          if (valid) {
            let res = null;
            //新增
            if (this.addModel.type === '0') {
              res = await addRoleApi(this.addModel);
            } else if (this.addModel.type === '1') {
              res = await editRoleApi(this.addModel);
            }
            if (res && res.code === 200) {
              //刷新列表
              this.getRoleList();
              this.dialog.visible = false;
              this.$message.success(res.msg);
            } else if (res && res.code === 400) {
              //将数据错误信息存储
              this.validErrorOjb = res;
              //设置弹出层组件嵌套内层状态是否展示
              this.dialog.innerVisible = true;
            } else {
              this.$message.error("操作失败请重新尝试或者联系管理员");
            }
          }
        })
      },
      //页数改变时触发
      currentChange(val) {
        this.params.currentPage = val;
        this.getRoleList();
      },
      //页容量改变时触发
      sizeChange(val) {
        this.params.pageSize = val;
        this.getRoleList();
      },
      //新增按钮
      addBtn() {
        //清空表单数据
        this.$resetForm('addForm', this.addModel);
        this.addModel.type = '0';
        this.dialog.title = "新增角色";
        this.dialog.visible = true;
      },
      //重置按钮
      resetBtn() {
        this.params.roleName = '';
        this.getRoleList();
      },
      //搜索按钮
      searchBtn() {
        this.getRoleList();
      },
      //获取角色列表
      async getRoleList() {
        let res = await getRoleListApi(this.params);
        if (res.code === 200) {
          this.roleList = res.data.records;
          this.params.total = res.data.total;
          this.params.currentPage = res.data.current
        } else {
          this.$message.error("列表数据获取失败，请联系管理员");
        }
      }
    }
  }
</script>

<style scoped lang="less">

</style>
