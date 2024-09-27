<script>
export default {
    name: "SwitchListAndFilter",
    props:{
        fileExtFilterOption:{
            type:Array,
            default:()=>[]
        },
        currentExt:{
            type:String,
            default:''
        },
        switchList:{
            type:Boolean,
            default:false
        }
    },
    computed:{
        cSwitchList:{
            get(){
                return this.switchList
            },
            set(val){
                this.$emit('update:switchList',val)
            }
        },
        cCurrentExt:{
            get(){
                return this.currentExt
            },
            set(val){
                this.$emit('update:currentExt',val)
            }
        }
    }
}
</script>

<template>
    <div>
        <div style="display:flex;align-items:center;">
            <el-tooltip class="item" placement="top" effect="light" :content="cSwitchList? '图文模式':'列表模式' ">
                <i @click="cSwitchList = !cSwitchList"
                   style="margin-right: 3px" class="pointer iconfont"
                   :class="[cSwitchList ?  'icon-liebiao' : 'icon-pingpu' ]"/>
            </el-tooltip>
            <el-dropdown @command="$emit('command')">
                <el-link :style="{color: cCurrentExt !== ''? '#3fb9f8':'unset'}" icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"/>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                        :class="cCurrentExt === item.text
                                  ? 'dropdown-item-active'
                                  :''"
                        :command="item.text"
                        v-for="item in fileExtFilterOption"
                        :key="item.text">
                        <i style="font-size: 15px" class="iconfont" :class="item.icon"/>{{item.text}}
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>

<style scoped lang="scss">

</style>
