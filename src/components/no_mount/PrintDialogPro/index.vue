<template>
  <div>
    <!-- 选择打印模版弹窗 -->
    <PrintDialog :visible.sync="printVisible" @closePrint="printVisible = false" @printSubmit="printSubmit"
      :printQuery="printQuery" :enCode="enCode" ref="printTemplate" />
    <print-browse :visible.sync="printBrowseVisible" :id="prindId" :formId="formId" :params="{}"
      :fullName="fullName" />
  </div>
</template>
<script>
import { getPrintBusInfo } from '@/api/system/printDev'
import PrintBrowse from '@/components/PrintBrowse'
import PrintDialog from '@/components/no_mount/printDialog'
export default {
  components: { PrintBrowse, PrintDialog },
  data() {
    return {
      printVisible: false,
      printQuery: {
        category: null
      },
      printBrowseVisible: false,
      formId: null,
      enCode: null,
      fullName: null,
      prindId: null
    }
  },
  methods: {
    init(data) {
      const { category, enCode, formId, fullName } = data
      if (!enCode || !formId || !fullName) return console.error('参数错误')

      this.printQuery.category = category
      this.formId = formId
      this.enCode = enCode
      this.fullName = fullName

      this.printVisible = true
      this.$nextTick(() => {
        this.$refs.printTemplate.init(this.enCode)
      })
    },
    printSubmit(enCode) {
      getPrintBusInfo(enCode).then(res => {
        if (res.data) {
          this.prindId = res.data.id
          this.printBrowseVisible = true
        } else {
          this.$message.warning('未找到相应打印模版')
        }
      }).catch(() => {
        this.printBrowseVisible = false
      });
    },
  }
}
</script>