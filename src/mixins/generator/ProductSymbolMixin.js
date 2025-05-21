export default {
    data() {
        return {
            currentProductId:'',
            productSymbolVisible:false,
        }
    },
    methods:{
        selectProductSymbolData(row,index,data){
            delete row.id
            delete row.productsId
            for (let key in row){
                this.$set(data[index], key, row[key])
                this.$set(data[index], 'productSymbol', row.code)
            }
        },
        //   点击选择代号 带出属性
        selectProductSymbol(scope,dataFormTwo){
            console.log(scope,'值')
            this.currentProductId = scope.row.productsId
            this.productSymbolVisible = true
            this.$nextTick(() => {
                this.$refs.productSymbolForm.init(scope.$index,dataFormTwo,scope.row.productsId)
            })
        },
    },
}
