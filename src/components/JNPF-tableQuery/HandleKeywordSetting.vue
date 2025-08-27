<template>
  <el-dialog :title="dialogTitle" :visible.sync="visible" width="600px" append-to-body lock-scroll
    class="JNPF-dialog JNPF-dialog_center" :close-on-click-modal="false" @close="$emit('cancel')">
    <el-form :model="dataForm" :rules="rules" ref="dataForm" label-position="top" @submit.native.prevent>
      <el-form-item label="" prop="keywordFieldList">
        <el-alert title="注意：为保证查询效率，请勿关联过多属性" type="warning" :closable="false" show-icon style="margin-bottom: 10px;" />
        <el-checkbox-group v-model="dataForm.keywordFieldList">
          <el-row :gutter="20">
            <el-col :span="6" v-for="option in options" :key="option.value">
              <el-checkbox :label="option.value" :disabled="option.disabled" border>
                {{ option.label }}
              </el-checkbox>
            </el-col>
          </el-row>
        </el-checkbox-group>
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
import { getQueryProps } from '@/components/JNPF-table/data'
export default {
  name: 'HandleKeywordSetting',
  props: {
    keywordQuery: {
      type: Object,
      required: true
    },
    columnList: {
      type: Array,
      required: true
    },
    queryJson: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      visible: true,
      saveBtnLoading: false,
      dataForm: { keywordFieldList: [] },
      rules: {
        keywordFieldList: [
          { required: true, message: '至少需要关联一个属性', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    dialogTitle() {
      return '设置关键词关联属性';
    },
    options() {
      let result = this.columnList.map(column => {
        const queryProps = getQueryProps(column, this.queryJson)
        return {
          label: column.label,
          value: column.prop,
          disabled: queryProps.type !== 'input'
        }
      });
      // return result;
      return result.filter(item => !item.disabled);
    }
  },
  watch: {
    visible: {
      handler(val) {
        if (val) {
          this.dataForm.keywordFieldList = structuredClone(this.keywordQuery.fieldList);
        }
      },
      immediate: true
    }
  },
  methods: {
    onConfirm() {
      this.$refs.dataForm.validate(async valid => {
        if (valid) {
          const effectFieldList = this.dataForm.keywordFieldList.filter(item => this.options.some(option => option.value === item));
          this.$emit('confirm', effectFieldList);
        }
      });
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .el-checkbox {
  width: 100%;
  margin-bottom: 10px;
  display: flex;
  align-items: center;

  .el-checkbox__label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
