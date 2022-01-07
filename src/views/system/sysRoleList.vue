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
      <el-table-column width="200" align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="small" @click="editRole(scope.row)">编辑</el-button>
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
  </el-main>
</template>

<script>
  import {getRoleListApi,addRoleApi,editRoleApi,deleteRoleApi} from "@/api/role"
  import SysDialog from "@/components/System/SysDialog";

  export default {
    name: "sysRoleList",
    data() {
      return {
        //表单验证规则
        rules:{
          roleName:[{
            required:true,
            trigger:'change',
            message:'请填写角色名称'
          }]
        },
        //新增或编辑数据绑定
        addModel:{
          roleId:'',
          roleName:'',
          remark:'',
          type:'' // 标识状态 0：新增 ，1：编辑
        },
        //弹框属性
        dialog: {
          title: "",
          height: 120,
          width: 610,
          visible: false,
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
        }
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
        this.tableHeight = window.innerHeight - 190;
      });
    },

    methods: {
      //删除按钮
      async deleteRole(row){
        let flag = await this.$myconfirm("确定删除该角色嘛");
        if (flag) {
          let res = await deleteRoleApi({roleId:row.roleId});
          if (res && res.code === 200) {
            this.getRoleList();
            this.$message.success(res.msg)
          }else {
            this.getRoleList();
            this.$message.error(res.msg)
          }
        }
      },
      //编辑按钮
      editRole(row){
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
      onClose() {
        this.dialog.visible = false;
      },
      //新增或编辑确认事件
      onConfirm() {
        this.$refs.addForm.validate(async valid=>{
          if(valid){
            let res = null;
            //新增
            if(this.addModel.type === '0'){
              res = await addRoleApi(this.addModel);
            }else if (this.addModel.type === '1'){
              res = await editRoleApi(this.addModel);
            }
            if(res && res.code === 200){
              //刷新列表
              this.getRoleList();
              this.dialog.visible = false;
              this.$message.success(res.msg);
            }else {
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
        this.$resetForm('addForm',this.addModel);
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
        }else {
          this.$message.error("列表数据获取失败，请联系管理员");
        }
      }
    }
  }
</script>

<style scoped lang="less">

</style>
