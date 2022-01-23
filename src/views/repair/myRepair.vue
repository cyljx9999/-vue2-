<template>
  <el-main>
    <!-- 搜索 -->
    <el-form
      :model="params"
      ref="searchParm"
      label-width="80px"
      :inline="true"
      size="small"
    >
      <el-form-item label="报修内容">
        <el-input v-model="params.repairContent"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click="searchBtn">查询</el-button>
        <el-button style="color: #ff7670" @click="resetBtn" icon="el-icon-close"
        >重置</el-button
        >
        <el-button icon="el-icon-plus" type="primary" @click="addBtn">新增</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table :height="tableHeight" :data="tableList" border stripe>
      <el-table-column label="报修内容" prop="repairContent"></el-table-column>
      <el-table-column label="报修地址" prop="repairAddress"></el-table-column>
      <el-table-column label="联系电话" prop="phone"></el-table-column>
      <el-table-column label="处理状态" prop="status">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === '1'" type="success" size="small"
          >已处理</el-tag
          >
          <el-tag v-if="scope.row.status === '0'" type="danger" size="small"
          >未处理</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column align="center" width="280" label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="small"
            @click="editBtn(scope.row)"
          >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="small"
            @click="deleteBtn(scope.row)"
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
          :model="addModel"
          ref="addForm"
          :rules="rules"
          label-width="80px"
          :inline="false"
          size="small"
        >
          <el-form-item prop="repairContent" label="维修内容">
            <el-input type="textarea" v-model="addModel.repairContent"></el-input>
          </el-form-item>
          <el-form-item prop="repairAddress" label="维修地点">
            <el-input v-model="addModel.repairAddress"></el-input>
          </el-form-item>
          <el-form-item prop="phone" label="联系电话">
            <el-input v-model="addModel.phone"></el-input>
          </el-form-item>
        </el-form>
      </template>
    </sys-dialog>
  </el-main>
</template>

<script>
  import { getMyListApi, addApi, editApi, deleteApi } from "@/api/repair";
  import { getUserId } from "@/utils/auth";
  import SysDialog from "@/components/System/SysDialog.vue";
  export default {
    components: {
      SysDialog,
    },
    data() {
      return {
        //表单验证规则
        rules: {
          repairContent: [
            {
              trigger: "change",
              required: true,
              message: "请填写维修内容",
            },
          ],
          repairAddress: [
            {
              trigger: "change",
              required: true,
              message: "请填写维修地址",
            },
          ],
          phone: [
            {
              trigger: "change",
              required: true,
              message: "请填写联系电话",
            },
          ],
        },
        //表单数据域
        addModel: {
          editType: "",
          repairId: "",
          userId: "",
          phone: "",
          repairAddress: "",
          repairContent: "",
        },
        //弹框属性定义
        addDialog: {
          title: "",
          height: 200,
          width: 650,
          visible: false,
        },
        //表格高度
        tableHeight: 0,
        //表格数据
        tableList: [],
        params: {
          total: 0,
          currentPage: 1,
          pageSize: 10,
          userId: "",
          repairContent: "",
        },
      };
    },
    created() {
      this.getMyList();
    },
    mounted() {
      this.$nextTick(() => {
        this.tableHeight = window.innerHeight - 210;
      });
    },
    methods: {
      //弹框确认事件
      onConfirm() {
        this.$refs.addForm.validate(async (valid) => {
          if (valid) {
            //设置用户id
            this.addModel.userId = getUserId();
            let res = null;
            if (this.addModel.editType === "0") {
              res = await addApi(this.addModel);
            } else if (this.addModel.editType === "1"){
              res = await editApi(this.addModel);
            }
            if (res && res.code === 200) {
              //刷新表格
              this.getMyList();
              //信息提示
              this.$message.success(res.msg);
              this.addDialog.visible = false;
            }else {
              if (res){
                this.$message.error(res.msg);
              }else {
                this.$message.error("请求失败，请联系管理员");
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
        this.getMyList();
      },
      //页容量改变时触发
      sizeChange(val) {
        this.params.pageSize = val;
        this.getMyList();
      },
      //删除按钮
      async deleteBtn(row) {
        //信息提示
        let confirm = await this.$myconfirm("确定删除该数据吗?");
        if (confirm) {
          let res = await deleteApi({ repairId: row.repairId });
          if (res && res.code === 200) {
            //刷新列表
            this.getMyList();
            this.$message.success(res.msg);
          }else {
            this.$message.error(res.msg);
          }
        }
      },
      //编辑按钮
      editBtn(row) {
        //清空表单
        this.$resetForm("addForm", this.addModel);
        //把当前要编辑的数据复制到表单数据域
        this.$objCopy(this.addModel,row);
        //设置编辑属性
        this.addModel.editType = "1";
        //设置弹框属性
        this.addDialog.title = "编辑维修";
        this.addDialog.visible = true;
      },
      //新增按钮
      addBtn() {
        //清空表单
        this.$resetForm("addForm", this.addModel);
        //设置编辑属性
        this.addModel.editType = "0";
        //设置弹框属性
        this.addDialog.title = "新增维修";
        this.addDialog.visible = true;
      },
      //重置按钮
      resetBtn() {
        this.params.repairContent = "";
        this.getMyList();
      },
      //搜索按钮
      searchBtn() {
        this.getMyList();
      },
      //获取列表
      async getMyList() {
        this.params.userId = getUserId();
        let res = await getMyListApi(this.params);
        if (res && res.code === 200) {
          this.tableList = res.data.records;
        }else {
          this.$message.error(res.msg);
        }
      },
    },
  };
</script>

<style lang="scss" scoped></style>
