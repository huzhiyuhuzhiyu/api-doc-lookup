<template>
  <div class="JNPF-common-layout">

    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="JNPF-common-head">
          <topOpts :addText="'打印预览'" @add="addOrUpdateHandle('P001')"></topOpts>
        </div>
    </div>
    <print-browse :visible.sync="printBrowseVisible" :id="prindId" :formId="formId" />
  </div>
</template>

<script>
import PrintBrowse from '@/components/PrintBrowse'
import { getPrintBusInfo } from '@/api/system/printDev'
export default {
  components: { PrintBrowse },
  data() {
    return {
      printBrowseVisible: false,
      // prindId:'253577125385210565',
      // formId:'590187277007746117',
      prindId:'590172946434126661',
      formId:'1821777795724410881'
    }
  },
  methods:{
    addOrUpdateHandle(enCode){
      getPrintBusInfo(enCode).then(res=>{
        if (res.data){
          this.prindId = res.data.id
          this.printBrowseVisible = true
        }else{
          this.$message.warning('未找到相应打印模版')
        }
      }).catch(()=>{
        this.printBrowseVisible = false
      });
    },
  },
}
</script>