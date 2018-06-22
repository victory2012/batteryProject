<template>
  <el-dialog title="创建生产企业管理员" :visible.sync="alarmDetail.show" width="770px">
    <el-form label-width="120px" :model="alarmDetail.Form" ref="alarmDetail.Form">
      <el-row :gutter="40">
        <el-col :span="12">
          <el-form-item label="用户名" prop="content">
            <el-input v-model="alarmDetail.Form.content" disabled auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="登陆密码" prop="hierarchy">
            <el-input v-model="alarmDetail.Form.hierarchy" disabled auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="40">
        <el-col :span="12">
          <el-form-item label="手机号码" prop="level">
            <el-input v-model="alarmDetail.Form.level" disabled auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱（选填）" prop="project">
            <el-input v-model="alarmDetail.Form.project" disabled auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="40">
        <el-col :span="12">
          <el-form-item label="企业名称" prop="serial">
            <el-input v-model="alarmDetail.Form.serial" disabled auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="submitAdmin('adminForm')" type="primary" plain>确认</el-button>
    </div>
  </el-dialog>
</template>
<style lang="less" scoped>
.el-form {
  padding: 0 20px;
}
.el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{
  margin-bottom: 40px;
}
</style>
<script>
export default {
  name: "look-detail",
  props: ['alarmDetail'],
  methods: {
    submitAdmin() {
      this.alarmDetail.show = false;
    }
  },
  mounted() {
    console.log(this.alarmDetail)
  }
}
</script>