<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="tableQuery.code" placeholder="请输入产品编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="tableQuery.name" placeholder="请输入产品名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="tableQuery.drawingNo" placeholder="请输入产品图号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="tableQuery.programName" placeholder="请输入程序名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">
                {{ $t('common.search') }}</el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{
                              $t('common.reset') }}
              </el-button>

            </el-form-item>

          </el-col>

        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
          <!-- <el-dropdown> -->
          <el-button size="mini" type="primary" icon="el-icon-plus" @click.native="addOrUpdateHandle('', 'add')">
            新建
          </el-button>
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="search()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableDataList" @sort-change="sortChange" custom-column :fixedNO="true">
          <el-table-column prop="code" label="产品编码" sortable="custom" min-width="200"></el-table-column>
          <el-table-column prop="name" label="产品名称" sortable="custom" width="200"></el-table-column>
          <el-table-column prop="drawingNo" label="产品图号" sortable="custom" width="200"></el-table-column>
          <el-table-column prop="programName" label="程序名称" sortable="custom" width="200"></el-table-column>
          <el-table-column prop="version" label="版本" width="150" />
          <el-table-column prop="state" label="启用状态" width="100">
            <template slot-scope="scope">
              <div v-if="scope.row.state == 'enable'">启用</div>
              <div v-else-if="scope.row.state == 'disabled'">停用</div>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" min-width="220" />
          <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
          <el-table-column prop="createByName" label="创建人" />
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" @click="addOrUpdateHandle(scope.row.id, 'edit')">编辑</el-button>
              <el-button type="text" @click="handleDel(scope.row.id,)" style=" color: #ff3a3a">删除</el-button>
              <el-dropdown hide-on-click>
                <span class="el-dropdown-link">
                  <el-button type="text" size="mini">
                    {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="downloadImage(scope.row)">
                    下载程序
                  </el-dropdown-item>
                  <el-dropdown-item @click.native="lookOrUpdateHandle(scope.row, 'look')">
                    查看程序
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="tableQuery.pageNum" :background="background" :limit.sync="tableQuery.pageSize" @pagination="initData" />
      </div>
    </div>
    <el-dialog title="程序详情" :visible.sync="dialogVisible">
      <div style="overflow: auto;height:50vh">
        <pre>{{titltpage}}</pre>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <DepForm v-if="depFormVisible" ref="depForm" @close="closeForm" @refreshDataList="initData" />
  </div>
</template>

<script>
import { getDownloadUrl } from '@/api/common'
import { getbimProgramData, deletebimProgram, getbimProgramlook } from '@/api/basicData/index'
import DepForm from './depForm'
export default {
  name: 'applicationmanager',
  components: { DepForm, },
  data() {
    return {
      dialogVisible: false,
      depFormVisible: false,
      background: true,//分页器背景颜色
      visible: false,
      tableDataList: [
      ],
      listLoading: false,
      tableQuery: {
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        drawingNo: "",
        name: "",
        code: "",
        programName: ""
      },
      titltpage: '',
      total: 0,
    }
  },
  created() {
    this.initData()
  },
  methods: {
    downloadImage(row) {
      // // 创建一个a标签
      // const link = document.createElement('a');
      // // 设置a标签的href属性为图片的URL
      // link.href = row.drawingPath;
      // // 设置a标签的download属性为图片的文件名
      // link.download = '图纸文件';
      // // 模拟点击a标签进行下载
      // link.click();
      if (!row.filepath) return
      getDownloadUrl('document', row.filepath).then(res => {
        this.jnpf.downloadFile(res.data.url, row.filename)
      })
    },
    sortChange({ prop, order }) {
      const newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      this.tableQuery.orderItems[0].asc = order === "ascending"
      this.tableQuery.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },
    // 关闭新建、编辑页面
    closeForm(isRefresh) {
      this.depFormVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
    initData() {
      this.listLoading = true
      getbimProgramData(this.tableQuery).then(res => {
        this.tableDataList = res.data.records
        this.total = res.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    search() {
      this.tableQuery.pageNum = 1
      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.tableQuery = {
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        drawingNo: "",
        name: "",
        code: "",
        programName: ""
      }
      this.search()
    },
    lookOrUpdateHandle(row) {
      getbimProgramlook({ type: 'document', fileName: row.filepath }).then(res => {
        if (res.data) {
          this.dialogVisible = true
          this.titltpage = res.data
        }
      })
    },
    addOrUpdateHandle(id, type) {
      this.depFormVisible = true
      this.$nextTick(() => {
        this.$refs.depForm.init(id, type)
      })
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        deletebimProgram(id).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        })
      }).catch(() => { })
    },
  }
}
</script>
<style scoped>
::v-deep .el-tabs__header {
  margin-bottom: 5px;
  padding: 0 10px;
}

.JNPF-common-search-box {
  padding: 8px 0 0 0;
  margin-left: 0 !important;
  margin-bottom: 5px;
}

.JNPF-common-search-box .el-form-item {
  margin-bottom: 8px !important;
}

.pagination-container {
  background-color: #f5f7fa;
  margin-top: 0px;
  padding-right: 10px;
  padding-top: 2px;
  padding-bottom: 2px;
}

.JNPF-common-layout-center .JNPF-common-layout-main {
  padding: 0;
}

::v-deep.el-tree-node__content {
  height: 30px;
  line-height: 30px;
}

.JNPF-common-el-tree {
  margin: 5px 0;
}

.el-tabs__nav-scroll {
  padding-left: 0;
}
</style>
