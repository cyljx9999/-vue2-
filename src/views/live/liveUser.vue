<template>
  <el-main>
    <!-- 搜索框 -->
    <el-form
      :model="params"
      ref="searchForm"
      label-width="80px"
      :inline="true"
      size="small"
    >
      <el-form-item label="姓名">
        <el-input v-model="params.loginName"></el-input>
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="params.phone"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click="searchBtn">查询</el-button>
        <el-button style="color: #ff7670" icon="el-icon-close" @click="resetBtn">重置</el-button>
        <el-button icon="el-icon-plus" type="primary" @click="addBtn">新增</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table :height="tableHeight" :data="tableList" empty-text="暂无数据" border stripe>
      <el-table-column align="center" prop="loginName" label="姓名"></el-table-column>
      <el-table-column align="center" prop="sex" label="性别">
        <template slot-scope="scope">
          <el-tag type="success" size="normal" v-if="scope.row.sex === '0'">男</el-tag>
          <el-tag type="danger" size="normal" v-if="scope.row.sex === '1'">女</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="phone" label="电话"></el-table-column>
      <el-table-column align="center" prop="buildName" label="栋数"></el-table-column>
      <el-table-column align="center" prop="unitName" label="单元"></el-table-column>
      <el-table-column align="center" prop="houseNum" label="房屋编号"></el-table-column>
      <el-table-column align="center" prop="houseArea" label="使用面积"></el-table-column>
      <el-table-column align="center" prop="parkName" label="车位"></el-table-column>
      <el-table-column align="center" width="580" label="操作">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit" type="success" size="small" @click="editBtn(scope.row)"
          >编辑
          </el-button
          >
          <el-button icon="el-icon-edit" type="primary" size="small" @click="assignHouse(scope.row)"
          >分配房屋
          </el-button
          >
          <el-button icon="el-icon-edit" type="success" size="small" @click="assignPark(scope.row)"
          >分配车位
          </el-button
          >
          <el-button icon="el-icon-edit" type="danger" size="small" @click="leaveHouse(scope.row)"
          >退房
          </el-button
          >
          <el-button icon="el-icon-edit" type="warning" size="small" @click="leavePark(scope.row)"
          >退车位
          </el-button
          >
          <el-button icon="el-icon-delete" type="danger" size="small" @click="deleteBtn(scope.row)"
          >删除
          </el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="sizeChange"
      @current-change="currentChange"
      :current-page.sync="params.currentPage"
      :page-sizes="[10, 20, 40, 80, 100]"
      :page-size="params.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="params.total"
      background
    >
    </el-pagination>

    <!-- 新增。编辑弹框 -->
    <sys-dialog
      :title="addDialog.title"
      :height="addDialog.height"
      :width="addDialog.width"
      :visible="addDialog.visible"
      @onClose="onClose"
      @onConfirm="onConfirm"
    >
      <template slot="content">
        <el-form
          :model="addModel"
          ref="addForm"
          :rules="rules"
          label-width="80px"
          :inline="true"
          size="small"
        >
          <el-form-item prop="loginName" label="姓名">
            <el-input v-model="addModel.loginName"></el-input>
          </el-form-item>
          <el-form-item prop="sex" label="性别">
            <el-radio-group v-model="addModel.sex">
              <el-radio :label="'0'">男</el-radio>
              <el-radio :label="'1'">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="phone" label="电话">
            <el-input v-model="addModel.phone"></el-input>
          </el-form-item>
          <el-form-item prop="roleId" label="角色">
            <el-select v-model="addModel.roleId">
              <el-option
                v-for="item in roleList"
                :key="item.roleId"
                :label="item.roleName"
                :value="item.roleId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="username" label="登录名">
            <el-input v-model="addModel.username"></el-input>
          </el-form-item>
          <el-form-item v-if="addModel.editType !== '1'" prop="password" label="密码">
            <el-input v-model="addModel.password"></el-input>
          </el-form-item>
          <el-form-item prop="status" label="状态">
            <el-radio-group v-model="addModel.status">
              <el-radio :label="'0'">启用</el-radio>
              <el-radio :label="'1'">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </template>
    </sys-dialog>

    <!-- 分配房屋 -->
    <sys-dialog
      :title="assignHouseDialog.title"
      :height="assignHouseDialog.height"
      :width="assignHouseDialog.width"
      :visible="assignHouseDialog.visible"
      @onClose="assignHouseClose"
      @onConfirm="assignHouseConfirm"
    >
      <template slot="content">
        <el-main style="padding: 0">
          <!-- 搜索框 -->
          <el-form
            :model="houseParams"
            ref="assignHoseForm"
            label-width="70px"
            :inline="true"
            size="small"
          >
            <el-form-item label="栋数名称">
              <el-input
                placeholder="请输入栋数名称"
                v-model="houseParams.buildName"
              ></el-input>
            </el-form-item>
            <el-form-item label="单元名称">
              <el-input
                placeholder="请输入单元名称"
                v-model="houseParams.unitName"
              ></el-input>
            </el-form-item>
            <el-form-item label="房屋编号">
              <el-input
                placeholder="请输入房屋编号"
                v-model="houseParams.houseNum"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button icon="el-icon-search" @click="assignHouseSearchBtn">搜索</el-button>
              <el-button style="color: #ff7670" icon="el-icon-close" @click="assignHouseResetBtn">重置</el-button>
            </el-form-item>
          </el-form>
          <!-- 表格 -->
          <el-table :height="assignTableHeight" :data="houseList" border stripe>
            <el-table-column width="50" align="center" label="选择">
              <template slot-scope="scope">
                <el-radio
                  v-model="assignHoseParam.houseId"
                  :label="scope.row.houseId"
                  @change="getCurrentRow(scope.row)"
                >
                  {{ "" }}
                </el-radio>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="buildName"
              label="栋数名称"
            ></el-table-column>
            <el-table-column
              align="center"
              prop="unitName"
              label="单元名称"
            ></el-table-column>
            <el-table-column
              align="center"
              prop="houseNum"
              label="房屋编号"
            ></el-table-column>
            <el-table-column
              align="center"
              prop="houseArea"
              label="使用面积"
            ></el-table-column>
            <el-table-column align="center" prop="status" label="分配状态">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.status === '0'" type="danger" size="small"
                >未分配
                </el-tag
                >
                <el-tag v-if="scope.row.status === '1'" type="success" size="small"
                >已分配
                </el-tag
                >
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination
            @size-change="assignHouseSize"
            @current-change="assignHouseChange"
            :current-page.sync="houseParams.currentPage"
            :page-sizes="[5, 10, 20, 30, 50]"
            :page-size="houseParams.pageSize"
            layout="total, sizes, prev, pager, next"
            :total="houseParams.total"
            background
          >
          </el-pagination>
        </el-main>
      </template>
    </sys-dialog>

    <!-- 分配车位 -->
    <sys-dialog
      :title="parkDialog.title"
      :height="parkDialog.height"
      :width="parkDialog.width"
      :visible="parkDialog.visible"
      @onClose="parkOnClose"
      @onConfirm="parkOnConfirm"
    >
      <template slot="content">
        <el-main style="padding: 0">
          <!-- 搜索框 -->
          <el-form :model="parkParams" label-width="80px" :inline="true" size="small">
            <el-form-item label="车位名称">
              <el-input v-model="parkParams.parkName"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button icon="el-icon-search" @click="parkSearchBtn">查询</el-button>
              <el-button style="color: #ff7670" icon="el-icon-close" @click="parkResetBtn"
              >重置</el-button
              >
            </el-form-item>
          </el-form>
          <!-- 表格 -->
          <el-table :height="parkTableHeight" :data="parkList" empty-text="暂时数据" border stripe>
            <el-table-column align="center" label="操作" width="50">
              <template slot-scope="scope">
                <el-radio
                  v-model="assignParkParam.parkId"
                  :label="scope.row.parkId"
                  @change="getAssignParkId(scope.row)"
                >
                  {{ "" }}
                </el-radio>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="parkName"
              label="车位名称"
            ></el-table-column>
            <el-table-column align="center" prop="parkType" label="车位类型">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.parkType === '0'" type="danger" size="small"
                >地上</el-tag
                >
                <el-tag v-if="scope.row.parkType === '1'" type="success" size="small"
                >地下</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column align="center" prop="parkName" label="使用状态">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.parkStatus === '0'" type="danger" size="small"
                >未使用</el-tag
                >
                <el-tag v-if="scope.row.parkStatus === '1'" type="success" size="small"
                >已使用</el-tag
                >
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination
            @size-change="assignParkSizeChange"
            @current-change="assignParkCurrentChange"
            :current-page.sync="parkParams.currentPage"
            :page-sizes="[5, 10, 15, 20, 50]"
            :page-size="parkParams.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="parkParams.total"
            background
          >
          </el-pagination>
        </el-main>
      </template>
    </sys-dialog>
  </el-main>
</template>

<script>
  import SysDialog from "@/components/System/SysDialog";
  import {
    addLiveUserApi,
    getRoleListApi,
    getLiveUserListApi,
    getLiveUserByIdApi,
    editLiveUserApi,
    getHouseListApi,
    assignSaveApi,
    getParkListApi,
    assignParkSaveApi,
    returnHouseApi,
    returnParkApi,
    deleteLiveUserApi
  } from "../../api/liveUser";

  export default {
    name: "liveUser",
    data() {
      return {
        //分配车位列表高度
        parkTableHeight: 0,
        //分配车位参数
        assignParkParam: {
          parkId: "",
          userId: "",
        },
        //车位弹框属性
        parkDialog: {
          title: "",
          height: 400,
          width: 900,
          visible: false,
        },
        //车位列表
        parkList: [],
        //车位参数
        parkParams: {
          parkName: "",
          parkType: "",
          parkStatus: "0",
          currentPage: 1,
          total: 0,
          pageSize: 5,
        },
        //分配房屋列表高度
        assignTableHeight: 0,
        //分配房屋提交的数据
        assignHoseParam: {
          houseId: '',
          userId: ''
        },
        //分配房屋弹框属性
        assignHouseDialog: {
          title: "",
          height: 400,
          width: 1050,
          visible: false,
        },
        //房屋数据域
        houseList: [],
        //获取房屋列表的参数
        houseParams: {
          buildName: "",
          status: "0",
          unitName: "",
          houseNum: "",
          currentPage: 1,
          pageSize: 5,
          total: 0,
        },
        //表格的高度
        tableHeight: 0,
        //业主列表
        tableList: [],
        //角色列表
        roleList: [],
        //表单绑定数据源
        addModel: {
          editType: "",
          userId: "",
          username: "",
          phone: "",
          sex: "",
          loginName: "",
          password: "",
          status: "",
          roleId: "",
        },
        //表单验证规则
        rules: {
          loginName: [
            {
              trigger: "change",
              required: true,
              message: "请填写姓名",
            },
          ],
          phone: [
            {
              pattern:"^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$",
              trigger: "change",
              required: true,
              message: "请填写电话",
            },
          ],
          sex: [
            {
              trigger: "change",
              required: true,
              message: "请选择性别",
            },
          ],
          username: [
            {
              trigger: "change",
              required: true,
              message: "请填写登录名",
            },
          ],
          password: [
            {
              trigger: "change",
              required: true,
              message: "请填写登录密码",
            },
          ],
          status: [
            {
              trigger: "change",
              required: true,
              message: "请选择用户状态",
            },
          ],
          roleId: [
            {
              trigger: "change",
              required: true,
              message: "请选择用户角色",
            },
          ],
        },
        //弹框属性
        addDialog: {
          title: "",
          height: 220,
          width: 620,
          visible: false,
        },
        //参数
        params: {
          loginName: "",
          phone: "",
          currentPage: 1,
          total: 0,
          pageSize: 10,
        },
      }
    },

    props: {},

    components: {SysDialog},

    computed: {},

    watch: {},

    created() {
      this.getRoleList();
      this.getList();
    },

    mounted() {
      this.$nextTick(() => {
        this.tableHeight = window.innerHeight - 210;
        this.assignTableHeight = window.innerHeight - 642;
        this.parkTableHeight = window.innerHeight - 642;
      })
    },

    methods: {
      //搜索
      searchBtn(){
        this.getList();
      },
      //搜索
      resetBtn(){
        this.params.loginName = '';
        this.params.phone = '';
        this.getList();
      },
      //分配车位页数改变触发
      assignParkCurrentChange(val) {
        this.parkParams.currentPage = val;
        this.getAssignParkList();
      },
      //分配车位页容量改变触发
      assignParkSizeChange(val) {
        this.parkParams.pageSize = val;
        this.getAssignParkList();
      },
      //分配车位点击
      getAssignParkId(row) {
        this.assignParkParam.parkId = row.parkId;
      },
      //分配车位弹框确认
     async parkOnConfirm() {
        //验证是否选择车位
        if (!this.assignParkParam.parkId) {
          this.$message.warning("请选择车位！");
          return;
        }
        let res = await assignParkSaveApi(this.assignParkParam);
        if (res && res.code === 200) {
          this.$message.success(res.msg);
          this.parkDialog.visible = false;
          //刷新列表
          this.getList();
        }
        this.parkDialog.visible = false;
      },
      //分配车位弹框关闭
      parkOnClose() {
        this.parkDialog.visible = false;
      },
      //分配房屋列表页数改变
      assignHouseChange(val) {
        this.houseParams.currentPage = val;
        this.getAssignHouseList();
      },
      //分配房屋列表页容量改变事件
      assignHouseSize(val) {
        this.houseParams.pageSize = val;
        this.getAssignHouseList();
      },
      //分配房屋框中删除按钮
      assignHouseSearchBtn() {
        this.getAssignHouseList();
      },
      //分配房屋框中重置按钮
      assignHouseResetBtn() {
        this.houseParams.buildName = '';
        this.houseParams.unitName = '';
        this.houseParams.houseNum = '';
        this.getAssignHouseList();
      },
      //房屋选择事件
      getCurrentRow(row) {
        this.assignHoseParam.houseId = row.houseId;
      },
      // 分配房屋关闭事件
      assignHouseClose() {
        this.assignHouseDialog.visible = false;
      },
      //分配房屋确认事件
     async assignHouseConfirm() {
        if (!this.assignHoseParam.houseId) {
          this.$message.warning("请选择要分配的房屋!");
          return;
        }
        //数据提交
        let res = await assignSaveApi(this.assignHoseParam);
        if (res && res.code === 200) {
          //刷新列表
          this.getList();
          this.assignHouseDialog.visible = false;
          this.$message.success(res.msg);
        }else {
          this.$message.error(res.msg);
        }
        this.assignHouseDialog.visible = false;
      },
      //编辑
      async editBtn(row) {
        this.$resetForm("addForm", this.addModel);
        let res = await getLiveUserByIdApi({userId: row.userId});
        if (res && res.code === 200) {
          if (res.data) {
            this.$objCopy(this.addModel, res.data);
          }
        }
        this.addDialog.title = "业主编辑";
        this.addDialog.visible = true;
        this.addModel.editType = "1";
      },
      //删除
      async deleteBtn(row) {
        if (row.liveStatue){
          this.$message.warning("请先退车位再操作");
          return;
        }
        if (row.useStatus){
          this.$message.warning("请先退房屋再操作");
          return;
        }
        let confirm = await this.$myconfirm("确定删除该业主嘛吗？");
        if (confirm) {
          let res = await deleteLiveUserApi({
            userId: row.userId
          });
          if (res && res.code === 200) {
            //刷新列表
            this.getList();
            //信息提示
            this.$message.success(res.msg);
          }else {
            this.$message.error(res.msg);
          }
        }
      },
      //退车位
     async leavePark(row) {
        if (!row.liveStatue){
          this.$message.warning("暂无可退的车位");
          return;
        }
        let confirm = await this.$myconfirm("确定退车位吗？");
        if (confirm) {
          let res = await returnParkApi({
            userId: row.userId,
            parkId: row.parkId,
          });
          if (res && res.code === 200) {
            //刷新列表
            this.getList();
            //信息提示
            this.$message.success(res.msg);
          }else {
            this.$message.error(res.msg);
          }
        }
      },
      //退房
      async leaveHouse(row) {
        if (!row.useStatus){
          this.$message.warning("暂无可退的房屋");
          return;
        }
        let confirm = await this.$myconfirm("确定退房吗？");
        if (confirm) {
          let res = await returnHouseApi({
            userId: row.userId,
            houseId: row.houseId,
          });
          if (res && res.code === 200) {
            //刷新列表
            this.getList();
            //信息提示
            this.$message.success(res.msg);
          }else {
            this.$message.error(res.msg);
          }
        }
      },
      //分配车位列表重置事件
      parkResetBtn() {
        this.parkParams.parkName = "";
        //获取车位列表
        this.getAssignParkList();
      },
      //分配车位查询按钮
      parkSearchBtn() {
        //获取车位列表
        this.getAssignParkList();
      },
      //分配车位
      assignPark(row) {
        if (row.liveStatue === "0"){
          this.$message.warning("已分配车位，不能重复分配");
          return;
        }
        //清空数据
        this.assignParkParam.parkId = "";
        this.parkParams.parkName = "";
        this.assignParkParam.userId = row.userId;
        //获取车位列表
        this.getAssignParkList();
        //弹框属性设置
        this.parkDialog.title = "为【" + row.userName + "】分配车位";
        this.parkDialog.visible = true;
      },
      //分配车位列表
      async getAssignParkList() {
        let res = await getParkListApi(this.parkParams);
        if (res && res.code === 200) {
          this.parkList = res.data.records;
          this.parkParams.total = res.data.total;
        }else {
          this.$message.error(res.msg);
        }
      },

      //分配房屋
      async assignHouse(row) {
        if(row.useStatus === "0"){
          this.$message.warning('已经分配房屋，不能重复分配!');
          return;
        }
        this.houseParams.buildName = '';
        this.houseParams.unitName = '';
        this.houseParams.houseNum = '';
        this.assignHoseParam.houseId = '';
        this.assignHoseParam.userId = '';
        this.getAssignHouseList();
        //弹框属性设置
        this.assignHouseDialog.title = "为【" + row.userName + "】分配房屋";
        this.assignHouseDialog.visible = true;
        //设置分配人
        this.assignHoseParam.userId = row.userId;
      },
      //获取未分配的房屋列表
      async getAssignHouseList() {
        let res = await getHouseListApi(this.houseParams);
        if (res && res.code === 200) {
          this.houseList = res.data.records;
          this.houseParams.total = res.data.total;
        }
      },
      //页数改变时触发
      currentChange(val) {
        this.params.currentPage = val;
        this.getList();
      },
      //页容量改变触发
      sizeChange(val) {
        this.params.pageSize = val;
        this.getList();
      },
      //获取角色列表
      async getRoleList() {
        let res = await getRoleListApi();
        if (res && res.code === 200) {
          this.roleList = res.data;
        } else {
          this.$message.error(res.msg);
        }
      },
      //弹框关闭
      onClose() {
        this.addDialog.visible = false;
      },
      //弹框确认
      onConfirm() {
        this.$refs.addForm.validate(async (valid) => {
          if (valid) {
            let res = null;
            if (this.addModel.editType === "0") {
              res = await addLiveUserApi(this.addModel);
            } else if (this.addModel.editType === "1") {
              res = await editLiveUserApi(this.addModel);
            }
            if (res && res.code === 200) {
              //刷新列表
              this.getList();
              this.addDialog.visible = false;
              this.$message.success(res.msg);
            } else {
              if (res) {
                this.$message.error(res.msg);
              } else {
                this.$message.error("请求失败，请联系管理员");
              }
            }
          }
        });
      },
      //获取业主列表
      async getList() {
        let res = await getLiveUserListApi(this.params);
        if (res && res.code === 200) {
          this.tableList = res.data.records;
          this.params.total = res.data.total
        } else {
          this.$message.error(res.msg);
        }
      },
      //新增按钮
      addBtn() {
        //清空表单
        this.$resetForm("addForm", this.addModel);
        //设置编辑属性
        this.addModel.editType = "0";
        //设置弹框属性
        this.addDialog.title = "新增业主";
        this.addDialog.visible = true;
      },
    },
  }
</script>

<style scoped lang="less">

</style>
