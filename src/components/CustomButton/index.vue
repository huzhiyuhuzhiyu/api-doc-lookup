<template>
  <div class="CustomButton">
    <!-- 文本插槽-用于显示总数或其他文本 -->
    <slot v-if="$slots.text" name="text"></slot>
    <!-- 按钮插槽-用于自定义按钮内容 -->
    <el-button
      v-for="(btn, index) in btnList"
      :key="index"
      v-has="btn.permission"
      :type="btn.buttonType"
      :icon="btn.icon"
      :size="btn.size || 'mini'"
      @click="handleClick(btn.type)"
    >
      <!-- 按钮插槽 -->
      <slot :name="`button-${btn.type}`" :btn="btn">
        {{ btn.text }}
      </slot>
    </el-button>
  </div>
</template>

<script>
export default {
  name: 'CustomButton',
  props: {
    btnList: {
      type: Array,
      required: true, // 必须传入按钮列表
      validator: (value) => {
        return value.every(btn => btn.buttonType && btn.type && btn.text);
      }
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
