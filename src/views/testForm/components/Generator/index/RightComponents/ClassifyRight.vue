<template>
  <el-row>
    <el-form-item label="控件标题">
      <el-input v-model="activeData.__config__.label" placeholder="请输入控件标题" />
    </el-form-item>
    <el-form-item label="占位提示" v-if="activeData.__config__.jnpfKey !=='editor'">
      <el-input v-model="activeData.placeholder" placeholder="请输入占位提示" />
    </el-form-item>
    <el-form-item label="分类类型" v-if="activeData.__config__.jnpfKey === 'comSelect2'">
      <el-select v-model="activeData.selectClassifyType" placeholder="请选择" @change="onTypeChange">
        <el-option v-for="item in selectTypeClassifyOptions" :key="item.value" :label="item.label"
          :value="item.value" />
      </el-select>
    </el-form-item>
    <!-- <el-form-item label="默认值">
      <com-select2 v-model="activeData.__config__.defaultValue" placeholder="选择默认值" clearable
        v-if="activeData.__config__.jnpfKey==='comSelect2'" auth isOnlyOrg :type="activeData.selectClassifyType" :multiple="activeData.multiple"
        :key="key" />
      <BillRule v-model="activeData.__config__.defaultValue" placeholder="选择默认值" clearable
        v-if="activeData.__config__.jnpfKey==='billRule'" :key="key" />
      <el-input :value="setDefaultValue(activeData.__config__.defaultValue)" placeholder="请输入默认值"
        @input="onDefaultValueInput" v-if="activeData.__config__.jnpfKey==='editor'" />
    </el-form-item> -->
    <el-form-item label="能否清空" v-if="activeData.__config__.jnpfKey!=='editor'">
      <el-switch v-model="activeData.clearable" />
    </el-form-item>
    <el-form-item label="能否多选" v-if="activeData.__config__.jnpfKey!=='editor'">
      <el-switch v-model="activeData.multiple" @change="multipleChange" />
    </el-form-item>
    <el-form-item label="是否禁用" v-if="activeData.__config__.jnpfKey !=='editor'">
      <el-switch v-model="activeData.disabled" />
    </el-form-item>
    <el-form-item label="是否必填">
      <el-switch v-model="activeData.__config__.required" />
    </el-form-item>
    <el-divider>校验规则</el-divider>
    <el-form-item>
      <span slot="label">是否唯一
        <!-- <el-tooltip content="输入值唯一性校验" placement="top">
          <a class="el-icon-warning-outline"></a>
        </el-tooltip> -->
      </span>
      <el-switch v-model="activeData.__config__.unique" />
    </el-form-item>
  </el-row>
</template>
<script>
import comMixin from './mixin';
export default {
  props: ['activeData'],
  mixins: [comMixin],
  data() {
    return {
      selectTypeClassifyOptions:[
        {
          value: 'customer',
          label: '客户'
        },
        {
          value: 'supplier',
          label: '供应商'
        },
      ],
      key: +new Date()
    }
  },
  created() { },
  methods: {
    onTypeChange() {
      this.$set(this.activeData.__config__, 'defaultValue', this.activeData.multiple ? [] : '')
      this.activeData.ableDepIds = []
      if (this.activeData.__config__.jnpfKey === 'posSelect') {
        this.activeData.ablePosIds = []
      }
      if (this.activeData.__config__.jnpfKey === 'userSelect') {
        this.activeData.ablePosIds = []
        this.activeData.ableUserIds = []
        this.activeData.ableRoleIds = []
        this.activeData.ableGroupIds = []
      }
      this.activeData.__config__.renderKey = +new Date()
      this.key = +new Date()
    },
    multipleChange(val) {
      this.$set(this.activeData.__config__, 'defaultValue', val ? [] : '')
      this.activeData.__config__.renderKey = +new Date()
      this.key = +new Date()
    }
  }
}
</script>