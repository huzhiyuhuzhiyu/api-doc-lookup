<template>
  <div>

    <div v-if="openMode !== '只读'">
      <el-button type="text" class="topButton" icon="el-icon-plus" @click="openSeleceWareDialog">选择库位</el-button>|
      <el-button type="text" class="topButton" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>|
      <el-button type="text" class="topButton" icon="el-icon-pie-chart" @click="autoDistribute">自动分配</el-button>|
      <span class="topInfo">待出库数量：{{ num }}</span>|
      <span class="topInfo">待分配数量：{{ nowNum }}</span>|
    </div>
    <div v-else style="padding: 9px 0;">
      <span class="topInfo">出库数量：{{ num }}</span>
    </div>

    <el-form :model="JNPFColTableData" ref="main">
      <el-table class="TableForm table autoHeight" :data="JNPFColTableData.data"
        @selection-change="handleSelectionChange" border>
        <el-table-column type="selection" width="60" fixed="left" align="center" v-if="openMode !== '只读'"
          :selectable="checkSelectable" />
        <el-table-column type="index" width="60" label="序号" align="center" fixed="left" />

        <template v-for="item in tableItems">
          <el-table-column v-if="item.hasOwnProperty('render') ? item.render : true" :key="item.prop" :prop="item.prop"
            :label="item.label" :width="item.width" :min-width="item.minWidth" :fixed="item.fixed"
            :show-overflow-tooltip="item.type === 'view'">
            <template slot="header" v-if="isRequire(item)">
              <span class="required">*</span>{{ item.label }}
            </template>
            <template slot-scope="scope">
              <FormItem :item="{ ...item, itemDisabled: specialDisabled(item, scope) }"
                :lineItem="JNPFColTableData.data[scope.$index]"
                :value="JNPFColTableData.data[scope.$index][scope.column.property]"
                @input="handleInput($event, scope.column.property, scope.$index)" :ref="scope.column.property"
                :openMode="openMode" :scope="scope" :paramsObj="{ scope }" />
            </template>
          </el-table-column>
        </template>

        <el-table-column label="操作" width="90" fixed="right" v-if="openMode !== '只读'">
          <template slot-scope="scope">
            <el-button type="text" class="JNPF-table-delBtn" :disabled="!!scope.row.documentObjId || !!scope.row.occupyObjId"
              @click="deleteth(scope)">
              {{ $t(`common.delBtn`) }}
            </el-button>
          </template>
        </el-table-column>

        <div class="noDataTip" v-if="JNPFColTableData.data.length === 0">暂无数据</div>
      </el-table>
    </el-form>

    <ComSelect-page ref="ComSelect-page" @change="addth" :tableItems="WareTableItems" title="选择库位"
      :listMethod="getEffectWareLocation" :listRequestObj="dialogRequestObj" :searchList="WareTableSearchList"
      :elementShow="false" multiple :renderTree="false" />
  </div>
</template>

<script>
import FormItem from "@/components/JNPF-col-table/item"
import { getEffectWareLocation } from "@/api/warehouseManagement/inboundAndOutbound"
export default {
  components: { FormItem },
  name: 'TableForm-ware',
  data() {
    return {
      selectedList: [],
      JNPFColTableData: {
        data: this.value
      },
      getEffectWareLocation,
      WareTableItems: [
        { prop: 'warehouseName', label: '仓库名称', minWidth: 120 },
        { prop: 'goodsShelvesName', label: '货架名称', minWidth: 120 },
        { prop: 'shelfSpaceName', label: '货位名称', minWidth: 120 },
        { prop: 'num', label: '当前库存', minWidth: 120 },
        { prop: 'mainUnit', label: '单位', minWidth: 70 },
        { prop: 'batchNumber', label: '批次号', minWidth: 180 },
        // { prop: 'inventoryQuantity2', label: '库存数(副)' },
        // { prop: 'deputyNum', label: '单位(副)' },
        { prop: 'remark', label: '备注' }
      ], // 货位选择弹出框表单展示字段
      WareTableSearchList: [
        // { prop: "code", label: "编码", type: 'input' },
        // { prop: "name", label: "货位/货架名称", type: 'input' }
      ], // 货位选择弹出框搜索条件
    }
  },
  props: {
    value: {
      type: Array,
      required: true
    },
    tableItems: {
      type: Array,
      required: true
    },
    openMode: {
      type: String,
      default: '新建'
    },
    num: {},
    nowNum: {},
    dialogRequestObj: {
      required: true
    },
  },
  watch: {
    value: {
      handler: function (newValue) {
        this.JNPFColTableData.data = newValue;
      },
      // deep: true
    }
  },
  computed: {
    hasFixed() {
      return this.tableItems.some(item => item.hasOwnProperty('fixed'))
    },
    addMethod() {
      return Boolean(this.$listeners.addth)
    },
    delMethod() {
      return Boolean(this.$listeners.deleteth)
    }
  },
  mounted() {
    this.setDefaultValue();
  },
  methods: {
    handleInput(val, key, index) {
      this.$emit('input', index, key, val);
    },
    setDefaultValue() {
      const formDataList = [...this.value]
      formDataList.forEach((item, index) => {
        this.tableItems.forEach((item2, index2) => {
          const { prop, value } = item2;
          if ((item[prop] === undefined || item[prop] === "" || item[prop] === null) && value != undefined) {
            item[prop] = value;
          }
        })
      })
      this.$emit('input', [...formDataList]);
      // this.calcHeight()
    },
    handlerOpenSource(scope) {
      this.$emit('openSide', scope)
    },
    openSeleceWareDialog() {
      this.$refs['ComSelect-page'].openDialog()
    },
    isRequire(data) {
      return data.hasOwnProperty('itemRules') && data.itemRules.some(item => item.required === true)
    },
    addth(selectedIds, selectedList) {
      selectedList.forEach(item => {
        item.all.WareId = item.id
        item.all.WareName = item.name
      })
      let list = selectedList.map(item => item.all)
      this.$emit('addth', list)
      this.calcHeight()
    },
    deleteth(scope) {
      this.$emit('deleteth', scope)
      this.calcHeight()
    },
    batchDelete() {
      if (!this.selectedList.length) {
        this.$message.error("请选择你要删除的数据")
        return
      }
      let tempData = [...this.value]
      for (let i = 0; i < this.selectedList.length; i++) {
        const row = this.selectedList[i];
        const index = tempData.indexOf(row);
        if (index > -1) {
          tempData.splice(index, 1); // 从tableData中删除选中的行
        }
      }
      this.selectedList = [] // 清空选中的行的数据
      this.$emit('input', [...tempData]);
    },
    handleSelectionChange(data) {
      this.selectedList = data
    },
    calcHeight() {
      this.$nextTick(() => {
        let tBodyList = document.querySelectorAll('.TableForm.table.autoHeight')
        tBodyList.forEach(item => {
          item.style.height = 'auto'
          item.querySelector('.el-table__body-wrapper').style.height = 'auto'
        })
      });
    },
    // 调用父组件自动分配方法
    autoDistribute() {
      this.$emit('autoDistribute')
    },
    specialDisabled(item, itemScope) {
      let readOnly = item.hasOwnProperty('itemDisabled') ? item.itemDisabled : this.openMode === '新建' ? false : item.hasOwnProperty('readOnly') ? item.readOnly : this.openMode !== '编辑'
      if (typeof item.itemDisabled === 'function') { readOnly = item.itemDisabled(itemScope.$index) }
      if (!readOnly && !(['barCodeList', 'num'].includes(item.prop))) { readOnly = Boolean(itemScope.row.documentObjId) } // 如果行是自动分配出的占用库存，用户不可操作
      return readOnly
    },
    checkSelectable(row) {
      if (row.documentObjId) return false
      return true
    }
  }
}
</script>
<style  scoped>
::v-deep .el-form-item--small.el-form-item {
  margin-bottom: 0px;
}

.required {
  color: red;
  margin-right: 4px;
}

.topButton {
  margin-right: 8px;
  margin-left: 8px;
  font-size: 14px !important;
}

.topInfo {
  display: inline-block;
  margin: 0 8px;
}

.noDataTip {
  text-align: 'center';
  padding: '10%';
  color: #aaa;
}
</style>