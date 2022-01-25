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
      <el-form-item label="车位名称">
        <el-input v-model="params.parkName" placeholder="请输入车位名称"></el-input>
      </el-form-item>
      <el-form-item label="车位类型">
        <el-select v-model="params.parkType">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="使用状态">
        <el-select v-model="params.parkStatus">
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click="searchBtn">查询</el-button>
        <el-button style="color: #ff7670" icon="el-icon-close" @click="resetBtn"
        >重置</el-button
        >
        <el-button icon="el-icon-plus" type="primary" @click="addBtn">新增</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格列表 -->
    <el-table :height="tableHeight" :data="tableList" border stripe>
      <el-table-column align="center" prop="parkName" label="车位名称"></el-table-column>
      <el-table-column align="center" prop="parkType" label="车位类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.parkType === '0'" type="danger" size="small"
          >地上</el-tag
          >
          <el-tag v-if="scope.row.parkType === '1'" type="success" size="small"
          >地下</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column align="center" prop="parkName" label="使用状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.parkStatus === '0'" type="danger" size="small"
          >未使用</el-tag
          >
          <el-tag v-if="scope.row.parkStatus === '1'" type="success" size="small"
          >已使用</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column align="center" prop="parkNum" label="序号"></el-table-column>
      <el-table-column align="center" width="180" label="操作">
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
      :page-sizes="[10, 20, 40, 80, 100]"
      :page-size="params.pageSize"
      layout="total, sizes, prev, pager, next"
      :total="params.total"
      background
    >
    </el-pagination>
    <!-- 定义弹框 -->
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
          <el-form-item prop="parkName" label="车位名称">
            <el-input v-model="addModel.parkName"></el-input>
          </el-form-item>
          <el-form-item prop="parkType" label="车位类型">
            <el-select v-model="addModel.parkType">
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="addModel.editType === '0'" prop="parkStatus" label="使用状态">
            <el-select v-model="addModel.parkStatus">
              <el-option
                v-for="item in useOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="车位序号">
            <el-input v-model="addModel.parkNum"></el-input>
          </el-form-item>
        </el-form>
      </template>
    </sys-dialog>
  </el-main>
</template>

<script>
    import {getParkListApi,addParkListApi,editParkListApi,deleteParkListApi} from "../../api/parkList";
    import SysDialog from "../../components/System/SysDialog";
    export default {
        name: "parkList",
        data() {
            return {
              //车位使用状态
              useOptions: [
                {
                  value: "0",
                  label: "未使用",
                },
                {
                  value: "1",
                  label: "已使用",
                },
              ], //表单验证
              rules: {
                parkName: [
                  {
                    trigger: "change",
                    required: true,
                    message: "请填写车位名称",
                  },
                ],
                parkType: [
                  {
                    trigger: "change",
                    required: true,
                    message: "请选择车位类型",
                  },
                ],
                parkStatus: [
                  {
                    trigger: "change",
                    required: true,
                    message: "请选择使用状态",
                  },
                ],
              },
              //表单数据
              addModel: {
                editType: "", //0 新增 1：编辑
                parkId: "",
                parkType: "",
                parkName: "",
                parkStatus: "",
                parkNum: "",
              },
              //弹框属性
              addDialog: {
                title: "",
                height: 150,
                width: 620,
                visible: false,
              },
              //表格高度
              tableHeight: 0,
              statusOptions: [
                {
                  value: "0",
                  label: "未使用",
                },
                {
                  value: "1",
                  label: "已使用",
                },
              ],
              typeOptions: [
                {
                  value: "0",
                  label: "地上",
                },
                {
                  value: "1",
                  label: "地下",
                },
              ],
              //表格数据
              tableList: [],
              //查询参数
              params: {
                currentPage: 1,
                pageSize: 10,
                parkName: "",
                parkStatus: "",
                parkType: "",
                total: 0,
              },
            }
        },

        props: {},

        components: {SysDialog},

        computed: {},

        watch: {},

        created() {
          this.getParkList();
        },

        mounted() {
          this.$nextTick(()=>{
            this.tableHeight = window.innerHeight -210
          });
        },

        methods: {
          //弹框确认
          onConfirm() {
            this.$refs.addForm.validate(async (valid) => {
              if (valid) {
                let res = null;
                // 数据提交
                if (this.addModel.editType === "0") {
                  res = await addParkListApi(this.addModel);
                }else if (this.addModel.editType === "1") {
                  res = await editParkListApi(this.addModel);
                }
               if (res && res.code === 200) {
                  this.$message.success(res.msg);
                  this.addDialog.visible = false;
                  //刷新表格
                  this.getParkList();
                }else {
                  if (res){
                    this.$message.error(res.msg)
                  }else {
                    this.$message.error("请求失败，请重试/联系管理员")
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
            this.getParkList();
          },
          //页容量改变时触发
          sizeChange(val) {
            this.params.pageSize = val;
            this.getParkList();
          },
          async deleteBtn(row) {
            const confirm = await this.$myconfirm("确认删除该数据吗");
            if (confirm) {
              let res = await deleteParkListApi({parkId: row.parkId});
              if (res && res.code === 200) {
                this.$message.success(res.msg);
                this.getParkList();
              }else {
                this.$message.error(res.msg);
              }
            }
          },
          //编辑按钮
          editBtn(row) {
            //清空表单
            this.$resetForm("addForm", this.addModel);
            //设置设置编辑标识
            this.addModel.editType = "1";
            //设置弹框属性
            this.addDialog.title = "编辑车位";
            this.addDialog.visible = true;
            this.$objCopy(this.addModel,row)
          },
          //新增按钮
          addBtn() {
            //清空表单
            this.$resetForm("addForm", this.addModel);
            //设置设置编辑标识
            this.addModel.editType = "0";
            //设置弹框属性
            this.addDialog.title = "新增车位";
            this.addDialog.visible = true;
          },
          //重置按钮
          resetBtn() {
            this.params.currentPage = 1;
            this.params.parkName = "";
            this.params.parkStatus = "";
            this.params.parkType = "";
            this.getParkList();
          },
          // 搜索按钮
          searchBtn() {
            this.getParkList();
          },
          //获取列表
          async getParkList() {
            let res = await getParkListApi(this.params);
            if (res && res.code === 200) {
              //把返回值赋值给表格
              this.tableList = res.data.records;
              this.params.total = res.data.total;
            }else {
              this.$message.error(res.msg)
            }
          },
        }
    }
</script>

<style scoped lang="less">

</style>
