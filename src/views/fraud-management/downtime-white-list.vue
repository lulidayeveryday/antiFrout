<template>
  <div class="app-container">
    <div class="filter-container">
      <div style="display:inline-block;padding-right: 20px;">
        <span style="padding: 0 8px 0 0;">号码</span>
        <el-input style="display: inline-block;width: 196px;" v-model="numbers" placeholder="请输入号码"></el-input>
      </div>
      <div style="display:inline-block;padding-right: 20px;">
        <span style="padding: 0 8px 0 0;">状态</span>
        <el-select v-model="types" placeholder="请选择" clearable>
          <el-option key="sx1" value="1" label="启用"></el-option>
          <el-option key="sx2" value="2" label="已移除"></el-option>
        </el-select>
      </div>

      <el-button class="filter-item" style="margin: 0 7px 0;" type="primary" icon="el-icon-search" @click="onSubmit">
        查询
      </el-button>
      <el-button class="filter-item" style="margin: 0 7px 0;" type="warning" icon="el-icon-plus" @click="addWhiteList = true">
        添加白名单
      </el-button>
      <el-button :loading="downloadLoading" style="margin:0 15px 0 7px;" type="success" icon="el-icon-document" @click="handleDownload">
        导出表格
      </el-button>
    </div>



    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      :fit="true"
      highlight-current-row
      style="width: 100%;"
      @selection-change="handleSelectionChange"
    >

      <el-table-column label="号码" min-width="110" prop="WHITE_NUMBER" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="添加人"  min-width="100" prop="ADD_USER" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="添加时间"  min-width="160" prop="ADD_TIME" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="状态" prop="STATUS" show-overflow-tooltip>
        <template slot-scope="{row}">
          <template v-if="row.STATUS==='1'">启用</template>
          <template v-else>停用</template>
        </template>
      </el-table-column>
      <el-table-column label="添加原因" prop="ADD_RESON" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="修改人" prop="EDIT_USER" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="修改时间"  min-width="160" prop="EDIT_TIME" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="设置" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <el-button type="danger" :key="row.WHITE_NUMBER" size="mini" plain @click="deleteRow(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block" style="margin-top: 15px;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageCurrent"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageTotal">
      </el-pagination>
    </div>

    <el-dialog :title="'添加白名单'" :visible.sync="addWhiteList" >
      <el-form ref="dataForm" :model="temp" :rules="rules" label-position="left" label-width="100px" size="mini" style=" margin-right:50px;margin-left:50px;">

        <el-form-item label="号码列表" prop="numbers">
          <el-input
            type="textarea"
            placeholder="多个号码间用英文逗号隔开"
            v-model="temp.numbers"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            type="textarea"
            placeholder="请输入内容"
            maxlength="128"
            show-word-limit
            v-model="temp.text"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addWhiteList = false">
          关闭
        </el-button>
        <el-button type="primary" @click="addWhite('dataForm')">
          保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { fetchdowntimeWhiteList,fetchdowntimeWhiteAdd,deleteWhiteData,fetchdowntimeWhiteListWhite } from '@/api/fraud-management';
    export default {
        name: "downtime-white-list",
      data() {
        var telPass = (rule, value, callback) => {
          const str1 = value.replace(/\s/ig, "")
          if (str1 === '') {
            callback(new Error('请输入手机号'));
          } else {
            if(str1.indexOf("，") != -1){
              callback(new Error('请输入英文逗号'));
              return false;
            }
            let numbers = str1.split(',')
            for(let i = 0;i<numbers.length;i++){
              if(!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(numbers[i]))){
                callback(new Error('输入格式或者手机号不正确'));
                return false;
              }
            }
            callback();
          }
        };
        return {
          numbers: '',
          types:'',
          list:[],
          temp:{
            numbers:'',
            text:'',
            /*list:[]*/
          },
          downloadLoading: false,
          multipleSelection:[],
          whiteList:[],
          addWhiteList:false,
          pageSize:10,//每页显示条数
          pageCurrent:1,//当前页
          pageTotal:0,
          rules:{
            numbers:[{ validator: telPass, trigger: 'blur' }]
          }
        }
      },
      created(){
        this.fetchList();
      },
      methods: {
        deleteRow(row) {
          let param = {}
          param.WHITE_NUMBER = row.WHITE_NUMBER;
          deleteWhiteData(param).then(response => {
            let key = response.resultState;
            if(key==='1'){
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.fetchList();
            }else {
              this.$message({
                message: '删除失败',
                type: 'warning'
              });
            }
          }).catch(err => {
            console.log(err)
          })
        },
        onSubmit() {
          this.fetchList();
        },
        fetchList(){
          let param = {};
          param.start = (this.pageCurrent-1)*this.pageSize;
          param.length = this.pageSize;
          param.numbers=this.numbers;
          param.types=this.types;
          fetchdowntimeWhiteList(param).then(response => {
            this.list = response.data
            this.pageTotal = response.total;
          }).catch(err => {
            console.log(err)
          })


          fetchdowntimeWhiteListWhite(param).then(response => {
            this.whiteList = response;
          }).catch(err => {
            console.log(err)
          })
        },
        addWhite(formName){
          this.$refs[formName].validate((valid) => {
            if (valid) {
              let param = this.temp;
              param.loginId = sessionStorage.getItem('loginId')
              /*param.list = param.numbers.split(',');*/
              fetchdowntimeWhiteAdd(param).then(response => {
                const key = response.resultState;
                if(key==='1'){
                  this.$message({
                    message: '添加成功',
                    type: 'success'
                  });
                  this.temp = {
                    numbers:'',
                    text:''
                  };
                  this.fetchList();
                  this.addWhiteList = false;
                }else {
                  this.$message({
                    message: '添加失败',
                    type: 'warning'
                  });
                }
              }).catch(err => {
                console.log(err)
              })
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
        handleDownload() {
          this.downloadLoading = true
          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = ['号码', '添加人', '添加时间', '状态', '添加原因','修改人','修改时间']
            const filterVal = ['WHITE_NUMBER', 'ADD_USER', 'ADD_TIME', 'STATUS', 'ADD_RESON','EDIT_USER','EDIT_TIME']
            const data = this.formatJson(filterVal)
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: '停机白名单'
            })
            this.downloadLoading = false
          })
        },
        formatJson(filterVal) {
          return this.whiteList.map(v => filterVal.map(j => {
            if (j === 'timestamp') {
              return parseTime(v[j])
            } else {
              return v[j]
            }
          }))
        },
        handleSelectionChange(val) {
          this.multipleSelection = val;
        },
        handleSizeChange(val) {
          this.pageSize=val;
          this.fetchList();
        },
        handleCurrentChange(val) {
          this.pageCurrent=val;
          this.fetchList();
        },
      }
    }
</script>

<style>
  .el-table .cell{
    white-space: nowrap;
  }
</style>
