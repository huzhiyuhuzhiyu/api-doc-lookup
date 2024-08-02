<template>
  <div class="tableContainer" v-if="!refreshTable">
    <el-table :data="data" ref="JNPFTable" class="JNPF-common-table" :height="height"
      :element-loading-text="$t('common.loadingText')" v-bind="$attrs" v-on="$listeners" :border="border"
      :header-cell-style="headerCellStyle">
      <el-table-column prop="selection" type="selection" width="45" key="selection" :fixed="fixedSelect" v-if="hasC"
        align="center" :selectable="checkSelectable" />
      <el-table-column align="center" label="拖动" width="60" v-if="hasMove">
        <template>
          <i class="drag-handler icon-ym icon-ym-darg" style="cursor: move;font-size:20px" disabled title='点击拖动' />
        </template>
      </el-table-column>
      <el-table-column prop="index" type="index" width="60" label="序号" v-if="hasNO" :fixed="fixedNO" align="center"  :key="Math.random()"/>
      <jnpf-table-column :columns="columns" :columnList="columnList" v-if="customColumn" />
      <template v-else>
        <slot />
      </template>
      <el-table-column align="center" fixed="right" width="1" v-if="customColumn">
        <template slot="header">
          <el-tooltip content="表头设置" placement="top">
            <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="showDrawer" />
          </el-tooltip>
        </template>
      </el-table-column>
      <template slot="empty">
        <el-empty description="暂无数据" :image-size="120"></el-empty>
      </template>
    </el-table>
    <ColumnSettings v-if="drawerVisible" ref="columnSettings" :defaultColumns="defaultColumns" :columnList="columnList"
      @setColumn="setColumn" />
  </div>
</template>

<script>
import JnpfTableColumn from './Column'
import ColumnSettings from './ColumnSettings'
import Sortable from 'sortablejs'
export default {
  name: 'JNPF-table',
  components: { JnpfTableColumn, ColumnSettings },
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
      type: Boolean,
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
    // 多选框 默认无
    hasC: {
      type: Boolean,
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
  },
  data() {
    return {
      columnList: [],
      hasSlotContent: false,
      columns: [],
      defaultColumns: [],
      drawerVisible: false,
      refreshTable: false,
      headerCellStyle: {
        backgroundColor: '#f5f7fa',
        fontWeight: 'bold'
      }
    }
  },
  watch: {
    data: {
      handler(val) {
        if (!val) return
        this.doLayout()
      },
      deep: true
    }
  },
  computed: {
    menuId() {
      return this.$route.meta.modelId || ''
    }
  },
  mounted() {
    this.getColumns()
    if (this.hasMove){
      console.log(111);
      
      this.rowDrop(); //声明表格拖动排序方法
    }
  },
  beforeUpdate() {
    // this.getColumns()
    this.setShowOverflowTooltip()
  },
  updated() {
    if (this.refreshTable) this.refreshTable = false
  },
  methods: {
    setShowOverflowTooltip() {
      const children = this.$slots.default;
      if (children.length > 0) {
        children.forEach((child) => {
          let childPropsData = child.componentOptions ? child.componentOptions.propsData : ""
          if (childPropsData !== '' && childPropsData.label !== '操作') {
            // 添加show-overflow-tooltip属性，并设置为接收的showOverflowTooltip
            childPropsData.showOverflowTooltip = this.showOverflowTooltip;
            if (childPropsData.fixed === 'left' || childPropsData.fixed === '') {
              // 防止左吸附列的内容没有在占满格子的情况下展示不全
              child.componentOptions.propsData.minWidth = childPropsData.minWidth || childPropsData.width || 0
              delete child.componentOptions.propsData.width
            }
          }
        });
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
    getColumns() {
      if (!this.customColumn) return
      this.hasSlotContent = this.checkForSlotContent()
      if (!this.hasSlotContent) return
      this.$nextTick(() => {
        this.columns = this.$slots.default // 代码传入的列
        let defaultColumns = this.columns.map(o => o.componentOptions && o.componentOptions.propsData).filter(item => item)
        this.defaultColumns = JSON.parse(JSON.stringify(defaultColumns.filter(o => o.prop))) // 
        let list = JSON.parse(JSON.stringify(this.defaultColumns))
        const cacheList = this.jnpf.storageGet(this.menuId + this.partentOrChild)

        if (!cacheList) {
          list.forEach(item => {
            if (this.setColumnDisplayList.includes(item.prop)) {
              item.columnVisible = false;
            } else {
              item.columnVisible = true;
            }
          });
          this.columnList = list
          // this.columnList = list.map(item => {
          //   return {
          //     ...item,
          //     columnVisible: true
          //   }
          // })
        } else {
          let columnList = cacheList.map(item => {
            let isShow = false
            list.forEach(item2 => {
              if (item.prop === item2.prop) isShow = true
            })
            return isShow ? item : null
          }).filter(item => item)
          this.columnList = this.mergeArray(columnList, list) // 实际展示的列
        }
      })

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
    doLayout() {
      setTimeout(() => {
        this.$nextTick(() => {
          this.$refs && this.$refs.JNPFTable && this.$refs.JNPFTable.doLayout()
        })
      }, 50)
    },
    setColumn(list) {
      // 如果list没有带有minWidth属性的项，则给所有的展示项的width都改为minWidth
      let showColumnList = list.filter(item => !!item.columnVisible)
      let hasMinWidthFlag = showColumnList.some(item => item.hasOwnProperty("minWidth"))
      if (!hasMinWidthFlag) {
        list.forEach((item, index) => {
          if (item.columnVisible) {
            this.$slots.default[index].componentOptions.propsData.minWidth = item.width
            this.$slots.default[index].componentOptions.propsData.initialWidth = item.width // 标记此字段初始宽度，用于逆向此操作
            delete this.$slots.default[index].componentOptions.propsData.width
          }
        })
      } else {
        // 逆向minWidth
        this.$slots.default.forEach(item => {
          if (item.componentOptions.propsData.hasOwnProperty("initialWidth")) {
            item.componentOptions.propsData.width = item.componentOptions.propsData.initialWidth
            delete item.componentOptions.propsData.minWidth
            delete item.componentOptions.propsData.initialWidth
          }
        })
      }
      // 设置固定方向
      list.forEach((item, index) => {
        if (item.columnVisible && item.fixed === 'left' || item.fixed === '' || item.fixed === 'right') {
          this.$set(this.$slots.default[index].componentOptions.propsData, 'fixed', item.fixed)
        }
      })
      // this.loading = true
      this.jnpf.storageSet({ [this.menuId + this.partentOrChild]: list })
      this.columnList = list
      this.$forceUpdate()
      this.refreshTable = true
    },
    // 表格拖动方法
    rowDrop() {
      const el = this.$refs.JNPFTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost',
        setData: function (dataTransfer) {
          dataTransfer.setData('Text', '')
        },
        onEnd: evt => {
          const targetRow = this.data.splice(evt.oldIndex, 1)[0];
          this.data.splice(evt.newIndex, 0, targetRow);
          console.log(this.data);
          let att = []
          this.data.forEach((item, index) => {
            let obj = {
              id: item.id,
              sortCode: index, 
            }
            att.push(obj)
          });
          console.log(att);
          this.$emit('changeMove',att)
          // updateSortBatch(att).then(res => {
          //   this.$message.success("批量修改排序成功")
          //   this.initData()

          // })
        }
      });
    },
  }
}
</script>
<style lang="scss" scoped>
.tableContainer {
  flex: 1 0 0;
  height: 100%;
  overflow: hidden;
}
</style>
<style scoped>
/* .JNPF-common-table {
  border: none !important;
  border-top: 1px solid #EBEEF5 !important;
} */
</style>