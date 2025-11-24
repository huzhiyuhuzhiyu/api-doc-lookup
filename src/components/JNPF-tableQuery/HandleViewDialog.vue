<template>
  <el-dialog :title="dialogTitle" :visible.sync="visible" width="600px" append-to-body lock-scroll
             class="JNPF-dialog JNPF-dialog_center" :close-on-click-modal="false" @close="$emit('cancel')">
    <el-form :model="dataForm" :rules="rules" ref="dataForm" label-position="top" @submit.native.prevent>
      <el-form-item label="视图名称" prop="fullName">
        <el-input v-model="dataForm.fullName" autocomplete="off" maxlength="50" :placeholder="placeholder"
                  @keyup.enter.native="onConfirm()" autofocus></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('cancel')">{{ $t('common.cancelButton') }}</el-button>
      <el-button type="primary" @click="onConfirm()" :loading="saveBtnLoading">{{ $t('common.confirmButton')
        }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getAdvancedQueryList, Delete, Create, Update } from "@/api/system/advancedQuery";
export default {
  name: 'HandleViewDialog',
  inject: ['planList', 'systemSearchView'],
  props: {
    currMenuId: {
      type: String
    },
    listQuery: {
      type: Object,
      required: true
    },
    mode: {
      type: String,
      default: 'save', // 'save' 或 'rename'
      validator: value => ['save', 'rename'].includes(value)
    },
    renameItem: {
      type: Object,
      default: null
    },
  },
  data() {
    return {
      visible: true,
      saveBtnLoading: false,
      dataForm: { fullName: '' },
      rules: {
        fullName: [
          { required: true, message: '请输入视图名称', trigger: 'blur' },
          { validator: this.formValidate('noSpace', null), trigger: 'blur' },
          { validator: this.formValidate({ type: 'calc', params: [(rowIndex, value) => !this.injectedSystemSearchView.some(item => item.fullName === value), "不能与系统视图名称重复", (errMsg) => { }] }), trigger: 'blur' },
          { validator: this.formValidate({ type: 'calc', params: [(rowIndex, value) => this.mode === 'rename' ? !this.injectedPlanList.some(item => item.fullName === value) : true, "重命名不能与其他视图名称重复", (errMsg) => { }] }), trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    dialogTitle() {
      return this.mode === 'rename' ? '重命名视图' : '保存为新视图';
    },
    placeholder() {
      return this.mode === 'rename' ? '请输入新的视图名称' : '请输入保存的方案名称';
    },
    injectedPlanList() {
      return this.planList();
    },
    injectedSystemSearchView() {
      return this.systemSearchView();
    }
  },
  watch: {
    visible: {
      handler(val) {
        if (val) {
          if (this.mode === 'rename' && this.renameItem) {
            this.dataForm.fullName = this.renameItem.fullName;
          } else {
            this.dataForm.fullName = '';
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    onConfirm() {
      let id = ''
      let submitFlag = true
      this.$refs.dataForm.validate(async valid => {
        if (valid) {

          const targetView = this.injectedPlanList.find(o => o.fullName === this.dataForm.fullName)
          if (targetView && this.mode === 'save') {
            submitFlag = await this.$confirm(`${targetView.fullName}已存在, 是否覆盖视图?`, '', {
              type: 'warning'
            })
            id = targetView.id
          }

          if (!submitFlag) return
          let saveConditionList = this.listQuery.superQuery.condition.map(item => {
            let obj = {
              ...item,
              prop: item.field,
              value: item.fieldValue
            }
            delete obj.timeOffsetCalculated
            delete obj.fieldValue
            delete obj.tempFieldValue
            if (obj.timeOffset) {
              obj.timeOffsetBasic = +new Date()
            } else {
              delete obj.timeOffset
              delete obj.timeOffsetBasic
            }
            // 这里需要有保存方法名称的解决方案
            // if (item.type === 'custom') obj = { ...obj, ...item }
            return obj
          })
          this.saveBtnLoading = true
          let query = {
            id: id || '',
            ...this.dataForm,
            matchLogic: this.listQuery.superQuery.matchLogic,
            moduleId: this.currMenuId,
            conditionJson: JSON.stringify({
              condition: saveConditionList,
              orderItems: this.listQuery.orderItems,
              pageSize: this.listQuery.pageSize,
              keywordQuery: this.listQuery.keywordQuery
            })
          }

          if (this.mode === 'rename') {
            // 重命名模式：保留原有数据，只更新名称
            query = {
              ...this.renameItem,
              fullName: this.dataForm.fullName
            }
          }

          const formMethod = query.id ? Update : Create
          formMethod(query).then(res => {
            this.saveBtnLoading = false
            this.$message({
              message: res.msg,
              type: 'success',
              duration: 1500
            })
            this.$emit('confirm', { ...this.dataForm });
          }).catch(() => {
            this.saveBtnLoading = false
          })

        }
      });
    }
  }
}
</script>

<style scoped lang="scss"></style>
