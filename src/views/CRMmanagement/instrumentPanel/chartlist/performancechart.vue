
<template>
  <div id="performance" :option="option" style="width: 100%; height: 100%;"></div>
</template>
 
<script>
export default {
  props: {
    option: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chartInstance: null
    };
  },
  mounted() {
    this.chartInstance = this.$echarts.init(document.getElementById('performance'));
    this.chartInstance.setOption(this.option);
    window.onresize = this.chartInstance.resize()
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