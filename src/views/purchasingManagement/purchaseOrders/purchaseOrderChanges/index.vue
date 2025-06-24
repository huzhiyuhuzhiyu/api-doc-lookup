<script>
import PurchaseOrderChange from '@/views/receivingManagement/orderChanges/index.vue';

export default {
  name: 'purchaseOrderChanges',
  components: {PurchaseOrderChange},
};
</script>

<template>
  <purchaseOrderChange :classAttribute="'other'"></purchaseOrderChange>
</template>

