<template>
  <div>

  </div>
</template>
<script>
import { deviceList } from "../../api/index.js";
export default {
  name: "TableList",
  props: ["tableData"],
  data() {
    return {
      totalPage: 1, // 总页数
      currentPage: 1, // 当前页
      handleSize: 10, // 每页显示条数
      handleSizeData: [10, 20, 30, 40, 50],
      // tableData: [],
      loading: false
    };
  },
  mounted() {
    // this.getData();
  },
  methods: {
    /*
    *  获取数据
    *  pageObj：入参分页配置 json格式
    */
    getData() {
      let pageObj = {
        pageSize: this.handleSize,
        pageNum: this.currentPage
      };
      deviceList(pageObj).then(res => {
        this.loading = false;
        console.log(res);
        let result = res.data;

        if (result.code === 0) {
          if (result.data.data) {
            let tableObj = result.data.data;
            this.tableData = [];
            tableObj.forEach(key => {
              if (key.bindingStatus === 0) {
                key.bindingName = "未绑定";
                key.bindingStatus = false;
              } else {
                key.bindingName = "已绑定";
                key.bindingStatus = true;
              }
              key.status = key.status === 0 ? true : false;
              this.tableData.push(key);
            });
          }
        }
      });
    },
    /*
    *  改变每页显示的条数
    */
    handleSizeChange(index) {
      // index为选中的页数
      this.handleSize = index;
      this.getData();
    },
    /*
    * 显示第几页
    */
    handleCurrentChange() {
      console.log("handleCurrentChange", this.currentPage);
    }
  }
};
</script>
<style scoped>
.block {
  text-align: right;
  padding-top: 20px;
}
</style>
