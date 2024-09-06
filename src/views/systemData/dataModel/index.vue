<template>
  <div class="JNPF-common-layout">
    <!-- <div class="JNPF-common-layout-left treeBox" :style="leftFlag ? 'width:15px;background:#fff' : ''">
      <div class="JNPF-common-title" style="display: block;padding:0" v-if="!leftFlag">
        <div class="title_box">
          <h2 >业务分类</h2>
          <span class="options" >  
            <el-dropdown>
              <el-link icon="icon-ym icon-ym-mpMenu" :underline="false" />
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="getcategoryTree()">刷新数据</el-dropdown-item>
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
        <el-button size="mini" icon="el-icon-arrow-left" type="text" @click.native="changeLeft()"></el-button>  
      </div>
      <div v-if="leftFlag" class="expand" style="position: absolute" >
        <el-button size="mini" icon="el-icon-arrow-right" type="text" @click.native="changeLeft()"></el-button>  
      </div>
    </div> -->
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="tag-group JNPF-common-search-box treeBox_bot"
        style="display:flex;align-items:center;padding:5px 0 5px 10px;margin:5px 0 5px 0">
        <el-radio-group v-model="dataForm.categoryId" style="background-color:#fff;">
          <el-radio-button label="" style="margin:3px 0">全部</el-radio-button>
          <el-radio-button style="margin:2px 0;border-left:1px solid #DCDFE6" v-for="item in treeData"
            :key="item.enCode" :label="item.id">{{ item.fullName }}
          </el-radio-button>
        </el-radio-group>
      </div>
      <div class="JNPF-common-layout-center">
        <el-row class="JNPF-common-search-box   treeBox_bot" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="6">
              <el-form-item label="关键词">
                <el-input v-model="dataForm.keyword" placeholder="请输入关键词查询" clearable @keyup.enter.native="search()" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">
                  {{ $t('common.search') }}</el-button>
                <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
                </el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <div class="JNPF-common-layout-main JNPF-flex-main">
          <div class="JNPF-common-head">
            <topOpts @add="addOrUpdateHandle()" addText="新建表名">
              <el-button type="primary" size="mini" icon="iconfont  icon-piliang-copy"
                @click="batchSetCategory()">批量设置分类</el-button>
              <upload-btn :url="'/api/system/DataModel/' + dataBase + '/Action/Import'" @on-success="getTableData" />
              <el-button type="text" icon="el-icon-menu" @click="handleFieldsManage()">常用字段
              </el-button>
            </topOpts>
            <div class="JNPF-common-head-right">
              <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                  @click="getTableData()" />
              </el-tooltip>
            </div>
          </div>
          <JNPF-table v-loading="listLoading" :data="list" @expand-change="expandChange" hasC
            @selection-change="handleSelectionChange" custom-column>
            <!-- <el-table-column type="expand" width="40">
            <template slot-scope="props">
              <el-table v-loading="props.row.childTableLoading" :data="props.row.childTable" stripe
                size='mini'>
                <el-table-column prop="field" label="字段" />
                <el-table-column prop="fieldName" label="说明" />
                <el-table-column prop="dataType" label="类型" />
                <el-table-column prop="dataLength" label="长度" />
                <el-table-column prop="allowNull" label="允许空">
                  <template slot-scope="scope">
                    <el-checkbox :value='!!scope.row.allowNull' />
                  </template>
                </el-table-column>
                <el-table-column prop="defaults" label="默认值" />
              </el-table>
            </template>
          </el-table-column> -->
            <el-table-column prop="enName" label="表名" min-width="300" sortable />
            <el-table-column prop="cnName" label="说明" min-width="200"/>
            <el-table-column label="操作" min-width="200" fixed="right">
              <template slot-scope="scope">
                <tableOpts @edit="addOrUpdateHandle(scope.row.enName)" @del="handleDel(scope.$index, scope.row.enName)">
                  <el-button size="mini" type="text" @click="openData(scope.row.table)">打开数据</el-button>
                  <el-button size="mini" type="text" @click="exportTpl(scope.row.table)">导出</el-button>
                  <!-- <el-dropdown hide-on-click>
                    <span class="el-dropdown-link">
                      <el-button size="mini" type="text">
                        {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                      </el-button>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item @click.native="openData(scope.row.table)">
                        打开数据
                      </el-dropdown-item>
                      <el-dropdown-item @click.native="exportTpl(scope.row.table)">
                        导出
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown> -->
                </tableOpts>
              </template>
            </el-table-column>
          </JNPF-table>
          <pagination :total="total" :page.sync="dataForm.pageNum" :limit.sync="dataForm.pageSize"
            @pagination="getTableData">
          </pagination>
        </div>
      </div>
    </div>
    <Form v-show="formVisible" ref="Form" @close="closeForm" />
    <Preview v-show="showData" ref="preview" @close="closeData" />
    <FieldsList v-if="drawer" ref="fieldsList" />
    <SelectCategory v-if="SelectCategoryFormVisible" ref="SelectCategoryForm" @refreshDataList="getTableData" />
  </div>
</template>

<script>
import { getDataSourceListAll } from '@/api/systemData/dataSource'
import { getDataModelList } from '@/api/masterDataManagement/index.js'
import {
  getBimProductAttributesInfo,
  updataBimProductAttributes,
  delBimProductAttributes,
  addBimProductAttributes,
  getbimProductAttributesList,
  getbimProductAttributes
} from "@/api/masterDataManagement/index";
import { DataModelList, DataModelDelete, DataModelFieldList, exportTpl } from '@/api/systemData/dataModel'
import SelectCategory from './selectCategory' // 重设密码
import Form from './Form'
import Preview from './Preview'
import FieldsList from './fields/index'
export default {
  name: 'systemData-dataModel',
  components: { Form, Preview, FieldsList, SelectCategory },
  data() {
    return {
      defaultProps: {
        children: "childrenList",
        label: "fullName",
      },
      list: [],
      formVisible: false,
      dataBase: '0',
      dbOptions: [],
      listLoading: false,
      childTableLoading: false,
      showData: false,
      drawer: false,
      dataForm: {
        keyword: '',
        pageNum: 1,
        pageSize: 20,
        categoryId: "",
      },
      filterText: "",
      leftFlag: false,
      treeLoading: false,
      expands: true,
      refreshTree: true,
      treeData: [],
      total: 0,
      selectList: [],
      SelectCategoryFormVisible: false
    }
  },
  created() {
    this.getcategoryTree()
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val);
    },
    'dataForm.categoryId':function(newVal){
      this.getTableData()
    },
  },
  methods: {
    batchSetCategory() {
      if (!this.selectList.length) return this.$message.error("请先选择数据！")
      this.SelectCategoryFormVisible = true
      this.$nextTick(() => {
        this.$refs.SelectCategoryForm.init(this.selectList)
      })
    },
    handleSelectionChange(val) {
      console.log(val);
      this.selectList = val
    },
    filterNode(value, data) {
      console.log(value, data);
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    handleNodeClick(data, node) {
      console.log("请选择节点", node);
      this.dataForm.categoryId = node.data.id
      this.search();
    },

    getcategoryTree() {
      this.treeLoading = true
      this.listLoading = true
      getbimProductAttributes('306427078100678661').then(res => {
        this.treeData = res.data.list.length ? res.data.list : []
        this.listLoading = false
        this.$nextTick(() => {
          this.treeLoading = false
          this.listLoading = false
          this.getTableData()
        })
      }).catch(() => {
        this.listLoading = false
        this.treeLoading = false
      })
    },
    columnSetFun() {
      console.log("this.$refs.dataTable", this.$refs.dataTable);
      this.$refs.dataTable.showDrawer()
    },
    changeLeft() {
      this.leftFlag = !this.leftFlag

    },
    search() {
      this.getTableData()
    },
    reset() {
      this.keyword = ''
      this.dataForm.pageNum = 1
      this.dataForm.pageSize = 20
      this.getTableData()
    },

    getTableData() {
      this.listLoading = true
      getDataModelList(this.dataForm).then(res => {
        console.log("表格数据", res);
        this.list = res.data.records
        this.total = res.data.total
        this.listLoading = false
      }).catch(error => {
        this.listLoading = false

      })
    },
    handleDel(index, tableName) {
      this.$confirm('您确定要删除这些数据吗, 是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        this.asyncDel(index, tableName);
      }).catch(() => { });
    },
    asyncDel(index, tableName) {
      DataModelDelete(this.dataBase, tableName).then(res => {
        this.list.splice(index, 1);
        this.$message({
          type: 'success',
          message: res.msg
        });
      })
    },
    exportTpl(id) {
      this.$confirm('您确定要导出该表, 是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        exportTpl(this.dataBase, id).then(res => {
          this.jnpf.downloadFile(res.data.url)
        })
      }).catch(() => { });
    },
    // 新增 / 修改
    addOrUpdateHandle(enName) {
      console.log("enName", enName);
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(this.dataBase, enName)
      })
    },
    expandChange(rows) {
      rows.isExpanded = !rows.isExpanded
      if (!rows.isExpanded) return
      if (rows.childTable.length) return
      rows.childTableLoading = true
      DataModelFieldList(this.dataBase, rows.table).then(res => {
        rows.childTableLoading = false
        rows.childTable = res.data.list
      }).catch(() => {
        rows.childTableLoading = false
      })
    },
    closeData() {
      this.showData = false
    },
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.keyword = ''
        this.getTableData()
      }
    },
    openData(table) {
      this.showData = true
      this.$nextTick(() => {
        this.$refs.preview.init(this.dataBase, table)
      })
    },
    handleFieldsManage() {
      this.drawer = true
      this.$nextTick(() => {
        this.$refs.fieldsList.init()
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

::v-deep .icon-piliang-copy {
  margin-right: 8px
}
</style>
