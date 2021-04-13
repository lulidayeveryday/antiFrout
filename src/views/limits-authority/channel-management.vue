<template>
  <el-container style="height: calc(100vh - 84px);">
    <el-aside width="300px">
      <el-input
        placeholder="输入关键字进行过滤"
        v-model="filterText">
      </el-input>

      <el-tree
        class="filter-tree"
        v-loading="treeLoading"
        :data="data"
        :props="defaultProps"
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        @node-click="clickNode"
        ref="tree">
      </el-tree>
    </el-aside>
    <el-main>
      <el-tabs tab-position="left">
        <el-tab-pane label="渠道信息">
          <el-row style="margin-bottom: 10px;">
            <el-col :span="2" style="text-align: right;">
              <span class="organization-span">选择渠道：</span>
            </el-col>
            <el-col :span="21">
              <el-select v-model="channelValue" style="width: 100%" filterable placeholder="请选择">
                <el-option
                  v-for="item in channelList"
                  :key="item.channelId"
                  :label="item.channelName"
                  :value="item.channelId">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row style="margin-bottom: 10px;">
            <el-col :span="2" style="text-align: right;">
              <span class="organization-span">渠道类型：</span>
            </el-col>
            <el-col :span="9">
              <el-input v-model="channelContent.channelType" readonly > </el-input>
            </el-col>
            <el-col :span="3" style="text-align: right;">
              <span class="organization-span">渠道状态：</span>
            </el-col>
            <el-col :span="9">
              <el-input v-model="channelContent.dealerStatus" readonly > </el-input>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="2" style="text-align: right;">
              <span class="organization-span">渠道联系人：</span>
            </el-col>
            <el-col :span="9">
              <el-input v-model="channelContent.person" readonly > </el-input>
            </el-col>
            <el-col :span="3" style="text-align: right;">
              <span class="organization-span">渠道联系人电话：</span>
            </el-col>
            <el-col :span="9">
              <el-input v-model="channelContent.mobile" readonly > </el-input>
            </el-col>
          </el-row>
          <el-tabs type="border-card" style="margin:20px 4%;height: calc(60vh);">

            <el-tab-pane label="增加渠道">
              <div style="padding: 20px;">
                <el-row style="margin-bottom: 20px;">
                  <el-col :span="3">
                    <span class="organization-span">渠道标识：</span>
                  </el-col>
                  <el-col :span="20">
                    <el-input
                      v-model="addChannelInfo.remaek1">
                    </el-input>
                  </el-col>
                </el-row>
                <el-row style="margin-bottom: 20px;">
                  <el-col :span="3">
                    <span class="organization-span">渠道名称：</span>
                  </el-col>
                  <el-col :span="20">
                    <el-input v-model="addChannelInfo.channelName"></el-input>
                  </el-col>
                </el-row>
                <el-row style="margin-bottom: 20px;">
                  <el-col :span="3">
                    <span class="organization-span">渠道联系人电话：</span>
                  </el-col>
                  <el-col :span="20">
                    <el-input v-model="addChannelInfo.mobile"></el-input>
                  </el-col>
                </el-row>
                <el-row style="margin-bottom: 20px;">
                  <el-col :span="3">
                    <span class="organization-span">渠道联系人：</span>
                  </el-col>
                  <el-col :span="20">
                    <el-input v-model="addChannelInfo.person"></el-input>
                  </el-col>
                </el-row>
                <el-row style="margin-bottom: 20px;">
                  <el-col :span="3">
                    <span class="organization-span">渠道类型：</span>
                  </el-col>
                  <el-col :span="20">
                    <el-select v-model="addChannelInfo.channelType" style="width: 100%" filterable placeholder="请选择">
                      <el-option label="渠道" value="1"></el-option>
                      <el-option label="项目" value="2"></el-option>
                      <el-option label="部门" value="3"></el-option>
                    </el-select>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col style="text-align: center">
                    <el-button type="primary" @click="addChannel">创建</el-button>
                  </el-col>
                </el-row>

              </div>
            </el-tab-pane>

            <el-tab-pane label="修改渠道">
              <div style="padding: 20px;">
                <el-row style="margin-bottom: 20px;">
                  <el-col :span="3">
                    <span class="organization-span">渠道名称：</span>
                  </el-col>
                  <el-col :span="20">
                    <el-input
                      v-model="editChannelInfo.name">
                    </el-input>
                  </el-col>
                </el-row>
                <el-row style="margin-bottom: 20px;">
                  <el-col :span="3">
                    <span class="organization-span">渠道状态：</span>
                  </el-col>
                  <el-col :span="20">
                    <el-input
                      v-model="editChannelInfo.type">
                    </el-input>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col style="text-align: center">
                    <el-button type="primary" @click="editChannel">修改</el-button>
                  </el-col>
                </el-row>
              </div>
            </el-tab-pane>
            <el-tab-pane label="删除渠道">
              <div style="padding: 20px;">
                <el-row style="margin-bottom: 20px;">
                  <el-col :span="3">
                    <span class="organization-span">渠道名称：</span>
                  </el-col>
                  <el-col :span="20">
                    <el-input
                      v-model="channelContent.channelName" readonly>
                    </el-input>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col style="text-align: center">
                    <el-button type="danger" @click="delChannel">删除</el-button>
                  </el-col>
                </el-row>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>

        <el-tab-pane label="发展人信息">
          <el-row style="margin-bottom: 10px;">
            <el-col :span="2" style="text-align: right;">
              <span class="organization-span">选择发展人：</span>
            </el-col>
            <el-col :span="21">
              <el-select v-model="developValue" style="width: 100%" filterable placeholder="请选择">
                <el-option
                  v-for="item in developList"
                  :key="item.devPeopleId"
                  :label="item.devPeopleName"
                  :value="item.devPeopleId">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row style="margin-bottom: 10px;">
            <el-col :span="2" style="text-align: right;">
              <span class="organization-span">发展人电话：</span>
            </el-col>
            <el-col :span="9">
              <el-input v-model="developContent.mobile" readonly > </el-input>
            </el-col>
            <el-col :span="3" style="text-align: right;">
              <span class="organization-span">发展人邮编：</span>
            </el-col>
            <el-col :span="9">
              <el-input v-model="developContent.postal" readonly > </el-input>
            </el-col>
          </el-row>
          <el-tabs type="border-card" style="margin:20px 4%;height: calc(60vh);">

            <el-tab-pane label="增加发展人">
              <div style="padding: 20px;">
                <el-row style="margin-bottom: 20px;">
                  <el-col :span="3">
                    <span class="organization-span">发展人标识标识：</span>
                  </el-col>
                  <el-col :span="20">
                    <el-input v-model="addDevelopInfo.remaek1">
                    </el-input>
                  </el-col>
                </el-row>
                <el-row style="margin-bottom: 20px;">
                  <el-col :span="3">
                    <span class="organization-span">发展人名称：</span>
                  </el-col>
                  <el-col :span="20">
                    <el-input v-model="addDevelopInfo.devPeopleName">
                    </el-input>
                  </el-col>
                </el-row>
                <el-row style="margin-bottom: 20px;">
                  <el-col :span="3">
                    <span class="organization-span">发展人电话：</span>
                  </el-col>
                  <el-col :span="20">
                    <el-input v-model="addDevelopInfo.mobile">
                    </el-input>
                  </el-col>
                </el-row>
                <el-row style="margin-bottom: 20px;">
                  <el-col :span="3">
                    <span class="organization-span">发展人邮编：</span>
                  </el-col>
                  <el-col :span="20">
                    <el-input v-model="addDevelopInfo.postal">
                    </el-input>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col style="text-align: center">
                    <el-button type="primary" @click="addDevelop">创建</el-button>
                  </el-col>
                </el-row>
              </div>
            </el-tab-pane>

            <el-tab-pane label="修改发展人">
              <div style="padding: 20px;">
                <el-row style="margin-bottom: 20px;">
                  <el-col :span="3">
                    <span class="organization-span">发展人名称：</span>
                  </el-col>
                  <el-col :span="20">
                    <el-input v-model="editDevelopInfo.devPeopleName">
                    </el-input>
                  </el-col>
                </el-row>
                <el-row style="margin-bottom: 20px;">
                  <el-col :span="3">
                    <span class="organization-span">发展人电话：</span>
                  </el-col>
                  <el-col :span="20">
                    <el-input v-model="editDevelopInfo.mobile">
                    </el-input>
                  </el-col>
                </el-row>
                <el-row style="margin-bottom: 20px;">
                  <el-col :span="3">
                    <span class="organization-span">发展人邮编：</span>
                  </el-col>
                  <el-col :span="20">
                    <el-input v-model="editDevelopInfo.postal">
                    </el-input>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col style="text-align: center">
                    <el-button type="primary" @click="editDevelop">修改</el-button>
                  </el-col>
                </el-row>
              </div>
            </el-tab-pane>
            <el-tab-pane label="删除发展人">
              <div style="padding: 20px;">
                <el-row style="margin-bottom: 20px;">
                  <el-col :span="3">
                    <span class="organization-span">发展人名称：</span>
                  </el-col>
                  <el-col :span="20">
                    <el-input v-model="developContent.devPeopleName" readonly>
                    </el-input>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col style="text-align: center">
                    <el-button type="danger" @click="delDevelop">删除</el-button>
                  </el-col>
                </el-row>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>

      </el-tabs>
    </el-main>
  </el-container>
</template>

<script>
  import { fetchOrgList,channelAndDeveList,fetchAddchannel,fetchEditchannel,fetchDelchannel,fetchAdddevelop,fetchEditdevelop,fetchDeldevelop } from '@/api/limits-authority'
    export default {
        name: "channel-management ",
      data() {
        return {
          treeLoading:false,
          wgInfo:{},
          filterText: '',
          channelContent:{},
          developContent:{},
          input2:'',
          data: [],
          defaultProps: {
            children: 'children',
            label: 'label'
          },
          channelList: [],
          channelValue:'',
          developList: [],
          developValue:'',
          editChannelInfo:{
            name:'',
            type:''
          },
          editDevelopInfo:{
            devPeopleName:'',
            mobile:'',
            postal:'',
          },
          addChannelInfo:{
            remaek1:'',
            channelName:'',
            mobile:'',
            person:'',
            channelType:''
          },
          addDevelopInfo:{
            remaek1:'',
            devPeopleName:'',
            mobile:'',
            postal:'',
          }
        };
      },
      watch: {
        filterText(val) {
          this.$refs.tree.filter(val);
        },
        channelValue(val){
          let list = this.channelList;
          for(let i=0;i<list.length;i++){
            if (list[i].channelId === val){
              this.channelContent = list[i];
              this.editChannelInfo.name = list[i].channelName;
              this.editChannelInfo.type = list[i].channelType;
              return
            }
          }
        },
        developValue(val){
          let list = this.developList;
          for(let i=0;i<list.length;i++){
            if (list[i].devPeopleId === val){
              this.developContent = list[i];
              this.editDevelopInfo.devPeopleName = list[i].devPeopleName;
              this.editDevelopInfo.mobile = list[i].mobile;
              this.editDevelopInfo.postal = list[i].postal;
              return
            }
          }
        }
      },
      created(){
        this.fetchList();
      },
      methods: {
        delDevelop(){
          if(this.developContent.devPeopleName===undefined||this.developContent.devPeopleName===null||this.developContent.devPeopleName===''){
            return;
          }
          let param = this.developContent;
          param.children=[];
          fetchDeldevelop(param).then(response => {
            let type = response.resultState;
            if(type === '1') {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.editDevelopInfo={
                devPeopleName:'',
                mobile:'',
                postal:'',
              };
              this.developContent={};
              this.developValue = '';
              channelAndDeveList(this.wgInfo).then(response => {
                this.channelList = response.channel;
                this.developList = response.develop;
              }).catch(err => {
                console.log(err)
              })
            }
          }).catch(err => {
            console.log(err)
          })
        },
        delChannel(){
          if(this.channelContent.channelName===undefined||this.channelContent.channelName===null||this.channelContent.channelName===''){
            return;
          }
          let param = this.channelContent;
          param.children=[];
          fetchDelchannel(param).then(response => {
            let type = response.resultState;
            if(type === '1') {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.editChannelInfo={
                name:'',
                type:''
              };
              this.channelContent={};
              this.channelValue = '';
              channelAndDeveList(this.wgInfo).then(response => {
                this.channelList = response.channel;
                this.developList = response.develop;
              }).catch(err => {
                console.log(err)
              })
            }
          }).catch(err => {
            console.log(err)
          })
        },
        editDevelop(){
          if(this.developContent.devPeopleName===undefined||this.developContent.devPeopleName===null||this.developContent.devPeopleName===''){
            return;
          }
          let param = this.developContent;
          param.devPeopleName = this.editDevelopInfo.devPeopleName;
          param.mobile = this.editDevelopInfo.mobile;
          param.postal = this.editDevelopInfo.postal;
          param.children=[];
          fetchEditdevelop(param).then(response => {
            let type = response.resultState;
            if(type === '1') {
              this.$message({
                message: '修改成功',
                type: 'success'
              });
            }
          }).catch(err => {
            console.log(err)
          })
        },
        editChannel(){
          if(this.channelContent.channelName===undefined||this.channelContent.channelName===null||this.channelContent.channelName===''){
            return;
          }
          let param = this.channelContent;
          param.channelName = this.editChannelInfo.name;
          param.dealerStatus = this.editChannelInfo.type;
          param.children=[];
          fetchEditchannel(param).then(response => {
            let type = response.resultState;
            if(type === '1') {
              this.$message({
                message: '修改成功',
                type: 'success'
              });
            }
          }).catch(err => {
            console.log(err)
          })
        },
        fetchList(){
          this.treeLoading = true;
            fetchOrgList().then(response => {
              this.data = response
              this.treeLoading = false;
            }).catch(err => {
              console.log(err)
            })
        },
        addDevelop(){
          let param = {};
          let addInfo = this.addDevelopInfo
          param.addData = addInfo;
          if(addInfo.remaek1 ==='' || addInfo.devPeopleName ==='' || addInfo.mobile ==='' || addInfo.postal ===''){
            this.$message({
              message: '请填写全部信息',
              type: 'warning'
            });
            return
          }
          param.data = this.wgInfo;
          param.children=[];
          fetchAdddevelop(param).then(response => {
            let type = response.resultState;
            if(type === '1') {
              this.$message({
                message: '添加成功',
                type: 'success'
              });
              this.addChannelInfo={
                remaek1:'',
                devPeopleName:'',
                mobile:'',
                postal:'',
              }
              channelAndDeveList(this.wgInfo).then(response => {
                this.channelList = response.channel;
                this.developList = response.develop;
              }).catch(err => {
                console.log(err)
              })
            }
          }).catch(err => {
            console.log(err)
          })
        },
        addChannel(){
          let param = {};
          let addInfo = this.addChannelInfo
          param.addData = addInfo;
          if(addInfo.remaek1 ==='' || addInfo.channelName ==='' || addInfo.mobile ==='' || addInfo.person ==='' || addInfo.channelType ===''){
            this.$message({
              message: '请填写全部信息',
              type: 'warning'
            });
            return
          }
          param.data = this.wgInfo;
          param.children=[];
          fetchAddchannel(param).then(response => {
            let type = response.resultState;
            if(type === '1') {
              this.$message({
                message: '添加成功',
                type: 'success'
              });
              this.addChannelInfo={
                remaek1:'',
                  channelName:'',
                  mobile:'',
                  person:'',
                  channelType:''
              }
              channelAndDeveList(this.wgInfo).then(response => {
                this.channelList = response.channel;
                this.developList = response.develop;
              }).catch(err => {
                console.log(err)
              })
            }
          }).catch(err => {
            console.log(err)
          })

        },
        filterNode(value, data) {
          if (!value) return true;
          return data.label.indexOf(value) !== -1;
        },
        clickNode(obj, node,data){
          this.developValue = '';
          this.channelValue = '';
          this.editChannelInfo={
            name:'',
              type:''
          }
          this.editDevelopInfo={
            devPeopleName:'',
              mobile:'',
              postal:'',
          }
          this.addChannelInfo={
            remaek1:'',
              channelName:'',
              mobile:'',
              person:'',
              channelType:''
          }
          this.addDevelopInfo={
            remaek1:'',
              devPeopleName:'',
              mobile:'',
              postal:'',
          }
          this.channelContent={}
          this.developContent={}
          this.wgInfo = obj;
          this.channelList = []
          channelAndDeveList(obj).then(response => {
            this.channelList = response.channel;
            this.developList = response.develop;
          }).catch(err => {
            console.log(err)
          })
        }
      },
    }
</script>

<style scoped>
.organization-span{
  line-height: 36px;
  font-size: 14px;
}
</style>
