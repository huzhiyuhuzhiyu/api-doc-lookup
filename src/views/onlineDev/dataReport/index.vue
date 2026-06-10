<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="tag-group JNPF-common-search-box treeBox_bot"
        style="display:flex;align-items:center;padding:5px 0 5px 10px;margin:5px 0 5px 0">
        <el-radio-group v-model="listQuery.category" style="background-color:#fff;">
          <el-radio-button label="" style="margin:3px 0">全部</el-radio-button>
          <el-radio-button style="margin:2px 0;" v-for="item in categoryList"
            :key="item.enCode" :label="item.id">{{ item.fullName }}
          </el-radio-button>
        </el-radio-group>
      </div>
      <div class="JNPF-common-layout-center">
        <el-row class="JNPF-common-search-box  treeBox_bot" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="6">
              <el-form-item label="关键词">
                <el-input v-model="listQuery.keyword" placeholder="请输入关键词查询" clearable @keyup.enter.native="search()" />
              </el-form-item>
            </el-col>
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
          <JNPF-table v-loading="listLoading" :data="list" custom-column ref="tabForm" :setColumnDisplayList="columnList" customKey="JNPFTableKey_500593">
            <el-table-column prop="fullName" label="名称" min-width="200" />
            <el-table-column prop="enCode" label="编码" min-width="140" />
            <el-table-column prop="creatorUser" label="创建人" min-width="120" />
            <el-table-column prop="creatorTime" label="创建时间" :formatter="jnpf.tableDateFormat" min-width="120" />
            <el-table-column label="操作" width="320" fixed="right">
              <template slot-scope="scope">
                <tableOpts @edit="addOrUpdateHandle(scope.row.id)" @del="handleDel(scope.row.id)">
                  <el-button size="mini" type="text" @click.native="preview(scope.row)">预览</el-button>
                  <el-button size="mini" type="text" @click.native="handleCopy(scope.row.id)">复制</el-button>
                  <el-button size="mini" type="text" @click="handleExport(scope.row.id)">导出</el-button>
                  <!-- <el-dropdown hide-on-click>
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
                  </el-dropdown> -->
                </tableOpts>
              </template>
            </el-table-column>
          </JNPF-table>
          <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize"
            @pagination="initData" />
        </div>
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
      columnList: ["startNumber", "outputNumber", "creatorUser", "creatorTime", "lastModifyTime", "categoryId", "sortCode"],
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
    'listQuery.category':function(newVal){
      this.initData()
    },
  },
  created() {
    // this.getcategoryTree()
    this.getDictionaryData()

  },

  methods: {
    // getcategoryTree() {
    //   this.treeLoading = true
    //   this.listLoading = true
    //   getbimProductAttributes('65e7917344fa460e8c487e45bbbab26f').then(res => {
    //     this.treeData = res.data.list.length ? res.data.list : []
    //     this.listLoading = false
    //     this.$nextTick(() => {
    //       this.$refs.treeBox.setCurrentKey(this.treeData[0].id) // 默认选中节点第一个
    //       this.listQuery.category = this.treeData[0].id
    //       this.treeLoading = false
    //       this.listLoading = false
    //       this.initData()
    //     })
    //   }).catch(() => {
    //     this.listLoading = false
    //     this.treeLoading = false
    //   })
    // },
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