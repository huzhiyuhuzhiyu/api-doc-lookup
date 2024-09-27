
<template>
  <div :id="id" :option="option" style="width: 100%; height: 100%;"></div>
</template>
 
<script>
export default {
  props: {
    id: {
      type: String,
      required: true
    },
    option: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chartInstance: null,
      timeout: null
    };
  },
  mounted() {
    this.chartInstance = this.$echarts.init(document.getElementById(this.id));
    this.chartInstance.setOption(this.option);
    let _this = this
    window.addEventListener('resize', () => {
      clearTimeout(_this.timeout)
      _this.timeout = setTimeout(() => {
        _this.chartInstance.resize()
      }, 100)
    })
  },
  beforeDestroy() {
    this.chartInstance.clear()
  },
  watch: {
    option: {
      handler(newOption) {
        if (this.chartInstance) {
          this.chartInstance.setOption(newOption);
        }
      },
      deep: true
    }
  }
};
</script>