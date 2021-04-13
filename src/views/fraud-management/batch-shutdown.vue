<template>
  <div class="app-container">
    <el-row style="margin-bottom: 20px;">
      <el-col :span="10">
        数据类型
        <el-select v-model="value" placeholder="请选择" style="width: 250px;">
          <el-option label="普通批量停机" value="普通批量停机">普通批量停机</el-option>
          <el-option label="鹰眼（互联网）批量停机" value="鹰眼（互联网）批量停机">鹰眼（互联网）批量停机</el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="10">
        <el-upload
          class="upload-demo"
          ref="upload"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :file-list="fileList"
          :auto-upload="false">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">文件导入</el-button>
          <div slot="tip" class="el-upload__tip">提醒：文件格式：xls或xlsx，每行两列,号码、停机原因 </div>
        </el-upload>
      </el-col>
    </el-row>
  </div>
</template>

<script>
    export default {
        name: "batch-shutdown",
      data() {
        return {
          fileList: [],
          value:''
        };
      },
      methods: {
        submitUpload() {
          this.$refs.upload.submit();
        },
        handleRemove(file, fileList) {
          console.log(file, fileList);
        },
        handlePreview(file) {
          console.log(file);
        }
      }
    }
</script>

<style scoped>

</style>
