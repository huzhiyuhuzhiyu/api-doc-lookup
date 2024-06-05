<template>
  <div>

    <div v-if="openMode !== '只读'">
      <el-button type="text" class="topButton" icon="el-icon-plus" @click="openSeleceProductDialog">选择产品</el-button>|
      <el-button type="text" class="topButton" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>|
    </div>

    <el-form :model="JNPFColTableData" ref="main">
      <el-table :data="JNPFColTableData.data" hasNO fixedNO hasC
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="60" :fixed="hasFixed ? 'left' : false" align="center"
          v-if="openMode !== '只读'" key="1" />
        <el-table-column type="index" width="60" label="序号" align="center" :fixed="hasFixed ? 'left' : false" />

        <template v-for="(item, index) in tableItems">
          <el-table-column v-if="item.hasOwnProperty('render') ? item.render : true" :key="item.prop + '_' + index"
            :prop="item.prop" :label="item.label" :width="item.width" :min-width="item.minWidth" :fixed="item.fixed"
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
            <el-button type="text" class="JNPF-table-delBtn" :disabled="openMode === '只读'" @click="deleteth(scope)">
              {{ $t(`common.delBtn`) }}
            </el-button>
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
  name: 'SelectDialog-product',
  data() {
    return {
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
        classAttributeList: ["raw_material", "semi_finished", "finish_product", "accessories"],
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
        showStockFlag: true,
        showWarehouseFlag: true,
        selfWarehouseIds: [""]
      }, // 产品选择弹出框列表请求参数
      ProductTableItems: [
        { prop: 'code', label: '产品编码', fixed: 'left' },
        { prop: 'name', label: '产品名称', fixed: 'left' },
        { prop: 'drawingNo', label: '图号' },
        { prop: 'spec', label: '规格型号' },
        { prop: 'classAttributeText', label: '产品分类' },
        { prop: 'availableQuantity', label: '当前库存' },
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
    // 选择的出库仓库id
    selfWarehouseId: {
      default: ''
    }
  },
  watch: {
    value: {
      handler: function (newValue) {
        this.JNPFColTableData.data = newValue;
      },
      // deep: true
    },
    selfWarehouseId(val) {
      this.ProductListRequestObj.selfWarehouseIds = [val]
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

    openSeleceProductDialog() {
      if (!this.selfWarehouseId) {
        this.$message.warning("请先选择调出仓库")
        return
      }
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