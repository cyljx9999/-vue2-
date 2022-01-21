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
      <el-table-column align="center" width="290" label="操作">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-edit"
            type="primary"
            size="small"
            @click="editUser(scope.row)"
          >编辑
          </el-button>
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="small"
            @click="assignRole(scope.row)"
          >分配角色</el-button
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
      :innerVisible="dialog.innerVisible"
      :validErrorOjb="validErrorOjb"
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
              <el-radio :label="'0'">是</el-radio>
              <el-radio :label="'1'">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
    </SysDialog>

    <!-- 分配角色弹框 -->
    <sys-dialog
      :title="roleDialog.title"
      :height="roleDialog.height"
      :width="roleDialog.width"
      :visible="roleDialog.visible"
      @onClose="roleClose"
      @onConfirm="roleConfirm"
    >
      <template slot="content">
        <el-table :height="roleHeight" :data="roleList" border stripe>
          <el-table-column width="50" align="center" label="选择">
            <template slot-scope="scope">
              <el-radio v-model="radio" :label="scope.row.roleId" @change="getCurrentRow(scope.row)">
                {{""}}
              </el-radio>

            </template>
          </el-table-column>
          <el-table-column prop="roleName" label="角色名称"></el-table-column>
          <el-table-column prop="remark" label="角色备注"></el-table-column>
        </el-table>
        <el-pagination
          @size-change="roleSizeChange"
          @current-change="roleCurrentChange"
          :current-page.sync="roleParam.currentPage"
          :page-sizes="[10, 20, 40, 80, 100]"
          :page-size="roleParam.pageSize"
          layout="total, sizes, prev, pager, next"
          :total="roleParam.total"
          background
        >
        </el-pagination>
      </template>
    </sys-dialog>
  </el-main>
</template>

<script>
  import {
    getUserListApi,
    addUserApi,
    editUserApi,
    deleteUserApi,
    getRoleByUserId,
    assignSave
  } from "@/api/user";
  import SysDialog from '@/components/System/SysDialog';
  import {getRoleListApi} from "../../api/role";

  export default {
    name: "sysUserList",
    data() {
      let checkUserName = (rule, value, callback) => {
        if (!value || value.trim() === "") {
          return callback(new Error('请填写姓名'));
        } else {
          callback()
        }

      };
      return {
        //分配角色保存参数
        assignParam:{
          roleId:'',
          userId:''
        },
        radio:'',
        //角色列表高度
        roleHeight:0,
        //角色列表
        roleList:[],
        //角色列表分页
        roleParam:{
          pageSize:10,
          currentPage:1,
          total:0
        },
        //分配角色弹框
        roleDialog: {
          title: "",
          height: 400,
          width: 800,
          visible: false,
        },
        // 表单验证规则
        rules: {
          loginName: [
            {
              required: true,
              trigger: "change",
              message: "请填写登录名",
            },
          ],
          password: [
            {
              required: true,
              trigger: "change",
              message: "请填写密码",
            },
          ],
          userName: [
            {
              validator: checkUserName,
              required: true,
              trigger: "change",
              message: "请填写正确姓名",
            },
          ],
          phone: [
            {
              pattern:"^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$",
              required: true,
              trigger: "change",
              message: "请填写正确电话号码格式",
            },
          ],
          idCard: [
            {
              pattern: "^(^[1-9]\\d{7}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}$)|(^[1-9]\\d{5}[1-9]\\d{3}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])((\\d{4})|\\d{3}[Xx])$)$",
              required: true,
              trigger: "change",
              message: "请填写正确的身份证号码格式",
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
          innerVisible: false,
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
        //数据校验错误信息
        validErrorOjb: {}
      }
    },

    props: {},

    components: {
      SysDialog,
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
      //角色选中事件
      getCurrentRow(row){
        this.assignParam.roleId = row.roleId;
      },
      //页数改变
      roleCurrentChange(val){
        this.roleParam.currentPage = val;
        this.getRoleList();
      },
      //页容量改变触发
      roleSizeChange(val){
        this.roleParam.pageSize = val;
        this.getRoleList();
      },
      //分配角色按钮
      async assignRole(row) {
        this.radio = '';
        this.assignParam.userId = row.userId;
        //设置弹框属性
        this.roleDialog.title = '为【'+row.userName+'】分配角色';
        this.roleDialog.visible = true;
        //查询角色列表
        await this.getRoleList();
        this.$nextTick(()=>{
          this.roleHeight = window.innerHeight-620
        });
        //角色回显
        let res = await getRoleByUserId({userId:row.userId});
        if(res && res.code === 200){
          if (res.data){
            this.radio = res.data.roleId;
          }
        }else {
          this.roleDialog.visible = false;
          this.$message.error(res.msg)
        }
      },
      //获取角色权限列表
      async getRoleList(){
        let res = await getRoleListApi(this.roleParam);
        if(res.code === 200){
          this.roleList = res.data.records;
          this.roleParam.total = res.data.total;
        }else {
          this.$message.error("列表数据获取失败，请联系管理员");
        }
      },
      //分配角色确认
      async roleConfirm() {
        if(!this.radio){
          this.$message.warning('请选择角色!');
          return;
        }
        let res = await assignSave(this.assignParam);
        if(res && res.code === 200){
          this.$message.success(res.msg);
          this.roleDialog.visible = false;
        }else {
          this.$message.error(res.msg)
        }
      },
      //分配角色取消
      roleClose() {
        this.roleDialog.visible = false;
      },
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
        this.$objCopy(this.addModel, row);
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
          }else {
            this.getUserList();
            this.$message.error(res.msg);
          }
        }
      },
      // 表格是否离职按钮 点击事件
      async changeStatus(row) {
        let res = await editUserApi(row);
        console.log(res);
        if (res && res.code === 200) {
          this.getUserList();
          this.$message.success(res.msg);
        }else {
          this.getUserList();
          this.$message.error("修改失败，请重试或者联系管理员");
        }
      },
      // 表格是否使用按钮 点击事件
      async changeUsed(row) {

        let res = await editUserApi(row);
        if (res && res.code === 200) {
          this.getUserList();
          this.$message.success(res.msg);
        }else {
          this.getUserList();
          this.$message.error("修改失败，请重试或者联系管理员");
        }
      },
      //对话框确认事件
      onConfirm() {
        this.$refs.addForm.validate(async validate => {
          if (validate) {
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
            } else if (res && res.code === 400) {
              //将数据错误信息存储
              this.validErrorOjb = res;
              //设置弹出层组件嵌套内层状态是否展示
              this.dialog.innerVisible = true;
            }else {
              this.$message.error("操作失败请重新尝试或者联系管理员");
            }
          }
        })
      },
      //对话框关闭
      onClose(val) {
        //判断内层错误提示之后关闭再点击关闭外层的情况
        if (val === 400 && this.dialog.innerVisible === false){
          this.dialog.visible = false;
        }else if (val === 400) {
          //关闭内层错误框
          this.dialog.innerVisible = false;
        }else{
          // 不进行提交操作就关闭
          this.dialog.visible = false;
        }
      },

      //获取员工列表数据
      async getUserList() {
        let res = await getUserListApi(this.params);
        if (res.code === 200) {
          this.tableList = res.data.records;
          this.params.total = res.data.total;
          this.params.currentPage = res.data.current
        }else {
          this.$message.error("列表数据获取失败，请联系管理员");
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
