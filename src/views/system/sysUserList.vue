<template>
  <el-main>
    <!-- 搜索框 -->
    <el-form
      :model="params"
      ref="searchform"
      label-width="80px"
      :inline="true"
      size="small"
    >
      <el-form-item label="姓名">
        <el-input v-model="params.userName"></el-input>
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="params.phone"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="searchBtn" icon="el-icon-search">查询</el-button>
        <el-button @click="resetBtn" style="color: #FF7670;" icon="el-icon-delete">重置</el-button>
        <el-button @click="addUser" type="primary" icon="el-icon-plus">新增</el-button>
      </el-form-item>
    </el-form>

    <!-- 员工表格 -->
    <el-table :height="tableHeight" :data="tableList" empty-text="暂无数据" border stripe>
      <el-table-column align="center" prop="userName" label="姓名"></el-table-column>
      <el-table-column align="center" prop="phone" label="电话"></el-table-column>
      <el-table-column align="center" prop="idCard" label="身份证"></el-table-column>
      <el-table-column align="center" prop="sex" label="性别">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.sex === '1'" size="normal">男</el-tag>
          <el-tag v-if="scope.row.sex === '0'" type="success" size="normal">女</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="status" label="是否在职">
        <template slot-scope="scope">
          <el-switch
            :active-value="'0'"
            active-text="是"
            inactive-text="否"
            :inactive-value="'1'"
            v-model="scope.row.status"
            @change="changeStatus(scope.row)"
          ></el-switch>

        </template>
      </el-table-column>
      <el-table-column align="center" prop="isUsed" label="账户状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isUsed"
            :active-value="'0'"
            :inactive-value="'1'"
            active-text="启用"
            inactive-text="禁用"
            @change="changeUsed(scope.row)"
          ></el-switch>

        </template>
      </el-table-column>
      <el-table-column align="center" width="200" label="操作">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-edit"
            type="primary"
            size="small"
            @click="editUser(scope.row)"
          >编辑
          </el-button
          >
          <el-button
            icon="el-icon-delete"
            type="danger"
            size="small"
            @click="deleteUser(scope.row)"
          >删除
          </el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页展示数据 -->
    <el-pagination
      @size-change="sizeChange"
      @current-change="currentChange"
      :current-page.sync="params.currentPage"
      :page-sizes="[10, 20, 40, 80, 100]"
      :page-size="params.pageSize"
      :total="params.total"
      layout="total,sizes, prev, pager, next"
      background
    >
    </el-pagination>

    <!-- 新增或编辑弹框 -->
    <SysDialog
      :title="dialog.title"
      :visible="dialog.visible"
      :height="dialog.height"
      :width="dialog.width"
      @onClose="onClose"
      @onConfirm="onConfirm"
    >
      <div slot="content">
        <el-form
          :model="addModel"
          ref="addForm"
          :rules="rules"
          label-width="80px"
          :inline="true"
          size="small"
        >
          <el-form-item prop="userName" label="姓名:">
            <el-input v-model="addModel.userName"></el-input>
          </el-form-item>
          <el-form-item style="width:280px;" prop="sex" label="性别:">
            <el-radio-group v-model="addModel.sex">
              <el-radio :label="'0'">男</el-radio>
              <el-radio :label="'1'">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="phone" label="电话:">
            <el-input v-model="addModel.phone"></el-input>
          </el-form-item>
          <el-form-item prop="idCard" label="身份证:">
            <el-input v-model="addModel.idCard"></el-input>
          </el-form-item>
          <el-form-item prop="loginName" label="登录名:">
            <el-input v-model="addModel.loginName"></el-input>
          </el-form-item>
          <el-form-item prop="password" label="密码:">
            <el-input type="password" v-model="addModel.password"></el-input>
          </el-form-item>
          <el-form-item style="width:270px;" prop="status" label="离职:">
            <el-radio-group v-model="addModel.status">
              <el-radio :label="'1'">是</el-radio>
              <el-radio :label="'0'">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item class="el-form-item-isUsed" style="width:280px" prop="isUsed" label="启用:">
            <el-radio-group v-model="addModel.isUsed" class="el-form-item-isUsed-test">
              <el-radio :label="'1'">是</el-radio>
              <el-radio :label="'0'">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
    </SysDialog>
  </el-main>
</template>

<script>
  import {getUserListApi, addUserApi, editUserApi, deleteUserApi} from "@/api/user";
  import SysDialog from '@/components/System/SysDialog';
  import Logo from "../../layout/components/Sidebar/Logo";

  export default {
    name: "sysUserList",
    data() {
      return {
        // 表单验证规则
        rules: {
          userName: [
            {
              required: true,
              trigger: "change",
              message: "请填写姓名",
            },
          ],
          phone: [
            {
              required: true,
              trigger: "change",
              message: "请填写电话号码",
            },
          ],
          idCard: [
            {
              required: true,
              trigger: "change",
              message: "请填写身份证号码",
            },
          ],
          status: [
            {
              required: true,
              trigger: "change",
              message: "请选择是否离职",
            },
          ],
          isUsed: [
            {
              required: true,
              trigger: "change",
              message: "请选择是否启用",
            },
          ],
          sex: [
            {
              required: true,
              trigger: "change",
              message: "请选择性别",
            },
          ]
        },
        //新增或编辑表单数据域
        addModel: {
          userId: '',
          type: '', //0： 新增 1： 编辑
          userName: '',
          sex: '',
          phone: '',
          idCard: '',
          loginName: '',
          password: '',
          status: '',
          isUsed: ''
        },
        //弹框属性
        dialog: {
          title: "",
          visible: false,
          height: 240,
          width: 610,
        },
        //表格的高度
        tableHeight: 200,
        //搜索框数据绑定
        params: {
          phone: "",
          userName: "",
          pageSize: 10,
          currentPage: 1,
          total: 0,
        },
        //表格数据
        tableList: [],
      }
    },

    props: {},

    components: {
      SysDialog
    },

    computed: {},

    watch: {},

    created() {
      //调用 获取员工列表数据 接口
      this.getUserList();
    },

    mounted() {
      //计算table表格的高度
      this.$nextTick(() => {
        this.tableHeight = window.innerHeight - 210;
      });
    },

    methods: {
      // 搜索按钮 点击事件
      searchBtn() {
        this.getUserList();
      },
      // 重置按钮 点击事件
      resetBtn() {
        this.params.phone = '';
        this.params.userName = '';
        this.getUserList();
      },
      //新增员工按钮事件
      addUser() {
        // 清空表单内容
        this.$resetForm("addForm", this.addModel);
        // 设置类型为 添加状态
        this.addModel.type = "0";
        this.dialog.title = "新增员工信息";
        this.dialog.visible = true;
      },
      // 表格编辑按钮 点击事件
      editUser(row) {
        // 清空表单内容
        this.$resetForm("addForm", this.addModel);
        this.addModel.type = "1";
        // 数据回显
        this.$objCoppy(this.addModel, row);
        // 设置类型为 编辑状态
        this.dialog.title = "编辑员工信息";
        // 显示弹窗
        this.dialog.visible = true;
      },
      // 表格删除按钮 点击事件
      async deleteUser(row) {
        let deleteStatus = await this.$myconfirm("确认删除该员工吗");
        if (deleteStatus) {
          let res = await deleteUserApi({userId: row.userId});
          if (res && res.code === 200) {
            this.getUserList();
            this.$message.success(res.msg);
          }
        }
      },
      // 表格是否离职按钮 点击事件
      async changeStatus(row) {
        let params = {
          userId: row.userId,
          status: row.status
        };
        let res = await editUserApi(params);
        if (res && res.code === 200) {
          this.getUserList();
          this.$message.success(res.msg);
        }
      },
      // 表格是否使用按钮 点击事件
      async changeUsed(row) {
        let params = {
          userId: row.userId,
          isUsed: row.isUsed
        };
        let res = await editUserApi(params);
        if (res && res.code === 200) {
          this.getUserList();
          this.$message.success(res.msg);
        }
      },
      //对话框确认事件
      onConfirm() {
        this.$refs.addForm.validate(async validate => {
          if (validate) {
            console.log(this);
            let res = null;
            if (this.addModel.type === "0") {
              res = await addUserApi(this.addModel);
            } else if (this.addModel.type === "1") {
              res = await editUserApi(this.addModel);
            }
            //请求成功
            if (res && res.code === 200) {
              //刷新员工列表
              this.getUserList();
              // 关闭弹窗
              this.dialog.visible = false;
              this.$message.success(res.msg);
            }

          }
        })
      },
      //对话框关闭
      onClose() {
        this.dialog.visible = false;
      },

      //获取员工列表数据
      async getUserList() {
        let res = await getUserListApi(this.params);
        if (res.code === 200) {
          this.tableList = res.data.records;
        }
      },
      //页容量改变的时候触发
      sizeChange(val) {
        this.params.pageSize = val;
        this.getUserList();
      },
      //页数改变的时候触发
      currentChange(val) {
        this.params.currentPage = val;
        this.getUserList();
      },
    }
  }
</script>

<style scoped lang="scss">

</style>
