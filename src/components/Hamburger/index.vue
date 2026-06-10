<template>
  <div style="padding: 5px 15px;text-align:center;cursor:pointer" @click="toggleClick">
    <i class="icon-ym ys icon-ym-header-collapse1" v-if='isActive'></i>
    <i class="icon-ym ys icon-ym-header-expand" v-else></i>
  </div>
  <!-- <div style="padding: 10px 15px;text-align:center;cursor:pointer" @click="toggleClick" v-else>
    <i class="icon-ym icon-ym-header-collapse1 ym" v-if='isActive'></i>
    <i class="icon-ym icon-ym-header-expand ym" v-else></i>
  </div> -->
</template>

<script>
import jnpf from '@/utils/jnpf'
export default {
  name: 'Hamburger',
  props: {
    isActive: {
      type: Boolean,
      default: false
    },
  },
  computed: {
    slideClass() {
      return jnpf.storageGet('slideClass')
    }
  },
  methods: {
    toggleClick() {
      this.$emit('toggleClick')
    }
  }
}
</script>
<style scoped>
.icon-ym {
  font-size: 18px;
  color: #fff;
}

.ys {
  color: #fff;
}

</style>
<style lang="scss">
.classic .lightWhite,
.plain .lightWhite,
{
//   .icon-ym {
//   color: #1890ff;
// }
.ys {
  color: #1890ff !important;
}
}
</style>
