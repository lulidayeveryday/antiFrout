<template>
  <div class="app-container">
    <div class="filter-container">
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
      <el-button :loading="downloadLoading" style="margin:0 15px 0 7px;" type="success" icon="el-icon-document" @click="handleDownload">
        导出表格
      </el-button>
      <el-button class="filter-item" style="margin: 0 7px 0;" type="warning" icon="el-icon-upload" @click="exportDetail">
        明细导出
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

      <el-table-column label="入网时间" prop="INNET_DATE" show-overflow-tooltip></el-table-column>
      <el-table-column label="地市" prop="AREA_DESC" show-overflow-tooltip></el-table-column>
      <el-table-column label="网格名称" prop="GRID_DESC" show-overflow-tooltip></el-table-column>
      <el-table-column label="渠道编码" prop="CHANNEL_ID" show-overflow-tooltip></el-table-column>
      <el-table-column label="渠道名称" prop="CHANNEL_NAME" show-overflow-tooltip></el-table-column>
      <el-table-column label="发展人" prop="DEVELOPER_NAME" show-overflow-tooltip></el-table-column>
      <el-table-column label="发展人编码" prop="DEVELOPER_ID" show-overflow-tooltip></el-table-column>
      <el-table-column label="统计期发展量" prop="DEV_USER" show-overflow-tooltip></el-table-column>
      <el-table-column label="历史平均发展量" prop="DEV_USER_AVG" show-overflow-tooltip></el-table-column>
      <el-table-column label="净增发展量" prop="FZL" show-overflow-tooltip></el-table-column>
      <el-table-column label="环比" prop="HB" show-overflow-tooltip></el-table-column>

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
  import { warnSuddenReportList,warnSuddenReportDown,warnSuddenReportDownDetail } from '@/api/fraud-management'
  import exportTableBaseUrl from '@/api/exportTableBaseUrl'
  import moment from 'moment'
    export default {
        name: "sales-increase",
      data() {
        return {
          list:[],
          downloadLoading: false,
          dialogFormVisible:false,
          multipleSelection:[],
          pageSize:10,//每页显示条数
          pageCurrent:1,//当前页
          pageTotal:0,
          time:'',
          loading:false,
          listDown:[]
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
        exportDetail(){
          let param = {};
          param.loginId = sessionStorage.getItem('loginId')
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
          let ctxPath = exportTableBaseUrl;
          window.open(ctxPath + "/warnSuddenReport/downloadTableDataDetail?startTime=" + param.startTime+"&endTime="+param.endTime+"&loginId="+param.loginId,'_blank');
          /*warnSuddenReportDownDetail(param).then(response => {
          }).catch(err => {
            console.log(err)
          })*/
        },
        fetchList(){
          this.loading = true;
          let param = {};
          param.loginId = sessionStorage.getItem('loginId')
          param.start = (this.pageCurrent-1)*this.pageSize;
          param.length = this.pageSize;
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
          warnSuddenReportList(param).then(response => {
            this.list = response.data
            this.pageTotal = response.total;
            this.loading = false;
            warnSuddenReportDown(param).then(response => {
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
              '入网时间',
              '地市',
              '网格名称',
              '渠道编码',
              '渠道名称',
              '发展人',
              '发展人编码',
              '统计期发展量',
              '历史平均发展量',
              '净增发展量',
              '环比'
            ]
            const filterVal = [
              'INNET_DATE',
              'AREA_DESC',
              'GRID_DESC',
              'CHANNEL_ID',
              'CHANNEL_NAME',
              'DEVELOPER_NAME',
              'DEVELOPER_ID',
              'DEV_USER',
              'DEV_USER_AVG',
              'FZL',
              'HB'
            ]
            const data = this.formatJson(filterVal)
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: '陕西联通同一渠道、同一发展人销量突增预警报表'
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
