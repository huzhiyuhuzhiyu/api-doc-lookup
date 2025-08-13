<template>
  <div class="CustomButton">
    <slot v-if="$slots.text" name="text"></slot>
    <el-button
      v-for="(btn, index) in btnList"
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
    <el-button
      v-for="(btn, index) in btnList"
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
