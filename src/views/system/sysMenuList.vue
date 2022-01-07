<template>
    <el-main>
      <!--顶部新增按钮-->
      <el-form size="small">
        <el-form-item>
          <el-button type="primary" icon="el-icon-plus" @click="addMenu">新增</el-button>
        </el-form-item>
      </el-form>

      <!-- 新增或编辑弹框 -->
      <sys-dialog
        :title="dialog.title"
        :height="dialog.height"
        :width="dialog.width"
        :visible="dialog.visible"
        @onConfirm="onConfirm"
        @onClose="onClose"
      >
        <div slot="content">
          <el-form
            style="margin-left: 30px"
            :model="addModel"
            ref="addForm"
            :rules="rules"
            label-width="80px"
            :inline="true"
            size="small"
          >
            <el-row>
              <el-col :span="24">
                <el-form-item prop="type" label="菜单类型">
                  <el-radio-group v-model="addModel.type" size="small">
                    <el-radio :label="'0'">目录</el-radio>
                    <el-radio :label="'1'">菜单</el-radio>
                    <el-radio :label="'2'">按钮</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item prop="parentName" label="上级菜单">
              <el-input v-model="addModel.parentName" placeholder="请填写上级菜单"></el-input>
            </el-form-item>

            <el-form-item
              prop="menuLabel"
              label="菜单名称"
            >
              <el-input
                v-model="addModel.menuLabel"
                placeholder="请填写菜单名称"
              ></el-input>
            </el-form-item>

            <el-form-item
              v-if="addModel.type !== '2'"
              prop="icon"
              label="菜单图标"
            >
              <el-input
                v-model="addModel.icon"
                placeholder="请填写菜单图标"
              ></el-input>
            </el-form-item>


            <el-form-item
              v-if="addModel.type === '1'"
              prop="name"
              label="路由名称"
            >
              <el-input
                v-model="addModel.name"
                placeholder="请填写路由名称"
              ></el-input>
            </el-form-item>


            <el-form-item
              v-if="addModel.type === '1'"
              prop="path"
              label="路由地址"
            >
              <el-input
                v-model="addModel.path"
                placeholder="请填写路由地址"
              ></el-input>
            </el-form-item>


            <el-form-item
              v-if="addModel.type === '1'"
              prop="url"
              label="组件路径"
            >
              <el-input
                v-model="addModel.url"
                placeholder="请填写组件路径"
              ></el-input>
            </el-form-item>


            <el-form-item
              prop="menuCode"
              label="权限字段"
            >
              <el-input
                v-model="addModel.menuCode"
                placeholder="请填写权限字段"
              ></el-input>
            </el-form-item>


            <el-form-item label="权限备注">
              <el-input
                v-model="addModel.remark"
                placeholder="请填写权限备注"
              ></el-input>
            </el-form-item>


            <el-form-item label="权限序号">
              <el-input
                type="number"
                v-model="addModel.orderNum"
                placeholder="请填写权限序号"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
      </sys-dialog>

    </el-main>
</template>

<script>
    import {getMenuListApi} from "@/api/menu";
    import SysDialog from "@/components/System/SysDialog";

    export default {
        name: "sysMenuList",
        data() {
            return {
              //表单验证规则
              rules: {
                type: [
                  {
                    required: true,
                    trigger: "change",
                    message: "请选择菜单类型",
                  },
                ],
                parentName: [
                  {
                    required: true,
                    trigger: "change",
                    message: "请选择上级菜单",
                  },
                ],
                menuLabel: [
                  {
                    required: true,
                    trigger: "change",
                    message: "请填写菜单名称",
                  },
                ],
                icon: [
                  {
                    required: true,
                    trigger: "change",
                    message: "请填写图标",
                  },
                ],
                name: [
                  {
                    required: true,
                    trigger: "change",
                    message: "请填写路由名称",
                  },
                ],
                path: [
                  {
                    required: true,
                    trigger: "change",
                    message: "请填写路由地址",
                  },
                ],
                url: [
                  {
                    required: true,
                    trigger: "change",
                    message: "请填写组件路径",
                  },
                ],
                menuCode: [
                  {
                    required: true,
                    trigger: "change",
                    message: "请填写权限字段",
                  },
                ],
              },
              //新增或编辑数据绑定
              addModel: {
                editType: "",
                menuId: "",
                parentId: "",
                menuLabel: "",
                menuCode: "",
                name: "",
                path: "",
                url: "",
                type: "",
                icon: "",
                remark: "",
                parentName: "",
                orderNum: "",
              },
              //弹框属性
              dialog: {
                title: "",
                height: 310,
                width: 660,
                visible: false,
              },
              // 表格数据
              tableList:[]
            }
        },

        props: {},

        components: {
          SysDialog
        },

        computed: {},

        watch: {},

        created() {
          this.getMenuList()
        },

        mounted() {

        },

        methods: {
          //新增或编辑弹框确认事件
          onConfirm() {
            this.$refs.addForm.validate((valid) => {
              if (valid) {
                this.dialog.visible = false;
              }
            });
          },
          //新增或编辑弹框取消事件
          onClose() {
            this.dialog.visible = false;
          },
          // 新增按钮
          addMenu(){
            this.dialog.title = "新增菜单";
            this.addModel.editType = "0";
            this.dialog.visible = true;
          },
          //获取权限列表
          async getMenuList() {
            let res = await getMenuListApi();
            if (res && res.code === 200) {
                this.tableList = res.data
            }else {
              this.$message.error("列表数据获取失败，请联系管理员");
            }
          }
        }
    }
</script>

<style scoped lang="less">

</style>
