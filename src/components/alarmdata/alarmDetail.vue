<template>
  <el-dialog title="详情" :visible.sync="alarmDetail.show" width="770px">
    <el-form label-width="120px" :model="alarmDetail.Form" ref="alarmDetail.Form">
      <el-row :gutter="40">
        <el-col :span="12">
          <el-form-item label="电池编号" prop="serial">
            <el-input v-model="alarmDetail.Form.serial" disabled auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备id" prop="content">
            <el-input v-model="alarmDetail.Form.content" disabled auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="40">
        <el-col :span="12">
          <el-form-item label="告警级别" prop="level">
            <el-input v-model="alarmDetail.Form.level" disabled auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="告警层级" prop="hierarchy">
            <el-input v-model="alarmDetail.Form.hierarchy" disabled auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-row :gutter="40">
        <el-col :span="12">
          <el-form-item label="电池编号" prop="serial">
            <el-input v-model="alarmDetail.Form.serial" disabled auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="电池组编号" prop="serialGroup">
            <el-input v-model="alarmDetail.Form.serialGroup" disabled auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row> -->
      <el-row :gutter="40">
        <el-col :span="24">
          <el-form-item label="告警发生时间" prop="startTime">
            <el-input v-model="alarmDetail.Form.startTime" disabled auto-complete="off"></el-input>
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