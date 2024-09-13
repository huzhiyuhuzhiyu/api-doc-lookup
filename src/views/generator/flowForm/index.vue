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
            <topOpts @add="addOrUpdateHandle('', 3)" addText="新建模板"></topOpts>
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
            <el-table-column prop="fullName" label="名称" show-overflow-tooltip min-width="120" />
            <el-table-column prop="enCode" label="编码" min-width="140" />
            <el-table-column prop="creatorUser" label="创建人" min-width="120" />
            <el-table-column prop="creatorTime" label="创建时间" :formatter="jnpf.tableDateFormat" min-width="160" />
            <el-table-column label="操作" fixed="right" width="420">
              <template slot-scope="scope">
                <tableOpts @edit="addOrUpdateHandle(scope.row.id)" @del="handleDel(scope.row.id)">
                  <el-button size="mini" type="text" @click.native="copy(scope.row.id)">复制模板</el-button>
                  <el-button size="mini" type="text" @click.native="download(scope.row)">下载代码</el-button>
                  <el-button size="mini" type="text" @click.native="preview(scope.row)">预览代码</el-button>
                  <!-- <el-dropdown>
                    <span class="el-dropdown-link">
                      <el-button type="text" size="mini">{{ $t('common.moreBtn') }}<i
                          class="el-icon-arrow-down el-icon--right"></i>
                      </el-button>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item @click.native="copy(scope.row.id)">复制模板</el-dropdown-item>
                      <el-dropdown-item @click.native="download(scope.row)">下载代码</el-dropdown-item>
                      <el-dropdown-item @click.native="preview(scope.row)">预览代码</el-dropdown-item>
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
    <Form v-if="formVisible" ref="Form" @close="closeForm" />
    <Preview v-if="previewVisible" ref="preview" @close="previewVisible = false" />
    <DownloadForm v-if="downloadFormVisible" ref="downloadForm" @close="downloadFormVisible = false" />
  </div>
</template>

<script>
import Form from './Form'
import DownloadForm from '../DownloadForm'
import Preview from '../Preview'
import mixin from '@/mixins/generator/index'
import { getVisualDevList, Delete, Copy, exportData } from '@/api/onlineDev/visualDev'
export default {
  name: 'generator-flowForm',
  mixins: [mixin],
  components: { Form, DownloadForm, Preview },
  data() {
    return {

      previewVisible: false,
      downloadFormVisible: false,
      sort: 'flowForm',
      listQuery: {
        type: 3,
        currentPage: 1,
        pageSize: 20,
        sort: 'desc',
        sidx: '',
        category: "",
        keyword: "",
      },
      leftFlag: false,
      treeLoading: false,
      expands: true,
      refreshTree: true,
      treeData: [],
      displayFlag: false,
      columnList: ["startNumber", "outputNumber", "creatorUser", "creatorTime", "lastModifyTime", "webType", "category"],
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

  },
  methods: {
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
    initData() {
      this.listLoading = true

      getVisualDevList(this.listQuery).then(res => {
        this.list = res.data.list
        this.total = res.data.pagination.total
        this.listLoading = false
      })
    },
    search() {
      this.listQuery = {
        type: 3,
        currentPage: 1,
        pageSize: 20,
        sort: 'desc',
        sidx: '',
        category: this.listQuery.category,
        keyword: "",
      },
        this.initData()
    },
    reset() {

      this.search()
    },

    columnSetFun() {
      this.$refs.tabForm.showDrawer()
    },
    download(row) {
      this.downloadFormVisible = true
      this.$nextTick(() => {
        this.$refs.downloadForm.init(row.tables, row.id, 3)
      })
    },
    preview(row) {
      this.previewVisible = true
      this.$nextTick(() => {
        this.$refs.preview.init(row.tables, row.id)
      })
    }
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

.JNPF-common-head {
  padding: 8px 10px
}
</style>
