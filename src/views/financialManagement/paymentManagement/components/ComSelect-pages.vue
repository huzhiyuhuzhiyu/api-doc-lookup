<!-- --- ComSelect-page 使用说明 ---
================================================================
  -- 组件属性/事件/方法 --
  --------------------------------------------------------------
  * 属性
  - value 绑定的值（dom显示内容）
  - title 弹出窗口标题（即将弃用，建议使用dialogTitle）
  - placeholder dom占位符
  - paramsObj 其他参数(会跟随@change一起返回，传什么就回什么)
  - collapseTags 多选情况下在页面中的显示模式（默认false；true显示一项其他收起 / false全部显示）
  - elementShow 是否在页面上显示此表单元素（默认true；true正常显示 / false不显示）
  - isdisabled 是否禁用页面上的此表单元素（默认false；true禁用 / false不禁用）
  - clearable 是否带有删除按钮（默认false；true带有删除按钮 / false不带有删除按钮）
  * 事件
  - beforeSubmit 提交之前的回调方法
  * 方法
  - input 提交时触发
  - change 提交时触发
================================================================
================================================================
  -- 组件左侧(树)属性/事件 --
  --------------------------------------------------------------
  * 属性
  - renderTree 是否渲染左侧树（默认true；true渲染 / false不渲染）
  - treeTitle 左侧树状列表的标题
  - methodArr 左侧树状列表的请求方法
  * 事件
  - treeNodeClick 树节点被点击的回调方法
  - dataFormatting 树数据格式化方法
================================================================
================================================================
  -- 组件右侧(列表)属性/事件 --
  --------------------------------------------------------------
  * 属性
  - tableItems 表格展示的字段
  - listMethod 表格数据的请求方法
  - listRequestObj 表格数据的请求体
  - searchList 搜素条件列表
  - multiple 是否开启多选（默认false；true多选 / false单选）
  - listDataTreeFlag 列表是否树状结构（默认false；true列表结构树状 / false列表结构平级）
  * 事件
  - checkSelectable 多选情况下判断列表行是否可选的方法
  - listDataFormatting 列表数据格式化方法
================================================================
 -->
<template>
  <div class="popupSelect-container">
    <div class="el-select" @click.stop="openDialog" v-show="elementShow">
      <div class="el-select__tags" v-if="multiple" ref="tags"
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
    <el-dialog :title="computedDialogTitle" :close-on-click-modal="false" :close-on-press-escape="false"
      :visible="visible" lock-scroll class="JNPF-dialog JNPF-dialog_center selectPro" width="70%" append-to-body
      @close="visible = false">
      <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">
        <div class="JNPF-common-layout-left" v-if="renderTree">
          <div class="JNPF-common-title">
            <h2>{{ this.treeTitle }}</h2>
            <span class="options">
              <el-dropdown>
                <el-link icon="icon-ym icon-ym-mpMenu" :underline="false" />
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="getData()">刷新数据</el-dropdown-item>
                  <el-dropdown-item @click.native="toggleExpand(true)">展开全部</el-dropdown-item>
                  <el-dropdown-item @click.native="toggleExpand(false)">折叠全部</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </span>
          </div>
          <el-scrollbar class="JNPF-common-el-tree-scrollbar" v-loading="treeLoading">
            <el-tree ref="treeBox" :data="treeData" :props="defaultProps" :default-expand-all="expands" highlight-current
              :expand-on-click-node="false" node-key="id" @node-click="handleNodeClick" class="JNPF-common-el-tree"
              v-if="refreshTree" :filter-node-method="filterNode">
              <span class="custom-tree-node" slot-scope="{ data }" :title="data.name">
                <i
                  :class="[data.childrenList.length > 0 ? 'icon-ym icon-ym-tree-organization3' : 'icon-ym icon-ym-systemForm']" />
                <span class="text" :title="data.name">{{ data.name }}</span>
              </span>
            </el-tree>
          </el-scrollbar>
        </div>
        <div class="JNPF-common-layout-center JNPF-flex-main">
          <el-row class="JNPF-common-search-box" :gutter="16">
            <el-form @submit.native.prevent>
              <template v-for="(item, index) in searchList">
                <el-col :span="6" :key="item.prop" v-if="index <= 1"
                  :class="(index == 0 && !renderTree) ? 'killPaddingLeft' : ''">
                  <el-form-item>
                    <el-input v-if="item.type === 'input'" v-model="listQuery[item.prop]"
                      :placeholder="'请输入' + item.label" clearable @keyup.enter.native="search()" />

                    <el-select v-else-if="item.type === 'select'" v-model="listQuery[item.prop]"
                      :placeholder="'请输入' + item.label" clearable>
                      <el-option v-for="(item2, index2) in item.options" :key="index2" :label="item2.label"
                        :value="item2.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </template>

              <el-col :span="6" v-if="searchList.length" :class="searchList.length === 0 ? 'killPadding' : ''">
                <el-form-item>
                  <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">
                    {{ $t('common.search') }}
                  </el-button>
                  <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">
                    {{ $t('common.reset') }}
                  </el-button>
                </el-form-item>
              </el-col>
              <el-button v-if="searchList.length > 2" style="float: right;margin-right: 20px;" size="mini" type="primary"
                icon="icon-ym icon-ym-report-icon-search-setting" @click="moreQueriesVisible = true">更多查询</el-button>
            </el-form>
          </el-row>
          <div class="JNPF-common-layout-main JNPF-flex-main">
            <JNPF-table v-loading="treeLoading || listLoading" :data="tableData" hasNO fixedNO :hasC="multiple"
              :highlight-current-row="false" @row-dblclick="currentChange" @selection-change="currentChange"
              :row-class-name="getRowClassName" :checkSelectable="checkSelectable" ref="dataTable"
              @row-click="handleRowClick" :tree-props="{ children: 'childrenList', hasChildren: '' }" row-key="index"
              :default-expand-all="expandsTable" customKey="JNPFTableKey_284315">

              <!-- 普通结构 -->
              <template v-if="!listDataTreeFlag">
                <el-table-column prop="orderNo" label="订单号" show-overflow-tooltip></el-table-column>
                <el-table-column prop="orderType" label="订单类型">
                  <template slot-scope="scope">
                    <div v-for="(item, index) in orderList" :key="index">
                      <span v-if="item.value == scope.row.orderType">{{ item.label }}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="productionQuantity" label="生产数量" />
                <el-table-column prop="mainUnit" label="单位" />
              </template>

              <!-- 双级树状结构 -->
              <!-- <template v-else>
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
              </template> -->

              <el-table-column label="操作" width="90" fixed="right" v-if="!multiple">
                <template slot-scope="scope">
                  <el-button type="text" @click="currentChange(scope.row)" size="mini">选择</el-button>
                </template>
              </el-table-column>
            </JNPF-table>
            <pagination v-if="!listDataTreeFlag" :total="total" :page.sync="listQuery.pageNum"
              :limit.sync="listQuery.pageSize" @pagination="initData" class="pagination-container" />
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

          <el-col :span="12" v-for="item in searchList" :key="item.prop">
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

export default {
  name: 'ComSelect-pages',
  props: {
    value: {},
    title: {
      type: String,
      default: '未设置标题'
    },
    dialogTitle: {
      type: String,
      default: ''
    },
    methodArr: {
      /*
        数组写法：[
          { label: "原材料分类", classAttribute: "raw_material", method: getcategoryTree, requestObj: { classAttribute: "raw_material" } },
          { label: "半成品分类", classAttribute: "semi_finished", method: getcategoryTree, requestObj: { classAttribute: "semi_finished" } },
          { label: "成品分类", classAttribute: "finish_product", method: getcategoryTree, requestObj: { classAttribute: "finish_product" } },
          { label: "辅料分类", classAttribute: "accessories", method: getcategoryTree, requestObj: { classAttribute: "accessories" } },
          { label: "其他分类", classAttribute: "other", method: getcategoryTree, requestObj: { classAttribute: "other" } }
        ]
        对象写法：{ method: getWarehouseList, requestObj: { chooseUserFlag: true } }
      */
    },
    /* 列表数据请求方法 */
    listMethod: {
      required: true
    },
    /* 列表数据请求体 */
    listRequestObj: {
      type: Object | Function,
      required: true
      /* 
        对象写法：{ code: "", name: "", orderItems: [{ asc: false, column: "" }, { asc: false, column: "create_time" }], pageNum: 1, pageSize: 20 }
        函数写法：(rowIndex) => {
          let id = this.linesList[rowIndex].id
          return { id, orderItems: [{ asc: false, column: "" }, { asc: false, column: "create_time" }], pageNum: 1, pageSize: 20 }
        }
      */
    },
    paramsObj: {
      type: Object,
      default: () => { }
    },
    treeTitle: {
      type: String,
      default: "未设置treeTitle"
    },
    searchList: {
      type: Array,
      default: () => []
      /* [
          {prop:'code',label:'编码'},
          {prop:'name',label:'名称'}
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
      default: () => []
      /* [
          {prop:'code',label:'编码'},
          {prop:'name',label:'名称'}
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
    treeNodeClick: {
      type: Function,
      default: (data, node, listQuery) => {
        if (listQuery.productCategoryId === data.id) return listQuery
        listQuery.productCategoryId = data.hasOwnProperty('parentId') ? data.id : ""
        listQuery.classAttribute = data.classAttribute
        return listQuery
      }
    },
    beforeSubmit: {
      /* async (data, paramsObj) => {
          if (!this.dataForm.transferOutWarehouseName) return true // 如果判断条件真，直接提交，不弹出提示
          let flag = await this.$confirm('提示内容', '提示标题', { type: 'warning' }).catch(err => false)
          return flag
        } */
    },
  },
  data() {
    return {
      orderList:[
        {value:'normal',label:'正常订单'},
        {value:'rework',label:'返工订单'}
      ],
      allList: [],
      innerValue: '',
      selectedData: [],
      selectedIds: [],
      tagsList: [],
      initialInputHeight: 0,
      rSelectData: [],
      itemScope: {},
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
      expandsTable: false
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
    }
  },
  created() {
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
    async getData() {
      if (++this.loadingTotal <= 1) return
      this.treeLoading = true
      this.listLoading = true
      this.$nextTick(() => {
        if (typeof this.listRequestObj === 'function') { this.listQuery = this.listRequestObj(this.itemScope.$index) }
        else { this.listQuery = JSON.parse(JSON.stringify(this.listRequestObj)) }
        // 判断是否要渲染树
        if (this.renderTree) {
          // 判断树请求是否为数组
          if (Array.isArray(this.methodArr)) {
            if (!this.methodArr.length) { console.warn(`<ComSelect-page/> ${this.computedDialogTitle} 请求方法无效：methodArr长度为0，如果不需要渲染左侧树状列表请将 renderTree 设为 false`); }
            else {
              let tempTreeData = [...this.methodArr]
              let successTotal = 0
              this.methodArr.forEach((item, index) => {
                item.method(item.requestObj).then(res => {
                  if (this.dataFormatting) {
                    tempTreeData[index] = {
                      id: item.label,
                      name: item.label,
                      classAttribute: item.classAttribute,
                      childrenList: this.dataFormatting(res)
                    }
                  } else if (Array.isArray(res.data)) {
                    tempTreeData[index] = {
                      id: item.label,
                      name: item.label,
                      classAttribute: item.classAttribute,
                      childrenList: res.data
                    }
                  } else {
                    tempTreeData[index] = {
                      id: item.label,
                      name: item.label,
                      classAttribute: item.classAttribute,
                      childrenList: res.data.records
                    }
                  }
                  if ((++successTotal) === this.methodArr.length) {
                    this.treeData = tempTreeData
                    this.initData()
                  }
                })
              })
            }
          } else {
            if (!this.methodArr || JSON.stringify(this.methodArr) === "{}") { console.warn(`<ComSelect-page/> ${this.computedDialogTitle} 请求方法无效：methodArr是一个无效的对象，正确写法：{}，如果不需要渲染左侧树状列表请将 renderTree 设为 false`); }
            else {
              this.methodArr.method(this.methodArr.requestObj).then(res => {
                if (this.dataFormatting) { this.treeData = this.dataFormatting(res) }
                else if (Array.isArray(res.data)) { this.treeData = res.data }
                else { this.treeData = res.data.records }
                this.initData()
              })
            }
          }
        } else { this.initData() }
      })
    },
    // 获取列表数据
    initData() {
      this.moreQueriesVisible = false
      this.listLoading = true
      this.listMethod(this.listQuery).then(listRes => {
        if (this.listDataFormatting) { this.tableData = this.listDataFormatting(listRes) }
        else if (Array.isArray(listRes.data)) { this.tableData = listRes.data }
        else { this.tableData = listRes.data.records }
        this.total = listRes.data.total || 0
        this.treeLoading = false
        this.listLoading = false
      })
    },
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
    handleNodeClick(data, node) {
      this.listQuery = this.treeNodeClick(data, node, this.listQuery)
      this.search()
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
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
      this.getData()
      // this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      // this.listQuery = JSON.parse(JSON.stringify(this.listRequestObj))
      // this.search()
    },
    onClose() { },
    getNodePath(node) {
      let fullPath = []
      const loop = (node) => {
        if (node.level) fullPath.unshift(node.data)
        if (node.parent) loop(node.parent)
      }
      loop(node)
      return fullPath
    },
    // 选择事件
    async currentChange(data) {
      if (!data || data.disabled) return
      if (this.multiple) {
        let selectedData = []
        for (let i = 0; i < data.length; i++) {
          selectedData.push({
            id: data[i].id,
            name: data[i].name,
            all: data[i]
          })
        }
        this.rSelectData = selectedData
        this.selectedIds = selectedData.map(o => o.id)
        this.selectedData = selectedData.map(o => o.name)
      } else {
        let submitFlag = true
        if (this.beforeSubmit) { submitFlag = await this.beforeSubmit(data, this.paramsObj) }
        if (!submitFlag) return

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
    handleRowClick(row, column, event) {
      if (this.multiple) this.$refs.dataTable.$refs.JNPFTable.toggleRowSelection(row);
    },
    openDialog() {
      if (this.isdisabled) return
      this.treeData = []
      this.getData()
      this.setDefault()
      this.visible = true
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
          // this.innerValue = ''
          // this.tagsList = ""
          this.$emit('input', "")
          this.$emit('change', [], [], this.paramsObj)
        } else if (this.multiple) {
          // this.innerValue = ''
          this.tagsList = JSON.parse(JSON.stringify(this.selectedData))

          let submitFlag = true
          if (this.beforeSubmit) { submitFlag = await this.beforeSubmit(this.rSelectData, this.paramsObj) }
          if (!submitFlag) {
            this.btnLoading = false
            return
          }

          this.$emit('input', this.selectedIds)
          this.$emit('change', this.selectedIds, this.rSelectData, this.paramsObj)
        } else {
          // this.innerValue = this.selectedData[0]
          this.$emit('input', this.selectedIds[0])
          this.$emit('change', this.selectedIds[0], selectedData[0], this.paramsObj)
        }
        this.$nextTick(() => { this.btnLoading = false })
        // this.visible = false
      }, 10)
    },
    isvisible(){
      this.visible = false
    },
    setDefault() {
      let getFunction = (e, property) => {
        if (property in e) return e[property]
        else if (e.$parent) return getFunction(e.$parent, property)
        else return null
      }
      this.itemScope = getFunction(this, "scope")
      if (!this.value || !this.value.length) {
        this.innerValue = ''
        this.selectedIds = []
        this.selectedData = []
        this.rSelectData = []

        this.tagsList = []
        return
      }
      this.innerValue = this.value
      this.selectedIds = []
      this.selectedData = []
      this.rSelectData = []
      return
      let selectedIds = this.multiple ? this.value : [this.value]
      this.selectedIds = JSON.parse(JSON.stringify(selectedIds))
      let textList = []
      for (let i = 0; i < selectedIds.length; i++) {
        const item = selectedIds[i];
        let textItem = JSON.parse(JSON.stringify(item))
        for (let j = 0; j < item.length; j++) {
          inner: for (let ii = 0; ii < this.allList.length; ii++) {
            if (item[j] === this.allList[ii].id) {
              textItem[j] = this.allList[ii].fullName
              break inner
            }
          }
        }
        textList.push(textItem)
      }
      this.selectedData = textList.map(o => o)
      if (this.multiple) {
        this.innerValue = ''
        this.tagsList = JSON.parse(JSON.stringify(this.selectedData))
        this.$nextTick(() => {
          this.resetInputHeight();
        })
      } else {
        this.innerValue = this.selectedData.join(',')
      }
    },
    deleteTag(event, index) {
      this.selectedData.splice(index, 1)
      this.selectedIds.splice(index, 1)
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
    resetInputWidth() {
      this.inputWidth = this.$refs.reference.$el.getBoundingClientRect().width;
    },
    handleResize() {
      this.resetInputWidth();
      if (this.multiple) this.resetInputHeight();
    },
    getRowClassName({ row, rowIndex }) {
      // return ""
      // if (this.multiple) return ""
      return rowIndex % 2 === 0 ? 'even-row' : 'odd-row';
    },
  }
}
</script>

<style lang="scss" scoped>
$footerPadding : '10px';

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
</style>