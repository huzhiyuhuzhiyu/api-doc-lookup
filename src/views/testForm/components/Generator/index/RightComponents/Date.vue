<template>
  <el-row>
    <el-form-item label="控件标题">
      <el-input v-model="activeData.__config__.label" placeholder="请输入控件标题" />
    </el-form-item>
    <el-form-item label="占位提示">
      <el-input v-model="activeData.placeholder" placeholder="请输入占位提示" />
    </el-form-item>
    <el-form-item label="默认值">
      <el-date-picker v-model="activeData.__config__.defaultValue" :type="activeData.type"
        placeholder="选择默认值" :value-format="activeData['value-format']" :format="activeData.format">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="时间类型">
      <el-select v-model="activeData.type" placeholder="请选择时间类型" @change="dateTypeChange">
        <el-option v-for="(item, index) in dateOptions" :key="index" :label="item.label"
          :value="item.value" />
      </el-select>
    </el-form-item>
    <el-form-item label="时间格式">
      <el-input :value="activeData.format" placeholder="请输入时间格式" @input="setTimeValue($event)" />
    </el-form-item>
    <!-- <el-form-item label="显示标签">
      <el-switch v-model="activeData.__config__.showLabel" />
    </el-form-item> -->
    <el-form-item label="能否清空">
      <el-switch v-model="activeData.clearable" />
    </el-form-item>
    <el-form-item label="是否只读">
      <el-switch v-model="activeData.readonly" />
    </el-form-item>
    <el-form-item label="是否禁用">
      <el-switch v-model="activeData.disabled" />
    </el-form-item>
    <el-divider>校验规则</el-divider>
    <el-form-item label="是否必填">
      <el-switch v-model="activeData.__config__.required" />
    </el-form-item>
    <template v-if="activeData.__config__.jnpfKey === 'date'">
      <div v-for=" (item, index) in activeData.__config__.regList" :key="index" class="reg-item">
        <span class="close-btn" @click="activeData.__config__.regList.splice(index, 1)">
          <i class="el-icon-close" />
        </span>
        <el-form-item label="表达式" v-if="item.pattern">
          <el-input v-model="item.pattern" placeholder="请输入正则" />
        </el-form-item>
        <el-form-item label="错误提示" style="margin-bottom:18">
          <el-input v-model="item.message" placeholder="请输入错误提示" />
        </el-form-item>
        <el-form-item label="校验方法" style="margin-bottom:18" v-if="item.validate">
          <el-input v-model="item.validate" placeholder="请添加自定义校验方法" />
        </el-form-item>
      </div>
      <div class="mt-10">
        <el-button type="primary" @click="addCustomReg" style="margin-left:10px">
          自定义校验脚本
        </el-button>
      </div>
    </template>
    <VaildateScriptVue :visible.sync="vaildateVisible" :tpl="validate" @updateScript="updateScript">
    </VaildateScriptVue>
  </el-row>
</template>
<script>
import VaildateScriptVue from './VaildateScript.vue'
const dateTimeFormat = {
  date: 'yyyy-MM-dd',
  week: 'yyyy 第 WW 周',
  month: 'yyyy-MM',
  year: 'yyyy',
  datetime: 'yyyy-MM-dd HH:mm:ss',
  daterange: 'yyyy-MM-dd',
  monthrange: 'yyyy-MM',
  datetimerange: 'yyyy-MM-dd HH:mm:ss'
}
import comMixin from './mixin';
export default {
  props: ['activeData'],
  mixins: [comMixin],
  components: { VaildateScriptVue },
  data() {
    return {
      vaildateVisible: false,
      validate: "(rule,value,callback ) => {\n    // 在此编写代码\n    \n}",
      dateTypeOptions: [
        {
          label: '日(date)',
          value: 'date'
        },
        // {
        //   label: '周(week)',
        //   value: 'week'
        // },
        // {
        //   label: '月(month)',
        //   value: 'month'
        // },
        // {
        //   label: '年(year)',
        //   value: 'year'
        // },
        {
          label: '日期时间(datetime)',
          value: 'datetime'
        }
      ],
      dateRangeTypeOptions: [
        {
          label: '日期范围(daterange)',
          value: 'daterange'
        },
        // {
        //   label: '月范围(monthrange)',
        //   value: 'monthrange'
        // },
        {
          label: '日期时间范围(datetimerange)',
          value: 'datetimerange'
        }
      ]
    }
  },
  computed: {
    dateOptions() {
      if (
        this.activeData.type !== undefined
        && this.activeData.__config__.tag === 'el-date-picker'
      ) {
        if (this.activeData['start-placeholder'] === undefined) {
          return this.dateTypeOptions
        }
        return this.dateRangeTypeOptions
      }
      return []
    },
  },
  created() { },
  methods: {
    setTimeValue(val, type) {
      const valueFormat = type === 'week' ? dateTimeFormat.date : val
      this.$set(this.activeData.__config__, 'defaultValue', null)
      // this.$set(this.activeData, 'value-format', valueFormat)
      this.$set(this.activeData, 'format', val)
    },
    dateTypeChange(val) {
      this.setTimeValue(dateTimeFormat[val], val)
    },
    addHandle(row) {
      this.activeData.__config__.regList.push({
        pattern: row.pattern,
        message: row.message
      })
    },
    addCustomReg() {
      this.vaildateVisible = true
    },
    updateScript(data) {
      this.activeData.__config__.regList.push({
        pattern: '',
        message: '',
        validate: data
      })
    },
  }
}
</script>