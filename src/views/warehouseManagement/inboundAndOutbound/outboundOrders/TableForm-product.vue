<template>
  <div class="TableForm_main">

    <div v-if="openMode !== '只读'" class="TableForm_title">
      <!-- <el-button type="text" class="topButton" icon="el-icon-plus" @click="openSeleceProductDialog">选择产品</el-button>| -->
      <el-button type="text" class="topButton" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>|
    </div>

    <el-form :model="JNPFColTableData" ref="main" class="tableContainer">
      <el-table v-if="tableVisible" class="TableForm table" :data="JNPFColTableData.data" hasNO fixedNO hasC
        :row-class-name="tableRowClassName" @selection-change="handleSelectionChange" border v-bind="customStyleData">
        <el-table-column type="selection" width="60" :fixed="hasFixed ? 'left' : false" align="center"
          v-if="openMode != '只读'" key="1" />
        <el-table-column type="index" width="60" label="序号" align="center" :fixed="hasFixed ? 'left' : false" />

        <template v-for="(item, index) in tableItems">
          <el-table-column v-if="item.hasOwnProperty('render') ? item.render : true" :key="item.prop + index"
            :prop="item.prop" :label="item.label" :width="item.width" :min-width="item.minWidth" :fixed="item.fixed"
            :show-overflow-tooltip="item.type === 'view'">
            <template slot="header" v-if="isRequire(item)">
              <span class="required">*</span>{{ item.label }}
            </template>
            <template slot-scope="scope">
              <FormItem :item="item" :lineItem="JNPFColTableData.data[scope.$index]" :linesList="JNPFColTableData.data"
                :value="JNPFColTableData.data[scope.$index][scope.column.property]"
                @input="handleInput($event, scope.column.property, scope.$index)" :ref="scope.column.property"
                :openMode="openMode" :scope="scope" :paramsObj="{ scope }" />
            </template>
          </el-table-column>
        </template>

        <el-table-column label="操作" width="140" :fixed="hasFixed ? 'right' : false">
          <template slot-scope="scope">
            <el-button size="mini" type="text" class="JNPF-table-delBtn" :disabled="openMode === '只读'"
              @click="deleteth(scope)">删除</el-button>
            <el-button size="mini" type="text" @click="handlerOpenSource(scope)"
              :style="{ color: scope.row.availableQuantity == '0' && scope.row.occupancyQuantity == '0' ? '#c0c4cc' : scope.row.allocated ? '#67c23a' : '#1890ff' }"
              :disabled="scope.row.availableQuantity == '0' && scope.row.occupancyQuantity == '0'">货位设置</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" fixed="right" width="40" v-if="customStyle">
          <template slot="header">
            <el-tooltip content="切换展示模式" placement="top">
              <el-link icon="el-icon-sort" :underline="false" @click="switchStyle" />
            </el-tooltip>
          </template>
        </el-table-column>

        <div class="noDataTip" v-if="JNPFColTableData.data.length === 0">暂无数据</div>
      </el-table>
    </el-form>

    <ComSelect-page ref="ComSelect-page" @change="addth" :tableItems="ProductTableItems" title="选择产品" treeTitle="产品分类"
      :methodArr="ProductMethodArr" :listMethod="getProductList" :listRequestObj="ProductListRequestObj"
      :searchList="ProductTableSearchList" :elementShow="false" multiple />
  </div>
</template>

<script>
import FormItem from "@/components/JNPF-col-table/item"
import { getProductList } from '@/api/basicData/materialFiles' // 产品列表
import { getcategoryTree } from '@/api/basicData/materialSettings' // 产品分类
export default {
  components: { FormItem },
  name: 'TableForm-product',
  data() {
    return {
      selectedList: [],
      JNPFColTableData: {
        data: this.value
      },
      customStyleData: {},
      tableVisible: true,
      getProductList, // 产品选择弹出框树状列表请求api
      ProductMethodArr: [
        { label: "物料分类", classAttribute: "material", method: getcategoryTree, requestObj: { classAttribute: "material" } },
        { label: "其他分类", classAttribute: "other", method: getcategoryTree, requestObj: { classAttribute: "other" } }
      ], // 产品选择弹出框树状列表
      ProductListRequestObj: {
        classAttribute: "",
        classAttributeList: ["raw_material", "accessories", "semi_finished", "finish_product", "other",],
        productCategoryId: "",
        code: "",
        name: "",
        orderItems: [{
          "asc": false,
          "column": ""
        }, {
          "asc": false,
          "column": "create_time"
        }],
        productStatus: "enable",
        pageNum: 1,
        pageSize: 20,
        queryType: 3,
        hideStockZero: true,
        userSelfWarehouse: true
      }, // 产品选择弹出框列表请求参数
      ProductTableItems: [
        { prop: 'code', label: '产品编码', fixed: 'left' },
        { prop: 'name', label: '产品名称', fixed: 'left' },
        { prop: 'drawingNo', label: '图号' },
        { prop: 'spec', label: '规格型号' },
        { prop: 'classAttributeText', label: '产品分类' },
        { prop: 'routingName', label: '工艺路线名称', minWidth: 140 },
        { prop: 'processName', label: '工序名称' },
        { prop: 'availableQuantity', label: '当前可用库存', minWidth: 140 },
        { prop: 'mainUnit', label: '单位' }
      ], // 产品选择弹出框表单展示字段
      ProductTableSearchList: [
        { prop: "code", label: "产品编码", type: 'input' },
        { prop: "name", label: "产品名称", type: 'input' },
        { prop: "drawingNo", label: "产品图号", type: 'input' }
      ], // 产品选择弹出框搜索条件
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
    customStyle: {
      type: Boolean,
      default: false
    }
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
      return true
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
    this.switchStyle('onresize')
  },
  beforeDestroy() {
    window.onresize = null
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (row.availableQuantity * 1 + row.occupancyQuantity * 1 < row.num * 1) {
        return 'warning-row';
      }
      return '';
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
      if (!scope.row.num || scope.row.num == '0') {
        this.$message.error("当前行数量(主)不能为0")
      } else if (!scope.row.deputyNum || scope.row.deputyNum == '0') {
        this.$message.error("当前行数量(副)不能为0")
      } else this.$emit('openSide', scope)
    },
    openSeleceProductDialog() {
      this.$refs['ComSelect-page'].openDialog()
    },
    isRequire(data) {
      return data.hasOwnProperty('itemRules') && data.itemRules.some(item => item.required === true)
    },
    addth(selectedIds, selectedList) {
      selectedList.forEach(item => {
        item.all.productId = item.id
        item.all.productName = item.name
      })
      let list = selectedList.map(item => item.all)
      this.$emit('addth', list)
      // this.calcHeight()
    },
    deleteth(scope) {
      this.$emit('deleteth', scope)
      // this.calcHeight()
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
      this.selectedList = []  // 清空选中的行的数据
      this.$emit('input', [...tempData]);
    },
    handleSelectionChange(data) {
      this.selectedList = data
    },
    async switchStyle(type) {
      await this.$nextTick();
      const mainRegion = this.$parent.$refs.main // 可用区域
      if (JSON.stringify(this.customStyleData) === "{}" || type === 'onresize') {
        if (type !== 'onresize') this.$message.success('适配模式')
        // 获取可用区域的高度
        const mainHeight = mainRegion.clientHeight;
        // 其他同级组件占用高度
        let bortherHeight = 0
        const bortherItems = mainRegion.querySelectorAll('.JNPF-common-layout-main > *')
        bortherItems.forEach(item => {
          if (item.className !== 'TableForm_main') bortherHeight += item.clientHeight
        })
        // 获取TableForm头部操作栏
        const TableFormTitle = mainRegion.querySelector('.TableForm_title')
        const TableFormTitleHeight = TableFormTitle ? TableFormTitle.clientHeight : 0
        // 设置表单容器的高度
        mainRegion.querySelector('.tableContainer').style.height = TableFormTitle ? 'calc(100% - 36px)' : '100%'

        // 表格高度 = 区域总高度 - 同级元素高度 - TableForm标题栏高度 - 安全高度
        let maxHeight = mainHeight - bortherHeight - TableFormTitleHeight - 30

        // 计算高度最低500
        maxHeight = maxHeight > 500 ? maxHeight : 500

        this.customStyleData = {
          height: 10000,
          maxHeight
        }

        // 附带防抖的监听适配模式屏幕缩放
        window.onresize = () => {
          clearTimeout(this.timeout)
          this.timeout = setTimeout(() => {
            this.switchStyle('onresize')
          }, 100);
        };
      } else {
        if (type !== 'notip') this.$message.success('全展模式')
        window.onresize = null
        this.customStyleData = {}
        mainRegion.querySelector('.tableContainer').style.height = '100%' // 设置表单容器的高度
        // 重新加载表格
        this.tableVisible = false
        this.$nextTick(() => { this.tableVisible = true })
      }
    },
    calcHeight() {
      this.$nextTick(() => {
        let tBodyList = document.querySelectorAll('.TableForm.table')
        tBodyList.forEach(item => {
          item.style.height = 'auto'
          item.querySelector('.el-table__body-wrapper').style.height = 'auto'
        })
      });
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

::v-deep tr.el-table__row.warning-row {
  background-color: oldlace !important;
}
</style>