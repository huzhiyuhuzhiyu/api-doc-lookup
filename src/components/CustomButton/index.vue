<template>
  <div class="CustomButton">
    <slot v-if="$slots.text" name="text"></slot>

    <!-- 所有按钮 -->
    <template v-for="(btn, index) in btnList">
      <!-- 普通按钮（有权限） -->
      <template v-if="btn.type !== 'export'">
        <el-button
          v-if="btn.permission"
          :key="`auth-${index}`"
          v-has="btn.permission"
          :type="btn.buttonType"
          :icon="btn.icon"
          :size="btn.size || 'mini'"
          @click="handleClick(btn.type)"
        >
          <slot :name="`button-${btn.type}`" :btn="btn">
            {{ btn.text }}
          </slot>
        </el-button>

        <!-- 普通按钮（无权限） -->
        <el-button
          v-if="!btn.permission"
          :key="`oauth-${index}`"
          :type="btn.buttonType"
          :icon="btn.icon"
          :size="btn.size || 'mini'"
          @click="handleClick(btn.type)"
        >
          <slot :name="`button-${btn.type}`" :btn="btn">
            {{ btn.text }}
          </slot>
        </el-button>
      </template>

      <!-- 导出按钮 -->
      <TableDataExportButton
        v-if="btn.type === 'export'"
        v-has="btn.permission"
        :key="`export-${index}`"
        :disabled="btn.disabled || exportDisabled"
        :tableRef="btn.tableRef || 'dataTable'"
        :listQuery="exportListQuery"
        :exportType="btn.exportType"
        :exportName="btn.exportName || '导出数据'"
      />
    </template>
  </div>
</template>

<script>
export default {
  name: 'CustomButton',
  props: {
    btnList: {
      type: Array,
      required: true,
      validator: (value) => {
        return value.every(btn => btn.buttonType && btn.type && btn.text);
      }
    },
    exportDisabled: {
      type: Boolean,
      default: false
    },
    exportListQuery: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    handleClick(type) {
      this.$emit('click', type);
    }
  }
};
</script>

<style lang="scss" scoped>
.CustomButton {
  display: flex;
  align-items: center;
  flex: 1;
}
</style>
