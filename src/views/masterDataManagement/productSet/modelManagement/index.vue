<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <JNPF-tableQuery :listQuery="listQuery" :systemSearchView="systemSearchView" tableRef="dataTable" />
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head" style="padding: 8px;display: -webkit-box">
          <el-button type="primary" icon="el-icon-plus" size="mini" @click.native="batchAdd()">
            批量新建
          </el-button>
          <el-button type="primary" size="mini" icon="el-icon-edit-outline" style="margin-left: 10px"
            @click="batchEditFun">
            批量修改
          </el-button>
          <!-- <el-button size="mini" type="primary" icon="el-icon-download" @click="downLoadTemplate">下载模版</el-button> -->
          <el-button v-has="'btn_import'" size="mini" type="primary" icon="el-icon-plus" @click="importFun">
            导入
          </el-button>
          <el-button v-has="'btn_export'" :disabled="tableData.length > 0 ? false : true" size="mini" type="primary"
            icon="el-icon-download" @click="exportForm">
            导出
          </el-button>
          <!-- </topOpts> -->
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" content="数据排序设置" placement="top">
              <el-link icon="icon-ym icon-ym-generator-flow JNPF-common-head-icon" :underline="false"
                       @click="$refs.dataTable.showSortDrawer()"/>
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table v-loading="listLoading" :data="tableData" :fixedNO="true" custom-column
          hasC @selection-change="handleSelectionChange" ref="dataTable" :setColumnDisplayList="columnList" customKey="JNPFTableKey_657988" :listQuery="listQuery" @queryChange="initData" :queryJson="superQueryJson">
          <el-table-column prop="model" label="型号" min-width="220" />
          <el-table-column prop="innerCircle" label="内圈" min-width="220"/>
          <el-table-column prop="outerCircle" label="外圈" min-width="220"/>
          <el-table-column prop="steelBall" label="钢球型号" min-width="220"/>
          <el-table-column prop="sealingRing" label="密封圈" min-width="220" />
          <el-table-column prop="steelBallNum" label="钢球用量(粒)" min-width="128" />
          <el-table-column prop="oilNum" label="油脂用量(毫克)" min-width="142" />
          <el-table-column prop="holderNum" label="保持架用量(个)" min-width="142" />
          <el-table-column prop="sealingRingNum" label="密封圈用量(个)" min-width="142" />
          <el-table-column prop="createTime" label="创建时间" min-width="180" />
          <el-table-column prop="createByName" label="创建人" min-width="100" />
          <el-table-column label="操作" width="100" fixed="right">
            <template slot-scope="scope">
              <tableOpts :isJudgePer="true" :editPerCode="'btn_edit'" :delPerCode="'btn_remove'"
                @edit="addOrUpdateHandle(scope.row.id, 'edit')" @del="handleDel(scope.row.id)"></tableOpts>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="initData()" />
      </div>
    </div>
    <el-upload action="#" v-show="false" accept=".xls, .xlsx" :headers="{ token }" ref="UploadProduct"
      :http-request="UploadProduct" />
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
    <JNPF-Form v-if="formVisible" ref="JNPFForm" @refresh="refresh" />
    <Table-Form v-if="tableFormVisible" ref="TableForm" @refresh="refresh"></Table-Form>
    <el-dialog title="导入数据" append-to-body :close-on-click-modal="false" :close-on-press-escape="false"
      :visible.sync="uploadVisib" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="400px" @close="cancelFun">
      <el-upload cass="upload-demo" action="#" accept=".xls, .xlsx" :multiple="false" :auto-upload="false" :limit="1"
        :on-preview="handlePreview" drag :on-remove="handleRemove" :on-change="handleFileChange" ref="uploadRef">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text"><em>点击选取文件上传</em></div>
        <div class="el-upload__tip" slot="tip">
          只能上传.xls/.xlsx文件
          <el-button type="text" class="topButton" icon="el-icon-download" @click="downLoadTemplate">
            下载模板
          </el-button>
        </div>
      </el-upload>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelFun">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="saveSubmit()" :loading="btnLoading" :disabled="btnLoading">
          提交
        </el-button>
      </span>
    </el-dialog>
    <!-- <UserRelationList v-if="userRelationListVisible" ref="UserRelationList" @refreshDataList="getOrganizeList" /> -->
  </div>
</template>

<script>
import {
  updataBimProductsModelCheck,
  getbimProductsModelInfo,
  updataBimProductsModel,
  delBimProductsModel,
  getbimProductsModelList,
  addBimProductsModel,
  uploadDimProductsModel
} from '@/api/masterDataManagement/index'
import ExportForm from '@/components/no_mount/ExportBox/index'
import { excelExport } from '@/api/basicData/index'
import JNPFForm from './Form'
import TableForm from './tabForm'
import { mapGetters, mapState } from 'vuex'
import SuperQuery from '@/components/SuperQuery/index.vue'
import { getbimProductAttributesList, getbimProductAttributes } from '@/api/masterDataManagement/index'

export default {
  name: 'modelManagement',
  components: { JNPFForm, ExportForm, TableForm, SuperQuery },
  data() {
    return {
      systemSearchView: [{
        matchLogic: "AND", // 条件逻辑（固定）*
        fullName: "默认视图", // 视图名称*
        conditionJson: { // 视图内容配置*
          condition: [ // 视图查询条件（自动根据绑定表格的列顺序排序）
            // 这里放置系统原顶栏显示的查询元素，如：
            { prop: 'model', symbol: 'like', fixed: true },
            {
              prop: 'createTime', // 属性*
              symbol: 'between', // 比较符*
              timeOffset: true, // 保存视图后的静态时间区间随实际查询时刻偏移
              fixed: true // 是否在搜索栏显示
            },
          ],
          // keywordQuery: this.jnpf.getKeywordQuery('product'), // 带有产品信息的表使用此预设
          pageSize: 20, // 每页条数*
          orderItems: [
            {
              asc: false,
              column: 'createTime'
            }
          ]
        },
      }],
      btnLoading:false,
      tableFormVisible: false,
      exportFormVisible: false,
      columnList: [],
      createTimeArr: [],
      title: '更多查询',
      visible: false,
      tableData: [],
      listLoading: false,
      listQuery: {},
      file:null,
      total: 0,
      formVisible: false,
      selectList: [],
      uploadVisib: false,
      superQueryVisible: false,
      superQueryJson: []
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    ...mapState('user', ['token'])
  },
  created() {

  },
  methods: {

    // 批量新建
    batchAdd() {
      this.tableFormVisible = true
      this.$nextTick(() => {
        this.$refs.TableForm.init(this.selectList, 'add')
      })
    },
    handleSelectionChange(val) {
      this.selectList = val
    },
    batchEditFun() {
      if (!this.selectList.length) return this.$message.error('请先选择您要修改的数据!')
      this.tableFormVisible = true
      this.$nextTick(() => {
        this.$refs.TableForm.init(this.selectList, 'edit')
      })
    },
    exportType(data, ref) {
      if (data.length) {
        this.exportFormVisible = true
        let domRef = this.$refs[`${ref}`]
        console.log(domRef)
        let columnList = domRef.columnList.filter((item) => !!item.label && !!item.prop)
        columnList = columnList.map((item) => {
          return { label: item.label, prop: item.prop }
        })
        this.$nextTick(() => {
          this.$refs.exportForm.init(columnList)
        })
      } else {
        this.$message({
          message: '暂无数据导出',
          type: 'error',
          duration: 1500
        })
      }
    },
    // 导出
    exportForm() {
      this.exportType(this.tableData, 'dataTable')
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
      this.file=null
    },
    handlePreview(file) {
      console.log(file)
    },
    handleFileChange(file) {
      console.log('所选文件:', file)
      this.file = file.raw
    },
    saveSubmit() {
      if(!this.file) return this.$message.error("请选择你要上传的文件")
      this.UploadProduct(this.file)
    },
    download(data) {
      if (data) {
        this.exportFormVisible = false
        let includeFieldMap = {}
        for (let i = 0; i < data.selectKey.length; i++) {
          includeFieldMap[data.selectKey[i]] = data.selectVal[i]
        }
        let query = this.listQuery
        let _data = {
          ...query,
          exportType: '1202',
          exportName: '型号管理',
          includeFieldMap,
          pageSize: data.dataType == 0 ? this.listQuery.pageSize : -1
        }
        excelExport(_data)
          .then((res) => {
            this.exportFormVisible = false
            if (!res.data.url) return
            this.jnpf.downloadFile(res.data.url)
          })
          .catch(() => { })
      }
    },

    distributionFun() {
      if (!this.selectArr.length) return this.$message.error('请先选择要分配的数据')
      this.customerVisi = true
    },
    // 下载模板
    downLoadTemplate() {
      const a = document.createElement('a')
      a.setAttribute('download', '')
      a.setAttribute('href', location.origin + '/static/型号导入模板.xlsx')
      a.click()
    },
    importFun() {
      // this.$refs.UploadProduct.$el.querySelector('input').click()
      this.uploadVisib = true
    },
    // 上传产品
    UploadProduct(data) {
      console.log('data', data)
      this.loadingText = '正在导入数据'
      this.formLoading = true
      this.btnLoading=true
      var formData = new FormData()
      formData.append('file', data)
      //调用上传文件接口
      uploadDimProductsModel(formData)
        .then((res) => {
          if (!res.data) {
            this.$message.success(`导入成功`)
            this.initData()
            this.formLoading = false
            this.btnLoading = false
            this.loadingText = ''
            this.file=null
          } else {
            this.file=null

            this.btnLoading = false
            this.handleMessage(res.data)
          }
        })
        .catch((err) => {
          this.$message.error(`文件上传失败`)
          this.formLoading = false
            this.btnLoading = false
          this.loadingText = ''
        })
    },
    // 提示
    handleMessage(data) {
      const h = this.$createElement
      this.$message({
        type: 'error',
        duration: 0,
        showClose: true,
        customClass: 'my-message', // 自定义类名，用于设置样式
        message: h(
          'div',
          {
            style: 'padding-right:20px;display:flex;align-items:center;color:#f56c6c;'
          },
          [
            h('p', { style: 'font-size:14px;' }, '导入成功，存在型号相关信息错误！'),
            h(
              'el-button',
              {
                props: {
                  type: 'text',
                  size: 'mini',
                  icon: 'el-icon-download'
                },
                on: {
                  click: () => {
                    this.downNoProduct(data)
                  }
                },
                style: {
                  border: 'none',
                  textAlign: 'center',
                  // width:"20%",
                  margin: '0 5px 0 5px '
                }
              },
              '下载导入错误数据'
            )
          ]
        )
      })
      return
    },
    cancelFun() {
      this.uploadVisib = false
      this.btnLoading = false
      this.file=null
      this.$refs['uploadRef'].clearFiles()
    },
    // 导入产品  下载导入错误数据
    downNoProduct(res) {
      this.jnpf.downloadFile(res.url, res.name)
    },
    columnSetFun() {
      console.log('this.$refs.dataTable', this.$refs.dataTable)
      this.$refs.dataTable.showDrawer()
    },
    initData(listQuery) {
      if (listQuery) this.listQuery = listQuery;
      if (!this.listQuery?.pageSize) return this.$message.error('请先等待视图加载完成！');
      const listLoadKey = this.listLoadKey = +new Date();
      if (listLoadKey !== this.listLoadKey) return; // 请求过期

      this.listLoading = true
      getbimProductsModelList(this.listQuery)
        .then((res) => {
          if (listLoadKey !== this.listLoadKey) return; // 请求过期
          this.tableData = res.data.records
          this.total = res.data.total
          this.listLoading = false
        })
        .catch(() => {
          if (listLoadKey !== this.listLoadKey) return; // 请求过期
          this.listLoading = false
        })
    },

    refresh(isrRefresh) {
      this.formVisible = false
      this.tableFormVisible = false
      if (isrRefresh) this.initData()
      this.initData()
    },

    addOrUpdateHandle(id, type) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.JNPFForm.init(id, type)
      })
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      })
        .then(() => {
          delBimProductsModel(id).then((res) => {
            if (res.msg === 'Success') {
              this.initData()
              this.$message({
                type: 'success',
                message: '删除成功',
                duration: 1500
              })
            }
          })
        })
        .catch(() => { })
    },

  }
}
</script>
<style scoped>
/* .JNPF-common-layout-left {
    margin-right: 0;
    border-right: 1px solid #cacaca;
  }

  ::v-deep .el-tabs__content {
    height: calc(100vh - 163px);
  } */

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

::v-deep .icon-piliang-copy {
  margin-right: 8px;
}
</style>
