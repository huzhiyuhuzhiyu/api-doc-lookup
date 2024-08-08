<template>
  <div class="JNPF-common-layout">

    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="JNPF-common-head">
          <topOpts :addText="'打印预览'" @add="addOrUpdateHandle()"></topOpts>
        </div>
    </div>
    <print-browse :visible.sync="printBrowseVisible" :id="prindId" :formId="formId" />
  </div>
</template>

<script>
import PrintBrowse from '@/components/PrintBrowse'
export default {
  components: { PrintBrowse },
  data() {
    return {
      printBrowseVisible: false,
      // prindId:'253577125385210565',
      // formId:'590187277007746117',
      prindId:'590172946434126661',
      formId:'1820618003853148161'
    }
  },
  methods:{
    addOrUpdateHandle(){
      this.printBrowseVisible = true;
    },
  },
}
</script>