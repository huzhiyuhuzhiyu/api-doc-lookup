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
                <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">
                  {{ $t('common.search') }}</el-button>
                <el-button icon="el-icon-refresh-right" size="mini" @click="reset()">{{ $t('common.reset') }}
                </el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <div class="JNPF-common-layout-main JNPF-flex-main">
          <div class="JNPF-common-head">
            <topOpts @add="dialogVisible = true" addText="新建门户">
              <upload-btn url="/api/visualdev/Portal/Model/Actions/ImportData" @on-success="initData" />
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
          <JNPF-table v-loading="listLoading" :data="list" custom-column ref="tabForm" :setColumnDisplayList="columnList" customKey="JNPFTableKey_909161">
            <el-table-column prop="fullName" label="名称" show-overflow-tooltip min-width="200" />
            <el-table-column prop="enCode" label="编码" min-width="140" />
            <el-table-column prop="creatorUser" label="创建人" width="160" />
            <el-table-column prop="creatorTime" label="创建时间" :formatter="jnpf.tableDateFormat" width="160" />
            <el-table-column prop="enabledMark" label="状态" width="80" align="center">
              <template slot-scope="scope">
                <el-tag :type="scope.row.enabledMark == 1 ? 'success' : 'danger'" disable-transitions>
                  {{ scope.row.enabledMark == 1 ? '启用' : '禁用' }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="320">
              <template slot-scope="scope">
                <tableOpts @edit="addOrUpdateHandle(scope.row.type, scope.row.id)" @del="handleDel(scope.row.id)">
                  <el-button size="mini" type="text" @click.native="preview(scope.row.id)">预览</el-button>
                  <el-button size="mini" type="text" @click.native="copy(scope.row.id)">复制</el-button>
                  <el-button size="mini" type="text" @click.native="exportTemplate(scope.row.id)">导出</el-button>
                  <el-button size="mini" type="text" @click.native="distribute(scope.row.id)">授权</el-button>
                  <!-- <el-dropdown>
                    <span class="el-dropdown-link">
                      <el-button type="text" size="mini">{{ $t('common.moreBtn') }}<i
                          class="el-icon-arrow-down el-icon--right"></i>
                      </el-button>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item @click.native="preview(scope.row.id)">预览</el-dropdown-item>
                      <el-dropdown-item @click.native="copy(scope.row.id)">复制</el-dropdown-item>
                      <el-dropdown-item @click.native="exportTemplate(scope.row.id)">导出
                      </el-dropdown-item>
                      <el-dropdown-item @click.native="distribute(scope.row.id)">授权</el-dropdown-item>
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
    <Form v-if="formVisible" ref="form" @close="closeForm" />
    <Form1 v-if="form1Visible" ref="form1" @close="closeForm1" />
    <Preview :visible.sync="previewVisible" :id="activeId" />
    <Transfer ref="transfer" :visible.sync="transferShow" :id="transferId" />
    <el-dialog title="新建门户" :visible.sync="dialogVisible" class="JNPF-dialog JNPF-dialog-add JNPF-dialog_center"
      lock-scroll width="600px">
      <div class="add-main">
        <div class="add-item add-item-sys" @click="addOrUpdateHandle(1)">
          <i class="add-icon icon-ym icon-ym-customUrl"></i>
          <div class="add-txt">
            <p class="add-title">自定义路径</p>
            <p class="add-desc">配置静态页面地址</p>
          </div>
        </div>
        <div class="add-item" @click="addOrUpdateHandle(0)">
          <i class="add-icon icon-ym icon-ym-pageDesign"></i>
          <div class="add-txt">
            <p class="add-title">页面设计</p>
            <p class="add-desc">拖拽生成门户</p>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getPortalList, Delete, Copy, exportTemplate } from '@/api/onlineDev/portal'
import Form from './Form'
import Form1 from './Form1'
import Preview from './IndexPreview'
import Transfer from './Transfer'
export default {
  name: 'onlineDev-visualPortal',
  components: { Form, Form1, Preview, Transfer },
  data() {
    return {
      list: [],
      columnList: ["sortCode", "lastModifyTime", "creatorTime", "creatorUser", "webType", "category"],

      keyword: '',
      category: '',
      listQuery: {
        currentPage: 1,
        pageSize: 20,
        sort: 'desc',
        sidx: '',
        category: "",
        keyword: "",
      },
      total: 0,
      activeId: '',
      transferId: '',
      dialogVisible: false,
      previewVisible: false,
      transferShow: false,
      listLoading: false,
      formVisible: false,
      form1Visible: false,
      categoryList: [],
      leftFlag: false,
      treeLoading: false,
      expands: true,
      refreshTree: true,
      treeData: [],
      displayFlag: false,
      defaultProps: {
        children: "childrenList",
        label: "fullName",
      },
      filterText: "",
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val);
    },
    'listQuery.category': function (newVal) {
      this.initData()
    },
  },
  created() {
    this.getDictionaryData()
    this.initData()
  },
  methods: {
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

    changeLeft() {
      this.leftFlag = !this.leftFlag

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
        pageSize: 20,
        sort: 'desc',
        sidx: '',
        category: this.listQuery.category,
        keyword: "",
      },
        this.initData()
    },
    getDictionaryData() {
      this.$store.dispatch('base/getDictionaryData', { sort: 'portalDesigner' }).then((res) => {
        this.categoryList = res
      })
    },
    initData() {
      this.listLoading = true

      getPortalList(this.listQuery).then(res => {
        this.list = res.data.list
        this.total = res.data.pagination.total
        this.listLoading = false
      })
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        Delete(id).then(res => {
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
    copy(id) {
      this.$confirm('您确定要复制该门户, 是否继续?', '提示', {
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
    preview(id) {
      if (!id) return
      this.activeId = id
      this.previewVisible = true
    },
    exportTemplate(id) {
      this.$confirm('您确定要导出该门户, 是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        exportTemplate(id).then(res => {
          this.jnpf.downloadFile(res.data.url)
        })
      }).catch(() => { });
    },
    distribute(id) {
      this.transferId = id
      this.transferShow = true
    },
    addOrUpdateHandle(type, id) {
      this.dialogVisible = false
      const key = type === 1 ? 'form1' : 'form'
      const time = type === 1 && !id ? 300 : 0
      setTimeout(() => {
        this[key + 'Visible'] = true
        this.$nextTick(() => {
          this.$refs[key].init(this.categoryList, id)
        })
      }, time);
    },
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) this.initData()
    },
    closeForm1(isRefresh) {
      this.form1Visible = false
      if (isRefresh) this.initData()
    }
  }
}
</script>
<style lang="scss" scoped>
.JNPF-dialog-add {
  >>>.el-dialog__body {
    padding: 50px 30px !important;
  }
}

.add-main {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .add-item {
    width: 255px;
    height: 136px;
    background: #eff9ff;
    display: flex;
    align-items: center;
    cursor: pointer;
    padding-left: 20px;

    &:hover {
      opacity: 0.9;
    }

    &.add-item-sys {
      background: #f1f5ff;

      .add-icon {
        background: #ccd9ff;
        color: #537eff;
      }
    }

    .add-icon {
      width: 56px;
      height: 56px;
      margin-right: 10px;
      background: #ceeaff;
      border-radius: 10px;
      color: #46adfe;
      flex-shrink: 0;
      font-size: 30px;
      line-height: 56px;
      text-align: center;
    }

    .add-txt {
      height: 56px;

      P {
        line-height: 28px;
      }

      .add-title {
        font-size: 18px;
        font-weight: bold;
      }

      .add-desc {
        color: #8d8989;
        font-size: 12px;
      }
    }
  }
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