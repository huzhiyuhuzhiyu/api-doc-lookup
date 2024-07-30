<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-left treeBox" :style="leftFlag ? 'width:15px;background:#fff' : ''">
      <div class="JNPF-common-title" style="display: block;padding:0" v-if="!leftFlag">
        <div class="title_box">
          <h2 >模版分类</h2>
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
        <div > <el-input placeholder="输入关键字进行过滤" v-model="filterText" style="width:200px;margin:10px auto;display:block" suffix-icon="el-icon-search" clearable>
          </el-input></div>
      </div>

      <el-scrollbar class="JNPF-common-el-tree-scrollbar" v-loading="treeLoading" v-if="!leftFlag">
        <el-tree ref="treeBox" :data="treeData" :props="defaultProps" :default-expand-all="true" highlight-current :expand-on-click-node="false" node-key="id" @node-click="handleNodeClick" class="JNPF-common-el-tree" v-if="refreshTree" :filter-node-method="filterNode">
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
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box  treeBox_bot" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="关键词">
              <el-input v-model="keyword" placeholder="请输入关键词查询" clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="6">
            <el-form-item label="所属分类">
              <el-select v-model="category" placeholder="请选择所属分类" clearable>
                <el-option v-for="item in categoryList" :key="item.enCode" :label="item.fullName"
                  :value="item.enCode">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="search()" class="commonBox">
                {{$t('common.search')}}</el-button>
              <el-button icon="el-icon-refresh-right" @click="reset()" class="commonBox">{{$t('common.reset')}}
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
          <topOpts @add="addOrUpdateHandle()">
            <upload-btn url="/api/system/printDev/Actions/ImportData" @on-success="initData" />
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
          <el-table-column prop="fullName" label="名称" show-overflow-tooltip min-width="200" />
          <el-table-column prop="enCode" label="编码" width="200" />
          <el-table-column prop="category" label="分类" width="150" />
          <el-table-column prop="creatorUser" label="创建人" width="120" />
          <el-table-column prop="creatorTime" label="创建时间" :formatter="jnpf.tableDateFormat" width="160" />
          <el-table-column prop="lastModifyTime" label="最后修改时间" :formatter="jnpf.tableDateFormat" width="160" />
          <el-table-column prop="sortCode" label="排序" width="70" align="center" />
          <el-table-column prop="enabledMark" label="状态" width="80" align="center">
            <template slot-scope="scope">
              <el-tag :type="scope.row.enabledMark == 1 ? 'success' : 'danger'" disable-transitions>
                {{scope.row.enabledMark==1?'启用':'禁用'}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="180">
            <template slot-scope="scope">
              <tableOpts @edit="addOrUpdateHandle(scope.row.id)" @del="handleDel(scope.row.id)">
                <el-dropdown>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">{{$t('common.moreBtn')}}<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="copy(scope.row.id)">复制</el-dropdown-item>
                    <el-dropdown-item @click.native="preview(scope.row.id)">预览</el-dropdown-item>
                    <el-dropdown-item @click.native="exportTpl(scope.row.id)">导出</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </tableOpts>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="initData" />
      </div>
    </div>
    <Form v-if="formVisible" ref="Form" @close="closeForm" />
    <Preview :visible.sync="previewVisible" :id="activeId" />
  </div>
</template>

<script>
import { getbimProductAttributes } from "@/api/masterDataManagement/index";
import { getPrintDevList, Delete, Copy, exportTpl } from '@/api/system/printDev'
import Form from './Form'
import Preview from './Preview'

export default {
  name: 'system-printDev',
  components: { Form, Preview },
  data() {
    return {
      refreshTree: true,
      defaultProps: {
        children: "childrenList",
        label: "fullName",
      },
      treeData: [],
      treeLoading: false,
      filterText: "",
      leftFlag: false,
      columnList: ["category", "creatorUser", "creatorTime", "lastModifyTime", "sortCode"],
      list: [],
      categoryList: [],
      keyword: '',
      category: '',
      listQuery: {
        currentPage: 1,
        pageSize: 20,
        sort: 'desc',
        sidx: ''
      },
      total: 0,
      listLoading: true,
      formVisible: false,
      previewVisible: false,
      activeId: ''
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val)
    }
  },
  created() {
    // this.initData()
    // this.getDictionaryData()
    this.getcategoryTree()
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.fullName.indexOf(value) !== -1;
    },
    handleNodeClick(data, node) {
      this.category = node.data.enCode
      this.search();
    },
    changeLeft() {
      this.leftFlag = !this.leftFlag
    },
    columnSetFun() {
      this.$refs.tabForm.showDrawer()
    },
    reset() {
      this.keyword = ''
      this.search()
    },
    search() {
      this.listQuery = {
        currentPage: 1,
        pageSize: 20,
        sort: 'desc',
        sidx: ''
      }
      this.initData()
    },
    initData() {
      this.listLoading = true
      let query = {
        ...this.listQuery,
        keyword: this.keyword,
        category: this.category
      }
      getPrintDevList(query).then(res => {
        this.list = res.data.list
        this.total = res.data.pagination.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    getcategoryTree() {
      this.treeLoading = true
      this.listLoading = true
      getbimProductAttributes('202931027482510597').then(res => {
        this.treeData = res.data.list.length ? res.data.list : []
        this.listLoading = false
        this.$nextTick(() => {
          this.$refs.treeBox.setCurrentKey(this.treeData[0].id) // 默认选中节点第一个
          this.category = this.treeData[0].enCode
          this.treeLoading = false
          this.listLoading = false
          this.initData()
        })
      }).catch(() => {
        this.listLoading = false
        this.treeLoading = false
      })
    },
    getDictionaryData() {
      this.$store.dispatch('base/getDictionaryData', { sort: 'printDev' }).then((res) => {
        this.categoryList = res
      })
    },
    addOrUpdateHandle(id) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(this.treeData, id)
      })
    },
    copy(id) {
      this.$confirm('您确定要复制该打印模板, 是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        Copy(id).then(res => {
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
    exportTpl(id) {
      this.$confirm('您确定要导出该打印模板, 是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        exportTpl(id).then(res => {
          this.jnpf.downloadFile(res.data.url)
        })
      }).catch(() => { });
    },
    preview(id) {
      if (!id) return
      this.activeId = id
      this.previewVisible = true
    },
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        Delete(id).then(res => {
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