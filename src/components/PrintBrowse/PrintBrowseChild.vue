<template>
  <div ref="tsPrint" class="print-content" style="display: none">
    <template v-if="data.pageType === 'custom'">
      <div v-for="(item, index) in data.T1" :key="index" v-html="printTemplate" :ref="'tsPrintItem' + index"
           style="page-break-after: always;font-family: simsun, 宋体, sans-serif; ">
      </div>
    </template>
    <template v-else>
      <div v-html="printTemplate" style="font-family: simsun, 宋体, sans-serif; " />
    </template>
  </div>
</template>
<script>
import PrintBrowse from './index.vue'

export default {
  extends: PrintBrowse,
  name: 'PrintBrowseChild',
  data(){
    return {
      isReady: false,
    }
  },
  mounted() {
    this.isReady = true
  },
  methods:{
    getStatus(){
      return this.isReady
    }
  }
}
</script>
