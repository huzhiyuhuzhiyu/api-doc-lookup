<template>
  <el-row>
    <el-form-item label="控件标题">
      <el-input v-model="activeData.__config__.label" placeholder="请输入控件标题" />
    </el-form-item>
    <el-form-item label="占位提示" v-if="activeData.__config__.jnpfKey === 'JNPFTableInput'">
      <el-input v-model="activeData.placeholder" placeholder="请输入占位提示" />
    </el-form-item>
    <el-form-item label="默认值">
      <el-input :value="setDefaultValue(activeData.__config__.defaultValue)" placeholder="请输入默认值"
        @input="onDefaultValueInput" />
    </el-form-item>
    <el-form-item label="字段编码">
      <el-input v-model="activeData.__config__.__vModel__" placeholder="请输入字段编码" />
    </el-form-item>
    <el-form-item label="能否清空" v-if="activeData.__config__.jnpfKey === 'JNPFTableInput'">
      <el-switch v-model="activeData.clearable" />
    </el-form-item>
    <el-form-item label="是否必填" v-if="activeData.__config__.jnpfKey === 'JNPFTableInput'">
      <el-switch v-model="activeData.__config__.required" />
    </el-form-item>
    <el-form-item label="是否只读" v-if="activeData.__config__.jnpfKey === 'JNPFTableInput'">
      <el-switch v-model="activeData.readonly" />
    </el-form-item>
    <el-form-item label="是否禁用" v-if="activeData.__config__.jnpfKey === 'JNPFTableInput'">
      <el-switch v-model="activeData.disabled" />
    </el-form-item>
    <el-form-item label="是否隐藏" v-if="activeData.__config__.jnpfKey === 'JNPFTableInput'">
      <el-switch v-model="activeData.__config__.noShow" />
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
    }
  },
  created() { },
  methods: {
  }
}
</script>