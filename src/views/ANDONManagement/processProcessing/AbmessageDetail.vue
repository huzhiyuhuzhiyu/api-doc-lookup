<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center">
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <Form v-if="formVisible" ref="Form" @close="closeForm" :flowType="flowType" />
        <el-empty description="暂无数据" :image-size="120" v-else></el-empty>
      </div>
    </div>
  </div>
</template>

<script>
import Form from './Form.vue'
const Base64 = require('js-base64').Base64
export default {
  name: 'AbmessageDetails',
  components: { Form },
  data() {
    return {
      formVisible: false,
      flowType:2
    }
  },
  created() {
    this.initData()
  },
  watch: {
    config: {
      handler(val) {
        this.toDetail()
      },
      deep: true
    },
  },
  computed: {
    config() {
      return this.$route.query.config
    }
  },
  methods: {
    initData() {
      console.log(111);
      
      this.toDetail()
    },
    toDetail() {
      // type 1-我发起的 2-待办 3-抄送
      if (!this.config) return this.formVisible = false
      let item = JSON.parse(Base64.decode(this.config))
      this.flowType = item.type 
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(item.businessId)
      })
    },
    closeForm() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.back()
    }
  }
}
</script>