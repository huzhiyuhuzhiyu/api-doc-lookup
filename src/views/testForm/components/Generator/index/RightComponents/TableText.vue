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
    <el-form-item label="是否只读" v-if="activeData.__config__.jnpfKey === 'JNPFTableInput'">
      <el-switch v-model="activeData.readonly" />
    </el-form-item>
    <el-form-item label="是否禁用" v-if="activeData.__config__.jnpfKey === 'JNPFTableInput'">
      <el-switch v-model="activeData.disabled" />
    </el-form-item>
    <el-form-item label="是否隐藏" v-if="activeData.__config__.jnpfKey === 'JNPFTableInput'">
      <el-switch v-model="activeData.__config__.noShow" />
    </el-form-item>
    <el-divider>校验规则</el-divider>
    <el-form-item label="是否必填" v-if="activeData.__config__.jnpfKey === 'JNPFTableInput'">
      <el-switch v-model="activeData.__config__.required" />
    </el-form-item>
    <template v-if="activeData.__config__.jnpfKey === 'JNPFTableInput'">
      <draggable :list="activeData.__config__.regList" :animation="340" group="selectItem" handle=".option-drag">
        <div v-for=" (item, index) in activeData.__config__.regList" :key="index" class="reg-item">
          <div class="select-line-icon option-drag">
            <i class="icon-ym icon-ym-darg" />
          </div>
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
            <el-input type="textarea" :rows="4" v-model="item.validate" placeholder="请添加自定义校验方法" />
          </el-form-item>
        </div>
      </draggable>
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
import comMixin from './mixin';
import VaildateScriptVue from './VaildateScript.vue'
import draggable from 'vuedraggable'
export default {
  props: ['activeData'],
  components: { VaildateScriptVue , draggable },
  mixins: [comMixin],
  data() {
    return {
      vaildateVisible: false,
      validate: "(rule,value,callback ) => {\n    // 在此编写代码\n    \n}"
    }
  },
  created() { },
  methods: {
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