<template>
  <div>
    <el-table v-loading="tableData.loading" :data="tableData" max-height="750">
      <el-table-column prop="userName" align="center" label="用户名">
      </el-table-column>
      <el-table-column prop="accountRole" align="center" label="账户身份">
      </el-table-column>
      <el-table-column prop="enterpriseRole" align="center" label="企业身份">
      </el-table-column>
      <el-table-column prop="enterpriseName" align="center" label="企业名称">
      </el-table-column>
      <el-table-column prop="phoneNumber" align="center" label="手机号码">
      </el-table-column>
      <el-table-column prop="email" align="center" label="邮箱">
      </el-table-column>
      <!-- <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button @click.native.prevent="bind(scope.$index, tableData)" type="text" :disabled="tableData[scope.$index].bindingStatus" size="small">
            修改权限
          </el-button>
          <el-button @click.native.prevent="unBind(scope.$index, tableData)" type="text" :disabled="!tableData[scope.$index].bindingStatus" size="small">
            删除
          </el-button>
        </template>
      </el-table-column> -->
    </el-table>
  </div>
</template>
<script>
export default {
  props: ["tableData"],
  data() {
    return {};
  },
  created() {
    console.log(this.tableData)
  }
};
</script>
<style scoped>
.block {
  text-align: right;
  padding-top: 20px;
}
</style>