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
          v-model="timeDay"
          type="date"
          placeholder="日期">
        </el-date-picker>
      </div>
      <div style="display:inline-block;padding-right: 20px;">
        <span style="padding: 0 8px 0 0;">统计时间段</span>
        <el-select v-model="time" placeholder="请选择">
          <el-option key="sx1" value="08:00-10:00" label="08:00-10:00"></el-option>
          <el-option key="sx2" value="10:01-12:00" label="10:01-12:00"></el-option>
          <el-option key="sx3" value="12:01-14:00" label="12:01-14:00"></el-option>
          <el-option key="sx4" value="14:01-16:00" label="14:01-16:00"></el-option>
        </el-select>
      </div>
      <el-button class="filter-item" style="margin: 0 7px 0;" type="primary" icon="el-icon-search" @click="onSubmit">
        查询
      </el-button>


      <el-button :loading="downloadLoading" style="margin:0 15px 0 7px;" type="success" icon="el-icon-document" @click="handleDownload">
        导出表格
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

      <el-table-column label="检测时间" prop="CHECK_TIME">
      </el-table-column>
      <el-table-column label="客户ID" prop="USER_ID" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="手机号码" prop="DEVICE_NUMBER" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="地市编码" prop="AREA_ID" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="所属地市" prop="AREA_DESC" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="发展渠道名称" prop="CHANNEL_NAME" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="发展人编码" prop="DEVELOPER_ID" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="发展人" prop="DEVELOPER_NAME" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="漫游地区号" prop="VISIT_AREA_CODE" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="漫游地" prop="NAME" show-overflow-tooltip>
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
  </div>
</template>

<script>
  import { highRiskRoamList,highRiskRoamDown } from '@/api/fraud-management'
  import moment from 'moment'
    export default {
        name: "high-risk-roaming",
      data() {
        return {
          list:[],
          loading:false,
          downloadLoading: false,
          dialogFormVisible:false,
          multipleSelection:[],
          pageSize:10,//每页显示条数
          pageCurrent:1,//当前页
          pageTotal:0,
          listDown:[],
          time:'08:00-10:00',
          timeDay:'',
          DEVICE_NUMBER:''
        }
      },
      created(){
        this.timeDay = this.getDay(-0);
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
          param.length = this.pageSize;
          param.time = this.time;
          let timeDay = this.timeDay;
          if(timeDay!=''){
            let endTime = moment(timeDay).format('YYYY-MM-DD');
            param.endTime=endTime;
          }else {
            param.endTime='';
          }

          param.DEVICE_NUMBER = this.DEVICE_NUMBER;
          highRiskRoamList(param).then(response => {
            this.list = response.data
            this.pageTotal = response.total;
            this.loading = false;
            highRiskRoamDown(param).then(response => {
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
              '检测时间',
              '客户ID',
              '手机号码',
              '地市编码',
              '所属地市',
              '发展渠道名称',
              '发展人编码',
              '发展人',
              '漫游地区号',
              '漫游地'
            ]
            const filterVal = [
              'CHECK_TIME',
              'USER_ID',
              'DEVICE_NUMBER',
              'AREA_ID',
              'AREA_DESC',
              'CHANNEL_NAME',
              'DEVELOPER_ID',
              'DEVELOPER_NAME',
              'VISIT_AREA_CODE',
              'NAME'
            ]
            const data = this.formatJson(filterVal)
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: '高危漫游话务异常筛选'
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
      }
    }
</script>

<style>
  .el-table .cell{
    white-space: nowrap;
  }
</style>
