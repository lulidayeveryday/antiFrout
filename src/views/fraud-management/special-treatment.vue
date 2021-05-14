<template>
  <div class="app-container">
    <div class="filter-container">
      <!--<div style="display:inline-block;padding-right: 20px;">
        <span style="padding: 0 8px 0 0;">号码</span>
        <el-input style="display: inline-block;width: 196px;" v-model="numbers" placeholder="请输入号码"></el-input>
      </div>-->
      <!--<div style="display:inline-block;padding-right: 20px;">
        <span style="padding: 0 8px 0 0;">状态</span>
        <el-select v-model="types" placeholder="请选择" clearable>
          <el-option key="sx1" value="1" label="启用"></el-option>
          <el-option key="sx2" value="2" label="已移除"></el-option>
        </el-select>
      </div>-->

      <!--<el-button class="filter-item" style="margin: 0 7px 0;" type="primary" icon="el-icon-search" @click="onSubmit">
        查询
      </el-button>-->
      <el-button class="filter-item" style="margin: 0 7px 0;" type="warning" icon="el-icon-plus" @click="addWhiteList = true">
        添加日报
      </el-button>
      <!--<el-button :loading="downloadLoading" style="margin:0 15px 0 7px;" type="success" icon="el-icon-document" @click="handleDownload">
        导出表格
      </el-button>-->
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

      <el-table-column label="地市" min-width="110" prop="AREA_DESC" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="鹰眼检出诈骗号码/个" prop="CHECK_FRAUD_NUMBER" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="发展渠道信息" prop="DEVE_CHANNEL_FRAUD" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="鹰眼检出骚扰号码/个" prop="CHECK_HARASS_NUMBER" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="发展渠道信息" prop="DEVE_CHANNEL_HARASS" show-overflow-tooltip>
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

    <el-dialog :title="'添加日报'" :visible.sync="addWhiteList" >
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="180px" size="mini" style=" margin-right:50px;margin-left:50px;">

        <el-form-item label="鹰眼检出诈骗号码/个" prop="numbers">
          <el-input
            type="text"
            placeholder=""
            v-model="temp.CHECK_FRAUD_NUMBER"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="发展渠道信息">
          <el-input
            type="textarea"
            placeholder="注明发展渠道名称、渠道类型、同批次关联号码、号码关停情况、渠道处理情况等相关信息"
            v-model="temp.DEVE_CHANNEL_FRAUD"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="鹰眼检出骚扰号码/个" prop="numbers">
          <el-input
            type="text"
            placeholder=""
            v-model="temp.CHECK_HARASS_NUMBER"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="发展渠道信息">
          <el-input
            type="textarea"
            placeholder="注明发展渠道名称、渠道类型、同批次关联号码、号码关停情况、渠道处理情况等相关信息政企短号"
            v-model="temp.DEVE_CHANNEL_HARASS"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clossAdd">
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
  import { specialTreatList,specialTreatAdd } from '@/api/fraud-management';
    export default {
        name: "special-treatment",
      data() {
        return {
          numbers: '',
          types:'',
          list:[],
          temp:{
            CHECK_FRAUD_NUMBER:'',
            DEVE_CHANNEL_FRAUD:'',
            CHECK_HARASS_NUMBER:'',
            DEVE_CHANNEL_HARASS:''
            /*list:[]*/
          },
          downloadLoading: false,
          multipleSelection:[],
          whiteList:[],
          addWhiteList:false,
          pageSize:10,//每页显示条数
          pageCurrent:1,//当前页
          pageTotal:0,
          listLoading:false,
          loginId:''
          /*rules:{
            numbers:[{ validator: telPass, trigger: 'blur' }]
          }*/
        }
      },
      created(){
        this.fetchList();
      },
      methods: {
        clossAdd(){
          this.addWhiteList = false
          for(let i in this.temp){
            this.temp[i] = "";
          }
        },
        onSubmit() {
          this.fetchList();
        },
        fetchList(){
          this.listLoading = true;
          let param = {};
          this.loginId = sessionStorage.getItem('loginId');
          param.start = (this.pageCurrent-1)*this.pageSize;
          param.length = this.pageSize;
          param.loginId = this.loginId;
          specialTreatList(param).then(response => {
            this.listLoading = false;
            this.list = response.data
            this.pageTotal = response.total;
          }).catch(err => {
            this.listLoading = false;
            console.log(err)
          })


          /*fetchdowntimeWhiteListWhite(param).then(response => {
            this.whiteList = response;
          }).catch(err => {
            console.log(err)
          })*/
        },
        addWhite(formName){
          this.$refs[formName].validate((valid) => {
            if (valid) {
              let param = this.temp;
              param.loginId = sessionStorage.getItem('loginId')
              /*param.list = param.numbers.split(',');*/
              specialTreatAdd(param).then(response => {
                const key = response.resultState;
                if(key==='1'){
                  this.$message({
                    message: '添加成功',
                    type: 'success'
                  });
                  this.temp = {
                    CHECK_FRAUD_NUMBER:'',
                    DEVE_CHANNEL_FRAUD:'',
                    CHECK_HARASS_NUMBER:'',
                    DEVE_CHANNEL_HARASS:''
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
