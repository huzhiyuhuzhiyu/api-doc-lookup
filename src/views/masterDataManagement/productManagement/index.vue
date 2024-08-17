<template>
  <FinishedProduct v-if="code == 'finished_product'"></FinishedProduct>
  <ProductIndex v-else ref="productIndex" :initListQuery="initListQuery" :productName="name" :busSetId="productCode" />
</template>

<script>
import FinishedProduct from "./finished_product/index.vue";
import ProductIndex from './components/Index.vue'
export default {
  components: { FinishedProduct, ProductIndex },
  name: 'productIndex',
  data() {
    return {
      code: '',
      name: '',
    }
  },
  created() {
    this.name = this.$route.meta.zhTitle
    this.code = this.$route.meta.title
    this.productCode = this.$route.query.productCode

    this.initListQuery = {
      code: "",
      name: "",
      orderItems: [{
        asc: false,
        column: ""
      }, {
        asc: false,
        column: "create_time"
      }],
      pageNum: 1,
      pageSize: 20,
      drawingNo: "", // 图号
      productSource: "", // 产品来源
      startAndEndTime: [], // 创建时间
      productCategoryId: "", // 类型id
      productStatus: "", // 产品状态
      customerQueryFields: [],
      createTimeArr: [],
      classAttribute: this.code
    }
    this.$nextTick(() => {
      this.$refs.productIndex.init(this.initListQuery)
    })

  }
}
</script>