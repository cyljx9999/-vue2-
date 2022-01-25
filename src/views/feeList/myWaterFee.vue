<template>
  <el-main>
    <!-- 表格 -->
    <el-table :height="tableHeight" :data="tableList" border stripe>
      <el-table-column prop="payWaterMonth" label="缴费月份"></el-table-column>
      <el-table-column prop="payWaterMoney" label="缴费金额"></el-table-column>
      <el-table-column prop="payWaterStatus" label="缴费状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.payWaterStatus === '0'" type="danger" size="normal"
            >未缴费</el-tag
          >
          <el-tag v-if="scope.row.payWaterStatus === '1'" type="success" size="normal"
            >已缴费</el-tag
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
import { getMyWaterFeeApi } from "@/api/myFee";
import { getUserId } from "@/utils/auth";
export default {
  data() {
    return {
      //表格高度
      tableHeight: 0,
      //表格数据
      tableList: [],
      params: {
        currentPage: 1,
        pageSize: 10,
        userId: getUserId(),
        total: 0,
      },
    };
  },
  created() {
    this.getList();
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 200;
    });
  },
  methods: {
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
      let res = await getMyWaterFeeApi(this.params);
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
