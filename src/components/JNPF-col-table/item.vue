<template>
  <div>
    <template v-if="item.type == 'view' || item.jnpfKey === 'JNPFTableText'">
      <div class="viewData">
        <span>{{ scope.row[item.prop] }}</span>
      </div>
    </template>
    <template v-else>
      <el-form-item :prop="'data.' + scope.$index + '.' + item.prop" :rules='Rules'>
        <!-- 输入框 -->
        <el-input v-if="item.type === 'input' || item.jnpfKey === 'comInput' || item.jnpfKey === 'JNPFTableInput'"
          v-bind="$attrs" v-on="$listeners" :placeholder="Placeholder" style="width:100%" :disabled="item.disabled ||readOnly" :readonly="item.readonly"
          :maxlength="item.maxlength || 20" :clearable="item.hasOwnProperty('clearable') ? item.clearable : true"
          @input="item.hasOwnProperty('input') ? item.input($event, scope) : ''"
          @change="item.hasOwnProperty('change') ? item.change($event, scope) : ''"
          @keyup.enter.native="item.hasOwnProperty('keyup') ? item.keyup($event, scope, options) : ''" :key="1">
          <template v-if="item.itemSlot" :slot="item.itemSlot.position">
            <div v-if="!item.itemSlot.click"> {{ item.itemSlot.content }} </div>
            <el-button v-else @click="item.itemSlot.click"> {{ item.itemSlot.content }} </el-button>
          </template>
        </el-input>

        <!-- 下拉框 -->
        <!-- 远程搜索改为高阶函数 可增加自定义传参 -->
        <el-select v-else-if="item.type === 'select'" v-bind="$attrs" v-on="$listeners" :placeholder="Placeholder"
          style="width:100%" :disabled="item.disabled" :readonly="item.readonly" :clearable="item.hasOwnProperty('clearable') ? item.clearable : true"
          :filterable="item.filterable || false" reserve-keyword
          :remote-method="(val) => item.remoteMethod(val, item) || (() => { })" :remote="item.remote || false"
          @input="item.hasOwnProperty('input') ? item.input($event, scope) : ''"
          @change="item.hasOwnProperty('change') ? item.change($event, scope) : ''">
          <el-option v-for="(o, index) in rowOptions" :key="o.label + index" :label="o.label" :value="o.value"
            :disabled="o.disabled">
          </el-option>
        </el-select>

        <!-- 文本域 -->
        <el-input type="textarea" v-else-if="item.type === 'textarea' || item.jnpfKey === 'textarea'" v-bind="$attrs"
          v-on="$listeners" :placeholder="Placeholder" style="width:100%" :maxlength="item.maxlength || 200"
          :disabled="item.disabled" :readonly="item.readonly" :clearable="item.hasOwnProperty('clearable') ? item.clearable : true"
          @input="item.hasOwnProperty('input') ? item.input($event, scope) : ''"
          @change="item.hasOwnProperty('change') ? item.change($event, scope) : ''" />

        <!-- 多选框 -->
        <el-select v-else-if="item.type === 'multiple'" multiple collapse-tags v-bind="$attrs" v-on="$listeners"
          :placeholder="Placeholder" style="width:100%" :disabled="item.disabled" :readonly="item.readonly"
          @input="item.hasOwnProperty('input') ? item.input($event, scope) : ''"
          @change="item.hasOwnProperty('change') ? item.change($event, scope) : ''">
          <el-option v-for="o in rowOptions" :key="o.label" :label="o.label" :value="o.value" :disabled="o.disabled">
          </el-option>
        </el-select>

        <!-- 自定义表单元素 -->
        <component v-else-if="item.type === 'custom'" :is="item.customComponent" v-bind="{ ...item, ...$attrs }"
          v-on="$listeners" :placeholder="Placeholder" style="width:100%" auth
          @change="(val, data, paramsObj) => { item.change && item.change(val, data, paramsObj); $emit('change', val, data, paramsObj); }"
          :disabled="item.disabled" :readonly="item.readonly" :isdisabled="readOnly" />

        <!-- 单个日期选择器 -->
        <el-date-picker v-else-if="item.type === 'date'" type="date" value-format="yyyy-MM-dd" style="width: 100%"
          v-bind="$attrs" :placeholder="Placeholder" v-on="$listeners" :disabled="item.disabled" :readonly="item.readonly"
          :clearable="item.hasOwnProperty('clearable') ? item.clearable : true"
          @input="item.hasOwnProperty('input') ? item.input($event, scope) : ''"
          @change="item.hasOwnProperty('change') ? item.change($event, scope) : ''" />

        <!-- 日期区间选择器 -->
        <el-date-picker v-else-if="item.type === 'date_interval'" type="daterange" value-format="yyyy-MM-dd"
          style="width: 100%" v-bind="$attrs" :start-placeholder="item.startPlaceholder || '请选择开始日期'"
          :end-placeholder="item.endPlaceholder || '请选择结束日期'" v-on="$listeners" :picker-options="global.timePickerOptions"
          :disabled="item.disabled" :readonly="item.readonly" :clearable="item.hasOwnProperty('clearable') ? item.clearable : true"
          @input="item.hasOwnProperty('input') ? item.input($event, scope) : ''"
          @change="item.hasOwnProperty('change') ? item.change($event, scope) : ''" />

        <!-- 时间选择器 -->
        <!-- <el-time-picker v-else-if="item.type === 'time'" :format="item.valueFormat" v-bind="$attrs" range-separator="至"
        start-placeholder="开始时间" end-placeholder="结束时间" v-on="$listeners"></el-time-picker> -->


        <!-- 复选框 -->
        <!-- <el-checkbox v-else-if="item.type === 'switch' && item.appearance === 'checkbox'" v-bind="$attrs"
        v-on="$listeners"></el-checkbox> -->

        <!-- 开关 -->
        <!-- <el-switch v-else-if="item.type === 'switch'" v-bind="$attrs" v-on="$listeners"></el-switch> -->

        <!-- 评分 -->
        <!-- <el-rate v-else-if="item.type === 'rate'" v-bind="$attrs" :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
        text-color="#ff9900" v-on="$listeners"></el-rate> -->

        <!-- 颜色选择器 -->
        <!-- <el-color-picker v-else-if="item.type === 'color'" v-bind="$attrs" :color-format="item.format"
        v-on="$listeners"></el-color-picker> -->

        <!-- 滑块 -->
        <!-- <el-slider v-else-if="item.type === 'slider'" v-bind="$attrs" :range="item.isRange" v-on="$listeners"></el-slider> -->

        <!-- <el-radio-group
      v-else-if="item.type==='radio'"
      v-bind="$attrs"
      v-on="$listeners"
    >

       <el-checkbox-group
      v-else-if="item.type==='checkbox'"
      v-bind="$attrs"
      v-on="$listeners"
    ></el-checkbox-group> -->

        <!-- <el-cascader
      v-else-if="item.type==='cascader'"
      v-bind="$attrs"
      :options="item.options||require('element-china-area-data')[item.areaShortcut]||ajaxOptions"
      :clearable="true"
      v-on="$listeners"
    ></el-cascader> -->

        <span v-else>未知控件类型：{{ item.type || "" }}</span>
      </el-form-item>
    </template>
  </div>
</template>


<script>

export default {
  data() {
    return {
      options: []
    }
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
    openMode: {
      type: String,
      default: "新建",
    },
    scope: {
      type: Object,
      required: true
    },
    lineData: {
      type: Array,
    }
  },
  created() {
     let obj = this.lineData.find(item=>item.prop === 'taxRate')
     this.options = obj.options
  },
  mounted() {
    // console.log(this.item)
    // console.log(this.scope)
    if (this.item.prop === 'taxRate') {
      // 获取 item2 中的 options
      this.options = this.item.options;
    } else {
      // console.log('item2 的 prop 与 item1 的 taxRate 不匹配');
    }
  },
  computed: {
    Placeholder() {
      const { item: { label, type, placeholder, hideLookP } } = this;
      if (hideLookP !== false && this.openMode === '只读' && this.readOnly) return ''
      if (placeholder) return placeholder;
      else if (type === "view") return placeholder || ""

      let setPlaceholder = ""
      if (type === 'input' || type === 'textarea') { setPlaceholder = '请输入' }
      else if (type === 'select' || type === 'date' || type === 'date_interval') { setPlaceholder = '请选择' }
      else { setPlaceholder = '请选择' }
      return setPlaceholder + label;
    },
    Rules() {
      const { item: { itemRules, label, type } } = this;
      if (itemRules === undefined) return undefined;

      const R = [];
      itemRules.forEach(rule => {
        if (!rule.message && !rule.validator) { rule.message = this.Placeholder }
        R.push(rule);
      });
      return R;
    },
    readOnly() {
      let readOnly = this.item.hasOwnProperty('itemDisabled') ? this.item.itemDisabled : this.openMode === '新建' ? false : this.item.hasOwnProperty('readOnly') ? this.item.readOnly : this.openMode !== '编辑'
      if (typeof this.item.itemDisabled === 'function') {
        let getFunction = (e, property) => {
          if (property in e) return e[property]
          else if (e.$parent) return getFunction(e.$parent, property)
          else return null
        }
        let itemScope = getFunction(this, "scope")
        readOnly = this.item.itemDisabled(itemScope.$index)
      }
      return readOnly
    },
    rowOptions() {
      let options = this.item.options ? Array.isArray(this.item.options) ? this.item.options : this.item.options(this.scope) : []
      return options
    },
  }
};
</script>
<style scoped>
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}

.viewData {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 32px;
}
</style>