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
          <el-tag v-for="(item, i) in tagsList" :key="item + '_' + i" :size="collapseTagSize"
                  :closable="!selectDisabled" type="info" @close="deleteTag($event, i)" disable-transitions>
            <span class="el-select__tags-text">{{ item }}</span>
          </el-tag>
        </transition-group>
      </div>
      <el-input ref="reference" v-model="innerValue" type="text" :placeholder="currentPlaceholder"
                :disabled="isdisabled" readonly :validate-event="false" :tabindex="(multiple) ? '-1' : null"
                @mouseenter.native="inputHovering = true" @mouseleave.native="inputHovering = false">
        <template slot="suffix">
          <i v-show="!showClose" :class="['el-select__caret', 'el-input__icon', 'el-icon-arrow-up']"></i>
          <i v-if="showClose" class="el-select__caret el-input__icon el-icon-circle-close"
             @click="handleClearClick"></i>
        </template>
      </el-input>
    </div>
    <el-dialog :title="computedDialogTitle" :close-on-click-modal="false" :visible="visible" lock-scroll
               class="JNPF-dialog JNPF-dialog_center selectPro" :width="dialogWidth" append-to-body @close="visible = false">
      <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">
        <div class="JNPF-common-layout-left treeBox" v-if="renderTree">
          <div class="JNPF-common-title">
            <h2>{{ this.treeName }}</h2>
            <span class="options">
              <el-dropdown>
                <el-link icon="icon-ym icon-ym-mpMenu" :underline="false"/>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="getData()">刷新数据</el-dropdown-item>
                  <el-dropdown-item @click.native="toggleExpand(true)">展开全部</el-dropdown-item>
                  <el-dropdown-item @click.native="toggleExpand(false)">折叠全部</el-dropdown-item>
                  <el-dropdown-item @click.native="setexpand(true)">设置默认展开</el-dropdown-item>
                  <el-dropdown-item @click.native="setexpand(false)">设置默认收起</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </span>
          </div>
          <el-scrollbar class="JNPF-common-el-tree-scrollbar" v-loading="treeLoading">
            <el-tree ref="treeBox" :data="treeData" :props="defaultProps" :default-expand-all="expands"
                     highlight-current :expand-on-click-node="false" node-key="id" @node-click="handleNodeClick"
                     class="JNPF-common-el-tree" v-if="refreshTree" :filter-node-method="filterNode">
              <span class="custom-tree-node" slot-scope="{ data }" :title="data.name">
                <i
                  :class="[data.childrenList && data.childrenList.length > 0 ? 'icon-ym icon-ym-tree-organization3' : 'icon-ym icon-ym-systemForm']"/>
                <span class="text" :title="data.name">{{ data.name }}</span>
              </span>
            </el-tree>
          </el-scrollbar>
        </div>
        <div class="JNPF-common-layout-center JNPF-flex-main">
          <el-row :class="['JNPF-common-search-box', searchList === undefined ? 'noSearchList' : '']" :gutter="16">
           <div class="flex-row search-left">
             <el-form @submit.native.prevent>
              <template v-for="(item, index) in searchList">
                <el-col :span="searchFieldSpan" :key="item.prop" v-if="index < maxShowSearchField"
                        :class="(index == 0 && !renderTree) ? 'killPaddingLeft' : ''">
                  <el-form-item>
                    <el-input v-if="item.type === 'input'" v-model="listQuery[item.prop]"
                              :placeholder="'请输入' + item.label" clearable @keyup.enter.native="search()"/>

                    <el-select v-else-if="item.type === 'select'" v-model="listQuery[item.prop]"
                               :placeholder="'请输入' + item.label" clearable @change="selectChange">
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
                         icon="icon-ym icon-ym-report-icon-search-setting" @click="moreQueriesVisible = true">更多查询
              </el-button>
            </el-form>
            <div v-if="customKey" class="search-right">
            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="$refs.dataTable.showDrawer()"/>
            </el-tooltip>
            </div>
           </div>
          </el-row>
          <slot name="top"></slot>
          <div class="JNPF-common-layout-main JNPF-flex-main">
            <JNPF-table v-loading="treeLoading || listLoading" :data="tableData" hasNO fixedNO :hasC="multiple && activeType !== 'look' && !confirms"
                        :highlight-current-row="false" @row-dblclick="rowDblclickFun" @selection-change="currentChange"
                        :row-class-name="getRowClassName" :checkSelectable="checkSelectable" ref="dataTable"
                        @row-click="handleRowClick" :tree-props="{ children: 'childrenList', hasChildren: '' }" :row-key="'id'"
                        :default-expand-all="expands" @sort-change="sortChange" custom-column :custom-key="customKey ?  customKey : ''">
              <template v-if="!listDataTreeFlag">
                <template v-for="item in tableItems">
                  <el-table-column
                    v-if="item.hasOwnProperty('render') ? item.render : true"
                    :key="item.prop"
                    :prop="item.prop"
                    :label="item.label"
                    :align="item.align"
                    :fixed="item.fixed || false"
                    :sortable="item.sortable"
                    v-bind="{ width: item.width ? item.width : 0, minWidth: item.hasOwnProperty('minWidth') ? item.minWidth : 120 }">
                    <template slot-scope="scope">
                        <span v-if="item.dictType">
                                        <el-tag :type="global.getDictLabelGlobal(item.dictType, scope.row[item.prop], { withType: true }).type">{{
                                            global.getDictLabelGlobal(item.dictType, scope.row[item.prop])
                                          }}
                                        </el-tag>
                              </span>
                      <slot v-else :name="item.prop" :row="scope.row">
                        {{ scope.row[item.prop] }}
                      </slot>
                    </template>
                  </el-table-column>
                </template>
              </template>

              <!-- 双级树状结构 -->
              <template v-else>
                <template v-for="item in tableItems">
                  <el-table-column
                    v-if="item.prop !== 'name'"
                    :key="item.prop"
                    :prop="item.prop"
                    :label="item.label"
                    :fixed="item.fixed || false"
                    :min-width="item.minWidth || 120">
                    <template slot-scope="scope">
                      <slot :name="item.prop" :row="scope.row">
                        {{ scope.row[item.prop] }}
                      </slot>
                    </template>
                  </el-table-column>

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
                <el-table-column label="操作" width="90" fixed="right" v-if="!multiple && activeType !== 'look'" ref="defaultTableActionRef">
                  <template slot-scope="scope">
                    <el-button type="text" @click="currentChange(scope.row)" size="mini"
                               :disabled="!checkSelectable(scope.row)">选择
                    </el-button>
                  </template>
                </el-table-column>
              </slot>
            </JNPF-table>
            <pagination v-if="!listDataTreeFlag && total !== undefined" :total="total" :page.sync="listQuery.pageNum"
                        :limit.sync="listQuery.pageSize" @pagination="initData" class="pagination-container"/>
            <div v-else style="width: 100%; height: 5px; background: #EBEEF5"></div>
          </div>
        </div>
      </div>
      <template slot="footer" v-if="(multiple && activeType !== 'look') || confirms">
        <span class="dialog-footer">
          <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
          <el-button type="primary" @click="confirm" :loading="btnLoading">{{ $t('common.confirmButton') }}</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog :title="'更多查询'" :close-on-click-modal="false" :close-on-press-escape="false"
               :visible.sync="moreQueriesVisible" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="1000px"
               append-to-body>
      <el-row :gutter="20">
        <el-form ref="diaForm" :model="listQuery" label-width="120px" label-position="top">

          <el-col :span="12" v-for="item in moreSearchList || searchList" :key="item.prop">
            <el-form-item :label="item.label">
              <el-input v-if="item.type === 'input'" v-model="listQuery[item.prop]" :placeholder="'请输入' + item.label"
                        clearable/>

              <el-select v-else-if="item.type === 'select'" v-model="listQuery[item.prop]"
                         :placeholder="'请选择' + item.label" style="width: 100%;" clearable>
                <el-option v-for="item2 in item.options" :key="item2.value" :label="item2.label"
                           :value="item2.value"></el-option>
              </el-select>

              <el-select v-else-if="item.type === 'multiple'" v-model="listQuery[item.prop]"
                         :placeholder="'请选择' + item.label" clearable style="width: 100%;" multiple>
                <el-option v-for="item2 in item.options" :key="item2.value" :label="item2.label"
                           :value="item2.value"></el-option>
              </el-select>
              <el-date-picker v-else-if="item.type === 'date'" v-model="listQuery[item.prop]" style="width: 100%;"
                              :start-placeholder="'请选择' + item.label + '开始日期'" :end-placeholder="'请选择' + item.label + '结束日期'"
                              clearable type="daterange" value-format="yyyy-MM-dd">
              </el-date-picker>
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
  name: 'ComSelect-page',
  props: {
    value: {
      type: String,
    },
    activeType: {
      type: String,
      default: '',
      validator: (value) => ['', 'look'].includes(value)
    },
    ids: {
      type: Array | Function
    },
    title: {
      type: String,
      default: '选择'
    },
    dialogTitle: {
      type: String,
      default: ''
    },
    tagMultipleLine: {
      type: Boolean,
      default: false
    },
    methodArr: {},
    listMethod: {
      required: true
    },
    listRequestObj: {
      type: Object | Function,
      required: true
    },
    paramsObj: {
      type: Object | Array,
      default: () => {}
    },
    treeTitle: {
      type: String,
      default: "未设置treeTitle"
    },
    searchList: {
      type: Array,
      default: () => []
    },
    moreSearchList: {
      type: Array
    },
    dataFormatting: {
      type: Function
    },
    listDataFormatting: {
      type: Function
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    tableItems: {
      type: Array,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    confirms: {
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
        listQuery.productCategoryCode = data.hasOwnProperty('code') ? data.code : ""
        listQuery.classAttribute = data.classAttribute
        return listQuery
      }
    },
    rowDblclick: {
      type: Function
    },
    beforeOpen: {},
    beforeSubmit: {},
    isNeedDate: {
      type: Boolean,
      default: false
    },
    searchDateList: {
      type: Array,
      default: () => []
    },
    maxShowSearchField: {
      type: Number,
      default: 3
    },
    dialogWidth: {
      type: String,
      default: '70%'
    },
    index: {
      type: String,
      default: ""
    },
    expands: {
      type: Boolean,
      default: true
    },
    customKey: {
      type: String,
      default: ""
    }
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
          column: "create_time"
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
      initRSelectData: [],
      throttleFlag: true,
      // ===== 新增缓存字段 =====
      selectedDataCache: [] // 缓存所有已选项（含 id/name/all）
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
    this.getData()
    if (localStorage.getItem(`${ this.treeName }Flag`)) {
      let locationInventoryFlag = JSON.parse(localStorage.getItem(`${ this.treeName }Flag`))
      this.expands = locationInventoryFlag
      this.toggleExpand(locationInventoryFlag)
    }
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
      handler: function(val) {
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
        if (typeof this.listRequestObj === 'function') {
          this.listQuery = structuredClone(this.listRequestObj(this.itemScope.$index))
        } else {
          this.listQuery = JSON.parse(JSON.stringify(this.listRequestObj))
        }

        if (this.renderTree) {
          if (Array.isArray(this.methodArr)) {
            if (!this.methodArr.length) {
              console.warn(`<ComSelect-page/> ${ this.computedDialogTitle } 请求方法无效：methodArr长度为0，如果不需要渲染左侧树状列表请将 renderTree 设为 false`);
            } else {
              if (this.methodArr.length === 1 && this.methodArr[0].classAttribute === 'material') {
                this.treeName = this.methodArr[0].label
              }
              let tempTreeData = [...this.methodArr]
              let successTotal = 0
              this.methodArr.forEach((item, index) => {
                item.method(item.requestObj).then(res => {
                  if (this.dataFormatting) {
                    tempTreeData[index] = {
                      id: item.label,
                      name: item.label,
                      classAttribute: item.classAttribute,
                      childrenList: this.dataFormatting({ ...res, listQuery: item.requestObj })
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
                    if (this.methodArr.length === 1 && this.methodArr[0].classAttribute === 'material') {
                      this.treeData = tempTreeData[0].childrenList
                    } else {
                      this.treeData = tempTreeData
                    }
                    this.initData()
                  }
                })
              })
            }
          } else {
            if (!this.methodArr || JSON.stringify(this.methodArr) === "{}") {
              console.warn(`<ComSelect-page/> ${ this.computedDialogTitle } 请求方法无效：methodArr是一个无效的对象，正确写法：{}，如果不需要渲染左侧树状列表请将 renderTree 设为 false`);
            } else {
              this.methodArr.method(this.methodArr.requestObj).then(res => {
                if (this.dataFormatting) {
                  this.treeData = this.dataFormatting({ ...res, listQuery: this.methodArr.requestObj })
                } else if (Array.isArray(res.data)) {
                  this.treeData = res.data
                } else {
                  this.treeData = res.data.records
                }
                this.initData()
              })
            }
          }
        } else {
          this.initData()
        }
      })
    },
    initData() {
      this.moreQueriesVisible = false
      this.listLoading = true

      if (this.listQuery !== null && typeof this.listQuery === 'object') {
        if (this.searchDateList.length) {
          this.searchDateList.forEach((item) => {
            this.jnpf.searchTimeFormat(this.listQuery, item.prop, item.startTime, item.endTime)
          })
        }
        Object.keys(this.listQuery).forEach(key => {
          let item = this.listQuery[key]
          this.listQuery[key] = typeof item === 'string' ? item.trim() : item
        })
      }

      this.listMethod(this.listQuery).then(async listRes => {
        let records = [];
        if (this.listDataFormatting) {
          records = this.listDataFormatting({ ...listRes, listQuery: this.listQuery })
        } else if (Array.isArray(listRes.data)) {
          records = listRes.data;
        } else {
          records = listRes.data.records || listRes.data.whPage?.records || listRes.data.page?.records || [];
        }

        this.tableData = records.map((row, index) => ({
          ...row,
          _index: index
        }));

        this.total = listRes.data.total || listRes.data.whPage?.total || listRes.data.page?.total || undefined;

        // ========== 恢复缓存选中状态 ==========
        this.$nextTick(() => {
          if (this.multiple && this.selectedDataCache.length > 0) {
            const dataTable = this.$refs.dataTable?.$refs.JNPFTable;
            if (dataTable) {
              // 先清空当前选中（避免旧状态干扰）
              dataTable.clearSelection();
              // 再根据缓存重新选中
              this.tableData.forEach(row => {
                const isInCache = this.selectedDataCache.some(cached => cached.id === row.id);
                if (isInCache) {
                  dataTable.toggleRowSelection(row, true);
                }
              });
            }
          }

          if (!this.multiple && !this.$refs.defaultTableActionRef && !this.rowDblclick) {
            const allLines = [...document.querySelectorAll('.even-row'), ...document.querySelectorAll('.odd-row')]
            allLines.forEach(line => {
              line.style.cursor = 'default'
            })
          }
        });

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
    setexpand(expands) {
      this.refreshTree = false
      this.expands = expands
      this.$nextTick(() => {
        this.refreshTree = true
        localStorage.setItem(`${ this.treeName }Flag`, expands)
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
    selectChange() {
      this.listQuery.pageNum = 1
      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort()
      this.getData()
    },
    rowDblclickFun(data) {
      if (this.activeType === 'look') return
      if (!this.checkSelectable(data)) return
      if (this.rowDblclick) {
        this.rowDblclick(data)
      } else if (this.$refs.defaultTableActionRef) {
        this.multiple ? '' : this.currentChange(data)
      }
    },
    currentChange(selection) {
      if (this.activeType === 'look') return
      if (!this.multiple) {
        // 单选：selection 是单个 row 对象
        const data = selection;
        if (!data || data.disabled) return;
        if (this.checkSelectable && !this.checkSelectable(data)) return;

        if (!this.throttleFlag) return;
        this.throttleFlag = false;
        setTimeout(() => {
          this.throttleFlag = true;
        }, 500);

        this.selectedIds = [data.id];
        this.selectedData = [data.name];
        this.rSelectData = [{ id: data.id, name: data.name, all: data }];
        this.confirm(); // 单选直接确认
        return;
      }

      // 多选：selection 是数组
      const newSelected = selection.map(row => ({
        id: row.id,
        name: row.name,
        all: row
      }));

      // 合并去重（基于 id）
      const merged = [...new Map([...this.selectedDataCache, ...newSelected].map(item => [item.id, item])).values()];
      this.selectedDataCache = merged;

      this.rSelectData = [...this.initRSelectData, ...this.selectedDataCache];
      this.selectedIds = this.rSelectData.map(o => o.id);
      this.selectedData = this.rSelectData.map(o => o.name);
    },
    async handleRowClick(row, column, event) {
      let flag = this.checkSelectable ? await this.checkSelectable(row) : true
      if (this.multiple && flag) {
        const dataTable = this.$refs.dataTable?.$refs.JNPFTable;
        if (dataTable) {
          dataTable.toggleRowSelection(row);
        }
      }
    },
    sortChange({ prop, order }) {
      let newProp;
      if (this.tableItems.some(item => item.prop === prop && item.sortable === 'custom2')) {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      this.listQuery.orderItems[0].asc = order !== "descending"
      this.listQuery.orderItems[0].column = order === null ? "" : newProp
      this.search()
    },
    async confirm() {
      this.btnLoading = true;
      try {
        let submitFlag = true;
        if (this.beforeSubmit) {
          submitFlag = await this.beforeSubmit(
            this.multiple ? this.rSelectData : (this.rSelectData[0]?.all || null),
            this.paramsObj
          );
        }
        if (!submitFlag) return;

        if (this.multiple) {
          this.tagsList = [...this.selectedData];
          this.$emit('input', this.selectedIds);
          this.$emit('change', this.selectedIds, this.rSelectData, this.paramsObj);
        } else {
          if (this.rSelectData.length > 0) {
            this.$emit('input', this.selectedIds[0]);
            this.$emit('change', this.selectedIds[0], [this.rSelectData[0]], this.paramsObj, this.index);
          } else {
            this.$emit('input', "");
            this.$emit('change', [], [], this.paramsObj, this.index);
          }
        }

        if (this.confirms) this.$emit('confirm', this.tableData);
        this.visible = false;
      } finally {
        this.btnLoading = false;
      }
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
        this.initRSelectData = []
        this.selectedDataCache = [] // 清空缓存
      } else if (this.multiple) {
        // 从 value 和 ids 初始化缓存
        const ids = typeof this.ids === 'function' ? this.ids(this.paramsObj) : this.ids || [];
        this.selectedIds = Array.isArray(ids) ? ids : [];
        this.selectedData = Array.isArray(this.value) ? this.value : [this.value];
        this.selectedDataCache = this.selectedData.map((name, idx) => ({
          id: this.selectedIds[idx] || '',
          name,
          all: undefined // 无法还原完整对象，后续靠匹配 id 补全
        }));
        this.rSelectData = [...this.selectedDataCache];
        this.tagsList = [...this.selectedData];
        this.initRSelectData = [...this.selectedDataCache];
        this.innerValue = '';
      } else {
        this.selectedIds = [];
        this.selectedData = [this.value];
        this.rSelectData = [{ name: this.value }];
        this.innerValue = this.value;
        this.selectedDataCache = []; // 单选不缓存
      }
    },
    deleteTag(event, index) {
      const removedId = this.selectedIds[index];
      this.selectedIds.splice(index, 1);
      this.selectedData.splice(index, 1);
      this.rSelectData.splice(index, 1);
      // 从缓存中移除
      this.selectedDataCache = this.selectedDataCache.filter(item => item.id !== removedId);
      this.confirm();
      event.stopPropagation();
    },
    handleClearClick(event) {
      this.selectedData = [];
      this.selectedIds = [];
      this.rSelectData = [];
      this.selectedDataCache = []; // 清空缓存
      this.confirm();
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
      return rowIndex % 2 === 0 ? 'even-row' : 'odd-row';
    }
  }
}
</script>

<style lang="scss" scoped>
$footerPadding: '10px';

::v-deep.JNPF-common-search-box .el-input__inner {
  padding: 0 10px;
}

::v-deep.JNPF-common-layout-center .JNPF-common-layout-main {
  padding: 0;
  border-left: 1px solid #EBEEF5;
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
.search-right{
  padding-top: 8px; // 原始外层容器有8-px的偏移，这里新的box多8px做兼容
}
</style>
