<script>
import listDocuments from '@/views/receivingManagement/orderChanges/listDocuments/index.vue';

export default {
  components: {listDocuments},
};
</script>

<template>
  <listDocuments :classAttribute="'finish_product'"></listDocuments>
</template>

