<template>
  <el-main>
    <!-- 搜索框 -->
    <el-form
      :model="param"
      ref="searchForm"
      label-width="80px"
      :inline="true"
      size="small"
    >
      <el-form-item label="栋数名称">
        <el-input v-model="param.buildName"></el-input>
      </el-form-item>
      <el-form-item label="栋数类型">
        <el-select v-model="param.type" placeholder="" clearable filterable>
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
        <el-button icon="el-icon-search" @click="searchBtn">查询</el-button>
        <el-button style="color: #ff7670" icon="el-icon-close" @click="resetBtn">重置</el-button>
        <el-button icon="el-icon-plus" type="primary" @click="addBtn">新增</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格列表 -->
    <el-table :height="tableHeight" :data="tableList" border stripe>
      <el-table-column align="center" prop="buildName" label="栋数名称"></el-table-column>
      <el-table-column align="center" prop="type" label="栋数类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === '0'" type="success" size="small">普通房</el-tag>
          <el-tag v-if="scope.row.type === '1'" type="danger" size="small">电梯房</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" width="180" label="操作">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-edit"
            type="primary"
            @click="editBtn(scope.row)"
            size="small"
          >编辑</el-button
          >
          <el-button
            icon="el-icon-delete"
            type="danger"
            @click="deleteBtn(scope.row)"
            size="small"
          >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="sizeChange"
      @current-change="currentChange"
      :current-page.sync="param.currentPage"
      :page-sizes="[10, 20, 40, 80, 100]"
      :page-size="param.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="param.total"
      background
    >
    </el-pagination>
    <!-- 新增栋数弹框 -->
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
          ref="addRef"
          :rules="rules"
          label-width="80px"
          :inline="true"
          size="small"
        >
          <el-form-item prop="name" label="栋数名称">
            <el-input v-model="addModule.buildName"></el-input>
          </el-form-item>
          <el-form-item prop="type" label="栋数类型">
            <el-select v-model="addModule.type">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="栋数序号">
            <el-input v-model="addModule.orderNum"></el-input>
          </el-form-item>
        </el-form>
      </template>
    </sys-dialog>
  </el-main>
</template>

<script>
    import {getListApi,addApi,deleteApi,editApi} from "@/api/houseBuilding";
    import SysDialog from "../../components/System/SysDialog";
    export default {
        name: "houseBuilding",
        data() {
            return {
              //表单验证规则
              rules: {
                buildName: [
                  {
                    trigger: "change",
                    required: true,
                    message: "请填写栋数名称",
                  },
                ],
                type: [
                  {
                    trigger: "change",
                    required: true,
                    message: "请选择栋数类型",
                  },
                ]
              },
              //新增或编辑表单数据
              addModule: {
                buildId: "",
                editType: "", //0新增 1：编辑
                type: "", //0：普通房 1：电梯房
                buildName: "",
                orderNum: "",
              },
              //定义弹框属性
              addDialog: {
                title: "",
                height: 200,
                width: 630,
                visible: false,
              },
              //表格高度
              tableHeight: 0,
              options: [
                {
                  value: "0",
                  label: "普通房",
                },
                {
                  value: "1",
                  label: "电梯房",
                },
              ],
              //存放列表的数据
              tableList: [],
              //获取列表的参数
              param: {
                buildName: "",
                type: "",
                pageSize: 10,
                currentPage: 1,
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
          //新增或编辑确认事件
          onConfirm() {
            this.$refs.addRef.validate(async valid=>{
              if(valid){
                let res = null;
                if(this.addModule.editType === '0'){
                  res = await addApi(this.addModule);
                }else if(this.addModule.editType === '1'){
                  res = await editApi(this.addModule);
                }
                if(res && res.code === 200){
                  //提示信息
                  this.$message.success(res.msg);
                  //关闭弹框、
                  this.addDialog.visible = false;
                  //刷新表格
                  this.getList();
                }else {
                  if (res){
                    this.$message.error(res.msg);
                  }else {
                    this.$message.error("请求失败，请重试/联系管理员");
                  }
                }
              }
            })
            // this.addDialog.visible = false;
          },
          //新增或编辑关闭
          onClose() {
            this.addDialog.visible = false;
          },
          //新增按钮
          addBtn() {
            //清空表单
            this.$resetForm("addRef", this.addModule);
            //设置弹框属性
            this.addModule.editType = '0'; //标识新增
            this.addDialog.title = "新增栋数";
            this.addDialog.visible = true;
          },
          //重置按钮
          resetBtn() {
            this.param.buildName = "";
            this.param.type = "";
            this.getList();
          },
          //页容量改变时触发
          sizeChange(val) {},
          //页数改变时触发
          currentChange(val) {},
          //删除按钮
          async deleteBtn(row) {
            //先提示，不能直接删除
            const confirm = await this.$myconfirm("确定删除该数据吗？");
            if (confirm) {
              let res = await deleteApi({ buildId: row.buildId });
              if (res && res.code === 200) {
                //提示信息
                this.$message.success(res.msg);
                //刷新表格
                this.getList();
              }else {
                this.$message.error(res.msg);
              }
            }
          },
          //编辑按钮
          editBtn(row) {
            //清空表单
            this.$resetForm("addRef", this.addModule);
            //设置编辑状态
            this.addModule.editType = "1";
            //设置弹框属性
            this.addDialog.title = "编辑栋数";
            this.addDialog.visible = true;
            //设置需要编辑的数据
            this.$objCopy(this.addModule,row);
          },
          //搜索按钮
          searchBtn() {
            this.getList();
          },
          //获取栋数列表
          async getList() {
            let res = await getListApi(this.param);
            if (res && res.code === 200) {
              this.tableList = res.data.records;
              this.param.total = res.data.total;
            }else {
              this.$message.error("列表数据获取失败，请联系管理员");
            }
          },
        }
    }
</script>

<style scoped lang="less">

</style>
