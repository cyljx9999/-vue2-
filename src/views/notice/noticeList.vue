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
      <el-form-item label="标题">
        <el-input v-model="params.title"></el-input>
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
      <el-table-column align="center" label="标题" prop="title"></el-table-column>
      <el-table-column align="center" label="内容" prop="noticeContent"></el-table-column>
      <el-table-column align="center" label="时间" prop="createTime"></el-table-column>
      <el-table-column align="center" width="180" label="操作">
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
    <!-- 弹框定义 -->
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
          <el-form-item prop="title" label="标题">
            <el-input v-model="addModel.title"></el-input>
          </el-form-item>
          <el-form-item prop="noticeContent" label="内容">
            <el-input type="textarea" v-model="addModel.noticeContent"></el-input>
          </el-form-item>
        </el-form>
      </template>
    </sys-dialog>
  </el-main>
</template>

<script>
  import { getListApi, addApi, editApi, deleteApi } from "@/api/notice";
  import SysDialog from "@/components/System/SysDialog.vue";
  export default {
    components: {
      SysDialog,
    },
    data() {
      return {
        //表单验证规则
        rules: {
          title: [
            {
              trigger: "change",
              required: true,
              message: "请填标题",
            },
          ],
          noticeContent: [
            {
              trigger: "change",
              required: true,
              message: "请填写公告内容",
            },
          ],
        },
        //表单绑定的数据域
        addModel: {
          editType: "",
          noticeId: "",
          userId: "",
          title: "",
          noticeContent: "",
        },
        //设置弹框属性
        addDialog: {
          title: "",
          height: 180,
          width: 620,
          visible: false,
        },
        //表格高度
        tableHeight: 0,
        //表格数据
        tableList: [],
        params: {
          currentPage: 1,
          pageSize: 10,
          title: "",
          total: 0,
        },
      };
    },
    created() {
      this.getList();
    },
    mounted() {
      this.$nextTick(() => {
        this.tableHeight = window.innerHeight - 210;
      });
    },
    methods: {
      //弹框确定事件
      onConfirm() {
        this.$refs.addForm.validate(async (valid) => {
          if (valid) {
            let res = null;
            if (this.addModel.editType === "0") {
              res = await addApi(this.addModel);
            } else {
              res = await editApi(this.addModel);
            }
            if (res && res.code === 200) {
              //刷新列表
              this.getList();
              this.$message.success(res.msg);
              this.addDialog.visible = false;
            }else {
              this.$message.error(res.msg)
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
      //页容量改变时触发
      sizeChange(val) {
        this.params.pageSize = val;
        this.getList();
      },
      //删除按钮
      async deleteBtn(row) {
        //信息提示
        let confirm = await this.$myconfirm("确定删除该数据吗?");
        if (confirm) {
          let res = await deleteApi({ noticeId: row.noticeId });
          if (res && res.code === 200) {
            //刷新列表
            this.getList();
            this.$message.success(res.msg);
          }else {
            this.$message.error(res.msg)
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
        this.addDialog.title = "编辑公告";
        this.addDialog.visible = true;
      },
      //新增按钮
      addBtn() {
        //清空表单
        this.$resetForm("addForm", this.addModel);
        //设置编辑属性
        this.addModel.editType = "0";
        //设置弹框属性
        this.addDialog.title = "新增公告";
        this.addDialog.visible = true;
      },
      //重置按钮
      resetBtn() {
        this.params.title = "";
        this.getList();
      },
      //查询按钮
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
          this.$message.error(res.msg)
        }

      },
    },
  };
</script>

<style lang="scss" scoped></style>
