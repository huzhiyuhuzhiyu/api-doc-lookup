<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-left treeBox" :style="leftFlag ? 'width:15px;background:#fff' : ''">
      <div class="JNPF-common-title" style="display: block;padding:0" v-if="!leftFlag">
        <div class="title_box">
          <h2 >业务分类</h2>
          <span class="options" >
            <el-dropdown>
              <el-link icon="icon-ym icon-ym-mpMenu" :underline="false" />
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="getcategoryTree()">刷新数据</el-dropdown-item>
                <!-- <el-dropdown-item @click.native="toggleExpand(true)">展开全部</el-dropdown-item>
                <el-dropdown-item @click.native="toggleExpand(false)">折叠全部</el-dropdown-item>
                <el-dropdown-item @click.native="setexpand(true)">设置默认展开</el-dropdown-item>
                <el-dropdown-item @click.native="setexpand(false)">设置默认收起</el-dropdown-item>  -->
              </el-dropdown-menu>
            </el-dropdown>
          </span>
        </div>
        <div > <el-input placeholder="输入关键字进行过滤" v-model="filterText"
            style="width:200px;margin:10px auto;display:block" suffix-icon="el-icon-search" clearable>
          </el-input></div>
      </div>

      <el-scrollbar class="JNPF-common-el-tree-scrollbar" v-loading="treeLoading" v-if="!leftFlag">
        <el-tree ref="treeBox" :data="treeData" :props="defaultProps" :default-expand-all="expands" highlight-current
          :expand-on-click-node="false" node-key="id" @node-click="handleNodeClick" class="JNPF-common-el-tree"
          v-if="refreshTree" :filter-node-method="filterNode">
          <span class="custom-tree-node" slot-scope="{ data }" :title="data.fullName">

            <span class="text" :title="data.fullName">{{ data.fullName }}</span>
          </span>
        </el-tree>
      </el-scrollbar>
      <div v-if="!leftFlag" class="retract" style="position: absolute" >
        <el-button icon="el-icon-arrow-left" type="text" @click.native="changeLeft()"></el-button>  
      </div>
      <div v-if="leftFlag" class="expand" style="position: absolute" >
        <el-button icon="el-icon-arrow-right" type="text" @click.native="changeLeft()"></el-button>  
      </div>
    </div>
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box  treeBox_bot" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="关键词">
              <el-input v-model="listQuery.keyword" placeholder="请输入关键词查询" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="6">
            <el-form-item label="业务分类">
              <el-select v-model="categoryId" placeholder="请选择业务分类" clearable>
                <el-option v-for="item in categoryList" :key="item.id" :label="item.fullName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="search()"   class="commonBox">
                {{$t('common.search')}}</el-button>
              <el-button icon="el-icon-refresh-right" @click="reset()"  class="commonBox">{{$t('common.reset')}}
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
          <topOpts @add="addOrUpdateHandle()">
            <upload-btn url="/api/system/BillRule/Action/Import" @on-success="initData" />
          </topOpts>
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table ref="tabForm" v-loading="listLoading" :data="tableList" custom-column  row-key="id" :setColumnDisplayList="columnList" hasMove @changeMove="changeMove" :fixedNO="true">
          <!-- <el-table-column align="center" label="拖动" width="60">
            <template>
              <i class="drag-handler icon-ym icon-ym-darg" style="cursor: move;font-size:20px" disabled title='点击拖动' />
            </template>
          </el-table-column>
          <el-table-column align="center" label="序号" width="60">
            <template slot-scope="scope">
              {{ scope.$index+1 }}
            </template>
          </el-table-column> -->
          <el-table-column prop="fullName" label="业务名称" width="200" />
          <el-table-column prop="enCode" label="业务编码" width="200" />
          <el-table-column prop="category" label="业务分类" width="150" />
          <el-table-column prop="category" label="编码生成方式" width="150" />
          <el-table-column prop="startNumber" label="流水起始" width="120"  />
          <el-table-column prop="outputNumber" label="当前流水号" width="240"   />
          <el-table-column prop="creatorUser" label="创建人" width="160"   />
          <el-table-column prop="creatorTime" label="创建时间" :formatter="jnpf.tableDateFormat"   
            width="160" />
          <el-table-column prop="lastModifyTime" label="最后修改时间" :formatter="jnpf.tableDateFormat"   
            width="160" />
          <!-- <el-table-column prop="sortCode" label="排序" width="70" align="center" /> -->
          <el-table-column prop="enabledMark" label="状态" width="80" align="center">
            <template slot-scope="scope">
              <el-tag :type="scope.row.enabledMark == 1 ? 'success' : 'danger'" disable-transitions>
                {{scope.row.enabledMark==1?'启用':'禁用'}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="180" fixed="right">
            <template slot-scope="scope">
              <tableOpts @edit="addOrUpdateHandle(scope.row.id)" @del="handleDel(scope.row.id)">
                <el-dropdown>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">{{$t('common.moreBtn')}}<i
                        class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="exportTpl(scope.row.id)">
                      导出
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </tableOpts>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.currentPage"
          :limit.sync="listQuery.pageSize" @pagination="initData" />
      </div>
    </div>
    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" />
    <TypeList v-if="drawer" ref="TypeList" @refreshDataList="initData" />
  </div>
</template>

<script>
import {
  getBillRuleList,
  delBillRule,
  updateBillRuleState,
  exportTpl,
  updateSortBatch
} from '@/api/system/billRule'
import Form from './Form'
import {
  getBimProductAttributesInfo,
  updataBimProductAttributes,
  delBimProductAttributes,
  addBimProductAttributes,
  getbimProductAttributesList,
  getbimProductAttributes
} from "@/api/masterDataManagement/index";
import Sortable from 'sortablejs'
import TypeList from './components/index'
export default {
  name: 'system-billRule',
  components: {
    Form,
    TypeList
  },
  data() {
    return {
    
      tableList: [],
      total: 0,
      btnLoading: false,
      listLoading: true,
      categoryId: '',
      listQuery: {
        keyword: '',
        currentPage: 1,
        pageSize: 20,
        categoryId:"",
      },
 
      formVisible: false,
      categoryList: [],
      filterText:"",
      leftFlag: false,
      treeLoading:false,
      expands: true,
      refreshTree: true,
      treeData: [],
      displayFlag:false,
      columnList:["startNumber","outputNumber","creatorUser","creatorTime","lastModifyTime"],
      defaultProps: {
        children: "childrenList",
        label: "fullName",
      },
      drawer:false,
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val);
    },
  },
  created() {
    this.getcategoryTree()
   
  },
  // mounted() {
  //   this.rowDrop(); //声明表格拖动排序方法

  // },
  
  methods: {
    
    rowDrop() {
      const el = this.$refs.tabForm.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost',
        setData: function (dataTransfer) {
          dataTransfer.setData('Text', '')
        },
        onEnd: evt => {
          const targetRow = this.tableList.splice(evt.oldIndex, 1)[0];
          this.tableList.splice(evt.newIndex, 0, targetRow);
          console.log(this.tableList);
          let att = []
          this.tableList.forEach((item, index) => {
            let obj = {
              id: item.id,
              sortCode: index, 
            }
            att.push(obj)
          });
          console.log(att);
          updateSortBatch(att).then(res => {
            this.$message.success("批量修改排序成功")
            this.initData()

          })
        }
      });
    },
    filterNode(value, data) {
      console.log(value, data);
      if (!value) return true;
      return data.fullName.indexOf(value) !== -1;
    },
    handleNodeClick(data, node) {
      console.log("请选择节点", node);
      this.listQuery.categoryId = node.data.id
      this.search();
    },

    getcategoryTree() {
      this.treeLoading = true
      this.listLoading = true
      getbimProductAttributes('306427078100678661').then(res => {
        this.treeData = res.data.list.length?res.data.list:[]
        this.listLoading = false
        this.$nextTick(() => {
          this.$refs.treeBox.setCurrentKey(this.treeData[0].id) // 默认选中节点第一个
          this.listQuery.categoryId = this.treeData[0].id
          this.treeLoading = false
          this.listLoading = false
          this.initData()
        })
      }).catch(() => {
        this.listLoading = false
        this.treeLoading = false
      })
    },
    columnSetFun(){ 
      this.$refs.tabForm.showDrawer()
    },
    changeLeft() {
      this.leftFlag = !this.leftFlag
     
    },
    getcategoryTree() {
      this.treeLoading = true
      this.listLoading = true
      getbimProductAttributes('306427078100678661').then(res => {
        this.treeData = res.data.list.length?res.data.list:[]
        this.listLoading = false
        this.$nextTick(() => {
          this.$refs.treeBox.setCurrentKey(this.treeData[0].id) // 默认选中节点第一个
          this.listQuery.categoryId = this.treeData[0].id
          this.treeLoading = false
          this.listLoading = false
          this.initData()
        })
      }).catch(() => {
        this.listLoading = false
        this.treeLoading = false
      })
    },
    // // 设置默认展开
    // setexpand(expands) {
    //   console.log("expands", expands);
    //   this.refreshTree = false
    //   this.expands = expands
    //   this.$nextTick(() => {
    //     this.refreshTree = true
    //     localStorage.setItem("customExpandsFlag", expands)

    //   })
    // },
    // // 展开或折叠全部
    // toggleExpand(expands) {
    //   this.refreshTree = false
    //   this.expands = expands
    //   this.$nextTick(() => {
    //     this.refreshTree = true
    //   })
    // },
   
    initData() {
      this.drawer=false
      this.listLoading = true
      let query = {
        ...this.listQuery,
        
      }
      getBillRuleList(query).then(res => {
        this.tableList = res.data.list
        this.total = res.data.pagination.total
        this.listLoading = false
        this.btnLoading = false
      }).catch(() => {
        this.listLoading = false
        this.btnLoading = false
      })
    },
    handleUpdateState(row) {
      const txt = row.enabledMark ? '禁用' : '开启'
      this.$confirm(`您确定要${txt}当前单据吗, 是否继续?`, '提示', {
        type: 'warning'
      }).then(() => {
        updateBillRuleState(row.id).then(res => {
          this.$message({
            type: 'success',
            message: res.msg,
            duration: 1000,
            onClose: () => {
              row.enabledMark = row.enabledMark ? 0 : 1
            }
          })
        })
      }).catch(() => { })
    },
    addOrUpdateHandle(id) {
      this.drawer = true
      this.$nextTick(() => {
        this.$refs.TypeList.init(id, this.treeData,this.listQuery.categoryId,this.tableList)
      })
      // this.formVisible = true
      // this.$nextTick(() => {
      //   this.$refs.Form.init(id, this.treeData,this.listQuery.categoryId,this.tableList)
      // })
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        delBillRule(id).then(res => {
          this.$message({
            type: 'success',
            message: res.msg,
            duration: 1500,
            onClose: () => {
              this.initData()
            }
          })
        })
      }).catch(() => { })
    },
    exportTpl(id) {
      this.$confirm('您确定要导出该单据, 是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        exportTpl(id).then(res => {
          this.jnpf.downloadFile(res.data.url)
        })
      }).catch(() => { });
    },
    search() {
      this.listQuery.currentPage = 1
      this.listQuery.pageSize = 20
      this.listQuery.sort = 'desc'
      this.initData()
    },
    reset() {
      this.listQuery.keyword = ''
      this.categoryId = ''
      this.search()
    },
    changeMove(data){
      updateSortBatch(data).then(res => {
            this.$message.success("批量修改排序成功")
            this.initData()
          })
    },
  }
}
</script>
<style scoped>
  .title_box {
  width: 100%;
  display: flex;
  border-bottom: 1px solid #ebeef5;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  padding: 0 10px;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}
</style>
