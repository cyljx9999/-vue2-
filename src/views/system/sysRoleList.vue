<template>
    <div class='-container'></div>
</template>

<script>
    import {getRoleLisApi} from "@/api/role"
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

        },

        methods: {
          async getRoleLis(){
            let res = await getRoleLisApi(this.params);
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
