<template>
  <div class="JNPF-common-layout">
   
   

    <component :is="listPageComponent" v-if="depFormVisible" ref="depForm" @close="close" />
  </div>
</template>

<script>
import finish from "@/views/warehouseManagement/finishedProductWarehouseManagement/dbIncomAndOutInventory"
export default {
  name: 'quality',
  components:{finish},
  data() {
    return {
      
      listPageComponent:finish,
      depFormVisible:false,
    }
  },
  watch: {
  },
  created() {
    console.log(this);
    console.log(this.$route,this.$route.meta.modelId);

  },
  methods: {
   close(){

   },
    
  }
}
</script>

<style src="@/assets/scss/index-list.scss" lang="scss" scoped />