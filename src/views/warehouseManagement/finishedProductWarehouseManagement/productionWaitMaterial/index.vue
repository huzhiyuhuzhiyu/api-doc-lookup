<template>
  <!-- 生产待领料查询 -->
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main" v-if="!formVisible">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="form.productionOrderNo" @keyup.enter.native="search()" placeholder="领料单号"
                  clearable />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="form.prodDrawingNo" @keyup.enter.native="search()" placeholder="品名规格" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="form.productDrawingNo" @keyup.enter.native="search()" placeholder="用料规格" clearable />
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item>
                <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">
                  {{ $t('common.search') }}
                </el-button>
                <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">
                  {{ $t('common.reset') }}
                </el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <div class="JNPF-common-layout-main JNPF-flex-main">
          <div class="JNPF-common-head">
            <topOpts @add="addSupplier()" :addText="'直接领料'">
              <el-button :loading="btnLoading" size="mini" type="success" @click="handleBatch()">完成</el-button>
              <el-button type="primary" size="mini" icon="el-icon-download" @click="exportForm('dataTable')">
                导出
              </el-button>
            </topOpts>
            <div class="JNPF-common-head-right">
              <el-tooltip content="高级查询" placement="top" v-if="true">
                <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                  @click="superQueryVisible = true" />
              </el-tooltip>
              <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                  @click="columnSetFun()" />
              </el-tooltip>
              <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
              </el-tooltip>
            </div>
          </div>
          <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" :fixedNO="true" hasC
            :setColumnDisplayList="columnList" @sort-change="sortChange" custom-column
            @selection-change="handleSelectionChange">
            <el-table-column prop="productionOrderNo" label="生产任务单号" min-width="180"
              sortable="custom"></el-table-column>
            <el-table-column prop="orderType" label="任务类型" min-width="120" sortable="custom">
              <template slot-scope="scope">
                {{ $getLabel(orderTypeList, scope.row.orderType, 'value', 'label') }}
              </template>
            </el-table-column>

            <el-table-column prop="prodCode" label="产品编码" min-width="160" sortable="custom" />
            <el-table-column prop="prodDrawingNo" label="品名规格" min-width="160" sortable="custom" />
            <el-table-column prop="prodName" label="产品名称" min-width="150" sortable="custom" />
            <el-table-column prop="productCode" label="用料编码" min-width="160" sortable="custom" />
            <el-table-column prop="productName" label="用料名称" min-width="150" sortable="custom" />
            <el-table-column prop="productDrawingNo" label="用料规格" min-width="160" sortable="custom" />
            <el-table-column prop="processName" label="工序名称" min-width="140" sortable="custom" />
            <el-table-column prop="processCode" label="工序编码" min-width="140" sortable="custom" />
            <el-table-column prop="material" label="保持架材质" min-width="130" sortable="custom" />
            <el-table-column prop="colour" label="颜色" min-width="100" sortable="custom" />
            <el-table-column prop="mainUnit" label="单位" min-width="80" />
            <el-table-column prop="materialsUsedQuantity" label="计划用量" min-width="140" sortable="custom" />
            <el-table-column prop="receivedQuantity" label="已领数量" min-width="140" sortable="custom" />
            <el-table-column prop="inventoryQuantity" label="库存数量" min-width="140" sortable="custom" />
            <el-table-column prop="lineEdgeName" label="线边仓库" min-width="140" sortable="custom" />
            <el-table-column prop="createTime" label="创建时间" min-width="180" sortable="custom" />
          </JNPF-table>

          <pagination :total="total" :page.sync="form.pageNum" :limit.sync="form.pageSize" @pagination="initData">
          </pagination>
        </div>
      </div>
    </div>

    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" />

    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
  </div>
</template>

<script>
import {
  getWaitMaterialList,
  finishWaitMaterialList,
  deleteTransferData
} from '@/api/warehouseManagement/transferManagement'
import { excelExport } from '@/api/basicData/index'
import Form from '../directMaterialRequisition/Form.vue'
import SuperQuery from '@/components/SuperQuery/index.vue'
import moment from 'moment'
import ExportForm from '@/components/no_mount/ExportBox/index'
import { getclassAttributelistByCode } from '@/api/masterDataManagement/index'
import { getbimProductAttributesListMap } from '@/api/masterDataManagement/index'
import getProjectList from '@/mixins/generator/getProjectList'
import { mapGetters, mapState } from 'vuex'
import { getLabel } from '@/utils/index'
Vue.prototype.$getLabel = getLabel
export default {
  name: 'productionWaitMaterial',
  components: { Form, ExportForm, SuperQuery },
  props: {
    warehouseCode: ''
  },
  mixins: [getProjectList],
  data() {
    return {
      documentStatusList: [{ label: '草稿', value: 'draft' }, { label: '提交', value: 'submit' }],
      orderTypeList: [{ label: '正常订单', value: 'normal' }, { label: '返工订单', value: 'rework' }],

      columnList: ['orderType', 'prodCode', 'processCode', 'createTime'],
      superQueryVisible: false,
      exportFormVisible: false,
      tableData: [],
      listLoading: false,
      form: {
        pickingStatus: 'not_finished',
        reduceType: 'auto',
        pageNum: 1,
        pageSize: 20,
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'create_time'
          }
        ],

        superQuery: {}
      },

      selectData: [],
      pickingDateArr: [],
      total: 0,
      formVisible: false,
      superQueryJson: [
        {
          prop: 'productionOrderNo',
          label: '生产任务单号',
          type: 'input'
        },
        {
          prop: 'orderType',
          label: '单据状态',
          type: 'select',
          options: this.orderTypeList
        },
        {
          prop: 'prodCode',
          label: '产品编码',
          type: 'input'
        },
        {
          prop: 'prodDrawingNo',
          label: '品名规格',
          type: 'input'
        },
        {
          prop: 'prodName',
          label: '产品名称',
          type: 'input'
        },
        {
          prop: 'productCode',
          label: '用料编码',
          type: 'input'
        },
        {
          prop: 'productName',
          label: '用料名称',
          type: 'input'
        },
        {
          prop: 'productDrawingNo',
          label: '用料规格',
          type: 'input'
        },
        {
          prop: 'processName',
          label: '工序名称',
          type: 'input'
        },
        {
          prop: 'processCode',
          label: '工序编码',
          type: 'input'
        },
        {
          prop: 'mainUnit',
          label: '单位',
          type: 'select',
          options: []
        },
        {
          prop: 'materialsUsedQuantity',
          label: '计划用量',
          type: 'input'
        },
        {
          prop: 'receivedQuantity',
          label: '已领数量',
          type: 'input'
        },
        {
          prop: 'inventoryQuantity',
          label: '库存数量',
          type: 'input'
        },
        {
          prop: 'lineEdgeName',
          label: '线边仓库',
          type: 'input'
        },
        {
          prop: 'createTime',
          label: '创建时间',
          type: 'daterange',
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期'
        }
      ],
      classAttributeList: [],
      isProjectSwitch: '',
      bimProductAttributesList: {}
    }
  },

  computed: {
    ...mapGetters(['userInfo'])
  },
  async created() {
    await this.getProductClassFun()
    await this.getProjectSwitch('system', 'project')
    this.isProjectSwitchFlag = true
    this.getclassAttributeList()
    this.advancedQueryFun()
  },
  methods: {
    // 选中数据后 将数据传到source页
    handleSelectionChange(value) {
      this.selectData = value
    },
    getclassAttributeList() {
      getclassAttributelistByCode({ code: this.warehouseCode }).then((res) => {
        console.log('类别属性', res)
        this.classAttributeList = res.data
        this.initData()
      })
    },
    viewFun(id, btnType) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, btnType, this.classAttributeList)
      })
    },
    editFun(id, btnType) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, btnType, this.classAttributeList)
      })
    },
    // 批量完成
    handleBatch() {
      console.log(this.selectData, '选择的数据')
      if (!this.selectData.length) {
        this.$message.error('请先选择您要完成的数据')
      } else {
        this.btnLoading = true
        this.$confirm('手动完成后，将不能再继续直接领料，您是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            let data = this.selectData.map((item) => item.id)
            finishWaitMaterialList(data)
              .then((res) => {
                console.log(res, '1111')
                if (res.msg == 'Success') {
                  this.$message({
                    message: '完成成功',
                    type: 'success',
                    duration: 1000,
                    onClose: () => {
                      this.btnLoading = false
                      this.initData()
                    }
                  })
                }
              })
              .catch(() => {
                this.btnLoading = false
              })
          })
          .catch(() => {
            this.btnLoading = false
          })
      }
    },
    superQuerySearch(query) {
      this.form.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },
    getProductClassFun() {
      // 产品属性
      getbimProductAttributesListMap().then((res) => {
        this.bimProductAttributesList = res.data
      })
    },
    advancedQueryFun() {
      //     material //保持架材质
      //     colour //颜色
      let classIndex = this.superQueryJson.findIndex((obj) => obj.prop === 'processCode')
      this.superQueryJson.splice(classIndex + 1, 0, {
        prop: 'colour',
        label: '颜色',
        type: 'select',
        options: this.bimProductAttributesList.pa010.map((item) => {
          return {
            label: item.name,
            value: item.name
          }
        })
      })
      this.superQueryJson.splice(classIndex + 1, 0, {
        prop: 'material',
        label: '保持架材质',
        type: 'select',
        options: this.bimProductAttributesList.pa021.map((item) => {
          return {
            label: item.name,
            value: item.name
          }
        })
      })
    },
    sortChange({ prop, order }) {
      let newProp
      if (
        [
          'productionOrderNo',
          'prodCode',
          'prodDrawingNo',
          'prodName',
          'productCode',
          'productName',
          'productDrawingNo',
          'processName',
          'processCode',
          'lineEdgeName'
        ].includes(prop)
      ) {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
      }
      if (prop == 'createByName') {
        newProp = 'create_by'
      }
      this.form.orderItems[0].asc = order === 'ascending'
      this.form.orderItems[0].column = order === null ? '' : newProp
      this.initData()
    },

    dataFormSubmit() {
      this.form.pageNum = 1
      Object.keys(this.form).forEach((key) => {
        // 清除搜索条件两端空格
        let item = this.form[key]
        this.form[key] = typeof item === 'string' ? item.trim() : item
      })

      if (this.pickingDateArr && this.pickingDateArr.length > 0) {
        this.form.pickingStartDate = this.pickingDateArr[0]
        this.form.pickingEndDate = this.pickingDateArr[1]
      } else {
        this.form.pickingStartDate = ''
        this.form.pickingEndDate = ''
      }
      this.initData()
    },

    // 关闭新建编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.keyword = ''
        this.initData()
      }
    },
    initData() {
      this.selectData = []
      this.listLoading = true
      this.form.classAttributeList = this.classAttributeList
      this.form.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
      getWaitMaterialList(this.form)
        .then((res) => {
          this.tableData = res.data.records
          this.total = res.data.total
          this.listLoading = false
        })
        .catch(() => {
          this.listLoading = false
        })
    },

    search() {
      this.dataFormSubmit()
    },

    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.pickingDateArr = []
      this.form = {
        orderNo: '',
        pickingStartDate: '',
        pickingEndDate: '',
        documentStatus: '',
        transferType: 'receive_material',
        pageNum: 1,
        pageSize: 20,
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'create_time'
          }
        ],

        superQuery: {}
      }

      this.search()
    },

    addSupplier() {
      if (!this.selectData.length) {
        return this.$message.error('请先选择您要直接领料的数据')
      }
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init('', 'add', this.classAttributeList, this.warehouseCode, this.selectData)
      })
    },

    // 导出
    exportForm(exportTableRef) {
      this.exportTableRef = exportTableRef
      this.exportFormVisible = true
      let columnList = this.$refs[exportTableRef].columnList.filter((item) => !!item.label && !!item.prop)
      columnList = columnList.map((item) => {
        return { label: item.label, prop: item.prop }
      })
      this.$nextTick(() => {
        this.$refs.exportForm.init(columnList)
      })
    },
    download(data) {
      this.exportFormVisible = false
      let includeFieldMap = {}
      for (let i = 0; i < data.selectKey.length; i++) {
        includeFieldMap[data.selectKey[i]] = data.selectVal[i]
      }
      const targetListQuery = this.form
      let _data = {
        ...targetListQuery,
        exportType: '1240',
        exportName: '生产待领料',
        includeFieldMap,
        pageSize: data.dataType == 0 ? targetListQuery.pageSize : -1
      }
      excelExport(_data).then((res) => {
        this.exportFormVisible = false
        if (!res.data.url) return
        this.jnpf.downloadFile(res.data.url, res.data.name)
      })
    }
  }
}
</script>
<style scoped>
.el-tab-pane {
  height: calc(100% - 10px);
}

::v-deep .el-tabs__content {
  height: calc(100% - 40px);
}

.el-tabs {
  height: 100%;
}

.el-tabs__nav-scroll {
  padding-left: 10px;
}

.JNPF-common-search-box {
  padding: 8px 0 !important;
  margin-left: 0 !important;

  margin-bottom: 5px;
}

.JNPF-common-head {
  padding: 8px;
}

.JNPF-common-search-box .el-form-item {
  margin-bottom: 0px !important;
}

.pagination-container {
  background-color: #f5f5f5;
  margin-top: 0px;
  padding-right: 10px;
  padding-top: 2px;
  padding-bottom: 2px;
}

.main {
  padding: 10px 30px 0;
}

.aaa ::v-deep .el-tabs__header {
  padding: 0 !important;
  padding-bottom: 10px !important;
  margin-bottom: 0;
  padding-left: 10px !important;
  background: #fff;
}

.el-button--small {
  padding: 1;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
}

.JNPF-common-layout-center .JNPF-common-layout-main {
  padding-bottom: 0;
}
</style>
