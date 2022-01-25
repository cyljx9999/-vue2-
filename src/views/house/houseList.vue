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
      <el-form-item label="栋数名称">
        <el-input placeholder="请输入栋数名称" v-model="params.buildName"></el-input>
      </el-form-item>
      <el-form-item label="单元名称">
        <el-input placeholder="请输入单元名称" v-model="params.unitName"></el-input>
      </el-form-item>
      <el-form-item label="房屋编号">
        <el-input placeholder="请输入房屋编号" v-model="params.houseNum"></el-input>
      </el-form-item>
      <el-form-item label="使用状态">
        <el-select v-model="params.status">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click="searchBtn">搜索</el-button>
        <el-button style="color: #ff7670" icon="el-icon-close" @click="resetBtn"
        >重置
        </el-button
        >
        <el-button icon="el-icon-plus" type="primary" @click="addBtn">新增</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table :height="tableHeight" :data="tableList" border stripe>
      <el-table-column align="center" prop="buildName" label="栋数名称"></el-table-column>
      <el-table-column align="center" prop="unitName" label="单元名称"></el-table-column>
      <el-table-column align="center" prop="houseNum" label="房屋编号"></el-table-column>
      <el-table-column align="center" prop="houseArea" label="使用面积"></el-table-column>
      <el-table-column align="center" prop="status" label="使用状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === '0'" type="danger" size="small"
          >未使用
          </el-tag
          >
          <el-tag v-if="scope.row.status === '1'" type="success" size="small"
          >已使用
          </el-tag
          >
        </template>
      </el-table-column>
      <el-table-column align="center" width="180" label="操作">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-edit"
            type="primary"
            size="small"
            @click="editBtn(scope.row)"
          >编辑
          </el-button>
          <el-button
            icon="el-icon-delete"
            type="danger"
            size="small"
            @click="deleteBtn(scope.row)"
          >删除
          </el-button>
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

    <!-- 新增弹框 -->
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
          :model="addModule"
          ref="addForm"
          :rules="rules"
          label-width="80px"
          :inline="true"
          size="small"
        >
          <el-form-item prop="buildId" label="所属栋数">
            <el-select v-model="addModule.buildId" @change="selectBuild">
              <el-option
                v-for="item in buildList"
                :key="item.buildId"
                :label="item.buildName"
                :value="item.buildId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="unitId" label="所属单元">
            <el-select v-model="addModule.unitId">
              <el-option
                v-for="item in unitList"
                :key="item.unitId"
                :label="item.unitName"
                :value="item.unitId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="houseNum" label="房屋编号">
            <el-input
              v-model="addModule.houseNum"
              placeholder="请输入房屋编号"
              size="small"
            ></el-input>
          </el-form-item>
          <el-form-item prop="houseArea" style="margin-left: 15px" label="使用面积">
            <el-input
              v-model="addModule.houseArea"
              placeholder="请输入使用面积"
              size="small"
            ></el-input>
          </el-form-item>
          <el-form-item v-if="addModule.editType === '0'" prop="status" label="使用状态" size="normal">
            <el-radio-group v-model="addModule.status">
              <el-radio :label="'0'">未使用</el-radio>
              <el-radio :label="'1'">已使用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </template>
    </sys-dialog>
  </el-main>
</template>

<script>
  import {
    getListApi,
    getBuildListApi,
    addHouseApi,
    getUnitListByBuildId,
    editHouseApi,
    deleteHouseApi
  } from "../../api/houseList.js";
  import SysDialog from "../../components/System/SysDialog";

  export default {
    name: "sysHouseList",
    data() {
      return {
        //单元列表
        unitList: [],
        //栋数列表
        buildList: [],
        rules: {
          buildValue: [
            {
              trigger: "change",
              required: true,
              message: "请选择所属栋数",
            },
          ],
          unitId: [
            {
              trigger: "change",
              required: true,
              message: "请选择所属单元",
            },
          ],
          houseNum: [
            {
              trigger: "change",
              required: true,
              message: "请填写房屋编号",
            },
          ],
          houseArea: [
            {
              trigger: "change",
              required: true,
              message: "请填写使用面积",
            },
          ],
          status: [
            {
              trigger: "change",
              required: true,
              message: "请选择使用状态",
            },
          ],
        },
        //新增或编辑数据
        addModule: {
          editType: "",
          houseId: "",
          unitId: "",
          houseNum: "",
          houseArea: "",
          status: "",
          buildId: "",
        },
        //弹框属性
        addDialog: {
          title: "",
          height: 200,
          width: 650,
          visible: false,
        },
        //表格高度
        tableHeight: 0,
        //使用状态
        options: [
          {
            value: "0",
            label: "未使用",
          },
          {
            value: "1",
            label: "已使用",
          },
        ],
        //表格数据
        tableList: [],
        //列表参数，搜索框绑定的数据域
        params: {
          buildName: "",
          status: "",
          unitName: "",
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
      this.getList();
      this.getBuildList();
    },

    mounted() {
      this.$nextTick(() => {
        this.tableHeight = window.innerHeight - 210;
      });
    },

    methods: {
      //选择栋数触发事件
      selectBuild(val) {
        console.log(val)
        //清空原来的数据
        this.addModule.unitId = "";
        //根据栋数id查询对应的单元
        this.getUnitListByBuildId(val);
      },
      //弹框确认
      onConfirm() {
        this.$refs.addForm.validate(async (valid) => {
          if (valid) {
            let res = null;
            if (this.addModule.editType === "0") {
              res = await addHouseApi(this.addModule);
            }else if (this.addModule.editType === "1") {
              res = await editHouseApi(this.addModule);
            }
            if (res && res.code === 200) {
              //刷新表格
              this.getList();
              this.$message.success(res.msg);
              this.addDialog.visible = false;
            }else {
              if (res){
                this.$message.error(res.msg);
              }else {
                this.$message.error("请求失败，请重试/联系管理员");
              }
            }
          }
        });
      },
      //弹框关闭
      onClose() {
        this.addDialog.visible = false;
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
      //删除按钮
     async deleteBtn(row) {
        //信息提示
        const confirm = await this.$myconfirm("确定删除该数据吗?");
        if (confirm) {
          let res = await deleteHouseApi({ houseId: row.houseId });
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
      //编辑按钮
      editBtn(row) {
        console.log(row)
        //根据栋数id查询单元列表
        this.getUnitListByBuildId(row.buildId);
        //清空表单
        this.$resetForm("addForm", this.addModule);
        //设置弹框属性
        this.addDialog.title = "编辑房屋";
        this.addDialog.visible = true;

        //把当前编辑的行数据设置到表单数据域
        this.$objCopy(this.addModule,row);
        //设置编辑标志
        this.addModule.editType = "1";
        //栋数回显
        this.addModule.buildId = row.buildId;
      },
      //新增按钮
      addBtn() {
        //清空表单
        this.$resetForm("addForm", this.addModule);
        //设置编辑type
        this.addModule.editType = "0";
        //设置弹框属性
        this.addDialog.title = "新增房屋";
        this.addDialog.visible = true;
      },
      //重置按钮
      resetBtn() {
        this.params.buildName = '';
        this.params.unitName = '';
        this.params.status = '';
        this.params.houseNum = '';
        this.params.currentPage = 1;
        this.getList();
      },
      //搜索按钮
      searchBtn() {
        this.getList();
      },
      //获取房屋列表
      async getList() {
        let res = await getListApi(this.params);
        if (res && res.code === 200) {
          this.tableList = res.data.records;
          this.params.total = res.data.total;
        } else {
          this.$message.error(res.msg);
        }
      },
      //栋数列表
      async getBuildList() {
        let res = await getBuildListApi();
        if (res && res.code === 200) {
          //赋值给栋数列表
          this.buildList = res.data;
        }else {
          this.$message.error(res.msg);
        }
      },
      // //单元列表
      async getUnitListByBuildId(buildId) {
        let res = await getUnitListByBuildId({ buildId: buildId });
        if (res && res.code === 200) {
          //赋值给单元列表
          this.unitList = res.data;
        }else {
          this.$message.error(res.msg);
        }
      },
    }
  }
</script>

<style scoped lang="less">

</style>
