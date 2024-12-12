<template>
  <FileUploadWorkingInstruction
      :title="'客户产品工艺'"
      :flow-code="FlowCode.CUSTOMER_PRODUCT"
      :applicationType="ApplicationType.CUSTOMER_PRODUCT"
      :page-type="PageType.FileUploadCustomerProduct"
  ></FileUploadWorkingInstruction>
</template>

<script>


import ESOPConstantsMixin from "@/views/esop/utils/ESOPConstantsMixin";

export default {
  name: 'FileUploadCheckCustomerProduct',
    mixins: [ESOPConstantsMixin]

}
</script>
<style scoped>

</style>
