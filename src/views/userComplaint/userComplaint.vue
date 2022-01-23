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
      <el-form-item label="内容">
        <el-input v-model="params.complaintContent"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click="searchBtn">查询</el-button>
        <el-button style="color: #ff7670" @click="resetBtn" icon="el-icon-close"
        >重置
        </el-button
        >
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table :height="tableHeight" :data="tableList" border stripe>
      <el-table-column align="center" label="标题" prop="title"></el-table-column>
      <el-table-column align="center" label="内容" prop="complaintContent"></el-table-column>
      <el-table-column align="center" label="处理状态" prop="status">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === '1'" type="success" size="small"
          >已处理
          </el-tag
          >
          <el-tag v-if="scope.row.status === '0'" type="danger" size="small"
          >未处理
          </el-tag
          >
        </template>
      </el-table-column>
      <el-table-column width="280" align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="small"
            @click="doBtn(scope.row)"
          >处理
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
  import {getListApi, editApi,} from "../../api/userComplaint.js";

  export default {
    name: "userComplaint",
    data() {
      return {
        //表格高度
        tableHeight: 0,
        //表格数据
        tableList: [],
        //列表查询参数
        params: {
          currentPage: 1,
          pageSize: 10,
          title: "",
          complaintContent: "",
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
    },

    mounted() {
      this.$nextTick(() => {
        this.tableHeight = window.innerHeight - 210;
      });
    },

    methods: {
      //处理按钮
      async doBtn(row) {
        if (row.status === "1"){
          this.$message.warning("该投诉已处理");
          return
        }
        let params = row;
        const confirm = await this.$myconfirm("确定处理该投诉吗?");
        if (confirm) {
          params.status = "1";
          let res = await editApi(params);
          if (res && res.code === 200) {
            //刷新表格
            this.getList();
            this.$message.success("处理成功");
          } else {
            this.$message.error(res.msg);
          }
        }
      },
      //重置按钮
      resetBtn() {
        this.params.title = "";
        this.params.complaintContent = "";
        this.getList();
      },
      //搜索按钮
      searchBtn() {
        this.getList();
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
      //获取列表
      async getList() {
        let res = await getListApi(this.params);
        if (res && res.code === 200) {
          //把返回的数据放到表格
          this.tableList = res.data.records;
          this.params.total = res.data.total;
        } else {
          this.$message.error(res.msg);
        }
      },
    }
  }
</script>

<style scoped lang="less">

</style>
