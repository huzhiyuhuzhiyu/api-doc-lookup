<template>
  <div class="JNPF-common-layout" :element-loading-text="loadingText">
    <div class="JNPF-common-layout-left treeBox" :style="leftFlag ? 'width:15px;background:#fff' : ''">
      <div class="JNPF-common-title">
        <h2 v-if="!leftFlag">产品分类</h2>
        <span class="options" v-if="!leftFlag">
          <el-dropdown>
            <el-link icon="icon-ym icon-ym-mpMenu" :underline="false" />
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="getcategoryTree(true)">刷新数据</el-dropdown-item>
              <el-dropdown-item @click.native="toggleExpand(true)">展开全部</el-dropdown-item>
              <el-dropdown-item @click.native="toggleExpand(false)">折叠全部</el-dropdown-item>
              <el-dropdown-item @click.native="setexpand(true)">设置默认展开</el-dropdown-item>
              <el-dropdown-item @click.native="setexpand(false)">设置默认收起</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span>
      </div>
      <el-scrollbar class="JNPF-common-el-tree-scrollbar" v-loading="treeLoading" v-if="!leftFlag">
        <el-tree ref="treeBox" :data="treeData" :props="defaultProps" :default-expand-all="expands" highlight-current
          :expand-on-click-node="false" node-key="id" @node-click="handleNodeClick" class="JNPF-common-el-tree"
          v-if="refreshTree" :filter-node-method="filterNode">
          <span class="custom-tree-node" slot-scope="{ data }" :title="data.name">
            <i :class="[
              data.childrenList.length > 0 ? 'icon-ym icon-ym-tree-organization3' : 'icon-ym icon-ym-systemForm'
            ]" />
            <span class="text" :title="data.name">{{ data.name }}</span>
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
      <JNPF-tableQuery :listQuery="listQuery" :systemSearchView="systemSearchView" tableRef="dataTable" />
      <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="listLoading">
        <div class="JNPF-common-head" style="padding:10px">
          <div>
            <el-button size="mini" type="primary" @click="addOrUpdateHandle()">生成采购订单</el-button>
            <el-button size="mini" type="primary" @click="handleBuyingRequisition">生成请购单</el-button>
            <el-button :disabled="tableData.length > 0 ? false : true" size="mini" type="primary"
              icon="el-icon-download" @click="exportForm">
              导出
            </el-button>
          </div>

          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" content="数据排序设置" placement="top">
                <el-link icon="icon-ym icon-ym-generator-flow JNPF-common-head-icon" :underline="false"
                  @click="$refs.dataTable.showSortDrawer()" />
              </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table :data="tableData" :fixedNO="true" hasC custom-column
          ref="dataTable" :setColumnDisplayList="columnList" @selection-change="handeleProductInfoData" customKey="JNPFTableKey_195052" :listQuery="listQuery" @queryChange="initData" :queryJson="superQueryJson">
          <el-table-column prop="code" label="产品编码" width="220"></el-table-column>
          <el-table-column prop="name" label="产品名称" width="220"></el-table-column>
          <el-table-column prop="drawingNo" label="产品型号" min-width="220" />
          <el-table-column prop="productCategoryName" label="产品分类" width="120" />
          <el-table-column prop="classAttribute" label="类别属性" width="120">
            <template slot-scope="scope">
              {{ $getLabel(classAttributeList, scope.row.classAttribute, 'value', 'label') }}
            </template>
          </el-table-column>
          <el-table-column prop="mainUnit" label="单位" min-width="90"/>
          <el-table-column prop="availableQuantity" label="可用库存" min-width="130" />
          <el-table-column prop="safeInventory" label="安全库存" min-width="130" />
          <el-table-column prop="maxInventory" label="最高库存" min-width="130" />
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :background="background"
          :limit.sync="listQuery.pageSize" @pagination="initData()" />
      </div>
    </div>
    <Form v-if="formVisible" ref="Form" @refreshDataList="initData()" @close="closeForm" />
    <createdBuyingRequisitionForm ref="createdBuyingRequisitionForm" v-if="createdBuyingVisible" :autoInit="false" @close="closeForm"/>
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
    <!-- 导入产品 -->
    <el-upload action="#" v-show="false" accept=".xls, .xlsx" :headers="{ token }" ref="UploadProduct"
      :http-request="UploadProduct" />
    <!-- 高级查询 -->

    <el-dialog title="导入数据" append-to-body :close-on-click-modal="false" :close-on-press-escape="false"
      :visible.sync="uploadVisib" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="400px">
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
        <el-button type="primary" @click="saveSubmit()">
          提交
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ExportForm from '@/components/no_mount/ExportBox/index'
import {excelExport} from '@/api/basicData'
import {getProductList, deleteProduct, uploadCpProductData} from '@/api/masterDataManagement/productManage'
import {getcategoryTree} from '@/api/basicData/materialSettings'
import Form from '@/views/purchasingManagement/purchasingDemand/purchasingDemandPool/Form.vue'
import createdBuyingRequisitionForm from '@/views/purchasingManagement/purchasingDemand/createdBuyingRequisition/index.vue'
import SuperQuery from '@/components/SuperQuery/index.vue'
import {getclassAttributeList} from '@/api/masterDataManagement'
import getProjectList from '@/mixins/generator/getProjectList'
import {getLabel} from '@/utils'

Vue.prototype.$getLabel = getLabel
export default {
  components: {createdBuyingRequisitionForm, Form, ExportForm, SuperQuery},
  name: 'safetyInventoryWarning',
  mixins: [getProjectList],
  data() {
    return {
      systemSearchView: [{
        matchLogic: "AND", // 条件逻辑（固定）*
        fullName: "默认视图", // 视图名称*
        conditionJson: { // 视图内容配置*
          condition: [ // 视图查询条件（自动根据绑定表格的列顺序排序）
            {
              prop: 'createTime', // 属性*
              symbol: 'between', // 比较符*
              timeOffset: true, // 保存视图后的静态时间区间随实际查询时刻偏移
              fixed: true // 是否在搜索栏显示
            },
            {prop: 'classAttribute', symbol: '==', fixed: true,},
          ],
          keywordQuery: this.jnpf.getKeywordQuery('product'), // 带有产品信息的表使用此预设
          pageSize: 20, // 每页条数*
          orderItems: []
        },
      }],
      columnList: [],
      exportFormVisible: false,
      title: '更多查询',
      background: true, //分页器背景颜色
      visible: false,
      treeData: [],
      tableData: [],
      treeLoading: false,
      listLoading: false,
      loadingText: false,
      leftFlag: false,
      selectData: [],
      classAttributeList: [],
      listQuery: {
        safeInventoryWarnFlag: 1,
        pageSize: 20,
        productSource: 'purchase', // 产品来源
      },
      productStatusList: [{ label: '启用', value: 'enable' }, { label: '禁用', value: 'disabled' }], // 产品状态
      productSourceList: [
        { label: '自制', value: 'produce' },
        { label: '采购', value: 'purchase' },
        { label: '外协', value: 'out' }
      ], // 产品来源
      total: 0,
      formVisible: false,
      createdBuyingVisible: false,
      expands: true,
      refreshTree: true,
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },

      superQueryVisible: false,
      superQueryJson: [{
        prop: 'classAttribute',
        label: '类别属性',
        type: 'select',
        options: []
      }],
      uploadVisib: false
    }
  },
  mounted() {
    this.getProductClassFun()
  },
  async created() {
    if (localStorage.getItem('safetyInventoryWarningFlag')) {
      let roleFlag = JSON.parse(localStorage.getItem('safetyInventoryWarningFlag'))
      this.expands = roleFlag
      this.toggleExpand(roleFlag)
    }

    this.getcategoryTree(false)

  },
  methods: {
    handleBuyingRequisition(){
      if (this.selectData.length === 0) {
        return this.$message.warning('请选择你要生成的请购单')
      }
      this.createdBuyingVisible = true
      this.$nextTick(() => {
        this.$refs.createdBuyingRequisitionForm.init('', 'add', false, this.selectData)
      })
    },
    // 选中列表的数据 将其带到生成订单下面表单表格中
    handeleProductInfoData(val) {
      this.selectData = val
    },
    // // 设置默认展开
    setexpand(expands) {
      this.refreshTree = false
      this.expands = expands
      this.$nextTick(() => {
        this.refreshTree = true
        localStorage.setItem('safetyInventoryWarningFlag', expands)
      })
    },
    changeLeft() {
      this.leftFlag = !this.leftFlag
    },
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },
    // 导出
    exportForm() {
      this.exportFormVisible = true
      let columnList = this.$refs.dataTable.columnList.filter((item) => !!item.label && !!item.prop)
      columnList = columnList.map((item) => {
        return { label: item.label, prop: item.prop }
      })
      this.$nextTick(() => {
        this.$refs.exportForm.init(columnList)
      })
    },
    download(data) {
      if (data) {
        this.exportFormVisible = false
        let includeFieldMap = {}
        for (let i = 0; i < data.selectKey.length; i++) {
          includeFieldMap[data.selectKey[i]] = data.selectVal[i]
        }
        let _data = {
          ...this.listQuery,
          exportType: '1200',
          exportName: '安全库存预警信息',
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
    // 展开或折叠全部
    toggleExpand(expands) {
      this.refreshTree = false
      this.expands = expands
      this.$nextTick(() => {
        this.refreshTree = true
        this.$nextTick(() => {
          this.$refs.treeBox.setCurrentKey(this.companyId)
        })
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },

    // 获取指定树状列表
    getcategoryTree(flag) {
      this.listLoading = true
      this.treeLoading = true
      this.listQuery.productCategoryId = '' // 重置数据类型id筛选
      getcategoryTree({ classAttribute: '', type: 'material' })
        .then((res) => {
          this.treeData = res.data.length ? res.data : []
          this.$nextTick(() => {
            this.treeLoading = false
            flag && this.initData()
          })
        })
        .catch(() => {
          this.treeLoading = false
          this.listLoading = false
        })
    },
    handleNodeClick(data, node) {
      if (this.listQuery.productCategoryId === data.id) return
      this.listQuery.productCategoryId = data.id
      this.listQuery.productCategoryCode = data.code
      this.initData()
    },
    moreQueries() {
      this.visible = true
    },

    // 关闭新建、编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      this.createdBuyingVisible = false
      if (isRefresh) {
        this.initData()
      }
    },

    initData(listQuery) {
      if (listQuery) this.listQuery = listQuery;
      if (!this.listQuery?.pageSize) return this.$message.error('请先等待视图加载完成！');
      const listLoadKey = this.listLoadKey = +new Date();

      this.listLoading = true
      getProductList(this.listQuery)
        .then((res) => {
          if (listLoadKey !== this.listLoadKey) return; // 请求过期
          this.tableData = res.data.records
          this.total = res.data.total
          this.listLoading = false
          this.visible = false
        })
        .catch(() => {
          if (listLoadKey !== this.listLoadKey) return; // 请求过期
          this.listLoading = false
        })
    },



    // 生成采购订单 将选中的数据传递过去
    addOrUpdateHandle() {
      if (this.selectData.length === 0) {
        this.$message({
          message: '请选择你要生成的采购订单',
          type: 'error',
          duration: 1500
        })
      } else {
        let msg = true
        let tempList = JSON.parse(JSON.stringify(this.selectData))
        let hasItemList = []
        for (let i = 0; i < this.selectData.length; i++) {
          let item = this.selectData[i]

          if (item.orderedQuantity != null) {
            if (item.planDemandQuantity * 1 <= item.orderedQuantity * 1) {
              hasItemList.push(item.productName)
              if (hasItemList.length) {
                this.$message.error(`已下单数量已大于或等于计划需求数的产品：${hasItemList.join('、')}`)
                msg = false
              } else {
                msg = true
              }
            }
          }
        }
        if (msg) {
          this.selectData.forEach((item, index) => {
            item.purchaseQuantity = item.planDemandQuantity - item.orderedQuantity * 1
            if (item.calculationDirection === 'multiplication') {
              this.$set(
                this.selectData[index],
                'purchaseQuantity2',
                this.jnpf.numberFormat(item.purchaseQuantity * item.ratio)
              )
            } else {
              this.$set(
                this.selectData[index],
                'purchaseQuantity2',
                this.jnpf.numberFormat(item.purchaseQuantity / item.ratio)
              )
            }
          })
          this.formVisible = true
          this.$nextTick(() => {
            this.$refs.Form.init(this.selectData, this.listQuery.classAttribute, 'safe')
          })
        }
      }
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      })
        .then(() => {
          deleteProduct(id).then((res) => {
            this.initData()
            this.$message({
              type: 'success',
              message: '删除成功',
              duration: 1500
            })
          })
        })
        .catch(() => { })
    },
    // 导入
    importForm() {
      if (!this.listQuery.productCategoryId) {
        this.$message.warning('请先选择产品分类')
      } else {
        this.uploadVisib = true
      }
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleFileChange(file) {
      this.file = file.raw
    },
    downLoadTemplate() {
      const a = document.createElement('a')
      a.setAttribute('download', '')
      a.setAttribute('href', location.origin + '/static/成品导入模板.xlsx')
      a.click()
    },
    // 上传产品
    UploadProduct(data) {
      this.loadingText = '正在导入数据'
      this.formLoading = true
      var formData = new FormData()
      formData.append('file', data)
      formData.append('productCategoryId', this.listQuery.productCategoryId)
      formData.append('classAttribute', this.listQuery.classAttribute)
      //调用上传文件接口
      uploadCpProductData(formData)
        .then((res) => {
          if (!res.data) {
            this.$message.success(`导入成功`)
          } else {
            this.handleMessage(res.data)
          }

          this.formLoading = false
          this.loadingText = ''
        })
        .catch((err) => {
          this.$message.error(`导入数据超过最大限制：500`)
          this.formLoading = false
          this.loadingText = ''
        })
    },
    // 导入产品  下载导入错误数据
    downNoProduct(res) {
      this.jnpf.downloadFile(res.url, res.name)
    },
    cancelFun() {
      this.uploadVisib = false
      this.$refs['uploadRef'].clearFiles()
    },
    saveSubmit() {
      this.UploadProduct(this.file)
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
            h('p', { style: 'font-size:14px;' }, '导入成功，存在成品产品档案错误！'),
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

    },
    getProductClassFun() {
      let obj = {

        pageSize: -1
      }
      getclassAttributeList(obj).then((res) => {
        let arr = []
        res.data.records.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.code
          }
          arr.push(obj)
        })
        let classAttributeObj = this.superQueryJson.find((item) => item.prop === 'classAttribute')

        if (classAttributeObj) {
          classAttributeObj.options = arr
        }
        this.classAttributeList = arr
      })
    }
  }
}
</script>
