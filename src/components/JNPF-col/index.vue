<template>
  <el-form :label-position="labelPosition" :model="value" ref="main">
    <el-row :gutter="30" class="custom-row" :key="tabContentKey">
      <FormItem
        v-for="item in processedTabContent"
        :key="item.prop + item.label"
        :item="item"
        v-bind="item"
        :value="value[item.prop]"
        @input="handleInput($event, item.prop)"
        :ref="item.prop"
        :openMode="realOpenMode"
      />

      <div style="color:#aaa" v-if="tabContent.length === 0" :style="{ 'textAlign': 'center', 'padding': '10%' }">
        暂无数据
      </div>
    </el-row>
  </el-form>
</template>

<script>
import FormItem from "./item.vue";

export default {
  components: { FormItem },
  name: 'JNPF-col',
  data() {
    return {
      tabContentKey: +new Date()
    };
  },
  props: {
    labelPosition: {
      type: String,
      default: 'top'
    },
    value: {
      type: Object,
      required: true
    },
    tabContent: {
      type: Array,
      required: true
    },
    openMode: {
      type: String,
      default: '新建'
    },
    btnType: {
      type: String
    }
  },
  computed: {
    realOpenMode() {
      if (this.btnType) {
        return this.btnType === 'look' ? '只读' : this.btnType === 'edit' ? '编辑' : '新建';
      } else {
        return this.openMode;
      }
    },
    processedTabContent() {
      return this.tabContent.map(item => ({
        hideLookP: true,
        ...item
      }));
    }
  },
  mounted() {
    this.setDefaultValue();
  },
  methods: {
    handleInput(val, key) {
      this.$emit('input', { ...this.value, [key]: val });
    },
    async setDefaultValue() {
      const formData = { ...this.value };
      this.processedTabContent.forEach(item => {
        const { prop, value } = item;
        if ((formData[prop] === undefined || formData[prop] === null || formData[prop] === '') && value !== undefined) {
          formData[prop] = value;
        }
      });

      this.$emit('input', { ...formData });
      this.tabContentKey = +new Date();
    }
  }
};
</script>
