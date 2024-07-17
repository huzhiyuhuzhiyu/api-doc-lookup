<!--  参数  -->
<!-- tabContent 渲染的表单元素
  完整参数：
  prop 绑定变量 - 必传
  label 显示内容 - 必传
  value 默认值 - 必传
  type 元素类型（input输入框、select下拉选、multiple复选项、textarea文本域、date单日期、date_interval日期区间、custom自定义） - 必传
  options 选项（type为select和multiple时必传）
  customComponent 自定义组件（type为custom时必传，其方法在created生命周期内设置）
  placeholder 占位符
  hideLookP 查看模式是否隐藏占位符（布尔值 默认true）
  maxlength 最大输入长度
  render 是否正常渲染（布尔值 默认true）
  itemReadOnly 非新建状态是否不允许编辑（布尔值 默认false）
  itemDisabled 是否始终不允许编辑（布尔值 默认false）
  itemRules 校验规则
  clearable 是否在右侧展示清除按钮（布尔值 默认true）
  sm 所占响应尺寸（默认8）
  xs 全部响应尺寸（默认24）
  input 输入事件
  change 更改事件

  使用示例：[{ prop: "qty", label: "数量", value: "1", type: "input", itemRules: [{ required: true, trigger: "blur" }], input: () => {} }
 -->
<!-- value 绑定的对象(使用v-model绑定) 示例：{} -->
<!-- openMode 表单打开方式（新建、编辑、只读） -->
<template>
  <el-form label-position="top" :model="value" v-bind="tabContent" ref="main">
    <el-row :gutter="30" class="custom-row">

      <FormItem v-for="item in tabContent" :key="item.prop+item.label+item.content" :item="item" v-bind="item" :value="value[item.prop]"
        @input="handleInput($event, item.prop)" :ref="item.prop" :openMode="realOpenMode" />

      <div style="color:#aaa" v-if="tabContent.length === 0" :style="{ 'textAlign': 'center', 'padding': '10%' }">
        暂无数据
      </div>

    </el-row>
  </el-form>
</template>

<script>
import FormItem from "./item.vue"
export default {
  components: { FormItem },
  name: 'JNPF-col',
  data() {
    return {}
  },
  props: {
    value: {
      type: Object,
      required: true
    },
    tabContent: {
      type: Array,
      required: true
    },
    openMode: {
      type: String,
      default: '新建'
    },
    btnType: {
      type: String
    }
  },
  computed: {
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
    handleInput(val, key) {
      this.$emit('input', { ...this.value, [key]: val });
    },
    async setDefaultValue() {
      const formData = { ...this.value };
      this.tabContent.forEach(item => {
        const { prop, value } = item;
        if ((formData[prop] === undefined || formData[prop] === null || formData[prop] === '') && value !== undefined) {
          formData[prop] = value;
        }
      });
      this.$emit('input', { ...formData });
    }
  }
}
</script>