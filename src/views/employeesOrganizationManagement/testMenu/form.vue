<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div :class="['JNPF-common-page-header', btnType ? 'noButtons' : '']">
        <!-- <el-page-header @back="goBack" :content="!parentId ? $t(`customer.addCustomer`) : $t(`customer.editCustomer`)" v-show="!btnType"/> -->
        <el-page-header @back="$emit('close')" :content="title" />
        <div class="options" v-if="btnType !== 'look'">
          <el-button type="primary" :loading="btnLoading" @click="handleConfirm()">
            提交</el-button>
          <el-button @click="$emit('close')">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main" v-loading="formLoading">
        <el-tabs v-model="activeName">
          <!-- 普通属性 -->
          <el-tab-pane v-if="basicData.length" :label="basicData[0].title" :name="basicData[0].title"
            :key="basicData[0].title">
            <JNPF-Col v-if="basicData.length" v-model="dataForm" :tabContent="basicData[0].__config__.children"
              ref="dataForm" :openMode="openMode" />
          </el-tab-pane>
          <el-tab-pane v-if="basicData.length" :label="basicData[1].title" :name="basicData[1].title"
            :key="basicData[1].title">
            <Process :conf="flowTemplateJson" v-if="flowTemplateJson.nodeId" />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </transition>
</template>

<script>
import { detailVisualDevInfo } from '@/api/system/system'
import formValidate from "@/utils/formValidate";
import request from "@/utils/request";
import Process from '@/components/Process/Preview'
import { mapGetters, mapState } from 'vuex'
import Item from './Item'
export default {
  components: { Process,Item },
  data() {
    return {
      request,
      formValidate,
      valType: false,
      title: '',
      activeName: "基本信息",
      dataForm: {},
      basicData: [],
      flowTemplateJson: {},
      btnType: '',
      btnLoading: false,
      formLoading: false,
    }
  },
  created() {
    this.getDevDetail()
  },
  computed: {
    openMode() {
      return this.title === '新建客户档案' ? '新建' : this.title === '编辑客户档案' ? '编辑' : '只读'
    },
    ...mapGetters(['userInfo']),
  },
  methods: {
    init(id, btnType) {
      this.visible = true
      this.dataForm.id = id || ''
      this.btnType = btnType
      if (this.dataForm.id) {
        this.title = btnType === 'look' ? '查看客户档案' : '编辑客户档案'
      } else {
        this.title = '新建客户档案'
        this.formLoading = false
      }
    },
    getDevDetail() {
      let queryString = this.jnpf.getQueryString()
      detailVisualDevInfo(queryString).then(res => {
        let formData = JSON.parse(res.data.formData)
        console.log(formData, 'formData');

        this.flowTemplateJson = res.data.flowTemplateJson ? JSON.parse(res.data.flowTemplateJson) : null
        console.log(this.flowTemplateJson)
        this.flowTemplateJson.content = this.userInfo.userName
        return
        let fields = formData.fields[0].__config__.children
        let that = this

        /**传入的方法花括号内容从this中解构，并返回 */
        function vEvalTransfer(params) {
          let copyparams = params
          let match = copyparams.substring(copyparams.indexOf('{'), copyparams.indexOf('}') + 1)
          copyparams = copyparams.replace(match, '')
          function insertString(originalStr, newStr, index) {
            // 在索引位置插入新字符串
            return `${originalStr.slice(0, index)}${newStr}${originalStr.slice(index)}`;
          }
          var index1 = copyparams.indexOf('{') + 1;
          // 示例使用
          const newStr = '\nvar ' + match + ' = that;\n';

          const result = insertString(copyparams, newStr, index1);
          return result
        }

        function transformData(data) {
          return data.map(section => {
            const processChildren = (children) => {
              return children.map(child => {
                const { jnpfKey, label, showLabel, tag, tagIcon, required, layout, span, dragDisabled, visibility, tableName, noShow, unique, regList, trigger, formId, renderKey } = child.__config__;
                const { __vModel__ } = child;
                let itemSlot = child.__slot__ || ''
                if (itemSlot) {
                  if (itemSlot.prepend) {
                    itemSlot.position = 'prepend';
                    itemSlot.content = itemSlot['prepend']
                  } else if (itemSlot.append) {
                    itemSlot.position = 'append';
                    itemSlot.content = itemSlot['append']
                  }
                }
                const clearable = child.clearable || false;
                const readonly = child.readonly || false;
                const disabled = child.disabled || false;
                let itemRules = []
                let message = child.placeholder + label
                let content = child.content
                if (required) {
                  itemRules.push(
                    { required: true, message: message, trigger: 'blur' }
                  )
                }
                if (regList && Array.isArray(regList)) {
                  regList.forEach(item => {
                    if (item.pattern) {
                      itemRules.push(
                        { pattern: `${eval(item.pattern)}`, message: item.message, trigger: 'blur' },
                      )
                    }
                    if (item.validate) {
                      that.valType = false
                      // 如果是formValidate开头的自定义校验，把formValidate添加that标记
                      if (item.validate.trim().startsWith('formValidate')) {
                        // item.validate = item.validate.replace('formValidate', 'that.formValidate')
                        that.valType = true
                        var functionName = item.validate.substring(0, item.validate.indexOf('('));
                        var parameter = item.validate.substring(item.validate.indexOf('(') + 1, item.validate.lastIndexOf(')'));
                        const isEnclosedInBraces = /^\{.*\}$/.test(parameter);
                        if (isEnclosedInBraces) {
                          const createObjectFromStr = new Function(`return ${parameter}`);
                          const obj = createObjectFromStr.bind(that)();
                          item.validate = that.formValidate(obj)
                        } else {
                          if (typeof that[functionName] === 'function') {
                            item.validate = that[functionName](parameter)
                          } else {
                            console.log(functionName + ' is not defined in Vue instance');
                          }
                        }
                      } else { // 传入的方法花括号内容从this中解构，并返回
                        item.validate = vEvalTransfer(item.validate)
                      }
                      itemRules.push(
                        { validator: that.valType ? item.validate : eval(item.validate), trigger: 'blur' }
                      )
                    }
                  })
                }

                return {
                  jnpfKey,
                  type: jnpfKey === 'comInput' ? 'input' : jnpfKey === 'select' ? 'select' : 'custom',
                  customComponent: jnpfKey,
                  selectClassifyType: child.selectClassifyType || '',
                  itemRules,
                  label,
                  showLabel,
                  tag,
                  tagIcon,
                  required,
                  layout,
                  span,
                  dragDisabled,
                  visibility,
                  tableName,
                  noShow,
                  unique,
                  regList,
                  trigger,
                  formId,
                  renderKey,
                  itemSlot,
                  clearable,
                  readonly,
                  disabled,
                  prop: __vModel__ ? that.jnpf.getToLowerCase(__vModel__) : label,
                  content
                };
              });
            };

            let children = section.__config__.children;
            if (section.title === "联系人信息") {
              children = section.__config__.children.flatMap(child => {
                if (child.__config__.jnpfKey === "table") {
                  return processChildren(child.__config__.children);
                } else {
                  return processChildren([child]);
                }
              });
            } else {
              children = processChildren(children);
            }

            return {
              title: section.title,
              __config__: {
                children
              }
            };
          });
        }
        let devData = transformData(fields)
        that.basicData = fields
        console.log(that.basicData);
      })

    },
  },
}
</script>