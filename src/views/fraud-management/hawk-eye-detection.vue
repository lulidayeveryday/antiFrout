<template>
  <div class="app-container">
    <div class="filter-container">
      <!--<div style="display:inline-block;padding-right: 20px;">
        <span style="padding: 0 8px 0 0;">手机号码</span>
        <el-input style="display: inline-block;width: 196px;" v-model="DEVICE_NUMBER" placeholder="请输入手机号码"></el-input>
      </div>-->
      <div style="display:inline-block;padding-right: 20px;">
        <span style="padding: 0 8px 0 0;">统计时间</span>
        <el-date-picker
          v-model="time"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </div>
      <el-button class="filter-item" style="margin: 0 7px 0;" type="primary" icon="el-icon-search" @click="onSubmit">
        查询
      </el-button>
      <el-button :loading="downloadLoading" style="margin:0  7px 0;" type="success" icon="el-icon-document" @click="handleDownload">
        导出表格
      </el-button>
      <el-button class="filter-item" style="margin: 0 7px 0;" type="warning" icon="el-icon-upload" @click="upload = true">
        上传
      </el-button>
    </div>



    <el-table
      key="tableKey"
      v-loading="loading"
      :data="list"
      border
      fit
      highlight-current-row
      style="min-width: 100%;"
      @selection-change="handleSelectionChange"
    >
      <el-table-column label="检出日期" prop="CHECK_DATE" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="诈骗号码" prop="DEVICE_NUMBER" min-width="88" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="身份证" prop="PSPT_ID" min-width="168" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="姓名" prop="CUST_NAME" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="入网时间" prop="INNET_DATE" min-width="90" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="渠道名称" prop="CHANNEL_NAME" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="是否在网" prop="IS_INNET" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="漫游地市" prop="ROAM_CITY_DESC_1" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="漫游时间" prop="DAY_ID" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="imsi" prop="IMSI" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="运营商" prop="OPERATORS" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="省" prop="PROV_NAME" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="市" prop="AREA_DESC" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="类型" prop="TYPE" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="等级" prop="LEVEL" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="检出时间" prop="CHECK_TIME" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="拨出地" prop="AllOCATE_LAND" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="接听号码" prop="CALL_NUMBER" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="当日主叫次数" prop="CALLING_TIMES" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="号码套餐" prop="NUMBER_PACKAGE" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="骚扰类型" prop="HARA_TYPE" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="imei" prop="IMEI" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="lac" prop="LAC" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="ci/eci" prop="CI_ECI" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="数据来源" prop="DARA_RESOURCES" show-overflow-tooltip>
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

    <el-dialog :title="'上传文件'" :visible.sync="upload"  style="margin-top: -9vh;">
      <el-upload drag
                 :limit=limitNum
                 :auto-upload="false"
                 accept=".xlsx"
                 :action="UploadUrl()"
                 :before-upload="beforeUploadFile"
                 :on-change="fileChange"
                 :on-exceed="exceedFile"
                 :on-success="handleSuccess"
                 :on-error="handleError"
                 :file-list="fileList">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传xlsx文件<!--，且不超过10M--></div>
      </el-upload>
      <br/>
      <el-button size="small" type="primary" @click="uploadFile" v-loading="uploading">立即上传</el-button>
    </el-dialog>
  </div>
</template>

<script>
  import { fraudNumDeteList,fraudNumDeteDown,fraudNumDeteExcel } from '@/api/fraud-management'
  import moment from 'moment'
    export default {
        name: "hawk-eye-detection",
      data() {
        return {
          loading:false,
          uploading:false,
          list:[],
          downloadLoading: false,
          dialogFormVisible:false,
          multipleSelection:[],
          pageSize:10,//每页显示条数
          pageCurrent:1,//当前页
          pageTotal:0,
          listDown:[],
          time:'',
          DEVICE_NUMBER:'',
          upload: false,
          visible:false,
          type:'',
          limitNum: 1,  // 上传excell时，同时允许上传的最大数
          fileList: [],   // excel文件列表
        }
      },
      created(){
        this.time = []
        this.time.push(this.getDay(-0));
        this.time.push(this.getDay(-0));
        this.fetchList();
      },
      methods: {
        getDay(day){
          var today = new Date();

          var targetday_milliseconds=today.getTime() + 1000*60*60*24*day;

          today.setTime(targetday_milliseconds); //注意，这行是关键代码

          var tYear = today.getFullYear();
          var tMonth = today.getMonth();
          var tDate = today.getDate();
          tMonth = this.doHandleMonth(tMonth + 1);
          tDate = this.doHandleMonth(tDate);
          return tYear+"-"+tMonth+"-"+tDate;
        },
        doHandleMonth(month){
          var m = month;
          if(month.toString().length == 1){
            m = "0" + month;
          }
          return m;
        },
        fetchList(){
          this.loading = true;
          let param = {};
          param.start = (this.pageCurrent-1)*this.pageSize;
          param.length = this.pageSize;param.DEVICE_NUMBER = this.DEVICE_NUMBER;
          let time = this.time;
          if(time!=''){
            let startTime = moment(time[0]).format('YYYY-MM-DD');
            let endTime = moment(time[1]).format('YYYY-MM-DD');
            param.startTime=startTime;
            param.endTime=endTime;
          }else {
            param.startTime='';
            param.endTime='';
          }
          fraudNumDeteList(param).then(response => {
            this.list = response.data
            this.pageTotal = response.total;
            this.loading = false;
            fraudNumDeteDown(param).then(response => {
              this.listDown = response
            }).catch(err => {
              console.log(err)
            })
          }).catch(err => {
            console.log(err)
            this.loading = false;
          })


        },
        onSubmit() {
          this.fetchList();
        },
        handleDownload() {
          this.downloadLoading = true
          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = [
              '检出时间',
              '诈骗号码',
              '身份证',
              '姓名',
              '入网时间',
              '渠道名称',
              '是否在网',
              '漫游地市',
              '漫游时间',
              'imsi',
              '运营商',
              '省',
              '市',
              '类型',
              '等级',
              '检出时间',
              '拨出地',
              '接听号码',
              '当日主叫次数',
              '号码套餐',
              '骚扰类型',
              'imei',
              'lac',
              'ci/eci',
              '数据来源'
            ]
            const filterVal = [
              'CHECK_DATE',
              'DEVICE_NUMBER',
              'PSPT_ID',
              'CUST_NAME',
              'INNET_DATE',
              'CHANNEL_NAME',
              'IS_INNET',
              'ROAM_CITY_DESC_1',
              'DAY_ID',
              'IMSI',
              'OPERATORS',
              'PROV_NAME',
              'AREA_DESC',
              'TYPE',
              'LEVEL',
              'CHECK_TIME',
              'AllOCATE_LAND',
              'CALL_NUMBER',
              'CALLING_TIMES',
              'NUMBER_PACKAGE',
              'HARA_TYPE',
              'IMEI',
              'LAC',
              'CI_ECI',
              'DARA_RESOURCES'
            ]
            const data = this.formatJson(filterVal)
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: '鹰眼检出诈骗号码'
            })
            this.downloadLoading = false
          })
        },
        formatJson(filterVal) {
          return this.listDown.map(v => filterVal.map(j => {
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
        //组件方法
        init(params){
          this.visible = true
          this.type = params
        },
        // 文件超出个数限制时的钩子
        exceedFile(files, fileList) {
          this.$message.warning(`只能选择 ${this.limitNum} 个文件，当前共选择了 ${files.length + fileList.length} 个`);
        },
        // 文件状态改变时的钩子
        fileChange(file, fileList) {
          console.log(file.raw);
          this.fileList.push(file.raw) ;
          console.log(this.fileList);
        },
        // 上传文件之前的钩子, 参数为上传的文件,若返回 false 或者返回 Promise 且被 reject，则停止上传
        beforeUploadFile(file) {
          console.log('before upload');
          console.log(file);
          let extension = file.name.substring(file.name.lastIndexOf('.')+1);
          let size = file.size / 1024 / 1024;
          if(extension !== 'xlsx') {
            this.$message.warning('只能上传后缀是.xlsx的文件');
          }
          /*if(size > 10) {
            this.$message.warning('文件大小不得超过10M');
          }*/
        },
        // 文件上传成功时的钩子
        handleSuccess(res, file, fileList) {
          this.$message.success('文件上传成功');
        },
        // 文件上传失败时的钩子
        handleError(err, file, fileList) {
          this.$message.error('文件上传失败');
        },
        UploadUrl:function(){
          // 因为action参数是必填项，我们使用二次确认进行文件上传时，直接填上传文件的url会因为没有参数导致api报404，所以这里将action设置为一个返回为空的方法就行，避免抛错
          return ""
        },
        uploadFile() {
          this.uploading = true;
          if (this.fileList.length === 0){
            this.$message.warning('请上传文件');
          } else {
            let form = new FormData();
            form.append('file', this.fileList[0]);
            form.append('type', this.type);
            fraudNumDeteExcel(form).then(response => {
              if(response.resultState ==='1'){
                this.uploading = false;
                this.$message({
                  message: '上传成功',
                  type: 'success'
                });
                this.fetchList();
                this.upload = false;
              }else {
                this.$message.warning(this.resultMessage);
              }
            }).catch(err => {
              console.log(err)
            })

          }
        }
      }
    }
</script>

<style>
  .el-table .cell{
    white-space: nowrap;
  }
</style>
