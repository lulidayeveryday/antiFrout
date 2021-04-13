<template>
  <div class="app-container">
    <div class="filter-container">
      <span>工号&nbsp;&nbsp;</span><el-input v-model="screen.number" placeholder="工号" style="width: 200px;" class="filter-item" />
      <el-button class="filter-item" style="margin-left: 15px;" type="primary" icon="el-icon-search" @click="onSubmit">
        查询
      </el-button>
      <el-button class="filter-item" type="success" icon="el-icon-plus" @click="addUser = true" style="float: right">
        新增用户
      </el-button>
    </div>
    <el-table
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="用户名" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.userName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="组织机构" min-width="150px" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.prvoName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.roleName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <!--<span>{{ row.state }}</span>-->
          <span v-if="row.state==='1'">启用</span>
          <span v-else>停用</span>
        </template>
      </el-table-column>
      <el-table-column label="详情" align="center" class-name="small-padding fixed-width" show-overflow-tooltip>
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
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

    <el-dialog :title="'修改用户信息'" :visible.sync="dialogFormVisible" style="margin-top: -9vh;">
      <el-form ref="dataForm"  :rules="rules" :model="temp" label-position="left" label-width="100px" size="mini" style=" margin-right:50px;margin-left:50px;">

        <el-form-item label="登录工号">
          <span>{{temp.loginId	}}</span>

          <el-button type="primary" @click="resetPass" style="float: right;">
            重置密码
          </el-button>
        </el-form-item>
        <el-form-item label="姓名" prop="userName">
          <el-input v-model="temp.userName"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="temp.sex">
            <el-radio label="F">男</el-radio>
            <el-radio label="M">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input v-model="temp.age"></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="temp.telephone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="temp.emall"></el-input>
        </el-form-item>
        <el-form-item label="身份证">
          <el-input v-model="temp.idCard"></el-input>
        </el-form-item>
        <el-form-item label="联系地址">
          <el-input v-model="temp.userAddress"></el-input>
        </el-form-item>
        <el-form-item label="组织级别">
          {{temp.orgLevel}}
        </el-form-item>
        <el-form-item label="组织机构">
          {{temp.prvoName}}
        </el-form-item>
        <el-form-item label="渠道">
          {{temp.organName}}
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="temp.roleId" placeholder="请选择角色">
            <el-option v-for="(item,i) in roleList" :key="item.roleId" :label="item.roleName" :value="item.roleId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="temp.memo"></el-input>
        </el-form-item>
        <el-form-item label="创建时间">
          {{temp.createDate}}
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="temp.state">
            <el-radio label="1">启用</el-radio>
            <el-radio label="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="稽核管理标识">
          <el-radio-group v-model="temp.jhFlag">
            <el-radio label="0">否</el-radio>
            <el-radio label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          关闭
        </el-button>
        <el-button type="primary" @click="editUser">
          保存
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :title="'新增用户'" :visible.sync="addUser"  style="margin-top: -9vh;">
      <el-form ref="dataFormAdd" autocomplete="new-password" :rules="rules" :model="addUserInfo" label-position="left" label-width="100px" size="mini" style=" margin-right:50px;margin-left:50px;">

        <el-form-item label="登录工号" prop="loginId">
          <el-input v-model="addUserInfo.loginId"  autocomplete="new-password"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="userName">
          <el-input v-model="addUserInfo.userName"  autocomplete="new-password" ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserInfo.password" autocomplete="new-password" show-password></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="addUserInfo.sex">
            <el-radio label="F">男</el-radio>
            <el-radio label="M">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input v-model="addUserInfo.age"></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="addUserInfo.telephone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="addUserInfo.emall"></el-input>
        </el-form-item>
        <el-form-item label="身份证">
          <el-input v-model="addUserInfo.idCard"></el-input>
        </el-form-item>
        <el-form-item label="联系地址">
          <el-input v-model="addUserInfo.userAddress"></el-input>
        </el-form-item>
        <el-form-item label="组织级别">
          <el-input v-model="addUserInfo.orgLevel"></el-input>
        </el-form-item>
        <el-form-item label="组织机构">
          <el-input v-model="addUserInfo.prvoName"></el-input>
        </el-form-item>
        <el-form-item label="渠道">
          <el-input v-model="addUserInfo.chaneelId"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="addUserInfo.roleId" placeholder="请选择角色">
            <el-option v-for="(item,i) in roleList" :key="item.roleId" :label="item.roleName" :value="item.roleId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="addUserInfo.memo"></el-input>
        </el-form-item>
        <el-form-item label="稽核管理标识">
          <el-radio-group v-model="addUserInfo.jhFlag">
            <el-radio label="0">否</el-radio>
            <el-radio label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUser = false">
          关闭
        </el-button>
        <el-button type="primary" @click="addUsers">
          新增
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { fetchuserList,fetcheditUser,fetchRole,resetPass,addUsers } from '@/api/limits-authority'
  import axios from 'axios'
    export default {
        name: "user",
      data() {
        return {
          rules:{
            loginId:[
              { required: true, message: '请填写登录工号', trigger: 'blur' }
            ],
            userName:[
              { required: true, message: '请填写姓名', trigger: 'blur' }
            ],
            password:[
              { required: true, message: '请填写密码', trigger: 'blur' }
            ],
          },
          addUser:false,
          screen: {
            number: ''
          },
          currentPage: 1,
          list:[],
          roleList:[
            {
              "auths": [],
              "createDate": "2017-09-07",
              "createPersion": "超级管理员",
              "memo": null,
              "ord": null,
              "roleId": "2c90bfc35e5a45fc015e5a45fc870000",
              "roleName": "省分管理员",
              "updateDate": "2020-12-02",
              "updatePersion": "2c90bfc35e27f4a2015e27f4a2b00000"
            },
            {
              "auths": [],
              "createDate": "2020-12-14",
              "createPersion": "超级管理员",
              "memo": "西安管理员",
              "ord": null,
              "roleId": "766091ca01766091caf30000",
              "roleName": "西安管理员",
              "updateDate": null,
              "updatePersion": null
            },
            {
              "auths": [],
              "createDate": "2017-08-23",
              "createPersion": "超级管理员",
              "memo": "拥有所有权限",
              "ord": null,
              "roleId": "2c90bfc35e0ca664015e0ca6649d0000",
              "roleName": "超级管理员",
              "updateDate": "2020-09-21",
              "updatePersion": "2c90bfc35e27f4a2015e27f4a2b00000"
            },
            {
              "auths": [],
              "createDate": "2019-05-24",
              "createPersion": "超级管理员",
              "memo": null,
              "ord": null,
              "roleId": "8a8ae4ed6ae801c9016ae801c9040000",
              "roleName": "地市管理员",
              "updateDate": "2020-12-14",
              "updatePersion": "2c90bfc35e27f4a2015e27f4a2b00000"
            }
          ],
          temp:{},
          dialogFormVisible:false,
          pageSize:10,//每页显示条数
          pageCurrent:1,//当前页
          pageTotal:0,
          addUserInfo:{
          }
        }
      },
      watch:{
        addUser(val){
          this.addUserInfo = {};
        }
      },
      created(){
          /*替换*/
          this.fetchList();
          this.fetchRole();


      },
      methods: {
        addUsers(){
          this.$refs['dataFormAdd'].validate((valid) => {
            if (valid) {
              let param = this.addUserInfo;
              addUsers(param).then(response => {
                if(response.resultState==='1'){
                  this.$message({
                    message: '新增用户成功',
                    type: 'success'
                  });
                  this.addUser = false;
                  this.addUserInfo = {};
                  this.fetchList();
                }
              }).catch(err => {
                console.log(err)
              })
            } else {
              return false;
            }
          });

        },
        onSubmit() {
          this.fetchList();
        },
        /*重置密码*/
        resetPass(){
          let param = this.temp;
          resetPass(param).then(response => {
            if(response.resultState==='1'){
              this.$message({
                message: '重置密码成功',
                type: 'success'
              });
            }
          }).catch(err => {
            console.log(err)
          })
        },
        /*编辑时角色列表*/
        fetchRole(){
          fetchRole().then(response => {
            this.roleList = response;
          }).catch(err => {
            console.log(err)
          })
        },
        fetchList(){
          // let param = this.screen;
          let param = {};
          param.start = (this.pageCurrent-1)*this.pageSize;
          param.length = this.pageSize;
          param.jsonStr = this.screen.number;
          fetchuserList(param).then(response => {
            this.list = response.data
            this.pageTotal = response.total;
          }).catch(err => {
            console.log(err)
          })
        },
        editUser(){
          this.$refs['dataForm'].validate((valid) => {
            if (valid) {
              let param = this.temp;
              fetcheditUser(param).then(response => {
                if(response.resultState==='1'){
                  this.$message({
                    message: '保存成功',
                    type: 'success'
                  });
                  this.dialogFormVisible = false
                  this.fetchList();
                }else {
                  this.$message.error('保存失败');
                }
              }).catch(err => {
                console.log(err)
              })
              this.fetchList();
            } else {
              return false;
            }
          });
        },
        handleSizeChange(val) {
          this.pageSize=val;
          this.fetchList();
        },
        handleCurrentChange(val) {
          this.pageCurrent=val;
          this.fetchList();
        },
        handleUpdate(row){
          this.dialogFormVisible = true;
          this.temp = row;
        }
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
