<template>
  <div :class="[elementShow ? 'popupSelect-container' : '']">
    <div class="el-select" @click.stop="openDialog" @keyup.enter="openDialog" v-show="elementShow">
      <div :class="['el-select__tags', tagMultipleLine ? '' : 'singleLine']" v-if="multiple" ref="tags"
        :style="{ 'max-width': inputWidth - 32 + 'px', width: '100%', cursor: 'pointer' }">
        <span v-if="collapseTags && tagsList.length">
          <el-tag :closable="!selectDisabled" :size="collapseTagSize" type="info" @close="deleteTag($event, 0)"
            disable-transitions>
            <span class="el-select__tags-text">{{ tagsList[0] }}</span>
          </el-tag>
          <el-tag v-if="tagsList.length > 1" :closable="false" type="info" disable-transitions>
            <span class="el-select__tags-text">+ {{ tagsList.length - 1 }}</span>
          </el-tag>
        </span>
        <transition-group @after-leave="resetInputHeight" v-if="!collapseTags">
          <el-tag v-for="(item, i) in tagsList" :key="item + '_' + i" :size="collapseTagSize" :closable="!selectDisabled"
            type="info" @close="deleteTag($event, i)" disable-transitions>
            <span class="el-select__tags-text">{{ item }}</span>
          </el-tag>
        </transition-group>
      </div>
      <el-input ref="reference" v-model="innerValue" type="text" :placeholder="currentPlaceholder" :disabled="isdisabled"
        readonly :validate-event="false" :tabindex="(multiple) ? '-1' : null" @mouseenter.native="inputHovering = true"
        @mouseleave.native="inputHovering = false">
        <template slot="suffix">
          <i v-show="!showClose" :class="['el-select__caret', 'el-input__icon', 'el-icon-arrow-up']"></i>
          <i v-if="showClose" class="el-select__caret el-input__icon el-icon-circle-close" @click="handleClearClick"></i>
        </template>
      </el-input>
    </div>
    <el-dialog :title="computedDialogTitle" :close-on-click-modal="false" :visible="visible" lock-scroll
      class="JNPF-dialog JNPF-dialog_center selectPro" :width="dialogWidth" append-to-body @close="visible = false">
      <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">
        <div class="JNPF-common-layout-center JNPF-flex-main">
          <el-row :class="['JNPF-common-search-box', searchList === undefined ? 'noSearchList' : '']" :gutter="16">
            <el-form @submit.native.prevent>
              <template v-for="(item, index) in searchList">
                <el-col :span="searchFieldSpan" :key="item.prop" v-if="index < maxShowSearchField"
                  :class="(index == 0 && !renderTree) ? 'killPaddingLeft' : ''">
                  <el-form-item>
                    <el-input v-if="item.type === 'input'" v-model="listQuery[item.prop]"
                      :placeholder="'请输入' + item.label" clearable @keyup.enter.native="search()" />

                    <el-select v-else-if="item.type === 'select'" v-model="listQuery[item.prop]"
                      :placeholder="'请输入' + item.label" clearable>
                      <el-option v-for="(item2, index2) in item.options" :key="index2" :label="item2.label"
                        :value="item2.value"></el-option>
                    </el-select>
                    <el-date-picker v-else-if="item.type === 'date'" v-model="listQuery[item.prop]"
                      :start-placeholder="'请选择' + item.label + '开始日期'" :end-placeholder="'请选择' + item.label + '结束日期'"
                      clearable type="daterange" value-format="yyyy-MM-dd">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </template>

              <el-col :span="5" v-if="searchList.length" :class="searchList.length === 0 ? 'killPadding' : ''">
                <el-form-item>
                  <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">
                    {{ $t('common.search') }}
                  </el-button>
                  <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">
                    {{ $t('common.reset') }}
                  </el-button>
                </el-form-item>
              </el-col>
              <el-button v-if="searchList.length > maxShowSearchField || (moreSearchList && moreSearchList.length)"
                style="float: right;margin-right: 20px;" size="mini" type="primary"
                icon="icon-ym icon-ym-report-icon-search-setting" @click="moreQueriesVisible = true">更多查询</el-button>
            </el-form>
          </el-row>
          <slot name="top"></slot>
          <div class="JNPF-common-layout-main JNPF-flex-main">
            <JNPF-table v-loading="treeLoading || listLoading" :data="tableData" hasNO fixedNO :hasC="multiple"
              :highlight-current-row="false" @row-dblclick="rowDblclickFun" @selection-change="currentChange"
              :row-class-name="getRowClassName" :checkSelectable="checkSelectable" ref="dataTable"
              @row-click="handleRowClick" :tree-props="{ children: 'childrenList', hasChildren: '' }" row-key="_index"
              :default-expand-all="expandsTable" @sort-change="sortChange">

              <!-- 普通结构 -->
              <template v-if="!listDataTreeFlag">
                <el-table-column v-for="item in tableItems" :key="item.prop" :prop="item.prop" :label="item.label"
                  :fixed="item.fixed || false" :sortable="item.sortable"
                  v-bind="{ width: item.width ? item.width : 0, minWidth: item.hasOwnProperty('minWidth') ? item.minWidth : 120 }" />
              </template>

              <!-- 双级树状结构 -->
              <template v-else>
                <template v-for="item in tableItems">
                  <el-table-column v-if="item.prop !== 'name'" :key="item.prop" :prop="item.prop" :label="item.label"
                    :fixed="item.fixed || false" :min-width="item.minWidth || 120" />

                  <el-table-column prop="name" :key="item.prop" :label="item.label" :fixed="item.fixed || false"
                    :min-width="item.minWidth || 120" v-else-if="item.prop === 'name'">
                    <template slot-scope="scope">
                      <i
                        :class="[scope.row.childrenList.length ? 'icon-ym icon-ym-tree-organization3' : 'icon-ym icon-ym-systemForm']"></i>
                      {{ scope.row.name }}
                    </template>
                  </el-table-column>
                </template>
              </template>

              <!-- 这里可以使用具名插槽替换掉默认内容（此时行双击事件将不再默认触发confirm，需要自定义） -->
              <slot name="table-action">
                <el-table-column label="操作" width="90" fixed="right" v-if="!multiple" ref="defaultTableActionRef">
                  <template slot-scope="scope">
                    <el-button type="text" @click="currentChange(scope.row)" size="mini"
                      :disabled="!checkSelectable(scope.row)">选择</el-button>
                  </template>
                </el-table-column>
              </slot>
            </JNPF-table>
            <pagination v-if="!listDataTreeFlag && total !== undefined" :total="total" :page.sync="listQuery.pageNum"
              :limit.sync="listQuery.pageSize" @pagination="initData" class="pagination-container" />
            <div v-else style="width: 100%; height: 5px; background: #EBEEF5"></div>
          </div>
        </div>
      </div>
      <template slot="footer" v-if="multiple">
        <span class="dialog-footer">
          <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
          <el-button type="primary" @click="confirm" :loading="btnLoading">{{ $t('common.confirmButton') }}</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog :title="'更多查询'" :close-on-click-modal="false" :close-on-press-escape="false"
      :visible.sync="moreQueriesVisible" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="1000px" append-to-body>
      <el-row :gutter="20">
        <el-form ref="diaForm" :model="listQuery" label-width="120px" label-position="top">

          <el-col :span="12" v-for="item in moreSearchList || searchList" :key="item.prop">
            <el-form-item :label="item.label">
              <el-input v-if="item.type === 'input'" v-model="listQuery[item.prop]" :placeholder="'请输入' + item.label"
                clearable />

              <el-select v-else-if="item.type === 'select'" v-model="listQuery[item.prop]"
                :placeholder="'请选择' + item.label" style="width: 100%;">
                <el-option v-for="item2 in item.options" :key="item2.value" :label="item2.label"
                  :value="item2.value"></el-option>
              </el-select>

              <el-select v-else-if="item.type === 'multiple'" v-model="listQuery[item.prop]"
                :placeholder="'请选择' + item.label" clearable style="width: 100%;" multiple>
                <el-option v-for="item2 in item.options" :key="item2.value" :label="item2.label"
                  :value="item2.value"></el-option>
              </el-select>

            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="moreQueriesVisible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="search()">搜 索</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { addResizeListener, removeResizeListener } from 'element-ui/src/utils/resize-event';
import {  getcooperativeProduct } from '@/api/salesManagement/assemblyOrders'
export default {
  name: 'ComSelect-partnerProduct',
  props: {
    value: {},
    ids: {
      type: Array | Function
    },
    title: {
      type: String,
      default: '选择客户产品'
    },
    dialogTitle: {
      type: String,
      default: '选择客户产品'
    },
    tagMultipleLine: {
      type: Boolean,
      default: false
    },
    // methodArr: {
    //   /*
    //     数组写法：[
    //       { label: "原材料分类", classAttribute: "raw_material", method: getcategoryTree, requestObj: { classAttribute: "raw_material" } },
    //       { label: "半成品分类", classAttribute: "semi_finished", method: getcategoryTree, requestObj: { classAttribute: "semi_finished" } },
    //       { label: "成品分类", classAttribute: "finish_product", method: getcategoryTree, requestObj: { classAttribute: "finish_product" } },
    //       { label: "辅料分类", classAttribute: "accessories", method: getcategoryTree, requestObj: { classAttribute: "accessories" } },
    //       { label: "其他分类", classAttribute: "other", method: getcategoryTree, requestObj: { classAttribute: "other" } }
    //     ]
    //     对象写法：{ method: getWarehouseList, requestObj: { chooseUserFlag: true } }
    //   */
    //   default:()=> [{ label: "物料分类", classAttribute: "", method: productTree, requeseObj: { classAttribute: "" } }],
    // },
    /* 列表数据请求方法 */
    // listMethod: {
    //   // required: true
    //   default: getProducts
    // },
    /* 列表数据请求体 */
    listRequestObj: {
      // type: Object | Function,
      /*
        对象写法：{ code: "", name: "", orderItems: [{ asc: false, column: "" }, { asc: false, column: "create_time" }], pageNum: 1, pageSize: 20 }
        函数写法：(rowIndex) => {
          let id = this.linesList[rowIndex].id
          return { id, orderItems: [{ asc: false, column: "" }, { asc: false, column: "create_time" }], pageNum: 1, pageSize: 20 }
        }
      */
      default: () => ({
        contractId: null,
        customerProductNo: "",
        productCode: "",
        productName: "",
        partnerId: "",
        productStatus: "enable",
        partnerType: "customer",
        orderItems: [
          {
            "asc": false,
            "column": ""
          },
          {
            "asc": false,
            "column": "create_time"
          }
        ],
        pageNum: 1,
        pageSize: 20
      })
    },
    paramsObj: {
      type: Object | Array,
      default: () => { }
    },
    treeTitle: {
      type: String,
      default: "客户产品分类"
    },
    searchList: {
      type: Array,
      default: () =>
        [
          { prop: 'customerProductNo', label: ' 客户料号', type: 'input'  },
          { prop: 'productCode', label: '产品编码', type: 'input' },
          { prop: 'productName', label: '产品名称', type: 'input' },
        ]
    },
    moreSearchList: {
      type: Array,
      default: () => [
        { prop: 'customerProductNo', label: ' 客户料号', type: 'input'  },
        { prop: 'productCode', label: '产品编码', type: 'input' },
        { prop: 'productName', label: '产品名称', type: 'input' },
        { prop: 'drawingNo', label: '型号', type: 'input' },
      ]
      /* [
          {prop:'code',label:'编码',type:'input'},
          {prop:'name',label:'名称',type:'input'}
        ] */
    },
    // 数据格式化方法
    dataFormatting: {
      type: Function,
      /* (res) => {
          let treeData = res.data.records.map(item => {
            item.name = item.code;
            return item;
          });
          return treeData
        } */
    },
    listDataFormatting: {
      type: Function,
      /* (res) => {
          let treeData = res.data.records.map(item => {
            item.name = item.code;
            return item;
          });
          return treeData
        } */
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    tableItems: {
      type: Array,
      default: () => [
        { prop: 'customerProductNo', label: ' 客户料号'  },
        { prop: 'productCode', label: '产品编码' },
        { prop: 'productName', label: '产品名称' },
        { prop: 'drawingNo', label: '型号' },
        { prop: 'mainUnit', label: '单位(主)' },
      ]
      /* [
          { prop: 'code', label: '编码' }, // 标准
          { prop: 'name', label: '名称', sortable: 'custom' }, // 附带排序（会把prop驼峰转为下划线形式）
          { prop: 'drawingNo', label: '图号', sortable: 'custom2' }, // 附带排序（保留原prop形式）
        ] */
    },
    disabled: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    collapseTags: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    size: String,
    isdisabled: {
      type: Boolean,
      default: false
    },
    elementShow: {
      type: Boolean,
      default: true
    },
    renderTree: {
      type: Boolean,
      default: true
    },
    listDataTreeFlag: {
      type: Boolean,
      default: false
    },
    checkSelectable: {
      type: Function,
      default: (row) => {
        return true
      }
    },
    rowDblclick: {
      type: Function
    },
    beforeOpen: {
      /* async (paramsObj) => {
          if (!this.dataForm.transferOutWarehouseName) return true // 如果判断条件真，直接提交，不弹出提示
          let flag = await this.$confirm('提示内容', '提示标题', { type: 'warning' }).catch(err => false)
          return flag
        } */
    },
    beforeSubmit: {
      /* async (data, paramsObj) => {
          if (!this.dataForm.transferOutWarehouseName) return true // 如果判断条件真，直接提交，不弹出提示
          let flag = await this.$confirm('提示内容', '提示标题', { type: 'warning' }).catch(err => false)
          return flag
        } */
    },
    // 是否需要有日期的查询
    isNeedDate: {
      type: Boolean,
      default: false
    },
    // 需要搜索的数组
    searchDateList: {
      type: Array,
      default: () => []
    },
    // 搜索栏最多展示多少个搜索条件
    maxShowSearchField: {
      type: Number,
      default: 3
    },
    // 窗口宽度
    dialogWidth: {
      type: String,
      default: '70%'
    },
  },
  data() {
    return {
      allList: [],
      innerValue: '',
      selectedData: [],
      selectedIds: [],
      tagsList: [],
      initialInputHeight: 0,
      rSelectData: [],
      itemScope: {},
      treeName: this.treeTitle,
      moreQueriesVisible: false,
      loadingTotal: 0,
      loading: true,
      inputHovering: false,
      inputWidth: 0,
      treeData: [],
      visible: false,
      treeLoading: false,
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },
      listQuery: {
        code: "",
        name: "",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time" /* 使用倒序日期作为默认排序 */
        }],
        pageNum: 1,
        pageSize: 20
      },
      listLoading: false,
      tableData: [],
      expands: true,
      total: 0,
      btnLoading: false,
      refreshTree: true,
      expandsTable: false,
      initRSelectData: [],
      throttleFlag: true,
    }
  },
  computed: {
    showClose() {
      let hasValue = this.value !== "" && this.value !== undefined && this.value !== null
      let criteria = this.clearable && !this.selectDisabled && this.inputHovering && hasValue;
      return criteria;
    },
    currentPlaceholder() {
      if (this.multiple && Array.isArray(this.value) && this.value.length) {
        return ''
      } else {
        return this.placeholder
      }
    },
    selectDisabled() {
      return this.disabled || (this.elForm || {}).disabled;
    },
    _elFormItemSize() {
      return (this.elFormItem || {}).elFormItemSize;
    },
    selectSize() {
      return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size;
    },
    collapseTagSize() {
      return ['small', 'mini'].indexOf(this.selectSize) > -1
        ? 'mini'
        : 'small';
    },
    computedDialogTitle() {
      return this.dialogTitle ? this.dialogTitle : this.title
    },
    searchFieldSpan() {
      if (this.maxShowSearchField < 4) return 5
      return 4
    }
  },
  created() {
    console.log(this.listRequestObj);

    this.getData()
  },
  mounted() {
    addResizeListener(this.$el, this.handleResize);

    const reference = this.$refs.reference;
    if (reference && reference.$el) {
      const sizeMap = {
        medium: 36,
        small: 32,
        mini: 28
      };
      const input = reference.$el.querySelector('input');
      this.initialInputHeight = input.getBoundingClientRect().height || sizeMap[this.selectSize];
    }
    if (this.multiple) {
      this.resetInputHeight();
    }
    this.$nextTick(() => {
      if (reference && reference.$el) {
        this.inputWidth = reference.$el.getBoundingClientRect().width;
      }
    });
    this.setDefault()
  },
  beforeDestroy() {
    if (this.$el && this.handleResize) removeResizeListener(this.$el, this.handleResize);
  },
  watch: {
    value(val) {
      this.setDefault()
    },
    selectDisabled() {
      this.$nextTick(() => {
        this.resetInputHeight();
      });
    },
    allList: {
      handler: function (val) {
        this.setDefault()
      },
      deep: true
    }
  },
  methods: {
    async openDialog() {
      if (this.isdisabled) return
      let openFlag = true
      if (this.beforeOpen) openFlag = await this.beforeOpen(this.paramsObj)
      if (!openFlag) return

      this.treeData = []
      this.getData()
      this.setDefault()
      this.visible = true
    },
    async getData() {
      if (++this.loadingTotal <= 1) return
      this.treeLoading = true
      this.listLoading = true
      this.$nextTick(() => {
        if (typeof this.listRequestObj === 'function') { this.listQuery = this.listRequestObj(this.itemScope.$index) }
        else { this.listQuery = JSON.parse(JSON.stringify(this.listRequestObj)) }
        this.initData()
      })
    },
    // 获取列表数据
    initData() {
      if (!this.listQuery.partnerId){
        this.$message.warning('请先选择客户')
      }else{
        this.moreQueriesVisible = false
        this.listLoading = true
        // 增加搜索日期使用
        if (this.isNeedDate && this.searchDateList.length) {
          this.searchDateList.forEach((item) => {
            this.jnpf.searchTimeFormat(this.listQuery, item.prop, item.startTime, item.endTime)
          })
        }
        getcooperativeProduct(this.listQuery).then(async listRes => {
          if (this.listDataFormatting) { this.tableData = this.listDataFormatting({ ...listRes, listQuery: this.listQuery }) }
          else if (Array.isArray(listRes.data)) { this.tableData = listRes.data }
          else { this.tableData = listRes.data.records }
          this.tableData.forEach((row, index) => { row._index = index });
          this.total = listRes.data.total
          await this.$nextTick()
          if (!this.multiple && !this.$refs.defaultTableActionRef && !this.rowDblclick) { // 使用了自定义插槽且没有设置行双击事件的
            const allLines = [...document.querySelectorAll('.even-row'), ...document.querySelectorAll('.odd-row')]
            allLines.forEach(line => {
              line.style.cursor = 'default'
            })
          }
          this.treeLoading = false
          this.listLoading = false
        })
      }
    },
    search() {
      Object.keys(this.listQuery).forEach(key => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listQuery.pageNum = 1
      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.getData()
      // this.listQuery = JSON.parse(JSON.stringify(this.listRequestObj))
      // this.search()
    },
    onClose() { },
    // 双击行
    rowDblclickFun(data) {
      if (this.rowDblclick) {
        this.rowDblclick(data)
      } else if (this.$refs.defaultTableActionRef) {
        this.multiple ? '' : this.currentChange(data)
      }
    },
    // 选择事件
    async currentChange(data) {
      if (!data || data.disabled) return
      if (this.checkSelectable && !(this.checkSelectable(data))) return
      if (this.multiple) {
        let selectedData = []
        for (let i = 0; i < data.length; i++) {
          selectedData.push({
            id: data[i].id,
            name: data[i].name,
            all: data[i]
          })
        }
        if (this.elementShow) {
          this.rSelectData = [...this.initRSelectData, ...selectedData]
          this.selectedIds = this.rSelectData.map(o => o.id)
          this.selectedData = this.rSelectData.map(o => o.name)
        } else {
          this.rSelectData = selectedData
          this.selectedIds = selectedData.map(o => o.id)
          this.selectedData = selectedData.map(o => o.name)
        }
      } else {
        if (!this.throttleFlag) return
        this.throttleFlag = false
        setTimeout(() => { this.throttleFlag = true }, 500);
        let currId = data.id
        let currData = data.name
        this.selectedIds = [currId]
        this.selectedData = [currData]

        let selectedData = []
        for (let i = 0; i < this.selectedIds.length; i++) {
          selectedData.push({
            id: this.selectedIds[i],
            name: this.selectedData[i],
            all: data
          })
        }
        this.rSelectData = selectedData
        this.confirm()
      }
    },
    async handleRowClick(row, column, event) {
      let flag = this.checkSelectable ? await this.checkSelectable(row) : true
      if (this.multiple && flag) this.$refs.dataTable.$refs.JNPFTable.toggleRowSelection(row);
    },
    sortChange({ prop, order }) {
      let newProp;
      if (this.tableItems.some(item => item.prop === prop && item.sortable === 'custom2')) { newProp = prop }
      else { newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase()); }
      this.listQuery.orderItems[0].asc = order !== "descending"
      this.listQuery.orderItems[0].column = order === null ? "" : newProp
      this.search()
    },
    confirm() {
      this.btnLoading = true
      setTimeout(async () => {
        let selectedData = []
        for (let i = 0; i < this.selectedIds.length; i++) {
          let item = []
          let selectedNames = this.selectedData[i]
          for (let j = 0; j < this.selectedIds.length; j++) {
            item.push({
              id: this.selectedIds[i],
              name: selectedNames,
              all: this.rSelectData[i].all
            })
          }
          selectedData.push(item)
        }
        if (selectedData.length === 0) {
          let submitFlag = true
          if (this.beforeSubmit) { submitFlag = await this.beforeSubmit(undefined, this.paramsObj) }
          if (!submitFlag) return this.btnLoading = false
          // this.innerValue = ''
          // this.tagsList = ""
          this.$emit('input', "")
          this.$emit('change', [], [], this.paramsObj)
        } else if (this.multiple) {
          // this.innerValue = ''
          this.tagsList = JSON.parse(JSON.stringify(this.selectedData))

          let submitFlag = true
          if (this.beforeSubmit) { submitFlag = await this.beforeSubmit(this.rSelectData, this.paramsObj) }
          if (!submitFlag) return this.btnLoading = false


          this.selectedIds.length ? this.$emit('input', this.selectedIds) : ''
          this.$emit('change', this.selectedIds, this.rSelectData, this.paramsObj)
        } else {
          let submitFlag = true
          if (this.beforeSubmit) { submitFlag = await this.beforeSubmit(this.rSelectData[0].all, this.paramsObj) }
          if (!submitFlag) return this.btnLoading = false

          this.$emit('input', this.selectedIds[0])
          this.$emit('change', this.selectedIds[0], selectedData[0], this.paramsObj)
        }
        console.log(selectedData[0], 'chuandi');

        this.innerValue = this.selectedData[0]
        this.$nextTick(() => { this.btnLoading = false })
        this.visible = false
        this.$nextTick(() => { this.handleResize() });
      }, 100)
    },
    setDefault() {
      let getFunction = (e, property) => {
        if (property in e) return e[property]
        else if (e.$parent) return getFunction(e.$parent, property)
        else return null
      }
      this.itemScope = getFunction(this, "scope")
      console.log(this.selectedData);

      if (!this.value || !this.value.length) {
        this.innerValue = ''
        this.selectedIds = []
        this.selectedData = []
        this.rSelectData = []
        this.tagsList = []
        this.initRSelectData = []
      } else if (this.multiple) {
        if (!this.rSelectData.length || JSON.parse(JSON.stringify(this.selectedData)) !== JSON.parse(JSON.stringify(this.tagsList))) {
          this.selectedIds = typeof this.ids === 'function' ? this.ids(this.paramsObj) : [...this.ids]
          // this.selectedData = [...this.value]
          this.rSelectData = this.value.map((item, index) => { return { id: this.selectedIds[index], name: this.selectedData[index], all: undefined } })
          this.tagsList = JSON.parse(JSON.stringify(this.selectedData))
          this.initRSelectData = JSON.parse(JSON.stringify(this.rSelectData));
        }
        this.innerValue = ''
      } else {
        if (!this.rSelectData.length || this.selectedData[0] !== this.value) {
          this.selectedIds = []
          // this.selectedData = [this.value]
          this.rSelectData = [{ name: this.value }]
        }
        this.innerValue = this.selectedData[0]
      }
    },
    deleteTag(event, index) {
      this.selectedData.splice(index, 1)
      this.selectedIds.splice(index, 1)
      this.rSelectData.splice(index, 1)
      this.confirm()
      event.stopPropagation();
    },
    handleClearClick(event) {
      this.selectedData = []
      this.selectedIds = []
      this.rSelectData = []

      this.confirm()
      event.stopPropagation();
    },
    resetInputWidth() {
      if (!this.$refs.reference) return;
      this.inputWidth = this.$refs.reference.$el.getBoundingClientRect().width;
    },
    handleResize() {
      this.resetInputWidth();
      if (this.multiple) this.resetInputHeight();
    },
    resetInputHeight() {
      if (this.collapseTags) return;
      this.$nextTick(() => {
        if (!this.$refs.reference) return;
        let inputChildNodes = this.$refs.reference.$el.childNodes;
        let input = [].filter.call(inputChildNodes, item => item.tagName === 'INPUT')[0];
        const tags = this.$refs.tags;
        const tagsHeight = tags ? Math.round(tags.getBoundingClientRect().height) : 0;
        const sizeInMap = this.initialInputHeight || 40;
        input.style.height = this.selectedData.length === 0
          ? sizeInMap + 'px'
          : Math.max(
            tags ? (tagsHeight + (tagsHeight > sizeInMap ? 6 : 0)) : 0,
            sizeInMap
          ) + 'px';
      });
    },
    getRowClassName({ row, rowIndex }) {
      // return ""
      // if (this.multiple) return ""
      return rowIndex % 2 === 0 ? 'even-row' : 'odd-row';
    }
  }
}
</script>

<style lang="scss" scoped>
$footerPadding : '10px';

::v-deep.JNPF-common-search-box .el-input__inner {
  padding: 0 10px;
}

::v-deep.JNPF-common-layout-center .JNPF-common-layout-main {
  padding: 0;
}

::v-deep.selectPro.JNPF-dialog_center .el-dialog .el-dialog__body {
  padding: 0 10px !important;
}

::v-deep .el-dialog__body {
  margin-bottom: 10px;
}

::v-deep .el-dialog__footer {
  padding: 0 20px 10px;
}

::v-deep .even-row,
::v-deep .odd-row {
  cursor: pointer;
}

.killPadding {
  padding: 0;
}

.killPaddingLeft {
  padding-left: 0 !important;
}

.pagination-container {
  background-color: #f5f7fa;
  margin-top: 0px;
  padding: 2px 10px 2px 0;
}

::v-deep .JNPF-common-search-box.noSearchList {
  padding: 3px 0;
}

::v-deep .has-gutter .el-table__cell.gutter {
  border-bottom: 1px solid #EBEEF5;
  background-color: #F5F7FA;
}

.singleLine {
  flex-wrap: nowrap;
  overflow-x: auto;
}
</style>
