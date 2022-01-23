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
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table :height="tableHeight" :data="tableList" border stripe>
      <el-table-column align="center" label="报修内容" prop="repairContent"></el-table-column>
      <el-table-column align="center" label="报修地址" prop="repairAddress"></el-table-column>
      <el-table-column align="center" label="联系电话" prop="phone"></el-table-column>
      <el-table-column align="center" label="提交时间" prop="commitTime"></el-table-column>
      <el-table-column align="center" label="处理状态" prop="status">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === '1'" type="success" size="small"
          >已处理</el-tag
          >
          <el-tag v-if="scope.row.status === '0'" type="danger" size="small"
          >未处理</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column align="center" width="120" label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="small"
            @click="doBtn(scope.row)"
          >处理</el-button
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
  import { getListApi, editApi } from "@/api/repair";
  export default {
    data() {
      return {
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
      //处理
      async doBtn(row) {
        if(row.status ==='1'){
          this.$message.warning('该维修已经处理，不要重复处理!');
          return;
        }
        let confirm = await this.$myconfirm("确定处理该数据吗?");
        if (confirm) {
          let param = row;
          param.status = "1";
          let res = await editApi(param);
          if (res && res.code === 200) {
            //刷新列表
            this.getMyList();
            this.$message.success('处理成功!');
          }else {
            this.$message.error(res.msg);
          }
        }
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
        let res = await getListApi(this.params);
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
