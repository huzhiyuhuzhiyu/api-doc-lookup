<script>
import { waitChange } from '@/utils'
export default {
  props:{
    fullName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      printHtml: '',
      printVisible: false,
      childArr: [],
      childShow:false,
    }
  },
  components: {
    Child: () => import('./PrintBrowseChild.vue'),
    printBrowse: () => import('./index.vue')
  },
  methods: {
    async print(arr,joinText='<span style="page-break-after: always;"></span>') {
      const loading = this.$loading({
        text: '正在努力为您生成预览...'
      })
      try {
        this.childArr = arr
        this.childShow = true
        await waitChange(()=>{
          const children = this.$refs.child
          if(!(children && children.length === arr.length)){
            return false
          }
          return children.every(item=>item.getStatus())
        })
        await this.$nextTick()
        const res = await Promise.all(this.$refs.child.map(item => item.onOpen()))
        this.printHtml = res.join(joinText)
        await this.$nextTick()
        this.printVisible = true
      } catch (e) {
        console.error(e)
        this.$message.warning('生成打印数据错误，请稍后重试')
      } finally {
        loading.close()
        this.childShow = false
      }
    }
  }
}
</script>

<template>
  <div>
    <print-browse :print-html="printHtml" :fullName="fullName" :recordList="childArr" :visible.sync="printVisible" ref="print"/>
    <template v-if="childShow">
      <child ref="child" v-for="item in childArr" :form-id="item.formId" :params="item.params" :no-qr="true" :id="item.id" :key="item.formId"/>
    </template>
  </div>
</template>
