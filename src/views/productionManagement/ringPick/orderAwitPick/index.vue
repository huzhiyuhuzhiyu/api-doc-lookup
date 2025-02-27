<template>
  <OrderAwitPick class-attribute="semi_finished" flowCode="b069"></OrderAwitPick>
</template>

<script>

import OrderAwitPick from '@/views/productionManagement/assemblyPick/orderAwitPick/index.vue';
export default {
    name: 'assemblyplanManagement',
    components: {OrderAwitPick},
    mixins: [],
    data() {
        return {}
    },


}
</script>
<style scoped>
::v-deep .all-select .cell .el-checkbox__inner {
    display: none;
}

.JNPF-common-search-box {
    padding: 8px 0 !important;
    margin-left: 0 !important;

    margin-bottom: 5px;
}
</style>

<style src="@/assets/scss/tabs-list.scss" lang="scss" scoped />
