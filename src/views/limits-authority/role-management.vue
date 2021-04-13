<template>
  <el-container style="height: calc(100vh - 84px);padding: 20px;">
    <el-main>

      <el-button type="warning" icon="el-icon-plus" @click="addRole = true">新增角色</el-button>
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;margin: 20px 0;"
        @sort-change="sortChange"
      >
        <el-table-column label="名称" align="center" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span>{{ row.roleName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="描述" align="center" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span>{{ row.memo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="162" align="center" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span>{{ row.createDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="权限" align="center" class-name="small-padding fixed-width" show-overflow-tooltip>
          <template slot-scope="{row}">
            <el-button type="primary" size="mini" @click="handleUpdate(row)">
              修改
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
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

      <el-dialog :title="'新增角色'" :visible.sync="addRole" >
        <el-form ref="dataForm" :model="temp" label-position="left" label-width="100px"  style=" margin-right:50px;margin-left:50px;">

          <el-form-item label="名称">
            <el-input
              v-model="add.roleName"
              placeholder="请输入名称"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="描述">
            <el-input
              v-model="add.memo"
              placeholder="请输入描述"
            >
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addRole = false">
            关闭
          </el-button>
          <el-button type="primary" @click="addRoles">
            新增
          </el-button>
        </div>
      </el-dialog>
    </el-main>
    <el-aside v-if="treeShow" width="350px" v-loading="loading">
      <div>
        菜单列表
      </div>
      <el-tree
        class="filter-tree"
        v-loading="treeLoading"
        :data="data"
        node-key="id"
        :props="defaultProps"
        :expand-on-click-node="false"
        show-checkbox
        :default-checked-keys="checkKeys"
        @check-change="handleCheckChange"
        ref="tree">
      </el-tree>
      <div style="margin-top: 20px;">
        <el-button size="mini" @click="treeShow = false">
          取消
        </el-button>
        <el-button size="mini" type="primary" @click="editRoleTree">
          保存
        </el-button>
      </div>
    </el-aside>
  </el-container>
</template>

<script>
  import { fetchroleList,fetchaddRole,fetchtreeAllList,fetchtreeSelList,editTreeSelList } from '@/api/limits-authority';
  import moment from 'moment';
    export default {
        name: "role-management",
      data() {
        return {
          treeShow:false,
          treeLoading:true,
          checkKeys:[1,4,5,7],
          data: [
            {
              id: 1,
              label: '一级 1',
              children: [{
                id: 4,
                label: '二级 1-1',
                children: [{
                  id: 9,
                  label: '三级 1-1-1'
                }, {
                  id: 10,
                  label: '三级 1-1-2'
                }]
              }]
            }, {
              id: 2,
              label: '一级 2',
              children: [{
                id: 5,
                label: '二级 2-1'
              }, {
                id: 6,
                label: '二级 2-2'
              }]
            }, {
              id: 3,
              label: '一级 3',
              children: [{
                id: 7,
                label: '二级 3-1'
              }, {
                id: 8,
                label: '二级 3-2'
              }]
            }],
          currentPage: 1,
          list:[
            {
              test1:'实名专员(反欺诈)',
              test2:'实名专员(反欺诈)',
              test3:'2020/5/6 上午10:34:10'
            }
          ],
          addRole: false,
          defaultProps: {
            children: 'children',
            label: 'label'
          },
          pageSize:10,//每页显示条数
          pageCurrent:1,//当前页
          pageTotal:100,
          loading: false,
          add:{
            roleName:'',
            memo:'',
            createDate:''
          },
          selRow:{}
        }
      },
      created(){
        /*替换*/
        this.fetchList();
        /*正式环境注销掉*/
        /*let datas={
          "total": 4,
          "data": [{
            "auths": [],
            "createDate": "2017-09-07",
            "createPersion": "超级管理员",
            "memo": null,
            "ord": null,
            "roleId": "2c90bfc35e5a45fc015e5a45fc870000",
            "roleName": "省分管理员",
            "updateDate": "2020-12-02",
            "updatePersion": "2c90bfc35e27f4a2015e27f4a2b00000"
          }, {
            "auths": [],
            "createDate": "2020-12-14",
            "createPersion": "超级管理员",
            "memo": "西安管理员",
            "ord": null,
            "roleId": "766091ca01766091caf30000",
            "roleName": "西安管理员",
            "updateDate": null,
            "updatePersion": null
          }, {
            "auths": [],
            "createDate": "2017-08-23",
            "createPersion": "超级管理员",
            "memo": "拥有所有权限",
            "ord": null,
            "roleId": "2c90bfc35e0ca664015e0ca6649d0000",
            "roleName": "超级管理员",
            "updateDate": "2020-09-21",
            "updatePersion": "2c90bfc35e27f4a2015e27f4a2b00000"
          }, {
            "auths": [],
            "createDate": "2019-05-24",
            "createPersion": "超级管理员",
            "memo": null,
            "ord": null,
            "roleId": "8a8ae4ed6ae801c9016ae801c9040000",
            "roleName": "地市管理员",
            "updateDate": "2020-12-14",
            "updatePersion": "2c90bfc35e27f4a2015e27f4a2b00000"
          }]
        }
        this.list=datas.data;
        this.pageTotal = datas.total;*/


      },
      watch:{
        addRole(newdata,olddata){
          if(newdata == false){
            this.add.createDate='';
            this.add.memo='';
            this.add.roleName='';
          }
        }
      },
      methods: {
        editRoleTree(){
          let selLists = this.$refs.tree.getCheckedKeys();
          let roleRow = this.selRow;
          let param = {};
          param.roleInfo = roleRow;
          let selLista = {};
          selLista.data = selLists;
          param.selList = selLista
          editTreeSelList(param).then(response => {
            this.$message({
              message: '修改成功',
              type: 'success'
            });
            this.treeShow = false
          }).catch(err => {
            console.log(err)
          })
        },
        addRoles(){
          let param = this.add;
          if(param.roleName===''){
            this.$message({
              message: '请填写名称',
              type: 'warning'
            });
            return;
          }else if(param.memo===''){
            this.$message({
              message: '请填写描述',
              type: 'warning'
            });
            return;
          };
          let date = new Date();
          param.createDate = moment(date).format('YYYY-MM-DD');
          fetchaddRole(param).then(response => {
            if(response.resultState==='1'){
              this.$message({
                message: '新增角色成功',
                type: 'success'
              });
              this.fetchList()
              this.addRole = false
            }
          }).catch(err => {
            console.log(err)
          })
        },
        fetchList(){
          let param = {};
          param.start = (this.pageCurrent-1)*this.pageSize;
          param.length = this.pageSize;
          fetchroleList(param).then(response => {
            this.list = response.data
            this.pageTotal = response.total;
          }).catch(err => {
            console.log(err)
          })
        },
        handleUpdate(row){
            this.treeShow = true;
            var param=row;
            this.selRow = row;
            fetchtreeAllList().then(response => {
              this.data = response;
              fetchtreeSelList(param).then(response => {
                let selList = [];
                for(let a=0;a<response.length;a++){
                  selList.push(response[a].id)
                }
                // this.checkKeys = selList;
                this.treeLoading=false;
                this.$refs.tree.setCheckedKeys(selList)
              }).catch(err => {
                console.log(err)
              })
            }).catch(err => {
              console.log(err)
            })
          },
        handleCheckChange(data, checked, indeterminate) {
          console.log(data, checked, indeterminate);
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

<style scoped>
.el-form-item{
  margin-bottom: 10px;
}
.el-table .cell{
  white-space: nowrap;
}
</style>
