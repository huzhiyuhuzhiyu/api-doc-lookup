<template>
  <el-col :sm="item.sm ? item.sm : item.type === 'textarea' ? 24 : 8" :xs="24"
    v-if="item.hasOwnProperty('render') ? item.render : true">
    <el-form-item :rules="Rules" :label="item.label" :prop="item.prop">

      <!-- 输入框 -->
      <template v-if="item.type === 'input'">
        <el-input v-if="!item.remote" v-bind="$attrs" v-on="$listeners" :placeholder="Placeholder" :disabled="readOnly"
          :maxlength="item.maxlength || 20" :clearable="item.hasOwnProperty('clearable') ? item.clearable : true"
          @input="item.hasOwnProperty('input') ? item.input($event) : ''"
          @change="item.hasOwnProperty('change') ? item.change($event) : ''" :key="1">
          <template v-if="item.itemSlot" :slot="item.itemSlot.position">
            <div v-if="!item.itemSlot.click" v-bind="item.itemSlot"> {{ item.itemSlot.content }} </div>
            <el-button v-else @click="item.itemSlot.click($event, item)" v-bind="item.itemSlot">
              {{ item.itemSlot.content }} </el-button>
          </template>
        </el-input>

        <el-autocomplete v-else v-bind="$attrs" v-on="$listeners" :placeholder="Placeholder"
          :maxlength="item.maxlength || 20" :clearable="item.hasOwnProperty('clearable') ? item.clearable : true"
          @input="item.hasOwnProperty('input') ? item.input($event) : ''"
          @change="item.hasOwnProperty('change') ? item.change($event) : ''" :disabled="readOnly"
          :fetch-suggestions="item.remoteMethod || (() => { })" :trigger-on-focus="false"
          @select="item.hasOwnProperty('select') ? item.select($event) : ''" />
      </template>

      <!-- 下拉框 -->
      <el-select v-else-if="item.type === 'select'" v-bind="$attrs" v-on="$listeners" :placeholder="Placeholder"
        style="width:100%" :disabled="readOnly" :clearable="item.hasOwnProperty('clearable') ? item.clearable : true"
        :filterable="item.filterable || false" reserve-keyword :remote-method="item.remoteMethod || (() => { })"
        :remote="item.remote || false" @input="item.hasOwnProperty('input') ? item.input($event) : ''"
        @change="item.hasOwnProperty('change') ? item.change($event) : ''">
        <el-option v-for="(o, index) in rowOptions" :key="o.label + index" :label="o.label" :value="o.value"
          :disabled="o.disabled">
        </el-option>
      </el-select>

      <!-- 文本域 -->
      <el-input type="textarea" v-else-if="item.type === 'textarea'" v-bind="$attrs" v-on="$listeners"
        :placeholder="Placeholder" style="width:100%" :maxlength="item.maxlength || 200" :disabled="readOnly"
        :clearable="item.hasOwnProperty('clearable') ? item.clearable : true"
        @input="item.hasOwnProperty('input') ? item.input($event) : ''"
        @change="item.hasOwnProperty('change') ? item.change($event) : ''" />

      <!-- 多选框 -->
      <el-select v-else-if="item.type === 'multiple'" multiple collapse-tags v-bind="$attrs" v-on="$listeners"
        :placeholder="Placeholder" style="width:100%" :disabled="readOnly"
        @input="item.hasOwnProperty('input') ? item.input($event) : ''"
        @change="item.hasOwnProperty('change') ? item.change($event) : ''">
        <el-option v-for="o in rowOptions" :key="o.label" :label="o.label" :value="o.value" :disabled="o.disabled">
        </el-option>
      </el-select>

      <!-- 自定义表单元素 -->
      <component v-else-if="item.type === 'custom'" :is="item.customComponent" v-bind="{ ...item, ...$attrs }"
        v-on="$listeners" :placeholder="Placeholder" style="width:100%" auth
        @change="(val, data, paramsObj) => { item.change && item.change(val, data, paramsObj); $emit('change', val, data, paramsObj); }"
        :disabled="readOnly" :isdisabled="readOnly" />

      <!-- 单个日期选择器 -->
      <el-date-picker v-else-if="item.type === 'date'" type="date" value-format="yyyy-MM-dd" v-bind="$attrs"
        :placeholder="Placeholder" v-on="$listeners" :disabled="readOnly"
        :clearable="item.hasOwnProperty('clearable') ? item.clearable : true"
        @input="item.hasOwnProperty('input') ? item.input($event) : ''"
        @change="item.hasOwnProperty('change') ? item.change($event) : ''" />

      <!-- 日期区间选择器 -->
      <el-date-picker v-else-if="item.type === 'date_interval'" type="daterange" value-format="yyyy-MM-dd" v-bind="$attrs"
        :start-placeholder="item.startPlaceholder || '请选择开始日期'" :end-placeholder="item.endPlaceholder || '请选择结束日期'"
        v-on="$listeners" :picker-options="data.dataPickerOptions" :disabled="readOnly"
        :clearable="item.hasOwnProperty('clearable') ? item.clearable : true"
        @input="item.hasOwnProperty('input') ? item.input($event) : ''"
        @change="item.hasOwnProperty('change') ? item.change($event) : ''" />

      <!-- 时间选择器 -->
      <!-- <el-time-picker v-else-if="item.type === 'time2'" :format="item.valueFormat" v-bind="$attrs" range-separator="至"
        start-placeholder="开始时间" end-placeholder="结束时间" v-on="$listeners" /> -->

      <!-- 日期时间选择器 -->
      <el-date-picker v-else-if="item.type === 'dateTime'" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
        v-bind="$attrs" :placeholder="Placeholder" v-on="$listeners" :disabled="readOnly"
        :clearable="item.hasOwnProperty('clearable') ? item.clearable : true"
        @input="item.hasOwnProperty('input') ? item.input($event) : ''"
        @change="item.hasOwnProperty('change') ? item.change($event) : ''" />


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
      <component
        v-for="o in item.options||ajaxOptions"
        :is="item.button?'el-radio-button':'el-radio'"
        :key="o.value"
        :label="o.value"
        :disabled="o.disabled"
        :border="item.border"
      >{{ o.label }}</component>
    </el-radio-group> -->

      <!-- <el-checkbox-group
      v-else-if="item.type==='checkbox'"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <component
        v-for="o in item.options||ajaxOptions"
        :is="item.button?'el-checkbox-button':'el-checkbox'"
        :key="o.value"
        :disabled="o.disabled"
        :label="o.value"
        :border="item.border"
      >{{ o.label }}</component>
    </el-checkbox-group> -->

      <!-- <el-cascader
      v-else-if="item.type==='cascader'"
      v-bind="$attrs"
      :options="item.options||require('element-china-area-data')[item.areaShortcut]||ajaxOptions"
      :clearable="true"
      v-on="$listeners"
    ></el-cascader> -->

      <span v-else>未知控件类型：{{ item.type || "" }}</span>

    </el-form-item>
  </el-col>
</template>


<script>

export default {
  data() {
    return {}
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
  },
  computed: {
    Placeholder() {
      const { item: { label, type, placeholder, hideLookP } } = this;
      if (hideLookP !== false && this.openMode === '只读' && this.readOnly) return ''
      if (placeholder) return placeholder;

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
      let readOnly
      if (this.item.hasOwnProperty('itemDisabled')) {
        readOnly = this.item.itemDisabled
      } else {
        if (this.openMode === '新建') {
          readOnly = false
        } else {
          if (this.item.hasOwnProperty('readOnly')) {
            readOnly = this.item.readOnly
          } else if (this.item.hasOwnProperty('itemReadOnly')) {
            readOnly = this.item.itemReadOnly
          } else {
            readOnly = this.openMode !== '编辑'
          }
        }
      }
      return readOnly
    },
    rowOptions() {
      let options = this.item.options ? Array.isArray(this.item.options) ? this.item.options : this.item.options() : []
      return options
    },
  }
};
</script>
<style lang="scss" scoped>
::v-deep.el-col {
  .el-form-item {
    .el-form-item__content {
      .el-input {
        width: 100%;
      }

      .input-with-select .el-input-group__prepend {
        background-color: #fff;
      }

    }
  }
}</style>