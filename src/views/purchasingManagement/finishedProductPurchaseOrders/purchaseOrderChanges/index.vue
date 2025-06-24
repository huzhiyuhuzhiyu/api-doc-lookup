<script>
import PurchaseOrderChange from '@/views/receivingManagement/orderChanges/index.vue';

export default {
  name: 'purchaseOrderChangesFinished',
  components: {PurchaseOrderChange},
};
</script>

<template>
  <purchaseOrderChange :classAttribute="'finish_product'"></purchaseOrderChange>
</template>

