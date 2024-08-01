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
      <div v-if="!leftFlag" class="retract" style="position: absolute">
        <el-button icon="el-icon-arrow-left" type="text" @click.native="changeLeft()"></el-button>
      </div>
      <div v-if="leftFlag" class="expand" style="position: absolute">
        <el-button icon="el-icon-arrow-right" type="text" @click.native="changeLeft()"></el-button>
      </div>
    </div>
    <div class="JNPF-common-layout-center">
      <el-row class="JNPF-common-search-box  treeBox_bot" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="关键词">
              <el-input v-model="listQuery.keyword" placeholder="请输入关键词查询" clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="6">
            <el-form-item label="所属分类">
              <el-select v-model="category" placeholder="请选择所属分类" clearable>
                <el-option v-for="item in categoryList" :key="item.id" :label="item.fullName" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="search()">
                {{ $t('common.search') }}</el-button>
              <el-button icon="el-icon-refresh-right" size="mini" @click="reset()">{{ $t('common.reset') }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
          <topOpts addText="新建报表" @add="addOrUpdateHandle()">
            <el-upload :action="define.reportServer + '/api/datareport/Data/Action/Import'"
              :headers="{ Authorization: $store.getters.token }" :on-success="handleSuccess"
              :before-upload="() => { btnLoading = true }" :show-file-list="false" class="upload-btn">
              <el-button type="text" icon="el-icon-upload2" :loading="btnLoading">导入</el-button>
            </el-upload>
          </topOpts>
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table v-loading="listLoading" :data="list" custom-column ref="tabForm" :setColumnDisplayList="columnList">
          <el-table-column prop="fullName" label="名称" min-width="200" />
          <el-table-column prop="enCode" label="编码" width="200" />
          <el-table-column prop="categoryId" label="分类" width="150">
            <template slot-scope="scope">
              {{ scope.row.categoryId | getCategoryText(categoryList) }}
            </template>
          </el-table-column>
          <el-table-column prop="creatorUser" label="创建人" width="120" />
          <el-table-column prop="creatorTime" label="创建时间" :formatter="jnpf.tableDateFormat" width="120" />
          <el-table-column prop="lastModifyTime" label="最后修改时间" :formatter="jnpf.tableDateFormat" width="120" />
          <el-table-column prop="sortCode" label="排序" width="70" align="center" />
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <tableOpts @edit="addOrUpdateHandle(scope.row.id)" @del="handleDel(scope.row.id)">
                <el-dropdown hide-on-click>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">
                      {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="preview(scope.row)">预览</el-dropdown-item>
                    <el-dropdown-item @click.native="handleCopy(scope.row.id)">复制</el-dropdown-item>
                    <el-dropdown-item @click.native="handleExport(scope.row.id)">导出
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </tableOpts>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize"
          @pagination="initData" />
      </div>
    </div>
    <Form v-if="formVisible" ref="Form" @refreshDataList="refresh" />
    <Preview v-if="previewVisible" ref="Preview" @close="previewVisible = false" />
    <previewDialog :visible.sync="previewDialogVisible" :id="currRow.id" :fullName="currRow.fullName" type="report"
      @previewPc="previewPc" />
  </div>
</template>
<script>
import {
  getDataReportList,
  copyDataReport,
  delDataReport
} from '@/api/onlineDev/dataReport'
import { reportServer } from '@/utils/define'
import { getToken } from '@/utils/auth'
import Form from './Form'
import Preview from './Preview'
import {
  getBimProductAttributesInfo,
  updataBimProductAttributes,
  delBimProductAttributes,
  addBimProductAttributes,
  getbimProductAttributesList,
  getbimProductAttributes
} from "@/api/masterDataManagement/index";
import previewDialog from '@/components/PreviewDialog'

export default {
  components: { Form, Preview, previewDialog },
  name: 'onlineDev-dataReport',
  data() {
    return {
      listQuery: {
        currentPage: 1,
        pageSize: 20,
        sort: 'desc',
        sidx: '',
        category: '',
        keyword: '',
      },
      total: 0,
      list: [],
      listLoading: false,
      btnLoading: false,
      formVisible: false,
      previewVisible: false,
      categoryList: [],
      previewDialogVisible: false,
      currRow: {},
      leftFlag: false,
      treeLoading: false,
      expands: true,
      refreshTree: true,
      treeData: [],
      displayFlag: false,
      columnList: ["startNumber", "outputNumber", "creatorUser", "creatorTime", "lastModifyTime",  "categoryId","sortCode"],
      defaultProps: {
        children: "childrenList",
        label: "fullName",
      },
      filterText: "",
    }
  },
  filters: {
    getCategoryText(id, categoryList) {
      let item = categoryList.filter(o => o.id == id)[0]
      return item && item.fullName ? item.fullName : ''
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

  methods: {
    getcategoryTree() {
      this.treeLoading = true
      this.listLoading = true
      getbimProductAttributes('65e7917344fa460e8c487e45bbbab26f').then(res => {
        this.treeData = res.data.list.length ? res.data.list : []
        this.listLoading = false
        this.$nextTick(() => {
          this.$refs.treeBox.setCurrentKey(this.treeData[0].id) // 默认选中节点第一个
          this.listQuery.category = this.treeData[0].id
          this.treeLoading = false
          this.listLoading = false
          this.initData()
        })
      }).catch(() => {
        this.listLoading = false
        this.treeLoading = false
      })
    },
    changeLeft() {
      this.leftFlag = !this.leftFlag

    },
    filterNode(value, data) {
      console.log(value, data);
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    handleNodeClick(data, node) {
      console.log("请选择节点", node);
      this.listQuery.category = node.data.id
      this.search();
    },
    columnSetFun() {
      this.$refs.tabForm.showDrawer()
    },
    reset() {

      this.search()
    },
    search() {
      this.listQuery = {
        currentPage: 1,
        keyword: '',
        category: '',
        pageSize: 20,
        category: this.listQuery.category,
        sort: 'desc',
        sidx: ''
      }
      this.initData()
    },
    refresh(isRefresh) {
      this.initData()
    },
    initData() {
      this.listLoading = true
       
      getDataReportList(this.listQuery).then(res => {
        this.list = res.data.list
        this.total = res.data.pagination.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    getDictionaryData() {
      this.$store.dispatch('base/getDictionaryData', { sort: 'ReportSort' }).then(res => {
        this.categoryList = JSON.parse(JSON.stringify(res))
        this.initData()
      })
    },
    addOrUpdateHandle(id) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id)
      })
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        delDataReport(id).then(res => {
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
    preview(row) {
      this.currRow = row
      this.$nextTick(() => {
        this.previewDialogVisible = true
      })
    },
    previewPc() {
      this.previewVisible = true
      this.$nextTick(() => {
        this.$refs.Preview.init(this.currRow.id)
      })
    },
    handleCopy(id) {
      this.$confirm('您确定要复制该报表, 是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        copyDataReport(id).then(res => {
          this.$message({
            type: 'success',
            message: res.msg,
            duration: 1000,
            onClose: () => {
              this.initData()
            }
          });
        })
      }).catch(() => { });
    },
    handleExport(id) {
      this.$confirm('您确定要导出该报表, 是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        const token = getToken()
        let link = document.createElement('a')
        link.href = `${reportServer}/api/datareport/Data/${id}/Actions/Export?token=${token}`
        link.click();
      }).catch(() => { });
    },
    handleSuccess(res) {
      this.btnLoading = false
      if (res.code == 200) {
        this.$message({
          message: res.msg,
          type: 'success',
          duration: 1000
        })
        this.initData()
      } else {
        this.$message({
          message: res.msg,
          type: 'error',
          duration: 1000
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.upload-btn {
  display: inline-block;
  margin: 0 10px;
}
</style>
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