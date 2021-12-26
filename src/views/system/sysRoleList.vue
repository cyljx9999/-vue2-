<template>
  <el-main>
    <!-- 搜索表单 -->
    <el-form
      :model="params"
      ref="searchForm"
      label-width="80px"
      :inline="true"
      size="small"
    >
      <el-form-item label="角色名称">
        <el-input v-model="params.roleName"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click="searchBtn">查询</el-button>
        <el-button
          icon="el-icon-delete"
          style="color: #ff7670"
          @click="resetBtn"
        >重置</el-button
        >
        <el-button type="primary" icon="el-icon-plus" @click="addBtn"
        >新增</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 角色列表 -->
    <el-table :height="tableHeight" size="small" :data="roleList" border stripe>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="备注" prop="remark"></el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="sizeChange"
      @current-change="currentChange"
      :current-page.sync="params.currentPage"
      :page-sizes="[10, 20, 40, 80, 100]"
      :page-size="params.pageSize"
      :total="params.total"
      layout="total, sizes, prev, pager, next, jumper"
      background
    >
    </el-pagination>
  </el-main>
</template>

<script>
    import {getRoleListApi} from "@/api/role"
    export default {
        name: "sysRoleList",
        data() {
            return {
              //表格数据
              roleList: [],
              //表格的高度
              tableHeight: 0,
              //查询参数
              params:{
                pageSize: 10, //每页显示几条数据
                currentPage: 1, //当前第几页
                roleName: "",
                total: 0, //总条数
              }
            }
        },

        props: {},

        components: {},

        computed: {},

        watch: {},

        created() {
          this.getRoleLis();
        },

        mounted() {
          this.$nextTick(() => {
            this.tableHeight = window.innerHeight - 190;
          });
        },

        methods: {
          //页数改变时触发
          currentChange(val) {},
          //页容量改变时触发
          sizeChange(val) {},
          //新增按钮
          addBtn() {},
          //重置按钮
          resetBtn() {},
          //搜索按钮
          searchBtn() {},
          //获取角色列表
          async getRoleLis(){
            let res = await getRoleListApi(this.params);
            if (res.code === 200) {
              this.roleList = res.data.records;
              this.params.total = res.data.total;
            }
          }
        }
    }
</script>

<style scoped lang="less">

</style>
