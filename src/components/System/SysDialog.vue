<template>
  <el-dialog
    append-to-body
    top='1vh'
    :title="title"
    :visible="visible"
    :width="width + 'px'"
    :before-close="onClose"
  >
    <div class="container" :style="{ height: height + 'px' }">
      <slot name="content"></slot>
    </div>
    <el-dialog
      top='1vh'
      :width="width + 'px'"
      center
      :title="validErrorOjb.msg"
      :visible="innerVisible"
      :before-close="onClose"
      append-to-body
      custom-class="inner-el-dialog__header">
      <template>
        <div v-if="validErrorOjb.data">
          <h3 v-for="(key,value) in validErrorOjb.data" >
            <span>{{value}}</span>:<span>{{key}}</span>
          </h3>
        </div>
      </template>
    </el-dialog>

    <span slot="footer" class="dialog-footer">
      <el-button type="danger" @click="onClose()">取 消</el-button>
      <el-button type="primary" @click="onConfirm()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    name: "SysDialog",
    data() {
      return {
        innerVisibleStatus:true
      }
    },

    props: {
      title: {
        type: String,
        default: "标题",
      },
      visible: {
        type: Boolean,
        default: false,
      },
      width: {
        type: Number,
        default: 600,
      },
      height: {
        type: Number,
        default: 250,
      },
      innerVisible: {
        type: Boolean,
        default: false,
      },
      validErrorOjb: {
        type: Object,
        default() {
          return {}
        }
      }
    },

    components: {},

    computed: {},

    watch: {},

    created() {

    },

    mounted() {

    },

    methods: {

      //关闭事件
      onClose() {
        this.$emit("onClose",this.validErrorOjb.code);
      },
      //确认事件
      onConfirm() {
        this.$emit("onConfirm");
      },
    }
  }
</script>

<style scoped lang="scss">
  .container {
    overflow-x: initial;
    overflow-y: auto;
  }

  .el-dialog__wrapper {

    ::v-deep .el-dialog {
      border-top-left-radius: 7px;
      border-top-right-radius: 7px;

      .el-dialog__header {
        border-top-left-radius: 7px;
        border-top-right-radius: 7px;
        background-color: #1890ff;

        .el-dialog__title {
          color: #fff;
          font-size: 16px;
          font-weight: 600;
        }

        .el-dialog__close {
          color: #fff;
        }
      }

      .el-dialog__body {
        padding: 10px;
      }

      .el-dialog__footer {
        border-top: 1px solid #e8eaec !important;
        padding: 10px;
      }
    }

    ::v-deep .inner-el-dialog__header{
      .el-dialog__header{
        background-color: #ff4334;
      }

    }
  }
</style>
