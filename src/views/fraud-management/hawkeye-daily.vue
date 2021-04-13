<template>
  <div class="app-container">
    <div class="filter-container">
      <div style="display: inline-block;padding-right: 20px;">
        <span style="padding: 0 8px 0 0">省份</span>
        <el-select v-model="province" placeholder="请选择">
          <el-option key="sx" label="陕西" value="sx"></el-option>
        </el-select>
      </div>
      <div style="display:inline-block;padding-right: 20px;">
        <span style="padding: 0 8px 0 0;">地市</span>
        <el-select v-model="city" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div style="display:inline-block;padding-right: 20px;">
        <span style="padding: 0 8px 0 0;">数据类型</span>
        <el-select v-model="dataType" placeholder="请选择">
          <el-option key="sx1" value="-1" label="全部"></el-option>
          <el-option key="sx2" value="1" label="欺诈类型"></el-option>
          <el-option key="sx3" value="2" label="骚扰数据"></el-option>
        </el-select>
      </div>
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
      <span style="display: inline-block;color: #535353;font-size: 12px;line-height: 16px;margin-top: 14px;" @click="dialogFormVisible = true">
        <el-button type="info" icon="el-icon-warning-outline" circle style="padding: 2px;font-size: 16px;"></el-button>&nbsp;统计口径说明
      </span>
    </div>



    <el-table
      :key="tableKey"
      :data="list"
      border
      fit
      show-summary
      :summary-method="getSummaries"
      fit="true"
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="地市" prop="AREA_DESC" width="70" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="统计日期" min-width="100" prop="STATIC_TIME" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="鹰眼下发量" min-width="96" prop="EYE_NUM" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="bss用户量" min-width="96" prop="BSS_USER_NUM" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="白名单过滤量" min-width="112" prop="WHITE_FILTER_NUM" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="状态过滤量" min-width="96" prop="STATE_FILTER_NUM" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="停机成功量" min-width="96" prop="SHUTDOWN_SUCESS" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="靓号过滤量" min-width="96" prop="FILT_CAPACITY" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="停机失败量" min-width="96" prop="SHUTDOWN_FAILED" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="停机率" prop="TJL" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="7天下发量" min-width="96" prop="SEVEN_VOLUME" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="7天复开量" min-width="96" prop="SEVEN_OPEN" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="7天白名单过滤量" min-width="134" prop="SEVEN_WHITE_FILTER_NUM" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="7天复开率" min-width="96" prop="FKL" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="7天停机量" min-width="96" prop="SEVEN_SHUTDOWN" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="7天停机率" min-width="96" prop="TJL7" show-overflow-tooltip>
      </el-table-column>
    </el-table>


    <el-dialog :title="'统计口径说明'" :visible.sync="dialogFormVisible">
      <div>
        <ul style="line-height: 25px;">
          <li>每晚凌晨1点汇总前日鹰眼下发数据总量</li>
          <li>下发总量为鹰眼下发数据剔除重复后的量(所有指标都是剔除重复后的)</li>
          <li>白名单、靓号、停机成功、失败、非正常状态不停机 这四列数据中相互存在重复的可能性（四项加起来可能不等于下发总数）</li>
          <li>停机率=系统停机成功号码数/鹰眼下发数量</li>
          <li>7天内复开数量 指从截止汇总时间点号码状态是正常开通的7天内鹰眼下发的号码数量</li>
          <li>7天内复开率=7天内复开号码/(7天下发的号码-白名单数量) （剔除重复后的量进行比较）</li>
          <li>7天内停机数量 指截止汇总时间点离网+预销户停机+局方停机的号码数量</li>
          <li>7天停机率=7天内停机数量/(7天下发的号码-白名单数量) （剔除重复后的量进行比较）</li>
          <li>报表中统计日期为数据汇总时间，汇总的是前一天下发数据的整体情况</li>
        </ul>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { fetchhawkeyeDailyList } from '@/api/fraud-management'
  import moment from 'moment'

    export default {
        name: "hawkeye-daily",
      data() {
        return {
          options: [
            {
            value: '844',
            label: '咸阳'
          }, {
            value: '842',
            label: '延安'
          }, {
            value: '845',
            label: '榆林'
          }, {
            value: '843',
            label: '渭南'
          }, {
            value: '847',
            label: '商洛'
          }, {
            value: '841',
            label: '西安'
          }, {
            value: '848',
            label: '安康'
          }, {
            value: '849',
            label: '汉中'
          }, {
            value: '840',
            label: '宝鸡'
          }, {
            value: '846',
            label: '铜川'
          }],//地市下拉框展示数据
          province: '',//省份
          city:'',//地市
          dataType:'',//数据类型
          time:'',
          list:[],//表格数据
          dialogFormVisible:false,//统计口径说明
          downloadLoading: false
        }
      },
      created(){
        this.fetchList();
      },
      methods: {
        fetchList(){
          let param={};
          param.province=this.province;
          param.city=this.city;
          param.dataType=this.dataType;
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
          fetchhawkeyeDailyList(param).then(response => {
            if(response.length>0){
              this.list = response;
            }
          }).catch(err => {
            console.log(err)
          })
        },
        onSubmit() {
          this.fetchList();
        },
        getSummaries(param) {
          const { columns, data } = param;
          const sums = [];
          columns.forEach((column, index) => {
            if (index === 0) {
              sums[index] = '合计';
              return;
            }else if(index === 1){
              sums[index] = '--';
              return
            }
            const values = data.map(item => Number(item[column.property]));
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index] += '';
          });

          return sums;
        },
        handleDownload() {
          this.downloadLoading = true
          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = [
              '地市',
              '统计日期',
              '鹰眼下发量',
              'bss用户量',
              '白名单过滤量',
              '状态过滤量',
              '停机成功量',
              '靓号过滤量',
              '停机失败量',
              '停机率',
              '7天下发量',
              '7天复开量',
              '7天白名单过滤量',
              '7天复开率',
              '7天停机量',
              '7天停机率']
            const filterVal = ['AREA_DESC',
              'STATIC_TIME',
              'EYE_NUM',
              'BSS_USER_NUM',
              'WHITE_FILTER_NUM',
              'STATE_FILTER_NUM',
              'SHUTDOWN_SUCESS',
              'FILT_CAPACITY',
              'SHUTDOWN_FAILED',
              'TJL',
              'SEVEN_VOLUME',
              'SEVEN_OPEN',
              'SEVEN_WHITE_FILTER_NUM',
              'FKL',
              'SEVEN_SHUTDOWN',
              'TJL7']
            const data = this.formatJson(filterVal)
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: '鹰眼停机率日报'
            })
            this.downloadLoading = false
          })
        },
        formatJson(filterVal) {
          return this.list.map(v => filterVal.map(j => {
            if (j === 'timestamp') {
              return parseTime(v[j])
            } else {
              return v[j]
            }
          }))
        },
      },
    }
</script>

<style>
  .el-table .cell{
    white-space: nowrap;
  }
</style>
