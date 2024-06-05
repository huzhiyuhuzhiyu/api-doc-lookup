<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div class="JNPF-common-page-header">
        <!-- <el-page-header @back="goBack" :content="!parentId ? $t(`customer.addCustomer`) : $t(`customer.editCustomer`)" v-show="!btnType"/> -->
        <el-page-header @back="goBack" :content="btnType ? '查看仓库档案' : !parentId ? '新建仓库档案' : '编辑仓库档案'" />
        <div class="options" v-if="!btnType">
          <el-button type="primary" :loading="btnLoading" @click="handleConfirm()">{{ $t('common.submitButton')
          }}</el-button>
          <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main" v-loading="formLoading">

        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="基础信息" name="jcInfo">

            <el-form ref="dataForm" :model="stockWarehouse" :rules="dataRule" label-width="160px" label-position="top">
              <el-row :gutter="30" class="custom-row">
                <el-col :sm="8" :xs="24">
                  <el-form-item label="仓库类型" prop="type">
                    <el-select v-model="stockWarehouse.type" placeholder="请选择仓库类型" style="width: 100%;"
                      :disabled="editFlag" @change="selectWarehouse">
                      <el-option v-for="(item, index) in typeList" :key="index" :label="item.label"
                        :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="上级仓库" prop="partnerCategoryId">

                    <ComSelect-list :isdisabled="isdisabled" :value="stockWarehouse.partnerCategoryIdText"
                      placeholder="请选择上级仓库" auth @change="onOrganizeChange" :title="'选择仓库'" :method="getWarehouseList"
                      :requestObj="requestObj2" :paramsObj="{}" />
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="仓库编码" prop="code">
                    <el-input v-model="stockWarehouse.code" placeholder="请输入仓库编码" maxlength="20"
                      :disabled="btnType ? true : false" clearable />
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="仓库名称" prop="name">
                    <el-input v-model="stockWarehouse.name" placeholder="请输入仓库名称" :disabled="btnType ? true : false"
                      maxlength="20" clearable />
                  </el-form-item>
                </el-col>

                <el-col :sm="8" :xs="24">
                  <el-form-item label="位置" prop="position">
                    <el-input v-model="stockWarehouse.position" placeholder="请输入位置" :disabled="btnType ? true : false"
                      maxlength="100" clearable />
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="排序值" prop="sort">
                    <el-input v-model="stockWarehouse.sort" placeholder="请输入排序值" maxlength="9"
                      :disabled="btnType ? true : false" clearable />
                  </el-form-item>
                </el-col>

                <el-col :sm="8" :xs="24">
                  <el-form-item label="备注" prop="remark">
                    <el-input v-model="stockWarehouse.remark" placeholder="请输入备注" maxlength="200"
                      :disabled="btnType ? true : false" clearable />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="权限信息" name="权限信息">
            <el-table :data="stockLimitsAuthorities" style="width: 100%">
              <el-table-column prop="userName" label="姓名" width="180">
                <template slot="header">
                  <span class="required">*</span>姓名
                </template>
                <!-- <template slot-scope="scope">
                  <el-input empty="true" readonly v-model="scope.row.userName" placeholder="请选择人员"
                    :disabled="btnType ? true : false" @focus="partTypesClick(scope)">

                  </el-input>
                </template> -->
              </el-table-column>
              <el-table-column prop="orgName" label="部门"></el-table-column>
              <el-table-column prop="remark" label="备注">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.remark" :disabled="btnType ? true : false" maxlength="200"
                    placeholder="输入备注">{{
                      scope.row.remark }}
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" v-if="!btnType">
                <template slot-scope="scope">
                  <el-button @click="deltable(scope)" v-if="!btnType" type="text"
                    style="color:rgb(245,108,108)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="table-actions" @click="addtable()" v-if="!btnType">
              <el-button type="text" icon="el-icon-plus">添加</el-button>

            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <user-select ref="userselect" v-show="false" :multiple="true" @change="hangleSelectSales"></user-select>
      <!-- <el-dialog :title="title" :close-on-click-modal="false" :visible.sync="visible"
        class="JNPF-dialog JNPF-dialog_center transfer-dialog" lock-scroll append-to-body width="800px"
        :modal-append-to-body="false" @close="onClose">
        <div class="transfer__body">
          <div class="transfer-pane">
            <div class="transfer-pane__tools">
              <el-input placeholder="请输入关键词查询" v-model="keyword" @keyup.enter.native="getData" clearable
                class="search-input">
                <el-button slot="append" icon="el-icon-search" @click="getData"></el-button>
              </el-input>
            </div>
            <div class="transfer-pane__body left-pane">
              <el-tabs v-model="activeNamerepson" class="transfer-pane__body-tab" :class="{ 'hasSys-tab': hasSys }"
                v-if="selectType === 'all'">
                <el-tab-pane label="全部数据" name="all">
                  <el-tree :data="treeData" :props="props" check-on-click-node @node-click="handleNodeClick"
                    class="JNPF-common-el-tree" node-key="id" v-loading="loading" lazy :load="loadNode">
                    <span class="custom-tree-node" slot-scope="{ node, data }">
                      <i :class="data.icon"></i>
                      <span class="text">{{ node.label }}</span>
                    </span>
                  </el-tree>
                </el-tab-pane>
                <el-tab-pane label="当前组织" name="department">
                  <el-tree :data="treeData2" :props="props" :expand-on-click-node="false" check-on-click-node
                    @node-click="handleNodeClick2" class="JNPF-common-el-tree" node-key="id" v-loading="loading">
                    <span class="custom-tree-node" slot-scope="{ node }">
                      <i class="icon-ym icon-ym-tree-user2"></i>
                      <span class="text">{{ node.label }}</span>
                    </span>
                  </el-tree>
                </el-tab-pane>
                <el-tab-pane label="我的下属" name="subordinates">
                  <el-tree :data="treeData3" :props="props" :expand-on-click-node="false" check-on-click-node
                    @node-click="handleNodeClick2" class="JNPF-common-el-tree" node-key="id" v-loading="loading">
                    <span class="custom-tree-node" slot-scope="{ node }">
                      <i class="icon-ym icon-ym-tree-user2"></i>
                      <span class="text">{{ node.label }}</span>
                    </span>
                  </el-tree>
                </el-tab-pane>

              </el-tabs>
            </div>
          </div>
          <div class="transfer-pane">
            <div class="transfer-pane__tools">
              <span>已选</span>
              <el-button @click="removeAll" type="text" class="removeAllBtn">清空列表</el-button>
            </div>
            <div class="transfer-pane__body shadow right-pane">
              <template v-if="selectedData.length">
                <div v-for="(item, index) in selectedData" :key="index" class="selected-item-user">
                  <div class="selected-item-main">
                    <el-avatar :size="36" :src="define.comUrl + item.headIcon" class="selected-item-headIcon">
                    </el-avatar>
                    <div class="selected-item-text">
                      <p class="name">{{ item.fullName }}
                        <i class="el-icon-delete" @click="removeData(index)"></i>
                      </p>
                      <p class="organize" :title="item.organize">{{ item.organize }}</p>
                    </div>
                  </div>
                </div>
              </template>
              <el-empty description="暂无数据" :image-size="120" v-else></el-empty>
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
          <el-button type="primary" @click="confirm">{{ $t('common.confirmButton') }}</el-button>
        </span>
      </el-dialog> -->
    </div>
  </transition>
</template>

<script>
import { getImUserSelector, getUserInfoList, getSubordinates, getOrganization, getUsersByUserCondition } from '@/api/permission/user'
import { addWarehouse, editWarehouse, getWarehouseInfo, checWarehouseCode } from '@/api/basicData/index'
import { getWarehouseList } from '@/api/basicData/index'
export default {
  data() {
    return {
      title: "选择人员",
      visible: false,
      getWarehouseList,
      activeNamerepson: "",
      typeList: [
        {
          label: "正常仓库",
          value: "normal",
        }, {
          label: "报废仓库",
          value: "scrap",
        },
      ],
      typeFlag: undefined,
      editFlag: undefined,
      btnType: undefined,
      listQuery: {
        keyword: ''
      },
      activeName: "jcInfo",
      nodeId: -1,
      isdisabled: false,
      btnLoading: false,
      formLoading: false,
      stockWarehouse: {
        code: "",
        name: "",
        // type: "",
        position: "",
        sort: "0",
        remark: "",
        parentId: "",
        id: "",
        partnerCategoryIdText: "",
        type: ""
      },

      stockLimitsAuthorities: [],
      requestObj2: {
        name: "",
        code: "",
        noId: "",
        type: "",
      },
      parentId: '',
      dataRule: {
        // type: [
        //   { required: true, message: '类型不能为空', trigger: 'change' }
        // ],
        sort: [
          { validator: this.formValidate('number'), trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入仓库编码', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              checWarehouseCode(value, this.stockWarehouse.id).then(res => {
                if (res.data) {
                  callback(new Error("编码重复"));
                } else {
                  callback();
                }
              }).catch(error => {
              })
            }, trigger: 'blur'
          },
        ],
        name: [
          { required: true, message: '请输入仓库名称', trigger: 'blur' }
        ],
      },
      pageType: "",
      selectType: 'all',
      selectedData: [],
      hasSys: false,
      treeData: [],
      treeData2: [],
      treeData3: [],
      innerValue: '',
      props: {
        children: 'children',
        label: 'fullName',
        isLeaf: 'isLeaf'
      },
      loading: false,
      keyword: '',
      index: null,
      value: [],
      userId: "",
      responSelectData: {}
    }
  },
  watch: {
    value(val) {
      this.setDefault()
    },
    selectDisabled() {
      this.$nextTick(() => {
        this.resetInputHeight();
      });
    },
    activeNamerepson(val) {
      this.keyword = ''
      if (!val) return
      this.nodeId = '0'
      this.treeData = []
      this.treeData2 = []
      this.treeData3 = []
      this.getData()
    }
  },
  created() {

  },
  methods: {
    //批量选择人员
    hangleSelectSales(val,data){
      if(!data.length) return
      data.map(item=>{
        item.fullName=item.fullName.split('/')[0]
        this.stockLimitsAuthorities.push(
          {
            userName:item.fullName,
            userId:item.id,
            orgName:item.organize,
            remark:''
          }
        )
      })
    },
    // 选择类型
    selectWarehouse(e) {
      console.log(e)
      this.stockWarehouse.type = e
      this.stockWarehouse.parentId = ""
      this.stockWarehouse.partnerCategoryIdText = ""
      this.requestObj2.type = e
    },
    deltable(row, index) {
      this.stockLimitsAuthorities.splice(row.$index, 1)
    },
    partTypesClick(scope) {
      this.index = scope.$index
      this.userId = scope.row.userId
      this.visible = true
      this.selectedData = []
      if (this.selectType === 'all') {
        this.activeNamerepson = 'all'
        this.setDefault()
      }
    },
    removeData(index) {
      this.selectedData.splice(index, 1)
    },
    setDefault() {
      if (!this.userId) return
      let userId = [];
      userId.push(this.userId)
      getUserInfoList(userId).then(res => {
        this.selectedData = res.data.list
        // if (hasSysItem) {
        //   this.selectedData.push({
        //     id: 'currentUser',
        //     fullName: '当前用户',
        //     headIcon: '/api/file/Image/userAvatar/001.png'
        //   })
        // }
        if (this.multiple) {
          this.innerValue = ''
          this.tagsList = JSON.parse(JSON.stringify(this.selectedData))
        } else {
          this.innerValue = this.selectedData.length ? this.selectedData[0].fullName : ''
        }
        this.$nextTick(() => {
          if (this.multiple) {
            this.resetInputHeight();
          }
        });
      })
    },
    handleNodeClick(data) {
      if (data.type !== 'user') return
      this.handleNodeClick2(data)
    },
    handleNodeClick2(data) {
      const boo = this.selectedData.some(o => o.id === data.id)
      if (boo) return
      this.multiple ? this.selectedData.push(data) : this.selectedData = [data]
    },
    confirm() {
      if (this.selectedData.length < 1) {
        this.stockLimitsAuthorities[this.index].userName = ""
        this.stockLimitsAuthorities[this.index].remark = ""
        this.stockLimitsAuthorities[this.index].userId = ""
        this.stockLimitsAuthorities[this.index].orgName = ""
        this.stockLimitsAuthorities[this.index].warehouseId = this.stockWarehouse.id

      } else {
        this.innerValue = this.selectedData[0].fullName
        let selectedIds = this.selectedData.map(o => o.id)
        this.responSelectData = this.selectedData[0]
        // if(!this.index){
        //   let ids=this.stockLimitsAuthorities.length-1;
        //   this.stockLimitsAuthorities[ids].userName=this.responSelectData.fullName.split('/')[0]
        //   this.stockLimitsAuthorities[ids].userId=this.responSelectData.id
        //   this.stockLimitsAuthorities[ids].orgName=this.responSelectData.organize
        // }else{
        this.stockLimitsAuthorities[this.index].userName = this.responSelectData.fullName.split('/')[0]
        this.stockLimitsAuthorities[this.index].userId = this.responSelectData.id
        this.stockLimitsAuthorities[this.index].orgName = this.responSelectData.organize
      }

      // }
      this.visible = false
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
        this.nodeId = '0'
        return resolve(this.treeData)
      }
      this.nodeId = node.data.id
      getImUserSelector(this.nodeId).then(res => {
        resolve(res.data.list)
      })
    },
    getAllList() {
      this.loading = true
      if (this.keyword) this.nodeId = '0'
      getImUserSelector(this.nodeId, this.keyword).then(res => {
        this.treeData = res.data.list
        this.loading = false
      })
    },
    getData() {
      if (this.selectType === 'all') {
        if (this.activeNamerepson === 'all') {
          this.getAllList()
        } else if (this.activeNamerepson === 'department') {
          this.loading = true
          getOrganization({ keyword: this.keyword, organizeId: '0' }).then(res => {
            this.treeData2 = res.data
            this.loading = false
          })
        } else if (this.activeNamerepson === 'subordinates') {
          this.loading = true
          getSubordinates(this.keyword).then(res => {
            this.treeData3 = res.data
            this.loading = false
          })
        } else {
          this.loading = false
        }
      }
      if (this.selectType === 'custom') {
        this.pagination.keyword = this.keyword
        this.pagination.currentPage = 1
        this.finish = false
        this.ableList = []
        this.getAbleList()
      }
    },
    onClose() {
      this.activeNamerepson = ''
    },
    removeAll() {
      this.selectedData = []
    },
    addtable() {
      this.$refs.userselect.openDialog()
      return
      this.visible = true;
      this.index = this.stockLimitsAuthorities.length
      this.stockLimitsAuthorities.push({
        userName: "",
        remark: "",
        warehouseId: this.stockWarehouse.id,
        userId: "",
        orgName: ""
      })
      if (this.selectType === 'all') {
        this.activeNamerepson = 'all'
        this.setDefault()
      }
    },




    // 切换table
    handleClick(tab, event) {
      console.log(tab, event);
    },
    handleChange(d, val, $event) {
      console.log(d, val, $event);
    },



    init(id, parentId, btnType) {
      console.log(1,id,parentId,btnType);
      this.stockWarehouse.id = id || ''
      this.parentId = parentId || ''
      this.pageType = btnType
      if (id) {
        this.requestObj2.noId = id
        getWarehouseInfo(id).then(res => {
          this.stockWarehouse.code = res.data.code
          this.stockWarehouse.id = res.data.id
          this.stockWarehouse.name = res.data.name
          this.stockWarehouse.parentId = res.data.parentId == '-1' ? '' : res.data.parentId
          this.stockWarehouse.position = res.data.position
          this.stockWarehouse.remark = res.data.remark
          this.stockWarehouse.sort = res.data.sort
          this.stockWarehouse.type = res.data.type
          this.requestObj2.type = res.data.type

          this.stockLimitsAuthorities = res.data.stockLimitsAuthorities
          this.stockWarehouse.partnerCategoryIdText = res.data.parentName
          if (this.stockWarehouse.parentId) {
            console.log("'this.stockWarehouse.parentId',", this.stockWarehouse.parentId);
            this.editFlag = true
          }
        })

      }
      if (btnType == 'look') {
        this.isdisabled = true
        this.editFlag = true
        this.btnType = true
      } else if (btnType == 'edit') {
        this.editFlag = true
        this.isdisabled = false

      } else {
        this.isdisabled = false
        this.editFlag = false
        this.stockWarehouse.type = 'normal'
        this.requestObj2.type = 'normal'
        this.$forceUpdate()
      }
      console.log(this.editFlag,this.stockWarehouse);

    },
    goBack() {
      this.$emit('close')
    },
    onOrganizeChange(val, data) {
      console.log(val, data);
      if (!this.stockWarehouse.type) {
        this.$message({
          message: "请先选择仓库类型",
          type: "error"
        })
        return
      }

      if (!val && !data.length) {
        this.stockWarehouse.parentId = '-1'
        return this.stockWarehouse.partnerCategoryIdText = ''
      }
      this.stockWarehouse.parentId = data ? data[0].id : '-1'
      this.parentId = data ? data[0].id : ''
      this.stockWarehouse.partnerCategoryIdText = data ? data[0].name : ''
      this.stockWarehouse.type = data ? data[0].all.type : ''
      console.log("this.stockWarehouse.type", this.stockWarehouse.type);
      this.$forceUpdate()
    },
    handleConfirm() {
      let flag = null;
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let obj = {
            stockWarehouse: this.stockWarehouse,
            stockLimitsAuthorities: this.stockLimitsAuthorities
          }
          this.stockLimitsAuthorities.forEach((item, index) => {
            item.id = ""
            if (!item.userName) {
              flag = false

              return this.$message({
                message: "请选择人员",
                type: 'error',
                duration: 1500,
              })
            }
          });
          if (flag === false) return
          let requestHead = null;
          if (this.stockWarehouse.id) {
            requestHead = editWarehouse
          } else {
            requestHead = addWarehouse
          }
          this.btnLoading = true
          requestHead(obj).then(res => {
            let msg = "";
            if (requestHead == editWarehouse) {
              msg = "修改成功"
            } else {
              msg = "新建成功"
            }
            this.$message({
              message: msg,
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.formVisible = false
                this.btnLoading = false
                this.$emit('close', true)
              }
            })
          }).catch(error => {
            this.btnLoading = false
          })

        }
      })
    }
  }
}
</script>
<style>
.required {
  color: red;
  margin-right: 4px;
}
</style>
<style lang="scss" scoped>
// .main {
//   padding: 10px 30px 0;
// }
::v-deep .el-tabs__header {
  padding: 0 !important;
}

</style>
<style scoped>
::v-deep .el-tabs__content {
  height: auto !important;
  padding: 0 20px;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
}
</style>