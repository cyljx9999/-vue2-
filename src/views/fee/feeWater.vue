<template>
  <el-main>
    <!-- 搜索框 -->
    <el-form
      :model="params"
      ref="searchParm"
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
        <el-button icon="el-icon-search" @click="searchBtn">搜索</el-button>
        <el-button style="color: #ff7670" icon="el-icon-close" @click="resetBtn"
        >重置</el-button
        >
        <el-button type="primary" icon="el-icon-plus" @click="addBtn">新增</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table :height="tableHeight" :data="tableList" border stripe>
      <el-table-column align="center" label="姓名" prop="userName"></el-table-column>
      <el-table-column align="center" label="电话" prop="phone"></el-table-column>
      <el-table-column align="center" label="栋数" prop="buildName"></el-table-column>
      <el-table-column align="center" label="单元" prop="unitName"></el-table-column>
      <el-table-column align="center" label="房屋编号" prop="houseNum"></el-table-column>
      <el-table-column align="center" label="缴费金额" prop="payWaterMoney"></el-table-column>
      <el-table-column align="center" label="所属月份" prop="payWaterMonth"></el-table-column>
      <el-table-column align="center" label="表显" prop="waterNum"></el-table-column>
      <el-table-column align="center" prop="payPowerStatus" label="缴费状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.payWaterStatus === '0'" type="danger" size="small"
          >未缴费</el-tag
          >
          <el-tag v-if="scope.row.payWaterStatus === '1'" type="success" size="small"
          >已缴费</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column align="center" width="160" label="缴费时间" prop="payWaterTime"></el-table-column>
      <el-table-column width="270" align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-edit"
            type="primary"
            size="small"
            @click="editBtn(scope.row)"
          >编辑</el-button
          >
          <el-button
            icon="el-icon-delete"
            type="danger"
            size="small"
            @click="deleteBtn(scope.row)"
          >删除</el-button
          >
          <el-button
            icon="el-icon-delete"
            type="warning"
            size="small"
            @click="payBtn(scope.row)"
          >缴费</el-button
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
    <!-- 弹框 -->
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
            <el-select v-model="addModel.unitId" @change="unitSelect">
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
          <el-form-item prop="payWaterMonth" label="所属月份">
            <el-date-picker
              format="yyyy-MM"
              value-format="yyyy-MM"
              v-model="addModel.payWaterMonth"
              type="month"
              placeholder="选择月份"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="payWaterMoney" label="缴费金额" size="small">
            <el-input v-model="addModel.payWaterMoney"></el-input>
          </el-form-item>
          <el-form-item
            style="margin-left: 15px"
            prop="waterNum"
            label="表显"
            size="small"
          >
            <el-input v-model="addModel.waterNum"></el-input>
          </el-form-item>
          <el-form-item v-if="addModel.editType === '0'" prop="payWaterStatus" label="缴费状态" size="small">
            <el-radio-group v-model="addModel.payWaterStatus">
              <el-radio :label="'0'">未缴费</el-radio>
              <el-radio :label="'1'">已缴费</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </template>
    </sys-dialog>
  </el-main>
</template>

<script>
  import { getListApi, getHouseListByUnitId, addApi,editApi,deleteApi,payApi } from "@/api/feeWater";
  import { getBuildListApi, getUnitListByBuildId } from "@/api/houseList";
  import SysDialog from "@/components/System/SysDialog.vue";
  export default {
    components: {
      SysDialog,
    },
    data() {
      return {
        //房屋编号列表
        houseList: [],
        //单元列表
        unitList: [],
        //栋数列表
        buildList: [],
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
          payWaterMonth: [
            {
              trigger: "change",
              required: true,
              message: "请选择所属月份",
            },
          ],
          payWaterMoney: [
            {
              trigger: "change",
              required: true,
              message: "请填写缴费金额",
            },
          ],
          waterNum: [
            {
              trigger: "change",
              required: true,
              message: "请填写表显",
            },
          ],
          payWaterStatus: [
            {
              trigger: "change",
              required: true,
              message: "请选择缴费状态",
            },
          ],
        },
        //新增弹框绑定数据域
        addModel: {
          editType: "",
          waterId: "",
          buildId: "",
          unitId: "",
          houseId: "",
          payWaterMonth: "",
          payWaterMoney: "",
          waterNum: "",
          payWaterStatus: "",
        },
        //弹框属性
        addDialog: {
          title: "",
          height: 250,
          width: 650,
          visible: false,
        },
        //表格高度
        tableHeight: 0,
        //页数改变时触发
        currentChange(val) {},
        //页容量改变时触发
        sizeChange(val) {},
        //表格参数
        tableList: [],
        //表格参数
        params: {
          total: 0,
          currentPage: 1,
          pageSize: 10,
          userName: "",
          houseNum: "",
        },
      };
    },
    created() {
      this.getList();
      this.getBuildList();
    },
    mounted() {
      this.$nextTick(() => {
        this.tableHeight = window.innerHeight - 210;
      });
    },
    methods: {
      //单元点击事件
      async unitSelect(val) {
        this.addModel.houseId = "";
        this.getHouseByUnitId(val);
      },
      //根据单元id查询房屋列表
      async getHouseByUnitId(val) {
        let res = await getHouseListByUnitId({ unitId: val });
        if (res && res.code === 200) {
          this.houseList = res.data;
        }else {
          this.$message.error(res.msg);
        }
      },
      //根据栋数id查询单元列表
      async getUnitListById(val) {
        let res = await getUnitListByBuildId({ buildId: val });
        if (res && res.code === 200) {
          this.unitList = res.data;
        }else {
          this.$message.error(res.msg);
        }
      },
      //栋数点击事件
      selectBuild(val) {
        this.addModel.unitId = "";
        this.addModel.houseId = "";
        this.getUnitListById(val);
      },
      //获取栋数列表
      async getBuildList() {
        let res = await getBuildListApi();
        if (res && res.code === 200) {
          //把栋数赋值到列表
          this.buildList = res.data;
        }else {
          this.$message.error(res.msg);
        }
      },
      //弹框确定事件
      onConfirm() {
        this.$refs.addForm.validate(async (valid) => {
          if (valid) {
            let res = null;
            if (this.addModel.editType === "0") {
              res = await addApi(this.addModel);
            }else if (this.addModel.editType === "1"){
              res = await editApi(this.addModel);
            }
            if (res && res.code === 200) {
              //刷新表格
              this.getList();
              this.addDialog.visible = false;
              //信息提示
              this.$message.success(res.msg);
            }else {
              if (res) {
                this.$message.error(res.msg);
              } else {
                this.$message.error("请求失败，请重试/联系管理员重试");
              }
            }
          }
        });
      },
      //弹框关闭事件
      onClose() {
        this.addDialog.visible = false;
      },
      //缴费按钮
      async payBtn(row) {
        if (row.payWaterStatus === '1'){
          this.$message.warning("已缴费，无需再次缴费");
          return;
        }
        //提示信息
        const confirm = await this.$myconfirm('确定缴费吗？');
        if (confirm) {

          let param = {
            waterId: row.waterId,
            payWaterStatus: "1",
          };
          let res = await payApi(param);
          if (res && res.code === 200) {
            this.$message.success(res.msg);
            //刷新列表
            this.getList()
          }else {
            this.$message.error(res.msg);
          }
        }
      },
      //删除按钮
      async deleteBtn(row) {
        //信息提示
        let confirm = await this.$myconfirm('确定删除该数据吗?');
        if(confirm){
          let res = await deleteApi({waterId:row.waterId});
          if(res && res.code === 200){
            //刷新列表
            this.getList();
            //信息提示
            this.$message.success(res.msg)
          }else {
            this.$message.error(res.msg);
          }
        }
      },
      //编辑按钮
      editBtn(row) {
        //2.根据栋数的id查询单元列表
        this.getUnitListById(row.buildId);
        //3.根据单元id查询房屋列表
        this.getHouseByUnitId(row.unitId);
        //清空表单
        this.$resetForm('addForm',this.addModel);
        //设置弹框属性
        this.addDialog.title = '编辑水费';
        this.addDialog.visible = true;
        //把当前要编辑的行复制到表单数据域
        this.$objCopy(this.addModel,row);
        //设置编辑属性
        this.addModel.editType = '1';
      },
      //   新增按钮
      addBtn() {
        //清空表单
        this.$resetForm("addForm", this.addModel);
        //设置编辑属性
        this.addModel.editType = "0";
        //设置弹框属性
        this.addDialog.title = "新增水费";
        this.addDialog.visible = true;
      },
      //重置按钮
      resetBtn() {
        //把搜索框的数据清空
        this.params.userName = '';
        this.params.houseNum = '';
        this.getList();
      },
      //搜索按钮
      searchBtn() {
        this.getList();
      },
      //获取表格列表
      async getList() {
        let res = await getListApi(this.params);
        if (res && res.code === 200) {
          this.tableList = res.data.records;
          this.params.total = res.data.total;
        }else {
          this.$message.error(res.msg);
        }
      },
    },
  };
</script>

<style lang="scss" scoped></style>
