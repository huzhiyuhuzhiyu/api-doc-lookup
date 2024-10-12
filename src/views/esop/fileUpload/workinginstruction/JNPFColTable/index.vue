<!--  参数  -->
<!-- value 绑定的对象(使用v-model绑定) 示例：[] -->
<!-- tableItems 渲染的列表字段 
  完整参数：
  prop 绑定变量 - 必传
  label 显示内容 - 必传
  value 默认值 - 必传
  type 元素类型（input输入框、select下拉选、multiple复选项、textarea文本域、date单日期、date_interval日期区间、view文本、custom自定义） - 必传
  options 选项（type为select和multiple时必传）
  customComponent 自定义组件（type为custom时必传，其方法在created生命周期内设置）
  placeholder 占位符
  hideLookP 查看模式是否隐藏占位符（布尔值 默认true）
  maxlength 最大输入长度
  render 是否正常渲染（布尔值 默认true）
  readOnly 非新建状态是否不允许编辑（布尔值 默认false）
  itemDisabled 是否始终不允许编辑（布尔值 默认false）
  itemRules 校验规则
  clearable 是否在右侧展示清除按钮（布尔值 默认true）
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
<template>
  <el-form :model="JNPFColTableData" ref="main">
    <div class="table-actions" @click="addth" v-if="realOpenMode != '只读' && addMethod">
      <el-button size="mini" type="primary" icon="el-icon-plus">添加</el-button>
    </div>
    <el-table :data="JNPFColTableData.data" :key="JNPFColTableData.data.length" border @selection-change="handeleProductInfoData" >
      <el-table-column type="selection" width="60" :fixed="fixedSelect" v-if="hasC" align="center"
        :selectable="checkSelectable" />
      <el-table-column type="index" width="60" label="序号" align="center" fixed="left" />

      <template v-for="item in tableItems">
        <el-table-column v-if="item.hasOwnProperty('render') ? item.render : true" :key="item.prop" :prop="item.prop"
          :label="item.label" :width="item.width" :min-width="item.minWidth" :fixed="item.fixed">
          <template slot="header" v-if="isRequire(item)">
            <span class="required">*</span>{{ item.label }}
          </template>
          <template slot-scope="scope">
            <FormItem :item="item" :lineItem="JNPFColTableData.data[scope.$index]"
             
              :value="JNPFColTableData.data[scope.$index][scope.column.property]"
              @input="handleInput($event, scope.column.property, scope.$index)" :ref="scope.column.property"
              :openMode="realOpenMode" :scope="scope" :paramsObj="{ scope }" />
            <div style="color:#aaa" v-if="JNPFColTableData.data.length === 0"
              :style="{ 'textAlign': 'center', 'padding': '10%' }">
              暂无数据
            </div>
          </template>
        </el-table-column>
      </template>

      <el-table-column label="操作" width="90" v-if="realOpenMode !== '只读' && delMethod" fixed="right">
        <template slot-scope="scope">
          <el-button @click="deleteth(scope)" type="text" style="color:rgb(245,108,108)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>
   
  </el-form>
</template>

<script>
import FormItem from "./item.vue"
export default {
  components: { FormItem },
  name: 'JNPF-col-table',
  data() {
    return {
      JNPFColTableData: {
        data: this.value
      }
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
    hasC: {
      type: Boolean,
      default: false,
    },
    fixedSelect: {
      type: Boolean,
      default: true,
    },
    openMode: {
      type: String,
      default: '新建'
    },
    checkSelectable: {
      type: Function,
      default: () => (row) => {
        if (row.top) return false
        return true
      }
    },
    btnType: {
      type: String
    }
  },
  watch: {
    value(newValue) {
      this.JNPFColTableData.data = newValue;
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
  methods: {
    handleInput(val, key, index) {
      let tempData = [...this.value]
      tempData[index][key] = val
      this.$emit('input', [...tempData]);
    },
    setDefaultValue() {
      // this.$set(this.JNPFColTableData, 'data', this.value)
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
    },
    isRequire(data) {
      return (data.hasOwnProperty('itemRules') && data.itemRules.some(item => item.required === true)) && this.JNPFColTableData.data.length
    },
    addth() {
      this.$emit('addth')
    },
    deleteth(scope) {
      this.$emit('deleteth', scope)
    },
    handeleProductInfoData(val){
      console.log("val");
      this.$emit('select', val)
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
.table-actions{
    border: #ebeef5 1px dashed;
    text-align: left;
    margin-bottom: 10px;
    margin-top:0;
}
</style>