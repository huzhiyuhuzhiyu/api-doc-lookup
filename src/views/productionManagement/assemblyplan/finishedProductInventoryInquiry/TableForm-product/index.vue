<!--  参数  -->
<!-- value 绑定的数组 - 必传 示例：[] -->
<!-- input 内容改变的回调 - 必传 示例：() => {
  if (Array.isArray(dataOrIndex)) {
    this.linesList = JSON.parse(JSON.stringify(dataOrIndex))
  } else if (prop) {
    this.linesList[dataOrIndex][prop] = value
  }
  ！说明：组件初次渲染向父组件传递一个完整的数组，其他会根据使用者所改变的prop和其索引对绑定的数组进行单独更新
} -->
<!-- hasToolbar 是否展示工具栏（布尔值 默认true） -->
<!-- hasActionbar 是否展示操作栏（布尔值 默认true） -->
<!-- tableItems 渲染的列表字段
  完整参数：
  prop 绑定变量 - 必传
  label 显示内容 - 必传
  value 默认值 - 必传
  type 元素类型（input输入框、select下拉选、multiple复选项、textarea文本域、date单日期、date_interval日期区间、view文本、custom自定义） - 必传
  options 下拉选项（Array || Function）
  customComponent 自定义组件（type为custom时必传，其方法在created生命周期内设置）
  placeholder 占位符
  maxlength 最大输入长度
  render 是否正常渲染（布尔值 默认true）
  readOnly 非新建状态是否不允许编辑（布尔值 默认false）
  itemDisabled 是否始终不允许编辑 （默认false；true是 / false否 / function ）
  itemRules 校验规则
  width 占用宽度
  minWidth 最小占用宽度
  fixed 固定（left左固定、right右固定）
  input 输入事件
  change 更改事件

  使用示例：[{ prop: "qty", label: "数量", value: "1", type: "input", itemRules: [{ required: true, trigger: "blur" }], input: () => {} }
 -->
<!-- openMode 表单打开方式（新建、编辑、只读） -->

<!--  方法  -->
<!-- addth 新增行 -->
<!-- deleteth 删除行 -->

<!--
  引用方式：import TableFormProduct from '@/components/no_mount/TableForm-product/index.vue' // 附带产品多选的表格表单组件
 -->

<template>
  <div class="TableForm_main">
    <div v-if="realOpenMode !== '只读' && hasToolbar" class="TableForm_title">
      <el-button type="text" class="topButton" icon="el-icon-plus" @click="openSeleceProductDialog">选择产品</el-button>|
      <el-button type="text" class="topButton" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>|
    </div>

    <el-form :model="JNPFColTableData" ref="main" class="tableContainer">
      <el-table class="TableForm table" :data="JNPFColTableData.data" v-bind="customStyleData" hasNO fixedNO hasC
        @selection-change="handleSelectionChange" border v-if="tableVisible">
        <el-table-column type="selection" width="60" :fixed="fixedC ? 'left' : false" align="center"
          v-if="realOpenMode !== '只读' && hasToolbar" key="no" />
        <el-table-column type="index" width="60" label="序号" align="center" :fixed="fixedNO ? 'left' : false"
          key="checkBox" />

        <template v-for="item in tableItems">
          <el-table-column v-if="item.hasOwnProperty('render') ? item.render : true" :key="item.prop" :prop="item.prop"
            :label="item.label" :width="item.width" :min-width="item.minWidth || 100" :fixed="item.fixed"
            :show-overflow-tooltip="item.type === 'view'">
            <template slot="header" v-if="isRequire(item)">
              <span class="required">*</span>{{ item.label }}
            </template>
            <template slot-scope="scope">
              <FormItem :item="item" :lineItem="JNPFColTableData.data[scope.$index]"
                :value="JNPFColTableData.data[scope.$index][scope.column.property]"
                @input="handleInput($event, scope.column.property, scope.$index)" :ref="scope.column.property"
                :openMode="realOpenMode" :scope="scope" :paramsObj="{ scope }" />
            </template>
          </el-table-column>
        </template>

        <el-table-column label="操作" width="90" :fixed="fixedA ? 'right' : false"
          v-if="realOpenMode !== '只读' && hasActionbar" key="actionBar">
          <template slot-scope="scope">
            <el-button type="text" class="JNPF-table-delBtn" :disabled="realOpenMode === '只读'" @click="deleteth(scope)">
              {{ $t(`common.delBtn`) }}
            </el-button>
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

    <ComSelect-page ref="ComSelect-page" @change="addth" :tableItems="ProductTableItems" dialogTitle="选择产品"
      treeTitle="物料分类" :methodArr="ProductMethodArr" :listMethod="inventoryWarehouseList"
      :listRequestObj="ProductListRequestObj" :searchList="ProductTableSearchList" :elementShow="false" multiple />
  </div>
</template>

<script>
import FormItem from "@/components/JNPF-col-table/item"
import { getcategoryTree } from '@/api/basicData/materialSettings' // 产品分类
import {
  getProductList,
} from '@/api/masterDataManagement/productManage'
import { inventoryWarehouseList } from '@/api/warehouseManagement/inventory'
export default {
  components: { FormItem },
  name: 'TableForm-product',
  data() {
    return {
      selectedList: [],
      JNPFColTableData: {
        data: this.value
      },
      tableVisible: true,
      customStyleData: {},
      inventoryWarehouseList, // 产品选择弹出框树状列表请求api
      ProductMethodArr: { method: getcategoryTree, requestObj: { classAttribute: "finish_product" } }, // 产品选择弹出框树状列表
      ProductListRequestObj: {
        // classAttributeList: ["finish_product"],
        // productCategoryId: "",
        // code: "",
        // name: "",
        // orderItems: [{
        //   "asc": false,
        //   "column": ""
        // }, {
        //   "asc": false,
        //   "column": "create_time"
        // }],
        // productStatus: "enable",
        // pageNum: 1,
        // pageSize: 20,
        warehouseName: '',
        pageNum: 1,
        pageSize: 20,
        productCode: '',
        projectId:"",
        orderItems: [{
          "asc": false,
          "column": ""
        }, ],
        productDrawingNo: '',
        totalInventoryFlag: true,
        scrapFlag: false,
        virtuallyFlag: false,
        "superQuery": { "matchLogic": "AND", "condition": [] },
        "classAttribute": "",
        "inventoryFlag": 1,
        "classAttributeList": ["finish_product"]
      }, // 产品选择弹出框列表请求参数
      ProductTableItems: [
        { prop: 'productCode', label: '产品编码', fixed: 'left' },
        { prop: 'productName', label: '产品名称', fixed: 'left' },
        { prop: 'productDrawingNo', label: '品名规格' },
        { prop: 'pairingModeName', label: '配对方式' },
        { prop: 'mainUnit', label: '单位' },
        // { prop: 'spec', label: '规格型号' },
        { prop: 'inventoryQuantity', label: '可用客库存' }
      ], // 产品选择弹出框表单展示字段
      ProductTableSearchList: [
        { prop: "productCode", label: "产品编码", type: 'input' },
        { prop: "productName", label: "产品名称", type: 'input' },
        { prop: "productDrawingNo", label: "品名规格", type: 'input' }
      ], // 产品选择弹出框搜索条件
    }
  },
  props: {
    value: {
      type: Array,
      required: true
    },
    projectId: {
      type: String,
      default: ''
    },
    tableItems: {
      type: Array,
      required: true
    },
    openMode: {
      type: String,
      default: '新建'
    },
    btnType: {
      type: String
    },
    hasToolbar: {
      type: Boolean,
      default: true
    },
    hasActionbar: {
      type: Boolean,
      default: true
    },
    fixedNO: { // 序号固定
      type: Boolean,
      default: true
    },
    fixedC: { // 复选框固定
      type: Boolean,
      default: true
    },
    fixedA: { // 操作栏固定
      type: Boolean,
      default: true
    },
    customStyle: { // 允许切换表格样式
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
    addMethod() {
      return Boolean(this.$listeners.addth)
    },
    delMethod() {
      return Boolean(this.$listeners.deleteth)
    },
    realOpenMode() {
      if (this.btnType) {
        return this.btnType === 'look' ? '只读' : this.btnType === 'edit' ? '编辑' : '新建'
      } else {
        return this.openMode
      }
    }
  },
  mounted() {
    this.setDefaultValue();
  },
  beforeDestroy() {
    window.onresize = null
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
          if ((item[prop] === null || item[prop] === "" || item[prop] === undefined) && value !== undefined) {
            item[prop] = value;
          }
        })
      })
      this.$emit('input', [...formDataList]);
    },

    openSeleceProductDialog() {
      if (!this.projectId) return this.$message.error("请先选择主产品")
      this.ProductListRequestObj.projectId = this.projectId
      this.$refs['ComSelect-page'].openDialog()
    },
    isRequire(data) {
      return data.hasOwnProperty('itemRules') && data.itemRules.some(item => item.required === true)
    },
    addth(selectedIds, selectedList) {
        console.log("selectedList",selectedList);
        selectedList.forEach(item => {
        // item.all.productId = item.id
        // item.all.productName = item.name
      })
      let list = selectedList.map(item => item.all)
      this.$emit('addth', list)
    },
    deleteth(scope) {
      this.$emit('deleteth', scope)
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
      function getParentMain(_this) {
        if (!_this) return null
        if (_this.$refs.main) return _this.$refs.main
        return getParentMain(_this.$parent)
      }
      const mainRegion = getParentMain(this.$parent) // 表单页面区域
      if (JSON.stringify(this.customStyleData) === "{}" || type === 'onresize') {
        if (type !== 'onresize') this.$message.success('适配模式')
        const mainHeight = mainRegion.clientHeight;
        let bortherHeight = 0
        const bortherItems = mainRegion.querySelectorAll('.jcInfo > *') // 与TableForm同级的所有组件
        bortherItems.forEach(item => {
          if (item.className !== 'TableForm_main') bortherHeight += item.clientHeight // 计算除TableForm之外的所有组件的高
        })
        const TableFormTitle = mainRegion.querySelector('.TableForm_title') // 获取TableForm头部操作栏
        const TableFormTitleHeight = TableFormTitle ? TableFormTitle.clientHeight : 0
        mainRegion.querySelector('.tableContainer').style.height = TableFormTitle ? 'calc(100% - 36px)' : '100%' // 设置表单容器的高度

        // 表格高度 = 区域总高度 - 同级元素高度 - TableForm头部操作栏高度 - 安全高度（一般写67，如果有tabs加49，如果有合计行加40）
        let maxHeight = mainHeight - bortherHeight - TableFormTitleHeight - (67 + 49)

        // 计算高度最低500
        maxHeight = maxHeight > 500 ? maxHeight : 500

        this.customStyleData = {
          height: 10000,
          maxHeight
        }
        console.log(this.customStyleData);
        // 附带防抖的监听适配模式屏幕缩放
        window.onresize = () => {
          clearTimeout(this.timeout)
          this.timeout = setTimeout(() => {
            this.switchStyle('onresize')
          }, 100);
        };
      } else {
        this.$message.success('全展模式')
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
<style scoped>
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
