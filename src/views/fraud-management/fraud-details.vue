<template>
  <div class="app-container">
    <div class="filter-container">
      <div style="display: inline-block;padding-right: 20px;">
        <span style="padding: 0 8px 0 0">省份</span>
        <el-select v-model="province" placeholder="请选择">
          <el-option key="sx" label="陕西"></el-option>
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
        <span style="padding: 0 8px 0 0;">业务号码</span>
        <el-input style="display: inline-block;width: 196px;" v-model="businessNumber" placeholder="请输入业务号码"></el-input>
      </div>
      <div style="display:inline-block;padding-right: 20px;">
        <span style="padding: 0 8px 0 0;">停开机状态</span>
        <el-select v-model="shutdownStatus" placeholder="请选择">
          <el-option key="sx1" label="未处理"></el-option>
          <el-option key="sx2" label="已停机"></el-option>
          <el-option key="sx3" label="停机失败"></el-option>
        </el-select>
      </div>

      <el-button class="filter-item" style="margin: 0 7px 0;" type="primary" icon="el-icon-search" @click="onSubmit">
        查询
      </el-button>
      <el-button :loading="downloadLoading" style="margin:0 15px 0 7px;" type="success" icon="el-icon-document" @click="handleDownload">
        导出表格
      </el-button>
      <span style="display: inline-block;color: #535353;font-size: 12px;line-height: 16px;margin-top: 14px;" @click="dialogFormVisible = !dialogFormVisible">
        <el-button type="info" icon="el-icon-circle-plus" circle style="padding: 1px;font-size: 16px;"></el-button>&nbsp;精确查找
      </span>
      <div style="margin: 15px 0;" v-if="dialogFormVisible">
        <div style="display:inline-block;padding-right: 20px;">
          <span style="padding: 0 8px 0 0;">导入时间</span>
          <el-date-picker
            v-model="time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
        <div style="display:inline-block;padding-right: 20px;">
          <span style="padding: 0 8px 0 0;">欺诈等级</span>
          <el-select placeholder="请选择" v-model="fraudLevel">
            <el-option key="sx1" value="1" label="诈骗"></el-option>
            <el-option key="sx2" value="2" label="骚扰"></el-option>
            <el-option key="sx3" value="3" label="固话骚扰"></el-option>
          </el-select>
        </div>
        <div style="display:inline-block;padding-right: 20px;">
          <span style="padding: 0 8px 0 0;">数据来源</span>
          <el-select placeholder="请选择" v-model="dataSources">
            <el-option key="sx1" value="1" label="不区分"></el-option>
            <el-option key="sx2" value="2" label="鹰眼下发"></el-option>
            <el-option key="sx3" value="3" label="西分自检"></el-option>
            <el-option key="sx1" value="4" label="国信下发"></el-option>
            <el-option key="sx2" value="5" label="公安关停"></el-option>
            <el-option key="sx3" value="6" label="鹰眼下发（互联网）"></el-option>
          </el-select>
        </div>
      </div>
    </div>



    <el-table
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="min-width: 100%;"
      @selection-change="handleSelectionChange"
    >

      <!--<el-table-column
        type="selection"
        width="55">
      </el-table-column>-->
      <el-table-column label="诈骗号码" prop="FRAUD_NUMBER" min-width="113" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="诈骗号码emsi号" min-width="214" prop="EMSI_NUMBER" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="省份" prop="PROV_NAME" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="城市" prop="AREA_DESC" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="诈骗类型" min-width="80" prop="FRAUD_TYPE" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="检出时间" min-width="162" prop="DETECTION_TIME" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="拨出地" prop="ALLOCATE_LAND" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="随机的接听号码" min-width="128" prop="RANDOM_ANSWER_NUMBER" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="批量导入流水号" min-width="188" prop="BATCH_IMPORT_SERIAL_NUMBER" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="运营商" prop="OPERATION" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="渠道" min-width="136" prop="CHANNEL" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="发展人" prop="OPERATER" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="产品" prop="PRODUCT" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="入网时间" min-width="162" prop="ACCESS_TIME" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="服务状态" min-width="80" prop="SERVICE_STATUS" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="停开机状态" min-width="96" prop="SHUTDOWN_STATIC" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="停开备注" min-width="80" prop="STOPOROPEN_REMARK" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="操作时间" min-width="162" prop="OPERATOR_TIME" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="操作人" prop="OPERATOR_USER" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="数据更新时间" min-width="162" prop="DATA_UPDATE_TIME" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="数据来源" min-width="80" prop="DATA_RESOURCES" show-overflow-tooltip>
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
  import { fetchfraudDetailsList,fetchfraudDetailsDownLoad } from '@/api/fraud-management'
  import moment from 'moment'
    export default {
        name: "fraud-details",
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
            }],
          province: '',//省份
          city:'',//地市
          businessNumber:'',//业务编码
          shutdownStatus:'',//停开机状态
          time:'',
          fraudLevel:'',//欺诈等级
          dataSources:'',//数据来源
          list:[],
          downloadLoading: false,
          dialogFormVisible:false,
          multipleSelection:[],
          pageSize:10,//每页显示条数
          pageCurrent:1,//当前页
          pageTotal:0,
          listDown:[]
        }
      },
      created(){
        this.fetchList();
      },
      methods: {
        fetchList(){
          let param = {};
          param.start = (this.pageCurrent-1)*this.pageSize;
          param.length = this.pageSize;
          param.province = this.province;
          param.city = this.city;
          param.businessNumber = this.businessNumber;
          param.shutdownStatus = this.shutdownStatus;
          if(this.dialogFormVisible){
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
            param.fraudLevel = this.fraudLevel;
            param.dataSources = this.dataSources;
          }else {
            param.startTime='';
            param.endTime='';
            param.fraudLevel = '';
            param.dataSources = '';
          }
          fetchfraudDetailsList(param).then(response => {
            this.list = response.data
            this.pageTotal = response.total;
          }).catch(err => {
            console.log(err)
          })


          fetchfraudDetailsDownLoad(param).then(response => {
            this.listDown = response
          }).catch(err => {
            console.log(err)
          })
        },
        onSubmit() {
          this.fetchList();
        },
        handleDownload() {
          this.downloadLoading = true
          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = [
              '诈骗号码',
              '诈骗号码emsi号',
              '省份',
              '城市',
              '诈骗类型',
              '检出时间',
              '拨出地',
              '随机的接听号码',
              '批量导入流水号',
              '运营商',
              '渠道',
              '发展人',
              '产品',
              '入网时间',
              '服务状态',
              '停开机状态',
              '停开备注',
              '操作时间',
              '操作人',
              '数据更新时间',
              '数据来源'
            ]
            const filterVal = ['FRAUD_NUMBER',
              'EMSI_NUMBER',
              'PROV_NAME',
              'AREA_DESC',
              'FRAUD_TYPE',
              'DETECTION_TIME',
              'ALLOCATE_LAND',
              'RANDOM_ANSWER_NUMBER',
              'BATCH_IMPORT_SERIAL_NUMBER',
              'OPERATION',
              'CHANNEL',
              'OPERATER',
              'PRODUCT',
              'ACCESS_TIME',
              'SERVICE_STATUS',
              'SHUTDOWN_STATIC',
              'STOPOROPEN_REMARK',
              'OPERATOR_TIME',
              'OPERATOR_USER',
              'DATA_UPDATE_TIME',
              'DATA_RESOURCES']
            const data = this.formatJson(filterVal)
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: '欺诈明细'
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
