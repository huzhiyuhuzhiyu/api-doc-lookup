export default {
    data(){
        return {
            recreateFlag: false
        }
    },
    methods:{
       async recreate(){
            this.recreateFlag = false
            await this.$nextTick()
            this.recreateFlag = true
        },
    }
}
