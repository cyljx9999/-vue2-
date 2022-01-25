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
        <el-input v-model="params.buildName"></el-input>
      </el-form-item>
      <el-form-item label="单元名称">
        <el-input v-model="params.unitName"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click="searchBtn">查询</el-button>
        <el-button style="color: #ff7670" @click="resetBtn" icon="el-icon-close"
        >重置</el-button
        >
        <el-button type="primary" @click="addBtn" icon="el-icon-plus">新增</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table :height='tableHeight' :data="tableList" border stripe>
      <el-table-column align="center"  prop="buildName" label="栋数名称"></el-table-column>
      <el-table-column align="center"  prop="unitName" label="单元名称"></el-table-column>
      <el-table-column align="center"  width="180" label="操作">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit" type="primary" size="small" @click="editBtn(scope.row)"
          >编辑</el-button
          >
          <el-button icon="el-icon-delete" type="danger" size="small" @click="deleteBtn(scope.row)"
          >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="sizeChange"
      @current-change="currentChange"
      :current-page.sync="params.currentPage"
      :page-sizes="[10,20, 40, 80, 100]"
      :page-size="params.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="params.total" background>
    </el-pagination>
    <!-- 新增或编辑弹框 -->
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
          <el-form-item prop="buildId" label="单元名称">
            <el-select v-model="addModule.buildId">
              <el-option
                v-for="item in buildTableList"
                :key="item.buildId"
                :label="item.buildName"
                :value="item.buildId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="unitName" label="单元名称">
            <el-input v-model="addModule.unitName"></el-input>
          </el-form-item>
        </el-form>
      </template>
    </sys-dialog>
  </el-main>
</template>

<script>
  import {getListApi, getBuildListApi, addApi, editApi, deleteApi} from "@/api/houseUnit.js";
  import SysDialog from "../../components/System/SysDialog";
  export default {
    name: "unitList",
    data() {
      return {
        rules: {
          buildId: [
            {
              trigger: "change",
              required: true,
              message: "请选择栋数",
            },
          ],
          unitName: [
            {
              trigger: "change",
              required: true,
              message: "请填写单元名称",
            },
          ],
        },
        addModule: {
          editType: "",
          unitId: "",
          buildId: "",
          unitName: "",
        },
        buildTableList: [],
        //弹框属性
        addDialog: {
          title: "",
          height: 150,
          width: 620,
          visible: false,
        },
        //表格高度
        tableHeight: 0,
        //表格数据
        tableList: [],
        //列表查询参数
        params: {
          buildName: "",
          unitName: "",
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
      this.getBuildList()
    },

    mounted() {
      this.$nextTick(() => {
        this.tableHeight = window.innerHeight - 210
      })
    },

    methods: {
      //新增或编辑确认事件
      onConfirm() {
        this.$refs.addForm.validate(async (valid) => {
          if (valid) {
            let res = null;
            if (this.addModule.editType === "0") {
              res = await addApi(this.addModule);
            } else if (this.addModule.editType === "1"){
              res = await editApi(this.addModule);
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
      //新增或编辑关闭
      onClose() {
        this.addDialog.visible = false;
      },
      //页数改变时触发
      currentChange(val) {
        this.params.currentPage = val;
        this.getList();
      },
      //页容量改变时触发
      sizeChange(val) {
        this.params.pageSize = val;
        this.getList();
      },
      //删除按钮
      async deleteBtn(row) {
        const confirm = await this.$myconfirm('确定删除该数据吗？');
        if(confirm){
          let res = await deleteApi({unitId:row.unitId});
          if(res && res.code === 200){
            //刷新表格
            this.getList();
            this.$message.success(res.msg)
          }else {
            this.$message.error(res.msg)
          }
        }
      },
      //编辑按钮
      editBtn(row) {
        //清空表单
        this.$resetForm("addForm", this.addModule);
        //设置弹框属性
        this.addModule.editType = "1";
        this.addDialog.title = "编辑单元";
        this.addDialog.visible = true;
        //把当前要编辑的数据复制到数据域
        this.$objCopy(this.addModule,row);
      },
      //新增
      addBtn() {
        //清空表单
        this.$resetForm("addForm", this.addModule);
        this.addModule.editType = "0";
        //设置弹框属性
        this.addDialog.visible = true;
        this.addDialog.title = "新增单元";
        //
      },
      //重置
      resetBtn() {
        this.params.buildName = "";
        this.params.unitName = "";
        this.getList();
      },
      //搜索按钮
      searchBtn() {
        this.getList();
      },
      //获取列表
      async getList() {
        let res = await getListApi(this.params);
        if (res && res.code === 200) {
          this.tableList = res.data.records;
          this.params.total = res.data.total;
        }else {
          this.$message.error("请求失败，请重试")
        }
      },
      //获取栋数列表
      async getBuildList() {
        let res = await getBuildListApi();
        if (res && res.code === 200) {
          this.buildTableList = res.data;
        }else {
          this.$message.error("请求失败，请重试")
        }
      },
    },
  }
</script>

<style scoped lang="less">

</style>
