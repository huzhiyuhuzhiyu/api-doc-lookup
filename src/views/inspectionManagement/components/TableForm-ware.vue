<template>
  <div>

    <div v-if="openMode !== '只读'" style="padding:9px 0;">
      <!-- <el-button type="text" class="topButton" icon="el-icon-plus" @click="openSeleceWareDialog">选择检验项目</el-button>|
      <el-button type="text" class="topButton" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>| -->
      <span style="margin: 0 8px;font-size: 16px;">总不合格数量：{{ num }}</span>|
      <span style="margin: 0 8px;font-size: 16px;">未分配不合格数量：{{ nowNum }}</span>
    </div>
    <div v-else style="padding: 9px 0;">
      <span style="margin: 0 8px;font-size: 16px;">总不合格数量：{{ num }}</span>
    </div>

    <el-form :model="JNPFColTableData" ref="main">
      <el-table :data="JNPFColTableData.data" hasNO fixedNO hasC
        @selection-change="handleSelectionChange">
        <!-- <el-table-column type="selection" width="60" :fixed="hasFixed ? 'left' : false" align="center"
          v-if="openMode !== '只读'" /> -->
        <el-table-column type="index" width="60" label="序号" align="center" :fixed="hasFixed ? 'left' : false" />

        <template v-for="item in tableItems">
          <el-table-column v-if="item.hasOwnProperty('render') ? item.render : true" :key="item.prop" :prop="item.prop"
            :label="item.label" :width="item.width" :min-width="item.minWidth" :fixed="item.fixed"
            :show-overflow-tooltip="item.type === 'view'">
            <template slot="header" v-if="isRequire(item)">
              <span class="required">*</span>{{ item.label }}
            </template>
            <template slot-scope="scope">
              <FormItem :item="item" :lineItem="JNPFColTableData.data[scope.$index]"
               
                :value="JNPFColTableData.data[scope.$index][scope.column.property]"
                @input="handleInput($event, scope.column.property, scope.$index)" :ref="scope.column.property"
                :openMode="openMode" :scope="scope" :paramsObj="{ scope }" />
            </template>
          </el-table-column>
        </template>

        <el-table-column label="更多信息" width="90" :fixed="hasFixed ? 'right' : false" align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" placement="top">
              <div v-html="setMoreInfo(scope)" slot="content"></div>
              <el-button size="mini" icon="el-icon-chat-line-square" circle></el-button>
            </el-tooltip>
          </template>
        </el-table-column>

        <div class="noDataTip" v-if="JNPFColTableData.data.length === 0">暂无数据</div>
      </el-table>
    </el-form>

    <ComSelect-page ref="ComSelect-page" @change="addth" :tableItems="dialogTableItems" dialogTitle="选择检验项目"
      :listMethod="getInspectionItem" :listRequestObj="dialogListRequestObj" :elementShow="false" multiple
      :renderTree="false" :listDataFormatting="dialogListDataFormatting" />
  </div>
</template>

<script>
import FormItem from "@/components/JNPF-col-table/item"
import { getWarehouseList, getStockGoodsShelves, getStockGoodsShelvesList } from '@/api/basicData/index' // 库位分类和列表
import { getInspectionItem } from '@/api/inspectionManagement/index' // 产品检验项目列表
export default {
  components: { FormItem },
  name: 'TableForm-ware',
  data() {
    return {
      selectedList: [],
      JNPFColTableData: {
        data: this.value
      },
      getInspectionItem,
      dialogListRequestObj: { id: this.productsId, inspectionCategory: this.$parent.$parent.inspectionType },
      dialogTableItems: [
        { prop: 'name', label: '检验名称' },
        { prop: 'inspectionBasis', label: '检验依据' },
        { prop: 'inspectionTools', label: '检验工具' },
        { prop: 'inspectionMethod', label: '检验方式' },
        { prop: 'maximum', label: '最大值' },
        { prop: 'minimum', label: '最小值' },
      ], // 选择弹出框表单展示字段
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
    productsId: {},
  },
  watch: {
    value: {
      handler: function (newValue) {
        this.JNPFColTableData.data = newValue;
      },
      // deep: true
    },
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
    treeNodeClick(data, node, listQuery) {
      if (listQuery.warehouseId === data.id) return listQuery
      listQuery.warehouseId = data.id
      return listQuery
    },
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
        this.$message.warning("请选择你要删除的数据")
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
      this.selectedList = []  // 清空选中的行的数据
      this.$emit('input', [...tempData]);
    },
    handleSelectionChange(data) {
      this.selectedList = data
    },
    calcHeight() {
      this.$nextTick(() => {
        let tBody = document.querySelectorAll('.el-table')[1]
        tBody.style.height = 'auto'
        tBody.querySelector('.el-table__body-wrapper').style.height = 'auto'
      });
    },
    dialogListDataFormatting(res) {
      let formatedData = res.data.map(item => {
        return { ...item, inspectionMethod: item.inspectionMethod === 'measure' ? '测量' : '其他' }
      })
      return formatedData
    },
    setMoreInfo(scope) {
      function inspectionMethodFormat(val) {
        if (!val) return '空'
        const wayList = [{
          label: "测量",
          value: "measure"
        }, {
          label: "其他",
          value: "other"
        }]
        const target = wayList.find(item => item.value === val)
        return target ? target.label : val
      }
      return `检验项目：${scope.row.name ? scope.row.name : '无'}<br/>
      检验依据：${scope.row.inspectionBasis ? scope.row.inspectionBasis : '无'}<br/>
      检验工具：${scope.row.inspectionTools ? scope.row.inspectionTools : '无'}<br/>
      检验方式：${inspectionMethodFormat(scope.row.inspectionMethod)}<br/>
      最大值：${scope.row.maximum ? scope.row.maximum : '无'}<br/>
      最小值：${scope.row.minimum ? scope.row.minimum : '无'}`
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

.noDataTip {
  text-align: 'center';
  padding: '10%';
  color: #aaa;
}
</style>