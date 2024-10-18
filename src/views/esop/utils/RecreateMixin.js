export default {
    data(){
        return {
            recreateFlag: false
        }
    },
    methods:{
        recreate(){
            this.recreateFlag = false
            this.$nextTick(() => {
                this.recreateFlag = true
            })
        },
    }
}
