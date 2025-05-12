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
            for (let key in row){
                data[index][key] = row[key]
            }
        },
        //   点击选择代号 带出属性
        selectProductSymbol(scope,dataFormTwo){
            this.currentProductId = scope.row.productsId || scope.row.productId
            this.productSymbolVisible = true
            this.$nextTick(() => {
                this.$refs.productSymbolForm.init(scope.$index,dataFormTwo)
            })
        },
    },
}
