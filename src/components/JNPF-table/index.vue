<template>
  <div class="tableContainer">
    <el-table highlight-current-row :data="data" ref="JNPFTable" class="JNPF-common-table" :height="height" v-keyboard-focus
      :element-loading-text="$t('common.loadingText')" v-bind="{ ...attributes, ...$attrs }" v-on="$listeners" :border="border"
      :header-cell-style="headerCellStyle" @header-dragend="handleHeaderDragEnd" :row-class-name="rowClassName"
      @header-click="handleHeaderClick" :key="tableKey"
    >
      <el-table-column type="selection" width="45" key="selection" :fixed="fixedSelect"
        v-if="_hasC" align="center" :selectable="checkSelectable"
      />
      <el-table-column align="center" label="拖动" class-name="handler-column" width="60" v-if="_hasMove">
        <template>
          <i class="drag-handler icon-ym icon-ym-darg" style="cursor: move;font-size:20px" disabled
            title="点击拖动"
          />
        </template>
      </el-table-column>
      <el-table-column type="index" key="index" width="60" label="序号" v-if="hasNO" :fixed="fixedNO"
        align="center"
      />
      <jnpf-table-column :columns="columns" :columnList="columnList" v-if="customColumn"/>
      <template v-else>
        <slot/>
      </template>
      <!--      <el-table-column align="center" fixed="right" width="1" v-if="customColumn">-->
      <!--        <template slot="header">-->
      <!--          <el-tooltip content="表头设置" placement="top">-->
      <!--            <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="showDrawer" />-->
      <!--          </el-tooltip>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <template slot="empty">
        <el-empty description="暂无数据" :image-size="120"></el-empty>
      </template>
    </el-table>
    <ColumnSettings v-if="drawerVisible" ref="columnSettings" :defaultColumns="defaultColumns"
      :columnList="columnList" :setColumnDisplayList="setColumnDisplayList" @setColumn="setColumn"
    />
    <PopoverCard v-if="popoverVisible" :popoverColumn="popoverColumn" :style="popoverStyle"
      @queryChange="queryChange" :listQuery="listQuery" :columnProps="currentColumnProps"
      :queryJson="queryJson" @close="closePopover" ref="popoverCard"
    />
    <SortSettings v-if="sortDrawerVisible" ref="sortSettings" @queryChange="queryChange"
      :columns="columns" :listQuery="listQuery"
    />
  </div>
</template>

<script>
import JnpfTableColumn from './Column'
import ColumnSettings from './ColumnSettings'
import SortSettings from './SortSettings'
import Sortable from 'sortablejs'
import { deepClone, getPromise } from '@/utils'
import { saveWebCache } from '@/api/system/system'
import PopoverCard from './PopoverCard'
import { getSortProp } from '@/components/JNPF-table/data'

export default {
  name: 'JNPF-table',
  components: { JnpfTableColumn, ColumnSettings, PopoverCard, SortSettings },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    setColumnDisplayList: {
      type: Array,
      default: () => []
    },
    // 序号 默认有
    hasNO: {
      type: Boolean,
      default: true
    },
    // 是否有拖动 默认无
    hasMove: {
      type: Boolean | Array,
      default: false
    },
    // 序号 是否固定
    fixedNO: {
      type: Boolean,
      default: false
    },
    fixedSelect: {
      type: Boolean,
      default: false
    },
    // 多选框 默认无，传入数组时，会把数组每一项解析为v-has的值，包含任意一项就会显示复选框
    hasC: {
      type: Boolean | Array,
      default: false
    },
    border: {
      type: Boolean,
      default: true
    },
    customColumn: {
      type: Boolean,
      default: false
    },
    // 超出内容自动显示省略号 默认是
    showOverflowTooltip: {
      type: Boolean,
      default: true
    },
    height: {
      default: '100%'
    },
    checkSelectable: {
      type: Function,
      default: () => (row) => {
        if (row.top) return false
        return true
      }
    },
    partentOrChild: {
      type: String,
      default: 'partent'
    },
    customKey: {
      type: String,
      default: ''
    },
    // 传入后，自动根据key值，渲染合计行（需要搭配show-summary使用）
    totalData: {
      type: Object
    },
    // 表格数据查询参数，用于同步排序与查询状态
    listQuery: {
      type: Object
    },
    // 列高级查询补充
    queryJson: {
      type: Array,
      default: () => []
    },
    // 设置默认可拖动列 传入控制是否可拖动 且不能拖动到无法拖动的位置
    rowClassName:{
      type: [Function, String],
      default: (row) => {
        // 默认
        return row.hasOwnProperty('unDraggable') ? row.unDraggable : 'draggable-header'
      }
    },
    // 是否拖动列拖动  默认为false 一行都能拖动
    isHandlerColumn: {
      type: Boolean,
      default: false
    },
    // 是否给未指定sortProp的列排序时将驼峰转换为下划线
    tranToUnderline: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      columnList: [],
      hasSlotContent: false,
      columns: [],
      defaultColumns: [],
      drawerVisible: false,
      sortDrawerVisible: false,
      tableKey: 0,
      headerCellStyle: {
        backgroundColor: '#f5f7fa',
        fontWeight: 'bold'
      },
      tableRealRef: null,
      tableRealRefPromise: null,
      tableRealRefResolve: null,
      timeout: null,
      doLayoutDebounced: null,

      popoverColumn: '',
      popoverVisible: false,
      popoverStyle: {},
      currentColumnProps: null,
    }
  },
  watch: {
    data: {
      handler(val) {
        if (!val) return
        this.doLayout(false)
      },
      deep: true
    },
    hasMove: {
      handler(val) {
        if (val) {
          this.rowDrop() //声明表格拖动排序方法
        } else {
          this.sortable.destroy()
        }
      },
      deep: true
    }
  },
  computed: {
    menuId() {
      return this.$route.meta.modelId || ''
    },
    selection() {
      return this.$refs.JNPFTable.selection
    },
    _customKey() {
      return this.customKey || this.partentOrChild
    },
    _hasC() {
      if (this.hasC === '') return true
      if (Array.isArray(this.hasC)) {
        const menuPermissionList = this.$store.getters.permissionList.filter(o => o.modelId === this.$route.meta.modelId)
        return this.hasC.some(item => menuPermissionList.some(o => o.button.some(o2 => o2.enCode === item)))
      }
      return this.hasC
    },
    _hasMove(){
      if (this.hasMove === '') return true
      if (Array.isArray(this.hasMove)) {
        const menuPermissionList = this.$store.getters.permissionList.filter(o => o.modelId === this.$route.meta.modelId)
        return this.hasMove.some(item => menuPermissionList.some(o => o.button.some(o2 => o2.enCode === item)))
      }
      return this.hasMove
    },
    // 属性语法糖
    attributes() {
      const result = {}
      if (this.totalData) { // 便捷总计
        // result['show-summary'] = true // 需要在外部添加，否则会引发样式问题
        result['summary-method'] = (param) => {
          return param.columns.map((column, index) => {
            if (column.type === 'index') return '总计'
            if (!column.property) return ''
            return this.totalData[column.property]
          })
        }
      }
      return result
    }

  },
  created() {
    const { promise, resolve } = getPromise()
    this.tableRealRefPromise = promise
    this.tableRealRefResolve = resolve
    // 创建防抖函数
    this.doLayoutDebounced = this.jnpf.debounce(this._doLayout, 200)
  },
  mounted() {
    this.tableRealRefResolve(this.$refs.JNPFTable)
    this.getColumns()
    if (this.hasMove) {
      this.rowDrop() //声明表格拖动排序方法
    }
  },
  beforeUpdate() {
    // this.getColumns()
    this.setShowOverflowTooltip()
  },
  methods: {
    /**
     * 清除排序
     * @returns {Promise<void>}
     */
    async clearSort() {
      const tableRef = await this.getTableRef()
      tableRef.clearSort()
    },
    /**
     * 获取表格实例 在此promise后可以获取到表格实例
     * @returns {ElTable}
     */
    getTableRef() {
      return this.tableRealRefPromise
    },

    /**
     * 以下为复选框增强方法
     * ------start-----
     */
    /**
     * 获取当前选择的行
     * @returns {[]|{}}
     */
    getCurrentSelection() {
      return deepClone(this.selection)
    },
    /**
     * 切换所有行的状态
     * @returns {*|void}
     */
    async toggleAllSelection() {
      const tableRef = await this.getTableRef()
      return tableRef.toggleAllSelection()
    },
    /**
     * 全选
     * @returns {Promise<void>}
     */
    async allRowCheck() {
      const tableRef = await this.getTableRef()
      tableRef.clearSelection()
      await this.$nextTick()
      this.toggleAllSelection()
    },
    /**
     * 取消全选
     */
    async allRowCancelCheck() {
      const tableRef = await this.getTableRef()
      tableRef.clearSelection()
    },
    /**
     * 当前是否有被选中的
     * @returns {boolean}
     */
    hasSelection() {
      return this.selection.length > 0
    },
    /**
     * 切换选中行
     * @param rows
     * @param checked
     */
    async toggleSelection(rows, checked = true) {
      const tableRef = await this.getTableRef()
      if (rows) {
        rows.forEach(row => {
          tableRef.toggleRowSelection(row, checked)
        })
      } else {
        tableRef.clearSelection()
      }
    },
    /**
     *
     * ------end-----
     */
    // 缓存存在 或不存在
    changeCacheWidth(cacheList, column, newWidth) {
      // 更新列宽
      const index = cacheList.findIndex(item => item.prop === column.property)
      if (index !== -1) {
        // 只更新被调整列的宽度，保持其他列的弹性布局
        cacheList[index].width = newWidth
        cacheList[index].minWidth = newWidth
        // 保存列宽到 localStorage
        this.columnList = cacheList
        this.jnpf.storageSet({ [this.menuId + this._customKey]: this.transactionCacheList(cacheList) })
      }

      this.$nextTick(() => {
        // this.doLayout(false)
        this.saveTableConfigToSever()
      })
    },
    // 当列宽拖动结束时调用
    async handleHeaderDragEnd(newWidth, oldWidth, column) {
      this.changeCacheWidth(this.columnList, column, newWidth)
    },
    setShowOverflowTooltip() {
      const children = this.$slots.default || []
      if (children.length > 0) {
        children.forEach((child) => {
          let childPropsData = child.componentOptions ? child.componentOptions.propsData : ''
          if (childPropsData !== '' && childPropsData.label !== '操作') {
            // 添加show-overflow-tooltip属性，并设置为接收的showOverflowTooltip
            childPropsData.showOverflowTooltip = childPropsData.hasOwnProperty('showOverflowTooltip') ? childPropsData.showOverflowTooltip : this.showOverflowTooltip
            if (childPropsData.fixed === 'left' || childPropsData.fixed === '') {
              // 防止左吸附列的内容没有在占满格子的情况下展示不全
              child.componentOptions.propsData.minWidth = childPropsData.minWidth ||
                childPropsData.width || 0
              delete child.componentOptions.propsData.width
            }

            if (this.listQuery) childPropsData.renderHeader = (h, { column }) => {
              // 检查当前列是否固定
              let fixedIcon = null
              if (this.listQuery.superQuery && Array.isArray(this.listQuery.superQuery.condition)) {
                const hasFixed = this.listQuery.superQuery.condition.find(filterItem => filterItem.fixed && filterItem.field === childPropsData.prop)
                if (hasFixed) {
                  fixedIcon = h('i', { class: "icon-ym icon-ym-search el-button--text", style: { marginLeft: '4px', marginRight: '4px', fontSize: '12px' } })
                }
              }
              // 检查当前列是否排序
              let sortIcon = null
              if (this.listQuery.orderItems && Array.isArray(this.listQuery.orderItems)) {
                // 优先使用 sortProp，如果没有则使用 prop
                const sortProp = getSortProp(child.data.attrs || {}, childPropsData.prop, { tranToUnderline: this.tranToUnderline })
                const sort = this.listQuery.orderItems.find(sortItem => sortItem.column === sortProp)
                if (sort) {
                  sortIcon = h('span', { class: 'el-button--text', style: { marginLeft: '4px', fontSize: '12px' } }, sort.asc ? '▲' : '▼')
                }
              }
              // 检查当前列是否筛选
              let filterIcon = null
              if (this.listQuery.superQuery && Array.isArray(this.listQuery.superQuery.condition)) {
                const filter = this.listQuery.superQuery.condition.find(filterItem => {
                  let hasFilterField = filterItem.field === childPropsData.prop
                  let hasFilterValue = (() => {
                    if (filterItem.symbol === 'empty') return true
                    if (typeof filterItem.fieldValue === 'object' ? filterItem.fieldValue?.length : !!filterItem.fieldValue) return true
                    if (filterItem.fieldValue === 0 || filterItem.fieldValue === false) return true
                    return false
                  })()
                  return hasFilterField && hasFilterValue
                })
                if (filter) {
                  filterIcon = h('i', { class: "icon-ym icon-ym-filter el-button--text", style: { marginLeft: '4px', fontSize: '12px' } })
                }
              }
              return h('div', { class: `table-header-content${filterIcon || sortIcon ? ' active' : ''}` }, [fixedIcon, childPropsData.label, filterIcon, sortIcon])
            }
          }
        })
      }
    },
    showDrawer() {
      this.drawerVisible = true
      this.$nextTick(() => {
        this.$refs.columnSettings.init(this.columnList, this.columns)
      })
    },
    checkForSlotContent() {
      let checkForContent = (hasContent, node) => {
        return hasContent || node.tag || (node.text && node.text.trim())
      }
      return this.$slots && this.$slots.default && this.$slots.default.reduce(checkForContent, false)
    },
    async getColumns() {
      if (!this.customColumn) return
      if (!this._customKey) console.error('带有custom-column属性的JNPF-table必须指定customKey！')
      if (this.customKey && this.partentOrChild !== 'partent') console.error('customKey和partentOrChild不要同时设置！')
      this.hasSlotContent = this.checkForSlotContent()
      if (!this.hasSlotContent) return
      await this.$nextTick()
      // 获取最新的slot内容
      this.columns = this.$slots.default
      let defaultColumns = this.columns.map(o => o.componentOptions && o.componentOptions.propsData).filter(item => item)
      this.defaultColumns = JSON.parse(JSON.stringify(defaultColumns.filter(o => o.prop))) //
      let list = JSON.parse(JSON.stringify(this.defaultColumns))
      let cacheList = this.jnpf.storageGet(this.menuId + this._customKey)
      if (!cacheList) {
        list.forEach(item => {
          if (this.setColumnDisplayList.includes(item.prop)) {
            item.columnVisible = false
          } else {
            item.columnVisible = true
          }
        })
        this.columnList = list
      } else {
        const copyCacheList = JSON.parse(JSON.stringify(cacheList))
        this.defaultColumns.forEach((item, index) => {
          const cacheItem = copyCacheList.find(cacheItem => cacheItem.prop === item.prop)
          if (!cacheItem) {
            item.columnVisible = true // 新增加的列默认显示
            const prevColumn = this.defaultColumns[index - 1] || null
            if (prevColumn) {
              // 找到prevColumn在cacheList中的索引，在cacheList中插入item
              const prevColumnIndex = copyCacheList.findIndex(item => item.prop === prevColumn.prop)
              copyCacheList.splice(prevColumnIndex + 1, 0, item)
            } else {
              copyCacheList.unshift(item)
            }
          }
        })
        cacheList = copyCacheList
        let columnList = cacheList.map(cacheItem => {
          let isShow = false
          list.forEach(defaultColumnsItem => {
            if (cacheItem.prop === defaultColumnsItem.prop) {
              isShow = true
              cacheItem = {
                ...defaultColumnsItem,
                width: cacheItem.width,
                minWidth: cacheItem.minWidth,
                columnVisible: cacheItem.columnVisible,
              }
              // defaultColumnsItem.width = cacheItem.width
              // defaultColumnsItem.minWidth = cacheItem.minWidth
            }
          })
          return isShow ? cacheItem : null
        }).filter(item => item)
        this.columnList = this.mergeArray(columnList, list) // 实际展示的列
        this.setPropsMinWidth(this.columnList)
      }
    },
    mergeArray(arr1, arr2) {
      let arr = [...arr1]
      for (let i = 0; i < arr2.length; i++) {
        let flag = true
        inner: for (let j = 0; j < arr1.length; j++) {
          if (arr2[i].prop == arr1[j].prop) {
            flag = false
            break inner
          }
        }
        if (flag) arr.push(arr2[i])
      }
      return arr
    },
    doLayout(flag = true) {
      this.doLayoutDebounced(flag)
    },
    _doLayout(flag = true) {
      if (this.timeout) {
        clearTimeout(this.timeout)
      }
      this.timeout = setTimeout(async() => {
        // 确保在doLayout前获取最新的列配置
        await this.getColumns()
        this.$refs.JNPFTable?.doLayout()
        if (flag) {
          this.tableKey++
        }
      }, 0)
    },
    setPropsMinWidth(list) {
      // 如果list没有带有minWidth属性的项，则给所有的展示项的width都改为minWidth
      let showColumnList = list.filter(item => !!item.columnVisible)
      let hasMinWidthFlag = showColumnList.some(item => item.hasOwnProperty('minWidth'))

      this.$slots.default.forEach((item, index) => {
        if (!item.componentOptions?.propsData) return

        const propsData = item.componentOptions.propsData
        const listItem = list.find(o => o.prop === propsData.prop)

        if (!listItem || !listItem.columnVisible) return

        // 保持原有的width或minWidth设置
        if (propsData.width) {
          propsData.width = listItem.width || propsData.width
          delete propsData.minWidth
        } else if (propsData.minWidth) {
          propsData.minWidth = listItem.minWidth || propsData.minWidth
          delete propsData.width
        }

        // 确保固定列有最小宽度
        if (propsData.fixed === 'left' || propsData.fixed === '') {
          propsData.minWidth = propsData.minWidth || propsData.width || 0
          delete propsData.width
        }
      })
    },
    setColumn(list) {
      this.setPropsMinWidth(list)
      // 设置固定方向
      list.forEach((item, index) => {
        const target = this.columns.find(slotItem => slotItem.key === item.prop)
        if (target && target.componentOptions) {
          this.$set(target.componentOptions.propsData, 'fixed', item.fixed)
        }
      })
      this.jnpf.storageSet({ [this.menuId + this._customKey]: this.transactionCacheList(list) })
      this.columnList = list
      this.$forceUpdate()
      this.tableKey++
      this.saveTableConfigToSever()
      this.$emit('columnChange') // 告诉父组件列已改变，一些逻辑需重新执行
    },
    // 表格拖动方法
    rowDrop() {
      const el = this.$refs.JNPFTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      // const el = this.$refs.JNPFTable.$el.querySelectorAll('.el-table__header-wrapper thead tr')
      this.sortable = Sortable.create(el, {
        filter: '.non-draggable-header',
        ghostClass: 'sortable-ghost',
        handle: this.isHandlerColumn ? '.handler-column' : '',
        setData: function(dataTransfer) {
          dataTransfer.setData('Text', '')
        },
        // 阻止默认行为
        onFilter: function(evt) {
          const item = evt.item;
          if (Sortable.utils.is(item, '.non-draggable-header')) {
            evt.preventDefault();
            // 添加视觉反馈
            item.classList.add('animate-pulse');
            setTimeout(() => item.classList.remove('animate-pulse'), 300);
          }
        },
        // 关键：限制拖动范围
        onMove: (evt) => {
          const draggedEl = evt.dragged;
          const relatedEl = evt.related; // 目标位置元素

          // 允许拖动的条件：
          // 1. 拖动源是可拖动列
          // 2. 目标位置也是可拖动列
          return draggedEl.classList.contains('draggable-header') &&
            relatedEl.classList.contains('draggable-header');
        },
        onEnd: evt => {
          let _data = deepClone(this.data)
          const targetRow = _data.splice(evt.oldIndex, 1)[0]
          _data.splice(evt.newIndex, 0, targetRow)
          let att = []
          _data.forEach((item, index) => {
            let obj = {
              sortCode: index,
              ...item
            }
            att.push(obj)
          })
          this.$emit('changeMove', att)
          // updateSortBatch(att).then(res => {
          //   this.$message.success("批量修改排序成功")
          //   this.initData()

          // })
        }
      })
    },
    // 保存表格配置到后端
    saveTableConfigToSever() {
      if (!this.$store.getters.configData.system.web_cache_way) return
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        saveWebCache({ ['jnpf_' + this.menuId + this._customKey]: localStorage.getItem('jnpf_' + this.menuId + this._customKey) })
      }, 0)
    },
    // 过滤列指定属性后返回cacheList
    transactionCacheList(cacheList) {
      if (!cacheList?.length) return cacheList

      // 创建 prop 到 vnode 的映射，避免重复查找
      const propToVNode = new Map(
        this.columns.map(col => [
          col.componentOptions?.propsData?.prop,
          col
        ]).filter(([prop]) => prop)
      )

      return cacheList.map(item => {
        const newItem = { ...item }
        const vnode = propToVNode.get(item.prop)

        // 如果列带有 notCacheWidth 属性，则删除 width 和 minWidth
        if (![false, undefined].includes(vnode?.data?.attrs?.notCacheWidth)) {
          delete newItem.width
          delete newItem.minWidth
        }

        return newItem
      })
    },

    async handleHeaderClick(column, event) {
      if (!this.listQuery) return
      // console.log(column, event)
      if (!event.target.className.includes('table-header-content')) event = { target: event.target.parentElement }
      if (!event.target.className.includes('table-header-content')) return
      if (this.popoverVisible) {
        if (this.popoverColumn === column.property) {
          return
        } else {
          this.closePopover()
          await this.$nextTick()
        }
      }
      if (!column.property) return


      // 获取当前列的属性信息
      const columnProps = this.getColumnProps(column.property)

      // 计算弹窗位置
      this.popoverStyle = (() => {
        const rect = event.target.getBoundingClientRect();
        const parentRect = event.target.parentElement.getBoundingClientRect();
        const tableRect = this.$refs.JNPFTable.$el.getBoundingClientRect();
        // 弹窗的宽度
        const popoverWidth = 220;

        const result = {
          top: (rect.bottom + window.scrollY) + 'px'
        };

        // 计算左侧位置
        let leftPosition = rect.left + window.scrollX;
        if (leftPosition < tableRect.left + window.scrollX) {
          leftPosition = tableRect.left + window.scrollX
        }

        // 检查是否超出父容器右侧边界
        if (leftPosition + popoverWidth > tableRect.right + window.scrollX) {
          // 靠右对齐
          // result.right = (tableRect.right + window.scrollX) + 'px';
          result.right = '0px';
        } else {
          // 靠左对齐
          result.left = leftPosition + 'px';
        }

        // console.log('Popover style:', result);
        return result;
      })()

      this.popoverVisible = true
      this.popoverColumn = column.property
      this.currentColumnProps = columnProps // 保存当前列属性
      setTimeout(() => {
        // 点击外部关闭
        document.addEventListener('click', this.closePopover)
      }, 10)
    },
    closePopover() {
      // console.log('closePopover')
      if (this.$refs.popoverCard?.closeDisabled) return
      this.popoverVisible = false
      document.removeEventListener('click', this.closePopover)
    },
    // 获取列的属性信息
    getColumnProps(prop) {
      const children = this.$slots.default || []
      for (const child of children) {
        const childPropsData = child.componentOptions?.propsData || {}
        const childAttrs = child.data?.attrs || {}
        // 兼容 prop 在 propsData 或 attrs
        if ((childPropsData.prop || childAttrs.prop) === prop) {
          // 合并 propsData 和 attrs，attrs 优先
          return { ...childPropsData, ...childAttrs }
        }
      }
      return {}
    },
    queryChange(listQuery) {
      // 过滤掉listQuery里不存在于表格中的排序
      if (listQuery.orderItems && listQuery.orderItems.length) {
        listQuery.orderItems = listQuery.orderItems.reduce((result, item) => {
          if (!item.column) return result
          if (this.columns.some(child => {
            if (this.tranToUnderline) return true
            let childPropsData = child.componentOptions?.propsData
            if (!childPropsData || childPropsData.label === '操作') return false
            const sortProp = getSortProp(child.data.attrs || {}, item.column, { tranToUnderline: this.tranToUnderline })
            return sortProp === item.column
          })) {
            result.push(item)
          } else {
            console.error(`表格列排序属性 ${item.column} 不存在，请在视图 orderItems 中纠正属性名或移除此属性！`)
          }
          return result
        }, [])
        // 创建时间排序优先级固定最低
        // if (listQuery.orderItems.length > 1) {
        //   const originOrderItems = listQuery.orderItems
        //   const targetIndex = originOrderItems.findIndex(item => ['createTime', 'create_time'].includes(item.column));
        //   if (targetIndex > -1) {
        //     listQuery.orderItems.push(originOrderItems.splice(targetIndex, 1)[0]);
        //   }
        // }
      }
      // 过滤掉keywordQuery关联属性中不存在于table的字段
      if (listQuery.keywordQuery && listQuery.keywordQuery.fieldList?.length) {
        listQuery.keywordQuery.fieldList = listQuery.keywordQuery.fieldList.filter(item => this.columnList.find(column => column.prop === item))
      }
      this.$emit('queryChange', listQuery)
    },
    showSortDrawer() {
      this.sortDrawerVisible = true
      this.$nextTick(() => {
        this.$refs.sortSettings.init(this.columnList, this.columns)
      })
    },
    // headerRowStyle({ row, rowIndex }) {
    //   console.log(row, rowIndex)
    //   // let result = {}
    //   // if (this.listQuery) {
    //   //   result.cusorsor = 'pointer'
    //   //   if (this.listQuery.orderItems?.some(item => item.column === row.property)) result.backgroundColor = '#adceff'
    //   //   if (this.listQuery.superQuery?.condition?.some(item => item.filed === row.property)) result.backgroundColor = '#adceff'
    //   // }
    //   return result
    // },
  }
}
</script>
<style lang="scss" scoped>
.tableContainer {
  flex: 1 0 0;
  width: 100%;
  height: 100%;
  overflow: hidden;

  /* 确保合计行的内容不换行 */
  ::v-deep .el-table__footer-wrapper td div,
  ::v-deep .el-table__fixed-footer-wrapper td div {
    white-space: nowrap;
  }
  ::v-deep .table-header-content {
    transition: 0.2s ease;
    border-radius: 4px;
    &.active,
    &:hover {
      padding: 0 0 0 4px;
      cursor: pointer;
      background-color: #e7e7e7;
      * {
        // cursor: default;
      }
    }
  }
}
</style>
<style scoped>
/* .JNPF-common-table {
  border: none !important;
  border-top: 1px solid #EBEEF5 !important;
} */
</style>
