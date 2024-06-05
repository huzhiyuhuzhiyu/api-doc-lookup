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
<!-- tableItems 渲染的列表字段 
  完整参数：
  prop 绑定变量 - 必传
  label 显示内容 - 必传
  value 默认值 - 必传
  type 元素类型（input输入框、select下拉选、multiple复选项、textarea文本域、date单日期、date_interval日期区间、view文本、custom自定义） - 必传
  options 选项（type为select和multiple时必传）
  customComponent 自定义组件（type为custom时必传，其方法在created生命周期内设置）
  placeholder 占位符
  maxlength 最大输入长度
  render 是否正常渲染（布尔值 默认true）
  readOnly 非新建状态是否不允许编辑（布尔值 默认false）
  itemDisabled 是否始终不允许编辑（布尔值 默认false）
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
  引用方式：import TableFormProduct from '@/components/no_mount/TableForm-product/index' // 附带产品多选的表格表单组件
 -->

<template>
  <div class="TableForm_main">

    <div v-if="openMode !== '只读' && planType !== 'order_plan'" class="TableForm_title">
      <el-button type="text" class="topButton" icon="el-icon-plus" @click="openSeleceProductDialog">选择产品</el-button>|
      <el-button type="text" class="topButton" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>|
    </div>

    <el-form :model="JNPFColTableData" ref="main" class="tableContainer">
      <el-table class="TableForm table" :data="JNPFColTableData.data" v-bind="customStyleData" hasNO fixedNO hasC
        @selection-change="handleSelectionChange" v-if="tableVisible" border>
        <el-table-column type="selection" width="60" :fixed="hasFixed ? 'left' : false" align="center"
          v-if="openMode !== '只读' && planType !== 'order_plan'" key="1" />
        <el-table-column type="index" width="60" label="序号" align="center" :fixed="hasFixed ? 'left' : false" />

        <template v-for="item in tableItems">
          <el-table-column v-if="item.hasOwnProperty('render') ? item.render : true" :key="item.prop" :prop="item.prop"
            :label="item.label" :width="item.width" :min-width="item.minWidth || 100" :fixed="item.fixed"
            show-overflow-tooltip>
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

        <el-table-column label="操作" width="90" :fixed="hasFixed ? 'right' : false" v-if="openMode !== '只读'">
          <template slot-scope="scope">
            <el-button type="text" size="mini" class="JNPF-table-delBtn" :disabled="openMode === '只读'"
              @click="deleteth(scope)">
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
      tableVisible: true,
      customStyleData: {},
      selectedList: [],
      JNPFColTableData: {
        data: this.value
      },
      getProductList, // 产品选择弹出框树状列表请求api
      ProductMethodArr: [
        { label: "物料分类", classAttribute: "material", method: getcategoryTree, requestObj: { classAttribute: "material" } },
      ], // 产品选择弹出框树状列表
      ProductListRequestObj: {
        classAttribute: "",
        classAttributeList: ["raw_material", "accessories", "semi_finished", "finish_product"],
        productCategoryId: "",
        queryType: 1,
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
      }, // 产品选择弹出框列表请求参数
      ProductTableItems: [
        { prop: 'code', label: '产品编码', fixed: 'left' },
        { prop: 'name', label: '产品名称', fixed: 'left' },
        { prop: 'drawingNo', label: '图号' },
        { prop: 'spec', label: '规格型号' },
      ], // 产品选择弹出框表单展示字段
      ProductTableSearchList: [
        { prop: "code", label: "产品编码", type: 'input' },
        { prop: "name", label: "产品名称", type: 'input' },
        { prop: "drawingNo", label: "产品图号", type: 'input' }
      ], // 产品选择弹出框搜索条件
    }
  },
  props: {
    planType: {
      type: String,
      default: ''
    },
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
    },
    planType: {
      handler: function (newValue) {
        console.log(333, newValue);
      },
      // deep: true
    },
    openMode: {
      handler: function (newValue) {
        console.log(222, newValue);
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
            this.switchStyle('onresize')
    console.log("1111", this.planType, this.openMode);
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
          if (item[prop] === undefined || item[prop] === null || item[prop] === "") {
            item[prop] = value;
          }
        })
      })
      this.$emit('input', [...formDataList]);
      // this.calcHeight()
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
    // calcHeight() {
    //   this.$nextTick(() => {
    //     let tBodyList = document.querySelectorAll('.TableForm.table')
    //     tBodyList.forEach(item => {
    //       item.style.height = 'auto'
    //       item.querySelector('.el-table__body-wrapper').style.height = 'auto'
    //     })
    //   });
    // }
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
          console.log("item",item);
          if (item.className !== 'TableForm_main') bortherHeight += item.clientHeight // 计算除TableForm之外的所有组件的高
        })
        const TableFormTitle = mainRegion.querySelector('.TableForm_title') // 获取TableForm头部操作栏
        const TableFormTitleHeight = TableFormTitle ? TableFormTitle.clientHeight : 0
        mainRegion.querySelector('.tableContainer').style.height = TableFormTitle ? 'calc(100% - 36px)' : '100%' // 设置表单容器的高度

        // 表格高度 = 区域总高度 - 同级元素高度 - TableForm头部操作栏高度 - 安全高度（一般写67，如果有tabs加49，如果有合计行加40）
        let maxHeight = mainHeight - bortherHeight - TableFormTitleHeight - (67 + 49+10)

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
  }
}
</script>
<style  scoped>
::v-deep .el-form-item--small.el-form-item {
  margin-bottom: 0px !important;
  overflow: hidden;
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