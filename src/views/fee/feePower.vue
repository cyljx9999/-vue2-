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
        <el-input v-model="params.userName"></el-input>
      </el-form-item>
      <el-form-item label="房屋编号">
        <el-input v-model="params.houseNum"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click="searchBtn">查询</el-button>
        <el-button style="color: #ff7670" icon="el-icon-close" @click="resetBtn">重置</el-button>
        <el-button @click="addBtn" type="primary" icon="el-icon-plus">新增</el-button>
      </el-form-item>
    </el-form>
    <!-- 新增编辑弹框 -->
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
          <el-form-item prop="buildId" label="栋数">
            <el-select v-model="addModel.buildId" @change="selectBuild">
              <el-option
                v-for="item in buildList"
                :key="item.buildId"
                :label="item.buildName"
                :value="item.buildId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="unitId" label="单元">
            <el-select v-model="addModel.unitId" @change="selectUnit">
              <el-option
                v-for="item in unitList"
                :key="item.unitId"
                :label="item.unitName"
                :value="item.unitId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="houseId" label="房屋编号">
            <el-select v-model="addModel.houseId">
              <el-option
                v-for="item in houseList"
                :key="item.houseId"
                :label="item.houseNum"
                :value="item.houseId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="payPowerMonth" label="所属月份">
            <el-date-picker
              format="yyyy-MM"
              value-format="yyyy-MM"
              v-model="addModel.payPowerMonth"
              type="month"
              placeholder="选择月份"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="payPowerMoney" label="缴费金额" size="small">
            <el-input v-model="addModel.payPowerMoney"></el-input>
          </el-form-item>
          <el-form-item style="margin-left: 15px" prop="powerNum" label="表显" size="small">
            <el-input v-model="addModel.powerNum"></el-input>
          </el-form-item>
          <el-form-item v-if="addModel.editType === '0'" prop="payPowerStatus" label="是否缴费" size="small">
            <el-radio-group v-model="addModel.payPowerStatus">
              <el-radio :label="'0'">未缴费</el-radio>
              <el-radio :label="'1'">已缴费</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </template>
    </sys-dialog>

    <el-table :height="tableHeight" :data="powerList" border stripe>
      <el-table-column align="center" prop="loginName" label="姓名"></el-table-column>
      <el-table-column align="center" prop="phone" label="电话"></el-table-column>
      <el-table-column align="center" prop="buildName" label="栋数"></el-table-column>
      <el-table-column align="center" prop="unitName" label="单元"></el-table-column>
      <el-table-column align="center" prop="houseNum" label="房屋编号"></el-table-column>
      <el-table-column align="center" prop="payPowerMoney" label="缴费金额"></el-table-column>
      <el-table-column align="center" prop="payPowerMonth" label="所属月份"></el-table-column>
      <el-table-column align="center" prop="payPowerStatus" label="缴费状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.payPowerStatus === '0'" type="danger" size="small"
          >未缴费
          </el-tag
          >
          <el-tag v-if="scope.row.payPowerStatus === '1'" type="success" size="small"
          >已缴费
          </el-tag
          >
        </template>
      </el-table-column>
      <el-table-column align="center" width="160" label="缴费时间" prop="payPowerTime"></el-table-column>
      <el-table-column width="280" align="center" label="操作">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit" type="primary" size="small" @click="editBtn(scope.row)"
          >编辑
          </el-button
          >
          <el-button icon="el-icon-delete" type="danger" size="small" @click="deleteBtn(scope.row)"
          >删除
          </el-button
          >
          <el-button icon="el-icon-edit" type="warning" size="small"
                     @click="payBtn(scope.row)"
          >缴费
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
  </el-main>
</template>

<script>
  import SysDialog from "../../components/System/SysDialog";
  import {getBuildListApi, getUnitListByBuildId} from "../../api/houseList"
  import {
    getHouseListByUnitId,
    addPowerApi,
    getPowerListApi,
    editPowerApi,
    deletePowerApi,
    payPowerApi
  } from "../../api/feePower";

  export default {
    name: "feePower",
    data() {
      return {
        //表格高度
        tableHeight: 0,
        //列表数据
        powerList: [],
        //表单验证规则
        rules: {
          buildId: [
            {
              trigger: "change",
              required: true,
              message: "请选择栋数",
            },
          ],
          unitId: [
            {
              trigger: "change",
              required: true,
              message: "请选择单元",
            },
          ],
          houseId: [
            {
              trigger: "change",
              required: true,
              message: "请选择房屋编号",
            },
          ],
          payPowerMonth: [
            {
              trigger: "change",
              required: true,
              message: "请选择所属月份",
            },
          ],
          payPowerMoney: [
            {
              trigger: "change",
              required: true,
              message: "请填写缴费金额",
            },
          ],
          powerNum: [
            {
              trigger: "change",
              required: true,
              message: "请填写表显",
            },
          ],
          payPowerStatus: [
            {
              trigger: "change",
              required: true,
              message: "请选择缴费状态",
            },
          ],
        },
        //新增表单绑定数据源
        addModel: {
          houseId: "",
          unitId: "",
          buildId: "",
          editType: "",
          powerId: "",
          payPowerMonth: "",
          payPowerMoney: "",
          powerNum: "",
          payPowerStatus: "",
        },
        houseList: [],
        unitList: [],
        buildList: [],
        //弹框属性
        addDialog: {
          title: "",
          height: 250,
          width: 650,
          visible: false,
        },
        //搜索参数
        params: {
          userName: "",
          houseNum: "",
          currentPage: 1,
          pageSize: 10,
          total: 0,
        },
      }
    },

    props: {},

    components: {SysDialog},

    computed: {},

    watch: {},

    created() {
      this.getBuildList();
      this.getPowerList();
    },

    mounted() {
      this.$nextTick(() => {
        this.tableHeight = window.innerHeight - 210;
      });
    },

    methods: {
      //缴费按钮
      async payBtn(row) {
        if (row.payPowerStatus === '1'){
          this.$message.warning("已缴费，无需再次缴费");
          return;
        }
        //提示信息
        const confirm = await this.$myconfirm('确定缴费吗？');
        if (confirm) {
          let param = {
            powerId: row.powerId,
            payPowerStatus: "1"
          };
          let res = await payPowerApi(param);
          if (res && res.code === 200) {
            this.$message.success(res.msg);
            //刷新列表
            this.getPowerList()
          }else {
            this.$message.error(res.msg);
          }
        }
      },
      //搜索按钮
      searchBtn() {
        this.getPowerList();
      },
      //搜索按钮
      resetBtn() {
        this.params.userName = '';
        this.params.houseNum = '';
        this.getPowerList();
      },
      //删除按钮
      async deleteBtn(row) {
        //信息提示
        const confirm = await this.$myconfirm('确定删除该数据吗？');
        if (confirm) {
          let res = await deletePowerApi({powerId: row.powerId})
          if (res && res.code === 200) {
            //刷新表格
            this.$message.success(res.msg);
            this.getPowerList();
          } else {
            this.$message.error(res.msg);
          }
        }
      },
      //编辑按钮
      editBtn(row) {
        if (row.payPowerStatus === '1'){
          this.$message.warning("已缴费，无法编辑");
          return
        }
        //查询单元列表
        this.getUnitList(row.buildId);
        //查询房屋列表
        this.getHouseByUnitId(row.unitId);
        //清空表单
        this.$resetForm("addForm", this.addModel);
        //设置编辑属性
        this.addModel.editType = "1";
        //设置弹框属性
        this.addDialog.title = "编辑电费";
        this.addDialog.visible = true;
        //把当前要编辑的数据设置到表单数据域
        this.$objCopy(this.addModel, row)
      },
      currentChange(val) {
        this.params.currentPage = val;
        this.getList();
      },
      //页容量改变时触发
      sizeChange(val) {
        this.params.pageSize = val;
        this.getList();
      },
      //获取列表
      async getPowerList() {
        let res = await getPowerListApi(this.params);
        if (res && res.code === 200) {
          //赋值到列表
          this.powerList = res.data.records;
          this.params.total = res.data.total;
        } else {
          this.$message.error(res.msg);
        }
      },
      //单元选择事件
      selectUnit(val) {
        this.addModel.houseId = '';
        this.getHouseByUnitId(val);
      },
      //栋数选择事件
      selectBuild(val) {
        this.addModel.unitId = '';
        this.addModel.houseId = '';
        this.getUnitList(val);
      },
      //新增按钮
      addBtn() {
        //清空表单
        this.$resetForm("addForm", this.addModel);
        //设置编辑属性
        this.addModel.editType = "0";
        //设置弹框属性
        this.addDialog.title = "新增电费";
        this.addDialog.visible = true;
      },
      //弹框确认
      onConfirm() {
        this.$refs.addForm.validate(async (valid) => {
          if (valid) {
            let res = null;
            if (this.addModel.editType === "0") {
              res = await addPowerApi(this.addModel);
            } else if (this.addModel.editType === "1") {
              res = await editPowerApi(this.addModel);
            }
            if (res && res.code === 200) {
              //刷新列表
              this.getPowerList();
              //信息提示
              this.$message.success(res.msg);
              this.addDialog.visible = false;
            } else {
              if (res) {
                this.$message.error(res.msg);
              } else {
                this.$message.error("请求失败，请重试/联系管理员重试");
              }
            }
          }
        });
      },
      //弹框关闭
      onClose() {
        this.addDialog.visible = false;
      },
      async getBuildList() {
        let res = await getBuildListApi();
        if (res && res.data) {
          this.buildList = res.data;
        } else {
          this.$message.error(res.msg);
        }
      },
      //根据栋数id获取单元列表
      async getUnitList(buildId) {
        let res = await getUnitListByBuildId({buildId: buildId});
        if (res && res.data) {
          this.unitList = res.data;
        } else {
          this.$message.error(res.msg);
        }
      },
      //根据单元id获取房屋列表
      async getHouseByUnitId(val) {
        let res = await getHouseListByUnitId({unitId: val});
        if (res && res.code === 200) {
          this.houseList = res.data;
        } else {
          this.$message.error(res.msg);
        }
      }
    }
  }
</script>

<style scoped lang="less">

</style>
