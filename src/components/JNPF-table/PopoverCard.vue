<template>
  <transition name="el-zoom-in-top">
    <div class="custom-popover" @click.stop>
      <div v-if="!currentSortField && queryProps.type === 'no'" class="empty-text">该字段暂不支持排序和筛选！</div>
      <div class="popover-item-wrap" v-if="currentSortField">
        <div class="popover-item-title">排序</div>
        <div :class="['sort-item', 'system-icon', popoverColumnAsc ? 'active' : '']" @click="handleSort('ascending')">
          升序排序
        </div>
        <div :class="['sort-item', 'system-icon', popoverColumnDesc ? 'active' : '']" @click="handleSort('descending')">
          降序排序
        </div>
      </div>
      <hr class="popover-item-hr" v-if="[currentSortField, queryProps.type !== 'no'].filter(item => !!item).length === 2" />
      <div class="popover-item-wrap" v-if="queryProps.type !== 'no'">
        <div class="popover-item-title">筛选</div>
        <div class="fixed-search-box">
          <span>在搜索栏显示</span>
          <el-switch v-model="fixedSearchFlag" @change="handleFixedSearchFlagChange" v-if="fixedSearchFlag !== null" />
        </div>
        <div class="filter-row">
          <el-select v-model="filterSymbol" size="small" style="width: 100%;" placeholder="请选择比较符" @change="filterSymbolChange">
            <el-option v-for="item in symbolOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div>
          <!-- 未选择比较符 -->
          <template v-if="!filterSymbol">
            <el-input value="" placeholder="" disabled />
          </template>
          <template v-else-if="filterSymbol === 'empty'">
            <el-select v-model="filterValue" v-bind="{ placeholder: `请选择`, clearable: true }">
              <el-option v-for="(o, i) in global.booleanOptions" :key="i" v-bind="o"></el-option>
            </el-select>
          </template>
          <!-- 输入框 -->
          <template v-else-if="queryProps.type === 'input'">
            <el-input v-model="filterValue" v-bind="{ placeholder: `请输入`, maxlength: 50, clearable: true }" />
          </template>
          <!-- 输入框-数值 -->
          <template v-else-if="queryProps.type === 'number'">
            <el-input v-model.number="filterValue"
              v-bind="{ placeholder: `请输入`, maxlength: 50, clearable: true, ...fieldCache }" />
          </template>
          <!-- 下拉选择器 -->
          <template v-else-if="queryProps.type === 'select'">
            <el-select v-model="filterValue"
              v-bind="{ placeholder: `请选择`, clearable: true, multiple: filterSymbol === 'in', ...fieldCache }">
              <el-option v-for="(o, i) in queryProps.options" :key="i" v-bind="o"></el-option>
            </el-select>
          </template>
          <!-- 日期时间选择器 -->
          <template
            v-else-if="['year', 'month', 'date', 'dates', 'months', 'years', 'week', 'datetime'].includes(queryProps.type)">
            <el-date-picker-pro v-model="filterValue" v-bind="{
              placeholder: `请选择`, style: 'width:100%', clearable: true,
              ...fieldCache,
              ...(() => {
                const result = { key: filterSymbol }
                if (filterSymbol === 'between') {
                  result.defaultTime = ['00:00:00', '23:59:59']
                  if (typeof filterValue === 'string') filterValue = null
                  result.type = fieldCache.type + 'range'
                  result.pickerOptions = fieldCache.pickerOptionsRange
                } else {
                  result.defaultTime = null
                  if (typeof filterValue !== 'string') filterValue = null
                }
                return result
              })()
            }">
              <template slot="sidebar">
                <el-tooltip placement="top">
                  <el-switch v-model="timeOffset" active-text="动态" inactive-text=""></el-switch>
                  <div slot="content" v-html="genTooltip({ ...queryProps, tempFieldValue: filterValue, symbol: filterSymbol })"></div>
                </el-tooltip>
              </template>
            </el-date-picker-pro>
          </template>
          <!-- 自定义组件 -->
          <!-- <template v-else-if="queryProps.type === 'custom'">
            <component :is="queryProps.component" v-model="filterValue" v-on="fieldCache.events" v-bind="{
              placeholder: `请选择`, style: 'width:100%',
              ...fieldCache.props
            }" @click.stop.native.prevent="" />
          </template> -->
          <!-- 默认显示输入框 -->
          <template v-else>
            <el-input :value="'未识别的类型：' + queryProps.type" disabled />
          </template>
        </div>
        <div class="filter-btn-row">
          <el-button size="mini" @click="clearFilter">清除筛选条件</el-button>
          <el-button size="mini" type="primary" @click="confirmFilter">确认</el-button>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import { symbolOptions, getQueryProps, genTooltip, getSortProp } from '@/components/JNPF-table/data'
import ElDatePickerPro from '@/components/element-ui-pro/date-picker.js'
export default {
  name: 'PopoverCard',
  components: { ElDatePickerPro },
  props: {
    popoverColumn: {
      type: String,
      required: true
    },
    listQuery: {
      type: Object
    },
    columnProps: {
      type: Object,
      default: () => ({})
    },
    queryJson: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      genTooltip,
      fixedSearchFlag: null,
      filterSymbol: '',
      filterValue: '',
      popoverColumnAsc: false,
      popoverColumnDesc: false,
      fieldCache: {}, // 属性缓存 用于解决方法无法转为json后存储问题
      timeOffset: false,
      closeDisabled: false // 是否禁用关闭PopoverCard
    }
  },
  computed: {
    currentSortField() {
      return getSortProp(this.columnProps, this.popoverColumn)
    },
    symbolOptions() {
      // 寄存属性
      this.fieldCache = this.queryProps
      const result = symbolOptions.filter(item => item.effectType.includes(this.queryProps.type))
      if (result.length === 1) this.filterSymbol = result[0].value
      return result
    },
    queryProps() {
      return getQueryProps(this.columnProps, this.queryJson)
    }
  },
  mounted() {
    this.updateStatus()
  },
  // watch: {
  //   listQuery: {
  //     handler() {
  //       this.updateStatus()
  //     },
  //     deep: true
  //   }
  // },
  methods: {
    updateStatus() {
      if (this.listQuery && Array.isArray(this.listQuery.orderItems)) {
        const searchField = getSortProp(this.columnProps, this.popoverColumn)
        const sort = this.listQuery.orderItems.find(item => item.column === searchField)
        if (sort) {
          this.popoverColumnAsc = sort.asc
          this.popoverColumnDesc = !sort.asc
        } else {
          this.popoverColumnAsc = false
          this.popoverColumnDesc = false
        }
      }
      if (this.listQuery && Array.isArray(this.listQuery.superQuery.condition)) {
        const target = this.listQuery.superQuery.condition.find(item => item.field === this.columnProps.prop)
        // console.log(target);
        if (target) {
          this.filterSymbol = target.symbol
          // this.filterValue = target.fieldValue?.includes(',') ? target.fieldValue.split(',') : target.fieldValue
          this.filterValue = target.fieldValue
          this.timeOffset = target.timeOffset
        }
        this.fixedSearchFlag = target?.fixed || false
      }
    },
    handleSort(order) {
      let listQuery = structuredClone(this.listQuery)

      if (!listQuery.orderItems) {
        listQuery.orderItems = []
      }

      const sortField = getSortProp(this.columnProps, this.popoverColumn)

      const existingSortIndex = listQuery.orderItems.findIndex(item => item.column === sortField)

      if (existingSortIndex !== -1) {
        const existingSort = listQuery.orderItems[existingSortIndex]
        if (existingSort.asc === (order !== 'descending')) {
          listQuery.orderItems.splice(existingSortIndex, 1)
        } else {
          existingSort.asc = order !== 'descending'
          // const currentSort = listQuery.orderItems.splice(existingSortIndex, 1)[0]
          // listQuery.orderItems.unshift(currentSort)
        }
      } else {
        listQuery.orderItems.push({
          column: sortField,
          asc: order !== 'descending'
        })
      }

      this.$emit('queryChange', listQuery)
      this.$emit('close')
      this.$nextTick(() => {
        this.updateStatus()
      })
    },
    async clearFilter() {
      if (this.fixedSearchFlag) {
        this.closeDisabled = true // 暂时不关闭PopoverCard
        let flag = await this.$confirm('当前筛选条件已固定显示在搜索栏，清除后会将其隐藏，是否继续？', '提示', { type: 'warning' }).catch(err => false)
        this.closeDisabled = false // 可关闭PopoverCard
        if (!flag) return
      }
      this.fixedSearchFlag = false
      this.handleFixedSearchFlagChange(false)
      this.filterSymbol = null
      this.filterValue = null
    },
    confirmFilter() {
      let listQuery = structuredClone(this.listQuery)
      if (!this.filterSymbol && this.filterValue) {
        this.$message.error('请选择比较符！')
        return
      }
      // if (this.filterSymbol && this.filterSymbol !== 'empty' && !this.filterValue) {
      //   this.$message.error('请指定筛选值！')
      //   return
      // }
      listQuery.superQuery.matchLogic = 'AND'
      listQuery.superQuery.condition = listQuery.superQuery.condition.filter(item => item.field !== this.columnProps.prop)
      listQuery.superQuery.condition.unshift({
        field: this.columnProps.prop,
        symbol: this.filterSymbol,
        fieldValue: this.filterValue,
        timeOffset: this.timeOffset,
        fixed: this.fixedSearchFlag
        // fieldValue: (() => {
        //   let fieldValue = this.filterValue
        //   // if (Array.isArray(fieldValue)) fieldValue = fieldValue.join(',')
        //   if (this.queryProps.shiftConditionItem) { // 如果此搜索条件有映射的字段
        //     field = Object.keys(this.queryProps.shiftConditionItem)[0]
        //     fieldValue = this.queryProps.shiftConditionItem[Object.keys(this.queryProps.shiftConditionItem)[0]]
        //   }
        //   return fieldValue
        // })(),
      })
      this.$emit('queryChange', listQuery)
      this.$emit('close')
    },
    handleFixedSearchFlagChange() {
      if (!this.filterSymbol) {
        this.fixedSearchFlag = false
        this.$message.error('请先选择比较符！')
      }
    },
    filterSymbolChange(val) {
      if (['in', 'between'].includes(val) && !this.filterValue) this.filterValue = []
      else if (typeof this.filterValue === 'object') this.filterValue = ''
    }
  }
}
</script>

<style lang="scss" scoped>
/* .JNPF-common-table {
  border: none !important;
  border-top: 1px solid #EBEEF5 !important;
} */

.custom-popover {
  z-index: 500;
  background: #fff;
  border: 1px solid #e4e7ed;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  padding: 16px 16px 12px 16px;
  min-width: 220px;
  border-radius: 6px;
  position: fixed;

  .empty-text {
    color: #888;
  }

  .popover-item-wrap {
    position: relative;

    .fixed-search-box {
      position: absolute;
      right: 0;
      top: 0;
      font-size: 12px;
      color: #888;
      display: flex;
      align-items: center;
      line-height: 100%;

      >span {
        margin-right: 4px;
      }
    }

    .popover-item-title {
      font-weight: bold;
      margin-bottom: 10px;
      color: #888;
    }

    .sort-item {
      padding: 6px 12px;
      cursor: pointer;
      transition: all .2s;

      &:hover {
        // color: --theme-color;
        background: #f5f5f5;
      }

      &.active {
        // color: --theme-color;
      }
    }

    .filter-row {
      margin-bottom: 12px;
    }

    .filter-btn-row {
      display: flex;
      justify-content: space-between;
      margin-top: 8px;

      .el-button {
        flex: 1;
        margin-right: 8px;

        &:last-child {
          margin-right: 0;
        }
      }
    }
  }

  .popover-item-hr {
    margin: 10px 0;
  }
}
</style>
