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
        node-key="id"
        :data="data"
        :props="defaultProps"
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        @node-click="clickNode"
        ref="tree">
      </el-tree>
    </el-aside>
    <el-main>

      <el-row style="margin-bottom: 10px;">
        <el-col :span="2" style="text-align: right;">
          <span class="organization-span">名称：</span>
        </el-col>
        <el-col :span="9">
          <el-input v-model="formLabelAlign.label" readonly > </el-input>
        </el-col>
        <el-col :span="3" style="text-align: right;">
          <span class="organization-span">上级标识：</span>
        </el-col>
        <el-col :span="9">
          <el-input v-model="formLabelAlign.parentId" readonly > </el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="2" style="text-align: right;">
          <span class="organization-span">等级：</span>
        </el-col>
        <el-col :span="9">
          <el-input v-model="formLabelAlign.level" readonly > </el-input>
        </el-col>
        <el-col :span="3" style="text-align: right;">
          <span class="organization-span">状态：</span>
        </el-col>
        <el-col :span="9">
          <el-input v-model="formLabelAlign.orgState" readonly > </el-input>
        </el-col>
      </el-row>
      <el-tabs type="border-card" style="margin:20px 4%;height: calc(60vh);">

        <el-tab-pane label="增加组织机构">
          <div style="padding: 20px;">
            <el-row style="margin-bottom: 20px;">
              <el-col :span="3">
                <span class="organization-span">组织机构标识：</span>
              </el-col>
              <el-col :span="20">
                <el-input
                  v-model="addOrg.addId">
                </el-input>
              </el-col>
            </el-row>
            <el-row style="margin-bottom: 20px;">
              <el-col :span="3">
                <span class="organization-span">组织机构名称：</span>
              </el-col>
              <el-col :span="20">
                <el-input
                  v-model="addOrg.addLabel">
                </el-input>
              </el-col>
            </el-row>
            <el-row>
              <el-col style="text-align: center">
                <el-button type="primary" @click="addOrgButton">提交</el-button>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>

        <el-tab-pane label="修改组织机构">
          <div style="padding: 20px;">
            <el-row style="margin-bottom: 20px;">
              <el-col :span="3">
                <span class="organization-span">组织机构名称：</span>
              </el-col>
              <el-col :span="20">
                <el-input
                  v-model="editOrg.label">
                </el-input>
              </el-col>
            </el-row>
            <el-row style="margin-bottom: 20px;">
              <el-col :span="3">
                <span class="organization-span">组织机构状态：</span>
              </el-col>
              <el-col :span="20">
                <el-input
                  v-model="editOrg.type">
                </el-input>
              </el-col>
            </el-row>
            <el-row>
              <el-col style="text-align: center">
                <el-button type="primary" @click="editOrgButton">提交</el-button>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>
        <el-tab-pane label="删除组织机构">
          <div style="padding: 20px;">
            <el-row style="margin-bottom: 20px;">
              <el-col :span="3">
                <span class="organization-span">组织机构名称：</span>
              </el-col>
              <el-col :span="20">
                <el-input
                  v-model="formLabelAlign.label" readonly>
                </el-input>
              </el-col>
            </el-row>
            <el-row>
              <el-col style="text-align: center">
                <el-button type="danger" @click="delOrgButton">删除</el-button>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>
      </el-tabs>

    </el-main>
  </el-container>
</template>

<script>
    import { fetchOrgList,addOrg,editOrg,delOrg } from '@/api/limits-authority'
    export default {
        name: "organization",
      data() {
        return {
          treeLoading:false,
          addOrg:{
            addId:'',
            addLabel:''
          },
          filterText: '',
          formLabelAlign:{},
          editOrg:{
            type:'',
            label:''
          },
          input2:'',
          data: [
          ],
          defaultProps: {
            children: 'children',
            label: 'label'
          }
        };
      },
      watch: {
        filterText(val) {
          this.$refs.tree.filter(val);
        }
      },
      created(){
          this.fetchList();
      },
      methods: {
        fetchList(){
          this.treeLoading = true;
          fetchOrgList().then(response => {
            this.data = response
            this.treeLoading = false;
          }).catch(err => {
            console.log(err)
          })
        },
        filterNode(value, data) {
          if (!value) return true;
          return data.label.indexOf(value) !== -1;
        },
        clickNode(obj, node,data){
          this.formLabelAlign = obj;
          this.editOrg.label = obj.label;
          this.editOrg.type = obj.orgState;
        },
        delOrgButton(){
          let param = this.formLabelAlign;
          if (param.id===undefined){
            return
          }
          param.children=[];
          delOrg(param).then(response => {
            let type = response.resultState;
            if(type === '1'){
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.editOrg={
                type:'',
                label:''
              };
              this.addOrg={
                addId:'',
                addLabel:''
              }
              this.fetchList();
              this.formLabelAlign = {};
            }
          }).catch(err => {
            console.log(err)
          })
        },
        editOrgButton(){
          let param = this.formLabelAlign;
          if (param.id===undefined){
            return
          }else if (this.editOrg.label === ''){
            this.$message({
              message: '请填写组织机构名称',
              type: 'warning'
            });
            return
          }else if (this.editOrg.type === ''){
            this.$message({
              message: '请填写组织机构状态',
              type: 'warning'
            });
            return
          }
          param.label = this.editOrg.label;
          param.orgState = this.editOrg.type;
          param.children=[];
          editOrg(param).then(response => {
            let type = response.resultState;
            if(type === '1'){
              this.$message({
                message: '修改成功',
                type: 'success'
              });
              this.fetchList();
            }
          }).catch(err => {
            console.log(err)
          })
        },
        addOrgButton(){
          let param = this.formLabelAlign;
          if (param.id===undefined){
            return
          }else if (this.addOrg.addId === ''){
            this.$message({
              message: '请填写组织机构标识',
              type: 'warning'
            });
            return
          }else if (this.addOrg.addLabel === ''){
            this.$message({
              message: '请填写组织机构名称',
              type: 'warning'
            });
            return
          }
          param.addId = this.addOrg.addId;
          param.addLabel=this.addOrg.addLabel;
          param.children=[];
          addOrg(param).then(response => {
            let type = response.resultState;
            if(type === '1'){
              this.$message({
                message: '添加成功',
                type: 'success'
              });
              this.fetchList();
              this.addOrg={
                addId:'',
                addLabel:''
              }
            }
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
}
</style>
