<template>
  <el-table :data="list" style="width: 100%;padding-top: 15px;">
    <el-table-column label="号码">
      <template slot-scope="scope">
        <span  style="color: #409eff">{{ scope.row.temp1}}</span>
      </template>
    </el-table-column>
    <el-table-column label="漫游地市" align="center">
      <template slot-scope="scope">
        {{ scope.row.temp2}}
      </template>
    </el-table-column>
    <el-table-column label="漫游主叫通话次数占比（次）"align="center">
      <template slot-scope="scope">
        {{ scope.row.temp3}}%
      </template>
    </el-table-column>
    <el-table-column label="漫游主叫通话时长占比（分钟）"align="center">
      <template slot-scope="scope">
        {{ scope.row.temp4}}%
      </template>
    </el-table-column>
    <el-table-column label="备注1"align="center">
      <template slot-scope="scope">
        {{ scope.row.temp5}}
      </template>
    </el-table-column>
    <el-table-column label="备注2"align="center">
      <template slot-scope="scope">
        {{ scope.row.temp6}}
      </template>
    </el-table-column>
    <el-table-column label="备注3"align="center">
      <template slot-scope="scope">
        {{ scope.row.temp7}}
      </template>
    </el-table-column>
    <el-table-column label="备注4"align="center">
      <template slot-scope="scope">
        {{ scope.row.temp8}}
      </template>
    </el-table-column>
    <el-table-column label="备注5"align="center">
      <template slot-scope="scope">
        {{ scope.row.temp9}}
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { transactionList } from '@/api/remote-search'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      }
      return statusMap[status]
    },
    orderNoFilter(str) {
      return str.substring(0, 30)
    }
  },
  data() {
    return {
      list: [
        {temp1:'18963256987',temp2:'贵阳',temp3:'36.2',temp4:'100',temp5:'158',temp6:'99.88',temp7:'停机',temp8:'96%',temp9:'数据'},
        {temp1:'18963256987',temp2:'贵阳',temp3:'36.2',temp4:'100',temp5:'158',temp6:'99.88',temp7:'停机',temp8:'96%',temp9:'数据'},
        {temp1:'18963256987',temp2:'贵阳',temp3:'36.2',temp4:'100',temp5:'158',temp6:'99.88',temp7:'停机',temp8:'96%',temp9:'数据'},
        {temp1:'18963256987',temp2:'贵阳',temp3:'36.2',temp4:'100',temp5:'158',temp6:'99.88',temp7:'停机',temp8:'96%',temp9:'数据'},
        {temp1:'18963256987',temp2:'贵阳',temp3:'36.2',temp4:'100',temp5:'158',temp6:'99.88',temp7:'停机',temp8:'96%',temp9:'数据'},
        {temp1:'18963256987',temp2:'贵阳',temp3:'36.2',temp4:'100',temp5:'158',temp6:'99.88',temp7:'停机',temp8:'96%',temp9:'数据'},
        {temp1:'18963256987',temp2:'贵阳',temp3:'36.2',temp4:'100',temp5:'158',temp6:'99.88',temp7:'停机',temp8:'96%',temp9:'数据'},
        {temp1:'18963256987',temp2:'贵阳',temp3:'36.2',temp4:'100',temp5:'158',temp6:'99.88',temp7:'停机',temp8:'96%',temp9:'数据'},
        {temp1:'18963256987',temp2:'贵阳',temp3:'36.2',temp4:'100',temp5:'158',temp6:'99.88',temp7:'停机',temp8:'96%',temp9:'数据'},
        {temp1:'18963256987',temp2:'贵阳',temp3:'36.2',temp4:'100',temp5:'158',temp6:'99.88',temp7:'停机',temp8:'96%',temp9:'数据'},
      ]
    }
  },
  created() {

  },
  methods: {

  }
}
</script>
